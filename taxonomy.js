
var data = {"rows": {}, "deleted": {}, "relations": {}};
var lattrice;


document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("save").onclick = function(){save();}
    document.getElementById("import").onclick = function(){load();}
    update_display();
}, false);


function update_display(){
    var st ="<div><!--root attributes-->";
    var root = lattice.root();
    for (var x in root.attributes) st+= root.attributes[x]+" ";
    st+="</div>";
    for (var x in root.subconcepts) st += showConcept(root.subconcepts[x], false);
    document.getElementById("content").innerHTML = st;
}

function showConcept(c,canValidate){
    var st = "";
    st+='<div class="concept"><div class="concept_label"><span class="moveup">|_</span>';
    if (c.objects.length == 1) st+= "<strong>"+c.objects[0]+"</strong>";
    else {
	var name = ""
	for (var x in c.attributes) name+=c.attributes[x]+" ";
	st+=name;
	st+= "("+c.objects.length+') <span class="clickable" id="delete_'+name.replace(/ /g, "_")+'">delete</span>';
    }
    st+='</div><div class="subconcepts">';
    for (var x in c.subconcepts) st+=showConcept(c.subconcepts[x],false);
    st+='</div></div>';
    return st;
}

function boolArray(l){
    var results = [];
    for(var i =0; i < l; i++){
	results.push(false);
    }
    return results;
}

function listAttributes(l){
    var results = [];
    for(var x in data.rows[l].origins){
	var w = data.rows[l].origins[x].label.split(" ");
	for(var i in w) results.push(w[i]);
    }
    return results;
}

function createNewAttributes(a, attributes, matrix){
    attributes.push(a);
    for(var x in matrix) matrix[x].push(false);
}

function build_lattice(){
    var attributes = [];
    var objects = [];
    var matrix = [];
    for (var label in data.rows){
	objects.push(label);
	matrix.push(boolArray(attributes.length));
	var a = listAttributes(label);
	for(var aa in a){
	    if (!attributes.includes(a[aa])){
		createNewAttributes(a[aa], attributes, matrix);
	    }
	    matrix[matrix.length-1][attributes.indexOf(a[aa])]=true;
	}
    }
    lattice = new FormalContext(attributes, objects, matrix);
    console.log("build concepts");
    lattice.buildConcepts();
    console.log("taxonomy");
    lattice.buildTaxonomy();
    console.log("populate");
    lattice.populate();
    console.log("addLabels");
    lattice.addLabels();
    console.log(lattice.root());
}

function load(){
    var e = document.getElementById("fileinput");
    console.log(e.files[0]);
    var file = e.files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
	const contents = e.target.result;
	data = JSON.parse(contents);
	build_lattice();
	update_display();
    }
    reader.readAsText(file);
}
