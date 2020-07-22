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
    $sql='select robotSerial, robotState, time from robotMonitorLog where robotSerial like \''.$robotSerial.'%\' and time like \''.$date.'%\' order by robotSerial;';
    $_result=execSql($sql);
    while ($row = $_result->fetch_assoc()){
        $data[] = $row;
    }
    echo json_encode($data);
    // echo $_result;
    exit();
}

function getRobotStateTimeData(){
    $date=$_POST['date'];
    // echo $date;
    // exit();
    $robotSerial=$_POST['robotSerial'];
    $sql='select robotState,count(*) as time from robotMonitorLog where robotSerial like \''.$robotSerial.'%\' and time like \''.$date.'%\' group by robotState;';
    // echo $sql;
    // exit();
    $_result=execSql($sql);
    while ($row = $_result->fetch_assoc()){
        $data[] = $row;
    }
    // echo $sql;
    echo json_encode($data);
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