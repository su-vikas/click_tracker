$('*').click(function(){
    var link = this.href;
    //TODO somehow on one click many events are generated with 'undefined' links. to filter them:
    if(link!=undefined){
        var text = this.text;
        var str = "Href:" + link + "  text:" + text;
        node = [link,text]; 
        console.log(node);
        self.port.emit("captured", node);
    }
});
