// https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent

#include "DK/DKApp.h"
#include "DKDom/DKDomEvent.h"
#include "DKDom/DKDomKeyboardEvent.h"
#include "DKRml/DKRml.h"
#include "RmlUI/Core//Input.h"


///////////////////////////////
bool DKDomKeyboardEvent::Init()
{
	DKDEBUGFUNC();

	// Properties
	DKDuktape::AttachFunction("DKDomKeyboardEvent_altKey", DKDomKeyboardEvent::altKey);
	DKDuktape::AttachFunction("DKDomKeyboardEvent_code", DKDomKeyboardEvent::code);
	DKDuktape::AttachFunction("DKDomKeyboardEvent_ctrlKey", DKDomKeyboardEvent::ctrlKey);
	DKDuktape::AttachFunction("DKDomKeyboardEvent_isComposing", DKDomKeyboardEvent::isComposing);
	DKDuktape::AttachFunction("DKDomKeyboardEvent_key", DKDomKeyboardEvent::key);
	DKDuktape::AttachFunction("DKDomKeyboardEvent_locale", DKDomKeyboardEvent::locale);
	DKDuktape::AttachFunction("DKDomKeyboardEvent_location", DKDomKeyboardEvent::location);
	DKDuktape::AttachFunction("DKDomKeyboardEvent_metaKey", DKDomKeyboardEvent::metaKey);
	DKDuktape::AttachFunction("DKDomKeyboardEvent_repeat", DKDomKeyboardEvent::repeat);
	DKDuktape::AttachFunction("DKDomKeyboardEvent_shiftKey", DKDomKeyboardEvent::shiftKey);

	// Methods
	DKDuktape::AttachFunction("DKDomKeyboardEvent_getModifierState", DKDomKeyboardEvent::getModifierState);

	// Obsolete methods
	DKDuktape::AttachFunction("DKDomKeyboardEvent_initKeyEvent", DKDomKeyboardEvent::initKeyEvent);
	DKDuktape::AttachFunction("DKDomKeyboardEvent_initKeyboardEvent", DKDomKeyboardEvent::initKeyboardEvent);

	//Obsolete properties
	DKDuktape::AttachFunction("DKDomKeyboardEvent_char", DKDomKeyboardEvent::char1);
	DKDuktape::AttachFunction("DKDomKeyboardEvent_charCode", DKDomKeyboardEvent::charCode);
	DKDuktape::AttachFunction("DKDomKeyboardEvent_keyCode", DKDomKeyboardEvent::keyCode);
	DKDuktape::AttachFunction("DKDomKeyboardEvent_keyIdentifier", DKDomKeyboardEvent::keyIdentifier);
	DKDuktape::AttachFunction("DKDomKeyboardEvent_keyLocation", DKDomKeyboardEvent::keyLocation);
	DKDuktape::AttachFunction("DKDomKeyboardEvent_which", DKDomKeyboardEvent::which);

	DKClass::DKCreate("DKDom/DKDomKeyboardEvent.js");
	return true;
}


// Properties
////////////////////////////////////////////////
int DKDomKeyboardEvent::altKey(duk_context* ctx)
{
	DKDEBUGFUNC(ctx);
	DKString eventAddress = duk_require_string(ctx, 0);
	Rml::Event* event = DKRml::addressToEvent(eventAddress);
	if (!event) {
		DKERROR("DKDomKeyboardEvent::altKey(): event invalid\n");
		duk_push_boolean(ctx, false);
		return true;
	}

	bool altKey = event->GetParameter<bool>("alt_key", 0);
	duk_push_boolean(ctx, altKey);
	return true;
}

