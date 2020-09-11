var rgba = "0";
if(DK_GetBrowser() == "RML"){ rgba = "127"; }
else{ rgba = "0.5"; }

///////////////////////
function DKInput_Init()
{
	DKDEBUGFUNC();
	window.id = "window";
	DKCreate("DKInputTest/DKInput.html");
	DKAddEvent("window", "keypress", DKInput_OnEvent);
	DKAddEvent("window", "keydown", DKInput_OnEvent);
	DKAddEvent("window", "keyup", DKInput_OnEvent);
	DKAddEvent("window", "mousedown", DKInput_OnEvent);
	DKAddEvent("window", "mouseup", DKInput_OnEvent);
	DKAddEvent("window", "click", DKInput_OnEvent);
	DKAddEvent("window", "dblclick", DKInput_OnEvent);
	DKAddEvent("window", "mousemove", DKInput_OnEvent);
	DKAddEvent("window", "mouseover", DKInput_OnEvent);
	DKAddEvent("window", "mouseout", DKInput_OnEvent);
	DKAddEvent("window", "wheel", DKInput_OnEvent);
	DKAddEvent("window", "resize", DKInput_OnEvent);
	DKAddEvent("window", "input", DKInput_OnEvent);
	DKAddEvent("window", "change", DKInput_OnEvent);
	DKAddEvent("window", "contextmenu", DKInput_OnEvent);
	DKAddEvent("window", "scroll", DKInput_OnEvent);
	DKAddEvent("window", "drag", DKInput_OnEvent);
	DKAddEvent("esc", "mousedown", DKInput_OnEvent);
	DKAddEvent("esc", "mouseup", DKInput_OnEvent); 
}

//////////////////////
function DKInput_End()
{
	DKDEBUGFUNC();
	DKRemoveEvents(DKInput_OnEvent);
	DKClose("DKInputTest/DKInput.html");
}

///////////////////////////////
function DKInput_OnEvent(event)
{
	//DKDomEvent_getParameters(event.pointer);
	DKDEBUGFUNC(event);
	document.getElementById("lastevent").innerHTML = "Last Event: "+event.currentTarget.id+","+event.type+","+event.key;
	document.getElementById("event_char").innerHTML = "event.char: "+event.char;
	document.getElementById("event_charCode").innerHTML = "event.charCode: "+event.charCode;
	document.getElementById("event_code").innerHTML = "event.code: "+event.code;
	document.getElementById("event_key").innerHTML = "event.key: "+event.key;
	document.getElementById("event_keyCode").innerHTML = "event.keyCode: "+event.keyCode;
	document.getElementById("event_which").innerHTML = "event.which: "+event.which;

	if(event.type == "keypress"){	
		//DKInput_ProcessKeyPress(DK_GetValue(event));
	}
	if(event.type == "keydown"){
		DKInput_ProcessKeyDown(event.code);
	}
	if(event.type == "keyup"){
		DKInput_ProcessKeyUp(event.code);
	}
	if(event.type == "mousedown"){
		DKInput_ProcessMouseDown(event.button);
		if(event.currentTarget.id != "window"){
			DKInput_Highlight(event.currentTarget.id);
		}
	}
	if(event.type == "mouseup" || event.type == "click"){
		DKInput_ProcessMouseUp(event.button);
		if(event.currentTarget.id != "window"){
			DKInput_UnHighlight(event.currentTarget.id);
		}
	}
	if(event.type == "mousemove"){
		document.getElementById("mousex").innerHTML = "Mouse X: "+event.clientX;
		document.getElementById("mousey").innerHTML = "Mouse Y: "+event.clientY;
		document.getElementById("screenx").innerHTML = "Screen X: "+event.screenX;
		document.getElementById("screeny").innerHTML = "Screen Y: "+event.screenY;
	}
	if(event.type == "wheel"){
		DKWidget_SetInnerHtml("wheeldelta", "Wheel Delta: "+DK_GetValue(event));
	}
	
	//element events
	if(event.currentTarget.id == "esc"){
		console.log("event.currentTarget.id == 'esc'");
	}
}

/////////////////////////////////////////
function DKInput_ProcessMouseDown(button)
{
	DKDEBUGFUNC(button);
	DKWidget_Show(button+"button");	
}

///////////////////////////////////////
function DKInput_ProcessMouseUp(button)
{
	DKDEBUGFUNC(button);
	DKWidget_Hide(button+"button");	
}
		
////////////////////////////////////
function DKInput_ProcessKeyDown(key)
{
	DKDEBUGFUNC(key);
	DKInput_Highlight(key);
}

//////////////////////////////////
function DKInput_ProcessKeyUp(key)
{
	DKDEBUGFUNC(key);
	DKInput_UnHighlight(key);
}

