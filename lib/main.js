var widget = require("sdk/widget");
var tabs = require("sdk/tabs");
var widget = widget.Widget({
        id:"Mozilla-link",
        label:"Mozilla website",
        contentURL:"http://www.mozilla.org/favicon.ico",
        onClick: function(){
            tabs.open("http://www.mozilla.org");
        }
});
