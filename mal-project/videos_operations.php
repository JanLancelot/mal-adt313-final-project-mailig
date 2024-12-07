<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$conn = new mysqli("localhost", "root", "", "final-project-mal-mailig");

if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode(array("message" => "Connection failed: " . $conn->connect_error)));
}

require_once 'verify_token.php';

$method = $_SERVER['REQUEST_METHOD'];
$protectedMethods = ['POST', 'PUT', 'DELETE'];

if (in_array($method, $protectedMethods)) {
    $decodedToken = verify_token();

    if (!$decodedToken) {
        http_response_code(401);
        echo json_encode(['message' => 'Authentication token is missing or invalid.']);
        exit;
    }

    if ($decodedToken['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(['message' => 'Admin access required.']);
        exit;
    }

    $_REQUEST['decoded_token'] = $decodedToken;
}

switch ($method) {
    case 'GET':
        if (isset($_GET['anime_id'])) {
            $anime_id = $_GET['anime_id'];
            $sql = "SELECT * FROM videos WHERE anime_id = ?";
            $stmt = $conn->prepare($sql);
            if (!$stmt) {
                http_response_code(500);
                echo json_encode(array("message" => "Prepare failed: " . $conn->error));
                exit;
            }
            $stmt->bind_param("i", $anime_id);
        } else {
            $sql = "SELECT * FROM videos";
            $stmt = $conn->prepare($sql);
            if (!$stmt) {
                http_response_code(500);
                echo json_encode(array("message" => "Prepare failed: " . $conn->error));
                exit;
            }
        }

        if ($stmt->execute()) {
            $result = $stmt->get_result();
            $videos_list = array();
            while ($row = $result->fetch_assoc()) {
                array_push($videos_list, $row);
            }
            http_response_code(200);
            echo json_encode($videos_list);
        } else {
            http_response_code(500);
            echo json_encode(array("message" => "Failed to fetch videos", "error" => $stmt->error));
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode(array("message" => "Invalid JSON data: " . json_last_error_msg()));
            exit;
        }

        if (!isset($data->data) || !isset($data->anime_id)) {
            http_response_code(400);
            echo json_encode(array("message" => "Invalid data structure"));
            exit;
        }

        $requiredFields = ['name', 'key'];
        foreach ($requiredFields as $field) {
            if (!isset($data->data->$field) || empty($data->data->$field)) {
                http_response_code(400);
                echo json_encode(array("message" => "Missing or empty required field: " . $field));
                exit;
            }
        }

        if (!is_numeric($data->anime_id)) {
            http_response_code(400);
            echo json_encode(array("message" => "anime_id must be numeric"));
            exit;
        }

        $sql = "INSERT INTO videos (anime_id, name, `key`) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            http_response_code(500);
            echo json_encode(array("message" => "Prepare failed: " . $conn->error));
            exit;
        }

        $stmt->bind_param("iss", $data->anime_id, $data->data->name, $data->data->key);

        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(array("message" => "Video added successfully", "id" => $conn->insert_id));
        } else {
            http_response_code(500);
            echo json_encode(array("message" => "Failed to add video", "error" => $stmt->error));
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode(array("message" => "Invalid JSON data: " . json_last_error_msg()));
            exit;
        }

        if (!isset($data->id)) {
            http_response_code(400);
            echo json_encode(array("message" => "ID is required for update"));
            exit;
        }

        $sql = "UPDATE videos SET anime_id = ?, name = ?, `key` = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            http_response_code(500);
            echo json_encode(array("message" => "Prepare failed: " . $conn->error));
            exit;
        }
        $stmt->bind_param("issi", $data->anime_id, $data->name, $data->key, $data->id);

        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode(array("message" => "Video updated successfully"));
        } else {
            http_response_code(500);
            echo json_encode(array("message" => "Failed to update video", "error" => $stmt->error));
        }
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"));
        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode(array("message" => "Invalid JSON data: " . json_last_error_msg()));
            exit;
        }

        if (!isset($data->anime_id)) {
            http_response_code(400);
            echo json_encode(array("message" => "anime_id is required for deletion"));
            exit;
        }

        $sql = "DELETE FROM videos WHERE anime_id = ?";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            http_response_code(500);
            echo json_encode(array("message" => "Prepare failed: " . $conn->error));
            exit;
        }
        $stmt->bind_param("i", $data->anime_id);

        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode(array("message" => "Videos deleted successfully"));
        } else {
            http_response_code(500);
            echo json_encode(array("message" => "Failed to delete videos", "error" => $stmt->error));
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