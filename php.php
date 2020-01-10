  
<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
	$first = $_POST['playerName'];
	$last = $_POST['score'];
}
?>
{
    "first": <?php echo $first?>,
    "last": <?php echo $last?>,
}