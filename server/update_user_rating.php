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

    if (isset($data->userId) && isset($data->animeId) && isset($data->rating)) {
        $userId = $data->userId;
        $animeId = $data->animeId;
        $rating = $data->rating;

        $checkSql = "SELECT id FROM user_ratings WHERE userId = ? AND animeId = ?";
        $checkStmt = $conn->prepare($checkSql);
        $checkStmt->bind_param("ii", $userId, $animeId);
        $checkStmt->execute();
        $checkResult = $checkStmt->get_result();

        if ($checkResult->num_rows > 0) {
            $updateSql = "UPDATE user_ratings SET rating = ? WHERE userId = ? AND animeId = ?";
            $updateStmt = $conn->prepare($updateSql);
            $updateStmt->bind_param("iii", $rating, $userId, $animeId);
            $updateStmt->execute();
        } else {
            $insertSql = "INSERT INTO user_ratings (userId, animeId, rating) VALUES (?, ?, ?)";
            $insertStmt = $conn->prepare($insertSql);
            $insertStmt->bind_param("iii", $userId, $animeId, $rating);
            $insertStmt->execute();
        }

        echo json_encode(array("success" => true));
    } else {
        echo json_encode(array("error" => "Missing userId, animeId, or rating"));
    }
}

$conn->close();
?>