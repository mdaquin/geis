

class BinaryVector {
    // create the binary vector from an array of booleans
    constructor(bv){
	this._representation = []
	this.size = Math.ceil(bv.length/32.0);
        for (var i = 0; i < this.size; i++) this._representation.push(0);
        for (var i in bv){
	    if (bv[i]){
                var i1 = Math.floor(i/32);
                var i2 = i - i1*32;
	        this._representation[i1] = this._representation[i1] | 1 << i2;
            }
        }	
    }
    equals(bv){
	if (bv.size!=this.size) return false;
	for(var i in this._representation)
	    if (this._representation[i] != bv._representation[i]) return false;
	return true;
    }
    intersection(bv){
	var re = new BinaryVector([]);
	re.size = Math.max(this.size, bv.size);
	for (var i=0; i < re.size; i++) re._representation.push(0);
	for (var i=0; i <  Math.min(this.size, bv.size); i++)
	    re._representation[i] = this._representation[i]&bv._representation[i];
	return re;
    }
    union(bv){
	var re = new BinaryVector([]);
	re.size = bv.size;
	var largest = bv;
	if (this.size > bv.size){
	    re.size = this.size;
	    largest = this;
	}
	for (var i=0; i < re.size; i++) re._representation.push(largest[i]);
	for (var i=0; i <  Math.min(this.size, bv.size); i++)
	    re._representation[i] = this._representation[i]|bv._representation[i];
	return re;
    }
    difference(bv){
	var re = new BinaryVector([]);
	re.size = Math.max(this.size, bv.size);
	for (var i=0; i < re.size; i++) re._representation.push(0);
	for (var i=0; i <  Math.min(this.size, bv.size); i++)
	    re._representation[i] = this._representation[i] & ~bv._representation[i];
	return re;	
    }
    // this does not work as it also inverts
    // the padding 0s that are not part of the representaion
    invert(){
	var re = new BinaryVector([]);
	re.size = this.size;
	for (var i in this._representation){
	    re._representation.push(~this._representation[i]);
	}
	return re;
    }
    get(i){
	var i1 = Math.floor(i/32);
        var i2 = i - i1*32;
        return ((this._representation[i1] & (1 << i2)) != 0);
    }
    toString(){
	var re = "";
	for (var i in this._representation){
	    re += this._representation[i].toString(2).padStart(32, 0).split("").reverse().join("");
	}
	return re;
    }
}
