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
Listen for left and right click events and send the corresponding message
to the content script.
*/

this.addEventListener('click', function(event) {
    if(event.button == 0 && event.shiftKey == false && event.ctrlKey == false && event.altKey==false)
    self.port.emit('left-click');

if(event.button == 0 &&  event.ctrlKey ==true && event.shiftKey == false && event.altKey == false)
    self.port.emit('ctrl-click');

if(event.button == 0 && event.shiftKey == false && event.ctrlKey == false && event.altKey == true)
    self.port.emit('alt-click');

if(event.button == 2 || (event.button == 0 && event.shiftKey == true))
    self.port.emit('right-click');

event.preventDefault();
}, true);
