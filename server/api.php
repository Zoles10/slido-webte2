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
$firstParam = $pathParts[4] ?? null;

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
    handleGetActions($action, $firstParam, $conn);
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
    case 'answer':
      postAnswer($conn);
      break;
    default:
      echo json_encode(['error' => 'Invalid action']);
      break;
  }
}

function handleGetActions($action, $firstParam, $conn)
{
  switch ($action) {
    case 'question':
      if ($firstParam) {
        getQuestionByCode($conn, $firstParam);
      } else {
        getQuestions($conn);
      }
      getQuestions($conn);
      break;
    case 'answer':
      getAnswers($conn);
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

function issueRefreshToken($conn, $user_id)
{
  $expires_at = date('Y-m-d H:i:s', strtotime('+7 days'));
  $refreshToken = bin2hex(random_bytes(64));

  $stmt = $conn->prepare("INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)");
  $stmt->bind_param('iss', $user_id, $refreshToken, $expires_at);
  if (!$stmt->execute()) {
    echo json_encode(['error' => "Error: " . $stmt->error]);
    $stmt->close();
    return null;
  }
  $stmt->close();

  return $refreshToken;
}


function issueJwt($user_id, $email)
{
  $issuedAt = time();
  $expirationTime = $issuedAt + 3600;
  $payload = [
    'iat' => $issuedAt,
    'exp' => $expirationTime,
    'user_id' => $user_id,
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

  $stmt = $conn->prepare("SELECT user_id, password FROM User WHERE email = ?");
  $stmt->bind_param("s", $email);
  $stmt->execute();
  $result = $stmt->get_result();

  if ($result->num_rows == 1) {
    $row = $result->fetch_assoc();
    $hashed_password = $row['password'];
    $user_id = $row['user_id'];

    if (password_verify($password, $hashed_password)) {
      $jwt = issueJwt($user_id, $email);
      $refreshToken = issueRefreshToken($conn, $user_id);
      echo json_encode(['message' => 'Login successful', 'jwt' => $jwt, 'refreshToken' => $refreshToken]);
    } else {
      echo json_encode(['error' => 'Invalid password']);
    }
  } else {
    echo json_encode(['error' => 'User does not exist']);
  }

  $stmt->close();
}

function getEmailFromUserId($conn, $user_id)
{
  $stmt = $conn->prepare("SELECT email FROM User WHERE user_id = ?");
  $stmt->bind_param('i', $user_id);
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
  $stmt = $conn->prepare("SELECT user_id FROM User WHERE email = ?");
  $stmt->bind_param('s', $email);
  $stmt->execute();
  $result = $stmt->get_result();
  if ($row = $result->fetch_assoc()) {
    return $row['user_id'];
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
      $newJwt = issueJwt($user_id, $email);
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
  $headers = getallheaders();
  if (!isset($headers['Authorization'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Authorization header missing']);
    exit;
  }

  list($tokenType, $token) = explode(" ", $headers['Authorization'], 2);
  if ($tokenType !== 'Bearer') {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid token type']);
    exit;
  }

  try {
    return JWT::decode($token, new Key($jwtSecretKey, 'HS256'));
  } catch (Exception $e) {
    http_response_code(401);
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

function generateUniqueCode($conn)
{
  $code = '';
  $count = 0;
  do {
    $code = sprintf("%05d", rand(0, 99999));
    $query = "SELECT COUNT(*) FROM Question WHERE code = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $code);
    $stmt->execute();
    $stmt->bind_result($count);  // Bind the result of the query to the $count variable
    $stmt->fetch();  // Fetch the result into the bound variable $count
    $stmt->close();
  } while ($count > 0);  // Ensure the code is unique by checking the database

  return $code;
}



function postQuestion($conn)
{
  $decoded = verifyToken();
  $questionData = json_decode(file_get_contents("php://input"), true);

  // Ensure all necessary fields are present
  if (!$questionData || !isset($questionData['question_string']) || !isset($questionData['question_type']) || !isset($questionData['topic'])) {
    echo json_encode(['error' => 'Invalid data provided - missing fields']);
    return;
  }
  $question = $conn->real_escape_string($questionData['question_string']);
  $question_type = $conn->real_escape_string($questionData['question_type']);
  $topic = $conn->real_escape_string($questionData['topic']);
  $active = isset($questionData['active']) ? (int)$questionData['active'] : 0;  // assuming 'active' is a boolean you may want to manage
  $userId = $decoded->userId;  // Assuming the token includes 'userId' information
  $code = generateUniqueCode($conn);
  // Prepare the SQL statement
  $stmt = $conn->prepare("INSERT INTO Question (user_id, question_string, question_type, active, topic, code) VALUES (?, ?, ?, ?, ?, ?)");
  $stmt->bind_param("issisi", $userId, $question, $question_type, $active, $topic, $code);

  // Execute the query
  if ($stmt->execute()) {
    echo json_encode(['message' => 'Question added successfully']);
  } else {
    echo json_encode(['error' => $stmt->error]);
  }

  $stmt->close();
}

function getAnswers($conn)
{
  $question_id = isset($_GET['question_id']) ? intval($_GET['question_id']) : null;

  if ($question_id) {
    $stmt = $conn->prepare("SELECT * FROM Answer WHERE question_id = ?");
    $stmt->bind_param("i", $question_id);
  } else {
    $stmt = $conn->prepare("SELECT * FROM Answer");
  }

  $stmt->execute();
  $result = $stmt->get_result();
  $answers = $result->fetch_all(MYSQLI_ASSOC);

  echo json_encode($answers);
  $stmt->close();
}

function postAnswer($conn)
{
  $data = json_decode(file_get_contents("php://input"), true);

  if (!isset($data['question_id'], $data['answer_string'], $data['user_id'])) {
    echo json_encode(['error' => 'Missing required fields']);
    return;
  }

  $question_id = $data['question_id'];
  $answer_string = $conn->real_escape_string($data['answer_string']);
  $user_id = $data['user_id'];

  $stmt = $conn->prepare("INSERT INTO Answer (question_id, answer_string, user_id) VALUES (?, ?, ?)");
  $stmt->bind_param("isi", $question_id, $answer_string, $user_id);

  if ($stmt->execute()) {
    echo json_encode(['message' => 'Answer posted successfully']);
  } else {
    echo json_encode(['error' => $stmt->error]);
  }

  $stmt->close();
}

function getQuestionByCode($conn, $code)
{
  if (!$code) {
    echo json_encode(['error' => 'Missing code parameter']);
    return;
  }

  $stmt = $conn->prepare("SELECT * FROM Question WHERE code = ?");
  $stmt->bind_param("s", $code);
  $stmt->execute();
  $result = $stmt->get_result();

  if ($result->num_rows > 0) {
    $question = $result->fetch_assoc();
    echo json_encode($question);
  } else {
    echo json_encode(['message' => 'No question found with the specified code']);
  }

  $stmt->close();
}





$conn->close();
