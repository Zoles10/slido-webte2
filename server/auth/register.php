<?php
// Error reporting setup
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Include database connection
include 'db.php';

// Set default headers for CORS
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Respond to preflight request
if ($_SERVER["REQUEST_METHOD"] == "OPTIONS") {
    exit(0); // No further action needed for pre-flight
}

// Main logic for handling POST request
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Check if username and password are provided
    if (!isset($_POST['username']) || !isset($_POST['password'])) {
        echo json_encode(['error' => 'Missing username or password']);
        exit;
    }

    // Sanitize and prepare SQL query
    $username = $conn->real_escape_string($_POST['username']);
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    $stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    $stmt->bind_param("ss", $username, $password);

    // Execute query and handle response
    if ($stmt->execute()) {
        echo json_encode(['message' => 'New record created successfully']);
    } else {
        echo json_encode(['error' => "Error: " . $stmt->error]);
    }

    // Close statement and connection
    $stmt->close();
    $conn->close();
}
?>
