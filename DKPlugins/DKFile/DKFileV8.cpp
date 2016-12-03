#include "DKFileV8.h"
#include "DKFile.h"
#include "DKApp.h"

/////////////////////
void DKFileV8::Init()
{
	DKLog("DKFileV8::Init()\n", DKFILTER);
	//DKCefApp::AttachFunction("Test", DKFileV8::Test);
	DKCefApp::AttachFunction("DKFile_ChDir", DKFileV8::ChDir);
	DKCefApp::AttachFunction("DKFile_DirectoryContents", DKFileV8::DirectoryContents);
	DKCefApp::AttachFunction("DKFile_Exists", DKFileV8::Exists);
	DKCefApp::AttachFunction("DKFile_GetShortName", DKFileV8::GetShortName);
	DKCefApp::AttachFunction("DKFile_IsDirectory", DKFileV8::IsDirectory);
	DKCefApp::AttachFunction("DKFile_MkDir", DKFileV8::MkDir);
}

///////////////////
void DKFileV8::End()
{
	DKLog("DKFileV8::End()\n", DKFILTER);
}

/*
///////////////////////////////////////////////////
bool DKFileV8::Test(CefArgs args, CefReturn retval)
{
	DKLog("DKFileV8::Test(CefArgs,CefReturn)\n", DKFILTER);
	DKString data = args[0]->GetStringValue();
	DKString result = data;
	retval = CefV8Value::CreateString(result);
	return true;
}
*/

////////////////////////////////////////////////////
bool DKFileV8::ChDir(CefArgs args, CefReturn retval)
{
	DKString path = args[0]->GetStringValue();
	DKFile::ChDir(path);
	return true;
}

////////////////////////////////////////////////////////////////
bool DKFileV8::DirectoryContents(CefArgs args, CefReturn retval)
{
	DKString path = args[0]->GetStringValue();
	DKLog("DKFileV8::DirectoryContents("+path+",CefReturn)\n", DKFILTER);
	DKStringArray arry;
	if(!DKFile::GetDirectoryContents(path, arry)){
		return true;
	}
	DKString string = toString(arry, ",");
	retval = CefV8Value::CreateString(string);
	return true;
}

/////////////////////////////////////////////////////
bool DKFileV8::Exists(CefArgs args, CefReturn retval)
{
	DKString path = args[0]->GetStringValue();
	if(!DKFile::PathExists(path)){
		retval = CefV8Value::CreateBool(false);
		return true; 
	}
	retval = CefV8Value::CreateBool(true);
	return true;
}

///////////////////////////////////////////////////////////
bool DKFileV8::GetShortName(CefArgs args, CefReturn retval)
{
	DKString path = args[0]->GetStringValue();
	DKLog("DKFileV8::GetShortName("+path+",CefReturn)\n", DKFILTER);
#ifdef WIN32
	DKString shortname;
	if(DKFile::GetShortName(path, shortname)){
		retval = CefV8Value::CreateString(shortname);
		return true;
	}
#endif
	retval = CefV8Value::CreateString(path);
	return true;
}

//////////////////////////////////////////////////////////
bool DKFileV8::IsDirectory(CefArgs args, CefReturn retval)
{
	DKString path = args[0]->GetStringValue();
	DKLog("DKFileV8::IsDirectory("+path+",CefReturn)\n", DKFILTER);
	if(!DKFile::IsDirectory(path)){
		retval = CefV8Value::CreateBool(false);
		return true;
	}
	retval = CefV8Value::CreateBool(true);
	return true;
}

////////////////////////////////////////////////////
bool DKFileV8::MkDir(CefArgs args, CefReturn retval)
{
	DKString path = args[0]->GetStringValue();
	DKFile::MakeDir(path);
	return true;
}
