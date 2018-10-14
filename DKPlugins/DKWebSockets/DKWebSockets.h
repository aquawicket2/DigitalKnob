#pragma once
#ifndef DKWebSockets_H
#define DKWebSockets_H

//#include "libwebsockets.h"
#include "src/uWS.h"
#include "DK/DK.h"

///////////////////////////////////////////////////
class DKWebSockets : public DKObjectT<DKWebSockets>
{
public:
	bool Init();
	bool End();
	void Loop();

	static bool CloseClient();
	static bool CloseServer();
	static bool CreateClient(const DKString& address);
	static bool CreateServer(const DKString& address, const int& port);
	static bool ProcessMessage(uWS::WebSocket<true>* ws, char *message, size_t length, uWS::OpCode opCode);
	static bool SendMessage(const DKString& message);
	static DKString _address;
	static int _port;
	static uWS::Hub h;
	static uWS::WebSocket<true>* _ws;
	static char* _message;
	static size_t _length;
	static uWS::OpCode _opCode;
};


REGISTER_OBJECT(DKWebSockets, true);

#endif //DKWebSockets_H