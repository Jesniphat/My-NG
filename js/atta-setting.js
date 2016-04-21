angular.module('attaConfig', [

]).controller('ConfigCtrl', ['$scope', '$rootScope', '$state', 'dbSvc', 'toaster', '$q', 'ngDialog', '$http',
		'sysConfig',
		function($scope, $rootScope, $state, dbSvc, toaster, $q, ngDialog, $http, sysConfig) {
	$scope.currentTab = 0;
	$scope.config = angular.copy($rootScope.config);
	$scope.printerDots = [];
	$scope.printerLasers = [];
	$scope.rfidList = [];
	$scope.printerDot = null;
	$scope.printerLaser = null;
	$scope.webServiceList = [
		{name:'Cloud Web Service', url:'http://122.155.3.216/rapidpass/client/api.php', dynamic:false},
		{name:'BKK Web Service', url:'http://192.168.171.254/rapidpass/client/api.php', dynamic:false} //,
//		{name:'BKK Web Service (VPN)', url:'http://192.168.172.10/rapidpass/client/api.php', dynamic:false},
	];
	$scope.reportServiceList = [
		{name:'Cloud Reporting Service', url:'http://122.155.3.216/rapidpass/client/report.php', dynamic:false},
		{name:'BKK Reporting Service', url:'http://192.168.171.254/rapidpass/client/report.php', dynamic:false} //,
//		{name:'BKK Reporting Service (VPN)', url:'http://192.168.172.10/rapidpass/client/report.php', dynamic:false},
	];
	$scope.cardReaderList = [];
	for (var i in $scope.webServiceList) {
		console.log($scope.webServiceList[i].url + ' == ' + $rootScope.setting.WS_URL);
		if ($scope.webServiceList[i].url == $rootScope.setting.WS_URL) {
			$scope.webService = $scope.webServiceList[i];
			console.log('FOUND');
			break;
		}
	}
	for (var i in $scope.reportServiceList) {
		if ($scope.reportServiceList[i].url == $rootScope.setting.RS_URL) {
			$scope.reportService = $scope.reportServiceList[i];
			break;
		}
	}


	// $rootScope.confirmToExit = function() {
	// 	var deferred = $q.defer();

	// 	if (!$scope.isUnchanged($scope.config)) {
			
	// 		$scope.message = 'ข้อมูลยังไม่ถูกบันทึก ต้องการออกจากหน้าจอนี้ใช่หรือไม่';
	// 		$scope.positiveButton = 'ใช่';
	// 		$scope.negativeButton = 'ไม่ใช่';
		
	// 		$scope.positiveResponse = function() {

	// 			deferred.resolve(true);
			
	// 		};
		
	// 		$scope.negativeResponse = function(){
			
	// 			deferred.resolve(false);
			
	// 		}
			
	// 		ngDialog.open({
	// 			template: 'views/confirm.html',
	// 			controller: 'ConfirmDialogCtrl',
	// 			className: 'ngdialog-theme-default ngdialog-theme-custom',
	// 			scope:$scope,
	// 		});
		
	// 	} else {
			
	// 		deferred.resolve(true);
		
	// 	}
		
	// 	return deferred.promise;
	// };

	var acl = ($rootScope.sessionStaff.acl_list).split(',');
	$scope.station_acl = function(){
    for (var i in acl) {
      if(acl[i] == 'station_setting'){
        return true;
      }
    };
    return false;
  }

	$scope.listRfidReader = function() {
		console.log('listRfidReader');
		$http.get($scope.data.RFID_URL + '/rfid/readers').then(function(response) {
			while ($scope.rfidList.length > 0) {
				$scope.rfidList.pop();
			}
			response.data.readers.forEach(function(item) {
				$scope.rfidList.push({name:item});
			});
		}, function(error) {
			toaster.pop('warning', '', 'ไม่สามารถเชื่อมต่อไปยัง RFID Reader Service ได้');
		});
	};

	$scope.listPrinter = function(type) {
			// getPrinter
		if ((type=='dot' && !$scope.data.printServerDot)
				|| (type=='laser' && !$scope.data.printServerLaser)) {
			return;
		}
		var url = '';
		if (type=='dot') {
			url = $scope.data.printServerDot;
		} else {
			url = $scope.data.printServerLaser;
		}

		$http.get(url + '/printer/list').then(function(response){
//		$http.get(url + '/printers').then(function(response){
			var printers = [];
			if (typeof response.data != 'undefined' && response.data.status === true) {
				printers = response.data.printers;
			} else {
				printers = response.data;
				if (!(printers instanceof Array)) {
					return;
				}
			}
			if (type=='dot') {
				while ($scope.printerDots.length > 0) {
					$scope.printerDots.pop();
				}
				printers.forEach(function(item) {
					$scope.printerDots.push(item);
				});
			} else {
				while ($scope.printerLasers.length > 0) {
					$scope.printerLasers.pop();
				}
				printers.forEach(function(item) {
					$scope.printerLasers.push(item);
				});
			}
		}, function(error) {
			toaster.pop('warning', '', 'ไม่สามารถเชื่อมต่อไปยัง Print Service ได้');
		});
	}
	

	$scope.switchTab = function(active) {
		$scope.currentTab = active;
	}

	$scope.selectPrinterDot = function() {
		$scope.data.printerDot = $scope.printerDot.name;
	}
	$scope.selectPrinterLaser = function() {
		$scope.data.printerLaser = $scope.printerLaser.name;
	}
	$scope.selectRfidReader = function() {
		console.log('***', $scope.rfidReader);
		$scope.data.RFID_READER = $scope.rfidReader.name;
	}


	$scope.saveConfig = function() {
		if (typeof $scope.webService === 'undefined' || typeof $scope.webService.url==='undefined') {
			toaster.pop('warning', '', 'กรุณาเลือก Web Service ก่อน');
			return;
		}
		if (typeof $scope.reportService === 'undefined' || typeof $scope.reportService.url==='undefined') {
			toaster.pop('warning', '', 'กรุณาเลือก Reporting Service ก่อน');
			return;
		}
		$rootScope.setting.code = $scope.data.code;
		$rootScope.setting.airport = $scope.data.airport;
		$rootScope.setting.name = $scope.data.name;

		$rootScope.setting.WS_URL = $scope.webService.url;
		$rootScope.setting.RS_URL = $scope.reportService.url;
		$rootScope.setting.webService = angular.copy($scope.webService);
		$rootScope.setting.reportService = angular.copy($scope.reportService);
		if ($rootScope.setting.webService.dynamic===true || $rootScope.setting.reportService.dynamic===true) {
			$rootScope.setting.useDDNS = true;
		} else {
			$rootScope.setting.useDDNS = false;
		}

		$rootScope.setting.printServerDot = $scope.data.printServerDot;
		$rootScope.setting.printServerLaser = $scope.data.printServerLaser;
		if ($scope.printerDot) {
			$rootScope.setting.printerDot = $scope.printerDot.name;
		}
		if ($scope.printerLaser) {
			$rootScope.setting.printerLaser = $scope.printerLaser.name;
		}
		// $rootScope.setting.printerDot = $scope.data.printerDot;
		// $rootScope.setting.printerLaser = $scope.data.printerLaser;
		$rootScope.setting.RFID_URL = $scope.data.RFID_URL;
		if ($scope.rfidReader) {
			$rootScope.setting.RFID_READER = $scope.rfidReader.name;
		}
		
		$rootScope.setting.isReceipt = $scope.data.isReceipt;
		$rootScope.setting.receipt_code = $scope.data.receipt_code;
		$rootScope.setting.inform_code = $scope.data.inform_code;
		$rootScope.setting.coupon_voucher_code = $scope.data.coupon_voucher_code;

		delete $rootScope.setting.printServer;
		console.log('setting=', $rootScope.setting);
		chrome.storage.local.set({
			setting:$rootScope.setting,
		}, function() {
			toaster.pop('success', '', 'บันทึกเรียบร้อยแล้ว');
			$rootScope.config = angular.copy($scope.config);
			if ($rootScope.setting.isOffline === true) {
				dbSvc.request('saveCode', {
					station_code: $rootScope.station.code,
					receipt: $scope.data.receipt_code,
					inform: $scope.data.inform_code,
					coupon_voucher: $scope.data.coupon_voucher_code,
				});
			}
		});
	};

	$scope.resetConfig = function() {

		$scope.config = angular.copy($rootScope.config);
		$scope.data = angular.copy($rootScope.setting);
		console.log('data=', $scope.data);
	}
	
	$scope.isUnchanged = function(config) {
		return angular.equals(config, $rootScope.config)
				&& angular.equals($scope.data, $rootScope.setting);	
	};
	
	$scope.resetConfig();

}]).controller('StaffListCtrl', function($scope, $state, dbSvc) {
	
	$scope.filtered = [];
	$scope.staffs = [];
  $scope.currentPage = 0;
  $scope.pageSize = 10;
  
  $scope.numberOfPages=function(){
  
    return Math.ceil($scope.filtered.length/$scope.pageSize);                
  
  }
	
	$scope.newStaff = function() {
	
		$state.go('home.staff_edit',{uuid:''});
	
	}
	dbSvc.request('staffList', {}).then(function(result) {
		if (result.status===false) {
			toaster.pop('warning', '', result.reason);
			return;
		}
		$scope.staffs = angular.copy(result.staffs);
	});
	// dbSvc.getTable('staff').then(function(staffs) {
	
	// 	$scope.staffs = staffs;
	
	// });
}).controller('StaffEditCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$q', 'dbSvc', 'helper', 'toaster', 'ngDialog', function($scope, $rootScope, $state, $stateParams, $q, dbSvc, helper, toaster, ngDialog) {
	$scope.name = 'TEST';
	$scope.chkCount = 0;
	/*
	$scope.ACLs = [
		{key:'staff',name:'จัดการผู้ใช้งาน',chk:true,group:0},
		{key:'config',name:'ข้อมูลพื้นฐาน',group:0},
		{key:'freelance',name:'ข้อมูลฟรีแลนซ์',group:0},
		{key:'member',name:'ข้อมูลสมาชิก',group:0},
		{key:'card_issue',name:'ออกบัตรใหม่',group:1},
		{key:'card_topup',name:'เติมเงิน',group:1},
		{key:'card_adjust',name:'ปรับเพิ่ม',group:1},
		{key:'receipt',name:'ใบเสร็จ',group:2},
		{key:'invoice',name:'ใบแจ้งหนี้',group:2},
		{key:'invoice_reissue',name:'Re-issue Invoice',group:2},
		{key:'inform',name:'เคาน์เตอร์รับแจ้ง',group:3},
		{key:'buscall',name:'เคาน์เตอร์เรียกรถ',group:3},
		{key:'parking',name:'ลานจอด',group:3},
		{key:'report_aot',name:'รายงานการเงิน',group:3},
		{key:'report_all',name:'รายงานและสถิติ',group:3},
	];
	*/
	$scope.ACLs = [
		{key:'inform',name:'รับแจ้ง',group:0},
		{key:'inform_list',name:'ใบรับแจ้ง',group:0},
		{key:'inform_onestop',name:'รับแจ้ง One Stop', group:0},
		{key:'card_coupon',name:'ใช้คูปอง', group:0},
		{key:'card_user',name:'ชำระเงิน',group:0},
		{key:'card_history',name:'ประวัติบัตร',group:0},
		{key:'period_close_inform',name:'ปิดผลัด',group:0},

		{key:'card_issue',name:'ออกบัตรใหม่',group:1},
		{key:'card_topup',name:'เติมเงิน',group:1},
		{key:'receipt_new',name:'ใบเสร็จรับเงิน(เคาน์เตอร์)',group:1},
		{key:'card_adjust_plus',name:'แก้ไข (เพิ่ม) PAX',group:1},
		{key:'card_adjust_minus',name:'แก้ไข (ลด) PAX',group:1},
		{key:'card_cancel',name:'ยกเลิกบัตร',group:1},

		{key:'invoice',name:'ใบแจ้งหนี้', group:2},
		{key:'re_invoice',name:'แก้ไขใบแจ้งหนี้', group:2},
		{key:'re_print_invoice',name:'พิมพ์ใบแจ้งหนี้',group:2},
		{key:'receipt',name:'ใบเสร็จรับเงิน',group:2},
		{key:'product',name:'สินค้า',group:2},
		{key:'period_close',name:'ปิดผลัด',group:2},

		{key:'checkin',name:'เช็คอินรถ',group:3},
		{key:'buscall',name:'เรียกรถ',group:3},
		{key:'parking',name:'ลานจอด',group:3},

		{key:'accounting_post',name:'โพสต์บัญชี',group:4},

		{key:'member_report',name:'สมาชิก',group:5},
		{key:'accounting_report',name:'การเงิน',group:5},
		{key:'statistic_report',name:'สถิติ',group:5},
		{key:'period_close_report',name:'รายงานปิดผลัด',group:5},
		{key:'statistic_dmy',name:'รายงานสถิติรายวัน/เดือน/ปี',group:5},
		{key:'statistic_info',name:'รายงาน info',group:5},
		{key:'statistic_sport_check',name:'รายงาน sport check',group:5},

		{key:'config',name:'ตั้งค่าระบบ',group:6},
		{key:'staff',name:'ผู้ใช้ระบบ',group:6},
		{key:'station_setting',name:'ตั้งค่าเครื่อง',group:6},
		{key:'member',name:'ข้อมูลสมาชิก',group:6},
		{key:'freelance',name:'ข้อมูลฟรีแลนซ์',group:6},
	];
	$scope.master = {
		uuid:'',
		user:'',
		pass:'',
		fullname:'',
		department:'',
		card:'',
		status:true,
		sync:0,
		acl:{},
	};
	$scope.masterAcl = {};

	$scope.staff = angular.copy($scope.master);
	$scope.staffAcl = {};
	
	if ($stateParams.uuid != '0' && $stateParams.uuid != '') {
		dbSvc.request('staffByUuid',{uuid:$stateParams.uuid}).then(function(result) {
			$scope.master = angular.copy(result.staff);
			$scope.resetStaff();
		})
		// dbSvc.getByKey('staff', $stateParams.uuid).then(function(staff) {
		// 	if (staff != null) {
		// 		$scope.master = staff;
		// 		$scope.resetStaff();
		// 	}
		// });
	}

	$scope.toggleCheckAll = function() {
		var newValue = !$scope.allChecked();
		angular.forEach($scope.ACLs, function(item) {
			$scope.staffAcl[item.key] = newValue;
		});
	};
	$scope.allChecked = function(acl) {
		var isAll = true;
		for(var i in $scope.ACLs) {
			var item = $scope.ACLs[i];
			if (typeof $scope.staffAcl[item.key]=='undefined' || !$scope.staffAcl[item.key]) {
				isAll = false;
				break;
			}
		}
		return isAll;
	};

	$scope.toggleCheckInformAll = function(){
		var newValue = !$scope.allInformChecked();
		angular.forEach($scope.ACLs, function(item) {
			if(item.group==0){
				$scope.staffAcl[item.key] = newValue;
			}
		});
	}
	$scope.allInformChecked = function(acl) {
		var isAll = true;
		for(var i in $scope.ACLs) {
			var item = $scope.ACLs[i];
			if(item.group == 0){
				if(typeof $scope.staffAcl[item.key]=='undefined' || !$scope.staffAcl[item.key]) {
					isAll = false;
					break;
				}
			}
		}
		return isAll;
	};

	$scope.toggleCheckCardUseAll = function(){
		var newValue = !$scope.allCardUseChecked();
		angular.forEach($scope.ACLs, function(item) {
			if(item.group==1){
				$scope.staffAcl[item.key] = newValue;
			}
		});
	};
	$scope.allCardUseChecked = function(acl) {
		var isAll = true;
		for(var i in $scope.ACLs) {
			var item = $scope.ACLs[i];
			if(item.group == 1){
				if(typeof $scope.staffAcl[item.key]=='undefined' || !$scope.staffAcl[item.key]) {
					isAll = false;
					break;
				}
			}
		}
		return isAll;
	};

	$scope.toggleCheckFinanceAll = function(){
		var newValue = !$scope.allFinanceChecked();
		angular.forEach($scope.ACLs, function(item) {
			if(item.group==2){
				$scope.staffAcl[item.key] = newValue;
			}
		});
	};
	$scope.allFinanceChecked = function(acl){
		var isAll = true;
		for(var i in $scope.ACLs) {
			var item = $scope.ACLs[i];
			if(item.group == 2){
				if(typeof $scope.staffAcl[item.key]=='undefined' || !$scope.staffAcl[item.key]) {
					isAll = false;
					break;
				}
			}
		}
		return isAll;
	};

	$scope.toggleCheckBusscallAll = function(){
		var newValue = !$scope.allBuscallChecked();
		angular.forEach($scope.ACLs, function(item) {
			if(item.group==3){
				$scope.staffAcl[item.key] = newValue;
			}
		});
	};
	$scope.allBuscallChecked = function(acl){
		var isAll = true;
		for(var i in $scope.ACLs) {
			var item = $scope.ACLs[i];
			if(item.group == 3){
				if(typeof $scope.staffAcl[item.key]=='undefined' || !$scope.staffAcl[item.key]) {
					isAll = false;
					break;
				}
			}
		}
		return isAll;
	};

	$scope.toggleCheckReportAll = function(){
		var newValue = !$scope.allReportChecked();
		angular.forEach($scope.ACLs, function(item) {
			if(item.group==5){
				$scope.staffAcl[item.key] = newValue;
			}
		});
	};
	$scope.allReportChecked = function(acl){ 
		var isAll = true;
		for(var i in $scope.ACLs) {
			var item = $scope.ACLs[i];
			if(item.group == 5){
				if(typeof $scope.staffAcl[item.key]=='undefined' || !$scope.staffAcl[item.key]) {
					isAll = false;
					break;
				}
			}
		}
		return isAll;
	}

	$scope.toggleCheckSettingAll = function(){
		var newValue = !$scope.allSettingChecked();
		angular.forEach($scope.ACLs, function(item) {
			if(item.group==6){
				$scope.staffAcl[item.key] = newValue;
			}
		});
	};
	$scope.allSettingChecked = function(acl){
		var isAll = true;
		for(var i in $scope.ACLs) {
			var item = $scope.ACLs[i];
			if(item.group == 6){
				if(typeof $scope.staffAcl[item.key]=='undefined' || !$scope.staffAcl[item.key]) {
					isAll = false;
					break;
				}
			}
		}
		return isAll;
	}


	$scope.saveStaff = function(isValid) {
		$scope.staff.sync = 0;
		
		$scope.staff.acl = [];
		angular.forEach($scope.staffAcl, function(item, key){
			if (item) {
				$scope.staff.acl.push(key);
			}
		});
		if ($scope.staff.pass != $scope.master.pass) {
			$scope.staff.pass = helper.md5(ATTA_KEY + $scope.staff.pass);
		}
		$scope.staff.acl_list = $scope.staff.acl.join(',');
		
		dbSvc.request('staffSave', $scope.staff).then(function(result) {
			if (result.status===true) {
				toaster.pop('success', '', 'บันทึกเรียบร้อยแล้ว');
				$scope.staff.uuid = result.uuid;
				$scope.master = angular.copy($scope.staff);
				$scope.masterAcl = angular.copy($scope.staffAcl);	
			} else {
				toaster.pop('warning', '', result.reason);
			}		
		});
	}
	$rootScope.confirmToExit = function() {
		var deferred = $q.defer();
		if (!$scope.isUnchanged($scope.staff)) {
			$scope.message = 'ข้อมูลยังไม่ถูกบันทึก ต้องการออกจากหน้าจอนี้ใช่หรือไม่';
			$scope.positiveButton = 'ใช่';
			$scope.negativeButton = 'ไม่ใช่';
			$scope.positiveResponse = function() {
				deferred.resolve(true);
			};
			$scope.negativeResponse = function(){
				deferred.resolve(false);
			}
			ngDialog.open({
				template: 'views/confirm.html',
				controller: 'ConfirmDialogCtrl',
				className: 'ngdialog-theme-default ngdialog-theme-custom',
				scope:$scope,
			});
		} else {
			deferred.resolve(true);
		}
		return deferred.promise;
	};

	$scope.isUnchanged = function() {
		return angular.equals($scope.staff, $scope.master)
			&& angular.equals($scope.staffAcl, $scope.masterAcl);
	};

	$scope.resetStaff = function() {
		$scope.staff = angular.copy($scope.master);
		
		$scope.staffAcl = {};
		console.log($scope.staff.acl);
		angular.forEach($scope.staff.acl, function(item){
			console.log(item);
			$scope.staffAcl[item] = true;
		});
		$scope.masterAcl = angular.copy($scope.staffAcl);
		
		$scope.$broadcast('formReady');
	}
	$scope.goBack = function() {
		$rootScope.confirmToExit().then(function(result) {
			if (result) {
				$rootScope.confirmToExit = undefined;
				$state.go('home.staff');
			}
		});
	}
}]).controller('serverSetting', ['$scope', '$rootScope', '$state', '$stateParams', '$q', 'dbSvc', 'helper', 'toaster', 'ngDialog', 
function($scope, $rootScope, $state, $stateParams, $q, dbSvc, helper, toaster, ngDialog) {
	console.log("start serverSetting");
	$scope.webServiceList = [
		{name:'Cloud Web Service', url:'DMK', dynamic:false},
		{name:'BKK Web Service', url:'BKK', dynamic:false}
	];
	$scope.saveConfig = function() {
		if (typeof $scope.webService === 'undefined' || typeof $scope.webService.url==='undefined') {
			toaster.pop('warning', '', 'กรุณาเลือก Web Service ก่อน');
			return;
		}
		console.log("xxx = ", $scope.webService.url);
		dbSvc.request('selectServerDown', {server: $scope.webService.url}).then(function(result) {
			if (result.status===true) {
				console.log(result);
				toaster.pop('success', '', 'Change Server Complete');
			}else{
				console.log(result);
				toaster.pop('warning', '', 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
			}
		});
	}
}]);
