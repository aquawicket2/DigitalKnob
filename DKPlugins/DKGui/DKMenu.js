
//////////////////////
function DKMenu_Init()
{
	
}

/////////////////////
function DKMenu_End()
{

}

//////////////////////////////
function DKMenu_OnEvent(event)
{

}

////////////////////////////////////
function DKMenu_ValidatePosition(id)
{
	console.log("DKMenu_ValidatePosition("+id+")");
	//console.log("DKWindow_GetMouseX() = "+DKWindow_GetMouseX()+"\n");
	//console.log("DKWindow_GetMouseY() = "+DKWindow_GetMouseY()+"\n");
	//byId(id).style.top = DKWindow_GetMouseY()+"px";
	//byId(id).style.top = DKWindow_GetMouseY()+"rem";
	//byId(id).style.left = DKWindow_GetMouseX()+"px";
	//byId(id).style.left = DKWindow_GetMouseX()+"rem";
	
	//console.log("DKWidget_GetMouseWindowX() = "+DKWidget_GetMouseWindowX()+"\n");
	//console.log("DKWidget_GetMouseWindowY() = "+DKWidget_GetMouseWindowY()+"\n");
	byId(id).style.top = "100px";//DKWidget_GetMouseWindowY()+"px";
	byId(id).style.top = "100rem";//DKWidget_GetMouseWindowY()+"rem";
	byId(id).style.left = "100px";//DKWidget_GetMouseWindowX()+"px";
	byId(id).style.left = "100rem";//DKWidget_GetMouseWindowX()+"rem";
	DKWidget_RemoveProperty(id, "right");
	
	//make sure menu is within window
	var win_width = Number(document.body.clientWidth);
	var win_height = Number(document.body.clientHeight);
	//var top = Number(DKWidget_GetOffsetTop(id));
	var top = Number(byId(id).offsetTop);
	var left = Number(byId(id).offsetLeft);
	var width = Number(byId(id).clientWidth);
	var height = Number(byId(id).clientHeight);
	
	//console.log("win_width = "+win_width+"\n");
	//console.log("win_height = "+win_height+"\n");
	//console.log("top = "+top+"\n");
	//console.log("left = "+left+"\n");
	//console.log("width = "+width+"\n");
	//console.log("height = "+height+"\n");
	
	if(top + height > win_height){
		top = win_height - height;
		console.log("new top = "+top+"\n");
		byId(id).style.top = top+"px";
	}
	if(left + width > win_width){
		console.log("new left = "+left+"\n");
		left = win_width - width;
		byId(id)style.left = "left+"px";
	}
}