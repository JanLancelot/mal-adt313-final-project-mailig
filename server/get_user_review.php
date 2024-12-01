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
    if (isset($_GET['animeId'])) {
        $animeId = $_GET['animeId'];

        $sql = "SELECT ur.reviewText, u.username, ur.reviewDate
                FROM user_reviews ur
                JOIN users u ON ur.userId = u.id
                WHERE ur.animeId = ?";

        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $animeId);
        $stmt->execute();
        $result = $stmt->get_result();

        $reviews = [];
        while ($row = $result->fetch_assoc()) {
            $reviews[] = $row;
        }

        echo json_encode(array("reviews" => $reviews));

    } else {
        echo json_encode(array("error" => "Missing animeId"));
    }
}

$conn->close();
?>