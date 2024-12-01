<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$conn = new mysqli("localhost", "root", "", "final-project-mal-mailig");
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['userId'])) {
    $userId = $_GET['userId'];

    $sql = "SELECT a.id as animeId, a.title, ur.reviewText, ur.reviewDate
            FROM user_reviews ur
            JOIN anime a ON ur.animeId = a.id
            WHERE ur.userId = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    $reviews = [];
    while ($row = $result->fetch_assoc()) {
        $reviews[] = $row;
    }

    echo json_encode(array("reviews" => $reviews));
} else {
    echo json_encode(array("error" => "Invalid request or missing userId."));
}

$conn->close();
?>