///////////////////////
function DKStats_Init()
{
	//DKLog("DKStats_Init()\n");
	
	DKCreate("DKStats/DKStats.html");
	DKAddEvent("GLOBAL", "second", DKStats_OnEvent);
	//DKAddEvent("DKStats/DKStats.html", "click", DKStats_OnEvent);
}

//////////////////////
function DKStats_End()
{
	//DKLog("DKStats_End()\n");
	
	DKRemoveEvents(DKStats_OnEvent);
	DKClose("DKStats/DKStats.html");
}

///////////////////////////////
function DKStats_OnEvent(event)
{
	//DKLog("DKStats_OnEvent("+DK_GetId(event)+","+DK_GetType(event)+","+DK_GetValue(event)+")\n");
	
	if(DK_Type(event, "second")){
		DKStats_Update();
	}
}

/////////////////////////
function DKStats_Update()
{
	//TIME
	var currentdate = new Date(); 
	var datetime = (currentdate.getMonth()+1) + "/"
                + currentdate.getDate() + "/" 
                + currentdate.getFullYear() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
	DKWidget_SetInnerHtml("DKStats_time", "TIME: "+datetime);
				
	//CPU%
	var cpu = DK_CpuUsedByApp();
	DKWidget_SetInnerHtml("DKStats_cpu", "CPU: "+cpu+"%");
	
	//RAM usage
	var ram = DK_PhysicalMemoryUsedByApp();
	DKWidget_SetInnerHtml("DKStats_ram", "RAM: "+ram+"MB");
}