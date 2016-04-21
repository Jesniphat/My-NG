angular.module('attaDb', [

]).service('dbSvc', ['$rootScope', '$window', '$q', 'helper', '$filter', '$http', 'globalMessage',
		function($rootScope, $window, $q, helper, $filter, $http, globalMessage){


	var syncStatus = true;
	var pingTimer = null;
	var ping = function() {
		if ($rootScope.setting.isOffline===true) {
			if (pingTimer != null) {
				clearInterval(pingTimer);
				pingTimer = null;
			}
			return;
		}
		$http.post($rootScope.setting.WS_URL + '/ping', {}).then(function(response) {
			if (response.data.status===true) {
				if (pingTimer != null) {
					clearInterval(pingTimer);
					pingTimer = null;
				}
				globalMessage.showMessage('เชื่อมต่ออินเตอร์เน็ตสำเร็จ...', '#ccffcc');
				syncStatus=true;
				setTimeout(function() {
					if (syncStatus) {
						globalMessage.hideMessage();
					}
				}, 3000);
			}
		}, function(err) {

		});
	}

  var request = function(action, param, apiUrl) {
    var deferred = $q.defer();
    var url;

    if (typeof apiUrl==='string') {
      url = apiUrl;
    } else {
      url = $rootScope.setting.isOffline===true ? $rootScope.setting.WS_LOCAL_URL : $rootScope.setting.WS_URL;
    }

    $http.post(url + '/' + action, param).then(function(response) {
//      console.log('data=', response.data);
      if (response.data.session===false) {
      	console.log('SESSION TIMEOUT');
      	// TODO: relogin
		globalMessage.showMessage('คำเตือน: ขาดการติดต่อกับเซิร์ฟเวอร์เกินระยะเวลาที่กำหนด กรุณา เข้าสู่ระบบใหม่', '#ffcccc');
    	deferred.reject(false);
    	return;
      }
      if (typeof response.data.period !== 'undefined') {
      	console.log('PERIOD UPDATE');
      	$rootScope.period = angular.copy(response.data.period);
      }
      deferred.resolve(response.data);
    }, function(e) {
    	if (syncStatus===true) {
			globalMessage.showMessage('คำเตือน: ขณะนี้ไม่สามารถเชื่อมต่ออินเตอร์เน็ตได้', '#ffcccc');
	    	pingTimer = setInterval(ping, 3000);
			syncStatus = false;
    	}
      deferred.reject(false);
    });
    
    return deferred.promise;
  }

	this.request = request;
}]);