//////////////////////////////////////////////
int DKDomKeyboardEvent::code(duk_context* ctx)
{
	DKDEBUGFUNC(ctx);
	DKString eventAddress = duk_require_string(ctx, 0);
	Rml::Event* event = DKRml::addressToEvent(eventAddress);
	if (!event) {
		DKERROR("DKDomKeyboardEvent::code(): event invalid\n");
		duk_push_boolean(ctx, false);
		return true;
	}

	int key = event->GetParameter<int>("key_identifier", 0);
	DKString code;
	TranslateKey(key, code);
	duk_push_string(ctx, code.c_str());
	return true;
}

/////////////////////////////////////////////////
int DKDomKeyboardEvent::ctrlKey(duk_context* ctx)
{
	DKDEBUGFUNC(ctx);
	DKString eventAddress = duk_require_string(ctx, 0);
	Rml::Event* event = DKRml::addressToEvent(eventAddress);
	if (!event) {
		DKERROR("DKDomKeyboardEvent::ctrlKey(): event invalid\n");
		duk_push_boolean(ctx, false);
		return true;
	}

	bool ctrlKey = event->GetParameter<bool>("ctrl_key", 0);
	duk_push_boolean(ctx, ctrlKey);
	return true;
}

/////////////////////////////////////////////////////
int DKDomKeyboardEvent::isComposing(duk_context* ctx)
{
	DKDEBUGFUNC(ctx);
	DKString eventAddress = duk_require_string(ctx, 0);
	Rml::Event* event = DKRml::addressToEvent(eventAddress);
	if (!event) {
		DKERROR("DKDomKeyboardEvent::isComposing(): event invalid\n");
		duk_push_boolean(ctx, false);
		return true;
	}

	//TODO
	bool isComposing = event->GetParameter<bool>("isComposing", 0);
	duk_push_boolean(ctx, isComposing);
	return false;
}

/////////////////////////////////////////////
int DKDomKeyboardEvent::key(duk_context* ctx)
{
	DKDEBUGFUNC(ctx);
	DKString eventAddress = duk_require_string(ctx, 0);
	Rml::Event* event = DKRml::addressToEvent(eventAddress);
	if (!event) {
		DKERROR("DKDomKeyboardEvent::key(): event invalid\n");
		duk_push_boolean(ctx, false);
		return true;
	}

	int key = event->GetParameter<int>("key_identifier", 0);
	duk_push_int(ctx, key);
	return true;
}

////////////////////////////////////////////////
int DKDomKeyboardEvent::locale(duk_context* ctx)
{
	DKDEBUGFUNC(ctx);
	DKString eventAddress = duk_require_string(ctx, 0);
	Rml::Event* event = DKRml::addressToEvent(eventAddress);
	if (!event) {
		DKERROR("DKDomKeyboardEvent::locale(): event invalid\n");
		duk_push_boolean(ctx, false);
		return true;
	}

	//TODO
	DKString locale = event->GetParameter<DKString>("locale", 0);
	duk_push_string(ctx, locale.c_str());
	return false;
}

//////////////////////////////////////////////////
int DKDomKeyboardEvent::location(duk_context* ctx)
{
	DKDEBUGFUNC(ctx);
	DKString eventAddress = duk_require_string(ctx, 0);
	Rml::Event* event = DKRml::addressToEvent(eventAddress);
	if (!event) {
		DKERROR("DKDomKeyboardEvent::location(): event invalid\n");
		duk_push_boolean(ctx, false);
		return true;
	}

	//TODO
	int location = event->GetParameter<int>("location", 0);
	duk_push_int(ctx, location);
	return false;
}

/////////////////////////////////////////////////
int DKDomKeyboardEvent::metaKey(duk_context* ctx)
{
	DKDEBUGFUNC(ctx);
	DKString eventAddress = duk_require_string(ctx, 0);
	Rml::Event* event = DKRml::addressToEvent(eventAddress);
	if (!event) {
		DKERROR("DKDomKeyboardEvent::metaKey(): event invalid\n");
		duk_push_boolean(ctx, false);
		return true;
	}

	bool metaKey = event->GetParameter<bool>("meta_key", 0);
	duk_push_boolean(ctx, metaKey);
	return true;
}

