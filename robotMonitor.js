// document.write("<script language=javascript src='./canvasDraw.js'></script>");

function initial(){
    var initDataUrl='./robotMonitor.php?action=initData';
    $.get(initDataUrl,function(data){
        var _robotSerials=$.parseJSON(data);
        for(var i=0;i<_robotSerials.length;++i)
        {
            $('.robotSelector').append('<option value='+_robotSerials[i]+'>'+_robotSerials[i]+'</option>');
        }
    })
}


function confirmClicked(){
    // alert('test button');
    var _date=$('.dateSelector').val();
    var _robotSerial=$('.robotSelector').val();
    // alert(_date);
    // alert(_robotSerial);
    var getDataUrl='./robotMonitor.php?action=getRobotData';
    // alert(getDataUrl);
    $.post(getDataUrl,{date:_date,robotSerial:_robotSerial},function(data){
        var _data=$.parseJSON(data);
        for(var i=0;i<_data.length;++i){
            // alert(_data[i]['robotState']);
            alert(_data[i]['time']);
        }
        // alert($.parseJSON(data)[1]['robotState']);
    });
    var data=[10,111,34];
    var flag=['STOP','PAUSE','OFFLINE'];
    drawDataDiagram(data,flag);
}



function drawDataDiagram(data,flag){
    var _canvas=document.getElementById("_canvas");
    var _coorW=_canvas.width;
    var _coorH=_canvas.height;
    // alert(_coorW);
    // alert(_coorH);
    var ctx=_canvas.getContext("2d");
    ctx.clearRect(0,0,_coorW,_coorH);
    var maxData=0;
    for(var i=0;i<data.length;++i){
        if(maxData<data[i]){
            maxData=data[i];
        }
    }
    var dataSize=data.length;
    var _coorX=0;
    var _coorY=_coorH;
    var _rate=(_coorH-50)/maxData;
    var _data=[];
    for(var i=0;i<data.length;++i){
        var _d=parseInt(data[i]*_rate);
        _data.push(_d);
    }
    var gap=parseInt((_coorW-10)/dataSize);
    var _width=gap/2;
    ctx.font="25px Arial";
    for(var i=0;i<data.length;++i)
    {
        ctx.fillStyle='blue';
        ctx.strokeStyle='blue';
        ctx.fillRect(_coorX+gap*(i+1)-_width,_coorY-_data[i],_width,_data[i]);
        ctx.strokeRect(_coorX+gap*(i+1)-_width,_coorY-_data[i],_width,_data[i]);
        var txtLength=ctx.measureText(data[i]).width;
        ctx.fillStyle='red';
        ctx.strokeStyle='red';
        ctx.fillText(data[i],_coorX+gap*(i+1)-txtLength/2-_width/2,_coorY-_data[i]-10,_width);
        txtLength=ctx.measureText(flag[i]).width;
        // ctx.fillStyle='black';
        // ctx.strokeStyle='black';
        ctx.fillText(flag[i],_coorX+gap*(i+1)-txtLength/2-_width/2,_coorH-5,_width);
    }
}