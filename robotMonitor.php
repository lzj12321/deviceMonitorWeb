<?php

$action = $_GET['action'];
switch($action){
    case 'initData':
        initData();
    break;
    case 'getRobotData':
        getRobotData();
    break;
    case 'getRobotStateTimeData':
        getRobotStateTimeData();
    break;
    case 'getServerTime':
        getServerTime();
    break;
}

function getServerTime(){
    $sql='select current_timestamp as currTime';
    $result=execSql($sql);
    echo $result->fetch_assoc()['currTime'];
}

function initData(){
    $sql='select distinct deviceSerial from robotMonitorLog';
    $_result=execSql($sql);
    while ($row = $_result->fetch_assoc()){
        $data[0][] = $row['deviceSerial'];
    }

    $sql='select distinct workshop from robotMonitorLog';
    $_result=execSql($sql);
    while ($row = $_result->fetch_assoc()){
        $data[1][] = $row['workshop'];
    }
    echo json_encode($data);
    exit();
}

function getRobotData(){
    $date=$_POST['date'];
    $deviceSerial=$_POST['deviceSerial'];
    $workshop=$_POST['workshop'];
    $sql='select deviceSerial,robotState,time,workshop from robotMonitorLog where 0=0 ';
    if($deviceSerial!=''){
        $sql=$sql.' and deviceSerial=\''.$deviceSerial.'\' ';
    }
    if($workshop!=''){
        $sql=$sql.' and workshop=\''.$workshop.'\' ';
    }
    $sql=$sql.' and time like \''.$date.'%\' order by deviceSerial,SN asc';
    // echo $sql;
    // exit();

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

function getRobotStateTimeData(){
    $date=$_POST['date'];
    $robotSerial=$_POST['deviceSerial'];
    $workshop=$_POST['workshop'];

    $sql='select robotState,count(*) as time from robotMonitorLog where 0=0 ';
    if($robotSerial!=''){
        $sql=$sql.' and deviceSerial=\''.$deviceSerial.'\' ';
    }
    if($workshop!=''){
        $sql=$sql.' and workshop=\''.$workshop.'\'';
    }
    $sql=$sql.' and time like \''.$date.'%\' group by robotState;';

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

function execSql($sql){
    $mysqli = new mysqli('127.0.0.1','root','123456','robot');
    $result = $mysqli->query($sql);
    $mysqli->close();
    return $result;
}

?>