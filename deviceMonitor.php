<?php

$action = $_GET['action'];
switch($action){
    case 'initData':
        initData();
    break;
    case 'getDeviceData':
        getDeviceData();
    break;
    case 'getDeviceStateTimeData':
        getDeviceStateTimeData();
    break;
    case 'getServerTime':
        getServerTime();
    break;
    case 'getWorkshopDevice':
        getWorkshopDevice();
    break;
}

function getServerTime(){
    $sql='select current_timestamp as currTime';
    $result=execSql($sql);
    echo $result->fetch_assoc()['currTime'];
}

function initData(){
    $sql='select distinct deviceSerial from deviceMonitorLog';
    $_result=execSql($sql);
    while ($row = $_result->fetch_assoc()){
        $data[0][] = $row['deviceSerial'];
    }

    $sql='select distinct workshop from deviceMonitorLog';
    $_result=execSql($sql);
    while ($row = $_result->fetch_assoc()){
        $data[1][] = $row['workshop'];
    }
    echo json_encode($data);
    exit();
}

function getDeviceData(){
    $date=$_POST['date'];
    $deviceSerial=$_POST['deviceSerial'];
    $workshop=$_POST['workshop'];
    $sql='select deviceSerial,deviceState,time,workshop,description,elaspe from deviceMonitorLog where elaspe!=-1 and deviceState!=\'check\'';
    if($deviceSerial!=''){
        $sql=$sql.' and deviceSerial=\''.$deviceSerial.'\' ';
    }
    if($workshop!=''){
        $sql=$sql.' and workshop=\''.$workshop.'\' ';
    }
    $sql=$sql.' and time like \''.$date.'%\' order by SN desc';

    $_result=execSql($sql);
    while ($row = $_result->fetch_assoc()){
        $data[] = $row;
    }
    if(sizeof($data)==0){
        echo 0;
    }else{
        echo json_encode($data);
    }
    // echo $_result;
    exit();
}

function getDeviceStateTimeData(){
    $date=$_POST['date'];
    $deviceSerial=$_POST['deviceSerial'];
    $workshop=$_POST['workshop'];

    $sql='select deviceState,count(*) as time from deviceMonitorLog where 0=0 ';
    if($deviceSerial!=''){
        $sql=$sql.' and deviceSerial=\''.$deviceSerial.'\' ';
    }
    if($workshop!=''){
        $sql=$sql.' and workshop=\''.$workshop.'\'';
    }
    $sql=$sql.' and time like \''.$date.'%\' group by deviceState;';

    // echo $sql;
    // exit();
    $_result=execSql($sql);
    while ($row = $_result->fetch_assoc()){
        $data[] = $row;
    }
    // echo $sql;
    if(sizeof($data)==0){
        echo 0;
    }else{
        echo json_encode($data);
    }
    // echo $_result;
    exit();
}

function getWorkshopDevice(){
    $workshop=$_POST['workshop'];
    $sql='select distinct deviceSerial from deviceMonitorLog where 0=0 ';
    if($workshop!=''){
        $sql=$sql.' and workshop=\''.$workshop.'\'';
    }
    $_result=execSql($sql);
    while ($row = $_result->fetch_assoc()){
        $data[] = $row['deviceSerial'];
    }
    echo json_encode($data);
}

function execSql($sql){
    $mysqli = new mysqli('127.0.0.1','lzj','123456','robot');
    $result = $mysqli->query($sql);
    $mysqli->close();
    return $result;
}

?>