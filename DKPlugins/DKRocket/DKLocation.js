var location;

////////////////////////////////
var Location = function(pointer)
{
	Object.defineProperty(this, "hash",{
		value: "TODO",
	});
	Object.defineProperty(this, "host",{
		value: "TODO",
	});
	Object.defineProperty(this, "hostname",{
		value: "TODO",
	});
	Object.defineProperty(this, "href", {
		get: function()   { return DKRocket_href(this.pointer);      },
		set: function(val){ return DKRocket_setHref(this.pointer, val); }
	});  //TODO
	Object.defineProperty(this, "origin",{
		value: "TODO",
	});
	Object.defineProperty(this, "pathname",{
		value: "TODO",
	});
	Object.defineProperty(this, "port",{
		value: "TODO",
	});
	Object.defineProperty(this, "protocol",{
		value: "TODO",
	});
	Object.defineProperty(this, "search",{
		value: "TODO",
	});
	
	Location.prototype.assign = function(url){
		//TODO
	}
	Location.prototype.reload = function(forceGet){
		//TODO
	}
	Location.prototype.replace = function(newUrl){
		//TODO
	}
}

location = new Location("location");