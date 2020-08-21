
data = {"rows": {}, "deleted": {}};

build_initial();
document.addEventListener('DOMContentLoaded', function() {
    update_display();
}, false);


function build_initial(){
    // build structure with label, total count, origins (count and label there)    
    var background = chrome.extension.getBackgroundPage();
    for (var q in background.snippets){
	var snippet = background.snippets[q];
	for (var t in snippet){
	    if (!data.rows[t]) data.rows[t] = {"total": 0, "origins": []}
	    data.rows[t].total += snippet[t];
	    data.rows[t].origins.push({"query": q, "label": t, "count": snippet[t]});
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
    for (var t in data.rows){
	(function(t){document.getElementById("delete_"+t).onclick = function () {delete_r(t);}})(t)
    }
}

function similar(o){
    // go through all rows and calculate similarities between all labels. Results is max sim by pairs.
    // return a ranked list
}

function merge(o1,o2){
    // integrate o2 into o1 and remove o2
}

function delete_r(k){
    data.deleted[k] = data.rows[k];
    delete data.rows[k];
    update_display();
}

function save(){
    // save as json the all data object
}
