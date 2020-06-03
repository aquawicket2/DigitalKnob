#ifdef USE_DKDuktape 
#include "DK/DKApp.h"
#include "DKDom/DKDomNavigator.h"

///////////////////////////
bool DKDomNavigator::Init()
{
	DKDEBUGFUNC();
	DKDuktape::AttachFunction("DKDomNavigator_onLine", DKDomNavigator::onLine);
	DKDuktape::AttachFunction("DKDomNavigator_platform", DKDomNavigator::platform);
	DKDuktape::AttachFunction("DKDomNavigator_productSub", DKDomNavigator::productSub);
	
	DKClass::DKCreate("DKDom/DKDomNavigator.js");
	return true;
}

////////////////////////////////////////////
int DKDomNavigator::onLine(duk_context* ctx)
{
	//TODO
	return false;
}

//////////////////////////////////////////////
int DKDomNavigator::platform(duk_context* ctx)
{
	//TODO - complete this for all OS's
#ifdef WIN64
	duk_push_string(ctx, "Win32");
	return true;
#endif
#ifdef WIN32
	duk_push_string(ctx, "Win64");
	return true;
#endif
#ifdef MAC
	duk_push_string(ctx, "MacIntel");
	return true;
#endif
	DKERROR("DKDomNavigator::platform(): platform invalid\n");
	return false;
}

////////////////////////////////////////////////
int DKDomNavigator::productSub(duk_context* ctx)
{
	//TODO
	return false;
}


#endif //USE_DKDuktape