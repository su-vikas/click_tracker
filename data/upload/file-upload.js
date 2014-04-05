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
    setTimeout(function(){
        self.port.emit('fileUploaded',activity);
    }, 1000);
}

self.on('message', function onMessage(){
    var f = document.getElementById('files').addEventListener('change', handleFileSelect,false);
});

