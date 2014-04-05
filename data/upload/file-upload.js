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



function handleFileSelect(evt){
    var files = evt.target.files;
    //console.log(JSON.stringify(files));
    var activity;
    for(var i=0,f; f=files[i]; i++)
    {
        //console.log(i);
        //TODO check if the file is JSON 
        //TODO format is correct
        var fr = new FileReader();
        //var fr = new FileReader();
        fr.onload = function(e){
            activity = JSON.parse(e.target.result);
            //console.log(JSON.stringify(activity));
        };
        fr.readAsText(f);
    }
    //send the captured activity object back to the main code. 
    /*to make async file reading a bit synchronous :D */
    /* http://stackoverflow.com/questions/14226803/javascript-wait-5-seconds-before-executing-next-line */
    setTimeout(function(){
        self.port.emit('fileUploaded',activity);
    }, 1000);
}

self.on('message', function onMessage(){
    var f = document.getElementById('files').addEventListener('change', handleFileSelect,false);
});

