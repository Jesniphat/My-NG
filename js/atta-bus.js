angular.module('attaBus',[])
.controller('CheckInCtrl', ['$scope', function($scope) {
  $scope.openCheckIn = function() {
    chrome.app.window.create('views/checkin_fullscreen.html?airport=DMK', {
      id: "checkInWindow",
      state: "fullscreen",
    });
  };
}]).controller('CheckInFullScreenCtrl', ['$scope','dbSvc','helper','$filter','$rootScope','ngDialog', '$stateParams', 'toaster', '$timeout', '$q', '$http',
  function($scope,dbSvc,helper,$filter,$rootScope,ngDialog, $stateParams, toaster, $timeout, $q, $http) {
  chrome.storage.local.get('setting', function(result) {
    $rootScope.setting = angular.copy(result.setting);
    console.log('setting=', $rootScope.setting);

    var limit = 15;
    // TODO:
    console.log($rootScope.setting.airport);
    var airport = $rootScope.setting.airport;
    $scope.license = '';
    $scope.message = '';
    $scope.licenseList = [];
    $scope.status = true;
    var timer = null;

    var showMessage = function(msg, delay) {
      if (timer != null) {
        $timeout.cancel(timer);
      }
      $scope.message = msg;
      angular.element('#msg').css({opacity:1});
      timer = $timeout(function() {
        angular.element('#msg').css({opacity:0});
      }, delay);
    }

    $scope.keyPress = function(form, event) {
      if (event.charCode != 13) {
        return;
      }
      if (!form.$valid) {
        $scope.status = false;
        showMessage('ทะเบียนรถไม่ถูกต้องค่ะ', 3000);
        $timeout(function() {
          angular.element('#license').focus();
          angular.element('#license').select();
        }, 0);
        return;
      }
      var data = {
        uuid:helper.newUUID(),
        airport:airport,
        license:$scope.license,
        tx_date:$filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        status:0,
        sync:0,
      };
      console.log(data);
      dbSvc.request('saveListCheckIn', data).then(function(result) {
          if (result.status===true) {
            //addLicense({time:data.tx_date.substr(11,5),license:data.license});
            showMessage('ทะเบียน ' + data.license + ' บันทึกเรียบร้อยแล้ว', 3000);
            $timeout(function() {
              $scope.license = '';
              angular.element('#license').focus();
            });
            loadLicense();
          } else {
            showMessage(result.reason, 3000);
          }
        });
    }
    var addLicense = function(license) {
      $scope.licenseList.unshift(license);
      if ($scope.licenseList.length > limit) {
        $scope.licenseList.pop();
      }
    }

    var loadLicense = function(){
      dbSvc.request('buscallListCheckIn', {airport:airport,limit:limit}).then(function(result) {
          var date = new Date();
          timer = $timeout(function() {
            loadLicense();
          }, 5000);

          if (result.status===true) {
            $scope.licenseList=[];
            result.dataCheckeIn.forEach(function(row, i) {
              $scope.licenseList.push(row);
            });
          } else {
            toaster.pop('warning', '', result.reason);
          }
        });
    }
    loadLicense();
  });
}]).controller('BusCallCtrl', ['$scope','dbSvc','helper','$filter','$rootScope','ngDialog', '$stateParams', 'toaster', '$timeout', '$q', '$http',
    function($scope,dbSvc,helper,$filter,$rootScope,ngDialog, $stateParams, toaster, $timeout, $q, $http) {
  var timer = null;
  var airport = $rootScope.setting.airport;
  var before = {};
  $scope.busListTemp = [];

  $scope.filterList = [
    {type:'DONE',name:'ข้อมูลย้อนหลัง'},
    {type:'TERMINAL',name:'ลานจอด'},
  ];
  if ($stateParams.location=='OFFICE') {
    $scope.filterList.push({type:'OFFICE',name:'รอเรียก'});
  }
  $scope.location = $stateParams.location;
  $scope.filter = $scope.filterList[$scope.filterList.length-1];
  $scope.keyword = '';
  $scope.pageSize = 80;
  $scope.callList = [];
  $scope.playAudio = $rootScope.setting.playAudio || false;
  $scope.playAlarm = $rootScope.setting.playAlarm || false;
  $scope.playAudio1 = $rootScope.setting.playAudio1 || false;
  $scope.playAlarm1 = $rootScope.setting.playAlarm1 || false;
  var keyMap = {};

  $rootScope.confirmToExit = function() {
    var deferred = $q.defer();

    if (timer != null) {
      console.log('CANCEL TIMER');
      $timeout.cancel(timer);
    }

    deferred.resolve(true);
    $rootScope.confirmToExit = undefined;
    return deferred.promise;
  };
  $scope.updatePlayAudio = function() {
    $rootScope.setting.playAudio = $scope.playAudio;
    chrome.storage.local.set({setting:$rootScope.setting});
  };
  $scope.updatePlayAlarm = function() {
    $rootScope.setting.playAlarm = $scope.playAlarm;
    chrome.storage.local.set({setting:$rootScope.setting});
  };

 $scope.updatePlayAudio1 = function() {
   $rootScope.setting.playAudio1 = $scope.playAudio1;
   chrome.storage.local.set({setting:$rootScope.setting});
 };
 $scope.updatePlayAlarm1 = function() {
   $rootScope.setting.playAlarm1 = $scope.playAlarm1;
   chrome.storage.local.set({setting:$rootScope.setting});
 };

 Array.prototype.exists = function( SearchFor )
 {
   for (var jj = 0; jj < this.length; jj++)
   {
     if (this[jj] == SearchFor) return true  ;
   }

   return false ;
 };

  $scope.refreshCallList = function() {
    var status;
    if (timer != null) {
      $timeout.cancel(timer);
    }

    if ($scope.filter.type=='DONE' || $scope.filter.type=='CANCEL') {
      status = [$scope.filter.type];
    } else {
      if ($scope.filter.type=='OFFICE') {
        status = ['WAIT'];
      } else {
        status = ['READY','CALL'];
      }
    }

    dbSvc.request('buscallList', {airport:airport,status:status}).then(function(result) {
      var date = new Date();
      timer = $timeout(function() {
        $scope.refreshCallList();
      }, 5000);

      if (result.status===true) { //console.log(result.buscall);
        $scope.callList = [];
        $scope.busFligthList = [];
        foundNew = false;
        result.buscall.forEach(function(row, i) {
  //        waiting, landing, ready, callReady, called, done
          if (status=='DONE' || status=='CANCEL') {
            row.flight_time = $filter('date')(new Date(row.flight_landing), 'ddMMMyy HH:mm:ss').toUpperCase();
          } else {
            row.flight_time = row.flight_landing.substr(11,5);
          }
          if (row.status == 'DONE' || row.status == 'CANCEL') {
              row.className = 'done';
          } else if (row.status=='CALL') {
              row.className = 'called';
          } else if (row.status=='READY') {
              row.className = 'callReady';
          } else if (row.is_landing=='YES' && $filter('date')(date, 'yyyy-MM-dd HH:mm:ss') > helper.dateAdd(row.flight_landing, 30*60*1000)) {
              row.className = 'ready';
          } else if (row.is_landing=='YES') {
              row.className = 'landing';

              if(!($scope.busListTemp.exists(row.id))){
                  console.log(row.id+" ไม่มีใน "+$scope.busListTemp);
                        if($rootScope.setting.playAlarm1==true) {
                          console.log('PLAY NOTIFY');
                          var audio = angular.element('#audio2').get(0);
                          audio.addEventListener('canplaythrough', function() {
                            audio.play();
                          });
                          audio.src = 'audio/notify.ogg';
                          audio.load();
                        }
                }
                else{
                  //console.log(row.id+" มีใน "+$scope.busListTemp);
                }
                $scope.busFligthList.push(row.id);
          } else {
              row.className = 'waiting';
          }
          if (row.status=='WAIT') {
            row.buttonText = 'รอเรียก';
          } else if (row.status == 'READY' || row.status=='CALL') {
            if (row.num_call == 0) {
              row.buttonText = 'เรียกรถ';
            } else {
              row.buttonText = '<span class="numcall">' + row.num_call + '</span>';
            }
          } else {
            row.buttonText = 'ยกเลิก';
          }
          if (typeof row.ready_time==='undefined') {
            row.ready_time = '0000-00-00 00:00:00';
          }
          if ($scope.filter.type=='TERMINAL' && $stateParams.location != 'OFFICE') {
            if(typeof before[row.uuid]==='undefined'){
              foundNew = true;
              before[row.uuid] = true;
            }
          }
          $scope.callList.push(row);
        });
        if(foundNew && $rootScope.setting.playAlarm===true) {
          console.log('PLAY NOTIFY');
          var audio = angular.element('#audio2').get(0);
          audio.addEventListener('canplaythrough', function() {
            audio.play();
          });
          audio.src = 'audio/notify.ogg';
          audio.load();
        }
      } else {
        toaster.pop('warning', '', result.reason);
      }
      $scope.busListTemp = $scope.busFligthList;
    });
    return;
  };

  $scope.refreshCallList();

  var updateCallStatus = function(item, status) {

    dbSvc.request('buscallUpdate', {uuid:item.uuid, status:status}).then(function(result) {
      if (result.status===true) {
        $scope.refreshCallList();
      }
    });
    return;
  };

  // var callBus = function(item) {

  //   dbSvc.request('callbus', {code:item.code}).then(function(result) {
  //     if (result.status===true) {
  //       $scope.refreshCallList();
  //     }
  //   });
  //   return;

  //   var txDate = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
  //   dbSvc.getByKey('buscall', item.uuid).then(function(buscall) {
  //     if (buscall.num_call==0) {
  //       buscall.call_time = txDate;
  //     }
  //     buscall.num_call++;
  //     buscall.sync = 0;
  //     return dbSvc.saveData('buscall', buscall);
  //   }).then(function(buscall) {
  //     var callqueue = {
  //       uuid:helper.newUUID(),
  //       airport:airport,
  //       ref_uuid:buscall.uuid,
  //       staff_uuid:$rootScope.sessionStaff.uuid,
  //       license:buscall.license,
  //       call_num:buscall.num_call ,
  //       tx_date:txDate,
  //       call_time:'0000-00-00 00:00:00',
  //       status:0,
  //       sync:0,
  //     };
  //     return dbSvc.saveData('callqueue', callqueue);
  //   }).then(function(result) {
  //     $scope.refreshCallList();
  //   });
  // }

  $scope.callClick = function(item) {

    if (item.status=='WAIT') {
      if (item.is_landing=='NO') {
        $scope.message = 'เครื่องยังไม่ลงจอด ยังต้องการเรียกรถอยู่หรือไม่';
        $scope.positiveButton = 'เรียกเลย';
        $scope.negativeButton = 'ยังไม่เรียก';
        $scope.positiveResponse = function() {
          updateCallStatus(item, 'READY');
        };
        $scope.negativeResponse = function(){
          return false;
        };
        ngDialog.open({
          template: 'views/confirm.html',
          controller: 'ConfirmDialogCtrl',
          className: 'ngdialog-theme-default ngdialog-theme-custom',
          scope:$scope,
        });
        return;
      }
      updateCallStatus(item, 'READY');
    } else if (item.status=='READY' || item.status=='CALL') {
      dbSvc.request('callqueueAdd', {code:item.code,license:item.license}).then(function(result) {
        if (result.status === true) {
          if (result.hasCallQueue) {
            toaster.pop('warning', '', 'อยู่ในรายการรอเรียกแล้ว');
            return;
          }
          $scope.refreshCallList();
        } else {
          toaster.pop('warning', '', result.reason);
        }
      });
    } else {
      $scope.message = 'ต้องการส่งรายการนี้กลับไปคิวเรียกหรือไม่';
      $scope.positiveButton = 'ส่งรายการย้อนกลับ';
      $scope.negativeButton = 'ไม่ส่ง';
      $scope.positiveResponse = function() {
        updateCallStatus(item, 'CALL');
      };
      $scope.negativeResponse = function(){
        return false;
      };
      ngDialog.open({
        template: 'views/confirm.html',
        controller: 'ConfirmDialogCtrl',
        className: 'ngdialog-theme-default ngdialog-theme-custom',
        scope:$scope,
      });
      return;
    }
  };
  var doPrint = function(item) {
    console.log(item);
    var data = {
      uuid: helper.newUUID(),
      report: item.code.substr(5,2)=='SU' ? 'attapark_A4' : 'attapark_A5',
      param: {
        date: helper.thShortDate(item.done_time.substr(0, 10)),
        time: item.done_time.substr(11,5),
        flight: item.flight,
        license: item.license,
        member: item.name,
        inform_code: item.code+' '+item.ref_code
      },
      format: 'PDF',
      printer:$rootScope.setting.printerLaser,
      numCopy:1,
    };
    $http.post($rootScope.setting.printServerLaser + '/printer/submit', data).then(function(response) {
      console.log(response);
    });
  }
  var doCloseCall = function(item) {
    dbSvc.request('buscallClose', {code:item.code}).then(function(result) {
      if (result.status===true) {
        doPrint(result.buscall);
      } else {
        toaster.pop('warning', '', result.reason);
      }
    });
  }

  // var doCloseCall = function(item) {
  //   var txDate = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
  //   var buscall = angular.copy(item);
  //   buscall.close_time = txDate;
  //   buscall.call_status = 2;
  //   buscall.sync = 0;
  //   console.log('doCloseCall', buscall);
  //   dbSvc.getByKey('buscall', item.uuid).then(function(buscall) {
  //     buscall.close_time = txDate;
  //     buscall.call_status = 2;
  //     buscall.sync = 0;
  //     return dbSvc.saveData('buscall', buscall);
  //   }).then(function(buscall) {
  //     var range = IDBKeyRange.bound([airport, buscall.uuid, '0000-00-00 00:00:00']
  //         , [airport, buscall.uuid, '9999-99-99 99:99:99'], false, false);
  //     return dbSvc.getTableIndex('callqueue', 'ixCallQueueStatus', range, 'next');
  //   }).then(function(result) {
  //     var all = [];
  //     result.forEach(function(item) {
  //       item.status=1;
  //       item.sync=0;
  //       all.push(dbSvc.saveData('callqueue', item));
  //     });
  //     return $q.all(all);
  //   }).then(function(result) {
  //     console.log(result);
  //     return dbSvc.getByKey('inform', buscall.inform_uuid);
  //   }).then(function(inform) {
  //     console.log('inform=', inform);
  //     inform.is_done = 1;
  //     inform.sync = 0;
  //     return dbSvc.saveData('inform', inform);
  //   }).then(function(result) {
  //     doPrint(buscall);
  //     $scope.refreshCallList();
  //   });
  // }
  $scope.isValid = function() {

    if (($scope.location == 'OFFICE' && $scope.filter.type=='TERMINAL')) {
        return true;
    }

   if (($scope.location == 'OFFICE' && $scope.filter.name.trim()=='ข้อมูลย้อนหลัง')) {
       return true;
   }

   return false;

  };

  $scope.printClick = function(item) {
    console.log(item);
    if (parseInt(item.num_call)==0 || item.status=='READY') {
      $scope.message = 'ยังไม่กดเรียกรถ ต้องการพิมพ์ใบแอตต้าหรือไม่';
      $scope.positiveButton = 'พิมพ์เลย';
      $scope.negativeButton = 'ยังไม่พิมพ์';
      $scope.positiveResponse = function() {
        doCloseCall(item);
      };
      $scope.negativeResponse = function(){
        return false;
      };
      ngDialog.open({
        template: 'views/confirm.html',
        controller: 'ConfirmDialogCtrl',
        className: 'ngdialog-theme-default ngdialog-theme-custom',
        scope:$scope,
      });
      return;
    } else if (item.status=='CALL') {
      doCloseCall(item);
    } else if (item.status=='DONE') {
      // reprint
      doPrint(item);
    }

  };


  setTimeout(function() {
    var $table = $('.table-list');
    $table.floatThead({
        scrollContainer: function($table){
          return $table.closest('.wrapper');
      },
      headerCellSelector:'tr.header>th:visible',
    });
    $table.floatThead('reflow');
  },1000);
}]);
