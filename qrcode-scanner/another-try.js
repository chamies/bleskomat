console.log('Initializing...');
var async = require('async');
var jsQR = require('jsqr');
var QrCode = require('qrcode-reader');
var sharp = require('sharp');
var PiCameraConnect = require('pi-camera-connect');
var width = 1920;
var height = 1080;
var stillCamera = new PiCameraConnect.StillCamera({
	width: width,
	height: height,
	sensorMode: PiCameraConnect.SensorMode.Mode4,
});
var index = 0;
async.forever(function(next) {
	console.log('Taking image...')
	stillCamera.takeImage().then(function(buffer) {
		console.log('Transforming image buffer...');
		var extractOptions = {
			left: (width * .4) / 2,
			top: (height * .4) / 2,
			width: width * .6,
			height: height * .6,
		};
		console.log('extract', extractOptions);
		sharp(buffer)
			.extract(extractOptions)
			.grayscale()
			.modulate({
				brightness: 5,
			})
			.normalise()
			// .toFile('output' + (index++) + '.png').then(function() {next()}).catch(next);
			.png()
			// .ensureAlpha()
			.toBuffer({ resolveWithObject: true })
			.then(function(image) {
				console.log(arguments);
				console.log('Searching for QR code...');
				// var value = jsQR(image.data, image.info.width, image.info.height);
				var qr = new QrCode();
				qr.callback = function(error, value) {
					if (error) return next(error);
					if (value) {
						console.log('Found data!', code);
						process.exit(0);
					}
					// Continue the loop...
					next();
				};
				qr.decode({
					data: image.data,
					width: image.info.width,
					height: image.info.height,
				});
			}).catch(next);
	}).catch(next);
}, function(error) {
	console.log('ERROR', error);
	process.exit(1);
});

var decode = function(image) {
	var exec = require('child_process').exec;
	var path = require('path');
	var ZXingVersion = '3.4.0';
	var ZXingLocation = path.join(__dirname, 'zxing');
	var commandLineOptions = '';//' --try_harder';
	var jar = {
		javase: path.join(ZXingLocation, 'javase', 'javase-'+ZXingVersion+'.jar'),
		core: path.join(ZXingLocation, 'core', 'core-'+ZXingVersion+'.jar'),
	};
	var filePath = path.join(__dirname, 'video.h264');
	exec('java -cp '+jar.javase+';'+jar.core+' com.google.zxing.client.j2se.CommandLineRunner'+commandLineOptions+' '+filePath,
		function(error, stdout, stderr) {
			console.log(arguments);
			var qrcode = "";
			var errorCache = null;
			if (error) {
				console.log('ERROR', error);
			} else {
				var lines = stdout.split("\n");
				for(var i in lines) {
					if (lines[i] == 'Raw result:') {
						qrcode = lines[parseInt(i)+1];
						break;
					}
				}
			}
			console.log(qrcode);
		}
	);

}
