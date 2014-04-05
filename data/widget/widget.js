/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

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
