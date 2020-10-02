#ifdef USE_DKDuktape
#include "DK/DKFile.h"
#include "DKAssets/DKAssets.h"
#include "DKAssets/DKAssetsJS.h"

///////////////////////
bool DKAssetsJS::Init()
{
	DKDEBUGFUNC();
	//DKDuktape::AttachFunction("DKCPP_DKAssets_AppendDataPath", DKAssetsJS::AppendDataPath);
	DKDuktape::AttachFunction("DKCPP_DKAssets_LocalAssets", DKAssetsJS::LocalAssets);
	DKDuktape::AttachFunction("DKCPP_DKAssets_OnlineAssets", DKAssetsJS::OnlineAssets);
	DKDuktape::AttachFunction("DKCPP_DKAssets_Protocol", DKAssetsJS::Protocol);
	return true;
}

///////////////////////////////////////////
//int DKAssetsJS::AppendDataPath(duk_context* ctx)
//{
//  DKDEBUGFUNC(ctx);
//	DKString path = duk_require_string(ctx, 0);
//	if (!DKAssets::AppendDataPath(path)){ return 0; }
//	return 1;
//}

/////////////////////////////////////////////
int DKAssetsJS::LocalAssets(duk_context* ctx)
{
	DKDEBUGFUNC(ctx);
	duk_push_string(ctx, DKFile::local_assets.c_str());
	return 1;
}

//////////////////////////////////////////////
int DKAssetsJS::OnlineAssets(duk_context* ctx)
{
	DKDEBUGFUNC(ctx);
	duk_push_string(ctx, DKFile::online_assets.c_str());
	return 1;
}

//////////////////////////////////////////
int DKAssetsJS::Protocol(duk_context* ctx)
{
	DKDEBUGFUNC(ctx);
	duk_push_string(ctx, "file:");
	return 1;
}


#endif //USE_DKDuktape