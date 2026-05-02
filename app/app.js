import { resolveConversion } from './conversion.js';

const PROFILE_KEY = 'size-mapper-profile';

// -------------------------------------------------------------------------
// Data loading
// -------------------------------------------------------------------------

async function loadData() {
  const res = await fetch('./data/sizes.json');
  return res.json();
}

function loadProfile(data) {
  const stored = localStorage.getItem(PROFILE_KEY);
  if (stored) return JSON.parse(stored);
  const profile = {};
  for (const cat of Object.keys(data.categories)) profile[cat] = {};
  return profile;
}

function saveProfile(profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

// -------------------------------------------------------------------------
// DOM helpers
// -------------------------------------------------------------------------

function setOptions(select, entries, placeholder) {
  select.innerHTML = '';
  if (placeholder) {
    const opt = document.createElement('option');
    opt.value = ''; opt.textContent = placeholder;
    opt.disabled = true; opt.selected = true;
    select.appendChild(opt);
  }
  for (const [value, label] of entries) {
    const opt = document.createElement('option');
    opt.value = value; opt.textContent = label;
    select.appendChild(opt);
  }
}

// -------------------------------------------------------------------------
// Result rendering
// -------------------------------------------------------------------------

const MODE_LABELS = {
  'known-known':   { text: 'Based on your confirmed sizes',              cls: 'mode-confirmed' },
  'known-unknown': { text: 'Based on your confirmed size (chart for target)', cls: 'mode-partial'   },
  'unknown-unknown': { text: 'Size chart estimate — verify before buying', cls: 'mode-estimate'  },
};

function deltaClass(d) {
  const a = Math.abs(d);
  if (a === 0) return 'delta-exact';
  if (a <= 2)  return 'delta-close';
  if (a <= 5)  return 'delta-ok';
  return 'delta-far';
}

function fmtDelta(d) {
  return d === 0 ? '±0' : (d > 0 ? `+${d}` : `${d}`);
}

function renderResult(result, data, category, sourceBrand, sourceLabel) {
  const section = document.getElementById('result');
  const sourceSizes = data.categories[category].brands[sourceBrand].sizes[sourceLabel];
  const dimensions  = data.categories[category].dimensions;
  const mode        = MODE_LABELS[result.mode];

  const rows = dimensions.map(d => {
    const srcVal = sourceSizes[d];
    const tgtVal = result.measurements[d];
    const delta  = result.deltas[d];
    const missing = result.missingDimensions?.includes(d);

    if (srcVal == null) return '';
    if (missing || tgtVal == null) {
      return `<tr>
        <td>${d}</td>
        <td>${srcVal} cm</td>
        <td class="missing">—</td>
        <td>—</td>
      </tr>`;
    }
    return `<tr>
      <td>${d}</td>
      <td>${srcVal} cm</td>
      <td>${tgtVal} cm</td>
      <td class="${deltaClass(delta)}">${fmtDelta(delta)} cm</td>
    </tr>`;
  }).filter(Boolean).join('');

  const missingNote = result.missingDimensions?.length
    ? `<p class="missing-note">Some dimensions not published by this brand — check fit carefully.</p>`
    : '';

  section.innerHTML = `
    <div class="result-size">${result.size}</div>
    <span class="mode-badge ${mode.cls}">${mode.text}</span>
    <table class="measurements">
      <thead><tr><th>Dimension</th><th>You</th><th>Target</th><th>Δ</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    ${missingNote}
  `;
  section.hidden = false;
}

// -------------------------------------------------------------------------
// Profile section
// -------------------------------------------------------------------------

function renderProfile(data, profile) {
  const container = document.getElementById('profile-brands');
  container.innerHTML = '';

  for (const [catKey, cat] of Object.entries(data.categories)) {
    const section = document.createElement('div');
    section.className = 'profile-category';
    section.innerHTML = `<h3>${cat.label}</h3>`;

    for (const [brandKey, brand] of Object.entries(cat.brands)) {
      const confirmed = profile[catKey]?.[brandKey] ?? '';
      const sizes = Object.keys(brand.sizes);

      const row = document.createElement('div');
      row.className = 'profile-row';
      row.innerHTML = `
        <span class="profile-brand">${brand.name}</span>
        <select class="profile-size" data-category="${catKey}" data-brand="${brandKey}">
          <option value="">— not set —</option>
          ${sizes.map(s => `<option value="${s}"${s === confirmed ? ' selected' : ''}>${s}</option>`).join('')}
        </select>
      `;
      section.appendChild(row);
    }
    container.appendChild(section);
  }

  container.querySelectorAll('.profile-size').forEach(sel => {
    sel.addEventListener('change', () => {
      const cat = sel.dataset.category;
      const brand = sel.dataset.brand;
      if (!profile[cat]) profile[cat] = {};
      if (sel.value) {
        profile[cat][brand] = sel.value;
      } else {
        delete profile[cat][brand];
      }
      saveProfile(profile);
    });
  });
}

// -------------------------------------------------------------------------
// Main
// -------------------------------------------------------------------------

async function init() {
  const data    = await loadData();
  const profile = loadProfile(data);

  const categoryEl    = document.getElementById('category');
  const sourceBrandEl = document.getElementById('source-brand');
  const sourceSizeEl  = document.getElementById('source-size');
  const targetBrandEl = document.getElementById('target-brand');
  const convertBtn    = document.getElementById('convert-btn');
  const resultSection = document.getElementById('result');

  // Populate categories
  setOptions(categoryEl,
    Object.entries(data.categories).map(([k, v]) => [k, v.label]),
    'Select a category'
  );

  function resetResult() { resultSection.hidden = true; }

  function onCategoryChange() {
    const cat    = categoryEl.value;
    const brands = Object.entries(data.categories[cat]?.brands ?? {}).map(([k, v]) => [k, v.name]);
    setOptions(sourceBrandEl, brands, 'Brand');
    setOptions(sourceSizeEl,  [],     'Size');
    setOptions(targetBrandEl, brands, 'Brand');
    sourceBrandEl.disabled = false;
    sourceSizeEl.disabled  = true;
    targetBrandEl.disabled = false;
    convertBtn.disabled    = true;
    resetResult();
  }

  function onSourceBrandChange() {
    const cat   = categoryEl.value;
    const brand = sourceBrandEl.value;
    if (!brand) return;
    const sizes = Object.keys(data.categories[cat].brands[brand].sizes).map(s => [s, s]);
    setOptions(sourceSizeEl, sizes, 'Size');
    sourceSizeEl.disabled = false;
    convertBtn.disabled   = true;
    resetResult();
  }

  function checkReady() {
    const ready = categoryEl.value && sourceBrandEl.value &&
                  sourceSizeEl.value && targetBrandEl.value;
    convertBtn.disabled = !ready;
    if (!sourceSizeEl.value || !targetBrandEl.value) resetResult();
  }

  categoryEl.addEventListener('change', onCategoryChange);
  sourceBrandEl.addEventListener('change', () => { onSourceBrandChange(); checkReady(); });
  sourceSizeEl.addEventListener('change', checkReady);
  targetBrandEl.addEventListener('change', checkReady);

  convertBtn.addEventListener('click', () => {
    const cat      = categoryEl.value;
    const srcBrand = sourceBrandEl.value;
    const srcSize  = sourceSizeEl.value;
    const tgtBrand = targetBrandEl.value;

    if (srcBrand === tgtBrand) {
      resultSection.innerHTML = '<p class="error">Source and target brand must be different.</p>';
      resultSection.hidden = false;
      return;
    }

    const result = resolveConversion(data, profile, cat, srcBrand, srcSize, tgtBrand);
    if (!result) {
      resultSection.innerHTML = '<p class="error">No match found. The target brand may not have data for this category.</p>';
      resultSection.hidden = false;
      return;
    }
    renderResult(result, data, cat, srcBrand, srcSize);
  });

  // Profile toggle
  const profileToggle = document.getElementById('profile-toggle');
  const profileBody   = document.getElementById('profile-body');
  const toggleIcon    = profileToggle.querySelector('.toggle-icon');

  profileToggle.addEventListener('click', () => {
    profileBody.hidden = !profileBody.hidden;
    toggleIcon.classList.toggle('open', !profileBody.hidden);
  });
  profileToggle.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') profileToggle.click();
  });

  renderProfile(data, profile);
}

init();
