document.write("<script language=javascript src='./canvasDraw.js'></script>");


function confirmClicked(){
    setInterval(() => {
        
    }, 200);
    $('._canvas').css('display','block');
    $('.tableDiv').css('display','block');
    var _date=$('.dateSelector').val();
    var _robotSerial=$('.robotSelector').val().trim();
    var getDataUrl='./robotMonitor.php?action=getRobotData';
    var getStateTimeDataUrl='./robotMonitor.php?action=getRobotStateTimeData';
    var _device=new Array();
    var _states=new Array();
    var _times=new Array();
    var __stateElaspe=new Array();
    $.ajaxSetup({
            async : false  
        });
    $.post(getDataUrl,{date:_date,robotSerial:_robotSerial},function(data){
        var _data=$.parseJSON(data);
        for(var i=0;i<_data.length;++i){
            var device=_data[i]['robotSerial'];
            var __time=_data[i]['time'];
            var __state=_data[i]['robotState'];
            _times.push(__time);
            _states.push(__state);
            _device.push(device);
            if(i!=_data.length-1&&device==_data[i+1]['robotSerial']){
                var startDateTime=new Date(__time);
                var stopDateTime=new Date(_data[i+1]['time']);
                var _elaspe=stopDateTime-startDateTime;
                __stateElaspe.push((_elaspe/60000).toFixed(2));
            }
            else{
                __stateElaspe.push('......');
            }
        }
    });

    var __states=new Array();
    var __stateTime=new Array();
    $.post(getStateTimeDataUrl,{date:_date,robotSerial:_robotSerial},function(result){
        var _data=$.parseJSON(result);
        for(var i=0;i<_data.length;++i){
            var __time=_data[i]['time'];
            var __state=_data[i]['robotState'];
            __states.push(__state);
            __stateTime.push(parseInt(__time));
        }
    });
    drawDataDiagram(__stateTime,__states);
    refreshDataTable(_states,_times,__stateElaspe,_device);
}

function initial(){
    var initDataUrl='./robotMonitor.php?action=initData';
    $.get(initDataUrl,function(data){
        var _robotSerials=$.parseJSON(data);
        $('.robotSelector').append("<option value='     '></option>");
        for(var i=0;i<_robotSerials.length;++i)
        {
            $('.robotSelector').append('<option value='+_robotSerials[i]+'>'+_robotSerials[i]+'</option>');
        }
    })

    // confirmClicked();
}

function refreshDataTable(states,time,elaspeTime,device){
    var dataTable=$('._dataTable');
    $('tr:gt(0)').remove();
    for(var i=0;i<states.length;++i){
        var _row='<tr>';
        _row+='<td>'+(i+1).toString()+'</td>';
        _row+='<td>'+device[i]+'</td>';
        _row+='<td>'+states[i]+'</td>';
        _row+='<td>'+time[i]+'</td>';
        _row+='<td>'+elaspeTime[i]+'</td>';
        _row+='</tr>';
        dataTable.append(_row);
    }
}


