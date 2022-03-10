function showQR() {
    let dragtarget;
    let draging=false;
    let thisurl = location.href;
    let lastdragx=0;
    let offx=0;
    let lastdragy=0;
    let offy=0;
    if(!thisurl.startsWith("http")){
        return
    }
    if(document.getElementById("thisurlqrdiv")){
        document.getElementById("thisurlqrdiv").remove();
    }
    let position="screentop";
      
    qrgenerator = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&margin=20&data=" + thisurl;
//    qrgenerator = chrome.runtime.getURL("images/106_h_24.png");
    let parent = document.getElementsByTagName("body")[0];
    let child = document.createElement("div");
    child.draggable="true";
    child.id="thisurlqrdiv";
    child.addEventListener("dblclick",function(e){
        child.remove();
    });
    let childchild = document.createElement("img");
    childchild.src = qrgenerator;
    childchild.alt = "URL2QRinserter"
    childchild.draggable="true";
    childchild.id="thisurlqr";
    childchild.style="position:absolute;z-index:2147483646;border:1px solid #000000;filter:none;"
    child.append(childchild);
    parent.appendChild(child);
    position_int=0;
    chrome.storage.sync.get({
        defaultposition: 'screentop',
    }, function(items) {
        position = items.defaultposition;
        if(position=="screentop"){
            position_top = window.scrollY;
        }else if(position=="pagetop"){
            position_top = 1;
        }else if(position=="pagebottom"){
            position_top = document.documentElement.scrollHeight;
        }
        childchild.style.top=position_top+"px";
        childchild.style.right="1px"
        scrollTo(0,position_top);
    });

    let body1 = document.getElementsByTagName("body")[0];
    
    body1.addEventListener('dragstart',function(e){
        console.log(e);
        if(e.target.id=="thisurlqr"){
            dragtarget = e.target;
            draging=true;
            offx= e.offsetX;
            offy = e.offsetY;
        }
    })
    body1.addEventListener('dragend',function(e){
        if(draging==true){
            dragtarget.style.top =  (lastdragy - offy)+"px";
            dragtarget.style.left = (lastdragx - offx) + "px";
        }
        if(e.target.id=="thisurlqr"){
            dragtarget = "";
            draging=false;
        }
        
    })
    // body1.addEventListener('drop',function(e){
    //     if(draging == true){
    //         dragtarget.style.top =  e.pageY+"px";//lastdragy +"px";//(e.pageY * -1)+"px";
    //         dragtarget.style.left = e.pageX+"px";//lastdragx + "px"; //e.pageX+"px";//e.pageX - e.offsetX;//e.pageX+"px";

    //     }
    // });
    body1.addEventListener('dragover',function(e){
        e.preventDefault()
        if(draging==true){
            lastdragx = e.pageX;
            lastdragy = e.pageY;
        }
    });
}
chrome.action.onClicked.addListener((tab) => {
	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		function: showQR
	});
});