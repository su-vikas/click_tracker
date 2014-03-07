var activity_str = {"label":"dfdf", "domain":" ", "map":[{"url":"nitkkr.ac.in/pagesUI/homePage.xhtml?page=home&pageEvent=null&language=2","urlText":"Continue to main website"},{"url":"nitkkr.ac.in/pagesUI/homePage.jsf?pageEvent=4&page=content&language=2","urlText":"TRAINING & PLACEMENT"}]};

function handleFileSelect(evt){

    console.log("-------------------------------");
    var activity  = JSON.parse(activity_str);
    console.log(activity);
    console.log(activity.label);
    /*
    var files=evt.target.files;

    console.log(files);
    console.log(evt);
    //var file_name = $(this).val();
    //var file_name = this.files[0];
    console.log(file_name);
    if(!file_name.type.match('application.json')){
        console.log("not json file");
    }
    var fr = new FileReader();
    fr.onload = function(e){
        console.log("read event" );
        var myJSON = JSON.parse(e.target.result);
        console.log(myJSON);
        alert(JSON.stringify(myJSON));
    };
    fr.readAsText(file_name);
    */
}
document.getElementById('files').addEventListener('change', handleFileSelect,false);

/*
$('input[name=textjson]').change('input', function(data){
    console.log("here");

    activity_str = $(this).val();
    var activity =JSON.parse(activity_str);
    console.log(activity);
    console.log(activity.label);
});

*/
/*
   $('input[name=uploadFile]').change(function(evt){
    var files=evt.target.files;
    console.log(evt);
    console.log("-------------------------------");
    console.log($(this));
    var file_name = $(this).val();
    //var file_name = this.files[0];
    console.log(file_name);
    if(!file_name.type.match('application.json')){
        console.log("not json file");
    }
    var fr = new FileReader();
    fr.onload = function(e){
        console.log("read event" );
        var myJSON = JSON.parse(e.target.result);
        console.log(myJSON);
        alert(JSON.stringify(myJSON));
    };
    fr.readAsText(file_name);
    //var json = jQuery.parseJSON(file_name);
    //console.log(json);
    
    /*
    $.getJSON(file_name,function(data){
        console.log("data:");
        console.log(data);
    });
    
});
*/

self.on('message', function onMessage(){
    //console.log("show");
    //var inputFile = document.getElementById('uploadFile').addEventListener('change', readSingleFile, false);
});
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
