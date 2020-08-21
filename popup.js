var background = chrome.extension.getBackgroundPage();

display();

goahead = document.getElementById("phase1_go_button");
goahead.onclick = function(element) {
    chrome.tabs.create({ url: "refine.html" });
};


function display(){
    var st = "";
    var count = 0;
    var labels = []
    for(var x in background.snippets){
	snips = background.snippets[x];
	st += '<h2 id="h2_'+count+'">'+x+' <span class="clickable" id="clear_'+count+'">clear</span> <span class="clickable" id="save_'+count+'">save</span></h2>';
	
	st += '<div id="div_'+count+'">';
	for(snip in snips){
	    st+=snip+"("+snips[snip]+") ";
	}
	st += '</div>';
	labels.push(x);
	count++;
    }    
    document.getElementById("content").innerHTML = st;
    for (var c = 0; c<count; c++){
	(function(c){
	    document.getElementById("clear_"+c).onclick = function(){clear(labels,c)}
	    document.getElementById("save_"+c).onclick = function(){save(labels,c)}	    
	})(c)
    }
}

function clear(labels, c){
    delete background.snippets[labels[c]];
    document.getElementById("h2_"+c).remove();
    document.getElementById("div_"+c).remove();    
    console.log("cleared "+c);
}

function save(labels,c){
    console.log("saving "+labels[c]);
    var list = background.snippets[labels[c]];
    data = "entity, count\n"
    for(var x in list){
	data+=x+","+list[x]+"\n";
    }
    var file = new Blob([data], {type: "text/csv"});
    var filename = labels[c].replace("*", "").replace("(", "").replace(")","")+".csv";
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

