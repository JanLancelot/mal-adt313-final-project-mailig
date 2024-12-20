<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$conn = new mysqli("localhost", "root", "", "final-project-mal-mailig");

if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode(array("error" => "Database connection failed")));
}

require_once 'verify_token.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST' || $method === 'DELETE') {
    $decodedToken = verify_token();

    if (!$decodedToken) {
        http_response_code(401);
        echo json_encode(['error' => 'Authentication token is missing or invalid.']);
        exit;
    }

    $_REQUEST['decoded_token'] = $decodedToken;
}

switch ($method) {
    case 'GET':
        if (isset($_GET['userId'])) {
            $userId = $_GET['userId'];

            $sql = "SELECT ur.id AS reviewId, ur.reviewText, u.username, ur.reviewDate, ur.animeId
                    FROM user_reviews ur
                    JOIN users u ON ur.userId = u.id
                    WHERE ur.userId = ?
                    ORDER BY ur.reviewDate DESC";

            $stmt = $conn->prepare($sql);
            if (!$stmt) {
                http_response_code(500);
                echo json_encode(array("error" => "Failed to prepare SQL statement"));
                exit;
            }

            $stmt->bind_param("i", $userId);

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
            echo json_encode(array("error" => "Missing userId"));
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode(array("message" => "Invalid JSON data: " . json_last_error_msg()));
            exit;
        }

        if (isset($data->userId) && isset($data->animeId) && isset($data->reviewText)) {
            $userId = $data->userId;
            $animeId = $data->animeId;
            $reviewText = $data->reviewText;

            if (empty(trim($reviewText))) {
                http_response_code(400);
                echo json_encode(array("error" => "Review text cannot be empty"));
                exit;
            }

            $reviewDate = date("Y-m-d H:i:s");

            $checkSql = "SELECT id FROM user_reviews WHERE userId = ? AND animeId = ?";
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
                $updateSql = "UPDATE user_reviews SET reviewText = ?, reviewDate = ? WHERE userId = ? AND animeId = ?";
                $updateStmt = $conn->prepare($updateSql);
                if (!$updateStmt) {
                    http_response_code(500);
                    echo json_encode(array("message" => "Prepare failed: " . $conn->error));
                    exit;
                }
                $updateStmt->bind_param("ssii", $reviewText, $reviewDate, $userId, $animeId);
            } else {
                $insertSql = "INSERT INTO user_reviews (userId, animeId, reviewText, reviewDate) VALUES (?, ?, ?, ?)";
                $insertStmt = $conn->prepare($insertSql);
                if (!$insertStmt) {
                    http_response_code(500);
                    echo json_encode(array("message" => "Prepare failed: " . $conn->error));
                    exit;
                }
                $insertStmt->bind_param("iiss", $userId, $animeId, $reviewText, $reviewDate);
            }

            if ($checkResult->num_rows > 0 && isset($updateStmt) && $updateStmt->execute()) {
                http_response_code(200);
                echo json_encode(array("success" => true, "message" => "Review updated successfully"));
            } else if ($checkResult->num_rows == 0 && isset($insertStmt) && $insertStmt->execute()) {
                http_response_code(201);
                echo json_encode(array("success" => true, "message" => "Review added successfully"));
            } else {
                http_response_code(500);
                echo json_encode(array("error" => "Failed to save review"));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("error" => "Missing userId, animeId, or reviewText"));
        }
        break;

    case 'DELETE':
        if (isset($_GET['reviewId'])) {
            $reviewId = $_GET['reviewId'];

            $sql = "DELETE FROM user_reviews WHERE id = ?";
            $stmt = $conn->prepare($sql);
            if (!$stmt) {
                http_response_code(500);
                echo json_encode(array("error" => "Failed to prepare SQL statement"));
                exit;
            }

            $stmt->bind_param("i", $reviewId);

            if ($stmt->execute()) {
                http_response_code(200);
                echo json_encode(array("message" => "Review deleted successfully"));
            } else {
                http_response_code(500);
                echo json_encode(array("error" => "Failed to delete review"));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("error" => "Missing reviewId"));
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