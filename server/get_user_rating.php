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
    if (isset($_GET['userId']) && isset($_GET['animeId'])) {
        $userId = $_GET['userId'];
        $animeId = $_GET['animeId'];

        $sql = "SELECT rating FROM user_ratings WHERE userId = ? AND animeId = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ii", $userId, $animeId);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            echo json_encode(array("rating" => $row['rating']));
        } else {
            echo json_encode(array("rating" => null));
        }
    } else {
        echo json_encode(array("error" => "Missing userId or animeId"));
    }
}

$conn->close();
?>