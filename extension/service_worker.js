// Allows the side panel to open when clicking the extension action toolbar icon
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));
