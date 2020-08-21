
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
    // save as json the all data object
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
