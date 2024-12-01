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

    if (isset($data->userId) && isset($data->animeId) && isset($data->reviewText)) {
        $userId = $data->userId;
        $animeId = $data->animeId;
        $reviewText = $data->reviewText;

        $checkSql = "SELECT id FROM user_reviews WHERE userId = ? AND animeId = ?";
        $checkStmt = $conn->prepare($checkSql);
        $checkStmt->bind_param("ii", $userId, $animeId);
        $checkStmt->execute();
        $checkResult = $checkStmt->get_result();

        if ($checkResult->num_rows > 0) {
            $updateSql = "UPDATE user_reviews SET reviewText = ? WHERE userId = ? AND animeId = ?";
            $updateStmt = $conn->prepare($updateSql);
            $updateStmt->bind_param("sii", $reviewText, $userId, $animeId);
            $updateStmt->execute();
        } else {
            $insertSql = "INSERT INTO user_reviews (userId, animeId, reviewText) VALUES (?, ?, ?)";
            $insertStmt = $conn->prepare($insertSql);
            $insertStmt->bind_param("iis", $userId, $animeId, $reviewText);
            $insertStmt->execute();
        }

        echo json_encode(array("success" => true));

    } else {
        echo json_encode(array("error" => "Missing userId, animeId, or reviewText"));
    }
}

$conn->close();
?>