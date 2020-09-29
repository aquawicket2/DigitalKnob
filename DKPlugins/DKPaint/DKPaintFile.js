/////////////////////////////
function DKPaintFile_Init()
{
	DKCreate("DKPaint/DKPaintFile.html,DKPaint/DKPaint.html");
	DKAddEvent("window", "mousedown", DKPaintFile_OnEvent);
	DKAddEvent("DKPaintFile_Open", "click", DKPaintFile_OnEvent);
	DKAddEvent("DKPaintFile_Save", "click", DKPaintFile_OnEvent);
	DKAddEvent("DKPaintFile_Save As", "click", DKPaintFile_OnEvent);
	DKAddEvent("DKPaintFile_Exit", "click", DKPaintFile_OnEvent);
}

//////////////////////////
function DKPaintFile_End()
{
	DKRemoveEvents(DKPaintFile_OnEvent);
	DKClose("DKPaint/DKPaintFile.html");
}

///////////////////////////////////
function DKPaintFile_OnEvent(event)
{
	if(event.currentTarget.id == "DKPaintFile_Open"){
		DKPaintFile_Open();
	}
	if(event.currentTarget.id == "DKPaintFile_Save"){
		DKPaintFile_Save();
	}
	if(event.currentTarget.id == "DKPaintFile_SaveAs"){
		DKPaintFile_SaveAs();
	}
	if(event.currentTarget.id == "DKPaintFile_Exit"){
		DKClose("DKPaint/DKPaintFile.js");
		DKFrame_Close("DKPaint/DKPaint.html");
	}
	
	if(event.currentTarget == window){
		if(byId("DKPaint/DKPaintFile.html").contains(DKWidget_GetHoverElement())){
			return;
		}
	}
	DKClose("DKPaint/DKPaintFile.js");
}

///////////////////////////
function DKPaintFile_Open()
{
	DKCreate("DKFile/DKOpenFile.js", function(){
		DKFrame_Widget("DKFile/DKOpenFile.html");
		DKSendEvent("DKFile/DKOpenFile.html", "GetFile", "DKPaint/DKPaint.html,OpenFile,/,absolute"); // To -> DKOpenFile
	});
}

///////////////////////////
function DKPaintFile_Save()
{

}

/////////////////////////////
function DKPaintFile_SaveAs()
{
	
}