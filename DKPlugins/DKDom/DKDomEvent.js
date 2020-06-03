//https://developer.mozilla.org/en-US/docs/Web/API/Event

/////////////////////////////
var Event = function(pointer)
{
	//Properties
	Object.defineProperty(this, "bubbles",                { get: function(){ return DKDomEvent_bubbles(pointer);                } }); //Read Only
	Object.defineProperty(this, "cancelBubble", { 
		set: function(flag){ 
			return DKDomEvent_cancelBubble(pointer, flag);
		}
	});
	Object.defineProperty(this, "cancelable",             { get: function(){ return DKDomEvent_cancelable(pointer);             } }); //Read Only
	Object.defineProperty(this, "composed",               { get: function(){ return DKDomEvent_composed(pointer);               } }); //Read Only
	Object.defineProperty(this, "currentTarget", { 
		get: function(){ 
			var elementPointer = DKDomEvent_currentTarget(pointer);
			if(!elementPointer){ return; }
			var element = new HTMLElement(elementPointer);
			return element;
		} 
	}); //Read Only
	Object.defineProperty(this, "deepPath",               { get: function(){ return DKDomEvent_deepPath(pointer);               } }); //Not standardized
	Object.defineProperty(this, "defaultPrevented",       { get: function(){ return DKDomEvent_defaultPrevented(pointer);       } }); //Read Only
	Object.defineProperty(this, "eventPhase",             { get: function(){ return DKDomEvent_eventPhase(pointer);             } }); //Read Only
	Object.defineProperty(this, "explicitOriginalTarget", { get: function(){ return DKDomEvent_explicitOriginalTarget(pointer); } }); //Not standardized, Read Only
	Object.defineProperty(this, "originalTarget",         { get: function(){ return DKDomEvent_originalTarget(pointer);         } }); //Not standardized, Read only
	Object.defineProperty(this, "returnValue",            { get: function(){ return DKDomEvent_returnValue(pointer);            } });
	Object.defineProperty(this, "srcElement", { //Not standardized
		get: function(){ 
			var elementPointer = DKDomEvent_srcElement(pointer);
			if(!elementPointer){ return; }
			var element = new HTMLElement(elementPointer);
			return element;
		} 
	}); //Read Only
	Object.defineProperty(this, "target", { //Read Only
		get: function(){ 
			var elementPointer = DKDomEvent_target(pointer);
			if(!elementPointer){ return; }
			var element = new HTMLElement(elementPointer);
			return element;
		} 
	}); //Read Only
	Object.defineProperty(this, "timeStamp",              { get: function(){ return DKDomEvent_timeStamp(pointer);              } }); //Read Only
	Object.defineProperty(this, "type",                   { get: function(){ return DKDomEvent_type(pointer);                   } }); //Read Only
	Object.defineProperty(this, "isTrusted",              { get: function(){ return DKDomEvent_isTrusted(pointer);              } }); //Read Only
	
	//Obsolete properties
	Object.defineProperty(this, "scoped",                 { get: function(){ return DKDomEvent_scoped(pointer);                 } }); //Read Only, Obsolete
	
	//Methods
	Event.prototype.createEvent = function(){ //Deprecated
		DKDomEvent_createEvent(pointer);
	};
	Event.prototype.composedPath = function(){
		DKDomEvent_composedPath(pointer);
	};
	Event.prototype.initEvent = function(){ //Deprecated
		DKDomEvent_initEvent(pointer);
	};
	Event.prototype.preventDefault = function(){
		DKDomEvent_preventDefault(pointer);
	};
	Event.prototype.stopImmediatePropagation = function(){
		DKDomEvent_stopImmediatePropagation(pointer);
	};
	Event.prototype.stopPropagation = function(){
		DKDomEvent_stopPropagation(pointer);
	};
	
	//Obsolete methods
	Event.prototype.getPreventDefault = function(){ //Not standardized
		DKDomEvent_getPreventDefault(pointer);
	};
	Event.prototype.preventBubble = function(){ //Not standardized, Obsolete
		DKDomEvent_preventBubble(pointer);
	};
	Event.prototype.preventCapture = function(){ //Not standardized, Obsolete
		DKDomEvent_preventCapture(pointer);
	};
	
	return this;
};