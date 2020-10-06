////////////////////////////
function DKMidiDialog_Init()
{
	DK_Create("DKMidi/DKMidiDialog.css");
	DK_Create("DKMidi/DKMidiDialog.html");
	//DKMidiDialog_UpdatePorts();
}

///////////////////////////
function DKMidiDialog_End()
{
	//DKRemoveEvents(DKMidiDialog_OnEvent);
	DKClose("DKMidi/DKMidiDialog.html");
	DKClose("DKMidi/DKMidiDialog.css");
}

////////////////////////////////////
function DKMidiDialog_OnEvent(event)
{
	if(event.currentTarget.id.includes("DKMidiDialogInput")){
		DKMidiDialog_ToggleInput(DK_GetValue(event));
		return;
	}

	if(event.currentTarget.id.includes("DKMidiDialogOutput")){
		DKMidiDialog_ToggleOutput(DK_GetValue(event));
		return;
	}
}

///////////////////////////////////
function DKMidiDialog_UpdatePorts()
{
	var inputs = DKMidi_GetMidiInputs();
	var list = inputs.split(",");
	byId("DKMidiDialogInputs").innerHTML = "";
	for(var i=0; i<list.length; i++){
		var element = DKWidget_CreateElement(byId("DKMidiDialogInputs"), "option", "DKMidiDialogInput");
		byId(element).value = list[i];
		byId(element).addEventListener("click", DKMidiDialog_OnEvent);
		byId(element).innerHTML = list[i];
	}

	var outputs = DKMidi_GetMidiOutputs();
	var outlist = outputs.split(",");
	byId("DKMidiDialogOutputs").innerHTML = "";
	for(var i=0; i<outlist.length; i++){
		var element = DKWidget_CreateElement(byId("DKMidiDialogOutputs"), "option", "DKMidiDialogOutput");
		byId(element).value = outlist[i];
		byId(element).addEventListener("click", DKMidiDialog_OnEvent);
		byId(element).innerHTML = outlist[i];
	}
	return true;
}

///////////////////////////////////////
function DKMidiDialog_ToggleInput(name)
{
	if(!DKMidi_ToggleMidiInput(name)){ return false; }
	return true;
}

////////////////////////////////////////
function DKMidiDialog_ToggleOutput(name)
{
	if(!DKMidi_ToggleMidiOutput(name)){ return false; }
	return true;
}