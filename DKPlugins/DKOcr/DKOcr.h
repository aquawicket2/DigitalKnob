#pragma once
#ifndef DKOcr_H
#define DKOcr_H

#include "api/baseapi.h"  //tesseract
#include "podofo.h"       //podofo
#include "DK/DK.h"

//////////////////////////////////////
class DKOcr : public DKObjectT<DKOcr>
{
public:
	bool Init();
	void End();
	static bool ImageToText(DKString& file, DKString& text);

	static tesseract::TessBaseAPI* api;
};


REGISTER_OBJECT(DKOcr, true);

#endif //DKOcr_H

