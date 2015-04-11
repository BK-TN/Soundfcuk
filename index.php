<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>SOUNDFCUK TEST RUN</title>
        <link rel="stylesheet" type="text/css" href="main.css">
        <script src="soundcloudSdk.js"></script>
        <script src="//code.jquery.com/jquery-1.11.2.min.js"></script>
		<script src="test.js"></script>
    </head>
    <body>
        <h1><img src="carlos.jpg"> SOUNDFCUK</h1>
        <p>Paste your soundcloud permalink <input id="scprofileurl" type="text"><button onclick="btnGetUserLikes()">Get likes</button></p>
		<p>Show as 
			<select id="showas">
				<option value="grid">Grid</option>
				<option value="list">List</option>
			</select>
		</p>
        <p>Filter results <input id="filter" type="text"></p>
        <p id="status"></p>
        <p id="output"></p>
        <div id="soundgrid"></div>
        <ol id="soundlist"></ol>
    </body>
</html>