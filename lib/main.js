/* Author: Vikas Gupta */
/* TRY TO STICK EITHER TO LOWER LEVEL APIs OR HIGHER LEVEL APIs, switching around can cause problems */
/* TODO
 *  - Upload json object and then highlight the links: getjson for fetching from server, can't access file directly from filesystem
 *  - run the plugin for a particular tab (at present because of domain matching, not a major issue)
 *  - Beautify 
 */

var widget = require("sdk/widget");
var tabs = require("sdk/tabs/utils");   
var pageMod = require("sdk/page-mod");
var simpleStorage = require("sdk/simple-storage");
var panel = require("sdk/panel");
var data = require("sdk/self").data; //to refer to data dir, containing images etc
var sidebar = require("sdk/ui/sidebar");
var selection = require("sdk/selection");

const {Cu} =  require("chrome");
const {Ci} = require("chrome");
const {Cc}  = require("chrome");

/* file picker boilerplate */
const nsIFilePicker = Ci.nsIFilePicker;
var fp = Cc["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
//let console  = (Cu.import("resource://gre/modules/devtools/Console.jsm",{})).console;
Cu.import("resource://gre/modules/FileUtils.jsm"); //for file I/O
Cu.import("resource://gre/modules/NetUtil.jsm");

/* GLOBAL VARIABLES */
recordingIsOn = false;
var linkMap = []; //array of linkNodes, helping to construct the map
var aActivity;
var linkMatchingIsOn = false;
var index; //to maintian state for the url matches 

//presently simplestorage not being used. 
/*
   if(!simpleStorage.storage.linkMap)
   {
   simpleStorage.storage.linkMap = [];
   }
   */

/* to toggle recording state */
function toggleRecording(){
    recordingIsOn = !recordingIsOn;
    return recordingIsOn;
}

/* to toggle link matching */
function toggleLinkMatching(){
    linkMatchingIsOn = !linkMatchingIsOn;
    return linkMatchingIsOn;
}

//To print text to console. 
function print(text){
    console.log(text);
}

function console_log(text){
    console.log(selection.text);
}


/* A node of a link map */
function linkNode( link, text){
    this.url = link;  //url 
    this.urlText = text; //text of the href element
}

/* linkMap object */
function activity(linkNodeArr, label ){
    this.label=label;
    this.hostname = " ";
    this.map = linkNodeArr;//containing the array of all the links visited
}

// To clear the linkMap
function clearLinkMap(){
    linkMap.length =0;
}

//returns the domain of a url given as input
function url_hostname(data){
    /* faster way to get hostname */
    var matches = data.match(/^(http|https)?\:\/\/([^\/:?#]+)(?:[\/:?#]|$)/i);
    if(matches!=null)
    {
        return matches[2];
    }
    else
    {
        print("matches is null");
    }
}
//to return the pathname of the url
function urlPathname(data){
    //from: https://stackoverflow.com/questions/5735483/regex-to-get-first-word-after-slash-in-url
    //returns ["", "http:", "http", "//www.domain.com", "www.domain.com", "/path/to/something", "?query", "query", "#fragment", "fragment", ""]

    //for pathname interested in the 5th index
    var exp = data.split(/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/);
    if(exp!=null)
    {
        return exp[5];
    }
    else
    {
        print("matches is null");
    }
}


// when a new linknode is added
function handleNewLinkNode( link, text){
    /* if the recording is on, then only add links */
    if(recordingIsOn)
    {
        var newLinkNode = new linkNode(link, text);
        arrLength = linkMap.length;
        //check for same hostname
        if(arrLength > 0)
        {
            var url = url_hostname(linkMap[arrLength - 1].url);
            var url2 = url_hostname(link);
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

/* search linkmap */

/* logic for maintaining state of tabs */
function onTabOpen(tab){
    print(tab.url + "is open");
    tab.on('load', logLoad);

}

//for load event of a tab
var firstTime = true;
function logLoad(tab){
    var currentTab = tab.attach({
        contentScriptFile: data.url('highlighter.js')
    });

    currentTab.port.on('linkClicked', function(link){
        console.log("link Clicked" + link);
    });

    if(firstTime == true){
        var link=[];
        print(index);
        for(var i=0;i<index.length; i++){
            if((index[i]+1) < aActivity.map.length)
            {
                var ln = new linkNode(aActivity.map[index[i]+1].url,aActivity.map[index[i]+1].urlText);
                link.push(ln);
                index[i] += 1;
            }
        }
        //clear the index,  
        currentTab.port.emit('highlightLink', link);
        firstTime=false;
        print(index);
    }
}


function getTabWithOpenUrl(url){
    var wm = Cc["@mozilla.org/appshell/window-mediator;1"]
        .getService(Ci.nsIWindowMediator);
    var browserEnumerator = wm.getEnumerator("navigator:browser");

    // Check each browser instance for our URL
    var found = false;
    while (!found && browserEnumerator.hasMoreElements()) {
        var browserWin = browserEnumerator.getNext();
        var tabbrowser = browserWin.gBrowser;

        // Check each tab of this browser instance
        var numTabs = tabbrowser.browsers.length;
        for (var index = 0; index < numTabs; index++) {
            var currentBrowser = tabbrowser.getBrowserAtIndex(index);
            if (url == currentBrowser.currentURI.spec) {
                // The URL is already opened. Select this tab.
                tabbrowser.selectedTab = tabbrowser.tabContainer.childNodes[index];
                // Focus *this* browser-window
                browserWin.focus();

                found = true;
                break;
            }
        }
    }

    // Our URL isn't open. Open it now.
    if (!found) {
        var recentWindow = wm.getMostRecentWindow("navigator:browser");
        if (recentWindow) {
            // Use an existing browser window
            recentWindow.delayedOpenTab(url, null, null, null, null);
        }
        else {
            // No browser windows are open, so open a new one.
            window.open(url);
        }
    }

}
//syncrhonous I/O http://stackoverflow.com/questions/19583711/how-to-append-to-a-file-in-a-firefox-add-on

exports.main = function(){
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

    var upload = panel.Panel({
        width:212,
        height: 200,
        contentURL: data.url("upload/file-upload.html"),
        contentScriptFile:[data.url('jquery-2.1.0.js'),
        data.url('upload/file-upload.js')],
        contentScriptWhen:'ready',
        onShow:function(){
            this.postMessage();
        }
    });

    //gets the uploaded map file
    upload.port.on('fileUploaded', function(activity){
        /*on receiving the uploaded file attaches the highlighting script to the active tab.*/
        //activeTab property is read-only. to deal with it, read the documentation regarding 'activate' event. 

        // make this activity object globally accessible. 
        aActivity = activity;
        getTabWithOpenUrl("www.google.com");

        /*
           var activetab = tabs.activeTab.attach({
           contentScriptFile: data.url('highlighter.js')
           });

        //if no page is loaded
        if(activetab.url == 'about:blank')
        {
        print('load the website');
        }

        //only load when the activetab is the one corresponding to the activity file uploaded.
        else if(aActivity.hostname == url_hostname(activetab.url))
        {
        /*
        activetab.port.emit('highlightAllLinks', activity);
        activetab.port.on('matchIndex', function(indx){
        index = indx;
        });
        tabs.on('load', logLoad);
        }

*/
        /* emits message to start link coloring */
    });

    var wid_get = widget.Widget({
        id: "toggle-switch",
        label: "Activity-Recorder",
        contentURL: data.url("widget/pencil-off.png"),
        contentScriptWhen: "ready",
        contentScriptFile: data.url("widget/widget.js"),
        panel:upload
    });

    wid_get.port.on("left-click", function() {
        wid_get.contentURL = toggleRecording()?data.url("widget/pencil-on.png"):data.url("widget/pencil-off.png");
    });

    wid_get.port.on("right-click", function(){
        if(linkMap){
            linkMapList.show();
        }
    });

    wid_get.port.on("ctrl-click", function(){
        //clear the linkmap, make it ready for next job
        /*
           var rv = fp.show();
           if(rv == nsIFilePicker.returnOK || rv == nsIFilePicket.returnReplace){
           var file = fp.file;
           var path = fp.file.path;
           console.log("in file picket" );
           console.log(path);
           }
           */
        //clearLinkMap();
        /* show the option to upload files */
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

    /*
       var side_bar = sidebar.Sidebar({
       id: 'activity_view',
       title: 'acitivity view',
       url:data.url("sidebar/sidebar.html"),
       onShow:function(){
       this.postMessage(linkMap);
       }
       onMessage: function
       onAttach:function(worker){
       }
       });
       */
    simpleStorage.on("OverQuota", function(){
        notifications.notify({
            title:'Storage Space exceeded',
            text: 'Removing recentl maps'});
        while(simpleStorage.qoutaUsage>1)
        simpleStorage.storage.linkMap.pop();
    });

    /* File picker code */
    //fp.init(window, "Json File", nsIFilePicker.modeOpen);
    //fp.appendFilters(nsIFilePicker.filterAll | nsIFilePicker.filterText);
}

