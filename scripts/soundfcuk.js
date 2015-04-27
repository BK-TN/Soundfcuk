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
				writeItems(tempItems);
			}
		});
	};
	fetchPart(0); //Start a recursive function that fetches stuff
}

function writeItems(items) {
	$(eOutput).html("");
	var i = 0;
	var interval = setInterval(function () {
		writeTrackAsGrid(items[i]);
		i++;
		if (i >= items.length) {
			clearInterval(interval);
		}
	}, 2);
	var writeTrackAsGrid = function(t) {
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
	};
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