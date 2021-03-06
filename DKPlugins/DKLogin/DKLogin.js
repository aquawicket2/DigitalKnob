var FACEBOOK_ID;
var FACEBOOK_NAME;

///////////////////////
function DKLogin_Init()
{
	DK_Create("DKLogin/DKLogin.css");
	DK_Create("DKLogin/DKLogin.html");
	byId("DKLoginFacebook").addEventListener("click", DKLogin_OnEvent);
}

//////////////////////
function DKLogin_End()
{
	byId("DKLoginFacebook").addEventListener("click", DKLogin_OnEvent);
	DK_Close("DKLogin/DKLogin.html");
	DK_Close("DKLogin/DKLogin.css");
}

///////////////////////////////
function DKLogin_OnEvent(event)
{
	if(event.currentTarget.id === "DKLoginFacebook"){
		console.log("DKLogin_OnEvent(): DKLoginFacebook\n");
		DK_Create("DKLogin/DKFacebook.js", function(){
			DKFacebookLogin(DKLogin_OnConnect);
		});
	}
}

/////////////////////////////////
function DKLogin_OnConnect(value)
{
	if(value.status === 'connected'){
		DKFacebook_Query('/me', "name", DKLogin_FBresponse);
		DKFacebook_Query('/me', "id", DKLogin_FBresponse);
		byId("DKLoginFacebook").style.display = "none";
	}
}

////////////////////////////////////////////
function DKLogin_FBresponse(param, response)
{
	if(param === "name"){
		FACEBOOK_NAME = response;
		
		var fbname = DK_CreateElement(byId("DKLogin/DKLogin.html"), "div", "fbname");
		fbname.style.fontSize = "18rem";
		fbname.innerHTML = FACEBOOK_NAME;
	}
	if(param === "id"){
		FACEBOOK_ID = response;
		
		var fbpic = DK_CreateElement(byId("DKLogin/DKLogin.html"), "img", "fbpic");
		fbpic.src = "http://graph.facebook.com/"+FACEBOOK_ID+"/picture";
	}
}