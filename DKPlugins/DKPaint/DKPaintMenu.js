///////////////////////////
function DKPaintMenu_Init()
{
	DKCreate("DKPaint/DKPaintMenu.html");
	DKAddEvent("window", "mousedown", DKPaintMenu_OnEvent);
	DKAddEvent("DKPaintMenu_Cut", "click", DKPaintMenu_OnEvent);
	DKAddEvent("DKPaintMenu_Copy", "click", DKPaintMenu_OnEvent);
	DKAddEvent("DKPaintMenu_Paste", "click", DKPaintMenu_OnEvent);
}

//////////////////////////
function DKPaintMenu_End()
{
	DKRemoveEvents(DKPaintMenu_OnEvent);
	DKClose("DKPaint/DKPaintMenu.html");
}

///////////////////////////////////
function DKPaintMenu_OnEvent(event)
{
	if(event.currentTarget.id == "DKPaintMenu_Cut"){
		DKPaintMenu_Cut();
	}
	if(event.currentTarget.id == "DKPaintMenu_Copy"){
		DKPaintMenu_Copy();
	}
	if(event.currentTarget.id == "DKPaintMenu_Paste"){
		DKPaintMenu_Paste();
	}
	
	if(event.currentTarget == window){
		if(byId("DKPaint/DKPaintMenu.html").contains(DKWidget_GetHoverElement())){
			return;
		}
	}
	DKClose("DKPaintMenu.js");
}

//////////////////////////
function DKPaintMenu_Cut()
{

}

///////////////////////////
function DKPaintMenu_Copy()
{
	
}

////////////////////////////
function DKPaintMenu_Paste()
{
	
}