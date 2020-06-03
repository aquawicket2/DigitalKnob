#ifdef USE_DKDuktape 
#include "DK/DKApp.h"
#include "DKRml/DKRml.h"
#include "DKDom/DKDomElement.h"
#include "DKDom/DKDomNode.h"


//////////////////////
bool DKDomNode::Init()
{
	DKDEBUGFUNC();
	DKDuktape::AttachFunction("DKDomNode_appendChild", DKDomNode::appendChild);
	DKDuktape::AttachFunction("DKDomNode_childNodes", DKDomNode::childNodes);
	DKDuktape::AttachFunction("DKDomNode_parentNode", DKDomNode::parentNode);
	DKDuktape::AttachFunction("DKDomNode_removeChild", DKDomNode::removeChild);
	
	DKClass::DKCreate("DKDom/DKDomNode.js");
	return true;
}

////////////////////////////////////////////
int DKDomNode::appendChild(duk_context* ctx)
{
	DKDEBUGFUNC(ctx);
	DKString address = duk_require_string(ctx, 0);
	Rml::Core::Element* element = DKDomElement::addressToElement(address);
	if(!element){
		DKERROR("DKDomNode::appendChild(): element invalid\n");
		duk_push_boolean(ctx, false);
		return true;
	}
	DKString childAddress = duk_require_string(ctx, 1);
	Rml::Core::Element* child = DKDomElement::addressToElement(childAddress);
	if(!child){
		DKERROR("DKDomNode::appendChild(): child invalid\n");
		duk_push_boolean(ctx, false);
		return true;
	}

	if(!element->AppendChild(child->GetParentNode()->RemoveChild(child), true)){
		DKERROR("DKDomNode::appendChild(): AppendChild failed\n");
		duk_push_boolean(ctx, false);
		return true;
	}

	duk_push_string(ctx, childAddress.c_str());

	//post process if it's a link
	if(same("link", child->GetTagName())){ //.CString()
		if(child->HasAttribute("href")){
			DKRmlToRML dkRmlToRML;
			dkRmlToRML.PostProcess(child);
		}	
	}
	return true;
}

///////////////////////////////////////////
int DKDomNode::childNodes(duk_context* ctx)
{
	DKDEBUGFUNC(ctx);
	DKString address = duk_require_string(ctx, 0);
	Rml::Core::Element* element = DKDomElement::addressToElement(address);
	if(!element){
		DKERROR("DKDomNode::childNodes(): element invalid\n");
		duk_push_boolean(ctx, false);
		return true;
	}

	int num = element->GetNumChildren();
	Rml::Core::ElementList elements;
	for(int i=0; i<num; i++){
		elements.push_back(element->GetChild(i));
	}
	if(elements.empty()){
		duk_push_null(ctx);
		return true;
	}
	DKString str;
	for(unsigned int i=0; i<elements.size(); i++){
		DKString elementAddress = DKDomElement::elementToAddress(elements[i]);
		str += elementAddress;
		if(i < elements.size()-1){ str += ","; }
	}
	duk_push_string(ctx, str.c_str());
	return true;
}

///////////////////////////////////////////
int DKDomNode::parentNode(duk_context* ctx)
{
	DKDEBUGFUNC(ctx);
	DKString address = duk_require_string(ctx, 0);
	Rml::Core::Element* element = DKDomElement::addressToElement(address);
	if(!element){
		DKERROR("DKDomNode::parentNode(): element invalid\n");
		duk_push_boolean(ctx, false);
		return true;
	}
	Rml::Core::Element* parentNode = element->GetParentNode();
	if(!parentNode){
		DKERROR("DKDomNode::parentNode(): parentNode invalid\n");
		duk_push_boolean(ctx, false);
		return true;
	}
	DKString parentAddress = DKDomElement::elementToAddress(parentNode);
	duk_push_string(ctx, parentAddress.c_str());
	return true;
}

////////////////////////////////////////////
int DKDomNode::removeChild(duk_context* ctx)
{
	DKDEBUGFUNC(ctx);
	DKString address = duk_require_string(ctx, 0);
	Rml::Core::Element* element = DKDomElement::addressToElement(address);
	if(!element){
		DKERROR("DKDomNode::removeChild(): element invalid\n");
		duk_push_boolean(ctx, false);
		return true;
	}
	DKString childAddress = duk_require_string(ctx, 1);
	Rml::Core::Element* child = DKDomElement::addressToElement(childAddress);
	if(!child){
		DKERROR("DKDomNode::removeChild(): child invalid\n");
		duk_push_boolean(ctx, false);
		return true;
	}
	//DKINFO("element->RemoveChild(child): " + element->GetTagName() + "->(" + child->GetTagName() + ")\n");
	if(!element->RemoveChild(child)){
		DKERROR("DKDomNode::removeChild(): element->RemoveChild failed\n");
		duk_push_boolean(ctx, false);
		return true;
	}
	duk_push_string(ctx, childAddress.c_str());
	return true;
}

#endif //USE_DKDuktape