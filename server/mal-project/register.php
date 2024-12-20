<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$conn = new mysqli("localhost", "root", "", "final-project-mal-mailig");

if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode(array("message" => "Connection failed: " . $conn->connect_error)));
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode(array("message" => "Invalid JSON data: " . json_last_error_msg()));
            exit;
        }

        $username = $data->username;
        $password = password_hash($data->password, PASSWORD_DEFAULT);
        $firstName = $data->firstName;
        $lastName = $data->lastName;
        $middleName = $data->middleName;
        $contactNo = $data->contactNo;
        $role = $data->role;

        $sql = "INSERT INTO users (username, password, first_name, last_name, middle_name, contact_no, role) VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            http_response_code(500);
            echo json_encode(array("message" => "Prepare failed: " . $conn->error));
            exit;
        }

        $stmt->bind_param("sssssss", $username, $password, $firstName, $lastName, $middleName, $contactNo, $role);

        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(array("message" => "User registered successfully"));
        } else {
            http_response_code(500);
            echo json_encode(array("message" => "Unable to register user", "error" => $conn->error));
        }

        $stmt->close();
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