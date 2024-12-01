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

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['userId'])) {
        $userId = $_GET['userId'];

        $sql = "SELECT favorites FROM users WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $userId);

        if ($stmt->execute()) {
            $result = $stmt->get_result();
            if ($result->num_rows > 0) {
                $row = $result->fetch_assoc();
                echo json_encode(array("favorites" => $row['favorites']));
            } else {
                echo json_encode(array("favorites" => "[]"));
            }
        } else {
            echo json_encode(array("message" => "Failed to fetch favorites", "error" => $stmt->error));
        }
    } else {
        echo json_encode(array("message" => "User ID is required"));
    }
}

$conn->close();
?>