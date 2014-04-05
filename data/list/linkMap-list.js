/**
 * Copyright (C) 2014  Vikas Gupta <vikasgupta.nit@gmail.com>
 * 
 * This is a free software; you can redistribute it and/or modify 
 * it under the terms of the GNU General Public License as published 
 * by the Free Software Foundation; either version 2, or any later version.
 * 
 * This is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty
 * of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See
 * the GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with program; see the file docs/LICENSE. If not, write to the
 * Free Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
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

self.port.on('print', function(aActivity){
    var hostname;
    /* answer from :http://stackoverflow.com/a/20343999/769407 */
    if(aActivity.map.length > 0)
    {
        // to extract the hostname using javascript API. Not creating own regex
        var url = document.createElement('a');
        url.href = aActivity.map[0].url; 
        hostname = url.hostname;
        aActivity.hostname = hostname;
    }
    console.log(aActivity);
    var data="text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(aActivity));
    $('<a href="data:'+data+'"download="data.json">download json</a>').appendTo('#download');
});

