<?php
// Error reporting setup
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Include database connection
require 'db.php'; // Use require to ensure the script stops if db.php is missing.

// Set default headers for CORS and respond to preflight requests
function sendCORSHeaders()
{
  header("Access-Control-Allow-Origin: http://localhost:3000");
  header("Access-Control-Allow-Credentials: true");
  header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
  header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

  if ($_SERVER["REQUEST_METHOD"] == "OPTIONS") {
    exit(0); // No further action needed for pre-flight
  }
}

sendCORSHeaders(); // Send CORS headers

// Main API logic
// Main API logic
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  if (!empty($_POST['action'])) {
    switch ($_POST['action']) {
      case 'register':
        registerUser($conn);
        break;
      case 'login':
        loginUser($conn);
        break;
      default:
        echo json_encode(['error' => 'Invalid action']);
        break;
    }
  } else {
    echo json_encode(['error' => 'No action specified']);
  }
}


function registerUser($conn)
{
  if (!isset($_POST['username']) || !isset($_POST['password'])) {
    echo json_encode(['error' => 'Missing username or password']);
    exit;
  }

  $username = $conn->real_escape_string($_POST['username']);
  $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
  $stmt = $conn->prepare("INSERT INTO User (email, password) VALUES (?, ?)");
  $stmt->bind_param("ss", $username, $password);

  if ($stmt->execute()) {
    echo json_encode(['message' => 'New record created successfully']);
  } else {
    echo json_encode(['error' => "Error: " . $stmt->error]);
  }

  $stmt->close();
}

function loginUser($conn)
{
  if (!isset($_POST['username']) || !isset($_POST['password'])) {
    echo json_encode(['error' => 'Missing username or password']);
    exit;
  }

  $username = $conn->real_escape_string($_POST['username']);
  $password = $_POST['password'];

  $stmt = $conn->prepare("SELECT password FROM User WHERE email = ?");
  $stmt->bind_param("s", $username);
  $stmt->execute();
  $result = $stmt->get_result();

  if ($result->num_rows == 1) {
    $row = $result->fetch_assoc();
    $hashed_password = $row['password'];

    if (password_verify($password, $hashed_password)) {
      echo json_encode(['message' => 'Login successful']);
    } else {
      echo json_encode(['error' => 'Invalid password']);
    }
  } else {
    echo json_encode(['error' => 'User does not exist']);
  }

  $stmt->close();
}

$conn->close();