////////////////////////////////////////////////
int DKDomKeyboardEvent::repeat(duk_context* ctx)
{
	DKDEBUGFUNC(ctx);
	DKString eventAddress = duk_require_string(ctx, 0);
	Rml::Event* event = DKRml::addressToEvent(eventAddress);
	if (!event) {
		DKERROR("DKDomKeyboardEvent::repeat(): event invalid\n");
		duk_push_boolean(ctx, false);
		return true;
	}

	//TODO
	bool repeat = event->GetParameter<bool>("repeat", 0);
	duk_push_boolean(ctx, repeat);
	return false;
}

//////////////////////////////////////////////////
int DKDomKeyboardEvent::shiftKey(duk_context* ctx)
{
	DKDEBUGFUNC(ctx);
	DKString eventAddress = duk_require_string(ctx, 0);
	Rml::Event* event = DKRml::addressToEvent(eventAddress);
	if (!event) {
		DKERROR("DKDomKeyboardEvent::shiftKey(): event invalid\n");
		duk_push_boolean(ctx, false);
		return true;
	}

	bool shiftKey = event->GetParameter<bool>("shift_key", 0);
	duk_push_boolean(ctx, shiftKey);
	return true;
}


// Methods
///////////////////////////////////////////////////////
int DKDomKeyboardEvent::getModifierState(duk_context* ctx)
{
	DKDEBUGFUNC(ctx);
	DKString eventAddress = duk_require_string(ctx, 0);
	Rml::Event* event = DKRml::addressToEvent(eventAddress);
	if (!event) {
		DKERROR("DKDomKeyboardEvent::getModifierState(): event invalid\n");
		duk_push_boolean(ctx, false);
		return true;
	}

	//TODO
	return false;
}


// Obsolete Methods
//////////////////////////////////////////////////////
int DKDomKeyboardEvent::initKeyEvent(duk_context* ctx)
{
	DKDEBUGFUNC(ctx);
	DKString eventAddress = duk_require_string(ctx, 0);
	Rml::Event* event = DKRml::addressToEvent(eventAddress);
	if (!event) {
		DKERROR("DKDomKeyboardEvent::initKeyEvent(): event invalid\n");
		duk_push_boolean(ctx, false);
		return true;
	}

	//TODO
	//bool ctrlKey = event->GetParameter<bool>("ctrl_key", 0);
	//duk_push_boolean(ctx, ctrlKey);
	return false;
}

///////////////////////////////////////////////////////////
int DKDomKeyboardEvent::initKeyboardEvent(duk_context* ctx)
{
	DKDEBUGFUNC(ctx);
	DKString eventAddress = duk_require_string(ctx, 0);
	Rml::Event* event = DKRml::addressToEvent(eventAddress);
	if (!event) {
		DKERROR("DKDomKeyboardEvent::initKeyboardEvent(): event invalid\n");
		duk_push_boolean(ctx, false);
		return true;
	}

	//TODO
	//bool ctrlKey = event->GetParameter<bool>("ctrl_key", 0);
	//duk_push_boolean(ctx, ctrlKey);
	return false;
}


// Obsolete properties
///////////////////////////////////////////////
int DKDomKeyboardEvent::char1(duk_context* ctx)
{
	DKDEBUGFUNC(ctx);
	DKString eventAddress = duk_require_string(ctx, 0);
	Rml::Event* event = DKRml::addressToEvent(eventAddress);
	if (!event) {
		DKERROR("DKDomKeyboardEvent::char1(): event invalid\n");
		duk_push_boolean(ctx, false);
		return true;
	}

	//TODO
	//bool char1 = event->GetParameter<bool>("char", 0);
	//duk_push_int(ctx, char1);
	return false;
}

