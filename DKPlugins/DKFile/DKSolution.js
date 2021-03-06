//////////////////////////
function DKSolution_Init()
{	
	DK_Create("DKFile/DKSolution.css");
	DK_Create("DKFile/DKSolution.html");
	DK_Create("DKFile/DKFileAssociation.js", function(){});
	byId("DKSolutionUp").addEventListener("click", DKSolution_OnEvent);
	byId("DKSolutionMenu").addEventListener("click", DKSolution_OnEvent);
	byId("DKSolutionMenu").addEventListener("contextmenu", DKSolution_OnEvent);
	byId("DKSolutionPath").addEventListener("keypress", DKSolution_OnEvent);
	
	//DKSolution_OpenFolder(byId("DKSolutionPath").value);
}

/////////////////////////
function DKSolution_End()
{
	byId("DKSolutionUp").removeEventListener("click", DKSolution_OnEvent);
	byId("DKSolutionMenu").removeEventListener("click", DKSolution_OnEvent);
	byId("DKSolutionMenu").removeEventListener("contextmenu", DKSolution_OnEvent);
	byId("DKSolutionPath").removeEventListener("keypress", DKSolution_OnEvent);
	DK_Close("DKFile/DKSolution.html");
	DK_Close("DKFile/DKSolution.css");
}

//////////////////////////////////
function DKSolution_OnEvent(event)
{	
	console.debug("DKSolution_OnEvent("+event.currentTarget.id+","+event.type+","+event.value+")");
	DKSolution_Select(event.currentTarget.id);

	if(event.currentTarget.id === "click"){
		DK_StopPropagation(event);
	}
	
	if(event.type === "contextmenu"){
		//console.log("DKSolution_OnEvent() contextmenu\n");
		//PreventDefault(event);
		
		var id = event.currentTarget.id;
		//console.log("id = "+id+"\n");
		event.stopPropagation();
		event.preventDefault();
		DK_Create("DKFile/DKSolutionMenu.js", function(){
			DKMenu_ValidatePosition("DKFile/DKSolutionMenu.html");
			var file = byId(id).value;
			//console.log("file = "+file+"\n");
			if(!file){
				file = byId("DKSolutionPath").value+"/";
			}
			DKSolutionMenu_SetId(id);
			DKSolutionMenu_SetFile(file);
		});
		return;
	}
		
	if(event.currentTarget.id === "DKSolutionUp"){
		var up = byId("DKSolutionPath").value+"/../";
		//console.log(up+"\n");
		DKSolution_OpenFolder(up);
	}
	
	if(event.type === "dblclick"){
		//console.log(DK_GetId(event)+"\n");
		//console.log(DK_GetValue(DK_GetId(event))+"\n");
		if(event.currentTarget.id.includes("DKSolutionFolder")){
			//console.log("DKSolutionFolder\n");
			DKSolution_OpenFolder(byId(event.currentTarget.id).value);
			return;
		}
	
		DKSolution_OpenFile(byId(event.currentTarget.id).value);
		//DK_ClearSelection();
		return;
	}
	
	if(event.currentTarget.id === "DKSolutionPath"){
		if(DK_GetValue(event) === 13){ //enter
			DKSolution_OpenFolder(byId("DKSolutionPath").value);
		}
	}
}

//////////////////////////////
function DKSolution_Select(id)
{
	var elements = DK_GetElements(byId("DKSolutionMenu"));
	var arry = elements.split(",");
	for(var i=0; i<arry.length-1; i++){
		if(!arry[i]){
			console.error("DKSolution_Select(id): arry["+i+"] invalid\n");
		}
		byId(arry[i]).style.backgroundColor = "rgb(255,255,255)";
		byId(arry[i]).style.color = "rgb(0,0,0)";
	}
	if(id.indexOf("DKSolutionFolder") > -1 || id.indexOf("DKSolutionFile") > -1){
		byId(id).style.backgroundColor = "rgb(123,157,212)";
		byId(id).style.color = "rgb(255,255,255)";
	}
}

////////////////////////////////////
function DKSolution_OpenFolder(path)
{
	if(DKSolution_UpdatePath(path)){
		return true;
	}
	return false;
}

//////////////////////////////////
function DKSolution_OpenFile(path)
{
	var aPath = path;
	if(DK_GetOS() !== "Android"){
		aPath = DKFile_GetAbsolutePath(path);
	}
	//console.log("DKSolution_OpenFile("+path+"): aPath = "+aPath+"\n");
	if(!CPP_DKDuktape_Run(aPath, "")){ return false; }
	return true;
}

//////////////////////////////////
function DKSolution_OpenHere(path)
{
	var aPath = path;
	if(DK_GetOS() !== "Android"){
		aPath = CPP_DKFile_GetAbsolutePath(path);
		if(typeof(absolutepath) === 'string'){ aPath = aPath.replace(absolutepath, ""); }
	}
	//console.log("aPath:"+aPath+"\n");
	if(CPP_DKFile_IsDirectory(aPath)){ //Folder
		if(!DKSolution_UpdatePath(aPath)){ return false; }
		return true;
	}
	else{ //File
		if(!DKFileAssociation_Open(aPath)){ return false; }
		return true;
	}
	
	return false; //error
}

