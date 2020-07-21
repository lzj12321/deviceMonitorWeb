<?php

$action = $_GET['action'];
switch($action){
    case 'initData':
        initData();
    break;
    case 'getRobotData':
        getRobotData();
    break;
}

function initData(){
    // echo 'test';
    // exit();
    $sql='select distinct robotSerial from robotMonitorLog';
    $_result=execSql($sql);
    // echo $_result;
    while ($row = $_result->fetch_assoc()){
        $data[] = $row['robotSerial'];
    }
    echo json_encode($data);
    exit();
}

function getRobotData(){
    $date=$_POST['date'];
    $robotSerial=$_POST['robotSerial'];
    $sql='select robotState,time from robotMonitorLog where robotSerial=\''.$robotSerial.'\' and time like \''.$date.'%\';';
    $_result=execSql($sql);
    while ($row = $_result->fetch_assoc()){
        $data[] = $row;
    }
    echo json_encode($data);
    // echo $_result;
    exit();
}

function execSql($sql){
    $mysqli = new mysqli('127.0.0.1','lzj','123456','robot');
    $result = $mysqli->query($sql);
    $mysqli->close();
    return $result;
}
?>