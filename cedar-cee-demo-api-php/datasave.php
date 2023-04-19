<?php

function flex_unique_id($length = 16) {
  if (function_exists("random_bytes")) {
    $bytes = random_bytes(ceil($length / 2));
  } elseif (function_exists("openssl_random_pseudo_bytes")) {
    $bytes = openssl_random_pseudo_bytes(ceil($length / 2));
  } else {
    throw new Exception("no cryptographically secure random function available");
  }
  return substr(bin2hex($bytes), 0, $length);
}

header('Content-Type: application/json; charset=utf-8');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST,PUT");
define("PARAM_ID", "id");
define("PARAM_TITLE", "title");
define("MOCK_FOLDER", "metadata/");

if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
  header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
}

$response = array();
$server_base_url = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]";
$title = 'Untitled';
$record_id = '';

if (isset($_REQUEST[PARAM_TITLE])) {
  $title = $_REQUEST[PARAM_TITLE];
}

if (isset($_REQUEST[PARAM_ID])) {
  $record_id = $_REQUEST[PARAM_ID];
} else {
  $record_id = flex_unique_id();
}

$save_dir = './' . MOCK_FOLDER;
$filename = preg_replace('/[^a-z0-9]+/', '-', strtolower($title)) . '-' . $record_id . '.json';
$file_path = $save_dir . $filename;

if (!is_dir($save_dir)) {
  mkdir($save_dir);
}

$json = file_get_contents('php://input');
// convert to PHP object
$data = json_decode($json);
$save = json_encode($data->metadata, JSON_UNESCAPED_SLASHES|JSON_PRETTY_PRINT);

if (!empty($json) && $json !== 'null') {
  file_put_contents($file_path, $save);
  http_response_code(201);

  $response = array(
    "id" => $record_id,
    "title" => $title,
    "links" => array(
      "self" => $server_base_url . '/' . MOCK_FOLDER . $record_id . '.json'
     )
  );

  echo json_encode($response);
}

?>