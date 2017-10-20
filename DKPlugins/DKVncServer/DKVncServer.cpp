#include "DK/stdafx.h"
#include "DK/DKFile.h"
#include "DKVncServer.h"

#ifdef WIN32
#define sleep Sleep

#else
#include <unistd.h>
#include <X11/Xlib.h>
#include <X11/Xutil.h>
#endif

#ifdef __IRIX__
#include <netdb.h>
#endif

#include <rfb/keysym.h>
#include "radon.h"
#include <WS2tcpip.h>

static rfbScreenInfoPtr rfbScreen;
static int bpp = 4;

#ifdef LINUX
static Display *disp;
static Window root;
static XImage *image;
#endif

/////////////////////////
typedef struct ClientData
{
	rfbBool oldButton;
	int oldx,oldy;
} ClientData;

DKString DKVncServer::capture;

////////////////////////
void DKVncServer::Init()
{
#ifdef LINUX
	disp = XOpenDisplay(NULL);
	root = DefaultRootWindow(disp);
	XMapWindow(disp, root);
#endif

	capture = "GDI"; //"DIRECTX";
	HWND desktop = GetDesktopWindow();
	RECT size;
	int desktopWidth;
	int desktopHeight;
	if(GetWindowRect(desktop, &size)){
		desktopWidth = size.right - size.left;
		desktopHeight = size.bottom - size.top;
	}

	rfbScreen = rfbGetScreen(&DKApp::argc, DKApp::argv, desktopWidth, desktopHeight, 8, 3, bpp);
	if(!rfbScreen){
		DKLog("DKVncServer::Init(): rfbScreen is invalid", DKERROR);
		return;
	}
	rfbScreen->desktopName = "DKVncServer";
	rfbScreen->frameBuffer = (char*)malloc(desktopHeight * desktopWidth * bpp);
	rfbScreen->alwaysShared = TRUE;
	rfbScreen->ptrAddEvent = mouseevent;
	rfbScreen->kbdAddEvent = keyevent;
	rfbScreen->newClientHook = newclient;
	rfbScreen->httpDir = (char*)DKFile::local_assets.c_str(); //+"DKVncServer";
	rfbScreen->httpEnableProxyConnect = TRUE;

	rfbInitServer(rfbScreen);  
	DKApp::AppendLoopFunc(&DKVncServer::Loop, this);
	DKApp::SetFramerate(0);
}

///////////////////////
void DKVncServer::End()
{

}

////////////////////////
void DKVncServer::Loop()
{
	if(rfbProcessEvents(rfbScreen, 1)){
		DrawBuffer();
	}
}

