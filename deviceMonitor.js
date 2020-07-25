// document.write("<script language=javascript src='./canvasDraw.js'></script>");

window.date='init';
window.deviceSerial='init';
window.workshop='init';

var maxTitlePerPage=15;
var showTime=400;
var choosedDate,choosedDevice,choosedWorkshop;
var deviceHaltData=new Array();
// var deviceHaltTimeData=new Array();

var deviceWorkshop=new Array();
var deviceSerials=new Array();
var deviceStates=new Array();
var deviceHaltTimes=new Array();
var deviceHaltElaspe=new Array();
var deviceHaltDescription=new Array();

var queryHaltDataFlag=true; 

var currPageTitle,totalPage;

var stateColor={
    'offline':'blue',
    'check':'green',
    'stop':'red',
    'pause':'yellow'
};


var getDataUrl='./deviceMonitor.php?action=getDeviceData';

function clearData(){
    deviceWorkshop.length=0;
    deviceSerials.length=0;
    deviceStates.length=0;
    deviceHaltTimes.length=0;
    deviceHaltElaspe.length=0;
    deviceHaltDescription.length=0;
    deviceHaltData.length=0;
}

function getDeviceHaltData(){
    queryHaltDataFlag=true; 

    $.ajaxSetup({
            async : false
        });
    $.post(getDataUrl,{date:choosedDate,deviceSerial:choosedDevice,workshop:choosedWorkshop},function(data){
        // alert(data);
        if(data==0){
            $('._canvas').hide(showTime);
            $('.tableDiv').hide(showTime);
            $('.pieChartCanvas').hide(showTime);
            $('.tableButtonDiv').hide(showTime/2);
            queryHaltDataFlag=false;
            return;
        }
        deviceHaltData=$.parseJSON(data);
        for(var i=0;i<deviceHaltData.length;++i){
            var _state=deviceHaltData[i]['deviceState'];
            if(_state=='check'){
                continue;
            }
            var _elaspe=deviceHaltData[i]['elaspe'];
            var _device=deviceHaltData[i]['deviceSerial'];
            var _time=deviceHaltData[i]['time'];
            var _workshop=deviceHaltData[i]['workshop'];
            var _description=deviceHaltData[i]['description'];

            deviceWorkshop.push(_workshop);
            deviceHaltElaspe.push(_elaspe);
            deviceHaltTimes.push(_time);
            deviceStates.push(_state);
            deviceSerials.push(_device);
            deviceHaltDescription.push(_description);
        }
    });
}

function clearClicked(){
    $('.dateSelector').val('');
    $('.workshopSelector').get(0).selectedIndex=0;
    $('.deviceSelector').get(0).selectedIndex=0;
    // alert('test');
}

function confirmClicked(){
    clearData();

    choosedDate=$('.dateSelector').val();
    choosedDevice=$('.deviceSelector').val().trim();
    choosedWorkshop=$('.workshopSelector').val().trim();
    // alert(choosedDevice);

    $('._canvas').hide(showTime/2);
    $('.tableDiv').hide(showTime/2);
    $('.pieChartCanvas').hide(showTime/2);
    $('.tableButtonDiv').hide(showTime/2);

    getDeviceHaltData();

    if(!queryHaltDataFlag)
    {
        // alert("未查询到相关数据！");
        return;
    }

    drawDataDiagram();
    refreshDataTable(1);
    calcPieChart();
    $('._canvas').show(showTime);
    $('.tableDiv').show(showTime);
    $('.pieChartCanvas').show(showTime);
    $('.tableButtonDiv').show(showTime);
}

