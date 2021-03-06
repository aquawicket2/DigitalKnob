///////////////////////
function SvnMenu_Init()
{
	DK_Create("DKBuild/SvnMenu.html");
	byId("SvnMenu.html").style.top = DKWindow_GetMouseY()+"px";
	byId("SvnMenu.html").style.left = DKWindow_GetMouseX()+"px";
	document.addEventListener("mousedown", SvnMenu_OnEvent);
	byId("Svn Update").addEventListener("click", SvnMenu_OnEvent);
	byId("Svn Commit").addEventListener("click", SvnMenu_OnEvent);
}

//////////////////////
function SvnMenu_End()
{
	document.addEventListener("mousedown", SvnMenu_OnEvent);
	byId("Svn Update").addEventListener("click", SvnMenu_OnEvent);
	byId("Svn Commit").addEventListener("click", SvnMenu_OnEvent);
	DK_Close("DKBuild/SvnMenu.html");
}

///////////////////////////////
function SvnMenu_OnEvent(event)
{
	console.debug("SvnMenu_OnEvent("+event.currentTarget.id+","+event.type+","+event.value+")\n");
	if(event.currentTarget.id === "Svn Update"){
		DKThread_DKQueue("SvnUpdate","DKBuild_SvnUpdate();");
	}
	if(event.currentTarget.id === "Svn Commit"){
		DKThread_DKQueue("SvnCommit","DKBuild_SvnCommit();");
	}
	
	if(event.currentTarget === document){
		if(byId("SvnMenu.html").contains(document.elementFromPoint(window.mouseX, window.mouseY))){	
			return;
		}
	}
	DK_Close("DKBuild/SvnMenu.js");
}