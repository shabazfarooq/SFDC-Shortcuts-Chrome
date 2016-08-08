// Get current tabs base URL
// Background.js will listen to this message
chrome.runtime.sendMessage(window.location.origin);

// Set focus on search element
var searchInputFieldElement = document.getElementsByClassName('quickFindInput version2');
if(searchInputFieldElement && searchInputFieldElement.length){
  searchInputFieldElement[0].focus();
}
