#ifdef USE_DKDuktape
#include "DKRml/DKRml.h"
#include "DKRml/DKRmlJS.h"
#include "DKRml/DKElement.h"


///////////////////////
bool DKRmlJS::Init()
{
	DKDEBUGFUNC();
	DKDuktape::AttachFunction("DKRml_LoadUrl", DKRmlJS::LoadUrl);
	DKDuktape::AttachFunction("DKRml_ToggleDebugger", DKRmlJS::ToggleDebugger);
	DKDuktape::AttachFunction("DKRml_devicePixelRatio", DKRmlJS::devicePixelRatio);
	DKDuktape::AttachFunction("DKRml_innerHeight", DKRmlJS::innerHeight);
	DKDuktape::AttachFunction("DKRml_innerWidth", DKRmlJS::innerWidth);
	DKDuktape::AttachFunction("DKRml_name", DKRmlJS::name);
	DKDuktape::AttachFunction("DKRml_addEventListener", DKRmlJS::addEventListener);
	DKDuktape::AttachFunction("DKRml_removeEventListener", DKRmlJS::removeEventListener);
	
	return true;
}

/////////////////////////////////////////
int DKRmlJS::LoadUrl(duk_context* ctx)
{
	DKDEBUGFUNC(ctx);
	DKString file = duk_require_string(ctx, 0);
	if(!DKRml::Get()->LoadUrl(file)){ return 0; }
	return 1;
}

////////////////////////////////////////////////
int DKRmlJS::ToggleDebugger(duk_context* ctx)
{
	DKDEBUGFUNC(ctx);
	DKRml::Get()->ToggleDebugger();
	return 1;
}

///////////////////////////////////////////////
int DKRmlJS::devicePixelRatio(duk_context* ctx)
{
	DKDEBUGFUNC(ctx);

	//get
	if (!duk_is_number(ctx, 1)) {
		float ratio = DKRml::Get()->context->GetDensityIndependentPixelRatio();
		duk_push_number(ctx, ratio);
		return true;
	}
	//set
	float ratio = duk_require_number(ctx, 1);
	DKRml::Get()->context->SetDensityIndependentPixelRatio(ratio);
	return true;
}

/////////////////////////////////////////////
int DKRmlJS::innerHeight(duk_context* ctx)
{
	DKDEBUGFUNC(ctx);
	int y = DKRml::Get()->context->GetDimensions().y;
	duk_push_int(ctx, y);
	return 1;
}

////////////////////////////////////////////
int DKRmlJS::innerWidth(duk_context* ctx)
{
	DKDEBUGFUNC(ctx);
	int x = DKRml::Get()->context->GetDimensions().x;
	duk_push_int(ctx, x);
	return 1;
}

//////////////////////////////////////
int DKRmlJS::name(duk_context* ctx)
{
	DKDEBUGFUNC(ctx);
	DKString name = DKRml::Get()->context->GetName();
	duk_push_string(ctx, name.c_str());
	return 1;
}

//////////////////////////////////////////////////
int DKRmlJS::addEventListener(duk_context* ctx)
{
	DKDEBUGFUNC(ctx);
	DKString address = duk_require_string(ctx, 0);
	Rml::Core::Element* element;
	if(same(address,"document")){
		element = DKRml::Get()->document;
	}
	else{
		element = DKElement::addressToElement(address);
	}
	if(!element){
		DKERROR("DKRmlJS::addEventListener(): element invalid\n");
		duk_push_boolean(ctx, false);
		return true;
	}
	DKString type = duk_require_string(ctx, 1);
	bool phase = false;
	if(duk_is_boolean(ctx, 2)){
		phase = duk_require_boolean(ctx, 2);
	}
	element->AddEventListener(type.c_str(), DKRml::Get(), phase);
	return true;
}

/////////////////////////////////////////////////////
int DKRmlJS::removeEventListener(duk_context* ctx)
{
	DKDEBUGFUNC(ctx);
	DKString address = duk_require_string(ctx, 0);
	Rml::Core::Element* element = DKElement::addressToElement(address);
	if(!element){
		DKERROR("DKRmlJS::removeEventListener(): element invalid\n");
		duk_push_boolean(ctx, false);
		return true;
	}
	DKString type = duk_require_string(ctx, 1);
	bool phase = false;
	if(duk_is_boolean(ctx, 2)){
		phase = duk_require_boolean(ctx, 2);
	}
	element->RemoveEventListener(type.c_str(), DKRml::Get(), phase);
	return true;
}

#endif //USE_DKDuktape