//////////////////////////////
void DKVncServer::DrawBuffer()
{
    //Capture Desktop
#ifdef LINUX
    image = XGetImage(disp, root, 0, 0, rfbScreen->width, rfbScreen->height, AllPlanes, ZPixmap);
    
    int w,h;
    for(h=0;h<rfbScreen->height;++h) {
      for(w=0;w<rfbScreen->width;++w) {
	  unsigned long xpixel = XGetPixel(image, w, h);
	  unsigned int red   = (xpixel & 0x00ff0000) >> 16;
	  unsigned int green = (xpixel & 0x0000ff00) >> 8;
	  unsigned int blue  = (xpixel & 0x000000ff);

	  rfbScreen->frameBuffer[(h*rfbScreen->width+w)*bpp+0]=red;
	  rfbScreen->frameBuffer[(h*rfbScreen->width+w)*bpp+1]=green;
	  rfbScreen->frameBuffer[(h*rfbScreen->width+w)*bpp+2]=blue;
      }
      rfbScreen->frameBuffer[h*rfbScreen->width*bpp+0]=0xff;
      rfbScreen->frameBuffer[h*rfbScreen->width*bpp+1]=0xff;
      rfbScreen->frameBuffer[h*rfbScreen->width*bpp+2]=0xff;
      rfbScreen->frameBuffer[h*rfbScreen->width*bpp+3]=0xff;
    }
    
    rfbMarkRectAsModified(rfbScreen,0,0,rfbScreen->width,rfbScreen->height);
    XDestroyImage(image);
    image = NULL;
#endif

#ifdef WIN32
	
	if(capture == "GDI"){
		//https://pastebin.com/r3CZpWDs
		HWND desktop = GetDesktopWindow();
		BITMAPINFO info = {0};
		info.bmiHeader.biSize = sizeof(info.bmiHeader);
		info.bmiHeader.biWidth = rfbScreen->width;
		info.bmiHeader.biHeight = rfbScreen->height* -1;
		info.bmiHeader.biPlanes = 1;
		info.bmiHeader.biBitCount = 32;
		info.bmiHeader.biCompression = BI_RGB;
		BYTE* pbBitmap;

		HDC src_dc = GetDC(desktop);
		HDC buffer_dc = CreateCompatibleDC(src_dc);
		HBITMAP dest_dc = CreateDIBSection(buffer_dc, &info, DIB_RGB_COLORS, (void**)&pbBitmap, NULL, 0);
		BITMAP bmp;
		SelectObject(buffer_dc, dest_dc);
		GetObject(dest_dc, sizeof(BITMAP), &bmp);
		int res = BitBlt(buffer_dc, 0, 0, rfbScreen->width, rfbScreen->height, src_dc, 0, 0, SRCCOPY);
		int go = GetObject(dest_dc, sizeof(BITMAP), &bmp);
		//Invert
		size_t n = rfbScreen->width * rfbScreen->height * 4;
		int* buffer = (int*)malloc(n);
		int* dest = (int*)rfbScreen->frameBuffer;
		int* src = ((int*)bmp.bmBits);
		while(src != ((int*)bmp.bmBits) + (rfbScreen->width * rfbScreen->height - 1)){
			char* c_dest = (char*)dest;
			char* c_src = (char*)src;
			c_dest[0] = c_src[2];
			c_dest[1] = c_src[1];
			c_dest[2] = c_src[0];
			c_dest[3] = 0;
			src++;
			dest++;
		}

		rfbMarkRectAsModified(rfbScreen, 0, 0, rfbScreen->width, rfbScreen->height);
		ReleaseDC(desktop, src_dc);
		DeleteDC(src_dc);
		DeleteDC(buffer_dc);
		DeleteObject(dest_dc);
		delete buffer;
	}
	else if(capture == "DIRECTX"){
		//TODO
		//FIXME
		//https://stackoverflow.com/questions/30021274/capture-screen-using-directx

		HRESULT hr = S_OK;
		IDirect3D9 *d3d = nullptr;
		IDirect3DDevice9 *device = nullptr;
		IDirect3DSurface9 *surface = nullptr;
		D3DPRESENT_PARAMETERS parameters = { 0 };
		D3DDISPLAYMODE mode;
		D3DLOCKED_RECT rc;
		UINT pitch;
		SYSTEMTIME st;
		LPBYTE *shots = nullptr;
		UINT adapter = 0;

		// init D3D and get screen size
		d3d = Direct3DCreate9(D3D_SDK_VERSION);
		HRCHECK(d3d->GetAdapterDisplayMode(adapter, &mode));

		parameters.Windowed = TRUE;
		parameters.BackBufferCount = 1;
		parameters.BackBufferHeight = mode.Height;
		parameters.BackBufferWidth = mode.Width;
		parameters.SwapEffect = D3DSWAPEFFECT_DISCARD;
		parameters.hDeviceWindow = NULL;

		// create device & capture surface
		HRCHECK(d3d->CreateDevice(adapter, D3DDEVTYPE_HAL, NULL, D3DCREATE_SOFTWARE_VERTEXPROCESSING, &parameters, &device));
		HRCHECK(device->CreateOffscreenPlainSurface(mode.Width, mode.Height, D3DFMT_A8R8G8B8, D3DPOOL_SYSTEMMEM, &surface, nullptr));

		// compute the required buffer size
		HRCHECK(surface->LockRect(&rc, NULL, 0));
		pitch = rc.Pitch;
		HRCHECK(surface->UnlockRect());

		// allocate screenshots buffers
		UINT count = 1;
		shots = new LPBYTE[count];
		for(UINT i = 0; i < count; i++){
			shots[i] = new BYTE[pitch * mode.Height];
		}

		GetSystemTime(&st); // measure the time we spend doing <count> captures
		wprintf(L"%i:%i:%i.%i\n", st.wHour, st.wMinute, st.wSecond, st.wMilliseconds);
		for (UINT i = 0; i < count; i++)
		{
			// get the data
			HRCHECK(device->GetFrontBufferData(0, surface));

			// copy it into our buffers
			HRCHECK(surface->LockRect(&rc, NULL, 0));
			CopyMemory(shots[i], rc.pBits, rc.Pitch * mode.Height);
			HRCHECK(surface->UnlockRect());
		}
		GetSystemTime(&st);
		wprintf(L"%i:%i:%i.%i\n", st.wHour, st.wMinute, st.wSecond, st.wMilliseconds);

		if(shots != nullptr){
			for (UINT i = 0; i < count; i++){
				//delete shots[i];
			}
			//delete[] shots;
		}
		// save all screenshots
		for(UINT i = 0; i < count; i++){
			//WCHAR file[100];
			//wsprintf(file, "cap%i.png", i);
			//HRCHECK(SavePixelsToFile32bppPBGRA(mode.Width, mode.Height, pitch, shots[i], file, GUID_ContainerFormatPng));
			
			HRESULT hr = S_OK;
			IWICImagingFactory *factory = nullptr;
			IWICBitmapEncoder *encoder = nullptr;
			IWICBitmapFrameEncode *frame = nullptr;
			IWICStream *stream = nullptr;
			GUID pf = GUID_WICPixelFormat32bppPBGRA;
			BOOL coInit = CoInitialize(nullptr);

			HRCHECK(CoCreateInstance(CLSID_WICImagingFactory, nullptr, CLSCTX_INPROC_SERVER, IID_PPV_ARGS(&factory)));
			HRCHECK(factory->CreateStream(&stream));
			std::wstring filename = toWString("test.png");
			HRCHECK(stream->InitializeFromFilename(filename.c_str(), GENERIC_WRITE));
			//HRCHECK(stream->InitializeFromMemory((WICInProcPointer)rfbScreen->frameBuffer, GENERIC_WRITE));
			HRCHECK(factory->CreateEncoder(GUID_ContainerFormatPng, nullptr, &encoder));
			HRCHECK(encoder->Initialize(stream, WICBitmapEncoderNoCache));
			HRCHECK(encoder->CreateNewFrame(&frame, nullptr)); // we don't use options here
			HRCHECK(frame->Initialize(nullptr)); // we dont' use any options here
			HRCHECK(frame->SetSize(rfbScreen->width, rfbScreen->height));
			HRCHECK(frame->SetPixelFormat(&pf));
			HRCHECK(frame->WritePixels(rfbScreen->height, pitch, pitch * rfbScreen->height, shots[i]));
			HRCHECK(frame->Commit());
			HRCHECK(encoder->Commit());

			RELEASE(stream);
			RELEASE(frame);
			RELEASE(encoder);
			RELEASE(factory);
		}

		RELEASE(surface);
		RELEASE(device);
		RELEASE(d3d);
	}
#endif

	rfbDrawString(rfbScreen, &radonFont, 10, 10, "DKVncServer", 0xffffff);
}



