var coolTab;
$(document).ready(function () {
	//Profiles used for testing likes
	//Erland: 27618420 - shitton of likes
	//BK-TN: 6833649 - small amount of likes
	SC.initialize({
		client_id: "1e14dbad65f82fa3d3b30b940a36bbb6",
		redirect_uri: "http://soundfcuk.bk-tn.com/auth.php"
	});
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
	displayMode = $("#showas").val();
	$("#showas").change(function() {
		displayMode = $("#showas").val();
		writeItems(loadedItems);
	});
	$("#search-query").keyup(function(e) {
		if (e.keyCode === 13) {
			$("#search-go").click();
		}
	});

	coolTab = new Tab("Cool tab");
});

function search() {
	var query = $("#search-query").val();
	var type = $("#search-type").val();
	$(eOutput).html("");
	switch(type) {
	    case "tracks":
	        new FetchRequest("/tracks/", { q: query }, function (items) { coolTab.addList(items) });
		    //mainTab.fetch();
			break;
		case "users":
		    new FetchRequest("/users/", { q: query }, function (items) { writeItems(items); });
			break;
	}
	
	return false;
}