### MASTER CMakeLists.txt FILE ###
###
### This will be the ONLY CMakeLists.txt file in DigitalKnob
### All Apps will be build from here.
### The required Tools, libraries and plugins will optionaly build from here. 
###
### TODO
### Build App - just the app (do not delete cmake files, do not do anything with dependencies)
### Rebuild App - the app (erase the app's cmake, and rebuild, but don't do anything with dependencies)
### Build All - (don't erase cmake files, but build the app and it's dependencies)
### Rebeuild All - (erase all cmake files, and build the app and it's dependencies)

CMAKE_MINIMUM_REQUIRED(VERSION 3.4)
PROJECT(DigitalKnob)
INCLUDE(DKCMake/PROCESS.cmake)