#include "DK/stdafx.h"
#include <sstream>
#include <string>
#include "include/base/cef_bind.h"
#include "include/wrapper/cef_closure_task.h"
#include "include/wrapper/cef_helpers.h"
#include "DKSDLCef/DKSDLCefHandler.h"

namespace{
	DKSDLCefHandler* g_instance = NULL;
}

//////////////////////////////////////////////////////
DKSDLCefHandler::DKSDLCefHandler(): is_closing_(false) 
{
	DCHECK(!g_instance);
	g_instance = this;
}

///////////////////////////////////
DKSDLCefHandler::~DKSDLCefHandler() 
{
	g_instance = NULL;
}

///////////////////////////////////////////////
DKSDLCefHandler* DKSDLCefHandler::GetInstance() 
{
	return g_instance;
}

////////////////////////////////////////////////////////
void DKSDLCefHandler::CloseAllBrowsers(bool force_close)
{
	if(!CefCurrentlyOn(TID_UI)){
		// Execute on the UI thread.
		CefPostTask(TID_UI, base::Bind(&DKSDLCefHandler::CloseAllBrowsers, this, force_close));
		return;
	}

	if(browser_list_.empty()){ return; }

	BrowserList::const_iterator it = browser_list_.begin();
	for(; it != browser_list_.end(); ++it){
		(*it)->GetHost()->CloseBrowser(force_close);
	}
}

////////////////////////////////////////////////////////////
bool DKSDLCefHandler::DoClose(CefRefPtr<CefBrowser> browser) 
{
	CEF_REQUIRE_UI_THREAD();

	// Closing the main window requires special handling. See the DoClose()
	// documentation in the CEF header for a detailed destription of this
	// process.
	if (browser_list_.size() == 1) {
		// Set a flag to indicate that the window close should be allowed.
		is_closing_ = true;
	}

	// Allow the close. For windowed browsers this will result in the OS close
	// event being sent.
	return false;
}

///////////////////////////////
void DKSDLCefHandler::DoFrame()
{ 
	//FIXME: this breaks SDL keyboard events for Mac OSX
	CefDoMessageLoopWork(); 
}

///////////////////////////////////////////////////////////////////////////////
bool DKSDLCefHandler::GetViewRect(CefRefPtr<CefBrowser> browser, CefRect& rect)
{
	DKLog("DKSDLCefHandler::GetViewRect(CefBrowser, CefRect&)\n", DKDEBUG);
	rect = CefRect(0, 0, dkCef->width, dkCef->height);
	return true;
}

//////////////////////////////////////////////////////////////////
void DKSDLCefHandler::OnBeforeClose(CefRefPtr<CefBrowser> browser)
{
	DKLog("DKSDLCefHandler::OnBeforeClose(browser)\n", DKDEBUG);
	CEF_REQUIRE_UI_THREAD();

	// Remove from the list of existing browsers.
	BrowserList::iterator bit = browser_list_.begin();
	for (; bit != browser_list_.end(); ++bit) {
		if ((*bit)->IsSame(browser)) {
			browser_list_.erase(bit);
			break;
		}
	}

	if(browser_list_.empty()){
		//NOTE: disabled since we run our own message loop
		//CefQuitMessageLoop(); // All browser windows have closed. Quit the application message loop.
	}
}

