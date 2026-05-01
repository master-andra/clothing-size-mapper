// DOM and UI logic — to be built in plan.md step 1.4
// Calls functions from conversion.js, renders results to the page.
import { convertSize } from './conversion.js';

async function init() {
  const res = await fetch('../data/sizes.json');
  const data = await res.json();
  // TODO: wire up UI
  console.log('Size data loaded', data);
}

init();
