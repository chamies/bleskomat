var cv = require('opencv');
// var QrCode = require('qrcode-reader');
const jsQR = require("jsqr");
var Jimp = require("jimp");

try {
    // var camera = new cv.VideoCapture(0);
    var path = require('path')
    var camera = new cv.VideoCapture(path.resolve("./video.h264")); // play a recorded video
    var window = new cv.NamedWindow('Video', 0)
    var qrstring = "";
    intervalTimer = setInterval(function() {
	camera.read(function(err, im) {
	    if (err) throw err;
	    console.log(im.size())
	    height = im.size()[0];
	    width  = im.size()[1];
	    if (width > 0 && height > 0){
                if (err) throw err;
		im.convertGrayscale();
                window.show(im);
		// TODO: find a way to stream it to the frontend

		Jimp.read(im.toBuffer(), function(err, image) {
		    if (err) {
			console.error(err);
			// TODO handle error
		    }

		    const code = jsQR(image.bitmap.data, image.bitmap.width, image.bitmap.height);
		    
		    if (code) {
			console.log("Found QR code", code);
			clearInterval(intervalTimer);
		    }
		});


		// Jimp.read(im.toBuffer(), function(err, image) {
		//     if (err) {
		// 	console.error(err);
		// 	// TODO handle error
		//     }
		//     var qr = new QrCode();
		//     qr.callback = function(err, value) {
		// 	if (err) {
		// 	    // console.error(err);
		// 	    // TODO handle error
		// 	}
		// 	if (value) {
		// 	    console.log(value.result);
		// 	    clearInterval(intervalTimer);
		// 	    qrstring = value.result;
		// 	}
		//     };
		//     // console.log(image.bitmap)
		//     qr.decode(image.bitmap);
		// });

	    }
	    window.blockingWaitKey(0, 50);
	});
    }, 20);
} catch (e){
    console.log("Couldn't start camera:", e)
}
