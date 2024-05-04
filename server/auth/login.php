<?php
// Error reporting setup
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Include database connection
include 'db.php';

// Set default headers for CORS
function sendCORSHeaders() {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
}

sendCORSHeaders(); // Send CORS headers for all incoming requests

// Main logic for handling POST request
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Check if username and password are provided
    if (!isset($_POST['username']) || !isset($_POST['password'])) {
        echo json_encode(['error' => 'Missing username or password']);
        exit;
    }

    // Sanitize input
    $username = $conn->real_escape_string($_POST['username']);
    $password = $_POST['password']; // password is not escaped because it is hashed

    // Prepare SQL query to fetch user data
    $stmt = $conn->prepare("SELECT password FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 1) {
        // Fetch hashed password from database
        $row = $result->fetch_assoc();
        $hashed_password = $row['password'];

        // Verify the password
        if (password_verify($password, $hashed_password)) {
            echo json_encode(['message' => 'Login successful']);
        } else {
            echo json_encode(['error' => 'Invalid password']);
        }
    } else {
        echo json_encode(['error' => 'User does not exist']);
    }

    // Close statement and connection
    $stmt->close();
    $conn->close();
}
?>
