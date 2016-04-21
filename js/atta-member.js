angular.module('attaMember', [

]).controller('MemberListCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$q',
		'dbSvc', 'helper', 'toaster', 'ngDialog','lovService',
		function($scope, $rootScope, $state, $stateParams, $q, dbSvc, helper, toaster, ngDialog, lovService) {

	//console.log($stateParams);
	$scope.filtered = [];
	$scope.is_active = 'YES';
	$scope.members = [];
	if ($stateParams.page=="0"){
		$scope.currentPage = 1;
	}else if ($stateParams.page==""){
		$scope.currentPage = 1
	}else {
		$scope.currentPage = parseInt($stateParams.page)
	}
  $scope.pageSize = 50;
	$scope.searchText = "";
  var oldKeyword = '';

	if ($stateParams.searchs != ""){
		$scope.keyword = $stateParams.searchs;
	}
  $scope.doChange = function() {
  	if (oldKeyword != $scope.keyword) {
  		oldKeyword = $scope.keyword;
  		$scope.numPages = Math.ceil($scope.filtered.length/$scope.pageSize);
  		if ($scope.currentPage > $scope.numPages) {

  		}
			$scope.searchText = $scope.keyword;
  		console.log('change');
  	}
  }
  $scope.numberOfPages=function(){
      return Math.ceil($scope.filtered.length/$scope.pageSize);
  }
	$scope.newMember = function() {
		$state.go('home.member_edit',{uuid:''});
	}
	$scope.getPage = function(x){
		for (i in $scope.members) {
			$scope.members[i].page = $scope.currentPage;
		}
	}
	$scope.refreshData = function() {
		dbSvc.request('memberList', {is_active:$scope.is_active}).then(function(result) {
			if (result.status===true) {
				$scope.members = result.members;
				$scope.getPage($scope.currentPage);
			}
		});
	}
	$scope.refreshData();
  setTimeout(function() {
  	var $table = $('.table-list');
		$table.floatThead({
				scrollContainer: function($table){
					return $table.closest('.wrapper');
			},
			headerCellSelector:'tr.header>th:visible',
		});
  },1000);
}]).controller('MemberEditCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$q',
		'dbSvc', 'helper', 'toaster', 'ngDialog','lovService',
		function($scope, $rootScope, $state, $stateParams, $q, dbSvc, helper, toaster, ngDialog, lovService) {

	var contact_uuid = [],
		address_uuid = [];

	$scope.page = $stateParams.page;
	$scope.searchText = $stateParams.searchs;
	console.log($stateParams);

	$scope.memberType = [
		{value:'VIP',label:'กิติมศักดิ์'},
		{value:'ORDINARY',label:'สามัญ'},
		{value:'EXTRA',label:'สมทบ'},
		{value:'CASH',label:'เงินสด'},
	];

	$scope.currentTab = 0;
	$scope.master = {
		uuid:'',
		code:'',
		type:'ORDINARY',
		name_th:'',
		name_en:'',
		tel:'',
		fax:'',
		email:'',
		website:'',
		taxId:'',
		tatId:'',
		capital:0,
		yearStart:'2014',
		remark:'',
		contacts:[],
		specialist:[],
		marketInbound:[],
		marketOutbound:[],
		addresses:[],
		is_active:'YES',
		sync:0,
		start_date:'0000-00-00',
		end_date:'0000-00-00',
		domestic:false
	};
	$scope.addressMaster = {
		code:'',
		lang:'TH',
		name:'',
		tel:'',
		fax:'',
		addr1:'',
		addr2:'',
		tambon:'',
		amphur:'',
		province:'',
		zipcode:'',
		contactaddress_th:'N',
		contactaddress_en:'N',
		invoice_addr:'N',
	}
	$scope.contactMaster = {
		name_th:'',
		name_en:'',
		position:'',
		nation:'',
	}
	$scope.masterInbound = {};
	$scope.masterOutbound = {};
	$scope.masterSpecialist = {};

	$scope.marketList = [];
	$scope.marketOutList = [];
	$scope.specialList = [];
	$scope.member = angular.copy($scope.master);
	$scope.memberInbound = {};
	$scope.memberOutbound = {};
	$scope.memberSpecialist = {};
	$scope.contact = {uuid:''};
	$scope.address = {uuid:''};
	$scope.address.lang = 'TH';

	$scope.dCheck = function(){
		if ($scope.address.lang == 'TH'){
			return true;
		}
		return false;
	}
	$scope.showLovNation = function($event) {
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
			$scope.nation = result;
			$scope.contact.nation = $scope.nation.code;
			setTimeout(function() {
				//angular.element('#flight').focus();
			}, 0);
		});
	};

	$scope.jtest = function(isValid) {
		var checkMail = validateMultipleEmailsCommaSeparated($scope.member.email);
		if (!checkMail) {
			console.log('ไม่ใช่เมลล์');
			return;
		}
		//console.log(isValid);
		$scope.member.specialist = [];
		angular.forEach($scope.memberSpecialist, function(item, key){
			if (item==true){
				$scope.member.specialist.push(key);
			}
		});

		$scope.member.market_inbound = [];
		angular.forEach($scope.memberInbound, function(item, key){
			if (item==true){
				$scope.member.market_inbound.push(key);
			}
		});

		$scope.member.market_outbound = [];
		angular.forEach($scope.memberOutbound, function(item, key){
			if (item==true){
				$scope.member.market_outbound.push(key);
			}
		});
		if ($scope.member.domestic===true){
			$scope.member.domestic = 'Y';
		} else {
			$scope.member.domestic = 'N';
		}
		console.log($scope.member);
		console.log(contact_uuid);
		console.log(address_uuid);
	}

	function validateEmail(field) {
		var regex=/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b/i;
		return (regex.test(field)) ? true : false;
	}

	function validateMultipleEmailsCommaSeparated(value) {
		var result = value.split(",");
		for(var i = 0;i < result.length;i++)
		if(!validateEmail(result[i]))
				return false;
		return true;
	}

	var addCommas = function(nStr){
				nStr += '';
				x = nStr.split('.');
				x1 = x[0];
				x2 = x.length > 1 ? '.' + x[1] : '';
				var rgx = /(\d+)(\d{3})/;
				while (rgx.test(x1)) {
					x1 = x1.replace(rgx, '$1' + ',' + '$2');
				}
				return x1 + x2;
			}

	$scope.comma = function(){
		var num = parseFloat($scope.member.capital);
		$scope.member.capital = addCommas(num.toFixed(2));
	}

	var genAddress = function(address) {
		if (address.addr1==undefined||address.addr1==null||address.addr1=='') {
			address.addr1 = '';
		}
		if (address.addr2==undefined||address.addr2==null||address.addr2=='') {
			address.addr2 = '';
		}
		if (address.tambon==undefined||address.tambon==null||address.tambon=='') {
			address.tambon = '';
		}
		if (address.amphur==undefined||address.amphur==null||address.amphur=='') {
			address.amphur = '';
		}
		var tmp = [];
		console.log(address);
		if (address.addr1.trim() != '') {
			tmp.push(address.addr1.trim());
		}
		if (address.addr2.trim() != '') {
			tmp.push(address.addr2.trim());
		}
		if ((address.tambon + ' ' + address.amphur).trim() != '') {
			tmp.push((address.tambon + ' ' + address.amphur).trim());
		}

		return tmp.join('<br>');
	}

	var _getNextMemCode = function(){
		dbSvc.request('getNextMemCode', {}).then(function(result) {
			if (result.status===true){
				//console.log(result);
				$scope.member.code = result.nextCode;
			}else{
				toaster.pop('warning', '', 'ไม่พบรหัสสมาชิกล่าสุด');
			}
		});
	}

	if ($stateParams.uuid == '') {
		_getNextMemCode();
	}

	if ($stateParams.uuid != '') {
		console.log('stateParams');
		dbSvc.request('memberByUuid', {uuid:$stateParams.uuid}).then(function(result) {
			if (result.status === true) {  //console.log(result);
				for (var i = 0; i < result.member.addresses.length; i++) {
					result.member.addresses[i].addr = genAddress(result.member.addresses[i]);
				}
				$scope.master = angular.copy(result.member);
				//console.log($scope.master);
				if(result.member.domestic == 'Y') {
					$scope.master.domestic = true;
				} else {
					$scope.master.domestic = false;
				}
				$scope.issueBy = result.member.issue_by;
				$scope.issueAt = result.member.updated_at.substr(0,10);
				//$scope.startNextcode = result.member.code;
				$scope.resetMember();
			}
		});
	}
	dbSvc.request('marketList', {}).then(function(result) {
		if (result.status===true) {
			for(var i in result.markets) {
				$scope.marketList.push(result.markets[i]);
			}
		}
	});
	dbSvc.request('specialList', {}).then(function(result) {
		if (result.status===true) {
			for(var i in result.specials) {
				$scope.specialList.push(result.specials[i]);
			}
		}
	});

	$scope.getAllUuid = function(uuidx) {
		console.log('Get UUID');
		dbSvc.request('memberByUuid', {uuid:uuidx}).then(function(result) {
			if (result.status === true) {
				for (var i = 0; i < result.member.addresses.length; i++) {
					result.member.addresses[i].addr = genAddress(result.member.addresses[i]);
				}
				$scope.master = angular.copy(result.member);
				if(result.member.domestic == 'Y') {
					$scope.master.domestic = true;
				} else {
					$scope.master.domestic = false;
				}
				$scope.issueBy = result.member.issue_by;
				$scope.issueAt = result.member.updated_at.substr(0,10);
				//$scope.startNextcode = result.member.code;
				$scope.resetMember();
			}
		});
	}

	$scope.nextAndPreviodsCheck = function(){
		if ($stateParams.uuid==''){
			return false;
		}
		return true;
	}

	$scope.nextClick = function(code){
		console.log(code);
		var str = (parseInt(code) + 1) + "";
		var pad = "00000"
		var nextCode = pad.substring(0, pad.length - str.length) + str
		dbSvc.request('getNextUuid', {mem_code:nextCode}).then(function(result) {
			if(result.status===true){
				$scope.getAllUuid(result.mem_uuid);
			} else {
				$m = result.mem_code;
				toaster.pop('warning', '', 'ไม่พบรหัสสมาชิก ' + $m);
				console.log(result.error);
			}
		});
	}

	$scope.previousClick = function(code){
		console.log(code);
		var str = (parseInt(code) - 1) + "";
		var pad = "00000"
		var nextCode = pad.substring(0, pad.length - str.length) + str
		dbSvc.request('getNextUuid', {mem_code:nextCode}).then(function(result) {
			if(result.status===true){
				$scope.getAllUuid(result.mem_uuid);
			} else {
				$m = result.mem_code;
				toaster.pop('warning', '', 'ไม่พบรหัสสมาชิก ' + $m);
				console.log(result.error);
			}
		});
	}

	$scope.editContact = function(index) {
		$scope.contact = angular.copy($scope.member.contacts[index]);
		setTimeout(function() {
			angular.element('#contact_name_th').focus().select();
		}, 0);
	}
	$scope.removeContact = function(index) {
		contact_uuid.push($scope.member.contacts[index].uuid);
		$scope.member.contacts.splice(index, 1);
		$scope.contact = {uuid:''};
	}
	$scope.saveContact = function() {
		if (typeof $scope.contact.uuid=='undefined' || $scope.contact.uuid=='') {
			var maxSeq = $scope.member.contacts.reduce(function(prev,next) {
				return parseInt(next.seq) > prev.seq ? {seq:parseInt(next.seq)} : {seq:prev.seq};
			}, {seq:0});
			$scope.contact.mem_code = $scope.member.code;
			$scope.contact.seq = maxSeq.seq+1;
			$scope.contact.uuid = helper.newUUID();
			//$scope.contact.uuid = '';
			$scope.member.contacts.push(angular.copy($scope.contact));
		} else {
			for(var i in $scope.member.contacts) {
				if ($scope.member.contacts[i].uuid==$scope.contact.uuid) {
					$scope.member.contacts[i] = angular.copy($scope.contact);
					break;
				}
			}
		}
		$scope.contact = {uuid:''};
	}
	$scope.cancelContact = function() {
		$scope.contact = {uuid:''};
	}

	$scope.editAddress = function(index) {
		console.log($scope.member.addresses[index]);
		$scope.address = angular.copy($scope.member.addresses[index]);
		setTimeout(function() {
			angular.element('#address_code').focus().select();
		}, 0);
	}
	$scope.removeAddress = function(index) {
		address_uuid.push($scope.member.addresses[index].uuid);
		$scope.member.addresses.splice(index, 1);
		$scope.address = {uuid:''};
	}
	$scope.saveAddress = function() {
		if (typeof $scope.address.uuid=='undefined' || $scope.address.uuid=='') {
			console.log($scope.address);
			if ($scope.address.contactaddress_th == 'Y') {
				for (j in $scope.member.addresses) {
					$scope.member.addresses[j].contactaddress_th = 'N';
				}
			}else {
				$scope.address.contactaddress_th = 'N'
			}
			if ($scope.address.contactaddress_en == 'Y') {
				for (j in $scope.member.addresses) {
					$scope.member.addresses[j].contactaddress_en = 'N';
				}
			}else {
				$scope.address.contactaddress_en = 'N';
			}
			if ($scope.address.invoice_addr == 'Y') {
				for (k in $scope.member.addresses) {
					$scope.member.addresses[k].invoice_addr = 'N';
				}
			}else{
				$scope.address.invoice_addr = 'N';
			}
			$scope.address.mem_code = $scope.member.code;
			$scope.address.uuid = helper.newUUID();
			//$scope.address.uuid = '';
			$scope.address.addr = genAddress($scope.address);
			$scope.member.addresses.push(angular.copy($scope.address));
			console.log($scope.member.addresses);
		} else {
			if ($scope.address.contactaddress_th == 'Y') {
				for (j in $scope.member.addresses) {
					$scope.member.addresses[j].contactaddress_th = 'N';
				}
			}else {
				$scope.address.contactaddress_th = 'N'
			}
			if ($scope.address.contactaddress_en == 'Y') {
				for (j in $scope.member.addresses) {
					$scope.member.addresses[j].contactaddress_en = 'N';
				}
			}else {
				$scope.address.contactaddress_en = 'N';
			}
			if ($scope.address.invoice_addr == 'Y') {
				for (k in $scope.member.addresses) {
					$scope.member.addresses[k].invoice_addr = 'N';
				}
			}else{
				$scope.address.invoice_addr = 'N';
			}
			for(var i in $scope.member.addresses) {
				if ($scope.member.addresses[i].uuid==$scope.address.uuid) {
					$scope.address.addr = genAddress($scope.address);
					$scope.member.addresses[i] = angular.copy($scope.address);
					break;
				}
			}
			console.log($scope.member.addresses);
		}
		$scope.address = {uuid:''};
		$scope.address.lang = 'TH';
	}
	$scope.cancelContact = function() {
		$scope.address = {uuid:''};
	}

	$scope.switchTab = function(active) {
		$scope.currentTab = active;
	}
	$scope.saveMember = function(isValid) {
		var th = '';
		var en = '';
		var inv = '';
		for(var i in $scope.member.addresses){
			if($scope.member.addresses[i].contactaddress_th=='Y'){
				th = 'Y';
			}
			if($scope.member.addresses[i].contactaddress_en=='Y'){
				en = 'Y';
			}
			if($scope.member.addresses[i].invoice_addr=='Y'){
				inv = 'Y';
			}
		}
		if(th==''){
			toaster.pop('warning', '', 'คุณไม่ได้เลือกที่อยู่หลักภาษาไทย');
		}
		if(en==''){
			toaster.pop('warning', '', 'คุณไม่ได้เลือกที่อยู่หลักภาษาอังกฤษ');
		}
		if(inv==''){
			toaster.pop('warning', '', 'คุณไม่ได้เลือกที่อยู่ออกใบแจ้งหนี้');
		}
		var checkMail = validateMultipleEmailsCommaSeparated($scope.member.email);
		// if (!checkMail && ($scope.member.email!="")) {
		// 	console.log('ไม่ใช่เมลล์');
		// 	toaster.pop('warning', '', 'Email ไม่ถูกต้องกรุณาแก้ไข Email ใหม่');
		// 	return;
		// }

		$scope.member.specialist = [];
		angular.forEach($scope.memberSpecialist, function(item, key){
			if (item==true){
				$scope.member.specialist.push(key);
			}
		});

		$scope.member.market_inbound = [];
		angular.forEach($scope.memberInbound, function(item, key){
			if (item==true){
				$scope.member.market_inbound.push(key);
			}
		});

		$scope.member.market_outbound = [];
		angular.forEach($scope.memberOutbound, function(item, key){
			if (item==true){
				$scope.member.market_outbound.push(key);
			}
		});
		if ($scope.member.domestic===true){
			$scope.member.domestic = 'Y';
		} else {
			$scope.member.domestic = 'N';
		}
        //console.log("Scope Member = ", $scope.member);
        if($scope.member.capital == "" || $scope.member.capital == undefined || $scope.member.capital == null){
            console.log("Capa");
            $scope.member.capital = 0;
        }
        if($scope.member.end_date == "" || $scope.member.end_date == undefined){
           $scope.member.end_date = "0000-00-00"
        }
		dbSvc.request('memberSave', {member:$scope.member,contact_uuid:contact_uuid,address_uuid:address_uuid}).then(function(result) {
			if (result.status===true) {
				console.log(result);
				toaster.pop('success', '', 'บันทึกเรียบร้อยแล้ว');
				if (result.checkCode != 'x') {
					toaster.pop('warning', '', result.checkCode);
				}
				$scope.member.code = result.code;
				$scope.member.uuid = result.uuid;
				$scope.master = angular.copy($scope.member);
				$scope.masterSpecialist = angular.copy($scope.memberSpecialist);
				$scope.masterInbound = angular.copy($scope.memberInbound);
				$scope.masterOutbound = angular.copy($scope.memberOutbound);
				$scope.getAllUuid(result.uuid);
			} else {
				toaster.pop('warning', '', result.reason);
			}
		});
	}

	$rootScope.confirmToExit = function() {
		var deferred = $q.defer();
		if (!$scope.isUnchanged($scope.member)) {
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
	$scope.isUnchanged = function(member) {
		return angular.equals($scope.member, $scope.master)
			&& angular.equals($scope.memberSpecialist, $scope.masterSpecialist)
			&& angular.equals($scope.memberInbound, $scope.masterInbound)
			&& angular.equals($scope.memberOutbound, $scope.masterOutbound);
	};

	$scope.resetMember = function() {
//		console.log('master = ', $scope.master);
		$scope.member = angular.copy($scope.master);
		$scope.address = angular.copy($scope.addressMaster);
		$scope.contact = angular.copy($scope.contactMaster);
//		console.log('member = ', $scope.member);

		$scope.memberInbound = {};
		angular.forEach($scope.member.market_inbound, function(item){
			$scope.memberInbound[item] = true;
		});
		$scope.masterInbound = angular.copy($scope.memberInbound);

		$scope.memberOutbound = {};
		angular.forEach($scope.member.market_outbound, function(item){
			$scope.memberOutbound[item] = true;
		});
		$scope.masterOutbound = angular.copy($scope.memberOutbound);

		$scope.memberSpecialist = {};
		angular.forEach($scope.member.specialist, function(item){
			$scope.memberSpecialist[item] = true;
		});
		$scope.masterSpecialist = angular.copy($scope.memberSpecialist);
	}
	$scope.goBack = function(page,searchText) {
		//console.log(page,searchText);
		if (page==""){
			page='0';
		}
		$rootScope.confirmToExit().then(function(result){
			if (result){
				$rootScope.confirmToExit = undefined;
				$state.go('home.member',{page:page, searchs:searchText});
			}
		});
	}
}]).controller('FreelanceListCtrl', function($scope, $state, dbSvc) {
////////////////////////////////////////////////////////////////////////////////
// FreelanceListCtrl
////////////////////////////////////////////////////////////////////////////////

	$scope.filtered = [];
	$scope.freelances = [];
  $scope.currentPage = 1;
  $scope.pageSize = 50;
  $scope.numberOfPages=function(){
      return Math.ceil($scope.filtered.length/$scope.pageSize);
  }
	$scope.newFreelance = function() {
		$state.go('home.freelance_edit',{uuid:''});
	}

	dbSvc.request('freelanceList', {}).then(function(result) {
		if (result.status===true) {
			$scope.freelances = angular.copy(result.freelances);
			// angular.element('#searchFreelance').focus();
		}
	});
  setTimeout(function() {
  	var $table = $('.table-list');
		$table.floatThead({
				scrollContainer: function($table){
					return $table.closest('.wrapper');
			},
			headerCellSelector:'tr.header>th:visible',
		});
		angular.element('#searchFreelance').focus();
  },1000);
}).controller('FreelanceEditCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$q', 'dbSvc', 'helper', 'toaster', 'ngDialog', function($scope, $rootScope, $state, $stateParams, $q, dbSvc, helper, toaster, ngDialog) {
////////////////////////////////////////////////////////////////////////////////
// FreelanceEditCtrl
////////////////////////////////////////////////////////////////////////////////

	$scope.name = '';
	$scope.master = {
		uuid:'',
		code:'',
		name:'',
		address:'',
		email:'',
		mobile:'',
		mobile2:'',
		is_active:'YES',
		sync:0,
	};

	$scope.freelance = angular.copy($scope.master);

	if ($stateParams.uuid != '') {
		dbSvc.request('freelanceByUuid', {uuid:$stateParams.uuid}).then(function(result) {
			if (result.status===true) {
				$scope.master = angular.copy(result.freelance);
				//console.log($scope.master);
				$scope.resetFreelance();
			} else {
				toaster.pop('warning', '', result.reason);
			}
		});
	}

	$scope.getFreelanceUuid = function(uuidx){
		console.log('KO');
		dbSvc.request('freelanceByUuid', {uuid:uuidx}).then(function(result) {
			if (result.status===true) {
				$scope.master = angular.copy(result.freelance);
				//console.log($scope.master);
				$scope.resetFreelance();
			} else {
				toaster.pop('warning', '', result.reason);
			}
		});
	}

	$scope.nextAndPreviodsCheck = function(){
		if ($stateParams.uuid==''){
			return false;
		}
		return true;
	}

	$scope.nextClick = function(code){
		console.log(code);
		var str = (parseInt(code) + 1) + "";
		var pad = "00000"
		var nextCode = pad.substring(0, pad.length - str.length) + str
		dbSvc.request('getNextUuidFreelance', {freelance_code:nextCode}).then(function(result) {
			if(result.status===true){
				$scope.getFreelanceUuid(result.freelance_uuid);
			} else {
				$m = result.freelance_code;
				toaster.pop('warning', '', 'ไม่พบรหัสสมาชิก ' + $m);
				console.log(result.error);
			}
		});
	}

	$scope.previousClick = function(code){
		console.log(code);
		var str = (parseInt(code) - 1) + "";
		var pad = "00000"
		var nextCode = pad.substring(0, pad.length - str.length) + str
		dbSvc.request('getNextUuidFreelance', {freelance_code:nextCode}).then(function(result) {
			if(result.status===true){
				$scope.getFreelanceUuid(result.freelance_uuid);
			} else {
				$m = result.freelance_code;
				toaster.pop('warning', '', 'ไม่พบรหัสสมาชิก ' + $m);
				console.log(result.error);
			}
		});
	}

	$scope.saveFreelance = function(isValid) {
		dbSvc.request('freelanceSave', {freelance:$scope.freelance}).then(function(result) {
			if (result.status===true) {
				toaster.pop('success', '', 'บันทึกเรียบร้อยแล้ว');
				$scope.freelance.code = result.code;
				$scope.freelance.uuid = result.uuid;
				$scope.master = angular.copy($scope.freelance);
			} else {
				toaster.pop('warning', '', result.reason);
			}
		});
	}
	$rootScope.confirmToExit = function() {
		var deferred = $q.defer();
		if (!$scope.isUnchanged()) {
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
		return angular.equals($scope.freelance, $scope.master);
	};

	$scope.resetFreelance = function() {
		$scope.freelance = angular.copy($scope.master);
		//console.log($scope.freelance);
	}

	$scope.goBack = function() {
		$rootScope.confirmToExit().then(function(result) {
			if (result) {
				$rootScope.confirmToExit = undefined;
				$state.go('home.freelance');
			}
		});
	}
}]).controller('MemberReportCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$q', 'dbSvc', 'helper', 'toaster', 'ngDialog', '$http',
		function($scope, $rootScope, $state, $stateParams, $q, dbSvc, helper, toaster, ngDialog, $http) {
////////////////////////////////////////////////////////////////////////////////
// MemberReportCtrl
////////////////////////////////////////////////////////////////////////////////

	$scope.currentTab=2;
	$scope.canPreview=true;
	$scope.canPrint=true;
	$scope.canExport=false;
	$scope.toPerson = '';
	$scope.provinceList = [];
	$scope.reportType = [
		{value:'monny',label:'การเงิน'},
		{value:'member',label:'สมาชิก'},
	];
	$scope.provinceListTH = [{value:'ALL',label:'ทั้งหมด'},
		{value:'กรุงเทพมหานคร',label:'กรุงเทพมหานคร'},{value:'กระบี่',label:'กระบี่'},{value:'กาญจนบุรี',label:'กาญจนบุรี'},{value:'กาฬสินธุ์',label:'กาฬสินธุ์'},{value:'กำแพงเพชร',label:'กำแพงเพชร'},
		{value:'ขอนแก่น',label:'ขอนแก่น'},{value:'จันทบุรี',label:'จันทบุรี'},{value:'ฉะเชิงเทรา',label:'ฉะเชิงเทรา'},{value:'ชลบุรี',label:'ชลบุรี'},{value:'ชัยนาท',label:'ชัยนาท'},
		{value:'ชัยภูมิ',label:'ชัยภูมิ'},{value:'ชุมพร',label:'ชุมพร'},{value:'เชียงราย',label:'เชียงราย'},{value:'เชียงใหม่',label:'เชียงใหม่'},
		{value:'ตรัง',label:'ตรัง'},{value:'ตราด',label:'ตราด'},{value:'ตาก',label:'ตาก'},{value:'นครนายก',label:'นครนายก'},{value:'นครปฐม',label:'นครปฐม'},
		{value:'นครพนม',label:'นครพนม'},{value:'นครราชสีมา',label:'นครราชสีมา'},{value:'นครศรีธรรมราช',label:'นครศรีธรรมราช'},{value:'นครสวรรค์',label:'นครสวรรค์'},
		{value:'นนทบุรี',label:'นนทบุรี'},{value:'นราธิวาส',label:'นราธิวาส'},{value:'น่าน',label:'น่าน'},{value:'บึงกาฬ',label:'บึงกาฬ'},{value:'บุรีรัมย์',label:'บุรีรัมย์'},
		{value:'ปทุมธานี',label:'ปทุมธานี'},{value:'ประจวบคีรีขันธ์',label:'ประจวบคีรีขันธ์'},{value:'ปราจีนบุรี',label:'ปราจีนบุรี'},{value:'ปัตตานี',label:'ปัตตานี'},
		{value:'พระนครศรีอยุธยา',label:'พระนครศรีอยุธยา'},{value:'พังงา',label:'พังงา'},{value:'พัทลุง',label:'พัทลุง'},{value:'พิจิตร',label:'พิจิตร'},
		{value:'พิษณุโลก',label:'พิษณุโลก'},{value:'เพชรบุรี',label:'เพชรบุรี'},{value:'เพชรบูรณ์',label:'เพชรบูรณ์'},{value:'แพร่',label:'แพร่'},{value:'พะเยา',label:'พะเยา'},
		{value:'ภูเก็ต',label:'ภูเก็ต'},{value:'มหาสารคาม',label:'มหาสารคาม'},{value:'มุกดาหาร',label:'มุกดาหาร'},{value:'แม่ฮ่องสอน',label:'แม่ฮ่องสอน'},
		{value:'ยะลา',label:'ยะลา'},{value:'ยโสธร',label:'ยโสธร'},{value:'ร้อยเอ็ด',label:'ร้อยเอ็ด'},{value:'ระนอง',label:'ระนอง'},{value:'ระยอง',label:'ระยอง'},
		{value:'ราชบุรี',label:'ราชบุรี'},{value:'ลพบุรี',label:'ลพบุรี'},{value:'ลำปาง',label:'ลำปาง'},{value:'ลำพูน',label:'ลำพูน'},{value:'เลย',label:'เลย'},
		{value:'ศรีสะเกษ',label:'ศรีสะเกษ'},{value:'สกลนคร',label:'สกลนคร'},{value:'สงขลา',label:'สงขลา'},{value:'สตูล',label:'สตูล'},{value:'สมุทรปราการ',label:'สมุทรปราการ'},
		{value:'สมุทรสงคราม',label:'สมุทรสงคราม'},{value:'สมุทรสาคร',label:'สมุทรสาคร'},{value:'สระแก้ว',label:'สระแก้ว'},{value:'สระบุรี',label:'สระบุรี'},
		{value:'สิงห์บุรี',label:'สิงห์บุรี'},{value:'สุโขทัย',label:'สุโขทัย'},{value:'สุพรรณบุรี',label:'สุพรรณบุรี'},{value:'สุราษฎร์ธานี',label:'สุราษฎร์ธานี'},
		{value:'สุรินทร์',label:'สุรินทร์'},{value:'หนองคาย',label:'หนองคาย'},{value:'หนองบัวลำภู',label:'หนองบัวลำภู'},{value:'อ่างทอง',label:'อ่างทอง'},
		{value:'อุดรธานี',label:'อุดรธานี'},{value:'อุทัยธานี',label:'อุทัยธานี'},{value:'อุตรดิตถ์',label:'อุตรดิตถ์'},{value:'อุบลราชธานี',label:'อุบลราชธานี'},
		{value:'อำนาจเจริญ',label:'อำนาจเจริญ'},
	];

	$scope.provinceListEN = [{value:'ALL',label:'ALL'},
		{value:'Bangkok',label:'Bangkok'},{value:'Krabi',label:'Krabi'},{value:'Kanchanaburi',label:'Kanchanaburi'},{value:'Kalasin',label:'Kalasin'},{value:'Kamphaeng Phet',label:'Kamphaeng Phet'},
		{value:'Khon Kaen',label:'Khon Kaen'},{value:'Chanthaburi',label:'Chanthaburi'},{value:'Chachoengsao',label:'Chachoengsao'},{value:'Chon Buri',label:'Chon Buri'},{value:'Chai Nat',label:'Chai Nat'},
		{value:'Chaiyaphum',label:'Chaiyaphum'},{value:'Chumphon',label:'Chumphon'},{value:'Chiang Rai',label:'Chiang Rai'},{value:'Chiang Mai',label:'Chiang Mai'},
		{value:'Trang',label:'Trang'},{value:'Trat',label:'Trat'},{value:'Tak',label:'Tak'},{value:'Nakhon Nayok',label:'Nakhon Nayok'},{value:'Nakhon Pathom',label:'Nakhon Pathom'},
		{value:'Nakhon Phanom',label:'Nakhon Phanom'},{value:'Nakhon Ratchasima',label:'Nakhon Ratchasima'},{value:'Nakhon Si Thammarat',label:'Nakhon Si Thammarat'},{value:'Nakhon Sawan',label:'Nakhon Sawan'},
		{value:'Nonthaburi',label:'Nonthaburi'},{value:'Narathiwat',label:'Narathiwat'},{value:'Nan',label:'Nan'},{value:'Bueng Kan',label:'Bueng Kan'},{value:'Buri Ram',label:'Buri Ram'},
		{value:'Pathum Thani',label:'Pathum Thani'},{value:'Prachuap Khiri Khan',label:'Prachuap Khiri Khan'},{value:'Prachin Buri',label:'Prachin Buri'},{value:'Pattani',label:'Pattani'},
		{value:'Ayutthaya',label:'Ayutthaya'},{value:'Phangnga',label:'Phangnga'},{value:'Phatthalung',label:'Phatthalung'},{value:'Phichit',label:'Phichit'},
		{value:'Phitsanulok',label:'Phitsanulok'},{value:'Phetchaburi',label:'Phetchaburi'},{value:'Petchabun',label:'Petchabun'},{value:'Phrae',label:'Phrae'},{value:'Phayao',label:'Phayao'},
		{value:'Phuket',label:'Phuket'},{value:'Maha Sarakham',label:'Maha Sarakham'},{value:'Mukdahan',label:'Mukdahan'},{value:'Mae Hong Son',label:'Mae Hong Son'},
		{value:'Yala',label:'Yala'},{value:'Yasothon',label:'Yasothon'},{value:'Roi Et',label:'Roi Et'},{value:'Ranong',label:'Ranong'},{value:'Rayong',label:'Rayong'},
		{value:'Ratchaburi',label:'Ratchaburi'},{value:'Lop Buri',label:'Lop Buri'},{value:'Lampang',label:'Lampang'},{value:'Lamphun',label:'Lamphun'},{value:'Loei',label:'Loei'},
		{value:'Si Sa Ket',label:'Si Sa Ket'},{value:'Sakon Nakhon',label:'Sakon Nakhon'},{value:'Songkhla',label:'Songkhla'},{value:'Satun',label:'Satun'},{value:'Samut Prakan',label:'Samut Prakan'},
		{value:'Samut Songkhram',label:'Samut Songkhram'},{value:'Samut Sakhon',label:'Samut Sakhon'},{value:'Sa Kaeo',label:'Sa Kaeo'},{value:'Saraburi',label:'Saraburi'},
		{value:'Sing Buri',label:'Sing Buri'},{value:'Sukhothai',label:'Sukhothai'},{value:'Suphan Buri',label:'Suphan Buri'},{value:'Surat Thani',label:'Surat Thani'},
		{value:'Surin',label:'Surin'},{value:'Nong Khai',label:'Nong Khai'},{value:'Nong Bua Lam Phu',label:'Nong Bua Lam Phu'},{value:'Ang Thong',label:'Ang Thong'},
		{value:'Udon Thani',label:'Udon Thani'},{value:'Uthai Thani',label:'Uthai Thani'},{value:'Uttaradit',label:'Uttaradit'},{value:'Ubon Ratchathani',label:'Ubon Ratchathani'},
		{value:'Amnat Charoen',label:'Amnat Charoen'},
	];


	$scope.provinceListByzoneTH = [{value:'ALL',label:'**[ทั้งหมด]**'},
		{value:'กรุงเทพมหานคร',label:'กรุงเทพมหานคร'},
		{value:'north_th',label:'**[ภาคเหนือ]**'},
		{value:'เชียงราย',label:'เชียงราย'},{value:'เชียงใหม่',label:'เชียงใหม่'},{value:'น่าน',label:'น่าน'},{value:'พะเยา',label:'พะเยา'},
		{value:'แพร่',label:'แพร่'},{value:'แม่ฮ่องสอน',label:'แม่ฮ่องสอน'},{value:'ลำปาง',label:'ลำปาง'},{value:'ลำพูน',label:'ลำพูน'},
		{value:'อุตรดิตถ์',label:'อุตรดิตถ์'},
		{value:'northeast_th',label:'**[ภาคตะวันออกเฉียงเหนือ]**'},
		{value:'กาฬสินธุ์',label:'กาฬสินธุ์'},{value:'ขอนแก่น',label:'ขอนแก่น'},{value:'ชัยภูมิ',label:'ชัยภูมิ'},{value:'นครพนม',label:'นครพนม'},
		{value:'นครราชสีมา',label:'นครราชสีมา'},{value:'บึงกาฬ',label:'บึงกาฬ'},{value:'บุรีรัมย์',label:'บุรีรัมย์'},{value:'มหาสารคาม',label:'มหาสารคาม'},
		{value:'มุกดาหาร',label:'มุกดาหาร'},{value:'ยโสธร',label:'ยโสธร'},{value:'ร้อยเอ็ด',label:'ร้อยเอ็ด'},{value:'เลย',label:'เลย'},
		{value:'สกลนคร',label:'สกลนคร'},{value:'สุรินทร์',label:'สุรินทร์'},{value:'ศรีสะเกษ',label:'ศรีสะเกษ'},{value:'หนองคาย',label:'หนองคาย'},
		{value:'หนองบัวลำภู',label:'หนองบัวลำภู'},{value:'อุดรธานี',label:'อุดรธานี'},{value:'อุบลราชธานี',label:'อุบลราชธานี'},{value:'อำนาจเจริญ',label:'อำนาจเจริญ'},
		{value:'center_th',label:'**[ภาคกลาง]**'},
		{value:'กำแพงเพชร',label:'กำแพงเพชร'},{value:'ชัยนาท',label:'ชัยนาท'},{value:'นครนายก',label:'นครนายก'},{value:'นครปฐม',label:'นครปฐม'},
		{value:'นครสวรรค์',label:'นครสวรรค์'},{value:'นนทบุรี',label:'นนทบุรี'},{value:'ปทุมธานี',label:'ปทุมธานี'},{value:'พระนครศรีอยุธยา',label:'พระนครศรีอยุธยา'},
		{value:'พิจิตร',label:'พิจิตร'},{value:'พิษณุโลก',label:'พิษณุโลก'},{value:'เพชรบูรณ์',label:'เพชรบูรณ์'},
		{value:'ลพบุรี',label:'ลพบุรี'},{value:'สมุทรปราการ',label:'สมุทรปราการ'},{value:'สมุทรสงคราม',label:'สมุทรสงคราม'},{value:'สมุทรสาคร',label:'สมุทรสาคร'},
		{value:'สิงห์บุรี',label:'สิงห์บุรี'},{value:'สุโขทัย',label:'สุโขทัย'},{value:'สุพรรณบุรี',label:'สุพรรณบุรี'},{value:'สระบุรี',label:'สระบุรี'},
		{value:'อ่างทอง',label:'อ่างทอง'},{value:'อุทัยธานี',label:'อุทัยธานี'},
		{value:'east_th',label:'**[ภาคตะวันออก]**'},
		{value:'จันทบุรี',label:'จันทบุรี'},{value:'ฉะเชิงเทรา',label:'ฉะเชิงเทรา'},{value:'ชลบุรี',label:'ชลบุรี'},{value:'ตราด',label:'ตราด'},
		{value:'ปราจีนบุรี',label:'ปราจีนบุรี'},{value:'ระยอง',label:'ระยอง'},{value:'สระแก้ว',label:'สระแก้ว'},
		{value:'west_th',label:'**[ภาคตะวันตก]**'},
		{value:'กาญจนบุรี',label:'กาญจนบุรี'},{value:'ตาก',label:'ตาก'},{value:'ประจวบคีรีขันธ์',label:'ประจวบคีรีขันธ์'},{value:'เพชรบุรี',label:'เพชรบุรี'},
		{value:'ราชบุรี',label:'ราชบุรี'},
		{value:'south_th',label:'**[ภาคใต้]**'},
		{value:'กระบี่',label:'กระบี่'},{value:'ชุมพร',label:'ชุมพร'},{value:'ตรัง',label:'ตรัง'},{value:'นครศรีธรรมราช',label:'นครศรีธรรมราช'},
		{value:'นราธิวาส',label:'นราธิวาส'},{value:'ปัตตานี',label:'ปัตตานี'},{value:'พังงา',label:'พังงา'},{value:'พัทลุง',label:'พัทลุง'},
		{value:'ภูเก็ต',label:'ภูเก็ต'},{value:'ยะลา',label:'ยะลา'},{value:'ระนอง',label:'ระนอง'},{value:'สงขลา',label:'สงขลา'},{value:'สตูล',label:'สตูล'},
		{value:'สุราษฎร์ธานี',label:'สุราษฎร์ธานี'},
	];

	$scope.provinceListByzoneEN = [{value:'ALL',label:'**[ALL]**'},
		{value:'Bangkok',label:'Bangkok'},
		{value:'north_en',label:'**[North]**'},
		{value:'Chiang Rai',label:'Chiang Rai'},{value:'Chiang Mai',label:'Chiang Mai'},{value:'Nan',label:'Nan'},{value:'Phayao',label:'Phayao'},
		{value:'Phrae',label:'Phrae'},{value:'Mae Hong Son',label:'Mae Hong Son'},{value:'Lampang',label:'Lampang'},{value:'Lamphun',label:'Lamphun'},
		{value:'Uttaradit',label:'Uttaradit'},
		{value:'northeast_en',label:'**[Northeast]**'},
		{value:'Kalasin',label:'Kalasin'},{value:'Khon Kaen',label:'Khon Kaen'},{value:'Chaiyaphum',label:'Chaiyaphum'},{value:'Nakhon Phanom',label:'Nakhon Phanom'},
		{value:'Nakhon Ratchasima',label:'Nakhon Ratchasima'},{value:'Bueng Kan',label:'Bueng Kan'},{value:'Buri Ram',label:'Buri Ram'},
		{value:'Maha Sarakham',label:'Maha Sarakham'},{value:'Mukdahan',label:'Mukdahan'},{value:'Yasothon',label:'Yasothon'},{value:'Roi Et',label:'Roi Et'},
		{value:'Loei',label:'Loei'},{value:'Si Sa Ket',label:'Si Sa Ket'},{value:'Sakon Nakhon',label:'Sakon Nakhon'},{value:'Surin',label:'Surin'},
		{value:'Nong Khai',label:'Nong Khai'},{value:'Nong Bua Lam Phu',label:'Nong Bua Lam Phu'},{value:'Amnat Charoen',label:'Amnat Charoen'},
		{value:'Udon Thani',label:'Udon Thani'},{value:'Ubon Ratchathani',label:'Ubon Ratchathani'},
		{value:'center_en',label:'**[Center]**'},
		{value:'Kamphaeng Phet',label:'Kamphaeng Phet'},{value:'Chai Nat',label:'Chai Nat'},{value:'Nakhon Nayok',label:'Nakhon Nayok'},
		{value:'Nakhon Pathom',label:'Nakhon Pathom'},{value:'Nakhon Sawan',label:'Nakhon Sawan'},{value:'Nonthaburi',label:'Nonthaburi'},
		{value:'Pathum Thani',label:'Pathum Thani'},{value:'Ayutthaya',label:'Ayutthaya'},{value:'Phichit',label:'Phichit'},{value:'Phitsanulok',label:'Phitsanulok'},
		{value:'Petchabun',label:'Petchabun'},{value:'Lop Buri',label:'Lop Buri'},{value:'Samut Prakan',label:'Samut Prakan'},{value:'Samut Songkhram',label:'Samut Songkhram'},
		{value:'Samut Sakhon',label:'Samut Sakhon'},{value:'Sing Buri',label:'Sing Buri'},{value:'Sukhothai',label:'Sukhothai'},{value:'Suphan Buri',label:'Suphan Buri'},
		{value:'Saraburi',label:'Saraburi'},{value:'Ang Thong',label:'Ang Thong'},{value:'Uthai Thani',label:'Uthai Thani'},
		{value:'east_en',label:'**[East]**'},
		{value:'Chanthaburi',label:'Chanthaburi'},{value:'Chachoengsao',label:'Chachoengsao'},{value:'Chon Buri',label:'Chon Buri'},{value:'Trat',label:'Trat'},
		{value:'Prachin Buri',label:'Prachin Buri'},{value:'Rayong',label:'Rayong'},{value:'Sa Kaeo',label:'Sa Kaeo'},
		{value:'west_en',label:'**[West]**'},
		{value:'Kanchanaburi',label:'Kanchanaburi'},{value:'Tak',label:'Tak'},{value:'Prachuap Khiri Khan',label:'Prachuap Khiri Khan'},
		{value:'Phetchaburi',label:'Phetchaburi'},{value:'Ratchaburi',label:'Ratchaburi'},
		{value:'south_en',label:'**[South]**'},
		{value:'Krabi',label:'Krabi'},{value:'Chumphon',label:'Chumphon'},{value:'Trang',label:'Trang'},{value:'Nakhon Si Thammarat',label:'Nakhon Si Thammarat'},
		{value:'Narathiwat',label:'Narathiwat'},{value:'Pattani',label:'Pattani'},{value:'Phangnga',label:'Phangnga'},{value:'Phatthalung',label:'Phatthalung'},
		{value:'Phuket',label:'Phuket'},{value:'Yala',label:'Yala'},{value:'Ranong',label:'Ranong'},{value:'Songkhla',label:'Songkhla'},{value:'Satun',label:'Satun'},
		{value:'Surat Thani',label:'Surat Thani'},
	];

$scope.getProductList = function() {
	$scope.stationList = [];
		var param = {
			prefix:'1',
		};
	dbSvc.request('reportProductList', param).then(function(result) {
			if (result.status===true) {
				$scope.products = result.products;
			}
		});
};
$scope.getProductList();

$scope.getBranch = function(){
	var param = {
		lang:$scope.param0.language,
		memCode:$scope.param0.codeFrom,
	};
	dbSvc.request('branchList', param).then(function(result) {
			if (result.status===true) {
				$scope.branch = result.products;
			}
		});
	$scope.selectProvinceLang();
};
//$scope.getBranch();
$scope.businessTypeList = function(){
	$scope.businessTypeList = [];
	var param = {
		sim:'x',
	};
	dbSvc.request('businessTypeList',param).then(function(result){
		if (result.status===true){
			$scope.fx = {"value":"ALL","label":"ทั้งหมด"};
			$scope.businessTypeList.push($scope.fx);
			result.businessList.forEach(function(x,j){
					$scope.businessTypeList.push(x);
				});
		}
	});
};
$scope.businessTypeList();

$scope.marketList = function(){
	$scope.marketsList = [];
	dbSvc.request('marketList2', {}).then(function(result) {
		if (result.status===true) {
			$scope.fx = {"value":"ALL","label":"ALL"};
			$scope.marketsList.push($scope.fx);
			result.marketsList.forEach(function(x,j){
				$scope.marketsList.push(x);
			});
		}
	});
};
$scope.marketList();

$scope.specialLists = function(){
	$scope.specialList = [];
	dbSvc.request('specialList', {}).then(function(result) {
		if (result.status===true) {
			$scope.fx = {"code":"ALL","label":"ทั้งหมด"};
			$scope.specialList.push($scope.fx);
			for(var i in result.specials) {
				$scope.specialList.push(result.specials[i]);
			}
		}
	});
}
$scope.specialLists();

$scope.selectProvinceLang = function(){
	if($scope.param0.language == 'TH'){
		$scope.provinceList = $scope.provinceListTH;
	}else{
		$scope.provinceList = $scope.provinceListEN;
	}
};

$scope.selectProvinceZoneLang = function(){
	if($scope.param1.language=='TH'){
		$scope.provinceZoneList = $scope.provinceListByzoneTH;
	}else{
		$scope.provinceZoneList = $scope.provinceListByzoneEN;
	}
}

$scope.isHideProduct = function()
    {
        if ($scope.param0.reportType == 'member')
        {
            //console.log($scope.report);
            return true;
        }
        else
        {
            return false;
        }
    };
$scope.isHideBranch =function(){
	if ($scope.param0.codeFrom != $scope.param0.codeTo){
		return true;
	}else{
		return false;
	}
}

	$scope.memberType = [
		{value:'ALL',label:'ทุกประเภท'},
		{value:'VIP',label:'กิติมศักดิ์'},
		{value:'ORDINARY',label:'สามัญ'},
		{value:'EXTRA',label:'สมทบ'},
		{value:'OE',label:'สามัญ,สมทบ'},
	];
	$scope.isActiveList = [
		{value:'ALL',label:'ทั้งหมด'},
		{value:'YES',label:'เฉพาะสมาชิกปัจจุบัน'},
		{value:'NO',label:'เฉพาะสมาชิกหมดสภาพ'}
	];
	$scope.orderByList = [
		{value:'code',label:'รหัสสมาชิก'},
		{value:'name_th',label:'ชื่อภาษาไทย'},
		{value:'name_en',label:'ชื่อภาษาอังกฤษ'}
	];
	$scope.specialList = [{value:'ALL',label:'ทั้งหมด'}];
	$scope.languageList = [{value:'TH',label:'ไทย'},{value:'EN',label:'English'}];
	$scope.order = [{value:'member_name',label:'ชื่อสมาชิก'},
					{value:'member_code',label:'รหัสสมาชิก'},
					{value:'zip_code',label:'รหัสไปรษณีย์'},
					{value:'province',label:'จังหวัด/รหัสสมาชิก'}
	];
	$scope.order1 = [{value:'member_name',label:'ชื่อสมาชิก'},
					{value:'zip_code',label:'รหัสไปรษณีย์'},
					{value:'member_code',label:'รหัสสมาชิก'}
	];
	$scope.domesticList = [{value:'ALL',label:'ทั้งหมด'},
						   {value:'Y',label:'domestic'},
							{value:'N',label:'no domestic'}
	];
	$scope.startLineList = ['1','2','3','4','5'];
	$scope.param0 = {
		reportType:'member',
		product:'',
		codeFrom:'00000',
		codeTo:'99999',
		memberType:'ALL',
		is_active:'YES',
		language:'TH',
		order:'member_name',
		branch:'',
		province:'ALL',
		Inbound:'ALL',
		Outbound:'ALL',
		special:'ALL',
		domestic:'ALL',
		showProd:false,
	};
	$scope.getBranch();
	$scope.param1 = {
		codeFrom:'00000',
		codeTo:'99999',
		businessType:'ALL',
		memberType:'ALL',
		is_active:'YES',
		Inbound:'ALL',
		Outbound:'ALL',
		special:'ALL',
		language:'TH',
		province:'ALL',
		order:'member_name',
		domestic:'ALL',
	};
	$scope.param2 = {
		title1:'',
		title2:'',
		code_from:'00000',
		code_to:'99999',
		type:'ordinary',
		is_active:'YES',
		order_by:'code',
	};
	$scope.selectProvinceZoneLang();
	$scope.param3 = {
		code_from:'00000',
		code_to:'99999',
		type_ordinary:'YES',
		type_extra:'YES',
		type_vip:'YES',
		is_active:'YES',
		doc_no:'ส.อ.อ.9',
		sign_by:'Mr. Somsak Sae-Lim',
	};
	$scope.param4 = {
		codeFrom:'00000',
		codeTo:'99999',
		memberType:'ALL',
		is_active:'ALL',
		language:'TH',
	};

	var doPrintMeetingSign = function(preview) {
		console.log($scope.param2);
	    dbSvc.request('report', {
	      report: 'meeting_sign',
	      title1: $scope.param2.title1,
	      title2: $scope.param2.title2,
	      code_from: $scope.param2.code_from,
	      code_to: $scope.param2.code_to,
	      type: $scope.param2.type,
	      is_active: $scope.param2.is_active,
	      order_by: $scope.param2.order_by,
	    }).then(function(result) {
	      if (result.status === true) {
	        window.open($rootScope.setting.RS_URL + '?uuid=' + result.uuid);
	        return;
	      } else {
	        toaster.pop('warning', '', result.reason);
	      }
	    });
	}
	var doPrintMemberRecord = function(preview) {
	    dbSvc.request('report', {
	      report: 'member_record',
	      code_from: $scope.param3.code_from,
	      code_to: $scope.param3.code_to,
	      type_ordinary: $scope.param3.type_ordinary,
	      type_extra: $scope.param3.type_extra,
	      type_vip: $scope.param3.type_vip,
	      is_active: $scope.param3.is_active,
	      doc_no: $scope.param3.doc_no,
	      sign_by: $scope.param3.sign_by,
	    }).then(function(result) {
	      if (result.status === true) {
	        window.open($rootScope.setting.RS_URL + '?uuid=' + result.uuid);
	        return;
	      } else {
	        toaster.pop('warning', '', result.reason);
	      }
	    });
	}
	var doPrintLabalReport = function(preview){
		if ($scope.param0.reportType == 'member'){
			dbSvc.request('report', {
				report: 'labal_report',
				product_code: '',
				code_from: $scope.param0.codeFrom,
				code_to: $scope.param0.codeTo,
				member_type: $scope.param0.memberType,
				branch_code: $scope.param0.branch,
				is_active: $scope.param0.is_active,
				language: $scope.param0.language,
				order: $scope.param0.order,
				province: $scope.param0.province,
				inbound: $scope.param0.Inbound,
				outbound: $scope.param0.Outbound,
				special: $scope.param0.special,
				domestic: $scope.param0.domestic,
				to_person: $scope.toPerson,
			}).then(function(result){
				if (result.status === true) {
		        window.open($rootScope.setting.RS_URL + '?uuid=' + result.uuid);
		        return;
		      } else {
		        toaster.pop('warning', '', result.reason);
		      }
			});
		}else{
			//console.log($scope.param0.product);
			//console.log(($scope.param0.showProd===true)?'show':'no_show');
			dbSvc.request('report', {
				report: 'labal_report2',
				product_code: $scope.param0.product,
				code_from: $scope.param0.codeFrom,
				code_to: $scope.param0.codeTo,
				member_type: $scope.param0.memberType,
				branch_code: $scope.param0.branch,
				is_active: $scope.param0.is_active,
				language: $scope.param0.language,
				order: $scope.param0.order,
				province: $scope.param0.province,
				inbound: $scope.param0.Inbound,
				outbound: $scope.param0.Outbound,
				special: $scope.param0.special,
				domestic: $scope.param0.domestic,
				show_prod: ($scope.param0.showProd===true)?'show':'no_show',
				to_person: $scope.toPerson,
			}).then(function(result){
				if (result.status === true) {
		        window.open($rootScope.setting.RS_URL + '?uuid=' + result.uuid);
		        return;
		      } else {
		        toaster.pop('warning', '', result.reason);
		      }
			});
		}

	}
	var doPrintMemberData = function(preview){
		console.log($scope.param1);
		dbSvc.request('report',{
			report: 'member_data',
			code_from: $scope.param1.codeFrom,
			code_to: $scope.param1.codeTo,
			business_type: $scope.param1.businessType,
			member_type: $scope.param1.memberType,
			is_active: $scope.param1.is_active,
			inbound: $scope.param1.Inbound,
			outbound: $scope.param1.Outbound,
			special: $scope.param1.special,
			language: $scope.param1.language,
			province: $scope.param1.province,
			zipcode: $scope.param1.zipCode,
			order: $scope.param1.order,
			domestic: $scope.param1.domestic
		}).then(function(result){
			if(result.status===true){
				window.open($rootScope.setting.RS_URL + '?uuid=' + result.uuid);
	        	return;
			}else{
				toaster.pop('warning', '', result.reason);
			}
		});
	}

	var doPrintMemberDataDetail = function(preview){
		console.log($scope.param4);
		dbSvc.request('report',{
			report: 'member_datadetail',
			code_from: $scope.param4.codeFrom,
			code_to: $scope.param4.codeTo,
			member_type: $scope.param4.memberType,
			is_active: $scope.param4.is_active,
			language: $scope.param4.language,
		}).then(function(result){
			if(result.status===true){
				window.open($rootScope.setting.RS_URL + '?uuid=' + result.uuid);
	        	return;
			}else{
				toaster.pop('warning', '', result.reason);
			}
		});
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

	var doExportExcelMemberData = function(exportExcel){
		var param = {
			report: 'member_data',
			code_from: $scope.param1.codeFrom,
			code_to: $scope.param1.codeTo,
			business_type: $scope.param1.businessType,
			member_type: $scope.param1.memberType,
			is_active: $scope.param1.is_active,
			inbound: $scope.param1.Inbound,
			outbound: $scope.param1.Outbound,
			special: $scope.param1.special,
			language: $scope.param1.language,
			province: $scope.param1.province,
			zipcode: ($scope.param1.zipCode == undefined) ? '' : $scope.param1.zipCode,
			order: $scope.param1.order,
			domestic: $scope.param1.domestic
		};
		console.log(param);
		dbSvc.request('exportExcelMemberData', param).then(function(result) {
				if (result.status === true){
						console.log(result);
						var dateNow = js_yyyy_mm_dd_hh_mm_ss ();
						var saveText = "MemberData" + dateNow + ".xls";
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

	var doExportExcelMeetingSign = function(exportExcel){
		var param = {
			title1: $scope.param2.title1,
			title2: $scope.param2.title2,
			code_from: $scope.param2.code_from,
			code_to: $scope.param2.code_to,
			type: $scope.param2.type,
			is_active: $scope.param2.is_active,
			order_by: $scope.param2.order_by
		};
		console.log(param);
		dbSvc.request('exportExcelMeetingSign', param).then(function(result) {
				if (result.status === true){
						console.log(result);
						var dateNow = js_yyyy_mm_dd_hh_mm_ss ();
						var saveText = "MeetingSign" + dateNow + ".xls";
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

	var doExportExcelMemberRecord = function(exportExcel){
		var param = {
			code_from: $scope.param3.code_from,
			code_to: $scope.param3.code_to,
			type_ordinary: $scope.param3.type_ordinary,
			type_extra: $scope.param3.type_extra,
			type_vip: $scope.param3.type_vip,
			is_active: $scope.param3.is_active,
			doc_no: $scope.param3.doc_no,
			sign_by: $scope.param3.sign_by
		};
		dbSvc.request('exportExcelMemberRecord', param).then(function(result) {
				if (result.status === true){
						console.log(result);
						var dateNow = js_yyyy_mm_dd_hh_mm_ss ();
						var saveText = "MemberRecord" + dateNow + ".xls";
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

	$scope.doPrint = function() {
		$scope.canPrint = false;
		if ($scope.currentTab==2) {
			doPrintMeetingSign(false);
		}
	}
	$scope.doPreview = function() {
		$scope.canPreview = false;
		if ($scope.currentTab==2) {
			doPrintMeetingSign(true);
		} else if ($scope.currentTab==3) {
			doPrintMemberRecord(true);
		} else if ($scope.currentTab==0){
			doPrintLabalReport(true);
		} else if ($scope.currentTab==1){
			doPrintMemberData(true);
		} else if ($scope.currentTab==4){
			doPrintMemberDataDetail(true);
		}
	}

	$scope.doExport = function() {
		console.log('Excel');
		if ($scope.currentTab==1) {
			doExportExcelMemberData(true);
		} else if ($scope.currentTab==2) {
			doExportExcelMeetingSign(true);
		} else if ($scope.currentTab==3) {
			doExportExcelMemberRecord(true);
		}
	}

	$scope.validLang = function() {
		if ($scope.param0.reportType == 'member'){
			return false;
		}
		return true;
	}

	$scope.switchTab = function(active) {
		$scope.currentTab = active;
		$scope.canExport = active==4;
		$scope.buttonShow();
	}

	$scope.buttonShow = function(){
    if ($scope.currentTab==0) {
      $scope.disablePButton = {'visibility': 'visible'};
      $scope.disableEButton = {'visibility': 'hidden'};
    }else if($scope.currentTab==1){
      $scope.disablePButton = {'visibility': 'visible'};
      $scope.disableEButton = {'visibility': 'visible'};
    }else if($scope.currentTab==2){
      $scope.disablePButton = {'visibility': 'visible'};
      $scope.disableEButton = {'visibility': 'visible'};
    }else if($scope.currentTab==3){
      $scope.disablePButton = {'visibility': 'visible'};
      $scope.disableEButton = {'visibility': 'visible'};
    }else if($scope.currentTab==4){
      $scope.disablePButton = {'visibility': 'visible'};
      $scope.disableEButton = {'visibility': 'hidden'};
    }
  }

	dbSvc.request('marketList', {}).then(function(result) {
		if (result.status===true) {
			angular.forEach(data, function(item) {
				$scope.inboundList.push({value:item.code,label:item.name});
				$scope.outboundList.push({value:item.code,label:item.name});
			});
		}
	});
	return;
	dbSvc.open().then(function() {
		console.log('DB OPENNED');
		dbSvc.getTable('market').then(function(data){
			angular.forEach(data, function(item){
				if (item.type=='INBOUND') {
					$scope.inboundList.push({value:item.code,label:item.name});
				}
				if (item.type=='INBOUND') {
					$scope.outboundList.push({value:item.code,label:item.name});
				}
			});
		});
		// load specialList
		dbSvc.getTable('specialist').then(function(data){
			angular.forEach(data, function(item){
				$scope.specialList.push({value:item.code,label:item.name});
			});
		});
	});
}]);
;
