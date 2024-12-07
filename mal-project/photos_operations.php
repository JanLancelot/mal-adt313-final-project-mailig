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
            $sql = "SELECT * FROM photos WHERE anime_id = ?";
            $stmt = $conn->prepare($sql);
            if (!$stmt) {
                http_response_code(500);
                echo json_encode(array("message" => "Prepare failed: " . $conn->error));
                exit;
            }
            $stmt->bind_param("i", $anime_id);
        } else {
            $sql = "SELECT * FROM photos";
            $stmt = $conn->prepare($sql);
            if (!$stmt) {
                http_response_code(500);
                echo json_encode(array("message" => "Prepare failed: " . $conn->error));
                exit;
            }
        }

        if ($stmt->execute()) {
            $result = $stmt->get_result();
            $photos_list = [];
            while ($row = $result->fetch_assoc()) {
                $photos_list[] = $row;
            }
            echo json_encode($photos_list);
        } else {
            http_response_code(500);
            echo json_encode(array("message" => "Failed to fetch photos", "error" => $stmt->error));
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode(array("message" => "Invalid JSON data: " . json_last_error_msg()));
            exit;
        }
        if (!isset($data->anime_id) || !is_numeric($data->anime_id) || !isset($data->data) || empty($data->data)) {
            http_response_code(400);
            echo json_encode(array("message" => "anime_id and data are required."));
            exit;
        }

        $sql = "INSERT INTO photos (anime_id, url) VALUES (?, ?)";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            http_response_code(500);
            echo json_encode(array("message" => "Prepare failed: " . $conn->error));
            exit;
        }

        $stmt->bind_param("is", $data->anime_id, $data->data);

        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(array("message" => "Photo added successfully", "id" => $conn->insert_id));
        } else {
            http_response_code(500);
            echo json_encode(array("message" => "Failed to add photo", "error" => $stmt->error));
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode(array("message" => "Invalid JSON data: " . json_last_error_msg()));
            exit;
        }

        if (!isset($data->id) || !is_numeric($data->id) || !isset($data->anime_id) || !is_numeric($data->anime_id) || !isset($data->url) || empty($data->url)) {
            http_response_code(400);
            echo json_encode(array("message" => "id, anime_id, and url are required for update."));
            exit;
        }

        $sql = "UPDATE photos SET anime_id = ?, url = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            http_response_code(500);
            echo json_encode(array("message" => "Prepare failed: " . $conn->error));
            exit;
        }

        $stmt->bind_param("isi", $data->anime_id, $data->url, $data->id);

        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode(array("message" => "Photo updated successfully"));
        } else {
            http_response_code(500);
            echo json_encode(array("message" => "Failed to update photo", "error" => $stmt->error));
        }
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"));
        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode(array("message" => "Invalid JSON data: " . json_last_error_msg()));
            exit;
        }

        if (!isset($data->anime_id) || !is_numeric($data->anime_id)) {
            http_response_code(400);
            echo json_encode(array("message" => "Valid anime_id is required for deletion"));
            exit;
        }

        $sql = "DELETE FROM photos WHERE anime_id = ?";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            http_response_code(500);
            echo json_encode(array("message" => "Prepare failed: " . $conn->error));
            exit;
        }

        $stmt->bind_param("i", $data->anime_id);

        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode(array("message" => "Photos deleted successfully"));
        } else {
            http_response_code(500);
            echo json_encode(array("message" => "Failed to delete photos", "error" => $stmt->error));
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