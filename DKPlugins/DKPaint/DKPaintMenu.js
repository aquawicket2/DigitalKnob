///////////////////////////
function DKPaintMenu_Init()
{
	DK_Create("DKPaint/DKPaintMenu.html");
	document.addEventListener("mousedown", DKPaintMenu_OnEvent);
	byId("DKPaintMenu_Cut").addEventListener("click", DKPaintMenu_OnEvent);
	byId("DKPaintMenu_Copy").addEventListener("click", DKPaintMenu_OnEvent);
	byId("DKPaintMenu_Paste").addEventListener("click", DKPaintMenu_OnEvent);
}

//////////////////////////
function DKPaintMenu_End()
{
	document.removeEventListener("mousedown", DKPaintMenu_OnEvent);
	byId("DKPaintMenu_Cut").removeEventListener("click", DKPaintMenu_OnEvent);
	byId("DKPaintMenu_Copy").removeEventListener("click", DKPaintMenu_OnEvent);
	byId("DKPaintMenu_Paste").removeEventListener("click", DKPaintMenu_OnEvent);
	DK_Close("DKPaint/DKPaintMenu.html");
}

///////////////////////////////////
function DKPaintMenu_OnEvent(event)
{
	if(event.currentTarget.id === "DKPaintMenu_Cut"){
		DKPaintMenu_Cut();
	}
	if(event.currentTarget.id === "DKPaintMenu_Copy"){
		DKPaintMenu_Copy();
	}
	if(event.currentTarget.id === "DKPaintMenu_Paste"){
		DKPaintMenu_Paste();
	}
	
	if(event.currentTarget === document){
		if(byId("DKPaint/DKPaintMenu.html").contains(document.elementFromPoint(window.mouseX, window.mouseY))){
			return;
		}
	}
	DK_Close("DKPaintMenu.js");
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