///////////////////////////////////////////////////////////////////
void DKSDLCefHandler::OnAfterCreated(CefRefPtr<CefBrowser> browser)
{
	DKLog("DKSDLCefHandler::OnAfterCreated(browser)\n", DKDEBUG);
	CEF_REQUIRE_UI_THREAD();
	browser_list_.push_back(browser); //Add to the list of existing browsers.
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
void DKSDLCefHandler::OnBeforeContextMenu(CefRefPtr<CefBrowser> browser, CefRefPtr<CefFrame> frame, CefRefPtr<CefContextMenuParams> params, CefRefPtr<CefMenuModel> model)
{
	DKLog("DKSDLCefHandler::OnBeforeContextMenu("+dkCef->id+")\n", DKDEBUG);
	model->Clear(); //remove original context menu

	DKString data;
	data += params->GetSelectionText();
	data += ",";
	data += params->GetSourceUrl();
	data += ",";
	data += params->GetLinkUrl();

	DKEvent::SendEvent("GLOBAL", "DKCef_ContextMenu", data);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
void DKSDLCefHandler::OnBeforeDownload(CefRefPtr<CefBrowser> browser, CefRefPtr<CefDownloadItem> download_item, const CefString& suggested_name, CefRefPtr<CefBeforeDownloadCallback> callback)
{
	DKLog("DKSDLCefHandler::OnBeforeDownload("+suggested_name.ToString()+")\n", DKDEBUG);
	//DKLog("OriginalUrl: "+download_item->GetOriginalUrl().ToString()+")\n", DKDEBUG);
	UNREFERENCED_PARAMETER(browser);
	UNREFERENCED_PARAMETER(download_item);
	callback->Continue(suggested_name, true);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
bool DKSDLCefHandler::OnBeforePopup(CefRefPtr<CefBrowser> browser, CefRefPtr<CefFrame> frame, const CefString& target_url, const CefString& target_frame_name, CefLifeSpanHandler::WindowOpenDisposition target_disposition, bool user_gesture, const CefPopupFeatures& popupFeatures, CefWindowInfo& windowInfo, CefRefPtr<CefClient>& client, CefBrowserSettings& settings, bool* no_javascript_access)
{
	//TODO
	DKLog("DKSDLCefHandler::OnBeforePopup("+target_url.ToString()+","+target_frame_name.ToString()+","+toString(target_disposition)+")\n", DKDEBUG);
	return false; //DISABLED

	//DKEvent::SendEvent("GLOBAL", "DKCef_OnBeforePopup", target_url);
	if(target_disposition == WOD_NEW_FOREGROUND_TAB){
		dkCef->queue_new_browser = target_url;
	}
	else{
		dkCef->current_browser->GetMainFrame()->LoadURL(target_url.c_str());
	}
	return true;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
bool DKSDLCefHandler::OnConsoleMessage(CefRefPtr<CefBrowser> browser, cef_log_severity_t level, const CefString& message, const CefString& source, int line)
{
	//DKLog("DKSDLCefHandler::OnConsoleMessage()\n", DKINFO);
	CEF_REQUIRE_UI_THREAD();
	DKString msg = message.ToString();
	replace(msg, "%c", "");
	//DKLog("DKSDLCefHandler::OnConsoleMessage("+msg+","+source.ToString()+","+toString(line)+")\n", DKDEBUG);
	DKString string = message.ToString();
	replace(string,"%c","");
	int identifier = browser->GetIdentifier();
	DKLog("[CEF:"+toString(identifier)+"] "+string+"\n", DKINFO);
	return true;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
bool DKSDLCefHandler::OnContextMenuCommand(CefRefPtr<CefBrowser> browser, CefRefPtr<CefFrame> frame, CefRefPtr<CefContextMenuParams> params, int command_id, CefContextMenuHandler::EventFlags event_flags)
{
	CEF_REQUIRE_UI_THREAD();
	//DKLog("DKCefWindow::OnContextMenuCommand()\n", DKINFO);
	return false;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
void DKSDLCefHandler::OnCursorChange(CefRefPtr<CefBrowser> browser, CefCursorHandle cursor, CursorType type, const CefCursorInfo& custom_cursor_info)
{
	//FIXME
	//DKLog("OnCursorChange()\n", DKINFO);
#ifdef WIN32
	HWND hwnd;
	if(!DKClass::CallFunc("DKSDLWindow::GetHandle", NULL, &hwnd)){ return; }
	if(!::IsWindow(hwnd)){ return; }
	SetClassLongPtr(hwnd, GCLP_HCURSOR, static_cast<LONG>(reinterpret_cast<LONG_PTR>(cursor)));
	SetCursor(cursor);
#endif
#ifdef LINUX
	//Display* dpy;// = glfwGetX11Display();
	//Cursor c;
	//c = XCreateFontCursor(dpy, XC_xterm); 
	//XDefineCursor(dpy, w, c);
#endif
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
void DKSDLCefHandler::OnFindResult(CefRefPtr<CefBrowser> browser, int identifier, int count, const CefRect& selectionRect, int activeMatchOrdinal, bool finalUpdate)
{
	CEF_REQUIRE_UI_THREAD();
	DKLog("DKCefWindow::OnFindResult()\n", DKINFO);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
bool DKSDLCefHandler::OnFileDialog(CefRefPtr<CefBrowser> browser, CefDialogHandler::FileDialogMode mode, const CefString& title, const CefString& default_file_path, const std::vector<CefString>& accept_filters, int selected_accept_filter, CefRefPtr<CefFileDialogCallback> callback)
{
	DKLog("DKSDLCefHandler::OnFileDialog("+title.ToString()+","+default_file_path.ToString()+")\n", DKINFO);
	return false;
}

////////////////////////////////////////////////////////////////////////////////////////////
void DKSDLCefHandler::OnFullscreenModeChange(CefRefPtr<CefBrowser> browser, bool fullscreen)
{
	DKLog("DKSDLCefHandler::OnFullscreenModeChange()\n", DKDEBUG);
	if(fullscreen){
		dkCef->fullscreen = true;
		//SDL_SetWindowFullscreen(dkSdlWindow->sdlwin, SDL_WINDOW_FULLSCREEN_DESKTOP);
	}
	else{
		dkCef->fullscreen = false;
		//SDL_SetWindowFullscreen(dkSdlWindow->sdlwin, 0);
	}
	DKEvent::SendEvent("GLOBAL", "DKCef_OnFullscreen", toString(fullscreen));
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
void DKSDLCefHandler::OnLoadEnd(CefRefPtr<CefBrowser> browser, CefRefPtr<CefFrame> frame, int httpStatusCode)
{
	DKLog("DKSDLCefHandler::OnLoadEnd("+toString(httpStatusCode)+")\n", DKINFO);
	if(frame->IsMain()){
		DKEvent::SendEvent("GLOBAL", "DKCef_OnLoadEnd", toString(httpStatusCode));
	}

	CefRefPtr<CefProcessMessage> msg = CefProcessMessage::Create("TestMessage");
	CefRefPtr<CefListValue> args = msg->GetArgumentList(); // Retrieve the argument list object.
	browser->SendProcessMessage(PID_BROWSER, msg);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
void DKSDLCefHandler::OnLoadError(CefRefPtr<CefBrowser> browser, CefRefPtr<CefFrame> frame, CefLoadHandler::ErrorCode errorCode, const CefString& errorText, const CefString& failedUrl)
{ 
	DKLog("DKSDLCefHandler::OnLoadError("+toString(errorCode)+","+errorText.ToString()+","+failedUrl.ToString()+")\n", DKDEBUG);
	
	if(errorCode == ERR_ABORTED){ return; } // Don't display an error for downloaded files.

	// Display a load error message.
	std::stringstream ss;
	ss << "<html><body bgcolor=\"white\">"
		"<h2>Failed to load URL "
		<< std::string(failedUrl) << " with error " << std::string(errorText)
		<< " (" << errorCode << ").</h2></body></html>";
	frame->LoadString(ss.str(), failedUrl);
	
	DKEvent::SendEvent("GLOBAL", "DKCef_OnLoadError", toString(errorCode));
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
void DKSDLCefHandler::OnLoadingStateChange(CefRefPtr<CefBrowser> browser, bool isLoading, bool canGoBack, bool canGoForward)
{
	DKLog("DKSDLCefHandler::OnLoadingStateChange("+toString(isLoading)+","+toString(canGoBack)+","+toString(canGoForward)+")\n", DKDEBUG);

	for(unsigned int i=0; i<dkCef->browsers.size(); ++i){
		if(browser->GetIdentifier() == dkCef->browsers[i]->GetIdentifier()){
			DKEvent::SendEvent("GLOBAL", "DKCef_OnLoadingStateChange", toString(i));
			return;
		}
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
void DKSDLCefHandler::OnPaint(CefRefPtr<CefBrowser> browser, PaintElementType type, const RectList &dirtyRects, const void *buffer, int width, int height)
{
	//DKLog("DKSDLCefHandler::OnPaint()\n", DKDEBUG);
	if(browser->GetIdentifier() != dkCef->current_browser->GetIdentifier()){ return; }
	if(type == PET_VIEW){
		if(dirtyRects.size() == 0){ return; }

		int w, h;
		SDL_QueryTexture(dkSdlCef->cef_image, NULL, NULL, &w, &h);
		if(w != width || h != height){
			dkSdlCef->cef_image = SDL_CreateTexture(dkSdlWindow->renderer, SDL_PIXELFORMAT_ARGB8888, SDL_TEXTUREACCESS_TARGET, width, height);
		}

		if (!dkSdlCef->background_image) {
			dkSdlCef->background_image = SDL_CreateTexture(dkSdlWindow->renderer, SDL_PIXELFORMAT_ARGB8888, SDL_TEXTUREACCESS_STREAMING, width, height);
		}
		int w2, h2;
		SDL_QueryTexture(dkSdlCef->background_image, NULL, NULL, &w2, &h2);
		if (w2 != width || h2 != height) {
			dkSdlCef->background_image = SDL_CreateTexture(dkSdlWindow->renderer, SDL_PIXELFORMAT_ARGB8888, SDL_TEXTUREACCESS_STREAMING, width, height);
		}

		unsigned char * texture_data = NULL;
		int texture_pitch = 0;
		if(SDL_LockTexture(dkSdlCef->background_image, NULL, (void **)&texture_data, &texture_pitch) == 0){
			//copies whole cef bitmap to sdl texture
			std::memcpy(texture_data, buffer, width * height * 4);
			SDL_UnlockTexture(dkSdlCef->background_image);
		}
	}

	else if(type == PET_POPUP){ //FIXME
		DKLog("DKSDLCefHandler::OnPaint(): type == PET_POPUP\n", DKINFO);
		//if(dirtyRects.size() == 0){ return; }
		if(!dkSdlCef->popup_image){
			dkSdlCef->popup_image = SDL_CreateTexture(dkSdlWindow->renderer, SDL_PIXELFORMAT_ARGB8888, SDL_TEXTUREACCESS_STREAMING, width, height);
		}
		int w, h;
		SDL_QueryTexture(dkSdlCef->popup_image, NULL, NULL, &w, &h);
		if(w != width || h != height){
			dkSdlCef->popup_image = SDL_CreateTexture(dkSdlWindow->renderer, SDL_PIXELFORMAT_ARGB8888, SDL_TEXTUREACCESS_STREAMING, width, height);
		}
		void* mPixels;
		int mPitch;
		if(SDL_LockTexture(dkSdlCef->popup_image, NULL, &mPixels, &mPitch) == 0){
			//copies popup bitmap to sdl texture
			std::memcpy(mPixels, buffer, width * height * 4);
			SDL_UnlockTexture(dkSdlCef->popup_image);
		}
	}

	if(dkSdlCef->cef_image) {	
		SDL_SetRenderTarget(dkSdlWindow->renderer, dkSdlCef->cef_image);
		SDL_RenderCopy(dkSdlWindow->renderer, dkSdlCef->background_image, NULL, NULL);
		if(dkSdlCef->popup_image){
			SDL_Rect popup;
			popup.x = dkSdlCef->popup_rect.x;
			popup.y = dkSdlCef->popup_rect.y;
			popup.w = dkSdlCef->popup_rect.width;
			popup.h = dkSdlCef->popup_rect.height;
			SDL_RenderCopy(dkSdlWindow->renderer, dkSdlCef->popup_image, NULL, &popup);	
		}
		SDL_SetRenderTarget(dkSdlWindow->renderer, NULL);
	}
}

///////////////////////////////////////////////////////////////////////////
void DKSDLCefHandler::OnPopupShow(CefRefPtr<CefBrowser> browser, bool show)
{
	//TODO
	DKLog("DKSDLCefHandler::OnPopupShow()\n", DKDEBUG);
	return;

	if(!show){
		dkSdlCef->popup_image = NULL;
		return;
	}
}

/////////////////////////////////////////////////////////////////////////////////////
void DKSDLCefHandler::OnPopupSize(CefRefPtr<CefBrowser> browser, const CefRect& rect)
{
	//TODO
	DKLog("DKSDLCefHandler::OnPopupSize()\n", DKDEBUG);
	return;

	if(rect.width <= 0 || rect.height <= 0){ return; }
	dkSdlCef->popup_rect = rect;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
bool DKSDLCefHandler::OnPreKeyEvent(CefRefPtr<CefBrowser> browser, const CefKeyEvent& event, CefEventHandle os_event, bool* is_keyboard_shortcut)
{
	CEF_REQUIRE_UI_THREAD();
	//DKLog("OnPreKeyEvent(): char="+toString(event.character)+", native="+toString(event.native_key_code)+", mods="+toString(event.modifiers)+"\n", DKINFO);

	if(event.type == KEYEVENT_RAWKEYDOWN){
		//DKLog("OnPreKeyEvent(): RawKeyDown: "+toString(event.character)+"\n", DKINFO);
		//#ifdef WIN32
		DKEvent::SendEvent("GLOBAL", "keydown", toString(event.windows_key_code));
		//#else
		//			DKEvent::SendEvent("GLOBAL", "keydown", toString(event.character));
		//#endif
	}
	if(event.type == KEYEVENT_KEYDOWN){
		DKLog("OnPreKeyEvent(): KeyDown: "+toString(event.character)+"\n", DKINFO);
	}
	if(event.type == KEYEVENT_KEYUP){
		//DKLog("OnPreKeyEvent(): KeyUp: "+toString(event.character)+"\n", DKINFO);
	}
	if(event.type == KEYEVENT_CHAR){
		//DKLog("OnPreKeyEvent(): KeyChar: "+toString(event.character)+"\n", DKINFO);
		DKEvent::SendEvent("GLOBAL", "keypress", toString(event.character));
	}

	return false;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
bool DKSDLCefHandler::OnPrintDialog(CefRefPtr<CefBrowser> browser, bool has_selection, CefRefPtr<CefPrintDialogCallback> callback)
{
	DKLog("OnPrintDialog()\n", DKINFO);
	return true;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
bool DKSDLCefHandler::OnProcessMessageReceived(CefRefPtr<CefBrowser> browser, CefProcessId source_process, CefRefPtr<CefProcessMessage> message) 
{
	DKLog("DKSDLCefHandler::OnProcessMessageReceived("+DKString(message->GetName())+")\n", DKINFO);

	if(message->GetName() == "GetFunctions"){
		DKV8::GetFunctions(browser);
	}

	if(has(message->GetName(),"CallFunc(")){
		//get function name
		DKString func = message->GetName();
		replace(func,"CallFunc(", "");
		replace(func,")", "");

		//get arguments
		CefRefPtr<CefListValue> arguments = message->GetArgumentList();
		DKV8::Execute(browser, func, arguments);
	}

	return false;
}

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
bool DKSDLCefHandler::OnRequestGeolocationPermission(CefRefPtr<CefBrowser> browser, const CefString& requesting_url, int request_id, CefRefPtr<CefGeolocationCallback> callback)
{
CEF_REQUIRE_UI_THREAD();
DKLog("DKCefWindow::OnRequestGeolocationPermission()\n", DKINFO);

callback->Continue(true);
return true;
}
*/

///////////////////////////////////////////////////////////////////////////////
bool DKSDLCefHandler::OnTooltip(CefRefPtr<CefBrowser> browser, CefString& text)
{
	//FIXME: this is never called
	CEF_REQUIRE_UI_THREAD();
	DKLog("DKCefWindow::OnTooltip()\n", DKINFO);
	return true;
}