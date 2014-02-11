var widget = require("sdk/widget");
var tabs = require("sdk/tabs");
var pageMod = require("sdk/page-mod");
var simpleStorage = require("sdk/simple-storage");
var panel = require("sdk/panel");
var data = require("sdk/self").data; //to refer to data dir, containing images etc

/* GLOBAL VARIABLES */
recordingIsOn = false;


var linkMap = []; //array of linkNodes, helping to construct the map

function linkNode(link, text){
    this.link = link;
    this.text = text;
}


/* to toggle recording state */
function toggleRecording(){
    recordingIsOn = !recordingIsOn;
    return recordingIsOn;
}


var map_panel = panel.Panel({
    width:180,
    height:180,
    contentURL:"http://www.nitkkr.ac.in"
    // when panel hides
    onHide:function(){
        panel.contentURL="about:blank";
});

// TODO create an html file and then use that to display in the panel


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
                if(linkMap){
                    map_panel.show();
                    console.log("\n ------------------------------ \n");
                    linkMap.forEach(function(linkNode){
                        console.log(linkNode.link + "  " + linkNode.text+ "\n" );
                    });
                }
                //console.log("show activity list");
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
                //node array -> link, text
                nodeMap = new linkNode(node[0], node[1]);
                //console.log(nodeMap);
                linkMap.push(nodeMap);
                /* logging 
                linkMap.forEach(function(linkNode){
                    console.log(linkNode.link + "  " + linkNode.text+ "\n" );
                });
                */
            });
        }
});


                




        




