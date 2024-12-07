<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); 
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$conn = new mysqli("localhost", "root", "", "final-project-mal-mailig");

if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode(array("error" => "Connection failed: " . $conn->connect_error)));
}

require_once 'verify_token.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST' || $method === 'GET') {
    $decodedToken = verify_token();

    if (!$decodedToken) {
        http_response_code(401);
        echo json_encode(['error' => 'Authentication token is missing or invalid.']);
        exit;
    }
}

switch ($method) {
    case 'GET':
        if (isset($_GET['userId']) && isset($_GET['animeId'])) {
            $userId = $_GET['userId'];
            $animeId = $_GET['animeId'];

            $sql = "SELECT rating FROM user_ratings WHERE userId = ? AND animeId = ?";
            $stmt = $conn->prepare($sql);
            if (!$stmt) {
                http_response_code(500);
                echo json_encode(array("message" => "Prepare failed: " . $conn->error));
                exit;
            }
            $stmt->bind_param("ii", $userId, $animeId);

            if (!$stmt->execute()) {
                http_response_code(500);
                echo json_encode(array("message" => "Execute failed: " . $stmt->error));
                exit;
            }

            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                $row = $result->fetch_assoc();
                http_response_code(200);
                echo json_encode(array("rating" => $row['rating']));
            } else {
                http_response_code(200);
                echo json_encode(array("rating" => null));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("error" => "Missing userId or animeId"));
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode(array("message" => "Invalid JSON data: " . json_last_error_msg()));
            exit;
        }

        if (isset($data->userId) && isset($data->animeId) && isset($data->rating)) {
            $userId = $data->userId;
            $animeId = $data->animeId;
            $rating = $data->rating;

            if (!is_numeric($rating) || $rating < 1 || $rating > 10) {
                http_response_code(400);
                echo json_encode(array("error" => "Invalid rating value. Rating must be between 1 and 10."));
                exit;
            }

            $checkSql = "SELECT id FROM user_ratings WHERE userId = ? AND animeId = ?";
            $checkStmt = $conn->prepare($checkSql);
            if (!$checkStmt) {
                http_response_code(500);
                echo json_encode(array("message" => "Prepare failed: " . $conn->error));
                exit;
            }
            $checkStmt->bind_param("ii", $userId, $animeId);

            if (!$checkStmt->execute()) {
                http_response_code(500);
                echo json_encode(array("message" => "Execute failed: " . $checkStmt->error));
                exit;
            }

            $checkResult = $checkStmt->get_result();

            if ($checkResult->num_rows > 0) {
                $updateSql = "UPDATE user_ratings SET rating = ? WHERE userId = ? AND animeId = ?";
                $updateStmt = $conn->prepare($updateSql);
                if (!$updateStmt) {
                    http_response_code(500);
                    echo json_encode(array("message" => "Prepare failed: " . $conn->error));
                    exit;
                }
                $updateStmt->bind_param("iii", $rating, $userId, $animeId);
            } else {
                $insertSql = "INSERT INTO user_ratings (userId, animeId, rating) VALUES (?, ?, ?)";
                $insertStmt = $conn->prepare($insertSql);
                if (!$insertStmt) {
                    http_response_code(500);
                    echo json_encode(array("message" => "Prepare failed: " . $conn->error));
                    exit;
                }
                $insertStmt->bind_param("iii", $userId, $animeId, $rating);
            }

            if ($checkResult->num_rows > 0 && isset($updateStmt) && $updateStmt->execute()) {
                http_response_code(200);
                echo json_encode(array("success" => true, "message" => "Rating updated successfully"));
            } else if ($checkResult->num_rows == 0 && isset($insertStmt) && $insertStmt->execute()) {
                http_response_code(201);
                echo json_encode(array("success" => true, "message" => "Rating added successfully"));
            } else {
                http_response_code(500);
                echo json_encode(array("error" => "Failed to save rating"));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("error" => "Missing userId, animeId, or rating"));
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