////////////////////////////////////
function DKSolution_UpdatePath(path)
{
	console.log("DKSolution_UpdatePath("+path+")");
	
	//reload events
	byId("DKSolutionUp").addEventListener("click", DKSolution_OnEvent);
	byId("DKSolutionMenu").addEventListener("click", DKSolution_OnEvent);
	byId("DKSolutionMenu").addEventListener("contextmenu", DKSolution_OnEvent);
	byId("DKSolutionPath").addEventListener("keypress", DKSolution_OnEvent);
	
	if(!path){ path = ""; }
	var aPath = path;
	/*
	var aPath;
	if(DK_GetOS() !== "Android"){
		aPath = DKFile_GetAbsolutePath(path);
	}
	*/
	
	//console.log("aPath:"+aPath+"\n");
	//var rPath = CPP_DKFile_GetRelativePath(aPath, path);
	//console.log("rPath:"+rPath+"\n");
	
	var temp = DKFile_DirectoryContents(aPath);
	if(!temp){ return false; }
	var files = temp.split(",");

	byId("DKSolutionMenu").innerHTML = ""; //Clear it

	for(var d=0; d<files.length; d++){
		if(DKFile_IsDirectory(aPath+"/"+files[d])){ //Folders
			var element2 = DK_CreateElement(byId("DKSolutionMenu"), "div", "DKSolutionFolder");
			element2.setAttribute("class", "option");
			var value = aPath+"/"+files[d]+"/";
			element2.setAttribute("value", value);
			element2.style.whiteSpace = "nowrap";
			element2.addEventListener("click", DKSolution_OnEvent);
			element2.style.paddingLeft = "17px";
			element2.innerHTML = files[d];
			element2.style.backgroundImage = "url(\"DKFile/folder.png\")";
			element2.style.backgroundRepeat = "no-repeat";
			element2.addEventListener("click", DKSolution_OnEvent);
			element2.addEventListener("dblclick", DKSolution_OnEvent);
			element2.addEventListener("contextmenu", DKSolution_OnEvent);
		}
	}

	for(var f=0; f<files.length; f++){
		if(!DKFile_IsDirectory(aPath+"/"+files[f])){ //Files
			var element3 = DK_CreateElement(byId("DKSolutionMenu"), "div", "DKSolutionFile");
			element3.setAttribute("class", "option");
			var value = aPath+"/"+files[f];
			element3.setAttribute("value", value);
			element3.style.whiteSpace = "nowrap";
			element3.style.paddingLeft = "17px";
			element3.style.backgroundRepeat = "no-repeat";
			element3.innerHTML = files[f];
			element3.addEventListener("click", DKSolution_OnEvent);
			element3.addEventListener("dblclick", DKSolution_OnEvent);
			element3.addEventListener("contextmenu", DKSolution_OnEvent);

			var extension = DKFile_GetExtention(files[f]);
			if((extension === "png") || (extension === "jpeg") || (extension === "jpg") || 
				(extension === "bmp") || (extension === "tiff") || (extension === "tif") || 
				(extension === "gif") || (extension === "tga") || (extension === "ico")
				){
				element3.style.backgroundImage = "url(\"DKFile/picture.png\")";
			}
			else if((extension === "osg") || (extension === "osgb") || (extension === "osgt") ||
				(extension === "3dm") || (extension === "3ds") || (extension === "ac") ||
				(extension === "ascii") || (extension === "blend")  || (extension === "bvh") ||
				(extension === "c4d") || (extension === "dae") || (extension === "dds") ||
				(extension === "dgn") || (extension === "dwg") || (extension === "dxf") ||
				(extension === "fbx") || (extension === "lwo") || (extension === "lws") ||
				(extension === "ma") || (extension === "max") || (extension === "mb") ||
				(extension === "mesh") || (extension === "mtl") || (extension === "obj") ||
				(extension === "pov") || (extension === "skp") || (extension === "stl") ||
				(extension === "ztl")
			){
				element3.style.backgroundImage = "url(\"DKFile/cube.png\")";
			}
			else if((extension === "js")){
				element3.style.backgroundImage = "url(\"DKFile/js.png\")";
			}
			else if((extension === "sln")){
				element3.style.backgroundImage = "url(\"DKFile/sln.png\")";
			}
			else if((extension === "html") || (extension === "htm")){
				element3.style.backgroundImage = "url(\"DKFile/html.png\")";
			}
			else{
				element3.style.backgroundImage = "url(\"DKFile/file.png\")";
			}
		}
	}
	
	byId("DKSolutionPath").value = aPath;
	return true;
}