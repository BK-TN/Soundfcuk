var ctx;

var loading = new Image();
loading.src = "media/carlos.jpg";

var itemSize = 32;
var borderSize = 1;
var totalSize = itemSize + borderSize * 2;

$(document).ready(function () {
    ctx = $("#canvas")[0].getContext('2d');

    $(window).on("mousemove",function(e) {
        var rect = canvas.getBoundingClientRect();
        var mousePos = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        //console.log(mousePos);
    });

    /*var image = new Image();
    image.src = "duck.png";
    image.addEventListener("load",function () {
        ctx.drawImage(image, 0, 0);
    },false);*/
    
    setInterval(function () {
        ctx.canvas.width = $(ctx.canvas).parent().innerWidth();
        ctx.canvas.height = $(ctx.canvas).parent().innerHeight();

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        var items = coolTab.canvasItems;

        var rows = Math.floor(ctx.canvas.width / totalSize);

        var physicalIndex = 0;
        for (var i = 0; i < items.length; i++) {
            var targetPos = getItemPos(physicalIndex, rows, borderSize);

            if (isImageOk(items[i].image)) {
                items[i].pos = lerp2d(items[i].pos, targetPos, 0.6);
                ctx.drawImage(items[i].image, items[i].pos.x, items[i].pos.y, itemSize, itemSize);
                physicalIndex++;
            } else {
                items[i].pos = targetPos;
                //ctx.drawImage(loading, targetPos.x, targetPos.y, itemSize, itemSize);
            }
        }
    }, 1000 / 30);
});

function getItemPos(index, columns, bordersize) {
    var column = index % columns;
    var row = Math.floor(index / columns);
    return {
        x: bordersize + column * (32 + bordersize*2),
        y: bordersize + row * (32 + bordersize*2)
    }
}

function lerp2d(start, end, t) {
    if (start.x === end.x && start.y === end.y) {
        return end;
    }

    return {
        x: start.x + t * (end.x - start.x),
        y: start.y + t * (end.y - start.y)
    }
}

function CanvasItem(i) {
    if (i === undefined || i.kind === undefined) {
        return;
    };

    this.pos = {
        x:0,
        y:0
    };

    var imageUrl;
    switch (i.kind) {
        case "track":
            imageUrl = getTrackArt(i);
            break;
        case "user":
            imageUrl = getUserArt(i);
            break;
    }

    this.image = new Image();
    this.image.src = imageUrl;

    this.onClick = function () {
        console.log("click");
    }
}

function getTrackArt(t) {
    var coverUrl;
    if (t.artwork_url !== null) {
        coverUrl = t.artwork_url;
    } else {
        coverUrl = t.user.avatar_url;
    }
    return coverUrl.replace("-large", "-small");
}

function getUserArt(u) {
    return u.avatar_url.replace("-large", "-small");
}

function isImageOk(img) {
    // During the onload event, IE correctly identifies any images that
    // weren’t downloaded as not complete. Others should too. Gecko-based
    // browsers act like NS4 in that they report this incorrectly.
    if (!img.complete) {
        return false;
    }

    // However, they do have two very useful properties: naturalWidth and
    // naturalHeight. These give the true size of the image. If it failed
    // to load, either of these should be zero.

    if (typeof img.naturalWidth !== "undefined" && img.naturalWidth === 0) {
        return false;
    }

    // No other way of checking: assume it’s ok.
    return true;
}