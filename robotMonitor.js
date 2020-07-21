function initial(){
    var initDataUrl='./robotMonitor.php?action=initData';
    $.get(initDataUrl,function(data){
        // alert(data);
        var _robotSerials=$.parseJSON(data);
        // alert(_robotSerials);
        // for(var i=0;i<_robotSerials.length;++i)
        // {
            // alert(data[i]);
        // }


    })

    var _canvas=document.getElementsById('_canvas');
    var canText=_canvas.get
}


function confirmClicked(){
    alert('test button');
}