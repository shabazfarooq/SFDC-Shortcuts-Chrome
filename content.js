/**
 * TODO: 
 * - Wait until the search bar becomes available
 *   -- Capture URL and only do this if the URL is correct
 *   -- Switch on lightning or classic
 *   -- Implement solution for Lightning
 */

// Get current tabs base URL
// Background.js will listen to this message
chrome.runtime.sendMessage(window.location.origin);

// Set focus on search element
var searchInputFieldElement = document.getElementsByClassName('quickFindInput version2');
if(searchInputFieldElement && searchInputFieldElement.length){
  searchInputFieldElement[0].focus();
}
else {
  var searchInputFieldElement_lightning = document.getElementsByClassName('filter-box input');

  if(searchInputFieldElement_lightning && searchInputFieldElement_lightning.length){
    searchInputFieldElement_lightning[0].focus();
  }
}
