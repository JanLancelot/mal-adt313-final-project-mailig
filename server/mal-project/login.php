<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once 'JWTCodec.php';

$conn = new mysqli("localhost", "root", "", "final-project-mal-mailig");

if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode(array("message" => "Connection failed: " . $conn->connect_error)));
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'OPTIONS':
        http_response_code(200);
        exit;
    case 'POST':
        $data = json_decode(file_get_contents("php://input"));

        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode(array("message" => "Invalid JSON data: " . json_last_error_msg()));
            exit;
        }

        $username = $data->username;
        $password = $data->password;

        $sql = "SELECT id, username, password, role FROM users WHERE username = ?";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            http_response_code(500);
            echo json_encode(array("message" => "Prepare failed: " . $conn->error));
            exit;
        }
        $stmt->bind_param("s", $username);

        if (!$stmt->execute()) {
            http_response_code(500);
            echo json_encode(array("message" => "Execute failed: " . $stmt->error));
            exit;
        }

        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            if (password_verify($password, $row['password'])) {
                $payload = [
                    "user_id" => $row['id'],
                    "username" => $row['username'],
                    "role" => $row['role'],
                ];

                $jwt = new JWTCodec();
                $token = $jwt->encode($payload);

                // Decoding for testing purposes
                $decoded = $jwt->decode($token);

                http_response_code(200);
                echo json_encode(array(
                    "message" => "Login successful",
                    "user" => array(
                        "id" => $row['id'],
                        "username" => $row['username'],
                        "role" => $row['role']
                    ),
                    "token" => $token,
                    "decoded_token" => $decoded
                ));
            } else {
                http_response_code(401);
                echo json_encode(array("message" => "Invalid username or password"));
            }
        } else {
            http_response_code(401);
            echo json_encode(array("message" => "Invalid username or password"));
        }

        $stmt->close();
        break;

    default:
        http_response_code(405);
        echo json_encode(array("message" => "Method not allowed: " . $method));
        break;
}

$conn->close();
?>