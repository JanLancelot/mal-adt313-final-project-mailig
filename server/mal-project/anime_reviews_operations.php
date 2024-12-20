<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$conn = new mysqli("localhost", "root", "", "final-project-mal-mailig");

if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode(array("error" => "Connection failed: " . $conn->connect_error)));
}

require_once 'verify_token.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $decodedToken = verify_token();

    if (!$decodedToken) {
        http_response_code(401);
        echo json_encode(['error' => 'Authentication token is missing or invalid.']);
        exit;
    }
}

switch ($method) {
    case 'GET':
        if (isset($_GET['animeId'])) {
            $animeId = $_GET['animeId'];

            $sql = "SELECT ur.id, ur.reviewText, u.username, ur.reviewDate
                    FROM user_reviews ur
                    JOIN users u ON ur.userId = u.id
                    WHERE ur.animeId = ?";

            $stmt = $conn->prepare($sql);
            if (!$stmt) {
                http_response_code(500);
                echo json_encode(array("error" => "Failed to prepare SQL statement"));
                exit;
            }

            $stmt->bind_param("i", $animeId);

            if (!$stmt->execute()) {
                http_response_code(500);
                echo json_encode(array("error" => "Failed to execute query"));
                exit;
            }

            $result = $stmt->get_result();
            $reviews = [];

            while ($row = $result->fetch_assoc()) {
                $reviews[] = $row;
            }

            http_response_code(200);
            echo json_encode(array("reviews" => $reviews));
        } else {
            http_response_code(400);
            echo json_encode(array("error" => "Missing animeId"));
        }
        break;

    case 'OPTIONS':
        http_response_code(200);
        exit;

    default:
        http_response_code(405);
        echo json_encode(array("message" => "Method not allowed"));
        break;
}

$conn->close();
?>