///////////////////////////////////////////////
int DKDomKeyboardEvent::charCode(duk_context* ctx)
{
	DKDEBUGFUNC(ctx);
	DKString eventAddress = duk_require_string(ctx, 0);
	Rml::Event* event = DKRml::addressToEvent(eventAddress);
	if (!event) {
		DKERROR("DKDomKeyboardEvent::charCode(): event invalid\n");
		duk_push_boolean(ctx, false);
		return true;
	}

	//TODO
	//bool char1 = event->GetParameter<bool>("char", 0);
	//duk_push_int(ctx, char1);
	return false;
}

/////////////////////////////////////////////////
int DKDomKeyboardEvent::keyCode(duk_context* ctx)
{
	DKDEBUGFUNC(ctx);
	DKString eventAddress = duk_require_string(ctx, 0);
	Rml::Event* event = DKRml::addressToEvent(eventAddress);
	if (!event) {
		DKERROR("DKDomKeyboardEvent::keyCode(): event invalid\n");
		duk_push_boolean(ctx, false);
		return true;
	}

	//TODO
	//bool char1 = event->GetParameter<bool>("char", 0);
	//duk_push_int(ctx, char1);
	return false;
}

///////////////////////////////////////////////////////
int DKDomKeyboardEvent::keyIdentifier(duk_context* ctx)
{
	DKDEBUGFUNC(ctx);
	DKString eventAddress = duk_require_string(ctx, 0);
	Rml::Event* event = DKRml::addressToEvent(eventAddress);
	if (!event) {
		DKERROR("DKDomKeyboardEvent::keyIdentifier(): event invalid\n");
		duk_push_boolean(ctx, false);
		return true;
	}

	//TODO
	//bool char1 = event->GetParameter<bool>("char", 0);
	//duk_push_int(ctx, char1);
	return false;
}

/////////////////////////////////////////////////////
int DKDomKeyboardEvent::keyLocation(duk_context* ctx)
{
	DKDEBUGFUNC(ctx);
	DKString eventAddress = duk_require_string(ctx, 0);
	Rml::Event* event = DKRml::addressToEvent(eventAddress);
	if (!event) {
		DKERROR("DKDomKeyboardEvent::char1(): event invalid\n");
		duk_push_boolean(ctx, false);
		return true;
	}

	//TODO
	//bool char1 = event->GetParameter<bool>("char", 0);
	//duk_push_int(ctx, char1);
	return false;
}

///////////////////////////////////////////////
int DKDomKeyboardEvent::which(duk_context* ctx)
{
	DKDEBUGFUNC(ctx);
	DKString eventAddress = duk_require_string(ctx, 0);
	Rml::Event* event = DKRml::addressToEvent(eventAddress);
	if (!event) {
		DKERROR("DKDomKeyboardEvent::which(): event invalid\n");
		duk_push_boolean(ctx, false);
		return true;
	}

	//TODO
	//bool char1 = event->GetParameter<bool>("char", 0);
	//duk_push_int(ctx, char1);
	return false;
}


