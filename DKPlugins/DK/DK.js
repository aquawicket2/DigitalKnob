console.log("*** DigitalKnob ***"); 
console.log("Browser = "+DK_GetBrowser());
console.log("JSEngine = "+DK_GetJSEngine());

var LOG_DEBUG = false;
var LOG_INFO = true;
var LOG_WARNINGS = true;
var LOG_ERRORS = true;
var LOG_FILE = true;
var LOG_SHOW = ""; //comma seperated
var LOG_HIDE = ""; //comma seperated
var LOG_LINES = false;

var DK_ERROR = 1;     //Red
var DK_WARN = 2;      //Yellow
var DK_INFO = 3;      //White
var DK_DEBUG = 4;     //Blue
var DK_SHOW = 5;
var DK_HIDE = 6;

var mouseStartX;
var mouseStartY;
var objectX;
var objectY;
var drag_id;
//var events = [];

var byId = function(id){ return document.getElementById(id); } //shortcut alias
 
//document.getElementsByTagName("html")[0].style.fontSize = "1.0px";
//document.body.style.fontSize = "13em";
//document.body.style.fontSize = "1.0px";

//document.onselectstart = function() { return false; }; //prevent screen highlighting while dragging
//document.documentElement.id = "html";
//document.getElementsByTagName('head')[0].id = "head";
//document.body.id = "body";
//document.body.style.cursor = "default";

// Dummy functions only implemented in c++
//function DK_DoFrame(){ /*console.warn("DK_ClearEvents(): not available for "+DK_GetBrowser());*/ }
//function EventLoop(){ /*console.warn("DK_ClearEvents(): not available for "+DK_GetBrowser());*/ }
//EventLoop.run = function(){};

//https://stackoverflow.com/a/11035042/688352
/*
if(DK_GetBrowser() !== "CEF" && DK_GetBrowser() !== "RML"){
	var DK_ClearEvents = function(){ console.warn("DK_ClearEvents(): not available for "+DK_GetBrowser()); }
	var DKRocket_Reload = function(){ console.warn("DKRocket_Reload(): not available for "+DK_GetBrowser()); }
	var DK_CallFunc = function(var1, var2, var3){ console.warn("DK_CallFunc(): not available for "+DK_GetBrowser()); return ""; }
	var DK_Queue = function(var1, var2, var3){ console.warn("DK_Queue(): not available for "+DK_GetBrowser()); }
	var DK_LeftClick = function(){ console.warn("DK_LeftClick(): not available for "+DK_GetBrowser()); }
	var DK_RightClick = function(){ console.warn("DK_RightClick(): not available for "+DK_GetBrowser()); }
	var DK_SetCursorPos = function(){ console.warn("DK_SetCursorPos(): not available for "+DK_GetBrowser()); }
	var DKHook_GetWindows = function(){ console.warn("DKHook_GetWindows(): not available for "+DK_GetBrowser()); }
	var DK_Crash = function(){ console.warn("DK_Crash(): not available for "+DK_GetBrowser()); }
	var DK_LogGuiConsole = function(){ console.warn("DK_LogGuiConsole(): not available for "+DK_GetBrowser()); }
	var DK_GetFunctions = function(){ console.warn("DK_GetFunctions(): not available for "+DK_GetBrowser()); }
	var DK_PrintFunctions = function(){ console.warn("DK_PrintFunctions(): not available for "+DK_GetBrowser()); }
	var DK_GetPixelUnderMouse = function(){ console.warn("DK_GetPixelUnderMouse(): not available for "+DK_GetBrowser()); return ""; }
	var DK_ShowConsole = function(){ console.warn("DK_ShowConsole(): not available for "+DK_GetBrowser()); return ""; }
	var DK_HideConsole = function(){ console.warn("DK_HideConsole(): not available for "+DK_GetBrowser()); return ""; }
	var DK_CpuUsed = function(){console.warn("DK_CpuUsed(): not available for "+DK_GetBrowser()); return ""; }
	var DK_CpuUsedByApp = function(){ console.warn("DK_CpuUsedByApp(): not available for "+DK_GetBrowser()); return ""; }
	var DK_PhysicalMemory = function(){ console.warn("DK_PhysicalMemory(): not available for "+DK_GetBrowser()); return ""; }
	var DK_PhysicalMemoryUsedByApp = function(){ console.warn("DK_PhysicalMemoryUsedByApp(): not available for "+DK_GetBrowser()); return ""; }
}
*/

/*
var myVar = setInterval(myTimer, 1000);
function myTimer() {
    DKSendEvent("window", "second", "");
}
*/

