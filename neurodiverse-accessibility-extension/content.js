// Apply all accessibility modes
function applyModes(modes) {
  // Reset all first
  document.body.classList.remove(
    'dyslexia-mode', 
    'protanopia-mode',
    'deuteranopia-mode',
    'autism-mode',
    'adhd-mode',
    'low-vision-mode'
  );

  // Dyslexia Mode
  if (modes.dyslexiaMode) {
    document.body.classList.add('dyslexia-mode');
    const fontFace = new FontFace('OpenDyslexic', 
      'url("' + chrome.runtime.getURL('assets/fonts/OpenDyslexic-Regular.woff') + '")');
    
    fontFace.load().then(() => {
      document.fonts.add(fontFace);
      document.body.style.fontFamily = 'OpenDyslexic, sans-serif';
    });
  }

  // Color Blind Modes
  if (modes.colorBlindMode === 'protanopia') {
    document.body.classList.add('protanopia-mode');
    addColorFilter('protanopia');
  } else if (modes.colorBlindMode === 'deuteranopia') {
    document.body.classList.add('deuteranopia-mode');
    addColorFilter('deuteranopia');
  }

  // Other modes...
}

// Helper for color filters
function addColorFilter(type) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.innerHTML = `
    <filter id="${type}" color-interpolation-filters="sRGB">
      <feColorMatrix type="matrix" values="
        0.567 0.433 0 0 0
        0.558 0.442 0 0 0
        0 0.242 0.758 0 0
        0 0 0 1 0
      "/>
    </filter>
  `;
  document.body.appendChild(svg);
}

// Listen for mode changes
chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "applyModes") applyModes(request.modes);
});

// Initialize with current modes
chrome.storage.sync.get([
  'dyslexiaMode', 
  'colorBlindMode',
  'autismMode',
  'adhdMode',
  'lowVisionMode'
], (result) => {
  applyModes({
    dyslexiaMode: result.dyslexiaMode,
    colorBlindMode: result.colorBlindMode,
    autismMode: result.autismMode,
    adhdMode: result.adhdMode,
    lowVisionMode: result.lowVisionMode
  });
});