//Extra
bool DKDomKeyboardEvent::TranslateKey(int key, DKString& value)
{
	switch (key) {
		case Rml::Input::KI_UNKNOWN:
			value = "Unknown";
			break;
		case Rml::Input::KI_SPACE:
			value = "Space";
			break;
		case Rml::Input::KI_0:
			value = "KI_0";
			break;
		case Rml::Input::KI_1:
			value = "Unknown";
			break;
		case Rml::Input::KI_2:
			value = "Unknown";
			break;
		case Rml::Input::KI_3:
			value = "Unknown";
			break;
		case Rml::Input::KI_4:
			value = "Unknown";
			break;
		case Rml::Input::KI_5:
			value = "Unknown";
			break;
		case Rml::Input::KI_6:
			value = "Unknown";
			break;
		case Rml::Input::KI_7:
			value = "Unknown";
			break;
		case Rml::Input::KI_8:
			value = "Unknown";
			break;
		case Rml::Input::KI_9:
			value = "Unknown";
			break;
		case Rml::Input::KI_A:
			value = "KI_A";
			break;
		case Rml::Input::KI_B:
			value = "Unknown";
			break;
		case Rml::Input::KI_C:
			value = "Unknown";
			break;
		case Rml::Input::KI_D:
			value = "Unknown";
			break;
		case Rml::Input::KI_E:
			value = "Unknown";
			break;
		case Rml::Input::KI_F:
			value = "Unknown";
			break;
		case Rml::Input::KI_G:
			value = "Unknown";
			break;
		case Rml::Input::KI_H:
			value = "Unknown";
			break;
		case Rml::Input::KI_I:
			value = "Unknown";
			break;
		case Rml::Input::KI_J:
			value = "Unknown";
			break;
		case Rml::Input::KI_K:
			value = "Unknown";
			break;
		case Rml::Input::KI_L:
			value = "Unknown";
			break;
		case Rml::Input::KI_M:
			value = "Unknown";
			break;
		case Rml::Input::KI_N:
			value = "Unknown";
			break;
		case Rml::Input::KI_O:
			value = "Unknown";
			break;
		case Rml::Input::KI_P:
			value = "Unknown";
			break;
		case Rml::Input::KI_Q:
			value = "Unknown";
			break;
		case Rml::Input::KI_R:
			value = "Unknown";
			break;
		case Rml::Input::KI_S:
			value = "Unknown";
			break;
		case Rml::Input::KI_T:
			value = "Unknown";
			break;
		case Rml::Input::KI_U:
			value = "Unknown";
			break;
		case Rml::Input::KI_V:
			value = "Unknown";
			break;
		case Rml::Input::KI_W:
			value = "Unknown";
			break;
		case Rml::Input::KI_X:
			value = "Unknown";
			break;
		case Rml::Input::KI_Y:
			value = "Unknown";
			break;
		case Rml::Input::KI_Z:
			value = "Unknown";
			break;
		case Rml::Input::KI_OEM_1:
			value = "Unknown";
			break;				// US standard keyboard; the ';:' key.
		case Rml::Input::KI_OEM_PLUS:
			value = "Unknown";
			break;			// Any region; the '=+' key.
		case Rml::Input::KI_OEM_COMMA:
			value = "Unknown";
			break;			// Any region; the ',<' key.
		case Rml::Input::KI_OEM_MINUS:
			value = "Unknown";
			break; 		// Any region; the '-_' key.
		case Rml::Input::KI_OEM_PERIOD:
			value = "Unknown";
			break;			// Any region; the '.>' key.
		case Rml::Input::KI_OEM_2:
			value = "Unknown";
			break;				// Any region; the '/?' key.
		case Rml::Input::KI_OEM_3:
			value = "Unknown";
			break;				// Any region; the '`~' key.
		case Rml::Input::KI_OEM_4:
			value = "Unknown";
			break;				// US standard keyboard; the '[{' key.
		case Rml::Input::KI_OEM_5:
			value = "Unknown";
			break;				// US standard keyboard; the '\|' key.
		case Rml::Input::KI_OEM_6:
			value = "Unknown";
			break;				// US standard keyboard; the ']}' key.
		case Rml::Input::KI_OEM_7:
			value = "Unknown";
			break;				// US standard keyboard; the ''"' key.
		case Rml::Input::KI_OEM_8:
			value = "Unknown";
			break;
		case Rml::Input::KI_OEM_102:
			value = "Unknown";
			break;			// RT 102-key keyboard; the '<>' or '\|' key.
		case Rml::Input::KI_NUMPAD0:
			value = "Unknown";
			break;
		case Rml::Input::KI_NUMPAD1:
			value = "Unknown";
			break;
		case Rml::Input::KI_NUMPAD2:
			value = "Unknown";
			break;
		case Rml::Input::KI_NUMPAD3:
			value = "Unknown";
			break;
		case Rml::Input::KI_NUMPAD4:
			value = "Unknown";
			break;
		case Rml::Input::KI_NUMPAD5:
			value = "Unknown";
			break;
		case Rml::Input::KI_NUMPAD6:
			value = "Unknown";
			break;
		case Rml::Input::KI_NUMPAD7:
			value = "Unknown";
			break;
		case Rml::Input::KI_NUMPAD8:
			value = "Unknown";
			break;
		case Rml::Input::KI_NUMPAD9:
			value = "Unknown";
			break;
		case Rml::Input::KI_NUMPADENTER:
			value = "Unknown";
			break;
		case Rml::Input::KI_MULTIPLY:
			value = "Unknown";
			break;			// Asterisk on the numeric keypad.
		case Rml::Input::KI_ADD:
			value = "Unknown";
			break;				// Plus on the numeric keypad.
		case Rml::Input::KI_SEPARATOR:
			value = "Unknown";
			break;
		case Rml::Input::KI_SUBTRACT:
			value = "Unknown";
			break;			// Minus on the numeric keypad.
		case Rml::Input::KI_DECIMAL:
			value = "Unknown";
			break;			// Period on the numeric keypad.
		case Rml::Input::KI_DIVIDE:
			value = "Unknown";
			break;				// Forward Slash on the numeric keypad.
	/*
	 * NEC PC-9800 kbd definitions
	 */
		case Rml::Input::KI_OEM_NEC_EQUAL:
			value = "Unknown";
			break;		// Equals key on the numeric keypad.
		case Rml::Input::KI_BACK:
			value = "Unknown";
			break;				// Backspace key.
		case Rml::Input::KI_TAB:
			value = "Unknown";
			break;				// Tab key.
		case Rml::Input::KI_CLEAR:
			value = "Unknown";
			break;
		case Rml::Input::KI_RETURN:
			value = "Unknown";
			break;
		case Rml::Input::KI_PAUSE:
			value = "Unknown";
			break;
		case Rml::Input::KI_CAPITAL:
			value = "Unknown";
			break;			// Capslock key.
		case Rml::Input::KI_KANA:
			value = "Unknown";
			break;				// IME Kana mode.
		case Rml::Input::KI_HANGUL:
			value = "Unknown";
			break;				// IME Hangul mode.
		case Rml::Input::KI_JUNJA:
			value = "Unknown";
			break;				// IME Junja mode.
		case Rml::Input::KI_FINAL:
			value = "Unknown";
			break;				// IME final mode.
		case Rml::Input::KI_HANJA:
			value = "Unknown";
			break;				// IME Hanja mode.
		case Rml::Input::KI_KANJI:
			value = "Unknown";
			break;				// IME Kanji mode.
		case Rml::Input::KI_ESCAPE:
			value = "Unknown";
			break;				// Escape key.
		case Rml::Input::KI_CONVERT:
			value = "Unknown";
			break;			// IME convert.
		case Rml::Input::KI_NONCONVERT:
			value = "Unknown";
			break;			// IME nonconvert.
		case Rml::Input::KI_ACCEPT:
			value = "Unknown";
			break;				// IME accept.
		case Rml::Input::KI_MODECHANGE:
			value = "Unknown";
			break;			// IME mode change request.
		case Rml::Input::KI_PRIOR:
			value = "Unknown";
			break;				// Page Up key.
		case Rml::Input::KI_NEXT:
			value = "Unknown";
			break;				// Page Down key.
		case Rml::Input::KI_END:
			value = "Unknown";
			break;
		case Rml::Input::KI_HOME:
			value = "Unknown";
			break;
		case Rml::Input::KI_LEFT:
			value = "Unknown";
			break;				// Left Arrow key.
		case Rml::Input::KI_UP:
			value = "Unknown";
			break;					// Up Arrow key.
		case Rml::Input::KI_RIGHT:
			value = "Unknown";
			break;				// Right Arrow key.
		case Rml::Input::KI_DOWN:
			value = "Unknown";
			break;				// Down Arrow key.
		case Rml::Input::KI_SELECT:
			value = "Unknown";
			break;
		case Rml::Input::KI_PRINT:
			value = "Unknown";
			break;
		case Rml::Input::KI_EXECUTE:
			value = "Unknown";
			break;
		case Rml::Input::KI_SNAPSHOT:
			value = "Unknown";
			break;			// Print Screen key.
		case Rml::Input::KI_INSERT:
			value = "Unknown";
			break;
		case Rml::Input::KI_DELETE:
			value = "Unknown";
			break;
		case Rml::Input::KI_HELP:
			value = "Unknown";
			break;
		case Rml::Input::KI_LWIN:
			value = "Unknown";
			break;				// Left Windows key.
		case Rml::Input::KI_RWIN:
			value = "Unknown";
			break;				// Right Windows key.
		case Rml::Input::KI_APPS:
			value = "Unknown";
			break;				// Applications key.
		case Rml::Input::KI_POWER:
			value = "Unknown";
			break;
		case Rml::Input::KI_SLEEP:
			value = "Unknown";
			break;
		case Rml::Input::KI_WAKE:
			value = "Unknown";
			break;
		case Rml::Input::KI_F1:
			value = "Unknown";
			break;
		case Rml::Input::KI_F2:
			value = "Unknown";
			break;
		case Rml::Input::KI_F3:
			value = "Unknown";
			break;
		case Rml::Input::KI_F4:
			value = "Unknown";
			break;
		case Rml::Input::KI_F5:
			value = "Unknown";
			break;
		case Rml::Input::KI_F6:
			value = "Unknown";
			break;
		case Rml::Input::KI_F7:
			value = "Unknown";
			break;
		case Rml::Input::KI_F8:
			value = "Unknown";
			break;
		case Rml::Input::KI_F9:
			value = "Unknown";
			break;
		case Rml::Input::KI_F10:
			value = "Unknown";
			break;
		case Rml::Input::KI_F11:
			value = "Unknown";
			break;
		case Rml::Input::KI_F12:
			value = "Unknown";
			break;
		case Rml::Input::KI_F13:
			value = "Unknown";
			break;
		case Rml::Input::KI_F14:
			value = "Unknown";
			break;
		case Rml::Input::KI_F15:
			value = "Unknown";
			break;
		case Rml::Input::KI_F16:
			value = "Unknown";
			break;
		case Rml::Input::KI_F17:
			value = "Unknown";
			break;
		case Rml::Input::KI_F18:
			value = "Unknown";
			break;
		case Rml::Input::KI_F19:
			value = "Unknown";
			break;
		case Rml::Input::KI_F20:
			value = "Unknown";
			break;
		case Rml::Input::KI_F21:
			value = "Unknown";
			break;
		case Rml::Input::KI_F22:
			value = "Unknown";
			break;
		case Rml::Input::KI_F23:
			value = "Unknown";
			break;
		case Rml::Input::KI_F24:
			value = "Unknown";
			break;
		case Rml::Input::KI_NUMLOCK:
			value = "Unknown";
			break;			// Numlock key.
		case Rml::Input::KI_SCROLL:
			value = "Unknown";
			break;			// Scroll Lock key.
	/*
	 * Fujitsu/OASYS kbd definitions
	 */
		case Rml::Input::KI_OEM_FJ_JISHO:
			value = "Unknown";
			break;		// 'Dictionary' key.
		case Rml::Input::KI_OEM_FJ_MASSHOU:
			value = "Unknown";
			break;	// 'Unregister word' key.
		case Rml::Input::KI_OEM_FJ_TOUROKU:
			value = "Unknown";
			break;	// 'Register word' key.
		case Rml::Input::KI_OEM_FJ_LOYA:
			value = "Unknown";
			break;		// 'Left OYAYUBI' key.
		case Rml::Input::KI_OEM_FJ_ROYA:
			value = "Unknown";
			break;		// 'Right OYAYUBI' key.
		case Rml::Input::KI_LSHIFT:
			value = "Unknown";
			break;
		case Rml::Input::KI_RSHIFT:
			value = "Unknown";
			break;
		case Rml::Input::KI_LCONTROL:
			value = "Unknown";
			break;
		case Rml::Input::KI_RCONTROL:
			value = "Unknown";
			break;
		case Rml::Input::KI_LMENU:
			value = "Unknown";
			break;
		case Rml::Input::KI_RMENU:
			value = "Unknown";
			break;
		case Rml::Input::KI_BROWSER_BACK:
			value = "Unknown";
			break;
		case Rml::Input::KI_BROWSER_FORWARD:
			value = "Unknown";
			break;
		case Rml::Input::KI_BROWSER_REFRESH:
			value = "Unknown";
			break;
		case Rml::Input::KI_BROWSER_STOP:
			value = "Unknown";
			break;
		case Rml::Input::KI_BROWSER_SEARCH:
			value = "Unknown";
			break;
		case Rml::Input::KI_BROWSER_FAVORITES:
			value = "Unknown";
			break;
		case Rml::Input::KI_BROWSER_HOME:
			value = "Unknown";
			break;
		case Rml::Input::KI_VOLUME_MUTE:
			value = "Unknown";
			break;
		case Rml::Input::KI_VOLUME_DOWN:
			value = "Unknown";
			break;
		case Rml::Input::KI_VOLUME_UP:
			value = "Unknown";
			break;
		case Rml::Input::KI_MEDIA_NEXT_TRACK:
			value = "Unknown";
			break;
		case Rml::Input::KI_MEDIA_PREV_TRACK:
			value = "Unknown";
			break;
		case Rml::Input::KI_MEDIA_STOP:
			value = "Unknown";
			break;
		case Rml::Input::KI_MEDIA_PLAY_PAUSE:
			value = "Unknown";
			break;
		case Rml::Input::KI_LAUNCH_MAIL:
			value = "Unknown";
			break;
		case Rml::Input::KI_LAUNCH_MEDIA_SELECT:
			value = "Unknown";
			break;
		case Rml::Input::KI_LAUNCH_APP1:
			value = "Unknown";
			break;
		case Rml::Input::KI_LAUNCH_APP2:
			value = "Unknown";
			break;
	/*
	 * Various extended or enhanced keyboards
	 */
		case Rml::Input::KI_OEM_AX:
			value = "Unknown";
			break;
		case Rml::Input::KI_ICO_HELP:
			value = "Unknown";
			break;
		case Rml::Input::KI_ICO_00:
			value = "Unknown";
			break;
		case Rml::Input::KI_PROCESSKEY:
			value = "Unknown";
			break;		// IME Process key.
		case Rml::Input::KI_ICO_CLEAR:
			value = "Unknown";
			break;
		case Rml::Input::KI_ATTN:
			value = "Unknown";
			break;
		case Rml::Input::KI_CRSEL:
			value = "Unknown";
			break;
		case Rml::Input::KI_EXSEL:
			value = "Unknown";
			break;
		case Rml::Input::KI_EREOF:
			value = "Unknown";
			break;
		case Rml::Input::KI_PLAY:
			value = "Unknown";
			break;
		case Rml::Input::KI_ZOOM:
			value = "Unknown";
			break;
		case Rml::Input::KI_PA1:
			value = "Unknown";
			break;
		case Rml::Input::KI_OEM_CLEAR:
			value = "Unknown";
			break;
		case Rml::Input::KI_LMETA:
			value = "Unknown";
			break;
		case Rml::Input::KI_RMETA:
			value = "Unknown";
			break;
		default:
			return "Unknown";
			break;
	}

	return true;
}