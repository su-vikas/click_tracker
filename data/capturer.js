$('*').click(function(){
    var url = this.href;
    if(url!=undefined){
        var urlText = this.text;
        //console.log(document.domain);
        //var str = "Href:" + url + "  text:" + urlText;
        node = [url,urlText]; 
        //console.log(node);
        self.port.emit("captured", node);
    }
});
