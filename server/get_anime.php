<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$conn = new mysqli("localhost", "root", "", "final-project-mal-mailig");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT id, title, score FROM anime ORDER BY score DESC";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $anime_list = array();
    while($row = $result->fetch_assoc()) {
        array_push($anime_list, $row);
    }
    echo json_encode($anime_list);
} else {
    echo json_encode(array("message" => "No anime found"));
}

$conn->close();
?>