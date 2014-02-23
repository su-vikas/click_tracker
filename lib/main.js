var widget = require("sdk/widget");
var tabs = require("sdk/tabs");
var pageMod = require("sdk/page-mod");
var simpleStorage = require("sdk/simple-storage");
var panel = require("sdk/panel");
var data = require("sdk/self").data; //to refer to data dir, containing images etc

var selection = require("sdk/selection");
const {Cu} =  require("chrome");
const {Ci} = require("chrome");
const {Cc}  = require("chrome");

//let console  = (Cu.import("resource://gre/modules/devtools/Console.jsm",{})).console;
Cu.import("resource://gre/modules/FileUtils.jsm"); //for file I/O
Cu.import("resource://gre/modules/NetUtil.jsm");

/* GLOBAL VARIABLES */
recordingIsOn = false;

var linkMap = []; //array of linkNodes, helping to construct the map
var aActivity;
if(!simpleStorage.storage.linkMap)
    simpleStorage.storage.linkMap = [];

function print(text){
    console.log(text);
}

function console_log(text){
    console.log(selection.text);
}

function linkNode( link, text){
    this.url = link;  //url 
    this.urlText = text; //text of the href element
}

function activity(linkNodeArr, label ){
    this.label=label;
    this.domain = " ";
    this.map = linkNodeArr;
}

function url_domain(data){
    /* faster way to get domain */
    /* TODO for both http and https */
    var matches = data.match(/^http?\:\/\/([^\/:?#]+)(?:[\/:?#]|$)/i);
    var domain = matches && matches[1];
    if(matches!=null)
    {
        return matches[1];
    }
    else
    {
        print("matches is null");
    }

    /* slower but simpler */
    /*
    var a = document.createElement('a');
    a.href = data;
    return a.hostname;
    */
}

function handleNewLinkNode( link, text){
    /* if the recording is on, then only add links */
    if(recordingIsOn)
    {
        var newLinkNode = new linkNode(link, text);
        arrLength = linkMap.length;
        //check for same domain
        if(arrLength > 0)
        {
            var url = url_domain(linkMap[arrLength - 1].url);
            var url2 = url_domain(link);
            if(url == url2)
            {
                linkMap.push(newLinkNode);
            }
        }
        else if(arrLength == 0)
            linkMap.push(newLinkNode);
    }
    //simpleStorage.storage.linkMap.push(newLinkNode);
}

/* to toggle recording state */
function toggleRecording(){
    recordingIsOn = !recordingIsOn;
    return recordingIsOn;
}

/*
var map_panel = panel.Panel({
    width:180,
    height:180,
    // when panel hides
    onHide:function(){
        panel.contentURL="about:blank";
    }
});

*/
//syncrhonous I/O http://stackoverflow.com/questions/19583711/how-to-append-to-a-file-in-a-firefox-add-on

exports.main = function(){
    var wid_get = widget.Widget({
        id: "toggle-switch",
        label: "Activity-Recorder",
        contentURL: data.url("widget/pencil-off.png"),
        contentScriptWhen: "ready",
        contentScriptFile: data.url("widget/widget.js")
    });

    wid_get.port.on("left-click", function() {
        wid_get.contentURL = toggleRecording()?data.url("widget/pencil-on.png"):data.url("widget/pencil-off.png");
    });

    wid_get.port.on("right-click", function(){
        if(linkMap){
            linkMapList.show();
        }
    });

    /* list all the links in a panel
     * On its 'show' event we pass it the array of annotations. 
     * The content script creates the HTML elements for the annotations, and intercepts clicks on the links, passing them back to the add-on to open them in the browser.
     * */
    var linkMapList = panel.Panel({
        width:220,
        height:220,
        contentURL: data.url('list/linkMap-list.html'),
        contentScriptFile: [data.url('jquery-2.1.0.js'),
                            data.url('list/linkMap-list.js')],
        contentScriptWhen:'ready',
        onShow:function(){
            //this.postMessage(simpleStorage.storage.linkMap);
            this.postMessage(linkMap);
        },
        onMessage: function(activityName){
            if(activityName){
                aActivity = new activity(linkMap, activityName);
                this.port.emit("print",aActivity);
            }
        }
    });

    simpleStorage.on("OverQuota", function(){
        notifications.notify({
            title:'Storage Space exceeded',
            text: 'Removing recentl maps'});
            while(simpleStorage.qoutaUsage>1)
               simpleStorage.storage.linkMap.pop();
    });

/* Page-mod code, 
 * Documentation: https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/page-mod
 * page-mod runs scripts in the context of web pages whose URL matches a pattern. 
 */
    var capturer = pageMod.PageMod({
        include: ['*'],
        contentScriptWhen:"ready",      // load content scripts one a DOM content has been loaded. 
        contentScriptFile: [data.url("jquery-2.1.0.js"),
                            data.url("capturer.js")],
        onAttach: function(worker){
            worker.postMessage(recordingIsOn);
            worker.port.on("captured",function(node){
                /* add logic if recording is on */
                nodeMap = new handleNewLinkNode(node[0], node[1]);
            });
        }
    });
}

                




        