//This function is used to debug googlebot crawling
/////////////////////////////////////////////
window.addEventListener('error', function(e){
    var errorText = [
        e.message + '\n',
        'URL: ' + e.filename,
        'Line: ' + e.lineno + ', Column: ' + e.colno,
        'Stack: ' + (e.error && e.error.stack || '(no stack trace)')
    ].join('\n');
	console.error(errorText);
	
	/*
    // Example: log errors as visual output into the host page.
    // Note: you probably donâ€™t want to show such errors to users, or
    //       have the errors get indexed by Googlebot; however, it may
    //       be a useful feature while actively debugging the page.
    var DOM_ID = 'rendering-debug-pre';
    if(!byId(DOM_ID)){
        var log = document.createElement('pre');
        log.id = DOM_ID;
        log.style.whiteSpace = 'pre-wrap';
        log.textContent = errorText;
        if (!document.body) document.body = document.createElement('body');
        document.body.insertBefore(log, document.body.firstChild);
    } else {
        byId(DOM_ID).textContent += '\n\n' + errorText;
    }
	(/

	/*
    // Example: log the error to remote service.
    // Note: you can log errors to a remote service, to understand
    //       and monitor the types of errors encountered by regular users,
    //       Googlebot, and other crawlers.
    var client = new XMLHttpRequest();
    client.open('POST', 'https://example.com/logError');
    client.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8');
    client.send(errorText);
	*/
});


///////////////////////////////////////////////////
document.addEventListener("mousemove", function(e){	
	if(DK_IE()){ // grab the x-y pos.s if browser is IE
		window.mouseX = e.clientX + document.body.scrollLeft
		window.mouseY = e.clientY + document.body.scrollTop
	}
	//FIXME
	if(DK_GetBrowser() === "RML"){
		window.mouseX = e.clientX;
		window.mouseY = e.clientY;
	}
	else{  // grab the x-y pos.s if browser is NS
		window.mouseX = e.pageX
		window.mouseY = e.pageY
	}  
	// catch possible negative values in NS4
	if (window.mouseX < 0){window.mouseX = 0}
	if (window.mouseY < 0){window.mouseY = 0}  
	return true;
});


/*
function DKERROR(string){ Log(string, DK_ERROR); }
function DKWARN(string){ Log(string, DK_WARN); }
function DKINFO(string){ Log(string, DK_INFO); }
function DKDEBUG(string){ Log(string, DK_DEBUG); }
*/
/////////////////////////
function Log(string, lvl)
{
	if(!lvl){
		lvl = DK_INFO;
	}
	
	//check for LOG_HIDE
	if(LOG_HIDE){
		var arry = LOG_HIDE.split(",");
		for(var i=0; i<arry.length; i++){
			if(arry[i] && string.includes(arry[i])){
				return;
			}
		}
	}
	
	if(window.console){
		var flag = false;
		if(LOG_SHOW){
			var arry = LOG_SHOW.split(",");
			for(var i=0; i<arry.length; i++){
				if(arry[i] && string.includes(arry[i])){
					flag = true;
					break;
				}
			}
		}
		if(!flag){ 
			if(lvl === DK_ERROR && !LOG_ERRORS){ return; }
			if(lvl === DK_WARN && !LOG_WARNINGS){ return; }
			if(lvl === DK_INFO && !LOG_INFO){ return; }
			if(lvl === DK_DEBUG && !LOG_DEBUG){ return; }
		}
		var color = "";
		if(lvl === DK_ERROR){ color = "color:red";}
		if(lvl === DK_WARN){ color = "color:#B8860B"; }
		if(lvl === DK_INFO){ color = "color:grey"; }
		if(lvl === DK_DEBUG){ color = "color:blue"; }
		if(!color){ color = "color:grey"; }
		string = string.replace("\n","");
		
		function getFileLine(){
			var stack = Error().stack;
			if(!stack || !LOG_LINES){ return ""; }
			var lines = stack.split("\n");
			var n=0;
			while(lines[n].indexOf("Log") === -1){ n++; }
			var fileline = lines[n+1];
			var start = fileline.lastIndexOf("/");
			var end = fileline.lastIndexOf(":");
			fileline = fileline.substring(start+1, end+1);
			return fileline+"  ";
		};
		
		if(DK_GetBrowser() === "CHROME" || DK_GetBrowser() === "CEF"){
			if(lvl === DK_ERROR){
				//alert("ERROR: "+string);
				//throw "ERROR: "+string;
				console.error(getFileLine()+string);
			}
			else if(lvl === DK_WARN){
				console.warn(getFileLine()+string);
			}
			else if(lvl === DK_INFO){
				console.log(getFileLine()+string);
			}
			else if(lvl === DK_DEBUG){
				//console.info("%c"+getFileLine()+string, color);
				console.debug("%c"+getFileLine()+string, color);
			}
			else{
				console.log("%c"+getFileLine()+string, color);
			}
		}
		else{
			if(lvl === DK_ERROR){
				//alert("ERROR: "+string);
				//throw "ERROR: "+string;
				console.error(getFileLine()+string);
			}
			else if(lvl === DK_WARN){
				console.warn(getFileLine()+string);
			}
			else if(lvl === DK_INFO){
				console.log(getFileLine()+string);
			}
			else if(lvl === DK_DEBUG){
				console.debug(getFileLine()+string);
			}
			else{
				console.log(getFileLine()+string);
			}
		}
	}
	//DKSendEvent("DKConsole.html", "DKNotify", string);
}

