var currentSfdcTabBaseUrl;

var sfdcUrlExtensions = {
  goToSfdcSetup: {
    url: '/setup/forcecomHomepage.apexp?setupid=ForceCom&retURL=%2Fhome%2Fhome.jsp',
    newTab: false
  },
  goToSfdcPages: {
    url: '/apexpages/setup/listApexPage.apexp?retURL=%2Fui%2Fsetup%2FSetup%3Fsetupid%3DDevToolsIntegrate&setupid=ApexPages',
    newTab: false
  },
  goToSfdcClasses: {
    url: '/01p?retURL=%2Fui%2Fsetup%2FSetup%3Fsetupid%3DDevToolsIntegrate&setupid=ApexClasses',
    newTab: false
  },
  goToSfdcDevConsole: {
    url: '/_ui/common/apex/debug/ApexCSIPage',
    newTab: true
  }
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
    var commandExtension = sfdcUrlExtensions[command];

    // Validate command exists in sfdcUrlExtensions
    if(!commandExtension){
      alert('Unknown command ' + commandExtension + '. Add to sfdcUrlExtensions.');
      return;
    }

    goToUrl(commandExtension.url, commandExtension.newTab);
  }
);

function goToUrl(urlExtension, newTab){
  // Validate that the currentTabUrl exists
  if(!currentSfdcTabBaseUrl){
    alert('Missing current tab url? ' + currentSfdcTabBaseUrl);
    return;
  }

  // // New URL
  var newURL = currentSfdcTabBaseUrl + urlExtension;

  // // Open URL in new tab
  if(newTab){
    window.open(newURL, '_blank');
  }
  // Open URL in current tab
  else{
    chrome.tabs.query(
      {active: true, currentWindow: true},
      function(arrayOfTabs){
        var activeTab = arrayOfTabs[0];
        var activeTabId = activeTab.id;
        chrome.tabs.update(activeTabId, {url: currentSfdcTabBaseUrl + urlExtension});
      }
    );
  }
}
