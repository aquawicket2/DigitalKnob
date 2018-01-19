#include "DK/stdafx.h"
#ifdef LINUX
#include "DKLinux.h"
#include "DKLog.h"
#include <stdio.h>
#include <stdlib.h>
#include <X11/Xlib.h>
#include <X11/XKBlib.h>
#include <alsa/asoundlib.h>

/////////////////////////////////////////
bool DKLinux::GetMousePos(int& x, int& y)
{
	//Compile with:
    //cc -Wall -I/usr/X11R6/include -L/usr/X11R6/lib -lXm -o xquerypointer xquerypointer.c
	//or on solaris:
    //cc -I/usr/openwin/include xquerypointer.c -L/usr/openwin/lib -lX11
	
	Display *dpy;
	Window root;
	Window ret_root;
	Window ret_child;
	int root_x;
	int root_y;
	int win_x;
	int win_y;
	unsigned int mask;
 
	dpy = XOpenDisplay(NULL);
	root = XDefaultRootWindow(dpy);
 
	if(XQueryPointer(dpy, root, &ret_root, &ret_child, &root_x, &root_y, &win_x, &win_y, &mask)){
		// original version
		//    printf("root loc: %4d,%4d win loc: %3d,%3d mask: 0x%08X\n", root_x, root_y, win_x, win_y, mask);
		// This returns in -geometry format
		// I added \n so it actually shows something so people who test it know it works.
		x = root_x;
		y = root_y;
		return true;
	}
	
	x = 0;
	y = 0;
	return false;
}

//////////////////////////////////////////
bool DKLinux::Run(const DKString& command)
{
	DKString cmd = command;
	cmd = "xdg-open "+cmd+" &";
	system(cmd.c_str());
	//execl(cmd.c_str(), (char*)0);
	return true;
}

/////////////////////////////////
bool DKLinux::KeyIsDown(int& key)
{
	//TODO - character keys
	DKLog("DKLinux::KeyIsDown("+toString(key)+")\n", DKDEBUG);
	
	XkbStateRec r;
    Display* d = XOpenDisplay(NULL);
    XkbGetState(d, XkbUseCoreKbd, &r);
    //printf("mod: 0x%x\n", r.mods);
	if((r.mods & 0x01) && key == 16){ //Shift
		return true;
	}
	if((r.mods & 0x04) && key == 17){ //Ctrl
		return true;
	}
	if((r.mods & 0x08) && key == 18){ //Alt
		return true;
	}
    XCloseDisplay(d);
	return false;
}

//////////////////////////////////////////
bool DKLinux::GetClipboard(DKString& text)
{
	//TODO
	DKLog("DKLinux::GetClipboard()\n", DKINFO);
	DKClass::CallFunc("DKSDLWindow::GetClipboard", NULL, &text);
	return true;
}

//////////////////////////////////////////
bool DKLinux::SetClipboard(DKString& text)
{
	//TODO
	DKLog("DKLinux::SetClipboard("+text+")\n", DKINFO);
	DKClass::CallFunc("DKSDLWindow::SetClipboard", &text, NULL);
	return false;
}

///////////////////////////////////////
bool DKLinux::SetVolume(double nVolume)
{
	DKLog("DKLinux::SetVolume("+toString(nVolume)+")\n", DKINFO);
	long min, max;
	snd_mixer_t *handle;
	snd_mixer_selem_id_t *sid;
	const char *card = "default";
	const char *selem_name = "Master";

	snd_mixer_open(&handle, 0);
	snd_mixer_attach(handle, card);
	snd_mixer_selem_register(handle, NULL, NULL);
	snd_mixer_load(handle);

	snd_mixer_selem_id_alloca(&sid);
	snd_mixer_selem_id_set_index(sid, 0);
	snd_mixer_selem_id_set_name(sid, selem_name);
	snd_mixer_elem_t* elem = snd_mixer_find_selem(handle, sid);

	snd_mixer_selem_get_playback_volume_range(elem, &min, &max);
	snd_mixer_selem_set_playback_volume_all(elem, nVolume/* * max / 100*/);

	snd_mixer_close(handle);
	return true;
}