//////////////////////////////////
function DK_Create(data, callback)
{
	//console.log("DK.js:DK_Create("+data+")");	
	var arry = data.split(",");
	if(arry[0].indexOf(".html") > -1){
		arry.splice(0, 0, "DKHtml");
	}
	else if(arry[0].indexOf(".js") > -1){
		arry.splice(0, 0, "DKJavascript");
	}
	else if(arry[0].indexOf(".css") > -1){
		arry.splice(0, 0, "DKCss");
	}
	else{
		//console.log("DK_Create("+data+"): requesting c++ plugin");
		if(DK_GetBrowser() === "CEF" || DK_GetBrowser() === "RML"){
			CPP_DKDuktape_Create(data);
		}
	}	
	if(arry[0] === "DKJavascript"){
		if(!DK_LoadJs(arry[1], function(rval){
			if(callback){ 
				callback(rval); 
			}
			else{
				console.error("DK_Create("+data+"): does not have a callback");
			}
		})
		){
			return false;
		}
	}
	if(arry[0] === "DKHtml"){
		//console.log("DK_Create(data, callback)");
			//if(!DKWidget_NewWidget(arry[1], arry[2])){
			if(!DK_LoadHtml(arry[1], arry[2])){
				return false;
			}
			if(typeof callback === "function"){ 
				callback(); 
			}
			else{
			//console.error("DK_Create("+data+"): does not have a callback");
			}
	}
	if(arry[0] === "DKCss"){
		if(!DK_LoadCss(arry[1])){
			return false;
		}
		if(callback){ 
			callback(); 
		}
		else{
			//console.error("DK_Create("+data+"): does not have a callback");
		}
	}
	return true;
}

///////////////////////
function DK_Close(data)
{
	console.log("DK_Close("+data+")");
	if(!data){
		console.error("DK_Close("+data+"): data empty");
		return false;
	}
	
	var arry = data.split(",");
	if(arry[0].indexOf(".html") > -1){
		arry.splice(0, 0, "DKHtml");
	}
	else if(arry[0].indexOf(".js") > -1){
		arry.splice(0, 0, "DKJavascript");
	}
	else if(arry[0].indexOf(".css") > -1){
		arry.splice(0, 0, "DKCss");
	}
	
	var file = DKFile_GetFilename(arry[1]);
	if(!file){ 
		console.error("DK_Close("+data+"): file invalid");
		return false; 
	}
	
	if(arry[0] === "DKJavascript"){
		var end = file.replace(".js", "");
		end += "_End";
		eval(end+"()");
		
		//FIXME
		/*
		console.log(end);
		var func = window[end]; //Plugin_End() //FIXME
		if(typeof func === 'function'){
			
			func(); // Call the jsclass_End() function
		}
		else{
			console.warn("DK_Close(data): "+func+" is not a function");
		}
		*/
		
		var script = byId(arry[1]);
		if(!script){
			//console.warn("DK_Close("+data+"): "+arry[1]+" does not exist");
			return false;
		}
		script.parentNode.removeChild(script);
		//console.log("Closed "+arry[1]);
	}
	if(arry[0] === "DKHtml"){
		var element = byId(arry[1]);
		if(!element){ 
			//console.warn("DK_Close("+data+"): "+file+" does not exist");
			return false; 
		}
		element.parentNode.removeChild(element);
		//console.log("Closed "+arry[1]);
	}
	if(arry[0] === "DKCss"){
		var css = byId(arry[1]);
		if(!css){ 
			//console.error("DK_Close("+data+"): "+arry[1]+" does not exist");
			return false; 
		}
		css.parentNode.removeChild(css);
		//console.log("Closed "+arry[1]);
	}
	
	return true;
}

