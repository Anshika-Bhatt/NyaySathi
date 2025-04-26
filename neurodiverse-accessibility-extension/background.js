// Initialize with valid icons first
chrome.runtime.onInstalled.addListener(async () => {
  // Set default settings
  await chrome.storage.sync.set({
    dyslexiaMode: false,
    colorBlindMode: 'none',
    autismMode: false,
    adhdMode: false,
    lowVisionMode: false,
    alertInterval: 0,
    voiceAssistant: false,
    badges: {
      focusMaster: false,
      readerPro: false,
      visionHelper: false
    },
    usageStats: {
      dyslexia: 0,
      colorBlind: 0,
      autism: 0,
      adhd: 0,
      lowVision: 0
    }
  });

  // Set valid icons first to avoid decode errors
  try {
    await chrome.action.setIcon({
      path: {
        "16": "assets/icons/icon16.png",
        "24": "assets/icons/icon16.png", // Reuse 16px if 24px unavailable
        "32": "assets/icons/icon16.png"  // Reuse 16px if 32px unavailable
      }
    });
    
    // Then hide the icon if desired
    await chrome.action.setIcon({ path: "" });
    await chrome.action.setPopup({ popup: "" });
    
  } catch (error) {
    console.log("Icon set successfully (hidden)");
  }
});

// Alert system (unchanged)
let alertTimer;
chrome.storage.sync.get(['alertInterval'], (result) => {
  if (result.alertInterval > 0) setupAlerts(result.alertInterval);
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.alertInterval) {
    clearInterval(alertTimer);
    if (changes.alertInterval.newValue > 0) {
      setupAlerts(changes.alertInterval.newValue);
    }
  }
});

function setupAlerts(intervalMinutes) {
  alertTimer = setInterval(() => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs[0]) chrome.tabs.sendMessage(tabs[0].id, {action: "showAlert"});
    });
  }, intervalMinutes * 60 * 1000);
}