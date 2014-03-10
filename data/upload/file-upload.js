function handleFileSelect(evt){
    var files = evt.target.files;
    console.log(JSON.stringify(files));
    for(var i=0,f; f=files[i]; i++)
    {
        //TODO check if the file is JSON
        var fr = new FileReader();
        fr.onload = function(e){
            var activity = JSON.parse(e.target.result);
            console.log(JSON.stringify(activity));
            alert(JSON.stringify(activity));
        };
        fr.readAsText(f);
    }
}

self.on('message', function onMessage(){
    var f = document.getElementById('files').addEventListener('change', handleFileSelect,false);
});

