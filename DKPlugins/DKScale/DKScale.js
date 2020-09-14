var pixel_ratio = 1.0;

///////////////////////
function DKScale_Init()
{
	DKDEBUGFUNC();
	DKAddEvent("window", "resize", DKScale_OnEvent);
	DKScale_Resize();
}

//////////////////////
function DKScale_End()
{
	DKDEBUGFUNC();
	DKRemoveEvents(DKScale_OnEvent);
}

///////////////////////////////
function DKScale_OnEvent(event)
{
	DKDEBUGFUNC(event);
	if(event.type == "resize"){
		DKScale_Resize();
	}
}

/////////////////////////
function DKScale_Resize()
{
	DKDEBUGFUNC();
	//DKINFO(("DKScale_Resize()\n");
    //DKINFO(("DKWindow_GetPixelRatio() = "+DKWindow_GetPixelRatio()+"\n");
	//DKINFO(("DKWindow_GetWidth() = "+DKWindow_GetWidth()+"\n");
	//DKINFO(("DKWindow_GetHeight() = "+DKWindow_GetHeight()+"\n");
	
	if(pixel_ratio == DKWindow_GetPixelRatio()){ return true; } //nothing to be done
	pixel_ratio = DKWindow_GetPixelRatio();

	//Set the scale
	/*
	if((parseInt(DKWindow_GetHeight()) > parseInt(DKWindow_GetWidth()))){
		if(pixel_ratio > 1.0){//= Math.min(2, pixel_ratio);
			var ratio = 2.0;
			DKWidget_SetProperty("html", "font-size", ratio+"px");
			DKINFO(("DKScale_Resize(): scale set to "+ratio+"px\n");
		}
	}
	else{
		DKWidget_SetProperty("html", "font-size", "1px");
		DKINFO(("DKScale_Resize(): scale set to 1px\n");
	}
	*/
}