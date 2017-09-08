#pragma once
#ifndef DKOSGManipulator_H
#define DKOSGManipulator_H
#include <osgGA/TrackballManipulator>

///////////////////////////////////////////////////////////
class DKOSGManipulator : public DKObjectT<DKOSGManipulator>
{
public:
	void Init();
	void End();
	
	osg::ref_ptr<osgGA::TrackballManipulator> tb;
};


REGISTER_OBJECT(DKOSGManipulator, true);

#endif //DKOSGManipulator_H