////////////////////////
function DK_LoadCss(url)
{
	//console.log("DK.js:DK_LoadCss("+url+")");
	if(!url){ 
		console.error("DK.js: DK_LoadCss("+url+"): url invalid");
		return false; 
	}
	
	if(DK_GetObjects().indexOf(url) !== -1){
		console.warn("DK.js: DK_LoadCss("+url+"): url already loaded");
		return false;
	}
	
	var link = document.createElement('link');
	//console.log("link = "+link.POINTER);
	link.setAttribute('href', url);
	link.id = url;
	link.setAttribute('rel', 'stylesheet');
	link.setAttribute('type', 'text/css');
	var elements = document.getElementsByTagName('head');
	
	//console.log("DK_LoadCss("+url+"): link = "+link.POINTER);
	//console.log("DK_LoadCss("+url+"): link = "+link);
	//console.log("DK_LoadCss("+url+"): elements[0] = "+elements[0]);
	//console.log("DK.js:DK_LoadCss("+url+") appending link");
	elements[0].appendChild(link);
	
	return true;
}

/////////////////////////////////
function DK_LoadJs(url, callback)
{
	//console.warn("DK_LoadJs("+url+")");
	if(!url){ 
		console.error("DK.js: DK_LoadJs("+url+"): url invalid");
		return false; 
	}
	
	if(DK_GetObjects().indexOf(url) !== -1){
		console.warn("DK.js: DK_LoadJs("+url+"): url already loaded");
		callback && callback(false);
		return false;
	}
	
	//TEST: already loaded, remove it first
	if(byId(url)){
		byId(url).parentNode.removeChild(byId(url));
	}
	
	var file = url.substring(url.lastIndexOf("/") + 1);
	
	// Call the js init function
	if(!file){ 
		console.error("DK.js: DK_LoadJs("+url+"): file invalid");
		return false; 
	}
	
	// Adding the script tag to the head as suggested before
	var head = document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	//script.type = 'text/javascript';
	script.setAttribute('type', 'text/javascript');
	script.id = url;
	//script.async = true; // optionally
	script.setAttribute('async', true);
	script.setAttribute('src', url);
	
	//console.log("script.type = "+script.type);
	
	//if(typeof script === "undefined"){ 
	//	console.error("Cannot load "+url);
	//	return false; 
	//}
	
	var init = file.replace(".js", "");
	init += "_Init";
	
	head.appendChild(script);
	
	////////// CALLBACKS
	var done = false;
	script.onload = script.onreadystatechange = function(){ //FIXME - DigitalKnob can't trigger onload yet.
		if(!done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")){
			//console.log("Loaded: "+url);
			var func = window[init]; //Plugin_Init()    
			if(typeof func === 'function'){ 
				//console.log("Calling: "+init);
				func(); //Init
			}
			else{
				//console.warn(init+" is not defined");
			}
			
			done = true;
			callback && callback(true);
		}
	};
	script.onerror = function(){
		console.error("DK.js: DK_LoadJs("+url+"): Could not load file");
	}
	////////////////////////
	
	//FIXME - DigitalKnob can't trigger onload yet, so we do this
	if(DK_GetJSEngine() === "Duktape"){
		//console.log("Loaded: "+url);
		var func = init; //Plugin_Init() 
		if(eval("typeof "+func) === "function"){
			//console.log("Calling: "+init);
			eval(func)(); //Init
		}
		else{
			console.warn(init+" is not defined");
		}
		callback && callback(true);
	}
	
	return true;
}

