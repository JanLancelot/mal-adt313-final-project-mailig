<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$conn = new mysqli("localhost", "root", "", "final-project-mal-mailig");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$data = json_decode(file_get_contents("php://input"));

$username = $data->username;
$password = $data->password;

$sql = "SELECT id, username, password, role FROM users WHERE username = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    if (password_verify($password, $row['password'])) {
        echo json_encode(array(
            "message" => "Login successful",
            "user" => array(
                "id" => $row['id'],
                "username" => $row['username'],
                "role" => $row['role']
            )
        ));
    } else {
        echo json_encode(array("message" => "Invalid username or password"));
    }
} else {
    echo json_encode(array("message" => "Invalid username or password"));
}

$stmt->close();
$conn->close();
?>