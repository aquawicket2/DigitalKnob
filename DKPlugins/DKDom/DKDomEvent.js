//https://developer.mozilla.org/en-US/docs/Web/API/Event

//event_instances = [];
/////////////////////////////
var Event = function(pointer) //https://developer.mozilla.org/en-US/docs/Web/API/Event/Event
{
	this.pointer = pointer;
	
	//Properties
	Object.defineProperty(this, "bubbles", { //Read Only
		get: function(){ return DKCPP_DKDomEvent_bubbles(pointer); } 
	});
	Object.defineProperty(this, "cancelBubble", {
		set: function(flag){ 
			return DKCPP_DKDomEvent_cancelBubble(pointer, flag);
		}
	});
	Object.defineProperty(this, "cancelable", {
		get: function(){ return DKCPP_DKDomEvent_cancelable(pointer); }
	}); //Read Only
	Object.defineProperty(this, "composed", {
		get: function(){ return DKCPP_DKDomEvent_composed(pointer); }
	}); //Read Only
	Object.defineProperty(this, "currentTarget", {
		get: function(){ 
			var elementPointer = DKCPP_DKDomEvent_currentTarget(pointer);
			if(!elementPointer){ return; }
			return new HTMLElement(elementPointer);
		} 
	}); //Read Only
	Object.defineProperty(this, "deepPath", {
		get: function(){ return DKCPP_DKDomEvent_deepPath(pointer); } 
	}); //Not standardized
	Object.defineProperty(this, "defaultPrevented", {
		get: function(){ return DKCPP_DKDomEvent_defaultPrevented(pointer); } 
	}); //Read Only
	Object.defineProperty(this, "eventPhase", {
		get: function(){ return DKCPP_DKDomEvent_eventPhase(pointer); } 
	}); //Read Only
	Object.defineProperty(this, "explicitOriginalTarget", {
		get: function(){ return DKCPP_DKDomEvent_explicitOriginalTarget(pointer); } 
	}); //Not standardized, Read Only
	Object.defineProperty(this, "originalTarget", {
		get: function(){ return DKCPP_DKDomEvent_originalTarget(pointer); } 
	}); //Not standardized, Read only
	Object.defineProperty(this, "returnValue", {
		get: function(){ return DKCPP_DKDomEvent_returnValue(pointer); } 
	});
	Object.defineProperty(this, "srcElement", { //Not standardized
		get: function(){ 
			var elementPointer = DKCPP_DKDomEvent_srcElement(pointer);
			if(!elementPointer){ return; }
			return new HTMLElement(elementPointer);
		} 
	}); //Read Only
	Object.defineProperty(this, "target", { //Read Only
		get: function(){ 
			var elementPointer = DKCPP_DKDomEvent_target(pointer);
			if(!elementPointer){ return; }
			return new HTMLElement(elementPointer);
		} 
	}); //Read Only
	Object.defineProperty(this, "timeStamp", {
		get: function(){ return DKCPP_DKDomEvent_timeStamp(pointer); } 
	}); //Read Only
	Object.defineProperty(this, "type", {
		get: function(){ return DKCPP_DKDomEvent_type(pointer); },
	}); //Read Only
	Object.defineProperty(this, "isTrusted", {
		get: function(){ return DKCPP_DKDomEvent_isTrusted(pointer); } 
	}); //Read Only
	
	//Obsolete properties
	Object.defineProperty(this, "scoped", {
		get: function(){ return DKCPP_DKDomEvent_scoped(pointer); } 
	}); //Read Only, Obsolete
	
	
	//Methods
	Event.prototype.createEvent = function(){ //Deprecated
		DKCPP_DKDomEvent_createEvent(pointer);
	};
	Event.prototype.composedPath = function(){
		DKCPP_DKDomEvent_composedPath(pointer);
	};
	Event.prototype.initEvent = function(){ //Deprecated
		DKCPP_DKDomEvent_initEvent(pointer);
	};
	Event.prototype.preventDefault = function(){
		DKCPP_DKDomEvent_preventDefault(pointer);
	};
	Event.prototype.stopImmediatePropagation = function(){
		DKCPP_DKDomEvent_stopImmediatePropagation(pointer);
	};
	Event.prototype.stopPropagation = function(){
		DKCPP_DKDomEvent_stopPropagation(pointer);
	};
	
	//Obsolete methods
	Event.prototype.getPreventDefault = function(){ //Not standardized
		DKCPP_DKDomEvent_getPreventDefault(pointer);
	};
	Event.prototype.preventBubble = function(){ //Not standardized, Obsolete
		DKCPP_DKDomEvent_preventBubble(pointer);
	};
	Event.prototype.preventCapture = function(){ //Not standardized, Obsolete
		DKCPP_DKDomEvent_preventCapture(pointer);
	};
	
	//console.log("dispatching event");
	//this.currentTarget.dispatchEvent(this);
	//return this;
};


// Called from C++ RmlUI to send events
///////////////////////////////
function DispatchEvent(pointer)
{
	var event = new Event(pointer);
	//console.log("DispatchEvent("+pointer+"): event.type = "+event.type);
	
	if(event.type === "mousemove" || event.type === "mouseover" || event.type === "mousedown" || event.type === "mouseup" || event.type === "click" || event.type === "dblclick" || event.type === "contextmenu"){
		var mouseEvent = new MouseEvent(pointer);
		mouseEvent.currentTarget.dispatchEvent(mouseEvent);
	}
	else if(event.type === "keydown" || event.type === "keyup" || event.type === "keypress")
	{
		var keyboardEvent = new KeyboardEvent(pointer);
		keyboardEvent.currentTarget.dispatchEvent(keyboardEvent);
	}
	else{
		event.currentTarget.dispatchEvent(event);
	}
}