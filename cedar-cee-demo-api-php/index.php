<?php

function exit_with_object($err)
{
    print(json_encode($err));
    exit;
}

function read_api_key()
{
    $api_key = null;
    $key = 'CEDAR_CEE_PROXY_API_KEY';
    if (isset($_SERVER[$key])) {
        $api_key = $_SERVER[$key];
    }
    if ($api_key == null || $api_key == '') {
        header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
        exit_with_object(['errorMessage' => 'apiKey not found']);
    }
    return $api_key;
}

header('Content-Type: application/json; charset=utf-8');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

// Set this URL to your terminology server endpoint
$url = 'https://terminology.metadatacenter.org/bioportal/integrated-search';
// This script uses the CEDAR_CEE_PROXY_API_KEY value passed in from nginx
// If you want to use another API key, set it here directly
$apiKey = read_api_key();

$method = $_SERVER['REQUEST_METHOD'];

// CORS headers are handled by the webserver, return empty body
if ($method == 'OPTIONS') {
    exit;
}

// Only POST is supported
if ($method != 'POST') {
    header($_SERVER['SERVER_PROTOCOL'] . ' 405 Method Not Allowed', true, 405);
    exit_with_object(['errorMessage' => 'Only the POST method is supported']);
}

// Use cURL to proxy the request
$ch = curl_init($url);

// Read the original request body
$data_str = file_get_contents('php://input');

// Original request headers are ignored
$headers = [
    'Content-Type: application/json',
    "Authorization: apiKey $apiKey"
];
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

// Do not do a application/x-www-form-urlencoded POST
curl_setopt($ch, CURLOPT_POST, false);
// Re-post the original body
curl_setopt($ch, CURLOPT_POSTFIELDS, $data_str);
// Replicate original method
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
// Return result into a string
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
// Do not verify SSL certificates - leave original values in production
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
// Debug request headers
curl_setopt($ch, CURLINFO_HEADER_OUT, true);


$output = curl_exec($ch);
curl_close($ch);

$error_code = curl_errno($ch);
if ($error_code != 0) {
    $err =  [
        'errorCode' => $error_code,
        'errorMessage' => curl_error($ch),
        'errorInfo' => curl_getinfo($ch)
    ];
    exit_with_object($err);
} else {
    print($output);
}
