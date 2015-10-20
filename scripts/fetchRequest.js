function FetchRequest(uri, uriData, onItemsFetched) {
    //Variables
    this.offset = 0;
    this.totalItems = 0;
    //Functions
    this.fetchPart = function () {
        //Store 'this' in variable to avoid fuckups
        var self = this;
        SC.get(uri,
            //Merge offset and limit with uri data
            $.extend(
                uriData,
                {
                    offset: this.offset,
                    limit: itemsPerRequest
                }
            ),
            function (output, error) { //Callback
                console.log(self);
                if (error !== null) {
                    //An error occoured, stop the fetching
                    setStatus("There was an error: " + error.message);
                    return;
                }
                //Retrieve the fetched items
                var fetchedItems = [];
                if (output.collection !== undefined) {
                    fetchedItems = output.collection;
                    console.log("Items found in 'collection'");
                } else {
                    fetchedItems = output;
                    console.log("Items found outside 'collection'");
                }
                self.totalItems += fetchedItems.length;

                //Perform callback with fetched items
                onItemsFetched(fetchedItems);

                //Check for no tracks / max items reached
                if (fetchedItems.length > 0 && self.offset < maxItems) {
                    //Tracks fetched - there are probably more left
                    setStatus("Fetched with offset " + self.offset);
                    self.offset += itemsPerRequest;
                    self.fetchPart();
                } else {
                    //No tracks fetched or max tracks reached - this is most likely the endpoint
                    setStatus("Done fetching (" + self.totalItems + " items found)");
                }
            }
        );
    }
    //Constructor
    setStatus("Fetching items from " + uri);
    this.fetchPart();
}