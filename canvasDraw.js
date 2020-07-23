function drawCoordinateFrame(x,y,w,h){
    var ctx=document.getElementById("_canvas").getContext("2d");
    ctx.lineWidth="2";
    ctx.lineCap="round";
    ctx.strokeStyle='blue';
    ctx.moveTo(x,y);
    ctx.lineTo(x,y-h);
    ctx.moveTo(x,y);
    ctx.lineTo(x+w,y);
    ctx.stroke();
}

function drawDataDiagram(data,flag){
    var _canvas=document.getElementById("_canvas");
    var _coorW=_canvas.width;
    var _coorH=_canvas.height;
    var ctx=_canvas.getContext("2d");
    ctx.clearRect(0,0,_coorW,_coorH);
    var maxData=0;
    for(var i=0;i<data.length;++i){
        if(maxData<data[i]){
            maxData=data[i];
        }
    }
    var dataSize=data.length;
    if(dataSize<4)
    {
        dataSize=4;
    }
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
    ctx.font="30px Arial";
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
        ctx.fillText(flag[i],_coorX+gap*(i+1)-txtLength/2-_width/2,_coorH-5,_width);
    }
}