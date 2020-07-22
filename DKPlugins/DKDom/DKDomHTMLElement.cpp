#ifdef USE_DKDuktape 
#include "DK/DKApp.h"
#include "DKDom/DKDomHTMLElement.h"


/////////////////////////////
bool DKDomHTMLElement::Init()
{
	DKDEBUGFUNC();
	DKDuktape::AttachFunction("DKDomHTMLElement_focus", DKDomHTMLElement::focus);

	DKClass::DKCreate("DKDom/DKDomHTMLElement.js");
	return true;
}

/////////////////////////////////////////////
int DKDomHTMLElement::focus(duk_context* ctx)
{
	DKDEBUGFUNC(ctx);
	DKString address = duk_require_string(ctx, 0);
	Rml::Element* element = DKRml::addressToElement(address);
	if (!element) {
		DKERROR("DKDomElement::focus(): element invalid\n");
		duk_push_boolean(ctx, false);
		return true;
	}
	if(!element->Focus()){
		DKERROR("DKDomElement::focus(): focus failed\n");
		duk_push_boolean(ctx, false);
		return true;
	}
	duk_push_boolean(ctx, true);
	return true;
}


#endif //USE_DKDuktape