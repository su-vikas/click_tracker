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
    
    // check whether the present tab's hostname matches to the hostname in the activity file uploaded
    var currentPageURL = document.URL;
    if(getHostname(currentPageURL) != activity.hostname) 
    {
        alert(" The activity file is not for this domain!. Exiting" );
        return;
    }

    // get all links on the page
    var linksOnPage = document.getElementsByTagName('a');
    highlightLinks(activity, linksOnPage);
    // colorLinks(linksOnPage);
});

//TODO check the present url. move to that point in the linkMap and then highlight
// takes the activity object and array of links on the page and highlights 
/*
 * MATCHING color scheme
 * RED: if hostname+pathname+ url text all match
 * ORANGE: if only text matches 
 */ 
function highlightLinks(activity, linksOnPage){
    var linkMap = activity.map;
    for(var i=0; i<linkMap.length; i++)
    {
        for(var j=0;j<linksOnPage.length; j++)
        {
            var hostPathname1 = getHostnamePathname(linkMap[i].url);
            var hostPathname2 = getHostnamePathname(linksOnPage[j].href);

            /* hostname, pathname and url text both matched */
            if(linkMap[i].urlText == linksOnPage[j].text && hostPathname1 == hostPathname2)
            {
                linksOnPage[j].style.color = 'red' ;
            }

            /* only url text matched */
            else if(linkMap[i].urlText == linksOnPage[j].text)
            {
                linksOnPage[j].style.color = 'orange';
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

//takes the complete url and returns the hostname+path
function getHostnamePathname(link){
    var hostname = getHostname(link);
    var pathname= getPathname(link);
    return (hostname+pathname);
}

/* returns the hostname of a url */
function getHostname(link){
    var url = document.createElement('a'); 
    url.href = link;
    var hostname = url.hostname;
    return hostname;
}

/* returns the pathname of a url */
function getPathname(link){
    var url = document.createElement('a'); 
    url.href = link;
    var pathname = url.pathname;
    return pathname;
}

