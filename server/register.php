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
$password = password_hash($data->password, PASSWORD_DEFAULT);
$firstName = $data->firstName;
$lastName = $data->lastName;
$middleName = $data->middleName;
$contactNo = $data->contactNo;
$role = $data->role;

$sql = "INSERT INTO users (username, password, first_name, last_name, middle_name, contact_no, role) VALUES (?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssssss", $username, $password, $firstName, $lastName, $middleName, $contactNo, $role);

if ($stmt->execute()) {
    echo json_encode(array("message" => "User registered successfully"));
} else {
    echo json_encode(array("message" => "Unable to register user", "error" => $conn->error));
}

$stmt->close();
$conn->close();
?>