//////////////////////////////////////
bool DKLinux::GetVolume(float& volume)
{
	//DKLog("DKLinux::GetVolume()\n", DKINFO);
	long min, max;
	snd_mixer_t *handle;
	snd_mixer_selem_id_t *sid;
	const char *card = "default";
	const char *selem_name = "Master";

	snd_mixer_open(&handle, 0);
	snd_mixer_attach(handle, card);
	snd_mixer_selem_register(handle, NULL, NULL);
	snd_mixer_load(handle);

	snd_mixer_selem_id_alloca(&sid);
	snd_mixer_selem_id_set_index(sid, 0);
	snd_mixer_selem_id_set_name(sid, selem_name);
	snd_mixer_elem_t* elem = snd_mixer_find_selem(handle, sid);

	snd_mixer_selem_get_playback_volume_range(elem, &min, &max);
	DKLog("DKLinux::GetVolume(): min="+toString(min)+" max="+toString(max)+"\n", DKINFO);
	long int vol;
	snd_mixer_selem_get_playback_volume(elem, SND_MIXER_SCHN_FRONT_LEFT, &vol);
	volume = vol;

	DKLog("DKLinux::GetVolume(): returned "+toString(volume)+"\n", DKINFO);
	snd_mixer_close(handle);
	return true;
}


/////////////////////////////////////////////////
bool DKLinux::VirtualMemory(unsigned long long& virtualMemory)
{
	//TODO
	/*
	#include "sys/types.h"
	#include "sys/sysinfo.h"
	struct sysinfo memInfo;
	sysinfo (&memInfo);
	long long totalVirtualMem = memInfo.totalram;
	//Add other values in next statement to avoid int overflow on right hand side...
	totalVirtualMem += memInfo.totalswap;
	totalVirtualMem *= memInfo.mem_unit;
	virtualMemory = totalVirtualMem;
	*/
	return false;
}

/////////////////////////////////////////////////////
bool DKLinux::VirtualMemoryUsed(unsigned long long& virtualMemory)
{
	//TODO
	/*
	long long virtualMemUsed = memInfo.totalram - memInfo.freeram;
	//Add other values in next statement to avoid int overflow on right hand side...
	virtualMemUsed += memInfo.totalswap - memInfo.freeswap;
	virtualMemUsed *= memInfo.mem_unit;
	virtualMemory = virtualMemUsed;
	*/
	return false;
}

//////////////////////////////////////////////////////////
bool DKLinux::VirtualMemoryUsedByApp(unsigned int& virtualMemory)
{
	//TODO
	/*
	#include "stdlib.h"
	#include "stdio.h"
	#include "string.h"

	int parseLine(char* line){
	    // This assumes that a digit will be found and the line ends in " Kb".
	    int i = strlen(line);
	    const char* p = line;
	    while (*p <'0' || *p > '9') p++;
	    line[i-3] = '\0';
	    i = atoi(p);
	    return i;
	}

	int getValue(){ //Note: this value is in KB!
		FILE* file = fopen("/proc/self/status", "r");
		int result = -1;
		char line[128];

		while (fgets(line, 128, file) != NULL){
		    if (strncmp(line, "VmSize:", 7) == 0){
		        result = parseLine(line);
		        break;
		    }
		}
		fclose(file);
		return result;
	}
	*/
	return false;
}

///////////////////////////////////////////////////
bool DKLinux::PhysicalMemory(unsigned long long& physicalMemory)
{
	//TODO
	/*
	long long totalPhysMem = memInfo.totalram;
	//Multiply in next statement to avoid int overflow on right hand side...
	totalPhysMem *= memInfo.mem_unit;
	physicalMemory = totalPhysMem;
	*/
	return false;
}

///////////////////////////////////////////////////////
bool DKLinux::PhysicalMemoryUsed(unsigned long long& physicalMemory)
{
	//TODO
	/*
	long long physMemUsed = memInfo.totalram - memInfo.freeram;
	//Multiply in next statement to avoid int overflow on right hand side...
	physMemUsed *= memInfo.mem_unit;
	physicalMemory = physMemUsed;
	*/
	return false;
}

