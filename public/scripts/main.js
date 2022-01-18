import { development } from './dev.js';
import { snippets } from './snippets.js';

document.addEventListener('DOMContentLoaded', run);

/**
 * @param {Event} event
 */
function run() {
  console.info('running...');
  development();
  snippets();
}
