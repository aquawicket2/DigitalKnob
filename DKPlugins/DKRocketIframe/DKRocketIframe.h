#pragma once
#ifndef DKRocketIframe_H
#define DKRocketIframe_H


///////////////////////////////////////////////////////////////////////////////////////////
class DKRocketIframe : public Rocket::Core::EventListener, public DKObjectT<DKRocketIframe>
{
public:
	void Init();
	void End();
};

REGISTER_OBJECT(DKRocketIframe, true)
#endif //DKRocketIframe_H