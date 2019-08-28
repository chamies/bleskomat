const jsQR = require("jsqr");
var Jimp = require("jimp");
var RaspiCam = require("raspicam");

try {

    var opts = {
	"mode": "timelapse",
	"output": "image_stream.jpg",
	"width": 640,
	"height": 480,
	"timeout": 999999999,
	"timelapse": 250,
    };
    var camera = new RaspiCam(opts);

    // start the recording
    camera.start();

    //listen for the "read" event triggered when each new photo/video is saved
    camera.on("read", function(err, timestamp, filename){ 
    	new Jimp.read(filename, function(err, image) {
    	    if (err) {
    		console.error(err);
    	    }

    	    const code = jsQR(image.bitmap.data, image.bitmap.width, image.bitmap.height);
	    
    	    if (code) {
    		console.log("Found QR code", code);
		camera.stop();
    	    }
    	});

    });

} catch (e){
    console.log("Couldn't start camera:", e)
}
