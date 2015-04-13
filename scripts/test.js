var loadedTracks = [];
var da;

$(document).ready(function () {
	//Erland: 27618420
	//BK-TN: 6833649
	SC.initialize({
		client_id: "1e14dbad65f82fa3d3b30b940a36bbb6",
		redirect_uri: "http://soundfcuk.bk-tn.com/auth.php"
	});
	//getUserLikes(27618420);
	$("#filter").change(function () {
		$("#output").children().each(function () {
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
	da = new dataAccess("1e14dbad65f82fa3d3b30b940a36bbb6", "http://soundfcuk.bk-tn.com/auth.php");
	
});

function search() {
	var query = $("#search-query").val();
	setStatus("Search started");
	showStatus();
	da.fetch(
			"/tracks/",
			{
				q: query
			},
			200,
			1000,
			function (offset) {
				setStatus("Fetched with offset " + offset);
			},
			function (items) {
				setStatus("Done (" + items.length + " results)");
				writeAllTracksAsGrid(items);
				hideStatus();
			});
	return false;
}

function htmlfilter(input) {
	var pre = document.createElement('pre');
    var text = document.createTextNode( input );
    pre.appendChild(text);
    return pre.innerHTML.replace(/\"/g,"&quot;").replace(/\'/g,"&#39;");
}

function writeAllTracksAsGrid(tracks) {
	$("#output").html("");
	var i = 0;
	var interval = setInterval(function () {
		writeTrackAsGrid(tracks[i]);
		i++;
		if (i >= tracks.length) {
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
	var text = '<a class="item" title="[' + htmlfilter(t.user.username) + '] ' +
			htmlfilter(t.title) + '" href="' +
			t.permalink_url + '" target="_blank"><div class="image" style="background-image:url(' + coverUrl + ');"></div></a>';
	$(text).hide().appendTo("#output").fadeIn(300);
}

function setStatus(text) {
	$("#status").html(text);
}

function showStatus() {
	$("#status").fadeIn(300);
}

function hideStatus() {
	setTimeout(function() {
		$("#status").fadeOut(1000);
	},1000);
	
}