#pragma once
#ifndef DKCef_H
#define DKCef_H
#include <include/cef_client.h>
#include <include/cef_render_handler.h>
#include <include/cef_browser_process_handler.h>
#include "DK/DK.h"
#include "DK/DKApp.h"
#include "DKCef/DKCefApp.h"
#include "DKCef/DKCefWindow.h"


class DKCefWindow;

//////////////////////////////////////////////////////
class DialogCallback : public CefRunFileDialogCallback 
{
public:
	void OnFileDialogDismissed(int selected_accept_filter, const std::vector<CefString>& file_paths);
	IMPLEMENT_REFCOUNTING(DialogCallback);
};

/////////////////////////////////////
class DKCef : public DKObjectT<DKCef>
{
public:
	bool Init();
	bool End();

	bool CloseBrowser(const int& browser);
	bool DownloadUrl(const DKString& url);
	bool FileDialog();
	bool Find(const DKString& text);
	bool GetBrowsers(int& num);
	bool GetCurrentBrowser(int& browser);
	bool GetUrl(int& browser, DKString& url);
	bool GoBack(const int& browser);
	bool GoForward(const int& browser);
	bool NewBrowser();
	bool Paste();
	bool Print();
	bool Reload(const int& browser);
	bool SelectBrowser(int& browser);
	bool SetUrl(const int& browser, const DKString& url);
	bool ShowDevTools(const int& browser);
	bool Stop(const int& browser);

	static bool RunDuktape(DKString& string, DKString& rval);
	static bool QueueDuktape(DKString& string);
	static bool RunJavascript(DKString& string);
	bool SendEvent(const DKString& id, const DKString& type, const DKString& value);
	void RunPluginInfoTest(CefRefPtr<CefBrowser> browser);
	
	DKString id;
	int top;
	int left;
	int width;
	int height;
	bool inFocus;
	DKString homepage;
	bool fullscreen;
	DKString queue_new_browser;

	std::vector<CefRefPtr<CefBrowser> > browsers;
	CefBrowser* current_browser;
	CefRefPtr<DKCefApp> cefApp;
	CefClient* cefHandler; //external handler  (DKCefWindow, DKSDLCef or DKOSGCef)
	DKCefWindow* dkCefWindow;

	DialogCallback* fileDialogCallback;

#ifdef WIN32
	HMODULE libcef;
	HMODULE libelf;
#endif
};


REGISTER_OBJECT(DKCef, false);

#endif //DKCef_H