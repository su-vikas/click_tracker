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
        fr.onload = function(e){
            activity = JSON.parse(e.target.result);
            //console.log(JSON.stringify(activity));
        };
        fr.readAsText(f);
    }
    //send the captured activity object back to the main code. 
    //TODO async file reading causing delay in reading file and further execution of code. shift to sync file reading 
    alert(JSON.stringify(activity));
    //console.log(JSON.stringify(activity));
    self.port.emit('fileUploaded',activity);
}

self.on('message', function onMessage(){
    var f = document.getElementById('files').addEventListener('change', handleFileSelect,false);
});

