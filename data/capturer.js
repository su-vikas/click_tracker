$('*').click(function(){
    var link = this.href;
    var text = this.text;
    var str = "Href:" + link + "  text:" + text;
    console.log(str);
    self.port.emit("captured", str);
});
