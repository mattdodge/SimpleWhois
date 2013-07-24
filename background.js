chrome.omnibox.onInputChanged.addListener(
  function(text, suggest) {
	  chrome.omnibox.setDefaultSuggestion({
			description : 'Lookup WHOIS for ' + text
		});
  });

// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener(
  function(text) {
	  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	    chrome.tabs.update(tabs[0].id, {
	    	url: 'http://whothefuck.ru/w/' + text
	    });
	  });
  });