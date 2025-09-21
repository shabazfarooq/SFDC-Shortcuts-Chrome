var currentSfdcTabBaseUrl;

var sfdcUrlExtensions = {
  goToSfdcDevConsole: {
    url: '/_ui/common/apex/debug/ApexCSIPage',
    lightningUrl: '/_ui/common/apex/debug/ApexCSIPage',
    newTab: true
  },
  goToSfdcSetup: {
    url: '/setup/forcecomHomepage.apexp?setupid=ForceCom&retURL=%2Fhome%2Fhome.jsp',
    lightningUrl: '/lightning/setup/SetupOneHome/home',
    newTab: true
  },
  goToSfdcObjects: {
    url: '/setup/forcecomHomepage.apexp?setupid=ForceCom&retURL=%2Fhome%2Fhome.jsp',
    lightningUrl: '/lightning/setup/ObjectManager/home',
    newTab: true
  },
  goToSfdcClasses: {
    url: '/01p?retURL=%2Fui%2Fsetup%2FSetup%3Fsetupid%3DDevToolsIntegrate&setupid=ApexClasses',
    lightningUrl: '/lightning/setup/ApexClasses/home',
    newTab: true
  },
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

    goToUrl(commandExtension);
  }
);

function goToUrl(commandExtension){
  // Validate that the currentTabUrl exists
  if(!currentSfdcTabBaseUrl){
    alert('Missing current tab url? ' + currentSfdcTabBaseUrl);
    return;
  }

  // Build new URL based off current page being lighting or classic
  var urlExtension = currentSfdcTabBaseUrl.endsWith('lightning.force.com') 
    ? commandExtension.lightningUrl
    : commandExtension.url;

  var newURL = currentSfdcTabBaseUrl + urlExtension;

  // Open URL in new tab
  if(commandExtension.newTab){
    window.open(newURL, '_blank');
  }
  // Open URL in current tab
  else{
    chrome.tabs.query(
      {active: true, currentWindow: true},
      function(arrayOfTabs){
        var activeTab = arrayOfTabs[0];
        var activeTabId = activeTab.id;
        chrome.tabs.update(activeTabId, {url: newURL});
      }
    );
  }
}
