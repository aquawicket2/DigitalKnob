var USE_CEF = 1;     //Desktop
var USE_WEBVIEW = 1; //Android, iOS?
var USE_SDL = 0;     //Use with caution
var USE_ROCKET = 0;  //Use with caution
var DKApp_url = "file:///"+DKAssets_LocalAssets()+"index.html";
//var DKApp_url = "http://digitalknob.com/DKTemplate";

DKCreate("DKHook/DKHook.js", function(){});

DKCreate("DK/init.js", function(){});

///////////////////////
function app_LoadPage()
{
	DKLog("app_LoadPage()\n");
	
	DKCreate("DKWindow/DKWindow.js", function(){
	DKCreate("DKScale/DKScale.js", function(){
	DKCreate("DKGui/DKFrame.js", function(){
	DKCreate("DKGui/DKMenu.js", function(){
	DKCreate("DKDebug/DKDebug.js", function(){
	DKCreate("DKEditor/DKEditor.js", function(){
	//DKCreate("DKHook/DKHook.js", function(){
		//DKFrame_Widget("DKHook/DKHook.html");
		DKCreate("DKStats/DKStats.js", function(){
			DKFrame_Widget("DKStats/DKStats.html");
		});
		DKCreate("DKAudio/DKAudio.js", function(){
			DKCreate("DKAudio/DKAudioPlayer.js", function(){
				DKFrame_Widget("DKAudio/DKAudioPlayer.html");
				var assets = DKAssets_LocalAssets();
				DKAudioPlayer_Open(assets+"/DKAudio/test.wav");
			});
		});
	//});		
	});
	});
	});
	});
	});
	});
}