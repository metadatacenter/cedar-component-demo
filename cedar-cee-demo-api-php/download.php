<?php 

function remote_file_size($remoteFile) {
  $ch = curl_init($remoteFile);
  curl_setopt($ch, CURLOPT_NOBODY, true);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_HEADER, true);
  curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true); 
  $data = curl_exec($ch);
  curl_close($ch);
  $contentLength = 'unknown';
  
  if ($data !== false) {
    if (preg_match('/Content-Length: (\d+)/', $data, $matches)) {
      $contentLength = (int)$matches[1];
    }
  }
  return $contentLength;
}

function download_file($path) {
	// Erase and close all output buffers
	while (@ob_end_clean());

	// Get the name of the file to be downloaded
	$fileName = basename($path);

	// This is required for IE, otherwise Content-disposition is ignored
	if (ini_get('zlib.output_compression')) {
		ini_set('zlib.output_compression', 'Off');
	}

	$bytes = 'unknown';
	
	if (substr($path, 0, 4) == 'http') {
		$bytes = remote_file_size($path);
	} else {
		$bytes = filesize($path);
	}

	ob_start();
	header('Content-Type: application/json; charset=utf-8');
	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Methods: GET");
	header("Content-Length: $bytes");

	// Open the file and stream download
	$fp = fopen($path, 'rb');
	
	while (!feof($fp)) {
		//reset time limit for big files
		@set_time_limit(0);
		echo fread($fp, 1024*8);
		flush();
		ob_flush();
	}

	fclose($fp);
}

$upload_dir = 'uploads/';
$filename_param_name = "9ff482bacac84c499655ab58efdf590a";

if ($_SERVER['REQUEST_METHOD'] == "GET" && !empty($_GET[$filename_param_name])) {
	$filename = filter_input(INPUT_GET, $filename_param_name, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
	download_file($upload_dir . $filename);
}

?>