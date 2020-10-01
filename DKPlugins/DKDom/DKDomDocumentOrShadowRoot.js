// https://developer.mozilla.org/en-US/docs/Web/API/DocumentOrShadowRoot
// https://javascript.info/mixins

var DocumentOrShadowRoot = {
	
	// Properties
	//activeElement =      { console.log("activeElement");      } //FIXME
	//fullscreenElement =  { console.log("fullscreenElement");  } //FIXME
	//pointerLockElement = { console.log("pointerLockElement"); } //FIXME
	//styleSheets =        { console.log("styleSheets");        } //FIXME
	
	// Methods
	caretPositionFromPoint(){
		//TODO
	},
	
	elementFromPoint(x, y){
		//console.log("DocumentOrShadowRoot.elementFromPoint("+x+","+y+")");
		//NOTE: Rml uses GetHoverElement and gets mouse x, y on it's own.
		var elementAddress = DKCPP_DKDomDocumentOrShadowRoot_elementFromPoint();
		if(!elementAddress ){
			console.error("DocumentOrShadowRoot.elementFromPoint("+x+","+y+"): elementAddress invalid");
			return; 
		}
		return new HTMLElement(elementAddress);
	},
	
	elementsFromPoint(){ 
		//TODO
		DKCPP_DKDomDocumentOrShadowRoot_elementsFromPoint();
	},
	getSelection(){
		//TODO
		DKCPP_DKDomDocumentOrShadowRoot_getSelection();
	},
	nodeFromPoint(){
		//TODO
		DKCPP_DKDomDocumentOrShadowRoot_nodeFromPoint();
	},
	nodesFromPoint(){
		//TODO
		DKCPP_DKDomDocumentOrShadowRoot_nodesFromPoint();
	}
};