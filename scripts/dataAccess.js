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


/*
	DATA ACCESS: Contains everything that interacts with the Souncloud API
*/

//Having the dataAccess as a prototype doesn't really serve any function
//However it guarantees that the SC API has been initialized before use
function dataAccess(client_id,redirect_uri) {
	//Constructor
	SC.initialize({
		client_id: client_id,
		redirect_uri: redirect_uri
	});
	//Methods
	this.fetch = function(uri,uriData,itemsPerRequest,maxItems,onProgress,onDone) {
		//
		var tempItems = []; //Varaible to store items in while loading them
		fetchPart = function(offset) {
			SC.get(uri, $.extend(uriData, {
				offset: offset,
				limit: itemsPerRequest
			}),function(output,error) {
				var fetchedItems = [];
				if (output.collection !== undefined) {
					fetchedItems = output.collection;
				} else {
					fetchedItems = output;
				}
				tempItems.push.apply(tempItems,fetchedItems);
				if (fetchedItems.length > 0 && offset < maxItems) {
					//Tracks fetched - there are probably more left
					onProgress(offset);
					fetchPart(offset + itemsPerRequest);
				} else {
					//No tracks fetched or max tracks reached - this is most likely the endpoint
					onDone(tempItems);
				}
			});
		};
		fetchPart(0); //Start a recursive function that fetches stuff
	};
	
}