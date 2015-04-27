<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>SOUNDFCUK TEST RUN</title>
        <link rel="stylesheet" type="text/css" href="main.css">
        <script src="scripts/soundcloudSdk.js"></script>
        <script src="http://code.jquery.com/jquery-1.11.2.min.js"></script>
		<script src="scripts/soundfcuk.js"></script>
		<script src="scripts/test.js"></script>
		<script>
			fetchList();
			//SC.URI("fasewf",{});
		</script>
    </head>
    <body>
		<div id='topline'>
			<div class='element'><img src="media/carlos.jpg"></div>
			<div class='element'><h1 id='title'>SOUNDFCUK</h1></div>
			<div class='element'>
				<input id="search-query" type='text' placeholder="Search...">
				<select id="search-type">
					<option value="tracks">Tracks</option>
					<option value="users">Users</option>
					<!--<option value="playlists">Playlists</option>
					<option value="groups">Groups</option>-->
				</select>
				<input id="search-go" type="submit" value="Go" onclick="return search()">
			</div>
		</div>
		<div id="maincontent">
			<div id="sidebar">
				<table>
					<tr>
						<td>Show as</td>
						<td>
							<select id="showas">
								<option value="grid">Grid</option>
								<option value="list">List</option>
							</select>
						</td>
					</tr>
					<tr>
						<td>Filter results</td>
						<td><input id="filter" type="text"></td>
					</tr>
				</table>
			</div>
			<div id="grid">
				<div id="status"></div>
				<!-- Tracks/users/playlists/groups are put here -->
				<div id="output">
					
				</div>
			</div>
		</div>
    </body>
</html>