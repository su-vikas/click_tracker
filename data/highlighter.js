/* This script is responsible for highlighting the links on the page, which are passed to this script 
*/
//TODO is there any best practice on where should computation to be perfomed, in content script or the main code of the add-on. 

self.port.on('highlightLinks', function(activity){
//get list of all links on the page
    console.log("in highlight links");
    console.log(activity);
    var linksOnPage = document.getElementsByTagName('a');
    colorLinks(linksOnPage);
});

function colorLinks(linksArray){
    for (var i =0; i<linksArray.length;i++){
        linksArray[i].style.color='red';
    }
}
