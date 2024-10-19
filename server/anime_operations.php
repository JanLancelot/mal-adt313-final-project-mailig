<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$conn = new mysqli("localhost", "root", "", "final-project-mal-mailig");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        $sql = "SELECT id, title, score FROM anime ORDER BY score DESC";
        $result = $conn->query($sql);
        $anime_list = array();
        while($row = $result->fetch_assoc()) {
            array_push($anime_list, $row);
        }
        echo json_encode($anime_list);
        break;
    
    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        $title = $data->title;
        $score = $data->score;
        
        $sql = "INSERT INTO anime (title, score) VALUES (?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sd", $title, $score);
        
        if($stmt->execute()) {
            echo json_encode(array("message" => "Anime added successfully", "id" => $conn->insert_id));
        } else {
            echo json_encode(array("message" => "Failed to add anime"));
        }
        break;
    
    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        $id = $data->id;
        $title = $data->title;
        $score = $data->score;
        
        $sql = "UPDATE anime SET title = ?, score = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sdi", $title, $score, $id);
        
        if($stmt->execute()) {
            echo json_encode(array("message" => "Anime updated successfully"));
        } else {
            echo json_encode(array("message" => "Failed to update anime"));
        }
        break;
    
    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"));
        $id = $data->id;
        
        $sql = "DELETE FROM anime WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        
        if($stmt->execute()) {
            echo json_encode(array("message" => "Anime deleted successfully"));
        } else {
            echo json_encode(array("message" => "Failed to delete anime"));
        }
        break;
}

$conn->close();
?>