/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*
Construct the HTML for the annotation list.

Bind a function to click events on the link that send a message back to
the add-on code, so it can open the link in the main browser.
*/

self.on('message', function onMessage(storedLinkMap) {
  //console.log("in content script \n");
  var linkMapList = $('#linkMap-list');
  linkMapList.empty();
  storedLinkMap.forEach(
    function(storedAnnotation) {
      var annotationHtml = $('#template .linkMap-details').clone();
      annotationHtml.find('.url').text(storedAnnotation.urlText)
                                 .attr('href', storedAnnotation.url);
      annotationHtml.find('.url').bind('click', function(event) {
        event.stopPropagation();
        event.preventDefault();
        self.postMessage(storedAnnotation.url);
      });
     linkMapList.append(annotationHtml);
    });
});

var textArea = document.getElementById('activityName');
textArea.onkeyup = function(event){
    if(event.keyCode == 13){
        self.postMessage(textArea.value);
        textArea.value='';
    }
};

/*
self.on('message',function(){
    var textArea = document.getElementById('activityName');
    textArea.value='';
    textArea.focus();
});
*/

self.port.on('print', function(aActivity){
    console.log(aActivity);
    /* answer from :http://stackoverflow.com/a/20343999/769407 */
    var data="text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(aActivity));
    $('<a href="data:'+data+'"download="data.json">download json</a>').appendTo('#download');
});

/* will generate json from activity object */
/*
function generate_json(data){
    var jsonArr = {};  // creates a json object 
    jsonArr.push({
        domain: data.domain,
        acitivity_name: data.label,
    });
    for(var i = 0;i<data.map.length; i++)
    {
        jsonArr.push({
              url: data.map[i].url,
              text: data.map[i].urlText
        });
    }
    //json.push({]]});
    console.log(jsonArr);
}
*/
