
data = {"rows": {}, "deleted": {}};

// 100 most common words according to https://github.com/first20hours/google-10000-english/blob/master/google-10000-english-no-swears.txt except for a few which don't feel like stopwords (e.g. search)
var stopwords = ["it", "what",
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
		 "find",
		 "thus",
		 "where",
		 "used",
		 "thats",
		 "tailored",
		 "could",
		 "achieve",
		 "into"
	    ];


build_initial();

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("save").onclick = function(){save();}
    document.getElementById("import").onclick = function(){importList();}
    update_display();
}, false);

function removeSW(s){
    var result = s;
    for(var x in stopwords){
	result = result.replace(new RegExp(" "+stopwords[x]+" "), " ").trim();
	result = result.replace(new RegExp("^"+stopwords[x]+" "), " ").trim();
	result = result.replace(new RegExp(" "+stopwords[x]+"$"), " ").trim();
    }
    return result; 
}

function build_initial(){
    // build structure with label, total count, origins (count and label there)    
    var background = chrome.extension.getBackgroundPage();
    for (var q in background.snippets){
	var snippet = background.snippets[q];
	for (var t in snippet){
	    var tt = removeSW(t);
	    if (!data.rows[tt]) data.rows[tt] = {"total": 0, "origins": []}
	    data.rows[tt].total += snippet[t];
	    data.rows[tt].origins.push({"query": q, "label": t, "count": snippet[t]});
	}
    }
}

function update_display(){
    st = "";
    for (var t in data.rows){
	var term = data.rows[t];
	st+='<div class="row"><span class="label">'+t+'</span><select class="to_merge" id="dds_'+t+'"></select><span class="clickable" id="merge1_'+t+'">merge keeping this row\'s label</span><span class="clickable" id="merge2_'+t+'">merge keeping the other label</span><span class="clickable" id="delete_'+t+'">delete</span></div>';
    }
    document.getElementById("content").innerHTML=st;
    document.getElementById("number").innerHTML = Object.keys(data.rows).length+" labels";
    for (var t in data.rows){
	(function(t){
	    document.getElementById("delete_"+t).onclick = function () {delete_r(t);}
	    document.getElementById("dds_"+t).onclick = function () {similar(t);}
	    document.getElementById("merge1_"+t).onclick = function () {merge(t,document.getElementById('dds_'+t).value);}
	    document.getElementById("merge2_"+t).onclick = function () {merge(document.getElementById('dds_'+t).value, t);}	    
	})(t)
    }
}

function similar(o){
    if (document.getElementById("dds_"+o).innerHTML!="") return;    
    console.log("getting similar labels as "+o);
    var a = [];
    for (k in data.rows){
	if (k!=o) a.push([k,ld(k,o)]);
    }
    a.sort(function(first, second) {
	return first[1] - second[1];
    }, reverse=true);
    st = "";
    for(var k in a){
	st += '<option value="'+a[k][0]+'">'+a[k][0]+'</option>';
    }
    document.getElementById("dds_"+o).innerHTML=st;
}

function merge(o1,o2){
    for (var i in data.rows[o2].origins){
	data.rows[o1].origins.push(data.rows[o2].origins[i]);
    }
    delete data.rows[o2];
    update_display();
}

function delete_r(k){
    data.deleted[k] = data.rows[k];
    delete data.rows[k];
    update_display();
}

function save(){
    var tosave = JSON.stringify(data);
    var file = new Blob([tosave], {type: "application.json"});
    var filename = "geis_"+Date.now()+".json";
    if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(file, filename);
    } else { 
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}


function ld(a, b){
    if(a.length == 0) return b.length; 
    if(b.length == 0) return a.length; 
    
    var matrix = [];
    
    // increment along the first column of each row
    var i;
    for(i = 0; i <= b.length; i++){
        matrix[i] = [i];
    }
    
    // increment each column in the first row
    var j;
    for(j = 0; j <= a.length; j++){
        matrix[0][j] = j;
    }
    
    // Fill in the rest of the matrix
    for(i = 1; i <= b.length; i++){
        for(j = 1; j <= a.length; j++){
            if(b.charAt(i-1) == a.charAt(j-1)){
                matrix[i][j] = matrix[i-1][j-1];
            } else {
                matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                                        Math.min(matrix[i][j-1] + 1, // insertion
                                                 matrix[i-1][j] + 1)); // deletion
            }
        }
    }   
    return matrix[b.length][a.length];
}


function importList(){
    var e = document.getElementById("fileinput");
    console.log(e.files[0]);
    var file = e.files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
	const contents = e.target.result;
	var labels = contents.split("\n");
	for(var x in labels){
	    var l = labels[x].toLowerCase().trim(); 
	    if (!data.rows[l]) data.rows[l] = {"total": 0, "origins": []}
	    data.rows[l].total += 1;
	    data.rows[l].origins.push({"file": file.name, "label": l, "count": 1});
	}
	update_display();
    }
    reader.readAsText(file);
}
