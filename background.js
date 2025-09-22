const sfdcUrlExtensions = {
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
  }
};

chrome.commands.onCommand.addListener(function (command) {
  console.log('command: ' + command);

  if (command === 'goToThisObject') {
    goToThisObject();
    return;
  }

  const commandExtension = sfdcUrlExtensions[command];
  if (!commandExtension) {
    console.warn('Unknown command: ' + command);
    return;
  }
  goToUrl(commandExtension);
});

function goToUrl(commandExtension) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tabUrl = new URL(tabs[0].url);
    const baseUrl = tabUrl.origin;

    const isLightning = baseUrl.includes('lightning.force.com');
    const urlExtension = isLightning
      ? commandExtension.lightningUrl
      : commandExtension.url;
    const newURL = baseUrl + urlExtension;

    if (commandExtension.newTab) {
      chrome.tabs.create({ url: newURL });
    } else {
      chrome.tabs.update(tabs[0].id, { url: newURL });
    }
  });
}

function goToThisObject() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0].id;

    // Inject the DOM-manipulating code into the page
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: () => {
        // Step 1: Click the Setup button
        const setupButton = Array.from(document.querySelectorAll('a.menuTriggerLink'))
          .find(el => el.querySelector('span[role="tooltip"]')?.textContent.trim() === 'Setup');

        if (setupButton) {
          setupButton.click();
          console.log('Setup button clicked!');

          // Step 2: Wait for menu to render, then click Edit Object
          const clickEditObject = () => {
            const editObjectButton = Array.from(document.querySelectorAll('a[role="menuitem"]'))
              .find(el => el.querySelector('span.slds-align-middle')?.textContent.trim() === 'Edit Object');

            if (editObjectButton) {
              editObjectButton.click();
              console.log('Edit Object button clicked!');
            } else {
              // Retry if not found yet
              setTimeout(clickEditObject, 300);
            }
          };

          setTimeout(clickEditObject, 500); // initial delay
        } else {
          console.log('Setup button not found.');
        }
      }
    });
  });
}
