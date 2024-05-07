<?php
// Error reporting setup
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');

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
$secondParam = $pathParts[5] ?? null;

if ($apiPrefix !== 'api') {
  http_response_code(404);
  echo json_encode(['error' => 'Invalid API endpoint', 'path' => $requestPath, 'parts' => $pathParts]);
  exit;
}

switch ($_SERVER["REQUEST_METHOD"]) {
  case 'POST':
    handlePostActions($action, $firstParam, $conn);
    break;
  case 'GET':
    handleGetActions($action, $firstParam, $conn);
    break;
  default:
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    break;
}

function handlePostActions($action, $firstParam, $conn)
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
      postAnswer($conn, $firstParam);
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
      break;
    case 'answer':
      if ($firstParam) {
        getAnswersByCode($conn, $firstParam);
      }
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
  $inputJSON = file_get_contents('php://input');
  $input = json_decode($inputJSON, TRUE);

  if (!isset($input['username']) || !isset($input['password'])) {
    echo json_encode(['error' => 'Missing email or password', 'input' => $input]);
    exit;
  }

  $email = $conn->real_escape_string($input['username']);
  $password = $input['password'];


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
      echo json_encode(['message' => 'Login successful', 'jwt' => $jwt, 'refreshToken' => $refreshToken, 'user_id' => $user_id, 'email' => $email, 'expires_at' => date('Y-m-d H:i:s', strtotime('+7 days')), 'issued_at' => date('Y-m-d H:i:s')]);
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

  if (!$questionData || !isset($questionData['question_string']) || !isset($questionData['question_type']) || !isset($questionData['topic']) || !isset($questionData['user_id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid data provided - missing fields']);
    return;
  }
  $question = $conn->real_escape_string($questionData['question_string']);
  $question_type = $conn->real_escape_string($questionData['question_type']);
  $topic = $conn->real_escape_string($questionData['topic']);
  $active = isset($questionData['active']) ? (int)$questionData['active'] : 0;
  $userId =  $questionData['user_id'];
  $code = generateUniqueCode($conn);
  // Prepare the SQL statement
  $stmt = $conn->prepare("INSERT INTO Question (user_id, question_string, question_type, active, topic, code) VALUES (?, ?, ?, ?, ?, ?)");
  $stmt->bind_param("issisi", $userId, $question, $question_type, $active, $topic, $code);

  // Execute the query
  if ($stmt->execute()) {

    echo json_encode(['message' => 'Question added successfully', 'code' => $code]);
  } else {
    echo json_encode(['error' => $stmt->error]);
  }

  $stmt->close();
}

function getAnswersByCode($conn, $code)
{
  // Prepare the statement to select question_id using the provided code
  $stmt = $conn->prepare("SELECT question_id FROM Question WHERE code = ?");
  $stmt->bind_param("s", $code);
  $stmt->execute();
  $result = $stmt->get_result();

  if ($result->num_rows == 0) {
    // No question found with the given code
    echo json_encode(['error' => 'No question found with the provided code']);
    $stmt->close();
    return;
  }

  $row = $result->fetch_assoc();
  $question_id = $row['question_id'];
  $stmt->close();  // Close the first statement

  // Prepare a new statement to select and count answers for the found question_id
  $stmt = $conn->prepare("SELECT answer_string AS name, COUNT(*) AS amount FROM Answer WHERE question_id = ? GROUP BY answer_string");
  $stmt->bind_param("i", $question_id);
  $stmt->execute();
  $result = $stmt->get_result();
  $answers = $result->fetch_all(MYSQLI_ASSOC);

  echo json_encode($answers);
  $stmt->close();
}



function postAnswer($conn, $code)
{
  $data = json_decode(file_get_contents("php://input"), true);

  // Check required fields
  if (!isset($data['answer_string'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    return;
  }

  $answer_string = $conn->real_escape_string($data['answer_string']);
  $question_id = isset($data['question_id']) ? $data['question_id'] : null;

  // Validate either question_id or code must be present
  if (!$question_id && !$code) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing question identifier']);
    return;
  }

  // If code is provided, get the question_id from the code
  if ($code) {
    $stmt = $conn->prepare("SELECT question_id FROM Question WHERE code = ?");
    $stmt->bind_param("s", $code);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows == 1) {
      $row = $result->fetch_assoc();
      $question_id = $row['question_id'];
    } else {
      http_response_code(404);
      echo json_encode(['error' => 'No question found with the provided code']);
      return;
    }
    $stmt->close();
  }

  // Prepare to insert the answer, now that question_id is determined
  if (isset($question_id)) {
    $stmt = $conn->prepare("INSERT INTO Answer (question_id, answer_string) VALUES (?, ?)");
    $stmt->bind_param("is", $question_id, $answer_string);
  } else {
    http_response_code(400);
    echo json_encode(['error' => 'No valid question identifier provided']);
    return;
  }

  if ($stmt->execute()) {
    http_response_code(201);
    echo json_encode(['message' => 'Answer posted successfully']);
  } else {
    http_response_code(500);
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

//change password function
function changePassword($conn)
{
  if (!isset($_POST['username']) || !isset($_POST['new_password'])) {
    echo json_encode(['error' => 'Missing username or new password']);
    exit;
  }

  $username = $conn->real_escape_string($_POST['username']);
  $newPassword = password_hash($_POST['new_password'], PASSWORD_DEFAULT);

  $stmt = $conn->prepare("SELECT * FROM User WHERE email = ?");
  $stmt->bind_param("s", $username);
  $stmt->execute();
  $result = $stmt->get_result();
  if ($result->num_rows == 0) {
    echo json_encode(['error' => 'User not found']);
    $stmt->close();
    exit;
  }
  $stmt->close();

  $stmt = $conn->prepare("UPDATE User SET password = ? WHERE email = ?");
  $stmt->bind_param("ss", $newPassword, $username);

  if ($stmt->execute()) {
    echo json_encode(['message' => 'Password updated successfully']);
  } else {
    echo json_encode(['error' => "Error updating password: " . $stmt->error]);
  }

  $stmt->close();
}

//change name
function changeUsername($conn)
{
  if (!isset($_POST['current_username']) || !isset($_POST['new_username'])) {
    echo json_encode(['error' => 'Missing current username or new username']);
    exit;
  }

  $currentUsername = $conn->real_escape_string($_POST['current_username']);
  $newUsername = $conn->real_escape_string($_POST['new_username']);

  // First, check if the current username exists in the database
  $stmt = $conn->prepare("SELECT * FROM User WHERE email = ?");
  $stmt->bind_param("s", $currentUsername);
  $stmt->execute();
  $result = $stmt->get_result();
  if ($result->num_rows == 0) {
    echo json_encode(['error' => 'Current user not found']);
    $stmt->close();
    exit;
  }
  $stmt->close();

  // Check if the new username is already taken
  $stmt = $conn->prepare("SELECT * FROM User WHERE email = ?");
  $stmt->bind_param("s", $newUsername);
  $stmt->execute();
  $result = $stmt->get_result();
  if ($result->num_rows > 0) {
    echo json_encode(['error' => 'New username is already taken']);
    $stmt->close();
    exit;
  }
  $stmt->close();

  // Proceed to update the username
  $stmt = $conn->prepare("UPDATE User SET email = ? WHERE email = ?");
  $stmt->bind_param("ss", $newUsername, $currentUsername);

  if ($stmt->execute()) {
    echo json_encode(['message' => 'Username updated successfully']);
  } else {
    echo json_encode(['error' => "Error updating username: " . $stmt->error]);
  }

  $stmt->close();
}




$conn->close();
