angular.module('attaConfig')
.controller('OnlineCtrl', ['$rootScope', '$scope', 'dbSvc', 'toaster', 'ngDialog', function($rootScope, $scope, dbSvc, toaster, ngDialog) {
	$scope.syncList = [];

	var getSyncList = function() {
		dbSvc.request('syncList', {}).then(function(result) {
			if (result.status===true) {
				$scope.syncList = result.sync_list;
			}
		});
	}

	var cur = 0;
	var syncOK = false;
	var requestUpload = function() {
		dbSvc.request('syncToCloud', {
			table_name:$scope.syncList[cur].table_name
		}).then(function(result) {
			if (result.status===true) {
				$scope.syncList[cur].cnt = result.cnt;
				$scope.syncList[cur].total = result.total;
			} else {
				syncOK = false;
			}
			if (cur < $scope.syncList.length-1) {
				cur++;
				requestUpload();
			} else {
				if (!syncOK) {
					toaster.pop('warning', '', 'อัพโหลดข้อมูลไม่ครบ\nยังไม่สามารถออนไลน์ได้');
					return;
				}
				toaster.pop('success', '', 'อัพโหลดข้อมูลเรียบร้อยแล้ว');
				// TODO: go online
				$scope.message = 'ต้องการ online หรือไม่';
				$scope.positiveButton = 'Online';
				$scope.negativeButton = 'ยกเลิก';
				$scope.positiveResponse = function() {
					requestOnline();
				};
				$scope.negativeResponse = function(){
					
				}
				ngDialog.open({
					template: 'views/confirm.html',
					controller: 'ConfirmDialogCtrl',
					className: 'ngdialog-theme-default ngdialog-theme-custom',
					scope:$scope,
				});
			}
		});
	}
	var requestOnline = function() {
		dbSvc.request('online', {}).then(function(result) {
			if (result.status===true) {
				$rootScope.setting.isOffline=false;
				chrome.storage.local.set({setting:$rootScope.setting});
				toaster.pop('success', '', 'Online สำเร็จ');

				$scope.message = 'Online สำเร็จ กรุณาเข้าสู่ระบบใหม่อีกครั้ง';
				$scope.positiveButton = 'เข้าสู่ระบบใหม่';
				$scope.positiveResponse = function() {
					chrome.runtime.reload();
				};
				ngDialog.open({
						template: 'views/msgBox.html',
						controller: 'ConfirmDialogCtrl',
						className: 'ngdialog-theme-default ngdialog-theme-custom',
						scope:$scope,
				});
			} else {
				toaster.pop('warning', '', 'Online ไม่สำเร็จ กรุณลองใหม่อีกครั้ง');
			}
		});
	}

	$scope.goOnline = function() {
		cur = 0;
		syncOK = true;
		requestUpload();
	}

	getSyncList();
}]);