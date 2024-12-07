<?php

require_once 'JWTCodec.php';

function verify_token() {
    $headers = apache_request_headers();
    $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : null;

    if (!$authHeader) {
        http_response_code(401);
        echo json_encode(array('message' => 'No token provided.'));
        exit;
    }

    if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        http_response_code(401);
        echo json_encode(array('message' => 'Invalid token format.'));
        exit;
    }

    $token = $matches[1];

    try {
        $jwt = new JWTCodec();
        $decoded = $jwt->decode($token);

        $_REQUEST['decoded_token'] = $decoded;

        return $decoded;
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(array('message' => 'Invalid token: ' . $e->getMessage()));
        exit;
    }
}
?>