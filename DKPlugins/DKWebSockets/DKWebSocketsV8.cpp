#ifdef USE_DKCef
#include "DK/DKApp.h"
#include "DKWebSockets/DKWebSockets.h"
#include "DKWebSockets/DKWebSocketsV8.h"

///////////////////////////
bool DKWebSocketsV8::Init()
{
	DKLog("DKWebSocketsV8::Init()\n", DKDEBUG);

	DKV8::AttachFunction("DKWebSockets_SendMessage", DKWebSocketsV8::SendMessage);
	return true;
}

//////////////////////////
bool DKWebSocketsV8::End()
{
	DKLog("DKWebSocketsV8::End()\n", DKDEBUG);
	return true;
}

////////////////////////////////////////////////////////////////
bool DKWebSocketsV8::SendMessage(CefArgs args, CefReturn retval)
{
	DKString text = args->GetString(0);
	if(!DKWebSockets::SendMessage(text)){ return false; }
	return true;
}



#endif //USE_DKCef