////////////////////////////////////////////////////////////
bool DKLinux::PhysicalMemoryUsedByApp(unsigned int& physicalMemory)
{
	//TODO
	/*
	#include "stdlib.h"
	#include "stdio.h"
	#include "string.h"

	int parseLine(char* line){
		// This assumes that a digit will be found and the line ends in " Kb".
		int i = strlen(line);
		const char* p = line;
		while (*p <'0' || *p > '9') p++;
		line[i-3] = '\0';
		i = atoi(p);
		return i;
	}

	int getValue(){ //Note: this value is in KB!
		FILE* file = fopen("/proc/self/status", "r");
		int result = -1;
		char line[128];

		while (fgets(line, 128, file) != NULL){
			if (strncmp(line, "VmRSS:", 6) == 0){
				result = parseLine(line);
				break;
			}
		}
		fclose(file);
		return result;
	}
	*/
	return false;
}

///////////////////////
void DKLinux::CpuInit()
{
	//TODO
	return;
}

///////////////////////////////
bool DKLinux::CpuUsed(int& cpu)
{
	//TODO
	/*
	#include "stdlib.h"
	#include "stdio.h"
	#include "string.h"

	static unsigned long long lastTotalUser, lastTotalUserLow, lastTotalSys, lastTotalIdle;

	void init(){
		FILE* file = fopen("/proc/stat", "r");
		fscanf(file, "cpu %llu %llu %llu %llu", &lastTotalUser, &lastTotalUserLow, &lastTotalSys, &lastTotalIdle);
		fclose(file);
	}

	double getCurrentValue(){
		double percent;
		FILE* file;
		unsigned long long totalUser, totalUserLow, totalSys, totalIdle, total;

		file = fopen("/proc/stat", "r");
		fscanf(file, "cpu %llu %llu %llu %llu", &totalUser, &totalUserLow, &totalSys, &totalIdle);
		fclose(file);

		if(totalUser < lastTotalUser || totalUserLow < lastTotalUserLow || totalSys < lastTotalSys || totalIdle < lastTotalIdle){
			//Overflow detection. Just skip this value.
			percent = -1.0;
		}
		else{
			total = (totalUser - lastTotalUser) + (totalUserLow - lastTotalUserLow) + (totalSys - lastTotalSys);
			percent = total;
			total += (totalIdle - lastTotalIdle);
			percent /= total;
			percent *= 100;
		}

		lastTotalUser = totalUser;
		lastTotalUserLow = totalUserLow;
		lastTotalSys = totalSys;
		lastTotalIdle = totalIdle;

		return percent;
	}
	*/
	return false;
}

////////////////////////////////////
bool DKLinux::CpuUsedByApp(int& cpu)
{
	//TODO
	/*
	#include "stdlib.h"
	#include "stdio.h"
	#include "string.h"
	#include "sys/times.h"
	#include "sys/vtimes.h"

	static clock_t lastCPU, lastSysCPU, lastUserCPU;
	static int numProcessors;

	void init(){
		FILE* file;
		struct tms timeSample;
		char line[128];

		lastCPU = times(&timeSample);
		lastSysCPU = timeSample.tms_stime;
		lastUserCPU = timeSample.tms_utime;

		file = fopen("/proc/cpuinfo", "r");
		numProcessors = 0;
		while(fgets(line, 128, file) != NULL){
			if(strncmp(line, "processor", 9) == 0) numProcessors++;
		}
		fclose(file);
	}

	double getCurrentValue(){
		struct tms timeSample;
		clock_t now;
		double percent;

		now = times(&timeSample);
		if(now <= lastCPU || timeSample.tms_stime < lastSysCPU || timeSample.tms_utime < lastUserCPU){
			//Overflow detection. Just skip this value.
			percent = -1.0;
		}
		else{
			percent = (timeSample.tms_stime - lastSysCPU) + (timeSample.tms_utime - lastUserCPU);
			percent /= (now - lastCPU);
			percent /= numProcessors;
			percent *= 100;
		}
		lastCPU = now;
		lastSysCPU = timeSample.tms_stime;
		lastUserCPU = timeSample.tms_utime;

		return percent;
	}
	*/
	return false;
}

//////////////////////////////
bool DKLinux::TurnOffMonitor()
{
	return DKUtil::System("xset dpms force off");
}

/////////////////////////////
bool DKLinux::TurnOnMonitor()
{
	return false;
}

///////////////////////////////
bool DKLinux::LowPowerMonitor()
{
	return false;
}

#endif //LINUX
