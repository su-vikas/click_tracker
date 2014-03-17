/*
 * responsible for highlighting the links on the page
 * Two approaches possible:
 * 1. match the url. Cons: some site will have same url but diff url param. 
 * 2. match the url text after partial matching url. TEST IT OUT. 
 */

/* gets the message and the links in form of activity object from add-on 
 */
//TODO deal when a new page is loaded 
self.port.on('highlightLinks', function(activity){
//get list of all links on the page
    console.log("in highlight links");
    console.log(activity);

    // get all links on the page
    var linksOnPage = document.getElementsByTagName('a');
    highlightLinks(activity, linksOnPage);
   // colorLinks(linksOnPage);
});

//TODO check the present url. move to that point in the linkMap and then highlight
// takes the activity object and array of links on the page and highlights 
function highlightLinks(activity, linksOnPage){
    console.log("yhaan hoon mai");
    var linkMap = activity.map;
    for(var i=0; i<linkMap.length; i++)
    {
        for(var j=0;j<linksOnPage.length; j++)
        {
            if(linkMap[i].urlText == linksOnPage[j].text)
            {
                //console.log("activity: " + linkMap[i].urlText + "dynamic: " + linksOnPage[j].text);
                linksOnPage[j].style.color = 'red' ;
            }
        }
    }
}

//color all links on the page. used while testing functionalities. 
function colorLinks(linksArray){
    for (var i =0; i<linksArray.length;i++){
        //console.log(linksArray[i].text);
        linksArray[i].style.color='red';
    }
}
