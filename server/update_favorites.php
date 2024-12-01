<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$conn = new mysqli("localhost", "root", "", "final-project-mal-mailig");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));

    if (isset($data->userId) && isset($data->animeId) && isset($data->action)) {
        $userId = $data->userId;
        $animeId = $data->animeId;
        $action = $data->action;

        $sql = "SELECT favorites FROM users WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $favorites = json_decode($row['favorites'], true) ?? [];

            if ($action === 'add') {
                if (!in_array($animeId, $favorites)) {
                    $favorites[] = $animeId;
                }
            } else if ($action === 'remove') {
                $favorites = array_diff($favorites, [$animeId]);
            }

            $favoritesJson = json_encode($favorites);

            $updateSql = "UPDATE users SET favorites = ? WHERE id = ?";
            $updateStmt = $conn->prepare($updateSql);
            $updateStmt->bind_param("si", $favoritesJson, $userId);

            if ($updateStmt->execute()) {
                echo json_encode(array("success" => true));
            } else {
                echo json_encode(array("success" => false, "message" => "Failed to update favorites"));
            }
        } else {
            echo json_encode(array("success" => false, "message" => "User not found"));
        }
    } else {
        echo json_encode(array("success" => false, "message" => "Missing required parameters"));
    }
}

$conn->close();
?>