/////////////////////////////////
function DK_LoadHtml(url, parent)
{
	//console.warn("DK.js:DK_LoadHtml("+url+","+parent+")");
	//TODO: the id of the root element in the html file should be the file path..   I.E. MyPlugin/MyPlugin.html
	if(!url){ 
		console.error("DK.js: DK_LoadJs("+url+"): url invalid");
		return false; 
	}
	
	if(url.indexOf(".html") === -1){ 
		console.error("DK.js: DK_LoadHtml("+url+", parent): url is not a valid .html file");
		return false;
	}
	
	if(url === ".html"){ url = "New.html"; }
	
	if(DK_GetObjects().indexOf(url) !== -1){
		console.warn("DK.js: DK_LoadHtml("+url+", parent): url already loaded");
		return false;
	}
	
	var string = DK_FileToString(url);
	//console.warn("url = "+url);
	//console.warn("string = "+string);
	//Create an empty widget
	if(!string || string === "ERROR"){ 
		string  = "<div id=\""+url+"\" style=\"position:absolute;top:200rem;left:200rem;width:200rem;height:200rem;background-color:rgb(230,230,230);\"></div>";
	}

	var temp = document.createElement("temp");
	//console.log("temp.id = "+temp.id);
	temp.innerHTML = string;
	//console.log("temp.innerHTML = "+temp.innerHTML);
	//console.log("temp.id = "+temp.id);
	var nodes = temp.childNodes;
	if(!nodes){
		console.error("DK.js: DK_LoadHtml("+url+", "+parent+"): Could not get nodes from file url");
		return false;
	}
	if(nodes.length > 1){
		for(var i=0; i < nodes.length; i++){
			console.warn("node["+i+"]: "+nodes[i]);
		}
		
		console.warn("###############################################");
		console.warn("DK.js: DK_LoadHtml("+url+", "+parent+"): Too many nodes in file");
		//console.log(temp.innerHTML);
		console.warn("You either have too many root nodes in your html file or, you have extra whitespace at the begining or the end of the file");
		console.warn("###############################################");
		//return false;
	}

	if(nodes[0].id !== url){
		console.warn("DK.js: DK_LoadHtml("+url+",parent): did not match the node id ("+nodes[0].id+")");
		nodes[0].id = url;
		console.warn("DK.js: DK_LoadHtml("+url+",parent): please fix the id");
	}
	if(parent && byId(parent)){
		//console.log("DK.js:DK_LoadHtml(): appending to parent");
		byId(parent).appendChild(nodes[0]);
	}
	else{
		//console.log("DK.js:DK_LoadHtml(): appending to body");
		document.body.appendChild(nodes[0]);
	}
	
	//FIXME - CEF seems to do this automatically. DKRml need to act the same.
	//var elements = document.getElementsByTagName("temp");
	//if(elements){ console.log("getElementsByTagName(temp).length: "+elements.length); }
	//if(elements[0]){ console.log("elements[0].innerHTML: "+elements[0].innerHTML); }
	//if(elements[0]){ document.removeChild(elements[0]); }
	
	return true;
}

//////////////////////////////
function DK_CheckFileSupport()
{
	if(window.File && window.FileReader && window.FileList && window.Blob){
		console.log("DK.js: File support OK");
	}
	else {
		console.error("DK.js: The File APIs are not fully supported in this browser");
	}
}

/*
///////////////////////////
function GetLeftPx(element)
{
	if(!element){ return 0; }
	if(!element.style.left){ return 0; }
	if(element.style.left.indexOf("%") > -1){
		return parseInt(element.style.left) * WindowWidth() / 100;
	}
	return parseInt(element.style.left);
}

//////////////////////////
function GetTopPx(element)
{
	if(!element){ return 0; }
	if(!element.style.top){ return 0; }
	if(element.style.top.indexOf("%") > -1){
		return parseInt(element.style.top) * WindowHeight() / 100;
	}
	return parseInt(element.style.top);
}

////////////////////////////
function GetWidthPx(element)
{
	if(!element){ return 0; }
	if(!element.style.width){ return 0; }
	if(element.style.width.indexOf("%") > -1){
		return parseInt(element.style.width) * WindowWidth() / 100;
	}
	return parseInt(element.style.width);
}

/////////////////////////////
function GetHeightPx(element)
{
	if(!element){ return 0; }
	if(!element.style.height){ return 0; }
	if(element.style.height.indexOf("%") > -1){
		return parseInt(element.style.height) * WindowHeight() / 100;
	}
	return parseInt(element.style.height);
}
*/

/*
/////////////////////////////
function DragStart(event, id)
{
	if(!event){event = window.event;}
	if(DK_IE()){
		mouseStartX = event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft;
        mouseStartY = event.clientY + document.documentElement.scrollTop + document.body.scrollTop;
	}
	else{
		mouseStartX = event.clientX + window.scrollX || parseInt(event.changedTouches[0].clientX);
		mouseStartY = event.clientY + window.scrollY || parseInt(event.changedTouches[0].clientY);
	}
	drag_id = id;
	element = byId(drag_id);
	
	objectX = GetLeftPx(element);
	objectY = GetTopPx(element);

	document.body.onmousemove = function(event){ DragMove(event); }
	document.body.onmouseup = function(event){ DragStop(event); }
	document.body.addEventListener('touchmove', DragMove, false);
	document.body.addEventListener('touchend', DragStop, false);
}

////////////////////////
function DragMove(event)
{
	if(!event){event = window.event;}
	if(DK_IE()){
		x = event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft;
        y = event.clientY + document.documentElement.scrollTop + document.body.scrollTop;
	}
	else{
		x = event.clientX + window.scrollX || parseInt(event.changedTouches[0].clientX);
		y = event.clientY + window.scrollY || parseInt(event.changedTouches[0].clientY);
	}

	element = byId(drag_id);

	if(element.style.left){
		element.style.left = Pos(objectX + x - mouseStartX);
	}
	else{
		element.style.right = Pos(objectX + mouseStartX - x);
	}
	if(element.style.top){
		element.style.top =  Pos(objectY + y - mouseStartY);
	}
	else{
		element.style.bottom =  Pos(objectY + mouseStartY - y);
	}
	
	//WindowRestrictions(id);
	
	//Create a custom move event
	///////////////////////////////////////////////////
	var moveevent;
	if(document.createEvent){
		moveevent = document.createEvent("HTMLEvents");
		moveevent.initEvent("move", true, true);
	}
	else{
		moveevent = document.createEventObject();
		moveevent.eventType = "move";
	}

	moveevent.eventName = "move";

	if(document.createEvent){
		element.dispatchEvent(moveevent);
	}
	else{
		element.fireEvent("on" + moveevent.eventType, moveevent);
	}
	////////////////////////////////////////////////////////////
}

////////////////////////
function DragStop(event)
{
	document.body.onmousemove = function(){};
	document.body.onmouseup = function(){};
	document.body.removeEventListener('touchmove', DragMove, false);
	document.body.removeEventListener('touchend', DragStop, false);
}
*/

