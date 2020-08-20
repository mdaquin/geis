chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({color: '#3aa757'}, function() {
	console.log("Hello, I'm alive now...");	
    });
});

var snippets = {};

var csplitters = [';','–','.',';',':','·','?','!',',','—', '▫']
	     // 100 most common words according to https://github.com/first20hours/google-10000-english/blob/master/google-10000-english-no-swears.txt except for a few which don't feel like stopwords (e.g. search)
var wsplitters = ["-", "it", "what",
    "the",
	     "of",
	     "and",
	     "to",
	     "a",
	     "in",
	     "for",
	     "is",
	     "on",
	     "that",
	     "by",
	     "this",
	     "with",
	     "i",
	     "you",
	     "it",
	     "not",
	     "or",
	     "be",
	     "are",
	     "from",
	     "at",
	     "as",
	     "your",
	     "all",
	     "have",
	     "new",
	     "more",
	     "an",
	     "was",
	     "we",
	     "will",
	     "home",
	     "can",
	     "us",
	     "about",
	     "if",
	     "page",
	     "my",
	     "has",
	     "but",
	     "our",
	     "one",
	     "other",
	     "do",
	     "no",
	     "they",
	     "site",
	     "he",
	     "up",
	     "may",
	     "what",
	     "which",
	     "their",
	     "news",
	     "out",
	     "use",
	     "any",
	     "there",
	     "see",
	     "only",
	     "so",
	     "his",
	     "when",
	     "contact",
	     "here",
	     "business",
	     "who",
	     "web",
	     "also",
	     "now",
	     "help",
	     "get",
	     "pm",
	     "view",
	     "online",
	     "c",
	     "e",
	     "first",
	     "am",
	     "been",
	     "would",
	     "how",
	     "were",
	     "me",
	     "s",
	     "some",
	     "these",
	     "its",
	     "like",
	     "x",
	     "than",
	     "find"
	    ];

function lastSentence(s){
    var ns = s;
    for (var i in csplitters){
	var a = ns.split(csplitters[i]);
	ns = a[a.length-1].trim();
    }
    for (var i in wsplitters){
	var a = ns.split(" "+wsplitters[i]+" ");
	ns = a[a.length-1].trim();
    }    
    return ns;
}

function firstSentence(s){
    var ns = s;
    for (var i in csplitters){
	var a = ns.split(csplitters[i]);
	ns = a[0].trim();
    }
    for (var i in wsplitters){
	var a = ns.split(" "+wsplitters[i]+" ");
	ns = a[0].trim();
    }    
    return ns;
}

function clean(s){
    return s.replace(/"/g,'').replace(/”/g, '').replace(/'/g, '').replace(/“/g, '');
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
	var url = new URL(tab.url);
	var c = url.searchParams.get("q");
	if (c && c.includes("*")){
	    var re = "";
	    if (!c.replace(/"/g, "").trim().startsWith('*')) re += ".*";
	    re += c.toLowerCase().replace(/\"/g, '').replace("*", "(.*)")
	    if (!c.replace(/"/g, "").trim().endsWith('*')) re += ".*";	    
	    console.log("one to look at::"+re);	    
	    var code = "t=[]; a=document.getElementsByClassName('s'); for(var e in a) {console.log(a[e].textContent); t.push(a[e].textContent);}; t";
	    chrome.tabs.executeScript(tabId, { code }, function (result) {
		for (var i in result[0]){
		    var snip = result[0][i];
		    if (snip) snip = snip.toLowerCase();
		    if (snip && snip.match(re)) {
			snip = snip.replace(new RegExp(re), "$1");
			if (c.replace(/"/g, "").trim().startsWith('*')) snip = lastSentence(snip);
			if (c.replace(/"/g, "").trim().endsWith('*')) snip = firstSentence(snip);
			snip=clean(snip);
			console.log(snip);
			if (!snippets[c.toLowerCase()]) snippets[c.toLowerCase()] = {};
			if (snippets[c.toLowerCase()][snip]) snippets[c.toLowerCase()][snip]++;
			else snippets[c.toLowerCase()][snip] = 1;
		    }
		}
		console.log(snippets);
	    });	
	}
    }
});
