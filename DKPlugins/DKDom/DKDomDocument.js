// https://developer.mozilla.org/en-US/docs/Web/API/Document

////////////////////////////////
var Document = function(pointer)
{
	// Properties
	Object.defineProperty(this, "body", { 
		get: function(){ 
			var pointer = DKDomDocument_body();
			if(!pointer){ return; }
			var element = new HTMLElement(pointer);
			return element;
		},
		set: function(){
			if(!pointer){ return; }
			return DKDomDocument_body(pointer); //TODO
		} 
	});
	Object.defineProperty(this, "documentElement", { 
		get: function(){ 
			var pointer = DKDomDocument_documentElement();
			if(!pointer){ return; }
			var element = new HTMLElement(pointer);
			return element;
		} 
	});
	
	
	// Methods
	Document.prototype.createElement = function(tag){
		var pointer = DKDomDocument_createElement(tag);
		if(!pointer){ return; }
		var element = new HTMLElement(pointer);
		return element;
	}
	Document.prototype.getElementById = function(id){
		var pointer = DKDomDocument_getElementById(id);
		if(!pointer){ return; }
		var element = new HTMLElement(pointer);
		return element;
	}
	Document.prototype.getElementsByTagName = function(tag){
		var pointers = DKDomDocument_getElementsByTagName(tag);
		if(!pointers){ return; }
		var elements = new HTMLCollection(pointers);
		return elements;
	}
	
	Node.call(this, pointer);
}

Document.prototype = Node.prototype;	
var document = new Document("document");  //Create the global document object