/*
///////////////////////////////
function ResizeStart(event, id)
{
	if(!event){event = window.event;}
	if(DK_IE()){
		mouseStartX = event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft;
        mouseStartY = event.clientY + document.documentElement.scrollTop + document.body.scrollTop;
	}
	else{
		mouseStartX = event.clientX + window.scrollX || parseInt(event.changedTouches[0].clientX);
		mouseStartY = event.clientY + window.scrollY || parseInt(event.changedTouches[0].clientY);
	}
	
	drag_id = id;
	element = byId(id);
	
	objectX = GetWidthPx(element);
	objectY = GetHeightPx(element);
	
	document.body.onmousemove = function(event){ ResizeMove(event); }
	document.body.onmouseup = function(event){ ResizeStop(event); }
	document.body.addEventListener('touchmove', ResizeMove, false);
	document.body.addEventListener('touchend', ResizeStop, false);
}

//////////////////////////
function ResizeMove(event)
{	
	if(!event){event = window.event;}
	if(DK_IE()){
		x = event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft;
        y = event.clientY + document.documentElement.scrollTop + document.body.scrollTop;
	}
	else{
		x = event.clientX + window.scrollX || parseInt(event.changedTouches[0].clientX);
		y = event.clientY + window.scrollY || parseInt(event.changedTouches[0].clientY);
	}
	
	element = byId(drag_id);
	if((objectX + x - mouseStartX) > 1){
  		element.style.width = Pos(objectX + x - mouseStartX);
		
  	}
  	if((objectY + y - mouseStartY) > 1){
	  	element.style.height = Pos(objectY + y - mouseStartY);
  	}
	
	//WindowRestrictions(id);
	//DKSendEvent(id, "resize");
}

///////////////////////
function ResizeStop(id)
{
	document.body.onmousemove = function(){};
	document.body.onmouseup = function(){};
	document.body.removeEventListener('touchmove', ResizeMove, false);
	document.body.removeEventListener('touchend', ResizeStop, false);
}
*/

/*
//////////////////////////////
function PreventDefault(event)
{
	if(event.stopPropagation) {
        event.preventDefault();
    } else {
        event.cancelBubble = true;
    }
}

///////////////////////////////
function StopPropagation(event)
{
	if(event.stopPropagation) {
        event.stopPropagation();
    } else {
        event.cancelBubble = true;
    }
}
*/

/////////////////////////////////////////
function setCookie(cname, cvalue, exdays)
{
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

/////////////////////////
function getCookie(cname) 
{
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)===' ') c = c.substring(1);
        if (c.indexOf(name) === 0) return c.substring(name.length,c.length);
    }
    return "";
}

//////////////////////////
function makeStruct(names)
{
	var names = names.split(' ');
	var count = names.length;
	function constructor(){
		for (var i = 0; i < count; i++) {
			this[names[i]] = arguments[i];
		}
	}
	return constructor;
	
	//Usage:
	//var Item = makeStruct("id speaker country");
	//var row = new Item(1, 'john', 'au');
	//alert(row.speaker); // displays: john
}


//////////////////////////////////
function replace(str, old, newstr)
{
	var re = new RegExp(old, 'g');
	return str.replace(re, newstr);
}

// trim for IE8
if(typeof String.prototype.trim !== 'function') {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, ''); 
  }
}

