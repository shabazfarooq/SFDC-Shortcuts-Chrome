/**
 * Pass current tab base URL to background.js
 */
 chrome.runtime.sendMessage(window.location.origin);


/**
 * Handle page specific functionalities
 */
switch(window.location.pathname) {
  // Lightning Setup page
  // Do: Set focus on search bar
  case '/lightning/setup/SetupOneHome/home':
    // setTimeout(()=> document.getElementsByClassName('filter-box input')[0].focus(), 2000);
    break;

  // Lightning Object Manager page
  // Do: Set focus on search bar
  case '/lightning/setup/ObjectManager/home':
    // setTimeout(()=> document.getElementById('globalQuickfind').focus(), 2000);
    break;
}
