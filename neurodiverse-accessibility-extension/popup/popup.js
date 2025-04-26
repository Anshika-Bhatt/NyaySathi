document.addEventListener('DOMContentLoaded', async () => {
  // Load current settings
  const settings = await chrome.storage.sync.get([
    'dyslexiaMode', 
    'colorBlindMode',
    'usageStats'
  ]);
  
  // Set up suggestion button
  document.getElementById('personalizeBtn').addEventListener('click', async () => {
    const suggestionsEl = document.getElementById('suggestions');
    suggestionsEl.style.display = 'block';
    suggestionsEl.innerHTML = '<div class="loading-spinner"></div> Analyzing...';

    try {
      const response = await fetch('http://localhost:3000/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usageStats: settings.usageStats,
          currentModes: {
            dyslexia: settings.dyslexiaMode,
            colorBlind: settings.colorBlindMode
          }
        })
      });

      if (!response.ok) throw new Error('API error');
      const { suggestions } = await response.json();
      
      suggestionsEl.innerHTML = `
        <h4>Recommended Settings</h4>
        <div class="suggestion-item">${suggestions.replace(/\n/g, '</div><div class="suggestion-item">')}</div>
      `;
    } catch (error) {
      suggestionsEl.innerHTML = `
        <p class="error">Suggestions unavailable</p>
        <button id="retry-btn">Retry</button>
      `;
      document.getElementById('retry-btn').addEventListener('click', () => 
        document.getElementById('personalizeBtn').click());
    }
  });
});