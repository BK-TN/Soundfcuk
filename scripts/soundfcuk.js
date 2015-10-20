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
var eTabs = "#tabs";
var loadedItems = [];

var itemsPerRequest = 200;
var maxItems = 1000;

var displayMode = "grid";

function Tab(name) {
    $("<li>" + name + "</li>").appendTo(eTabs).click(function () {
        console.log("wew lad");
    });

    this.name = name;
    this.items = [];
    this.canvasItems = [];

    this.addList = function (newItems) {
        this.items.push.apply(this.items, newItems);
        this.update();
        for (var i = 0; i < newItems.length; i++) {
            this.canvasItems.push(new CanvasItem(newItems[i]));
        }
    }

    /*this.addSingle = function (newItem) { unused
        this.items.push(newItem);
        this.update();
    }*/

    this.update = function () {
        /*$(eOutput).html("");
        writeItems(this.items);*/
    }
}

function writeItems(items) {
    //$(eOutput).html("");
    /*var i = 0;
	var interval = setInterval(function () {
		writeItem(items[i]);
		i++;
		if (i >= items.length) {
			clearInterval(interval);
		}
	}, 2);*/
	var writeItem = function(i) {
		//Pick which way to write it
		if (i === undefined || i.kind === undefined) return;
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
		coverUrl = coverUrl.replace("-large", "-small");
		var text = '<a class="item" title="[' + htmlfilter(t.user.username) + '] ' +
				htmlfilter(t.title) + '" href="#"><div class="image track" style="background-image:url(' + coverUrl + ');"></div></a>';
		append(text,function() {
			displayTrack(t);
		});
	};
	var writeUser = function(u) {
		switch(displayMode) {
		    default: //GRID by default
		        var avatarUrl = u.avatar_url.replace("-large","-small");
				var text = '<a class="item" title="' + htmlfilter(u.username) + '" href="#"><div class="image user" style="background-image:url(' + avatarUrl + ');"></div></a>';
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
	for (var i = 0; i < items.length; i++) {
	    writeItem(items[i]);
	}
	console.log(items.length);
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
	    new FetchRequest("/users/" + u.id + "/followings/", {}, function (items) { writeItems(items)});
	});
}

function tr(a,b) {
	return "<tr><td>" + a + "</td><td>" + b + "</td></tr>";
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