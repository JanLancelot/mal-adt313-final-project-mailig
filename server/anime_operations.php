<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$conn = new mysqli("localhost", "root", "", "final-project-mal-mailig");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if(isset($_GET['id'])) {
            $id = $_GET['id'];
            $sql = "SELECT * FROM anime WHERE id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("i", $id);
        } else {
            $sql = "SELECT * FROM anime ORDER BY score DESC";
            $stmt = $conn->prepare($sql);
        }
        
        if ($stmt->execute()) {
            $result = $stmt->get_result();
            $anime_list = array();
            while ($row = $result->fetch_assoc()) {
                array_push($anime_list, $row);
            }
            echo json_encode($anime_list);
        } else {
            echo json_encode(array("message" => "Failed to fetch anime", "error" => $stmt->error));
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));

        if (!isset($data->title) || !isset($data->tmdb_id) || !isset($data->genres)) {
            echo json_encode(array("message" => "Title, TMDB ID, and genres are required"));
            break;
        }

        $sql = "INSERT INTO anime (tmdb_id, title, score, synopsis, coverPhoto, popularity, releaseDate, genres) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);

        $genres = json_encode($data->genres);
        $stmt->bind_param("isdsssss",
            $data->tmdb_id,
            $data->title,
            $data->score,
            $data->synopsis,
            $data->coverPhoto,
            $data->popularity,
            $data->releaseDate,
            $genres
        );

        if ($stmt->execute()) {
            echo json_encode(array(
                "message" => "Anime added successfully",
                "id" => $conn->insert_id
            ));
        } else {
            echo json_encode(array("message" => "Failed to add anime", "error" => $stmt->error));
        }
        break;

        case 'PUT':
            $data = json_decode(file_get_contents("php://input"));
        
            if (!isset($data->id) || !isset($data->title) || !isset($data->tmdb_id) || !isset($data->genres) || !isset($data->score) || !isset($data->synopsis) || !isset($data->coverPhoto) || !isset($data->popularity) || !isset($data->releaseDate)) {
                echo json_encode(array("message" => "ID, Title, TMDB ID, genres, score, synopsis, cover photo, popularity and release date are required for update"));
                break;
            }
        
            $sql = "UPDATE anime SET tmdb_id = ?, title = ?, score = ?, synopsis = ?, coverPhoto = ?, popularity = ?, releaseDate = ?, genres = ? WHERE id = ?";
            $stmt = $conn->prepare($sql);
        
            if (!$stmt) {
                echo json_encode(array("message" => "Prepare failed: " . $conn->error));
                break;
            }
        
            $genres = json_encode($data->genres);
            $stmt->bind_param("isdsssssi",
                $data->tmdb_id,
                $data->title,
                $data->score,
                $data->synopsis,
                $data->coverPhoto,
                $data->popularity,
                $data->releaseDate,
                $genres,
                $data->id
            );
        
            if ($stmt->execute()) {
                echo json_encode(array("message" => "Anime updated successfully"));
            } else {
                echo json_encode(array("message" => "Failed to update anime", "error" => $stmt->error));
            }
            break;
    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"));

        if (!isset($data->id)) {
            echo json_encode(array("message" => "ID is required for deletion"));
            break;
        }

        $sql = "DELETE FROM anime WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $data->id);

        if ($stmt->execute()) {
            echo json_encode(array("message" => "Anime deleted successfully"));
        } else {
            echo json_encode(array(
                "message" => "Failed to delete anime",
                "error" => $stmt->error
            ));
        }
        break;

    case 'OPTIONS':
        http_response_code(200);
        break;

    default:
        http_response_code(405);
        echo json_encode(array("message" => "Method not allowed"));
        break;
}

$conn->close();
?>