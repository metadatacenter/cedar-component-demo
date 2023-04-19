<?php

header('Content-Type: application/json; charset=utf-8');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
  header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
}

// $filename = strtolower('uploads/metadata-' . date('Y-m-d--H-i-s') . '.json');
// $filename = strtolower('uploads/metadata-' . date('Y-m-d') . '.json');
$filename = strtolower('/Users/mdorf/dev/cedar/cedar-cee-demo-generic/uploads/metadata-save.json');
$json = file_get_contents('php://input');
file_put_contents($filename, $json);

echo $json;

?>