
<?php
$servername = "localhost";
$username = 'candidate';
$password = 'c4nd1d4t3';
$dbname = 'candidate_db';

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT results FROM results WHERE created_at >= '2017-09-06'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
        $output = $row['results'];
        $output = substr($output, 1);
        $output = substr($output, 0, -1).',';
        echo $output;
    }
} else {
    echo "0 results";
}


$conn->close();
?>
