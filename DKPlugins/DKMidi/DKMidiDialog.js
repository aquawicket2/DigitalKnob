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
	DK_Close("DKMidi/DKMidiDialog.html");
	DK_Close("DKMidi/DKMidiDialog.css");
}

////////////////////////////////////
function DKMidiDialog_OnEvent(event)
{
	if(event.currentTarget.id.includes("DKMidiDialogInput")){
		DKMidiDialog_ToggleInput(DKWidget_GetValue(event));
		return;
	}

	if(event.currentTarget.id.includes("DKMidiDialogOutput")){
		DKMidiDialog_ToggleOutput(DKWidget_GetValue(event));
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
		var element = DK_CreateElement(byId("DKMidiDialogInputs"), "option", "DKMidiDialogInput");
		element.value = list[i];
		element.addEventListener("click", DKMidiDialog_OnEvent);
		element.innerHTML = list[i];
	}

	var outputs = DKMidi_GetMidiOutputs();
	var outlist = outputs.split(",");
	byId("DKMidiDialogOutputs").innerHTML = "";
	for(var i=0; i<outlist.length; i++){
		var element = DK_CreateElement(byId("DKMidiDialogOutputs"), "option", "DKMidiDialogOutput");
		element.value = outlist[i];
		element.addEventListener("click", DKMidiDialog_OnEvent);
		element.innerHTML = outlist[i];
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