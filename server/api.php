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
  header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
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
    handlePostActions($action, $firstParam, $secondParam, $conn);
    break;
  case 'GET':
    handleGetActions($action, $firstParam, $secondParam, $conn);
    break;
  case 'PUT':
    handlePutActions($action, $firstParam, $secondParam, $conn);
    break;
  case 'DELETE':
    handleDeleteActions($action, $firstParam, $secondParam, $conn);
    break;
  default:
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    break;
}

function handlePostActions($action, $firstParam, $secondParam, $conn)
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
    case 'questionOption':
      if (!$firstParam) {
        echo json_encode(['error' => 'Missing question_id']);
        return;
      }
      postQuestionOption($conn, $firstParam);
      break;
    default:
      echo json_encode(['error' => 'Invalid action', 'action' => $action]);
      break;
  }
}

function handleGetActions($action, $firstParam, $secondParam, $conn)
{
  switch ($action) {

    case 'question':
      if ($firstParam && $secondParam === 'options') {
        getQuestionOptions($conn, $firstParam);
      } else if ($firstParam) {
        getQuestionByCode($conn, $firstParam);
      } else {
        getQuestions($conn);
      }
      break;
    case 'activeQuestion':
      if ($firstParam) {
        getActiveQuestion($conn, $firstParam);
      }
      break;
    case 'answer':
      if ($firstParam) {
        getAnswersByCode($conn, $firstParam);
      }
      break;
    case 'users':
      getUsers($conn);
      break;
    default:
      echo json_encode(['error' => 'Invalid action', 'action' => $action]);
      break;
  }
}

function handlePutActions($action, $firstParam, $secondParam, $conn)
{
  switch ($action) {
    case 'password':
      changePassword($conn);
      break;
    case 'username':
      changeUsername($conn);
      break;
    case 'question':
      if ($firstParam) {
        updateQuestion($conn, $firstParam);
      }
      break;
    default:
      echo json_encode(['error' => 'Invalid action', 'action' => $action]);
      break;
  }
}

