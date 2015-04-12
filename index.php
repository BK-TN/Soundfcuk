<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>SOUNDFCUK TEST RUN</title>
        <link rel="stylesheet" type="text/css" href="main.css">
        <script src="soundcloudSdk.js"></script>
        <script src="//code.jquery.com/jquery-1.11.2.min.js"></script>
		<script src="test.js"></script>
		<script src="dataAccess.js"></script>
    </head>
    <body>
		<div id='topline'>
			<div class='element'><img src="media/carlos.jpg"></div>
			<div class='element'><h1 id='title'>SOUNDFCUK</h1></div>
			<div class='element'>
				<input id="search-query" type='text' placeholder="Search...">
				<select id="search-type">
					<option value="tracks">Tracks</option>
					<!--<option value="users">Users</option>
					<option value="playlists">Playlists</option>
					<option value="groups">Groups</option>-->
				</select>
				<input id="search-go" type="submit" value="Go" onclick="return search()">
			</div>
		</div>
		<div id="maincontent">
			<div id="sidebar">
				<p>Show as 
					<select id="showas">
						<option value="grid">Grid</option>
						<option value="list">List</option>
					</select>
				</p>
				<p>Filter results <input id="filter" type="text"></p>
			</div>
			<div id="items">
				<div id="status"></div>
				<!-- Tracks/users/playlists/groups are put here -->
				<div id="output">
					
				</div>
			</div>
		</div>
    </body>
</html>