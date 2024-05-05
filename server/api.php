<?php
// Error reporting setup
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once './vendor/autoload.php';
require 'db.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;


function sendCORSHeaders()
{
  header("Access-Control-Allow-Origin: http://localhost:3000");
  header("Access-Control-Allow-Credentials: true");
  header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
  header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

  if ($_SERVER["REQUEST_METHOD"] == "OPTIONS") {
    exit(0);
  }
}

sendCORSHeaders();

$requestPath = trim(parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH), '/');
$pathParts = explode('/', $requestPath);

if (count($pathParts) < 4) {
  echo json_encode(['error' => 'No action specified']);
  exit;
}

$apiPrefix = $pathParts[2];
$action = $pathParts[3];

if ($apiPrefix !== 'api') {
  http_response_code(404);
  echo json_encode(['error' => 'Invalid API endpoint', 'path' => $requestPath, 'parts' => $pathParts]);
  exit;
}

switch ($_SERVER["REQUEST_METHOD"]) {
  case 'POST':
    handlePostActions($action, $conn);
    break;
  case 'GET':
    handleGetActions($action, $conn);
    break;
  default:
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    break;
}

function handlePostActions($action, $conn)
{
  switch ($action) {
    case 'register':
      registerUser($conn);
      break;
    case 'login':
      loginUser($conn);
      break;
    case 'refresh':
      refreshToken($conn);
      break;
    case 'question':
      postQuestion($conn);
      break;
    default:
      echo json_encode(['error' => 'Invalid action']);
      break;
  }
}

function handleGetActions($action, $conn)
{
  switch ($action) {
    case 'question':
      getQuestions($conn);
      break;
    default:
      echo json_encode(['error' => 'Invalid action']);
      break;
  }
}


function registerUser($conn)
{
  if (!isset($_POST['username']) || !isset($_POST['password'])) {
    echo json_encode(['error' => 'Missing username or password']);
    exit;
  }

  $email = $conn->real_escape_string($_POST['username']);
  $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
  $stmt = $conn->prepare("INSERT INTO User (email, password) VALUES (?, ?)");
  $stmt->bind_param("ss", $email, $password);

  if ($stmt->execute()) {
    echo json_encode(['message' => 'New record created successfully']);
  } else {
    echo json_encode(['error' => "Error: " . $stmt->error]);
  }

  $stmt->close();
}

function issueRefreshToken($conn, $userId)
{
  $expiresAt = date('Y-m-d H:i:s', strtotime('+7 days'));
  $refreshToken = bin2hex(random_bytes(64));

  $stmt = $conn->prepare("INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)");
  $stmt->bind_param('iss', $userId, $refreshToken, $expiresAt);
  if (!$stmt->execute()) {
    echo json_encode(['error' => "Error: " . $stmt->error]);
    $stmt->close();
    return null;
  }
  $stmt->close();

  return $refreshToken;
}


function issueJwt($email)
{
  $issuedAt = time();
  $expirationTime = $issuedAt + 3600;
  $payload = [
    'iat' => $issuedAt,
    'exp' => $expirationTime,
    'email' => $email
  ];

  $config = require 'config.php';
  $jwtSecretKey = $config['jwt_secret'];

  return JWT::encode($payload, $jwtSecretKey, 'HS256');
}

function loginUser($conn)
{
  if (!isset($_POST['username']) || !isset($_POST['password'])) {
    echo json_encode(['error' => 'Missing email or password']);
    exit;
  }

  $email = $conn->real_escape_string($_POST['username']);
  $password = $_POST['password'];

  $stmt = $conn->prepare("SELECT userID, password FROM User WHERE email = ?");
  $stmt->bind_param("s", $email);
  $stmt->execute();
  $result = $stmt->get_result();

  if ($result->num_rows == 1) {
    $row = $result->fetch_assoc();
    $hashed_password = $row['password'];
    $userId = $row['userID'];

    if (password_verify($password, $hashed_password)) {
      $jwt = issueJwt($email);
      $refreshToken = issueRefreshToken($conn, $userId);
      echo json_encode(['message' => 'Login successful', 'jwt' => $jwt, 'refreshToken' => $refreshToken]);
    } else {
      echo json_encode(['error' => 'Invalid password']);
    }
  } else {
    echo json_encode(['error' => 'User does not exist']);
  }

  $stmt->close();
}

function getEmailFromUserId($conn, $userId)
{
  $stmt = $conn->prepare("SELECT email FROM User WHERE userID = ?");
  $stmt->bind_param('i', $userId);
  $stmt->execute();
  $result = $stmt->get_result();
  if ($row = $result->fetch_assoc()) {
    return $row['email'];
  } else {
    return null; // or handle the error as you see fit
  }
}

function getUserIdByEmail($conn, $email)
{
  $stmt = $conn->prepare("SELECT userID FROM User WHERE email = ?");
  $stmt->bind_param('s', $email);
  $stmt->execute();
  $result = $stmt->get_result();
  if ($row = $result->fetch_assoc()) {
    return $row['userID'];
  } else {
    return null; // Handle this case appropriately
  }
}


function refreshToken($conn)
{
  $inputRefreshToken = $_POST['refreshToken'];

  $stmt = $conn->prepare("SELECT user_id, expires_at FROM refresh_tokens WHERE token = ?");
  $stmt->bind_param('s', $inputRefreshToken);
  $stmt->execute();
  $result = $stmt->get_result();

  if ($row = $result->fetch_assoc()) {
    if (new DateTime() < new DateTime($row['expires_at'])) {
      $user_id = $row['user_id'];
      $email = getEmailFromUserId($conn, $user_id);
      $newJwt = issueJwt($email);
      echo json_encode(['jwt' => $newJwt]);
    } else {
      echo json_encode(['error' => 'Refresh token expired']);
    }
  } else {
    echo json_encode(['error' => 'Invalid refresh token']);
  }

  $stmt->close();
}

function verifyToken()
{
  $config = require 'config.php';
  $jwtSecretKey = $config['jwt_secret'];
  if (!isset(getallheaders()['Authorization'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Authorization header missing']);
    exit;
  }

  $authHeader = getallheaders()['Authorization'];
  $arr = explode(' ', $authHeader);

  if (count($arr) < 2) {
    http_response_code(401); // Unauthorized
    echo json_encode(['error' => 'Token not found in request']);
    exit;
  }

  $token = $arr[1];

  try {
    $decoded = JWT::decode($token, new Key($jwtSecretKey, 'HS256'));
    return $decoded; // The decoded token which can be used to fetch user specific data
  } catch (Exception $e) {
    http_response_code(401); // Unauthorized
    echo json_encode(['error' => $e->getMessage()]);
    exit;
  }
}

function getQuestions($conn)
{
  $result = $conn->query("SELECT * FROM Question");
  $questions = [];
  while ($row = $result->fetch_assoc()) {
    $questions[] = $row;
  }
  echo json_encode($questions);
}


function postQuestion($conn)
{
  $decoded = verifyToken();
  $questionData = json_decode(file_get_contents("php://input"), true);
  if (!$questionData || !isset($questionData['question'])) {
    echo json_encode(['error' => 'Invalid data provided']);
    return;
  }

  $question = $conn->real_escape_string($questionData['question']);
  $stmt = $conn->prepare("INSERT INTO Question (question, user_id) VALUES (?, ?)");
  $stmt->bind_param("si", $question, $decoded->userId);
  if ($stmt->execute()) {
    echo json_encode(['message' => 'Question added successfully']);
  } else {
    echo json_encode(['error' => $stmt->error]);
  }
  $stmt->close();
}




$conn->close();
