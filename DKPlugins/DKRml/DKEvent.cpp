//https://developer.mozilla.org/en-US/docs/Web/API/Event

#ifdef USE_DKDuktape 
#include "DK/DKApp.h"
#include "DKRml/DKEvent.h"


////////////////////
bool DKEvent::Init()
{
	DKDEBUGFUNC();

	//Properties
	DKDuktape::AttachFunction("DKEvent_bubbles", DKEvent::bubbles);

	//Methods
	DKDuktape::AttachFunction("DKEvent_createEvent", DKEvent::createEvent);

	DKClass::DKCreate("DKDuktape/DKEvent.js");
	return true;
}


//Properties
//////////////////////////////////////
int DKEvent::bubbles(duk_context* ctx)
{
	//TODO
	return false;
}


//Methods
//////////////////////////////////////////
int DKEvent::createEvent(duk_context* ctx) 
{
	//TODO
	return false;
}

#endif //USE_DKDuktape