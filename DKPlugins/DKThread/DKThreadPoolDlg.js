///////////////////////////////
function DKThreadPoolDlg_Init()
{
	DK_Create("DKThreadPool");
	//if(!DKCPP_DKDuktape_Valid("DKWidgetJS,DKWidgetJS0")){ return; }  //FIXME: This was here for a reason.
	DK_Create("DKThread/DKThreadPoolDlg.html"); 
	byId("DKThread/DKThreadPoolDlg.html").addEventListener("Update", DKThreadPoolDlg_OnEvent);
}

//////////////////////////////
function DKThreadPoolDlg_End()
{
	byId("DKThread/DKThreadPoolDlg.html").removeEventListener("Update", DKThreadPoolDlg_OnEvent);
	DK_Close("DKThread/DKThreadPoolDlg.html");
}

///////////////////////////////////////
function DKThreadPoolDlg_OnEvent(event)
{
	if(DK_Type(event, "Update")){
		DKThreadPoolDlg_OnUpdate();
	}
}

///////////////////////////////////
function DKThreadPoolDlg_OnUpdate()
{
	if(!DKCPP_DKDuktape_Valid("DKWidgetJS,DKWidgetJS0")){ return; }
	console.log("Update DKThreadPool\n");
	byId("DKThreadPoolDlg.html").innerHTML = "";

	var name = DKThread_GetThreadNames();
	var names = name.split(",");
	if(names[0]){
		byId("DKThreadPoolDlg.html").style.display = "block";
		byId("DKThreadPoolDlg.html").style.visibility = "visible";
	}
	else{
		byId("DKThreadPoolDlg.html").style.display = "none";
	}
	for(var i=0; i<names.length; ++i){
		var div = DKWidget_CreateElement(byId("DKThreadPoolDlg.html"), "div", "Thread");
		byId(div).style.width = "100%";
		byId(div).style.height = "20rem";
		byId(div).style.whiteSpace = "nowrap";

		if(i === 0){
			byId(div).innerHTML = "<img id=\"DKThreadWorking\" style=\"display:inline;\" src=\"DKThread/working.gif\"></img>"+names[i];
		}
		else{
			byId(div).innerHTML = names[i];
		}
	}
}