//BROWSER

DKAudio_lastVolume = 0.0;

///////////////////////
function DKAudio_Init()
{
	DKCreate("DKAudio");
}

//////////////////////
function DKAudio_End()
{
	
}

/////////////////////////////
function DKAudio_Resume(file)
{ 
	var x = document.getElementById("audio");
    x.play(); 
}

////////////////////////////
function DKAudio_Pause(file)
{ 
	var x = document.getElementById("audio");
	x.pause(); 
}

////////////////////////////////
function DKAudio_PlaySound(file)
{ 
	var x = document.getElementById("audio");
    x.play(); 
}

////////////////////////////////
function DKAudio_OpenMusic(file)
{ 
	var audio = DKWidget_CreateElement("body", "audio", "audio");
	var source = DKWidget_CreateElement(audio, "source", "source");
	DKWidget_SetAttribute(source, "type", "audio/ogg");
	DKWidget_SetAttribute(source, "src", file);
	document.getElementById("audio").ontimeupdate = function(){ DKAudio_TimeUpdate() };
	document.getElementById("audio").onended = function(){ DKAudio_Ended() };
}

///////////////////////////////
function DKAudio_SetVolume(num)
{
	document.getElementById("audio").volume = parseFloat(num / 128);
}

////////////////////////////
function DKAudio_GetVolume()
{
	return document.getElementById("audio").volume * 128;
}

///////////////////////
function DKAudio_Mute()
{
	DKAudio_lastVolume = DKAudio_GetVolume();
	DKAudio_SetVolume(0);
}

/////////////////////////
function DKAudio_UnMute()
{
	DKAudio_SetVolume(DKAudio_lastVolume);
}

/////////////////////////////////
function DKAudio_SetTime(seconds)
{
	document.getElementById("audio").currentTime = seconds;
}

/////////////////////////////
function DKAudio_TimeUpdate()
{
	DKSendEvent("window", "timeupdate");
}

////////////////////////
function DKAudio_Ended()
{
	DKSendEvent("window", "ended");
}

//////////////////////////
function DKAudio_GetTime()
{
	return document.getElementById("audio").currentTime;
}

//////////////////////////////
function DKAudio_GetDuration()
{
	return document.getElementById("audio").duration;
}