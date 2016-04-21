chrome.app.runtime.onLaunched.addListener(function() {
	chrome.app.window.create('index.html', {
		id: 'ATTACard_RapidPass',
		bounds: {
			'width': 1024,
			'height': 640,
		},
		state: 'maximized',
		resizable: true,
/*		alwaysOnTop: false, */
	});
});

/*
var nfcDevice = null;
var getNFC = function(cb) {
	if (nfcDevice != null) {
		cb(nfcDevice);
		return;
	}
	chrome.nfc.findDevices(function(devices) {
		if (devices.length==0) {
			console.log('XXX Device not found');
			cb(null);
			return;
		}
		nfcDevice = devices[0];
		cb(nfcDevice);
	});
}
*/




