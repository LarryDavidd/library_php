<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="stylesheet" href="/library_php/assets/styles.css" type="text/css">
	<title><?=$title?></title>
</head>
<body>
	head
	<hr>
	<a href="<?=BASE_URL?>">Home</a>
	<hr>
	<?=$content?>
	<hr>
	footer
	<button id='parseButton'>Parse</button>
</body>
<script src="/library_php/assets/js/index.js" defer></script>
<script>
document.addEventListener("DOMContentLoaded", () => {
	const button = document.getElementById('parseButton');
	button.addEventListener('click', () => {
		fetch('/api/parse').then(console.log)
	})
})
</script>

</html>