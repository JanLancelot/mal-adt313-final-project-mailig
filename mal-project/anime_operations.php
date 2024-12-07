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
        if (isset($_GET['id'])) {
            $id = $_GET['id'];
            $sql = "SELECT * FROM anime WHERE id = ?";
            $stmt = $conn->prepare($sql);
            if (!$stmt) {
                http_response_code(500);
                echo json_encode(array("message" => "Prepare failed: " . $conn->error));
                exit;
            }
            $stmt->bind_param("i", $id);
        } else {
            $sql = "SELECT * FROM anime ORDER BY score DESC";
            $stmt = $conn->prepare($sql);
            if (!$stmt) {
                http_response_code(500);
                echo json_encode(array("message" => "Prepare failed: " . $conn->error));
                exit;
            }
        }
        if ($stmt->execute()) {
            $result = $stmt->get_result();
            $anime_list = array();
            while ($row = $result->fetch_assoc()) {
                array_push($anime_list, $row);
            }
            echo json_encode($anime_list);
        } else {
            http_response_code(500);
            echo json_encode(array("message" => "Failed to fetch anime", "error" => $stmt->error));
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode(array("message" => "Invalid JSON data: " . json_last_error_msg()));
            exit;
        }

        $title = $data->title;
        $genres = $data->genres;
        $score = $data->score;
        $synopsis = $data->synopsis;
        $coverPhoto = $data->coverPhoto;
        $popularity = $data->popularity;
        $releaseDate = $data->releaseDate;
        $number_of_episodes = $data->number_of_episodes;
        $number_of_seasons = $data->number_of_seasons;
        $status = $data->status;
        $date_created = $data->date_created;
        $date_updated = $data->date_updated;

        $sql = "INSERT INTO anime (title, score, synopsis, coverPhoto, popularity, releaseDate, genres, number_of_episodes, number_of_seasons, status, date_created, date_updated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            http_response_code(500);
            echo json_encode(array("message" => "Prepare failed: " . $conn->error));
            exit;
        }
        $stmt->bind_param("sdsssssiisss", $title, $score, $synopsis, $coverPhoto, $popularity, $releaseDate, $genres, $number_of_episodes, $number_of_seasons, $status, $date_created, $date_updated);

        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(array("message" => "Anime added successfully", "id" => $conn->insert_id));
        } else {
            http_response_code(500);
            echo json_encode(array("message" => "Failed to add anime", "error" => $stmt->error));
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
            echo json_encode(array("message" => "ID is required for update."));
            exit;
        }

        $sql = "UPDATE anime SET ";
        $params = array();
        $types = "";

        $updatableFields = ['title', 'score', 'synopsis', 'coverPhoto', 'popularity', 'releaseDate', 'genres', 'number_of_episodes', 'number_of_seasons', 'status', 'date_updated'];
        foreach ($updatableFields as $field) {
            if (isset($data->$field)) {
                $sql .= "$field = ?, ";
                $params[] = $data->$field;
                $types .= ($field === 'score' || $field === 'popularity' || $field === 'number_of_episodes' || $field === 'number_of_seasons') ? "d" : "s";
            }
        }

        $sql = rtrim($sql, ", ");

        $sql .= " WHERE id = ?";
        $params[] = $data->id;
        $types .= "i";

        $stmt = $conn->prepare($sql);

        if (!$stmt) {
            http_response_code(500);
            echo json_encode(array("message" => "Prepare failed: " . $conn->error));
            exit;
        }

        $stmt->bind_param($types, ...$params);

        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode(array("message" => "Anime updated successfully"));
        } else {
            http_response_code(500);
            echo json_encode(array("message" => "Failed to update anime: " . $stmt->error));
        }
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"));
        if (!isset($data->id)) {
            http_response_code(400);
            echo json_encode(array("message" => "ID is required for deletion"));
            exit;
        }

        $sql = "DELETE FROM anime WHERE id = ?";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            http_response_code(500);
            echo json_encode(array("message" => "Prepare failed: " . $conn->error));
            exit;
        }
        $stmt->bind_param("i", $data->id);

        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode(array("message" => "Anime deleted successfully"));
        } else {
            http_response_code(500);
            echo json_encode(array("message" => "Failed to delete anime", "error" => $stmt->error));
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