function calcPieChart(){
    var data = [{
        "value":"0",
        "state":"stop"
    },{
        "value":"0",
        "state":"pause"
    },{
        "value":"0",
        "state":"offline"
    }];
    var totalElaspe=0;
    for(var i=0;i<deviceStates.length;++i){
        for(var j=0;j<data.length;++j){
            if(deviceStates[i]==data[j].state){
                totalElaspe=parseFloat(deviceHaltElaspe[i])+parseFloat(totalElaspe);
                data[j].value=parseFloat(data[j].value)+parseFloat(deviceHaltElaspe[i]);
                break;
            }
        }
    }
    for(var i=0;i<data.length;++i){
        data[i].value=parseFloat(data[i].value)/totalElaspe;
    }
    var canvas = document.getElementById("pieChartCanvas");
    //获取上下文
    var ctx = canvas.getContext("2d");
    var _coorW=canvas.width;
    var _coorH=canvas.height;
    ctx.clearRect(0,0,_coorW,_coorH);
    //画图
    var x0  =_coorW/2,y0 = _coorH/2+70;//圆心
    var x=700;
    var radius = 150;
    var y=y0-radius*1.5;//文字放置位置
    var tempAngle = -90;//画圆的起始角度
    for(var i = 0;i<data.length;i++){
        // alert('test');
        if(data[i].value==0)
        {
            continue;
        }
        var startAngle = tempAngle*Math.PI/180;//起始弧度
        var angle = data[i].value*360;
        var endAngle = (tempAngle+angle)*Math.PI/180;//结束弧度
        var textAngle = tempAngle + 0.5*angle;//文字放的角度
        // x = x0 + Math.cos(textAngle*Math.PI/180)*(radius+20);//文字放的X轴
        // y = y0 + Math.sin(textAngle*Math.PI/180)*(radius+20);//文字放的Y轴
        //如果文字在圆形的左侧，那么让文字 对齐方式为 文字结尾对齐当前坐标。
        if( textAngle > 90 && textAngle < 270 ){
            ctx.textAlign = 'end';
        }
        ctx.fillStyle = stateColor[data[i].state];
        var text = data[i].state + " "+ (data[i].value*100).toFixed(2)+"%";
        ctx.font='30px Arial';
        // if(data[i].state=='stop'){
        //     // alert(x);
        //     alert(x0);
        // }
        ctx.fillText(text,x,y);
        y=y+50;
        ctx.beginPath();
        ctx.moveTo(x0,y0);
        ctx.arc(x0,y0,radius,startAngle,endAngle);
        ctx.fill();
        tempAngle += angle;
    }
    // ctx.restore();
    var _state='机械停机时间分布';
    var _stateLength=ctx.measureText(_state).width;
    ctx.fillStyle='blue';
    ctx.font='35px Arial';
    ctx.fillText(_state,x0+_stateLength/2,y0-radius*1.9);
}

function initial(){
    initializeSelector();
    getServerCurrTime();
    $('.deviceSelector').append("<option value='     '></option>");
    $('.workshopSelector').append("<option value='     '></option>");
    var initDataUrl='./deviceMonitor.php?action=initData';
    $.get(initDataUrl,function(data){
        var iniData=$.parseJSON(data);
        for(var i=0;i<iniData[0].length;++i)
        {
            $('.deviceSelector').append('<option value='+iniData[0][i]+'>'+iniData[0][i]+'</option>');
        }
        for(var i=0;i<iniData[1].length;++i)
        {
            $('.workshopSelector').append('<option value='+iniData[1][i]+'>'+iniData[1][i]+'</option>');
        }
    })
    confirmClicked();
}

function drawDataDiagram(){
    var stateTime={
        "offline":0,
        "pause":0,
        "stop":0,
    };

    for(var i=0;i<deviceHaltData.length;++i)
    {
        if(deviceHaltData[i]['deviceState']=='check'){
            continue;
        }
        stateTime[deviceHaltData[i]['deviceState']]++;
    }

    var _canvas=document.getElementById("_canvas");
    var _coorW=_canvas.width;
    var _coorH=_canvas.height;
    var ctx=_canvas.getContext("2d");
    ctx.clearRect(0,0,_coorW,_coorH);
    var maxData=0;
    var dataSize=0;
    for(var item in stateTime){
        dataSize++;
        if(maxData<stateTime[item]){
            maxData=stateTime[item];
        }
    }
    if(dataSize<4)
    {
        dataSize=4;
    }
    var _coorX=0;
    var _coorY=_coorH;
    var _rate=(_coorH-50)/maxData;
    var _deviceHaltData=new Array();
    for(var item in stateTime){
        var _d=parseInt(stateTime[item]*_rate);
        _deviceHaltData[item]=_d;
    }
    var gap=parseInt((_coorW-10)/dataSize);
    var _width=gap/2;
    ctx.font="30px Arial";
    var i=0;
    for(var item in stateTime)
    {
        if(stateTime[item]==0)
        {
            continue;
        }
        ctx.fillStyle=stateColor[item];
        ctx.strokeStyle=stateColor[item];
        ctx.fillRect(_coorX+gap*(i+1)-_width,_coorY-_deviceHaltData[item],_width,_deviceHaltData[item]);
        ctx.strokeRect(_coorX+gap*(i+1)-_width,_coorY-_deviceHaltData[item],_width,_deviceHaltData[item]);
        var txtLength=ctx.measureText(stateTime[item]).width;
        ctx.fillStyle='green';
        ctx.strokeStyle='green';
        ctx.fillText(stateTime[item],_coorX+gap*(i+1)-txtLength/2-_width/2,_coorY-_deviceHaltData[item]-10,_width);
        txtLength=ctx.measureText(item).width;
        ctx.fillText(item,_coorX+gap*(i+1)-txtLength/2-_width/2,_coorH-5,_width);
        ++i;
    }
}

