var async = require('async');
var cv = require('opencv');
var jsQR = require('jsqr');
var Jimp = require('jimp');
var path = require('path')
var camera = new cv.VideoCapture(path.resolve('./video.h264')); // play a recorded video
var done = function(error, value) {
	if (error) {
		console.log(error);
		process.exit(1);
	}
	if (value) {
		console.log('Decoded QR code:', value);
	}
	process.exit();
};
async.forever(function(next) {
	console.time('camera.read');
	camera.read(function(error, image) {
		console.timeEnd('camera.read');
		if (error) return next(error);
		var size = image.size();
		var width = size[1];
		var height = size[0];
		console.time('image.manipulation');
		image.convertGrayscale();
		var buffer = image.toBuffer();
		console.timeEnd('image.manipulation');
		console.time('Jimp.read');
		Jimp.read(buffer, function(error, image) {
			console.timeEnd('Jimp.read');
			if (error) return next(error);
			console.time('jsQR');
			var result = jsQR(image.bitmap.data, image.bitmap.width, image.bitmap.height);
			console.timeEnd('jsQR');
			if (result) {
				return done(null, result.data);
			}
			// Continue...
			setTimeout(next, 10);
		});
	});
}, done);
