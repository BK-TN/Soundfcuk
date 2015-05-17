/* 
 * Copyright (C) 2015 BK-TN
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 */


//UNFCUK YOUR SOUND
//This is the collection of javascript functions used to drive the site.
//Rememeber to initialize the soundcloud API before using any of these.

var eOutput = "#output";
var eStatus = "#status";
var loadedItems = [];

var itemsPerRequest = 200;
var maxItems = 1000;

var displayMode = "grid";

//Fetches until there are no more items left or maxItems has been reached.
function fetchList(uri,uriData) {
	showStatus();
	this.setStatus("Fetching items from " + uri);
	var tempItems = []; //Varaible to store items in while loading them
	var fetchPart = function(offset) {
		SC.get(uri, $.extend(uriData, {
			offset: offset,
			limit: itemsPerRequest
		}),function(output,error) {
			if (error !== null) {
				//An error occoured, stop the fetching
				setStatus("There was an error! " + error.message);
				hideStatus();
				return;
			}
			var fetchedItems = [];
			if (output.collection !== undefined) {
				fetchedItems = output.collection;
			} else {
				fetchedItems = output;
			}
			tempItems.push.apply(tempItems,fetchedItems);
			if (fetchedItems.length > 0 && offset < maxItems) {
				//Tracks fetched - there are probably more left
				setStatus("Fetched with offset " + offset);
				fetchPart(offset + itemsPerRequest);
			} else {
				//No tracks fetched or max tracks reached - this is most likely the endpoint
				setStatus("Done (" + tempItems.length + " results)");
				hideStatus();
				loadedItems = tempItems;
				writeItems(loadedItems);
			}
		});
	};
	fetchPart(0); //Start a recursive function that fetches stuff
}

function writeItems(items) {
	$(eOutput).html("");
	var i = 0;
	var interval = setInterval(function () {
		writeItem(items[i]);
		i++;
		if (i >= items.length) {
			clearInterval(interval);
		}
	}, 2);
	var writeItem = function(i) {
		//Pick which way to write it
		if (i.kind === undefined) return;
		switch(i.kind) {
			case "track":
				writeTrack(i);
				break;
			case "user":
				writeUser(i);
				break;
		}
	};
	var writeTrack = function(t) {
		//First, figure out which cover image to use
		var coverUrl;
		if (t.artwork_url !== null) {
			coverUrl = t.artwork_url;
		} else {
			coverUrl = t.user.avatar_url;
		}
		var text = '<a class="item" title="[' + htmlfilter(t.user.username) + '] ' +
				htmlfilter(t.title) + '" href="#"><div class="image" style="background-image:url(' + coverUrl + ');"></div></a>';
		append(text,function() {
			displayTrack(t);
		});
	};
	var writeUser = function(u) {
		switch(displayMode) {
			default: //GRID by default
				var text = '<a class="item" title="' + htmlfilter(u.username) + '" href="#"><div class="image" style="background-image:url(' + u.avatar_url + ');"></div></a>';
				append(text,function() {
					displayUser(u);
				});
				break;
			case 'list':
				var userLink = '<a class="listitem" href="#">' + u.username + '</a>';
				append(userLink, function() {
					displayUser(u);
				});
				break;
		}
		
	};
	var append = function(text,onClick) {
		$(text).hide().appendTo(eOutput).fadeIn(300).click(function() {
			onClick();
		});
	};
}

function displayTrack(t) {
	var text = "<h2>" + t.user.username + "</h2><h1>" + t.title + "</h1>";
	text += "<p>" + t.description + "</p>";
	text += "<table>";
	text += tr("Genre",t.genre) +
			tr("Created at",t.created_at) +
			tr("Tags",t.tag_list) +
			tr("Plays",t.playback_count) +
			tr("Downloads",t.download_count) +
			tr("Favorites",t.favoritings_count) +
			tr("Comments",t.comment_count);
	text += "</table>";
	$(eOutput).html(text).hide().fadeIn(300);
}

function displayUser(u) {
	var text = "<h1>" + u.username + "</h1>";
	text += '<img src="' + u.avatar_url +'">';
	text += "<p>" + u.description + "</p>";
	/*text += "<table>";
	text += tr("Genre",t.genre) +
			tr("Created at",t.created_at) +
			tr("Tags",t.tag_list) +
			tr("Plays",t.playback_count) +
			tr("Downloads",t.download_count) +
			tr("Favorites",t.favoritings_count) +
			tr("Comments",t.comment_count);
	text += "</table>";*/
	$(eOutput).html(text).hide().fadeIn(300);
	var text2 = '<a href="#">Show following (' + u.followings_count + ')</a>';
	$(text2).appendTo(eOutput).click(function() {
		fetchList("/users/" + u.id + "/followings/");
	});
}

function tr(a,b) {
	return "<tr><td>" + a + "</td><td>" + b + "</td>";
}

function htmlfilter(input) {
	var pre = document.createElement('pre');
    var text = document.createTextNode( input );
    pre.appendChild(text);
    return pre.innerHTML.replace(/\"/g,"&quot;").replace(/\'/g,"&#39;");
}

function setStatus(text) {
	$(eStatus).html(text);
}

function showStatus() {
	$(eStatus).fadeIn(300);
}

function hideStatus() {
	setTimeout(function() {
		$("#status").fadeOut(2000);
	},1000);
}

//use this code later
/*this.fetchSingle = function(uri,uriData,onDone,onError) { 
		SC.get(uri,uriData,function(output,error) {
			if (error !== null) {
				onError(error);
			} else {
				onDone(output);
			}
		});
	};*/