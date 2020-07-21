<?php

$action = $_GET['action'];
switch($action){
    case 'initData':
        initData();
    break;
}

function initData(){
    // echo 'test';
    // exit();
    $sql='select distinct robotSerial from robotMonitorLog';
    $_result=execSql($sql);
    // echo $_result;
    while ($row = $_result->fetch_assoc()){
        $data[] = $row;
    }
    // echo $data;
    echo json_encode($data);
    exit();
}

function execSql($sqls){
    $mysqli = new mysqli('127.0.0.1','root','123456','robot');
    $sqls = func_get_args();//获取函数的所有参数
    foreach ($sqls as $key => $value){
        $query = $mysqli->query($value);
    }
    $mysqli->close();
    return $query;
}
?>