var nfcReader = (function() {
	var timer = null;
	var nfcDevice = null;
	var tagId = "";
	var maxCnt = 300;
	var reading=false;
	
	function getNfcDevice(cb) {
		if (nfcDevice != null) {
			cb(nfcDevice);
			return;
		}
		console.log('try to get device');
		chrome.nfc.findDevices(function(devices) {
			if (devices.length==0) {
				cb(null);
				return;
			}
			nfcDevice = devices[0];
			cb(nfcDevice);
		});
	}
	
	var startReader = function(cb) {
		reading=true;
		tagId="";
		startReading(cb);
	}
	
	var startReading = function(cb) {
		if (!reading) {	
			console.log('####################################');
			return;
		}
		console.log('startReader...');
		if (timer != null) {
			clearTimeout(timer);
			timer = null;
		}
		getNfcDevice(function(dev) {
			if (dev==null) {
				timer = setTimeout(function() {startReader(cb)},1000);
				return;
			}
			chrome.nfc.wait_for_tag(dev, 1000, function(tag_type, tag_id) {
				var retryIn = 0;
				
				if (tag_id != null) {
					var newTagId = UTIL_BytesToHex(new Uint8Array(tag_id));
					timer = setTimeout(function(){startReading(cb);},5000);
					//console.log(typeof tagId);
					if (tagId != newTagId) {
						tagId = newTagId;
						//console.log('run callback with', newTagId);
						cb(tag_type, newTagId);
					}
				} else {
					tagId = "";
					timer = setTimeout(function(){startReading(cb);},1000);
					cb(tag_type, "");
				}
			})
		});
	};
	
	var stopReader = function() {
		console.log('stopReader...');
		console.log('timer=', timer);
		reading=false;
		if (timer != null) {
			clearTimeout(timer);
			timer=null;
		}
		dev_manager.close(nfcDevice);
		setTimeout(function() {
			//nfcDevice = null;
		},0);
	}

	return {
		startReader: startReader,
		stopReader: stopReader,
	}
})();

