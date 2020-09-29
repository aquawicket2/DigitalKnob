/////////////////////////////
function DKNotepadHelp_Init()
{
	DKCreate("DKNotepad/DKNotepadHelp.html,DKNotepad/DKNotepad.html");
	//DKAddEvent("window", "mousedown", DKNotepadHelp_OnEvent);
	window.addEventListener("mousedown", DKNotepadHelp_OnEvent);
	//DKAddEvent("DKNotepadHelp_ViewHelp", "click", DKNotepadHelp_OnEvent);
	byId("DKNotepadHelp_ViewHelp").addEventListener("click", DKNotepadHelp_OnEvent);
	//DKAddEvent("DKNotepadHelp_About", "click", DKNotepadHelp_OnEvent);
	byId("DKNotepadHelp_About").addEventListener("click", DKNotepadHelp_OnEvent);
}

////////////////////////////
function DKNotepadHelp_End()
{
	//DKRemoveEvents(DKNotepadHelp_OnEvent);
	window.removeEventListener("mousedown", DKNotepadHelp_OnEvent);
	byId("DKNotepadHelp_ViewHelp").removeEventListener("click", DKNotepadHelp_OnEvent);
	byId("DKNotepadHelp_About").removeEventListener("click", DKNotepadHelp_OnEvent);
	DKClose("DKNotepad/DKNotepadHelp.html");
}

/////////////////////////////////////
function DKNotepadHelp_OnEvent(event)
{
	if(event.currentTarget.id == "DKNotepadHelp_ViewHelp"){
		console.log("DKNotepadHelp_ViewHelpn");
	}
	if(event.currentTarget.id == "DKNotepadHelp_About"){
		console.log("DKNotepadHelp_About");
	}
	
	if(event.currentTarget == window){
		if(byId("DKNotepad/DKNotepadHelp.html").contains(DKWidget_GetHoverElement())){
			return;
		}
	}
	DKClose("DKNotepad/DKNotepadHelp.js");
}