//////////////////////////////
function DKInput_KeyToDiv(key)
{
	DKDEBUGFUNC(key);
	//if(key == 27){ return "esc"; }
	if(key == 27){ return "Escape"; }
	if(key == 112){ return "F1"; }
	if(key == 113){ return "F2"; }
	if(key == 114){ return "F3"; }
	if(key == 115){ return "F4"; }
	if(key == 116){ return "F5"; }
	if(key == 117){ return "F6"; }
	if(key == 118){ return "F7"; }
	if(key == 119){ return "F8"; }
	if(key == 120){ return "F9"; }
	if(key == 121){ return "F10"; }
	if(key == 122){ return "F11"; }
	if(key == 123){ return "F12"; }
	if(key == 44){ return "printscreen"; }
	if(key == 145){ return "scrolllock"; }
	if(key == 19){ return "pause"; }
	if(key == 192){ return "tilde"; }
	if(key == 48){ return "0"; }
	if(key == 49){ return "1"; }
	if(key == 50){ return "2"; }
	if(key == 51){ return "3"; }
	if(key == 52){ return "4"; }
	if(key == 53){ return "5"; }
	if(key == 54){ return "6"; }
	if(key == 55){ return "7"; }
	if(key == 56){ return "8"; }
	if(key == 57){ return "9"; }
	if(key == 189){ return "minus"; }
	if(key == 187){ return "equal"; }
	if(key == 220){ return "backslash"; }
	if(key == 8){ return "backspace"; }
	if(key == 35){ return "end"; }
	if(key == 36){ return "home"; }
	if(key == 144){ return "numlock"; }
	if(key == 111){ return "kp_slash"; }
	if(key == 106){ return "kp_multiply"; }
	if(key == 109){ return "kp_minus"; }
	if(key == 9){ return "tab"; }
	if(key == 81){ return "q"; }
	if(key == 87){ return "w"; }
	if(key == 69){ return "e"; }
	if(key == 82){ return "r"; }
	if(key == 84){ return "t"; }
	if(key == 89){ return "y"; }
	if(key == 85){ return "u"; }
	if(key == 73){ return "i"; }
	if(key == 79){ return "o"; }
	if(key == 80){ return "p"; }
	if(key == 219){ return "leftbracket"; }
	if(key == 221){ return "rightbracket"; }
	if(key == 13){ return "enter"; }
	if(key == 46){ return "delete"; }
	if(key == 45){ return "insert"; }
	if(key == 33){ return "pageup"; }
	if(key == 34){ return "pagedown"; }
	if(key == 96){ return "kp_0"; }
	if(key == 97){ return "kp_1"; }
	if(key == 98){ return "kp_2"; }
	if(key == 99){ return "kp_3"; }
	if(key == 100){ return "kp_4"; }
	if(key == 101){ return "kp_5"; }
	if(key == 102){ return "kp_6"; }
	if(key == 103){ return "kp_7"; }
	if(key == 104){ return "kp_8"; }
	if(key == 105){ return "kp_9"; }
	if(key == 110){ return "kp_period"; }
	if(key == 107){ return "kp_plus"; }
	if(key == 20){ return "capslock"; }
	if(key == 65){ return "a"; }
	if(key == 83){ return "s"; }
	if(key == 68){ return "d"; }
	if(key == 70){ return "f"; }
	if(key == 71){ return "g"; }
	if(key == 72){ return "h"; }
	if(key == 74){ return "j"; }
	if(key == 75){ return "k"; }
	if(key == 76){ return "l"; }
	if(key == 186){ return "semicolon"; }
	if(key == 222){ return "quote"; }
	if(key == 16){ return "leftshift"; }
	if(key == 90){ return "z"; }
	if(key == 88){ return "x"; }
	if(key == 67){ return "c"; }
	if(key == 86){ return "v"; }
	if(key == 66){ return "b"; }
	if(key == 78){ return "n"; }
	if(key == 77){ return "m"; }
	if(key == 188){ return "comma"; }
	if(key == 190){ return "period"; }
	if(key == 191){ return "slash"; }
	if(key == 16){ return "rightshift"; }
	if(key == 17){ return "leftctrl"; }
	if(key == 91){ return "leftwinkey"; }
	if(key == 18){ return "leftalt"; }
	if(key == 32){ return "space"; }
	if(key == 18){ return "rightalt"; }
	if(key == 91){ return "rightwinkey"; }
	if(key == 93){ return "menu"; }
	if(key == 17){ return "rightctrl"; }
	if(key == 38){ return "up"; }
	if(key == 40){ return "down"; }
	if(key == 37){ return "left"; }
	if(key == 39){ return "right"; }
	if(key == 12){ return "kp_5"; }
	return key;
}

///////////////////////////////
function DKInput_Highlight(div)
{
	DKDEBUGFUNC(div);
	if(!div){ return; }
	if(!document.getElementById(div)){ return; }
	document.getElementById(div).style.backgroundColor = "rgba(0,255,0,"+rgba+")";
	if(div == "Shift"){ document.getElementById("Shift2").style.backgroundColor = "rgba(0,255,0,0.5)"; }
	if(div == "Meta"){ document.getElementById("Meta2").style.backgroundColor = "rgba(0,255,0,0.5)"; }
	if(div == "Control"){ document.getElementById("Control2").style.backgroundColor = "rgba(0,255,0,0.5)"; }
	if(div == "Alt"){ document.getElementById("Alt2").style.backgroundColor = "rgba(0,255,0,0.5)"; }
	if(div == "Enter"){ document.getElementById("Enter2").style.backgroundColor = "rgba(0,255,0,0.5)"; }
}

/////////////////////////////////
function DKInput_UnHighlight(div)
{
	DKDEBUGFUNC(div);
	if(!div){ return; }
	if(!document.getElementById(div)){ return; }
	document.getElementById(div).style.backgroundColor = "rgba(0,255,0,0)";
	if(div == "Shift"){ document.getElementById("Shift2").style.backgroundColor = "rgba(0,255,0,0)"; }
	if(div == "Meta"){ document.getElementById("Meta2").style.backgroundColor = "rgba(0,255,0,0)"; }
	if(div == "Control"){ document.getElementById("Control2").style.backgroundColor = "rgba(0,255,0,0)"; }
	if(div == "Alt"){ document.getElementById("Alt2").style.backgroundColor = "rgba(0,255,0,0)"; }
	if(div == "Enter"){ document.getElementById("Enter2").style.backgroundColor = "rgba(0,255,0,0)"; }
}