/////////////////////
function DK_IsLocal()
{
	switch(window.location.protocol){
		case 'http:':
		case 'https:':
			//remote file over http or https
			return false;
			break;
		case 'file:':
			//local file
			return true;
			break;
		default: 
			//some other protocol
	}
}

/////////////////////
function DK_GetTime()
{
	var d = new Date();
	var hour = d.getHours();
	var minute = d.getMinutes();
	minute = minute > 9 ? minute : '0' + minute; //pad 0
	var time = hour;
	time += ":";
	time += minute;
	if(hour > 11){
		time += " PM";
	}
	else{
		time += " AM";
	}
	return time;
}

/////////////////////
function DK_GetDate()
{
	var d = new Date();
	var date = d.getMonth()+1;
	date += "/";
	date += d.getDate();
	date += "/";
	date += d.getFullYear();
	return date;
}

/*
/////////////////////
function DK_Refresh()
{	
	//window.location.href = href+"index.html";
	window.location.hash = "";
	window.location.reload(true);
}
*/

///////////////////////////
function DK_Available(name) //FIXME: rename to DK_Available
{
	//FIXME: This function needs to be investigated
	if(name === "DKWidget"){
		return true; 
	}
	if(name === "DKWidgetJS"){  //FIXME: is this needed?
		console.log("DKAvailable("+name+"): name === DKWidgetJS!  check DK.js line 235");
		return true; 
	}
	return false;
}

////////////////////////
function DK_GetObjects()
{
	// Search the Dom for all scripts (.js files)
	var jsfiles = "";
	var elements = document.getElementsByTagName("script");
	for(var i=0; elements && i<elements.length; i++){
		if(!elements[i].id){
			//console.warn(elements[i].src+": script object has no id");
			continue; 
		}
		jsfiles += elements[i].id+",";
	}
	
	// Search the Dom for all css (.css files)
	var cssfiles = "";
	var elements = document.getElementsByTagName("link");
	if(elements){
		for(var i=0; i<elements.length; i++){
			if(!elements[i].id){
				//console.warn(elements[i].href+": css object has no id");
				continue; 
			}
			cssfiles += elements[i].id+",";
		}
	}
	
	// Search the Dom for all widgets (.html id's)
	var htmlfiles = "";
	var divs = document.getElementsByTagName("div");
	if(divs){
		for(var i = divs.length; i;){
			var div = divs[--i];
			if(!div.id){
				console.warn(div+": html object has no id");
				continue; 
			}
			if(div.id.indexOf(".html") > -1){
				htmlfiles += div.id+",";
			}
		}
	}
	
	return jsfiles+cssfiles+htmlfiles;
}


///////////////////
function DK_GetOS()
{
	var userAgent = navigator.userAgent || navigator.vendor || window.opera;
     // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)){
        return "Windows Phone";
    }
    if (/android/i.test(userAgent)){
        return "Android";
    }
    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream){
        return "iOS";
    }
	var os_value = navigator.platform;
	if (navigator.userAgent.indexOf("WOW64") !== -1 || navigator.userAgent.indexOf("Win64") !== -1 ){
		os_value = os_value.replace("32", "64");
	}
	os_value = os_value.replace("Intel", ""); //Mac
	os_value = os_value.replace(" x86_64", ""); //Linux
	return os_value;
}

////////////////////////
function DK_GetBrowser()
{
	if(navigator.userAgent.indexOf("Rml") !== -1){
        return "RML";
    }
    else if((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) !== -1 ){
        return "OPERA";
    }
    else if(navigator.userAgent.indexOf("Chrome") !== -1 && navigator.userAgent.indexOf("Cef") === -1){
		return "CHROME";
    }
	else if(navigator.userAgent.indexOf("Cef") !== -1){
        return "CEF";
    }
    else if(navigator.userAgent.indexOf("Safari") !== -1){
        return "SAFARI";
    }
    else if(navigator.userAgent.indexOf("Firefox") !== -1){
        return "FIREFOX";
    }
    else if((navigator.userAgent.indexOf("MSIE") !== -1) || (!!document.documentMode === true )){ //IF IE > 10
		return "IE";
    }
    else {
       return "UNKNOWN BROWSER";
    }
}

/////////////////////////
function DK_GetJSEngine()
{
	if(navigator.product === "Duktape"){
		return "Duktape"
	}
	var v8string = 'function%20javaEnabled%28%29%20%7B%20%5Bnative%20code%5D%20%7D';
	if('WebkitAppearance' in document.documentElement.style){  //If (probably) WebKit browser
		if (escape(navigator.javaEnabled.toString()) === v8string){
			return "V8";
		}
		else{
			return "JSC";
		}
	}
	return "UNKNOWN JAVASCRIPT ENGINE"
}

