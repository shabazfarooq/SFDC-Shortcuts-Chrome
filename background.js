var currentSfdcTabBaseUrl;

var sfdcUrlExtensions = {
  setup: '/setup/forcecomHomepage.apexp?setupid=ForceCom&retURL=%2Fhome%2Fhome.jsp',
  pages: '/apexpages/setup/listApexPage.apexp?retURL=%2Fui%2Fsetup%2FSetup%3Fsetupid%3DDevToolsIntegrate&setupid=ApexPages',
  classes: '/01p?retURL=%2Fui%2Fsetup%2FSetup%3Fsetupid%3DDevToolsIntegrate&setupid=ApexClasses'
};

// Grab base URL from content.js
chrome.runtime.onMessage.addListener(
  function(url, sender, sendResponse){
    currentSfdcTabBaseUrl = url;
  }
);

// Listen for goToSfdcSetup hotkey defined in manifest.json
chrome.commands.onCommand.addListener(
  function(command){
    if(command === "goToSfdcSetup"){
      updateCurrentTab(sfdcUrlExtensions.setup);
    }
    else if(command === "goToSfdcPages"){
      updateCurrentTab(sfdcUrlExtensions.pages);
    }
    else if(command === "goToSfdcClasses"){
      updateCurrentTab(sfdcUrlExtensions.classes);
    }
  }
);

function updateCurrentTab(urlExtension){
  // Validate that the currentTabUrl exists
  if(!currentSfdcTabBaseUrl){
    alert('Missing current tab url? ' + currentSfdcTabBaseUrl);
    return;
  }

  // Update tab url
  chrome.tabs.query(
    {active: true, currentWindow: true},
    function(arrayOfTabs){
      var activeTab = arrayOfTabs[0];
      var activeTabId = activeTab.id;
      chrome.tabs.update(activeTabId, {url: currentSfdcTabBaseUrl + urlExtension});
    }
  );
}