/////////////////////////////////////////////
void DKVncServer::clientgone(rfbClientPtr cl)
{
	free(cl->clientData);
	cl->clientData = NULL;
}

///////////////////////////////////////////////////////////////
enum rfbNewClientAction DKVncServer::newclient(rfbClientPtr cl)
{
	//DKLog("newclient()\n", DKINFO);
	cl->clientData = (void*)calloc(sizeof(ClientData), 1);
	cl->clientGoneHook = clientgone;

	//Get client ip address
	struct sockaddr_in addr;
	socklen_t len = sizeof(addr);
	unsigned int ip;
	getpeername(cl->sock, (struct sockaddr*)&addr, &len);
	ip = ntohl(addr.sin_addr.s_addr);
	DKString ipaddress = toString((ip>>24)&0xff)+"."+toString((ip>>16)&0xff)+"."+toString((ip>>8)&0xff)+"."+toString(ip&0xff);
	DKLog("ip = "+ipaddress+"\n", DKINFO);

	return RFB_CLIENT_ACCEPT;
}

////////////////////////////////////////////////////////////////////////////////
void DKVncServer::newframebuffer(rfbScreenInfoPtr screen, int width, int height)
{
	char *oldfb, *newfb;
	oldfb = (char*)screen->frameBuffer;
	newfb = (char*)malloc(width * height * bpp);
	rfbNewFramebuffer(screen, (char*)newfb, width, height, 8, 3, bpp);
	free(oldfb);
}

///////////////////////////////////////////////////////////////////////////
void DKVncServer::mouseevent(int buttonMask, int x, int y, rfbClientPtr cl)
{
	if(buttonMask){
		DKUtil::SetMousePos(x, y);
		DKLog("mouseevent(): buttonMask="+toString(buttonMask)+" x="+toString(x)+" y="+toString(y)+"\n", DKINFO);
	}

	rfbDefaultPtrAddEvent(buttonMask,x,y,cl);
}

//////////////////////////////////////////////////////////////////////
void DKVncServer::keyevent(rfbBool down,rfbKeySym key,rfbClientPtr cl)
{
	if(down){
		DKLog("keyevent(): key="+toString((int)key)+"\n", DKINFO);
	}
}