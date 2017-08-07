<?php
  if( !(isset($_POST['uuid']) &&  isset($_POST['votes'])) ) {
    return;
  }

  $uuid = $_POST['uuid'];
  $votes = $_POST['votes'];

  $host = '127.0.0.1';
  $dbname = 'candidate_db';
  $user = 'candidate';
  $pass = 'c4nd1d4t3';

  try {
    $dbh = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);

    $stmt = $dbh->prepare('INSERT INTO results(uuid, results, created_at) VALUES(:uuid, :votes, NOW());');

    $stmt->bindParam(':uuid', $uuid, PDO::PARAM_STR);
    $stmt->bindParam(':votes', $votes, PDO::PARAM_STR);

    $stmt->execute();
  } catch (PDOException $e) {
    echo 'Connection failed: ' . $e->getMessage();
    return;
  }
?>