function handleDeleteActions($action, $firstParam, $secondParam, $conn)
{
  switch ($action) {
    case 'question':
      if ($firstParam) {
        deleteQuestion($conn, $firstParam);
      }
      break;
    case 'user':
      if ($firstParam) {
        deleteUserAndTokens($conn, $firstParam);
      }
      break;
    default:
      echo json_encode(['error' => 'Invalid action', 'action' => $action]);
      break;
  }
}
function registerUser($conn)
{
  $inputJSON = file_get_contents('php://input');
  $input = json_decode($inputJSON, TRUE); // convert JSON into array

  // Check for required fields
  if (!isset($input['username']) || !isset($input['password']) || !isset($input['name']) || !isset($input['lastname'])) {
    echo json_encode(['error' => 'Missing fields', 'input' => $input]);
    exit;
  }

  // Sanitize and hash data
  $email = $conn->real_escape_string($input['username']);
  $password = password_hash($input['password'], PASSWORD_DEFAULT);
  $name = $conn->real_escape_string($input['name']);
  $lastname = $conn->real_escape_string($input['lastname']);

  // Prepare the SQL statement
  $stmt = $conn->prepare("INSERT INTO User (email, password, name, lastname) VALUES (?, ?, ?, ?)");
  $stmt->bind_param("ssss", $email, $password, $name, $lastname);

  // Execute the statement and handle the result
  if ($stmt->execute()) {
    echo json_encode(['message' => 'New user registered successfully']);
  } else {
    echo json_encode(['error' => "Error: " . $stmt->error]);
  }

  // Close the statement
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
  if (!isset($input['email']) || !isset($input['password'])) {
    echo json_encode(['error' => 'Missing email or password', 'input' => $input]);
    exit;
  }


  $email = $conn->real_escape_string($input['email']);
  $password = $input['password'];
  $stmt = $conn->prepare("SELECT user_id,name, lastname, role, password FROM User WHERE email = ?");
  $stmt->bind_param("s", $email);
  $stmt->execute();
  $result = $stmt->get_result();

  if ($result->num_rows == 1) {
    $row = $result->fetch_assoc();
    $hashed_password = $row['password'];
    $user_id = $row['user_id'];
    $name = $row['name'];
    $lastname = $row['lastname'];
    $role = $row['role'];

    if (password_verify($password, $hashed_password)) {
      $jwt = issueJwt($user_id, $email);
      $refreshToken = issueRefreshToken($conn, $user_id);
      echo json_encode(['message' => 'Login successful', 'jwt' => $jwt, 'refreshToken' => $refreshToken, 'user_id' => $user_id, 'email' => $email, 'expires_at' => date('Y-m-d H:i:s', strtotime('+7 days')), 'issued_at' => date('Y-m-d H:i:s'), 'name' => $name, 'lastname' => $lastname, 'role' => $role]);
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

function getUsers($conn)
{
  $result = $conn->query("SELECT user_id, email, name, lastname, created_at, role FROM User");

  $users = [];
  while ($row = $result->fetch_assoc()) {
    $users[] = $row;
  }
  echo json_encode($users);
}


function generateUniqueCode($conn)
{
  $code = '';
  $count = 0;
  do {
    $code = rand(10000, 99999);
    $code = sprintf("%05d", $code);

    $query = "SELECT COUNT(*) FROM Question WHERE code = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $code);
    $stmt->execute();
    $stmt->bind_result($count);
    $stmt->fetch();
    $stmt->close();
  } while ($count > 0);

  return $code;
}




function postQuestion($conn)
{
  // $decoded = verifyToken();
  $questionData = json_decode(file_get_contents("php://input"), true);

  if (!$questionData || !isset($questionData['question_string']) || !isset($questionData['question_type']) || !isset($questionData['topic']) || !isset($questionData['user_id']) || !isset($questionData['active'])) {
    echo json_decode(!isset($questionData['question_string']));
    echo json_decode(!isset($questionData['question_type']));
    echo json_decode(!isset($questionData['topic']));
    echo json_decode(!isset($questionData['user_id']));
    echo json_decode(!isset($questionData['active']));
    http_response_code(400);
    echo json_encode(['error' => 'Invalid data provided - missing fields', 'data' => $questionData]);
    return;
  }
  $question = $conn->real_escape_string($questionData['question_string']);
  $question_type = $conn->real_escape_string($questionData['question_type']);
  $topic = $conn->real_escape_string($questionData['topic']);
  $active = isset($questionData['active']) ? (int)$questionData['active'] : 0;
  $userId =  $questionData['user_id'];
  $code = generateUniqueCode($conn);
  $stmt = $conn->prepare("INSERT INTO Question (user_id, question_string, question_type, active, topic, code) VALUES (?, ?, ?, ?, ?, ?)");
  $stmt->bind_param("issisi", $userId, $question, $question_type, $active, $topic, $code);
  if ($stmt->execute()) {

    echo json_encode(['message' => 'Question added successfully', 'code' => $code]);
  } else {
    echo json_encode(['error' => $stmt->error]);
  }

  $stmt->close();
}

function getAnswersByCode($conn, $code)
{
  // First attempt to retrieve question_id using the code
  $stmt = $conn->prepare("SELECT question_id FROM Question WHERE code = ?");
  $stmt->bind_param("s", $code);
  $stmt->execute();
  $result = $stmt->get_result();

  $question_id = 0;

  if ($result->num_rows > 0) {
    // If the question is found using the code, fetch the question_id
    $row = $result->fetch_assoc();
    $question_id = $row['question_id'];
  } else {
    // If no question is found, assume the code might be the question_id
    // Check if the code is a numeric value which could be a question_id
    if (is_numeric($code)) {
      $question_id = $code;
      // Validate whether this numeric code is a valid question_id
      $validationStmt = $conn->prepare("SELECT 1 FROM Question WHERE question_id = ?");
      $validationStmt->bind_param("i", $question_id);
      $validationStmt->execute();
      if ($validationStmt->get_result()->num_rows == 0) {
        echo json_encode(['error' => 'No question found with the provided code']);
        $validationStmt->close();
        return;
      }
      $validationStmt->close();
    } else {
      echo json_encode(['error' => 'No question found with the provided code']);
      $stmt->close();
      return;
    }
  }

  $stmt->close();  // Close the initial statement

  // Now retrieve and count answers for the identified question_id
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

function postQuestionOption($conn, $code)
{
  $data = json_decode(file_get_contents("php://input"), true);

  // Check required fields
  if (!isset($data['option_string']) || !isset($data['correct'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    return;
  }

  $option_string = $conn->real_escape_string($data['option_string']);
  $question_id =  null;
  $correct = $data['correct'];

  // Validate either question_id or code must be present
  if (!$code) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing question identifier']);
    return;
  }

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
  if (isset($question_id)) {
    $stmt = $conn->prepare("INSERT INTO QuestionOption (question_id, option_string, correct) VALUES (?, ?, ?)");
    $stmt->bind_param("isi", $question_id, $option_string, $correct);
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

function getQuestionOptions($conn, $question_id)
{
  if (!$question_id) {
    echo json_encode(['error' => 'Missing question_id parameter']);
    return;
  }

  $stmt = $conn->prepare("SELECT * FROM QuestionOption WHERE question_id = ?");
  $stmt->bind_param("i", $question_id);
  $stmt->execute();
  $result = $stmt->get_result();

  $questionOptions = [];
  while ($row = $result->fetch_assoc()) {
    $questionOptions[] = $row;
  }

  if (count($questionOptions) > 0) {
    echo json_encode($questionOptions);
  } else {
    echo json_encode(['message' => 'No question found with the specified code', 'question_id' => $question_id]);
  }

  $stmt->close();
}

function updateQuestion($conn, $firstParam)
{
  $data = json_decode(file_get_contents("php://input"), true);
  if (!isset($data['question_string']) || !isset($data['question_type']) || !isset($data['topic']) || !isset($data["active"])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    return;
  }

  $active = $data['active'];
  $question_string = $conn->real_escape_string($data['question_string']);
  $question_type = $conn->real_escape_string($data['question_type']);
  $topic = $conn->real_escape_string($data['topic']);

  $stmt = $conn->prepare("UPDATE Question SET question_string = ?, question_type = ?, topic = ?, active = ? WHERE code = ?");
  $stmt->bind_param("sssii", $question_string, $question_type, $topic, $active, $firstParam);

  if ($stmt->execute()) {
    echo json_encode(['message' => 'Question updated successfully']);
  } else {
    echo json_encode(['error' => $stmt->error]);
  }

  $stmt->close();
}

function deleteQuestion($conn, $code)
{
  $conn->begin_transaction();

  try {
    $stmt = $conn->prepare("SELECT question_id FROM Question WHERE code = ?");
    $stmt->bind_param("s", $code);
    if (!$stmt->execute()) {
      throw new Exception("Error fetching question: " . $stmt->error);
    }

    $result = $stmt->get_result();
    if ($result->num_rows == 0) {
      throw new Exception("No question found with the given code.");
    }

    $row = $result->fetch_assoc();
    $question_id = $row['question_id'];
    $stmt->close();

    // Delete all answers related to the question
    $stmt = $conn->prepare("DELETE FROM Answer WHERE question_id = ?");
    $stmt->bind_param("i", $question_id);
    if (!$stmt->execute()) {
      throw new Exception("Error deleting answers: " . $stmt->error);
    }
    $stmt->close();

    // Delete all question options related to the question
    $stmt = $conn->prepare("DELETE FROM QuestionOption WHERE question_id = ?");
    $stmt->bind_param("i", $question_id);
    if (!$stmt->execute()) {
      throw new Exception("Error deleting question options: " . $stmt->error);
    }
    $stmt->close();

    // Delete the question itself
    $stmt = $conn->prepare("DELETE FROM Question WHERE question_id = ?");
    $stmt->bind_param("i", $question_id);
    if (!$stmt->execute()) {
      throw new Exception("Error deleting question: " . $stmt->error);
    }
    $stmt->close();

    // Commit the transaction if all deletions were successful
    $conn->commit();
    echo json_encode(['message' => 'Question and related data deleted successfully']);
  } catch (Exception $e) {
    // Rollback the transaction on error
    $conn->rollback();
    echo json_encode(['error' => $e->getMessage()]);
  }
}

function getActiveQuestion($conn, $code)
{
  $stmt = $conn->prepare("SELECT * FROM Question WHERE active = 1 AND code = ?");
  $stmt->bind_param("s", $code);
  $stmt->execute();
  $result = $stmt->get_result();
  if ($result->num_rows > 0) {
    $question = $result->fetch_assoc();
    echo json_encode($question);
  } else {
    echo json_encode(['message' => 'No active question found']);
  }
  $stmt->close();
}

function deleteUserAndTokens($conn, $user_id) {
  if (!$user_id) {
      echo json_encode(['error' => 'Missing user_id parameter']);
      return;
  }

  $conn->begin_transaction();

  try {
      $deleteTokensStmt = $conn->prepare("DELETE FROM refresh_tokens WHERE user_id = ?");
      $deleteTokensStmt->bind_param("i", $user_id);
      $deleteTokensStmt->execute();

      if ($deleteTokensStmt->affected_rows > 0) {
          echo json_encode(['message' => 'Associated tokens deleted']);
      } else {
          echo json_encode(['message' => 'No associated tokens found']);
      }

      $deleteUserStmt = $conn->prepare("DELETE FROM User WHERE id = ?");
      $deleteUserStmt->bind_param("i", $user_id);
      $deleteUserStmt->execute();

      $conn->commit();
      echo json_encode(['message' => "User $user_id and associated tokens deleted successfully"]);
  } catch (Exception $e) {
    $conn->rollback();
      echo json_encode(['error' => "An error occurred: " . $e->getMessage()]);
  } finally {
      $deleteTokensStmt->close();
      $deleteUserStmt->close();
  }
}


$conn->close();
