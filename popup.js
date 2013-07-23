chrome.tabs.getSelected(null,function(tab) {
	var getLocation = function(href) {
	    var l = document.createElement("a");
	    l.href = href;
	    return l;
	},
		theUrl = getLocation(tab.url).hostname;
	
	$('#loading span').text(theUrl);
	
	getWhoIs(theUrl);
});

function getWhoIs(url) {
	console.log("Getting WHOISsss for : "+url);
	makeReq('http://whothefuck.ru/p/?whois='+encodeURIComponent(url), processWhoIs);
}

function makeReq(url, callback) {
	console.log("making request to : "+url);
	var req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.onload = callback;
    req.send(null);
}

function processWhoIs(e) {
	var respHtml = e.target.responseText,
		respObj = $('<html/>').html(respHtml);
	
	renderResults({
		registrar 	: getBox(respObj, 'Registrar').text().trim(),
		dates		: parseDates(getBox(respObj, 'Important Dates').text())
	});
}

function getBox(dom, boxName) {
	var box = $(dom).find('h2').filter(function() {
		return $(this).text() == boxName;
	}).parent();
	box.find('h2').remove();
	return box;
}

function parseDates(datesString) {
	return {
		created : /Created: ([0-9\-]*)/.exec(datesString)[1],
		modified : /Changed: ([0-9\-]*)/.exec(datesString)[1],
		expires : /Expires: ([0-9\-]*)/.exec(datesString)[1],
	};
}

function renderResults(res) {
	console.log(res);
	
	var req = new XMLHttpRequest();
	req.open("GET", chrome.extension.getURL('template.html'), true);
	req.onload = function(e) {
        var tb = Mustache.to_html(req.responseText,res);
        $('#loading').hide()
        $('#results').html(tb).show(200);
	};
	req.send(null);
}