var GIT = "";

///////////////////////
function GitMenu_Init()
{
	DK_Create("DKBuild/DKBuild.js", function(){});
	DK_Create("DKThreadPool");

	//console.log(DK_GetOS()+"\n");
	if(DK_GetOS() === "Win32"){
		GIT = "C:/Program Files/Git/bin/git.exe";
		GIT = CPP_DKFile_GetShortName(GIT);
	}
	if(DK_GetOS() === "Win64"){
		GIT = "C:/Program Files/Git/bin/git.exe";
		GIT = DKFile_GetShortName(GIT);
	}
	if(DK_GetOS() === "Mac"){
		GIT = "git";
	}
	if(DK_GetOS() === "Linux"){
		GIT = "/usr/bin/git";
	}

	DK_Create("DKGit/GitMenu.html", function(){
		document.addEventListener("mousedown", GitMenu_OnEvent);
		byId("Git Update").addEventListener("click", GitMenu_OnEvent);
		byId("Git Commit").addEventListener("click", GitMenu_OnEvent);
	});
}

//////////////////////
function GitMenu_End()
{
	document.removeEventListener("mousedown", GitMenu_OnEvent);
	byId("Git Update").removeEventListener("click", GitMenu_OnEvent);
	byId("Git Commit").removeEventListener("click", GitMenu_OnEvent);
	DK_Close("DKGit/GitMenu.html");
}

///////////////////////////////
function GitMenu_OnEvent(event)
{
	if(event.currentTarget.id === "Git Update"){
		CPP_DKThread_DKQueue("GitUpdate","GitMenu_GitUpdate();");
	}
	if(event.currentTarget.id === "Git Commit"){
		CPP_DKThread_DKQueue("GitCommit","GitMenu_GitCommit();");
	}
	
	if(event.currentTarget === document){
		if(byId("DKGit/GitMenu.html").contains(document.elementFromPoint(window.mouseX, window.mouseY))){	
			return;
		}
	}
	DK_Close("DKGit/GitMenu.js");
}

//////////////////////////////
function GitMenu_ValidateGit()
{
	if(DK_GetBrowser() !== "RML"){ return; }
	console.log("Looking for GIT\n");
	//console.log(GIT+"\n");
	if(!CPP_DKFile_Exists(GIT)){
		console.log("Please install GIT\n");
		GitMenu_InstallGit();
	}
	console.log("Found GIT\n");
	if(DK_GetOS() === "Mac"){
		GIT = "git";
	}
}

/////////////////////////////
function GitMenu_InstallGit()
{
	if(DK_GetBrowser() !== "RML"){ return; }
	console.log("Installing Git\n");
	var assets = DKAssets_LocalAssets();
	
	if(DK_GetOS() === "Win32"){
		DKCurl_Download("http://DigitalKnob.com/Download/Tools/Git-2.11.0-32-bit.exe", assets);
		DK_System(assets+"/Git-2.11.0-32-bit.exe");
	}
	else if(DK_GetOS() === "Win64"){
		DKCurl_Download("http://DigitalKnob.com/Download/Tools/Git-2.11.0-64-bit.exe", assets);
		DK_System(assets+"/Git-2.11.0-64-bit.exe");
	}
	else if(DK_GetOS() === "Mac"){
		//TODO
	}
	else if(DK_GetOS() === "Linux"){
		DK_Execute("sudo apt-get install git");
	}
	else{
		console.log("ERROR: unrecognied HOST OS: "+DK_GetOS()+"\n");
	}
}

////////////////////////////
function GitMenu_GitUpdate()
{
	if(DK_GetBrowser() !== "CEF" && DK_GetBrowser() !== "RML"){
		return;
	}
	
	console.log("Git Update DigitalKnob...\n");
	DK_Execute(GIT +" clone https://github.com/aquawicket/DigitalKnob.git "+DKPATH+"/DK");
	CPP_DKFile_ChDir(DKPATH+"/DK");
	DK_Execute(GIT +" checkout -- .");
	DK_Execute(GIT +" pull origin master");
	
	//Multipe user folders
	var contents = CPP_DKFile_DirectoryContents(DKPATH);
	var files = contents.split(",");
	for(var i=0; i<files.length; i++){ //console.log("files["+i+"] = "+files[i]+"\n");
		CPP_DKFile_ChDir(DKPATH);
		if(CPP_DKFile_IsDirectory(files[i])){ continue; }
		var url = CPP_DKFile_GetSetting(files[i], "[MYGIT]");
		if(url){ //console.log("url = "+url+"\n");
			var folder = files[i].replace(".txt",""); //console.log("folder = "+folder+"\n");
			console.log("Git Update "+folder+"...\n");
			DK_Execute(GIT +" clone "+url+" "+DKPATH+"/"+folder);
			DK_Execute(GIT +" checkout -- .");
			DK_Execute(GIT +" pull origin master");
		}
	}
	
	if(CPP_DKDuktape_Available("DKAudio")){
		DK_Create("DKAudio");
	}
	if(CPP_DKDuktape_Valid("DKAudioJS,DKAudioJS0")){
		DKAudio_PlaySound("DKBuild/ding.wav");
	}
}

////////////////////////////
function GitMenu_GitCommit()
{
	if(DK_GetBrowser() !== "CEF" && DK_GetBrowser() !== "RML"){
		return;
	}
	
	console.log("Git Commit DigitalKnob...\n");
	CPP_DKFile_ChDir(DKPATH+"/DK");
	DK_Execute(GIT +" init");
	DK_Execute(GIT +" config user.name \"dkuser\"");
	DK_Execute(GIT +" config user.email \"dkuser@digitalknob.com\"");
	DK_Execute(GIT +" commit -a -m \"commit from git\"");
	DK_Execute(GIT +" config credential.helper store"); //store credentials 
	DK_Execute(GIT +" push");
	
	//Multipe user folders
	var contents = CPP_DKFile_DirectoryContents(DKPATH);
	var files = contents.split(",");
	for(var i=0; i<files.length; i++){ //console.log("files["+i+"] = "+files[i]+"\n");
		CPP_DKFile_ChDir(DKPATH);
		if(CPP_DKFile_IsDirectory(files[i])){ continue; }
		var url = CPP_DKFile_GetSetting(files[i], "[MYGIT]");
		if(url){ //console.log("url = "+url+"\n");
			var folder = files[i].replace(".txt",""); //console.log("folder = "+folder+"\n");
			console.log("Git Commit "+folder+"...\n");
			CPP_DKFile_ChDir(DKPATH+"/"+folder);
			DK_Execute(GIT +" init");
			DK_Execute(GIT +" config user.name \"dkuser\"");
			DK_Execute(GIT +" config user.email \"dkuser@digitalknob.com\"");
			DK_Execute(GIT +" commit -a -m \"commit from git\"");
			DK_Execute(GIT +" config credential.helper store"); //store credentials 
			DK_Execute(GIT +" push");
		}
	}
	
	if(CPP_DKDuktape_Available("DKAudio")){
		DK_Create("DKAudio");
	}
	if(CPP_DKDuktape_Valid("DKAudioJS,DKAudioJS0")){
		DKAudio_PlaySound("DKBuild/ding.wav");
	}
}