#ifdef USE_DKDuktape 
#pragma once
#ifndef DKDomElement_H
#define DKDomElement_H

#include <RmlUi/Core.h>
#include "DKDuktape/DKDuktape.h"
#include "DKDom/DKDomElement.h"

///////////////////////////////////////////////////
class DKDomElement : public DKObjectT<DKDomElement>
{
public:
	bool Init();
	static Rml::Core::Element* addressToElement(const DKString& address);
	static DKString elementToAddress(Rml::Core::Element* element);
	//static bool GetElements(Rml::Core::Element* parent, Rml::Core::ElementList& elements);
	
	static int clientHeight(duk_context* ctx);
	static int clientLeft(duk_context* ctx);
	static int clientTop(duk_context* ctx);
	static int clientWidth(duk_context* ctx);
	static int getAttribute(duk_context* ctx);
	static int getElementsByClassName(duk_context* ctx);
	static int getElementsByTagName(duk_context* ctx);
	static int hasAttribute(duk_context* ctx);
	static int innerHTML(duk_context* ctx);
	static int setAttribute(duk_context* ctx);
	static int tagName(duk_context* ctx);
};


REGISTER_OBJECT(DKDomElement, true)

#endif //DKDomElement_H
#endif //USE_DKDuktape