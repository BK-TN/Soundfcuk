var loadedTracks = [];

$(document).ready(function () {
	//Erland: 27618420
	//BK-TN: 6833649
	SC.initialize({
		client_id: "1e14dbad65f82fa3d3b30b940a36bbb6",
		redirect_uri: "http://soundfcuk.bk-tn.com/auth.php"
	});
	//getUserLikes(27618420);
	$("#filter").change(function () {
		$("#soundgrid").children().each(function () {
			var tracktitle = $(this).attr("title").toLowerCase();
			var filtertext = $("#filter").val().toLowerCase();
			if (tracktitle.indexOf(filtertext) > -1) {
				//Track matches filter
				$(this).show();
			} else { //Track doesn't match filter
				$(this).hide();
			}
		});
	});
});

function btnGetUserLikes() {
	var userUrl = $("#scprofileurl").val();
	SC.get("/resolve", {
		url: userUrl
	}, function (user) {
		getUserLikes(user.id);
	});
}

function getUserLikes(userId) {
	loadedTracks.length = 0;
	$("#output").html("");
	$("#soundgrid").html("");
	$("#soundlist").html("");
	setStatus("Fetching likes...");
	SC.get("/users/" + userId + "/", {}, function (user) {
		$("#output").append(user.username + "<br>" + user.public_favorites_count + " likes <br>");
		getTracksUsingOffset("/users/" + userId + "/favorites/", 0, 200, user.public_favorites_count);
	});
}

function getTracksUsingOffset(url, offset, limit, max) {
	//console.log("Fetching tracks " + offset + " to " + (offset + limit - 1));
	SC.get(url, {
		offset: offset,
		limit: limit
	}, function (output, error) {
		var tracks = [];
		if (output.collection !== undefined) {
			tracks = output.collection;
		} else {
			tracks = output;
		}
		for (var i = 0; i < tracks.length; i++) {
			loadedTracks.push(tracks[i]);
		}
		setStatus("Fetched tracks " + offset + " to " + (offset + limit - 1) + " - got " + tracks.length + " tracks (" + (max - offset) + " tracks to go)");
		if (offset < max) {
			getTracksUsingOffset(url, offset + limit, limit, max);
		} else {
			setStatus("Finished fetching tracks - " + loadedTracks.length + " total");
			switch ($("#showas").val()) {
				case "grid":
					writeAllTracksAsGrid();
					break;
				case "list":
					writeAllTracksAsList();
					break;
			}
		}
	});
}

function writeAllTracksAsGrid() {
	$("#soundgrid").html("");
	var i = 0;
	var interval = setInterval(function () {
		writeTrackAsGrid(loadedTracks[i]);
		i++;
		if (i >= loadedTracks.length) {
			clearInterval(interval);
		}
	}, 2);
}

function writeTrackAsGrid(t) {
	//First, figure out which cover image to use
	var coverUrl;
	if (t.artwork_url !== null) {
		coverUrl = t.artwork_url;
	} else {
		coverUrl = t.user.avatar_url;
	}
	var text = '<a title="[' + t.user.username + '] ' + t.title + '" href="' + t.permalink_url + '" target="_blank"><img src="' + coverUrl + '"></a>';
	$(text).hide().appendTo("#soundgrid").fadeIn(300);
}

function writeAllTracksAsList() {
	$("#soundlist").html("");
	var i = 0;
	var interval = setInterval(function () {
		writeTrackAsList(loadedTracks[i]);
		i++;
		if (i >= loadedTracks.length) {
			clearInterval(interval);
		}
	}, 2);
}

function writeTrackAsList(t) {
	var text = '<li><a href="' + t.permalink_url + '" target="_blank">[' + t.user.username + '] ' + t.title + '</a></li>';
	$(text).hide().appendTo("#soundlist").fadeIn(300);
}

function setStatus(text) {
	$("#status").html(text);
}