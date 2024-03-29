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

/*
 * responsible for highlighting the links on the page
 * Two approaches possible:
 * 1. match the url. Cons: some site will have same url but diff url param. 
 * 2. match the url text after partial matching url. TEST IT OUT. 
 */

/* gets the message and the links in form of activity object from add-on */
self.port.on('highlightAllLinks', function(activity){
    // check whether the present tab's hostname matches to the hostname in the activity file uploaded
    var currentPageURL = document.URL;
    if(getHostname(currentPageURL) != activity.hostname) 
    {
        alert(" The activity file is not for this domain!. Exiting" );
        return;
    }

    // get all links on the page
    var linksOnPage = document.getElementsByTagName('a');
    highlightActivity(activity, linksOnPage);

    // colorLinks(linksOnPage); //for testing purpose 
});

self.port.on('highlightLink', function(link){
    var linksOnPage = document.getElementsByTagName('a');
    highlightLinks(link, linksOnPage);
    detectLinkClick();
});

/*
 * MATCHING color scheme
 * RED: if pathname+ url text all match (hostname is checked in the starting)
 * ORANGE: if only text matches 
 */ 

function detectLinkClick(){
    var linksOnPage = document.getElementsByTagName('a');
    for(var j=0;j<linksOnPage.length; j++)
    {
        linksOnPage[j].addEventListener('click', function(event){
            //linksOnPage[j].onclick = function(){
            var link = [];
            link.push(this.href);
            link.push(this.text);
            console.log(link);
            self.port.emit('linkClicked',link);
        });
    }
}
var index = []; //to keep indexes matched
function highlightActivity(activity, linksOnPage){
    var linkMap = activity.map;
    for(var i=0; i<linkMap.length; i++)
    {
        for(var j=0;j<linksOnPage.length; j++)
        {
            var pathname1 = getPathname(linkMap[i].url);
            var pathname2 = getPathname(linksOnPage[j].href);

            /* hostname, pathname and url text both matched */
            if(linkMap[i].urlText == linksOnPage[j].text && pathname1 == pathname2)
            {
                linksOnPage[j].style.color = 'red' ;
                index.push(i);
            }

            /* only url text matched */
            else if(linkMap[i].urlText == linksOnPage[j].text)
            {
                linksOnPage[j].style.color = 'orange';
            }

        }
    }
    self.port.emit('matchIndex', index);
}

function highlightLinks(linkMap, linksOnPage)
{
    for(var i=0; i<linkMap.length; i++)
    {
        for(var j=0;j<linksOnPage.length; j++)
        {
            var pathname1 = getPathname(linkMap[i].url);
            var pathname2 = getPathname(linksOnPage[j].href);

            /* hostname, pathname and url text both matched */
            if(linkMap[i].urlText == linksOnPage[j].text && pathname1 == pathname2)
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

