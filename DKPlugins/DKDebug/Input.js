/////////////////////
function Input_Init()
{
	DK_Create("DKDebug/Input.html");
	byId("Input_Text").addEventListener("keydown", Input_OnEvent);
}

////////////////////
function Input_End()
{
	byId("Input_Text").removeEventListener("keydown", Input_OnEvent);
	DK_Close("DKDebug/Input.html");
}

/////////////////////////////
function Input_OnEvent(event)
{
	DKDEBUG("Input_OnEvent("+event.currentTarget.id+","+event.type+","+event.value+")\n");
	if(event.currentTarget.id === "Input_Text"){
		if(event.code === "Enter"){ return; }
		Input_Run(byId("Input_Text").value)
	}
}

///////////////////////////
function Input_Run(command)
{
	DK_RunDuktape(command);
}