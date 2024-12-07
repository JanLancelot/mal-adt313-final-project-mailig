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

    $_REQUEST['decoded_token'] = $decodedToken;
}

switch ($method) {
    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode(array("message" => "Invalid JSON data: " . json_last_error_msg()));
            exit;
        }

        if (isset($data->userId) && isset($data->animeId) && isset($data->action)) {
            $userId = $data->userId;
            $animeId = $data->animeId;
            $action = $data->action;

            $sql = "SELECT favorites FROM users WHERE id = ?";
            $stmt = $conn->prepare($sql);
            if (!$stmt) {
                http_response_code(500);
                echo json_encode(array("message" => "Prepare failed: " . $conn->error));
                exit;
            }
            $stmt->bind_param("i", $userId);

            if (!$stmt->execute()) {
                http_response_code(500);
                echo json_encode(array("message" => "Execute failed: " . $stmt->error));
                exit;
            }

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
                    $favorites = array_values($favorites);
                }

                $favoritesJson = json_encode($favorites);

                $updateSql = "UPDATE users SET favorites = ? WHERE id = ?";
                $updateStmt = $conn->prepare($updateSql);
                if (!$updateStmt) {
                    http_response_code(500);
                    echo json_encode(array("message" => "Prepare failed: " . $conn->error));
                    exit;
                }
                $updateStmt->bind_param("si", $favoritesJson, $userId);

                if ($updateStmt->execute()) {
                    http_response_code(200);
                    echo json_encode(array("success" => true));
                } else {
                    http_response_code(500);
                    echo json_encode(array("success" => false, "message" => "Failed to update favorites: " . $updateStmt->error));
                }
            } else {
                http_response_code(404);
                echo json_encode(array("success" => false, "message" => "User not found"));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("success" => false, "message" => "Missing required parameters"));
        }
        break;

    case 'GET':
        if (isset($_GET['userId'])) {
            $userId = $_GET['userId'];

            $sql = "SELECT favorites FROM users WHERE id = ?";
            $stmt = $conn->prepare($sql);
            if (!$stmt) {
                http_response_code(500);
                echo json_encode(array("message" => "Prepare failed: " . $conn->error));
                exit;
            }
            $stmt->bind_param("i", $userId);

            if (!$stmt->execute()) {
                http_response_code(500);
                echo json_encode(array("message" => "Execute failed: " . $stmt->error));
                exit;
            }

            $result = $stmt->get_result();
            if ($result->num_rows > 0) {
                $row = $result->fetch_assoc();
                http_response_code(200);
                echo json_encode(array("favorites" => json_decode($row['favorites'], true) ?? []));
            } else {
                http_response_code(404);
                echo json_encode(array("favorites" => []));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "User ID is required"));
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