function getServerCurrTime(){
    var currTime='';
    var getServerTimeUrl='./deviceMonitor.php?action=getServerTime';
    $.ajaxSetup({
            async: false
        });
    $.post(getServerTimeUrl,function(data){
        currTime=data;
    })
    return currTime;
}


$('.workshopSelector').change(function(){
    var getDeviceUrl='./deviceMonitor.php?action=getWorkshopDevice';
    var deviceSelector=document.getElementById('deviceSelector');
    var _choosedWorkshop=$('.workshopSelector').val().trim();
    for(var i=deviceSelector.childNodes.length-1;i>0;--i){
        deviceSelector.childNodes[i].remove();
    }
    $.ajaxSetup({
        async : false
    });
    $.post(getDeviceUrl,{workshop:_choosedWorkshop},function(data){
        var _devices=$.parseJSON(data);
        for(var i=0;i<_devices.length;++i){
            // alert(_devices[i]);
            // $('#deviceSelector').append("<option value='test'>test</option>");
            $('#deviceSelector').append('<option value='+_devices[i]+'>'+_devices[i]+'</option>');
        }
    });
    confirmClicked();
})


$('.deviceSelector').change(function(){
    confirmClicked();
})

$('.dateSelector').change(function(){
    confirmClicked();
})

function refreshDataTable(pageTitle){
    totalPage=Math.ceil(deviceSerials.length/maxTitlePerPage);
    // alert(deviceSerials.length);
    $('.tableButtonDiv').css('display','block');
    $('#pageTitle').text(pageTitle+'/'+totalPage);
    var dataTable=$('._dataTable');
    var _index=1;
    $('tr:gt(0)').remove();
    for(var i=(pageTitle-1)*maxTitlePerPage;i<deviceSerials.length&&i<pageTitle*maxTitlePerPage;++i){
        // alert(deviceWorkshop[i]);
        var _row='<tr>';
        _row+='<td>'+(_index++).toString()+'</td>';
        _row+='<td>'+deviceWorkshop[i]+'</td>';
        _row+='<td>'+deviceSerials[i]+'</td>';
        _row+='<td>'+deviceStates[i]+'</td>';
        _row+='<td>'+deviceHaltTimes[i]+'</td>';
        _row+='<td>'+deviceHaltElaspe[i]+'</td>';
        _row+='<td>'+deviceHaltDescription[i]+'</td>';
        _row+='</tr>';
        dataTable.append(_row);
    }
}

$('#prevPageButton').click(function(){
    // alert('test prev');
    currPageTitle=$('#pageTitle').text();
    // alert(currPageTitle);
    if(parseInt(currPageTitle)==1){
        return;
    }
    refreshDataTable(parseInt(currPageTitle)-1);
})

$('#nextPageButton').click(function(){
    // alert('test next');
    currPageTitle=$('#pageTitle').text();
    // alert(currPageTitle);
    if(parseInt(currPageTitle)==totalPage){
        return;
    }
    refreshDataTable(parseInt(currPageTitle)+1);
})


function initializeSelector(){
    var _width=$('.dateSelector').width();
    $('.workshopSelector').width(_width);
    $('.deviceSelector').width(_width);
    $('.button').width(_width/2.3);
    var confirmButtonLeft=$('#confirmButton').offset().left;
    var _buttonHeight=$('#confirmButton').offset().top;
    var _left=confirmButtonLeft+_width/2;
    $('#clearButton').offset({top:_buttonHeight,left:_left});
}

