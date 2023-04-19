<?php

header('Content-Type: application/json; charset=utf-8');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

$response = array();
$upload_dir = 'uploads/';
$file_param_name = '3520cf061bba4919a8ea4b74a07af01b';
$phpFileUploadErrors = array(
  0 => 'There is no error, the file uploaded with success',
  1 => 'The uploaded file exceeds the upload_max_filesize directive in php.ini',
  2 => 'The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form',
  3 => 'The uploaded file was only partially uploaded',
  4 => 'No file was uploaded',
  6 => 'Missing a temporary folder',
  7 => 'Failed to write file to disk.',
  8 => 'A PHP extension stopped the file upload.'
);
$error_response = array(
  "status" => 500,
  "title" => "Internal Server Error",
  "message" => ""
);

$server_base_url = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]";

if ($_FILES[$file_param_name]) {
  $orig_filename = $_FILES[$file_param_name]["name"];
  $tmp_filename = $_FILES[$file_param_name]["tmp_name"];
  $error = $_FILES[$file_param_name]["error"];

  if ($error > 0) {
    http_response_code(500);
    $response = $error_response;
    $response["message"] = $phpFileUploadErrors[$error];
  } else {
    $random_name = strtolower(rand(1000, 1000000) . '-' . $orig_filename);
    $random_name = preg_replace('/\s+/', '-', $random_name);
    $upload_dir = preg_replace('/\s+/', '-', $upload_dir);
    $upload_name = $upload_dir . $random_name;

    if (move_uploaded_file($tmp_filename, $upload_name)) {
      http_response_code(201);
      $response = array(
        "filename" => $random_name,
        "links" => array(
          "self" => $server_base_url . '/' . $upload_name
        )
      );
    } else {
      http_response_code(500);
      $error = $_FILES[$file_param_name]["error"];
      $response = $error_response;
      $response["message"] = $phpFileUploadErrors[$error];
    }
  }
} else {
  // CORS requests
  http_response_code(204);
  $response = array(
    "status" => 204,
    "title" => "No Content",
    "message" => "No file was sent to the server"
  );
}

echo json_encode($response);

?>