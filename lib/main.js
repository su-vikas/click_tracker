var widget = require("sdk/widget");
var tabs = require("sdk/tabs");
var pageMod = require("sdk/page-mod");
var simpleStorage = require("sdk/simple-storage");
var panel = require("sdk/panel");
var data = require("sdk/self").data; //to refer to data dir, containing images etc

var iofile=require("sdk/io/file");
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
if(!simpleStorage.storage.linkMap)
    simpleStorage.storage.linkMap = [];

function print(text){
    console.log(text);
}

function console_log(text){
    console.log(selection.text);
}

function linkNode( link, text,label){
    this.url = link;  //url 
    this.urlText = text; //text of the href element
    //this.ancestorId = ancestorId;  //elementId
    this.label = label; //label for this node
}

function handleNewLinkNode( link, text,label ){
    var newLinkNode = new linkNode(link, text, label);
    simpleStorage.storage.linkMap.push(newLinkNode);
}

/* to toggle recording state */
function toggleRecording(){
    recordingIsOn = !recordingIsOn;
    return recordingIsOn;
}

var map_panel = panel.Panel({
    width:180,
    height:180,
    // when panel hides
    onHide:function(){
        panel.contentURL="about:blank";
    }
});

//syncrhonous I/O http://stackoverflow.com/questions/19583711/how-to-append-to-a-file-in-a-firefox-add-on


//generate a html file for the panel.
function generateMapHtml(){
    htmlStr = "<html><body>";
    linkMap.forEach(function(linkNode){
        htmlStr += "<a href='" +linkNode.link + "'> " + linkNode.text +"</a> ->"; 
    });
    htmlStr +=  "</body></html>" ;
    var file = new FileUtils.File("C:\\Users\\vikas_000\\Desktop");
    file.append("map.html");
    //var file = new FileUtils.getFile('Desk',['raw.txt']);
    if(!(file instanceof Ci.nsIFile))
    {
        Cu.reportError("Error: must supply nsIFile");
        return;
    }

    var ostream = FileUtils.openFileOutputStream(file, FileUtils.MODE_WRONLY|FileUtils.MODE_CREATE | FileUtils.MODE_TRUNCATE);
    //console.log(ostream);
    var converter = Cc['@mozilla.org/intl/scriptableunicodeconverter'].createInstance(Ci.nsIScriptableUnicodeConverter);
    converter.charset = "UTF-8";
    var istream = converter.convertToInputStream(htmlStr);

}

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
            //map_panel.contentURL = require("sdk/self").lib.url("map.html");
            //generateMapHtml();
            //map_panel.show();
            /*console.log("\n ------------------------------ \n");
            linkMap.forEach(function(linkNode){
                console.log(linkNode.url + "  " + linkNode.urlText+ "  " + linkNode.label + "\n" );
            });
            */
            linkMapList.show();
        }
        //console.log("show activity list");
    });

    /* list all the links in a panel
     * On its 'show' event we pass it the array of annotations. 
     *
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
            this.postMessage(simpleStorage.storage.linkMap);
        },
        onMessage: function(message){
            require('sdk/tabs').open(message);
        }
    });

    simpleStorage.on("OverQuota", function(){
        notifications.notify({
            title:'Storage Space exceeded',
            text: 'Removing recentl maps'});
            while(simpleStorage.qoutaUsage>1)
               simpleStorage.storage.linkMap.pop();
    });
    var capturer = pageMod.PageMod({
        include: ['*'],
        contentScriptWhen:"ready",      // load content scripts one a DOM content has been loaded. 
        contentScriptFile: [data.url("jquery-2.1.0.js"),
        data.url("capturer.js")],
        onAttach: function(worker){
            worker.postMessage(recordingIsOn);
            worker.port.on("captured",function(node){
                //node array -> link, text
                nodeMap = new handleNewLinkNode(node[0], node[1],"create_link");
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
}
/* Page-mod code, 
 * Documentation: https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/page-mod
 * page-mod runs scripts in the context of web pages whose URL matches a pattern. 
 */




                




        