////////////////
function DK_IE()
{
	var rv = 0;
	if(navigator.appName === 'Microsoft Internet Explorer'){
		var ua = navigator.userAgent;
		var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if(re.exec(ua) !== null)
		rv = parseFloat( RegExp.$1 );
	}
	else if (navigator.appName === 'Netscape'){
		var ua = navigator.userAgent;
		var re  = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
		if(re.exec(ua) !== null)
      rv = parseFloat( RegExp.$1 );
	}
	
	// Returns the version of Internet Explorer or a 0
	// (indicating the use of another browser).
	return rv;
}

/////////////////////////////
function DK_FileToString(url)
{
	return ajaxGetUrl(url);
}

///////////////////////////////
function DK_Sleep(milliseconds)
{
	var start = new Date().getTime();
	for (var i = 0; i < 1e7; i++) {
		if((new Date().getTime() - start) > milliseconds){
		break;
    }
	}
}

////////////////////////////
function DK_ClearSelection()
{
	//Clear text selection
	if(document.selection){
		document.selection.empty();
	}
	else if(window.getSelection){
		window.getSelection().removeAllRanges();
	}
}

////////////////////////////////
function DK_GetElements(element)
{
	var string = "";
	//var nodes = byId(id).getElementsByTagName('*'); //all children recursively
	if(typeof(element) !== "object"){
		console.error("DK_GetElements("+element.id+"): element not an object");
	}
	var nodes = element.childNodes;
	for(var i=0; i<nodes.length; i++){
		if(nodes[i].id){
			string += nodes[i].id;
			string += ",";
		}
	}
	//console.log("GetElements("+id+"): -> "+string+"\n");
	return string;
}


//////////////////////////////////////////////////////////////////
//  We can take a ajaxGetUrl(url) call and give back php stuff
//
//  Single return value 
//	ajaxGetUrl("http://DigitalKnob.com/assets/DKText.php?text=hello world");      
//	returns "hello world"
//
//	Multiple return values are comma separated.
//	ajaxGetUrl("http://digitalknob.com/assets/DKMySql.php?Query=SHOW TABLES");     
//	returns "1,User"
//  
//	Multidimensional return values are also comma separated with the first value specifying the number of fields in each row.
//  ajaxGetUrl("http://digitalknob.com/assets/DKMySql.php?Query=SELECT * FROM User");
//  returns "3,1,aquawicket@hotmail.com,peanut123,2,aquawicket@gmail.com,peanut456"
//	the first value of "3" specifies that the array should be broken into rows of 3
//
/////////////////////////////////////////////////////////////////

/////////////////////////////
function AjaxGet(url, output)
{
	var request = "";
	try {
        request = new XMLHttpRequest();
    }catch(e){}
    try {
        request = new ActiveXObject("Msxml3.XMLHTTP");
    }catch(e){}
    try {
        request = new ActiveXObject("Msxml2.XMLHTTP.6.0");
    }catch(e){}
    try {
        request = new ActiveXObject("Msxml2.XMLHTTP.3.0");
    }catch(e){}
    try {
        request = new ActiveXObject("Msxml2.XMLHTTP");
    }catch(e){}
    try {
        request = new ActiveXObject("Microsoft.XMLHTTP");
    }catch(e){}

	if(!request){
		console.error("AJAX ERROR: Error creating request object");
		return false;
	}

	request.onreadystatechange=function(){
		if(request.readyState===4){
			if(request.status===200 || request.status===0){
				output.value = request.responseText;
				//console.log("AJAX RETURN: "+output.value);
				return true;
			}
			else{
				console.error("AJAX ERROR: "+url+" "+request.statusText); //report error
				console.warn("status: "+request.status);
				return false;
			}
		}
	}
	
	//try{ 
		request.open("GET", url, false); 
		request.send(); 
	//}
	//catch(err){
	//	output.value = "";
	//	return false;
	//}
	return true;
}

////////////////////////
function ajaxGetUrl(url)
{
	var response = new Object();
	AjaxGet(url, response);
	
	if(!response.value){ return "ERROR"; }
	//php has a console.log() function that injects return messages with {"strings"}
	//The response may contain {"log data"}, let's extract and print it.
	//Also remove them and pass the remaining data on
	//TODO - upgrade this to JSON date transfers
	var place = 0;
	var n = response.value.indexOf("{", place);
	while(n !== -1){
		place = response.value.indexOf("}");
		var res = response.value.substring(n+1, place);
		response.value = response.value.replace("{"+res+"}", "");
		//console.log("PHPLog: "+res);
		n = response.value.indexOf("{");
	}

	return response.value;
}