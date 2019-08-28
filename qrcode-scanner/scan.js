const fs = require('fs');
var QrCode = require('qrcode-reader');
var Jimp = require('jimp');

var buffer = fs.readFileSync(__dirname + '/image.png');
// console.log(buffer);


Jimp.read(buffer, function(err, image) {
    if (err) {
        console.error(err);
        // TODO handle error
    }
    var qr = new QrCode();
    qr.callback = function(err, value) {
        if (err) {
            console.error(err);
            // TODO handle error
        }
	if (value) {
            console.log(value.result);
            // console.log(value);
	}
    };
    // console.log(image.bitmap)
    qr.decode(image.bitmap);
});
