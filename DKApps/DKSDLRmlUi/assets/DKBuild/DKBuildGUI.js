//////////////////////////
function DKBuildGUI_Init()
{
	//DK_Create("DKBuild/DKBuild.js", function(){});
	DK_Create("DKBuild/DKBuildGUI.html", function(){
	DK_Create("DKFile/DKFile.js", function(){
	DK_Create("DKBuild/DKBuild.js", function(rval){
		//byId("AppList").addEventListener("click", DKBuildGUI_OnEvent);
		byId("AppList").addEventListener("change", DKBuildGUI_OnEvent);
		byId("OSList").addEventListener("change", DKBuildGUI_OnEvent);
		byId("BuildType").addEventListener("change", DKBuildGUI_OnEvent);
		byId("git").addEventListener("click", DKBuildGUI_OnEvent);
		byId("libraries").addEventListener("click", DKBuildGUI_OnEvent);
		byId("build").addEventListener("click", DKBuildGUI_OnEvent);
	
		//DKBuild_ValidateSvn();
		DK_Create("DKGit/DKGit.js", function(){
			//DKGit_ValidateGit();
		});
		DKBuild_ValidateCmake();
		DKBuild_ValidateVC2019();

		/*
		if(DK_GetOS() === "Win32" ||  DK_GetOS() === "Win64"){
			DKWidget_SetValue("OSList", "win32");
		}
		if(DK_GetOS() === "Mac"){
			DKWidget_SetValue("OSList", "mac64");
		}	
		if(DK_GetOS() === "Linux"){
			DKWidget_SetValue("OSList", "linux64");
		}	

		if(DK_GetOS() === "Linux"){
			DKWidget_SetValue("BuildType", "Release");
		}
		else{
			DKWidget_SetValue("BuildType", "ALL");
		}
	
		if(DK_GetOS() === "Android"){ return; } //FIXME - android not ready
		*/
		
		DKBuildGUI_UpdateApps();
	});
	});
	});
}

/////////////////////////
function DKBuildGUI_End()
{
	byId("AppList").removeEventListener("change", DKBuildGUI_OnEvent);
	byId("OSList").removeEventListener("change", DKBuildGUI_OnEvent);
	byId("BuildType").removeEventListener("change", DKBuildGUI_OnEvent);
	byId("git").removeEventListener("click", DKBuildGUI_OnEvent);
	byId("libraries").removeEventListener("click", DKBuildGUI_OnEvent);
	byId("build").removeEventListener("click", DKBuildGUI_OnEvent);
	DK_Close("DKBuild/DKBuildGUI.html");
	DK_Close("DKBuild/DKBuild.js");
}

//////////////////////////////////
function DKBuildGUI_OnEvent(event)
{
	//console.log("DKBuildGUI_OnEvent("+event.currentTarget.id+","+event.type+","+event.value+")\n");
	
	if(event.currentTarget.id === "AppList"){
		//if(DK_Type(event,"click")){
		//	DKBuildGUI_UpdateApps();
		//}
		if(event.type === "change"){
			DKBuildGUI_AppSelect();
		}
	}
	if(event.currentTarget.id === "OSList"){
		DKBuildGUI_OsSelect();
	}
	if(event.currentTarget.id === "BuildType"){
		DKBuildGUI_BuildSelect();
	}
	if(event.currentTarget.id === "git"){
		DK_Create("DKGit/GitMenu.js", function(){
			DKMenu_ValidatePosition("DKGit/GitMenu.html");
		});
	}
	if(event.currentTarget.id === "libraries"){
		DK_Create("DKBuild/LibraryMenu.js", function(){
			DKMenu_ValidatePosition("DKBuild/LibraryMenu.html");
		});
	}
	if(event.currentTarget.id === "build"){
		DK_Create("DKBuild/RunMenu.js", function(){
			DKMenu_ValidatePosition("DKBuild/RunMenu.html");
		});
	}		
	
	/*
	if(event.type === "NewApp"){
		DKSendEvent("DKBuildGUI", "NewApp", DK_GetValue(event));
		DKWidget_SetValue("AppList", DK_GetValue(event));
		//DKSendEvent("MenuRight.html", "SetPanel", "App");

		//var apppath = DK_CallFunc("DKBuildGUI::GetAppPath", DKWidget_GetValue("AppList"));
		//DK_Create("AppExplorer.js");
		//DKSendEvent("AppExplorer.html", "UpdateAppExplorer", apppath);
	}
	*/
}

////////////////////////////////
function DKBuildGUI_UpdateApps()
{
	////////  Update App List /////////////
	byId("AppList").innerHTML === "";	
	DKBuild_GetAppList();
	
	for(var i=0; i<APP_LIST.length; ++i){
		//console.log(APP_LIST[i]+"\n");
		var ele = DKWidget_CreateElement(byId("AppList"), "option", "al");
		byId(ele).innerHTML = APP_LIST[i];
		byId(ele).value = APP_LIST[i];
		//DKWidget_SetValue("AppList", "DKBuilder");
	}
}

///////////////////////////////
function DKBuildGUI_AppSelect()
{
	// We can send events to classes that are not of DKWidget as well.
	if(DKWidget_GetValue("AppList") === "NEW APP"){
		DK_Create("DKMessage/DKMessage.js", function(){
			DKSendEvent("DKMessage.html", "GetInput", "NewApp,DKBuildGUI.html"); // To -> DKMessageBox
		});
		return;
	}
	
	APP = DKWidget_GetValue("AppList");
	//console.log("APP = "+APP+"\n");
	//var apppath = DK_CallFunc("DKBuildGUI::GetAppPath", DKWidget_GetValue("AppList"));
	
	//DKSendEvent("DKMenuRight.html", "SetPanel", "App");
	//DKSendEvent("DKMenuRightApp.html", "Update", "");
	//DKSendEvent("DKMenuRightWeb.html", "Update", "");
}

//////////////////////////////
function DKBuildGUI_OsSelect()
{
	OS = DKWidget_GetValue("OSList");
	console.log("OS = "+OS+"\n");
}

/////////////////////////////////
function DKBuildGUI_BuildSelect()
{
	TYPE = DKWidget_GetValue("BuildType");
	console.log("TYPE = "+TYPE+"\n");
}

/*
//////////////////////////////////
function DKBuildGUI_UpdateLibs()
{
	///// Update Libraries
	byId("LibList").innerHTML = ""; //clear

	return;
	var result = DK_CallFunc("DKBuildGUI::GetLibList", "");
	console.log("Result:"+result);
	
	var libs = result.split(",");
	
	//Add Libraries
	var id = DKWidget_CreateElement(byId("LibList"), "option", "BuildLibraries");
	byId(id).value = "Build All Libraries";
	byId(id).innerHTML = "Build All Libraries";
	byId(id).addEventListener("click", DKBuildGUI_OnEvent);

	for(i=0; i<libs.length; ++i){
		var id2 = DKWidget_CreateElement(byId("LibList"), "option", "LIBRARY");
		byId(id2).value = libs[i]);
		byId(id2).innerHTML = libs[i];
		byId(id2).addEventListener("click", DKBuildGUI_OnEvent);
	}
}
*/