<?php
header("Content-Type: application/json");
echo json_encode([
    "status" => "OK",
    "message" => "PHP está funcionando",
    "timestamp" => date("Y-m-d H:i:s"),
    "php_version" => phpversion()
]);
?>