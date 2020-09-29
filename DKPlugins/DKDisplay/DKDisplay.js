/////////////////////////
function DKDisplay_Init()
{
	DKCreate("DKDisplay/DKDisplay.html");
	DKAddEvent("DKDisplay_Button", "click", DKDisplay_OnEvent);
	//DKAddEvent("window", "second", DKDisplay_OnEvent);
	
	//DKAddEvent("DKDisplay/DKDisplay.html", "click", DKDisplay_OnEvent);
}

////////////////////////
function DKDisplay_End()
{
	DKRemoveEvents(DKDisplay_OnEvent);
	DKClose("DKDisplay/DKDisplay.html");
}

/////////////////////////////////
function DKDisplay_OnEvent(event)
{
	console.log("DKDisplay_OnEvent("+event.currentTarget.id+","+event.type+","+event.value+")\n");
	if(event.currentTarget.id == "DKDisplay_Button"){
		DK_TurnOffMonitor();
	}
		
	//if(event.type == "second"){
	//	//tick
	//}
}