var widget = require("sdk/widget");
var tabs = require("sdk/tabs");
var pageMod = require("sdk/page-mod");
var simpleStorage = require("sdk/simple-storage");
var data = require("sdk/self").data; //to refer to data dir, containing images etc

/* GLOBAL VARIABLES */
recordingIsOn = false;

function linkNode(link, text){
    this.link = link;
    this.text = text;
}

var linkMap = [];

/* to toggle recording state */
function toggleRecording(){
    recordingIsOn = !recordingIsOn;
    return recordingIsOn;
}

exports.main = function(){
    var wid_get = widget.Widget({
            id: "toggle-switch",
            label: "Activity-Recorder",
            contentURL: data.url("widget/pencil-off.png"),
            contentScriptWhen: "ready",
            contentScriptFile: data.url("widget/widget.js")
            });

            wid_get.port.on("left-click", function() {
                console.log("activate/deactivate");
                widget.contentURL = toggleRecording()?data.url("widget/pencil-on.png"):data.url("widget/pencil-off.png");
            });

            wid_get.port.on("right-click", function(){
                console.log("show activity list");
            });
}

/* Page-mod code, 
 * Documentation: https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/page-mod
 * page-mod runs scripts in the context of web pages whose URL matches a pattern. 
 */

pageMod.PageMod({
        include: ['*'],
        contentScriptWhen:"ready",      // load content scripts one a DOM content has been loaded. 
        contentScriptFile: [data.url("jquery-2.1.0.js"),
            data.url("capturer.js")],
        onAttach: function(worker){
            worker.postMessage(recordingIsOn);
            worker.port.on("captured",function(node){
                console.log(node[0] + "  " + node[1] + "\n" );
            });
        }
});


                




        




