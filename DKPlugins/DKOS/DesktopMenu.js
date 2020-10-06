///////////////////////////
function DesktopMenu_Init()
{
	DK_Create("DKOS/DesktopMenu.html");
	//byId("DKOS/DesktopMenu.html").style.top = DKWindow_GetMouseY()+"px";
	//byId("DKOS/DesktopMenu.html").style.left = DKWindow_GetMouseX()+"px";
	byId("DKOS/DesktopMenu.html").style.top = "100px";
	byId("DKOS/DesktopMenu.html").style.left = "100px";
	
	window.addEventListener("mousedown", DesktopMenu_OnEvent);
	byId("OpenBackgtoundMenu").addEventListener("click", DesktopMenu_OnEvent);
	byId("ToggleFullscreen").addEventListener("click", DesktopMenu_OnEvent);
}

//////////////////////////
function DesktopMenu_End()
{
	window.removeEventListener("mousedown", DesktopMenu_OnEvent);
	byId("OpenBackgtoundMenu").removeEventListener("click", DesktopMenu_OnEvent);
	byId("ToggleFullscreen").removeEventListener("click", DesktopMenu_OnEvent);
	DK_Close("DKOS/DesktopMenu.html");
}

///////////////////////////////////
function DesktopMenu_OnEvent(event)
{
	if(event.currentTarget.id === "OpenBackgtoundMenu"){
		DK_Create("DKOS/BackgroundMenu.js", function(){
			DKFrame_Widget("DKOS/BackgroundMenu.html");
		});
	}
	if(event.currentTarget.id === "ToggleFullscreen"){
		Desktop_ToggleFullscreen();
	}
	
	if(event.currentTarget === window){
		if(byId("DKOS/DesktopMenu.html").contains(DKWidget_GetHoverElement())){
			return;
		}
	}
	DK_Close("DKOS/DesktopMenu.js");
}

///////////////////////////////////
function Desktop_ToggleFullscreen()
{
	//TODO: move this function into DKWindow.js
	//http://stackoverflow.com/questions/3900701/onclick-go-full-screen
	if(DKWindow_IsFullscreen()){
		DKWindow_Windowed(); 
	}
	else{
		DKWindow_Fullscreen();
	}
}