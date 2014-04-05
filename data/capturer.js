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


$(document).ready(function(){
    $('*').click(function(event){
        //event.stopPropagation(); //to stop firing an event for each parent in the hierarchy of the element clicked, but causing weird behaviour for evernote.com 
        var url = this.href;
        if(url!=undefined){
            var urlText = this.text;
            console.log(this.href+ "   " + this.text);
            node = [url,urlText]; 
            //console.log(node);
            self.port.emit("captured", node);
        }
    });
});

/*
$(document).on("click", "a" , function(){
    console.log("CHALTA HAI YE ATLEAST ");
    var href = $(this).attr('href');
    var htmlString = $(this).html();
    var urlText = $(this).text();
    console.log(urlText + " " + href );
    console.log(htmlString);
});
$(document).on("click", "div" , function(){
    console.log("CHALTA HAI YE ATLEAST ");
    var href = $(this).attr('href');
    var htmlString = $(this).html();
    var urlText = $(this).text();
    console.log(urlText + " " + href );
});
*/
