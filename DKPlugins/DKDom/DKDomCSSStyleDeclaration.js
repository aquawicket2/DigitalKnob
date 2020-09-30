// https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration

///////////////////////////////////////////
var CSSStyleDeclaration = function(pointer)
{
	this.pointer = pointer;
	
	// Methods
	Object.defineProperty(this, "getPropertyValue", {
		value: function(propertyName){ 
			this[propertyName] = DKCPP_DKDomCSSStyleDeclaration_getPropertyValue(this.pointer, propertyName);
			return this[propertyName];
		} 
	});
	Object.defineProperty(this, "setProperty", {
		value: function(propertyName, propertyValue, priority){ 
			console.warn("CSSStyleDeclaration:setProperty("+this.pointer+","+propertyName+","+propertyValue+")");
			DKCPP_DKDomCSSStyleDeclaration_setProperty(this.pointer, propertyName, propertyValue);
			this[propertyName] = propertyValue;
		} 
	});
	
	const proxy = new Proxy(this, {
		has: function(target, key){
			return key in target;
		},
		get: function(target, key, recv){
			//console.log("Style:get("+target+","+key+")");
			if(typeof target[key] === "function" || key === "pointer"){ return target[key]; }
			var realKey = key;
			
			//Replace characters ( C ) with ( -c )    EXAMPLE:  backgroundColor becomes background-color
			for(var i=0; i < realKey.length; i++){
				if(realKey.charAt(i) === realKey.charAt(i).toUpperCase()){ //is uppercase?
					if(realKey.charAt(i) === "-"){ continue; }
					realKey = realKey.substr(0, i)+"-"+realKey.charAt(i).toLowerCase()+realKey.substr(i+1, realKey.length);
				}
			}

			target[key] = DKCPP_DKDomCSSStyleDeclaration_getPropertyValue(target["pointer"], realKey);
			return target[key];
		},
		set: function(target, key, val, recv){
			//console.log("Style:set("+target+","+key+","+val+")");
			if(typeof target[key] === "function" || key === "pointer"){ return true; }
			var realKey = key;
			
			//Replace characters ( C ) with ( -c )    EXAMPLE:  backgroundColor becomes background-color
			for(var i=0; i < realKey.length; i++){
				if(realKey.charAt(i) === realKey.charAt(i).toUpperCase()){ //is uppercase?
					if(realKey.charAt(i) === "-"){ continue; }
					realKey = realKey.substr(0, i)+"-"+realKey.charAt(i).toLowerCase()+realKey.substr(i+1, realKey.length);
				}
			}
			
			if(realKey === "background-image"){
				realKey = "decorator";
				var img = val.replace("url(\"","");
				img = img.replace("\")","");
				val = "image("+img+" scale-none left top)";
			}
			
			DKCPP_DKDomCSSStyleDeclaration_setProperty(target["pointer"], realKey, val);
			target[key] = val;
			return true;
		},
		deleteProperty: function(target, key){
			delete target[key];
			return true;
		}
	});
	
	return proxy;
}