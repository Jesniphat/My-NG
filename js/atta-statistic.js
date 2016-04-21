angular.module('attaAccounting')

.controller('StatisticReportCtrl', ['$scope', '$rootScope', 'dbSvc', 'toaster', 'ngDialog','lovService','receiptPrintService','$state', function($scope, $rootScope, dbSvc, toaster, ngDialog,lovService,receiptPrintService,$state) {

  $scope.currentTab = 0;
  $scope.disablePButton = {'visibility': 'visible'};
  $scope.disableEButton = {'visibility': 'hidden'};
  $scope.typReportList = ['แยกตามสัญชาติ','แยกตามสมาชิก','สัญชาติ / สมาชิก','สมาชิก / สัญชาติ'];
  $scope.AirportList = ['BKK','DMK'];
  $scope.AirportListInfo = ['ALL','BKK','DMK'];

  $scope.typReportYearList = ['แยกตามสัญชาติ','แยกตามสมาชิก'];
  $scope.YearList = [];

  $scope.typReportMonthList = ['แยกตามสัญชาติ','แยกตามสมาชิก'];

  $scope.typeReport = 'แยกตามสัญชาติ';
  $scope.Airport = 'DMK';
  $scope.ReportName = '';

  $scope.typeReportMonth = 'แยกตามสัญชาติ';
  $scope.AirportMonth = 'DMK';

  $scope.typeReportYear = 'แยกตามสัญชาติ';
  $scope.AirportYear = 'DMK';
  $scope.SearchYear = {};

  $scope.param0 = {};
  $scope.param1 = {};
  $scope.param3 = {};
  $scope.param4 = {};

  $scope.infoStatus = [
    {value:'ALL',label:'ALL'},
    {value:'WAIT',label:'WAIT'},
    {value:'FINISH',label:'FINISH'},
    {value:'CANCEL',label:'CANCEL'},
  ];
  $scope.periodList = [
    {value:'ALL',label:'ทั้งหมด'},
    {value:'AM',label:'กลางวัน'},
    {value:'PM',label:'กลางคืน'},
  ];
  $scope.AirportInfo = 'DMK';
  $scope.param3.statusInfo = 'ALL';
  $scope.memberInfo = {};
  $scope.nationInfo = {};
  $scope.hotelInfo = {};
  $scope.tranfers = {};
  $scope.param3.checkInfo = 'NO';
  $scope.AirportSportCheck = 'DMK';
  $scope.periodSportCheck = 'ALL'
  console.log($scope.param3.checkInfo);
  var acl = ($rootScope.sessionStaff.acl_list).split(',');

  $scope.dmy_acl = function(){
    for (var i in acl) {
      if(acl[i] == 'statistic_dmy'){
        return true;
      }
    };
    return false;
  }

  $scope.info_acl = function(){
    for (var i in acl) {
      if(acl[i] == 'statistic_info'){
        return true;
      }
    };
    return false;
  }

  $scope.sportCheck_acl = function(){
    for (var i in acl) {
      if(acl[i] == 'statistic_sport_check'){
        return true;
      }
    };
    return false;
  }

  $scope.changeChecker = function(){
    console.log($scope.param3.checkInfo);
    $scope.paraHide();
  }

  $scope.paraHide = function(){
    if($scope.param3.checkInfo=='NO'){
      return true;
    }else if($scope.param3.checkInfo=='YES'){
      return false;
    }
  }

  $scope.switchTab = function(tabIndex) {
    $scope.currentTab = tabIndex;
    $scope.buttonShow();
  }

  if($scope.dmy_acl()){
    $scope.currentTab = 0;
  }else if($scope.info_acl()){
    $scope.currentTab = 3;
  }else if($scope.sportCheck_acl()){
    $scope.currentTab = 4;
  }else{
    $scope.currentTab = '';
  }

  $scope.doPreview = function() {

    if ($scope.currentTab==0) {

		if ($scope.typeReport == 'แยกตามสัญชาติ') {
			$scope.ReportName = 'statistic_by_nation';
		} else if ($scope.typeReport == 'แยกตามสมาชิก') {
			$scope.ReportName = 'statistic_by_member';
		} else if ($scope.typeReport == 'สัญชาติ / สมาชิก') {
			$scope.ReportName = 'statistic_by_nation_member';
		} else if ($scope.typeReport == 'สมาชิก / สัญชาติ') {
			$scope.ReportName = 'statistic_by_member_nation';
		}

		doPrintReportDay(true);

    } else if ($scope.currentTab==1) {

		if ($scope.typeReportMonth == 'แยกตามสัญชาติ') {
			$scope.ReportName = 'statistic_by_month_nation';
		} else if ($scope.typeReportMonth == 'แยกตามสมาชิก') {
			$scope.ReportName = 'statistic_by_month_member';
		}
		doPrintReportMonth(true);

    } else if ($scope.currentTab==2) {
		if ($scope.typeReportYear == 'แยกตามสัญชาติ') {
			$scope.ReportName = 'statistic_by_year_nation';
		} else if ($scope.typeReportYear == 'แยกตามสมาชิก') {
			$scope.ReportName = 'statistic_by_year_member';
		}

		doPrintReportYear(true);
	} else if ($scope.currentTab==3) {
	    console.log("Test");
	} else if ($scope.currentTab==4) {
    doPrintReportSportCheck(true);
  }

  }

  $scope.doExportExcel = function() {
    if ($scope.currentTab==3){
      $scope.doExportExcelInfo(true);
    } else if ($scope.currentTab==4){
      console.log("ExcelTap4");
      $scope.doExportExcelSportCheck(true);
    }
  }

  function js_yyyy_mm_dd_hh_mm_ss () {
         now = new Date();
         year = "" + now.getFullYear();
         month = "" + (now.getMonth() + 1);
         if (month.length == 1) {
          month = "0" + month;
      }
         day = "" + now.getDate();
         if (day.length == 1) {
          day = "0" + day;
         }
         hour = "" + now.getHours();
         if (hour.length == 1) {
          hour = "0" + hour;
         }
         minute = "" + now.getMinutes();
         if (minute.length == 1) {
          minute = "0" + minute;
         }
         second = "" + now.getSeconds();
         if (second.length == 1) {
          second = "0" + second;
         }
         return year + month + day +"_"+ hour + minute + second;
     }

  $scope.doExportExcelInfo = function() {
    // console.log('Excel');
    if($scope.param3.checkInfo==''||$scope.param3.checkInfo==null||$scope.param3.checkInfo==undefined||$scope.param3.checkInfo=='NO'){
      console.log($scope.param3.checkInfo);
      console.log($scope.memberInfo);
      if($scope.memberInfo==null){
        $scope.memberInfo.code = '';
        $scope.nationInfo.code = '';
        $scope.hotelInfo.name = '';
      }
      var param = {
          airportInfo: $scope.AirportInfo,
          date_from: $scope.param3.date_from,
          date_to: $scope.param3.date_to,
          memberInfoCode: $scope.memberInfo.code,
          nationInfoCode: $scope.nationInfo.code,
          flightInfo: $scope.param3.flightInfo,
          hotelInfoName: $scope.hotelInfo.name,
          guideNameInfo: $scope.param3.guideNameInfo,
          licenseInfo: $scope.param3.licenseInfo,
          statusInfo: $scope.param3.statusInfo,
          checkInfo: 'NO',
        };
    }else{
      console.log($scope.param3.checkInfo);
      var param = {
        airportInfo: $scope.AirportInfo,
        date_from: $scope.param3.date_from,
        date_to: $scope.param3.date_to,
        memberInfoCode: $scope.memberInfo.code,
        nationInfoCode: $scope.nationInfo.code,
        checkInfo: 'YES',
      }
    }
        dbSvc.request('exportExcelInfo', param).then(function(result) {
            if (result.status === true){
                console.log(result);
                var dateNow = js_yyyy_mm_dd_hh_mm_ss ();
                if($scope.param3.checkInfo==''||$scope.param3.checkInfo==null||$scope.param3.checkInfo==undefined||$scope.param3.checkInfo=='NO'){
                  var saveText = "Info_" + dateNow + ".xls";
                }else{
                  var saveText = "Info_Pax_" + dateNow + ".xls";
                }


                document.getElementById('exportable').innerHTML = result.textFiles;
                console.log(document.getElementById('exportable').innerHTML);
                var blob = new Blob([document.getElementById('exportable').innerHTML], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
                });
                saveAs(blob, saveText);

                toaster.pop('success','บันทึกเรียบร้อยแล้ว');

            }
            else
            {
                console.log('bbbbb');
            }
        });
  }
  $scope.showLovTrasferInfo = function($event){
    if ($event.keyCode != 32) {
      return;
    }

    $scope.lovQuery = "SELECT code, name_th, name_en, address, email, mobile FROM freelance ORDER BY code";
    $scope.fields = [
      {name:'code', text:'รหัส'},
        {name:'name_th', text:'ชื่อ (ไทย)'},
        {name:'name_en', text:'ชื่อ (อังกฤษ)'},
        {name:'address', text:'ที่อยู่'},
        {name:'email', text:'Email'},
        {name:'mobile', text:'โทรศัพท์'},
    ];
    ngDialog.open({
      template: 'views/lov.html',
      controller: 'LovDialogCtrl',
      className: 'ngdialog-theme-default ngdialog-theme-lov',
      scope:$scope,
    }).closePromise.then(function(result) {
      console.log(result);
      if (result.value=='$closeButton' || typeof result.value==='undefined') {
        setTimeout(function() {
          angular.element('#guideNameInfor').focus();
        }, 0);
        return;
      }
      $scope.tranfers = angular.copy(result.value);
      $scope.param3.guideNameInfo = $scope.tranfers.name_en;
      setTimeout(function() {
        angular.element('#licenseInfo').focus();
      }, 0);
    });
  };

	$scope.showStaff = function($event){
    if ($event.keyCode != 32) {
      return;
    }
    var str = $rootScope.setting.code.substr(2, 2);
    $scope.lovQuery = "SELECT user, fullname, department FROM staff where case when '" + str
                    + "'='HO' then department = department else department like '%" + str + "%' end ORDER BY id";
    $scope.fields = [
      {name:'user', text:'ชื่อผู้ใช้'},
        {name:'fullname', text:'ชื่อ (เต็ม)'},
        {name:'department', text:'แผนก'},
    ];
    ngDialog.open({
      template: 'views/lov.html',
      controller: 'LovDialogCtrl',
      className: 'ngdialog-theme-default ngdialog-theme-lov',
      scope:$scope,
    }).closePromise.then(function(result) {
      if (result.value=='$closeButton' || typeof result.value==='undefined') {
        setTimeout(function() {
          angular.element('#exportable').focus();
        }, 0);
        return;
      }
      $scope.staff = angular.copy(result.value);
      $scope.staffSportCheck = $scope.staff.user;
      setTimeout(function() {
        angular.element('#exportable').focus();
      }, 0);
    });
  };

  $scope.doExportExcelSportCheck = function(){
    var param = {
      airport: $scope.AirportSportCheck,
      date_from: $scope.param4.date_from,
      date_to: $scope.param4.date_to,
      period: $scope.periodSportCheck,
			check_by: $scope.staffSportCheck,
    };
    dbSvc.request('exportExcelSportCheck', param).then(function(result) {
            if (result.status === true){
                console.log(result);
                var dateNow = js_yyyy_mm_dd_hh_mm_ss ();
                var saveText = "SpotCheck_" + dateNow + ".xls";
                document.getElementById('exportable').innerHTML = result.textFiles;
                console.log(document.getElementById('exportable').innerHTML);
                var blob = new Blob([document.getElementById('exportable').innerHTML], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=TIS-620"
                });
                saveAs(blob, saveText);

                toaster.pop('success','บันทึกเรียบร้อยแล้ว');

            }
            else
            {
                console.log('bbbbb');
            }
        });
  }

  dbSvc.request('informYearList', {}).then(function(result) {
    var i;
    if (result.status===true) {
      $scope.YearList = angular.copy(result.year);

	  // for(i in $scope.YearList) {
          // $scope.SearchYear = $scope.YearList[i];
      // }

    }

  });

  var doPrintReportDay = function(preview) {

	var dateFrom = $scope.param0.date_from;
	var dateTo = $scope.param0.date_to;

	if ($scope.param0.date_to.trim() != '' && ($scope.param0.date_from > $scope.param0.date_to)) {
		dateFrom = $scope.param0.date_to;
		dateTo = $scope.param0.date_from;

		$scope.param0.date_from = dateFrom;
		$scope.param0.date_to = dateTo;
	}

    var param = {
      report: $scope.ReportName,
      date_from: $scope.param0.date_from,
      date_to: $scope.param0.date_to,
      airport: $scope.Airport,
    }
    dbSvc.request('report', param).then(function(result) {
      if (result.status === true) {
        window.open($rootScope.setting.RS_URL + '?uuid=' + result.uuid);
        return;
      } else {
        toaster.pop('warning', '', result.reason);
      }
    });
  };

  var doPrintReportMonth = function(preview) {

	var dateFrom = $scope.param1.date_from;
	var dateTo = $scope.param1.date_to;

	if ($scope.param1.date_to.trim() != '' && ($scope.param1.date_from > $scope.param1.date_to)) {
		dateFrom = $scope.param1.date_to;
		dateTo = $scope.param1.date_from;

		$scope.param1.date_from = dateFrom;
		$scope.param1.date_to = dateTo;
	}

    var param = {
      report: $scope.ReportName,
      date_from: $scope.param1.date_from,
      date_to: $scope.param1.date_to,
      airport: $scope.Airport,
    }
    console.log($scope.Airport);
    dbSvc.request('report', param).then(function(result) {
      if (result.status === true) {
        window.open($rootScope.setting.RS_URL + '?uuid=' + result.uuid);
        return;
      } else {
        toaster.pop('warning', '', result.reason);
      }
    });
  };

  var doPrintReportYear = function(preview) {

    var param = {
      report: $scope.ReportName,
      year: $scope.SearchYear.year,
      airport: $scope.AirportYear,
    }
    dbSvc.request('report', param).then(function(result) {
      if (result.status === true) {
        window.open($rootScope.setting.RS_URL + '?uuid=' + result.uuid);
        return;
      } else {
        toaster.pop('warning', '', result.reason);
      }
    });
  };

  var doPrintReportSportCheck = function(preview) {
    var param = {
      report: 'sportCheckPrint',
      airport: $scope.AirportSportCheck,
      p_date: $scope.param4.date_from,
      p_date2: $scope.param4.date_to,
      p_type: $scope.periodSportCheck,
      checker: $scope.staffSportCheck,
    }
    dbSvc.request('report', param).then(function(result) {
      if (result.status === true) {
        window.open($rootScope.setting.RS_URL + '?uuid=' + result.uuid);
        return;
      } else {
        toaster.pop('warning', '', result.reason);
      }
    });
  }

  $scope.changeYear = function() {

	//console.log($scope.SearchYear.year);

    //$scope.SearchYear = $scope.YearList.code;
  }

  $scope.canExport = function(){
    if($scope.currentTab==0){
      return false;
    }else if($scope.currentTab==1){
      return false;
    }else if($scope.currentTab==2){
      return false;
    }else if ($scope.currentTab==3){
      if ((typeof $scope.param3.date_from === 'undefined'  || $scope.param3.date_from=='' )) {
        return false;
      }
      if ((typeof $scope.param3.date_to === 'undefined'  || $scope.param3.date_to=='' )) {
        return false;
      }
    }else if($scope.currentTab==4){
      if ((typeof $scope.param4.date_from === 'undefined'  || $scope.param4.date_from=='' )) {
        return false;
      }
      if ((typeof $scope.param4.date_to === 'undefined'  || $scope.param4.date_to=='' )) {
        return false;
      }
    }
    return true;
  }

  $scope.canPreview = function() {

    //console.log($scope.param0.date_from);
	if ($scope.currentTab==0) {

		if ((typeof $scope.typeReport === 'undefined' || $scope.typeReport.trim()=='')) {
			return false;
		}

		if ((typeof $scope.Airport === 'undefined' || $scope.Airport.trim()=='')) {
			return false;
		}

		if ((typeof $scope.param0.date_from === 'undefined'  || $scope.param0.date_from=='' )) {
			return false;
		}

		if ((typeof $scope.param0.date_to === 'undefined'  || $scope.param0.date_to=='' )) {
			return false;
		}

	} else if ($scope.currentTab == 1) {

		if ((typeof $scope.typeReportMonth === 'undefined' || $scope.typeReportMonth.trim()=='')) {
			return false;
		}

		if ((typeof $scope.AirportMonth === 'undefined' || $scope.AirportMonth.trim()=='')) {
			return false;
		}

		if ((typeof $scope.param1.date_from === 'undefined'  || $scope.param1.date_from=='' )) {
			return false;
		}

		if ((typeof $scope.param1.date_to === 'undefined'  || $scope.param1.date_to=='' )) {
			return false;
		}

	} else if ($scope.currentTab == 2) {

		if ((typeof $scope.typeReportYear === 'undefined' || $scope.typeReportYear.trim()=='')) {
			return false;
		}

		if ((typeof $scope.AirportYear === 'undefined' || $scope.AirportYear.trim()=='')) {
			return false;
		}

		if ((typeof $scope.SearchYear.year === 'undefined' || $scope.SearchYear.year.trim()=='')) {
			return false;
		}

	}else if ($scope.currentTab == 3){
    return false;
  }else if ($scope.currentTab == 4){
    if ((typeof $scope.param4.date_from === 'undefined'  || $scope.param4.date_from=='' )) {
      return false;
    }
    if ((typeof $scope.param4.date_to === 'undefined'  || $scope.param4.date_to=='' )) {
      return false;
    }
  }

    return true;
  }

  $scope.showLovMemberInfo = function($event) {
  if ($event.keyCode != 32) {
      return;
    }

    lovService.showLov($scope, 'member', {cache:true}).then(function(result) {
      if (result===null) {
        angular.element('#member').focus();
        return;
      }
      console.log(result);
      $scope.param3.memberInfo = result.code+':'+result.name_th;
      $scope.memberInfo = result;
      //console.log($scope.memberInfo.code);
      setTimeout(function() {
        angular.element('#nation').focus();
      },0);

    });
  };

  $scope.showLovNationInfo = function($event) {
    if ($event.keyCode != 32) {
      return;
    }
    lovService.showLov($scope, 'lov_nation', {}).then(function(result) {
      if (result===null) {
        setTimeout(function() {
          angular.element('#nation').focus();
        }, 0);
        return;
      }
      $scope.nationInfo = result;
      $scope.param3.nationInfo = $scope.nationInfo.code+':'+$scope.nationInfo.nation_en;
      setTimeout(function() {
        angular.element('#flightInfo').focus();
      }, 0);
    });
  };

  $scope.showLovHotelInfo = function($event) {
    if ($event.keyCode != 32) {
      return;
    }
    lovService.showLov($scope, 'lov_hotel', {}).then(function(result) {
      if (result===null) {
        setTimeout(function() {
          angular.element('#hotel').focus();
        }, 0);
        return;
      }
      $scope.hotelInfo = result;
      $scope.param3.hotelInfo = $scope.hotelInfo.name;
      setTimeout(function() {
        angular.element('#guideNameInfor').focus();
      }, 0);
    });
  };

  $scope.buttonShow = function(){
    if ($scope.currentTab==0) {
      $scope.disablePButton = {'visibility': 'visible'};
      $scope.disableEButton = {'visibility': 'hidden'};
    }else if($scope.currentTab==1){
      $scope.disablePButton = {'visibility': 'visible'};
      $scope.disableEButton = {'visibility': 'hidden'};
    }else if($scope.currentTab==2){
      $scope.disablePButton = {'visibility': 'visible'};
      $scope.disableEButton = {'visibility': 'hidden'};
    }else if($scope.currentTab==3){
      $scope.disablePButton = {'visibility': 'hidden'};
      $scope.disableEButton = {'visibility': 'visible'};
    }else if($scope.currentTab==4){
      $scope.disablePButton = {'visibility': 'visible'};
      $scope.disableEButton = {'visibility': 'visible'};
    }
  }

}]);
