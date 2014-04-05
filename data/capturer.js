$('*').click(function(){
    var url = this.href;
    if(url!=undefined){
        var urlText = this.text;
        console.log(this.href+ "   " + this.text);
        node = [url,urlText]; 
        //console.log(node);
        self.port.emit("captured", node);
    }
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
