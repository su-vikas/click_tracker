function readSingleFile(evt){
    console.log("entered");
    var file = evt.target.files[0];
    if(file){
        console.log("entered into if");
        var activity =jQuery.parseJSON(file);
        console.log(activity);
        /*
           var reader = new FileReader();
           reader.onload = function(e){
           var contents = e.target.result;
           var activity = eval(file);

           };
        reader.readAsText(file);
        */
    }
    else{
        console.log("Failed to load file");
    }
}
self.on('message', function onMessage(){
    console.log("show");
    var inputFile = ocument.getElementById('uploadFile').addEventListener('change', readSingleFile, false);
});


