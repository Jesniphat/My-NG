angular.module('attaCard', [

]).controller('CardUseCtrl', ['$scope', '$rootScope', 'dbSvc', 'toaster', 'helper',
		'$filter', 'receiptPrintService', '$state', 'cardReaderService', 'ngDialog', 'lovService',
		function($scope, $rootScope, dbSvc, toaster, helper, $filter, receiptPrintService
			, $state, cardReaderService, ngDialog, lovService){

	var cardAccounts = [],
		members = [];
	var cardTypeList = [
		{type:'',img:'img/rapidcard.png'},
		{type:'CORPORATE',img:'img/rapidcard_corporate.png'},
		{type:'FREELANCE',img:'img/rapidcard_freelance.png'}
	];
	var initial =  {
		cardId: '',
		cardCode: '',
		cardType: '',
		accountName: '',
		holderName: '',
		balance: 0,
		numPax: 0,
		unitPrice: 1*$rootScope.config.coupon_price,
		vat_rate: 1*$rootScope.config.vat_rate,
		amount: 0,
		vat: 0,
		total_amount: 0,
		balanceBefore: 0,
		balanceAfter: 0,
		paxBefore:0,
		paxAfter:0,	
	};
	$scope.flagCard = '';
	$scope.nation_name = '';
	$scope.selectDate = $rootScope.period.p_date.substr(2, 10);
	$scope.rvcodeselect = $rootScope.station.code+""+$scope.selectDate+""
						  +($rootScope.period.p_type=='AM' ? 'M' : ($rootScope.period.p_type=='PM' ? 'N' : 'D'));
	console.log($rootScope.period.p_date);
	console.log($scope.rvcodeselect);
	$scope.showLovInform = function($event) {
		console.log('showLovInform');
		if ($event.keyCode != 32) {
			return;
		}
		if (typeof $scope.carddb.acc_code==='undefined'
			|| $scope.carddb.acc_code==''
			) {
			return;
		}
		//$scope.carddb.acc_code = 'F00015';

		lovService.showLov($scope, 'lov_inform_active', {cache:false, acc_code:$scope.carddb.acc_code, card_code:$scope.carddb.code}).then(function(result) {
			if (result===null) {
				$scope.inform = {};
				$scope.selectedInform = '';
				$scope.flight_name = '';
				$scope.cardUse.numPax = 0;
				$scope.cardUse.paxAfter = $scope.cardUse.paxBefore*1;			
				$scope.member_name = '';
				$scope.nation_name = '';
				setTimeout(function() {
					angular.element('#inform').focus();
				}, 0);
				return;
			}

			// show inform
			$scope.inform = angular.copy(result);
			$scope.selectedInform = result.code;
			$scope.flight_name = $scope.inform.flight + ' on ' + $scope.inform.flight_date.substr(0, 16);
			$scope.cardUse.numPax = $scope.inform.total_pax;
			$scope.cardUse.paxAfter = 1*$scope.cardUse.paxBefore - $scope.inform.total_pax;
			$scope.member_name = result.mem_code+':'+result.mem_name_en;
			$scope.nation_name = result.nation + ':' + result.nation_en;
			setTimeout(function() {
				angular.element('#save').focus();
			}, 0);
		});
	}
	$scope.hiddenRefCode = function() {
		//console.log($scope.selectedInform);
		if($scope.selectedInform==''){
			return true;
		}else{
			return false;
		}
	}

	$scope.checkMe = function(){
		//console.log($scope.selectedInform);
		$scope.hiddenRefCode();
	}

	$scope.isValid = function(form) {
		if (form.$invalid || 1*$scope.cardUse.balanceAfter < 0 || typeof $scope.inform=='undefined' || $scope.inform.uuid=='') {
			return false;
		}
		return true;
	}
	$scope.save = function() {
		if ($scope.cardAccount == null) {
			toaster.pop('warning', 'เกิดข้อผิดพลาด', 'ไม่พบบัญชีของบัตร');
			return;
		}
		if ($scope.inform.uuid == 'undefined' || $scope.inform.uuid=='') {
			toaster.pop('warning', 'เกิดข้อผิดพลาด', 'ไม่พบใบรับแจ้ง');
			return;
		}

		if (1.0*$scope.cardUse.paxAfter < 0) {
			toaster.pop('warning', 'เกิดข้อผิดพลาด', 'จำนวนคงเหลือในบัญชีไม่พอจ่าย');
			return;		
		}
		$scope.isValid = false;
		var param = {
			card_code: $scope.carddb.code,
			acc_code: $scope.cardAccount.code,
			inform_code: $scope.inform.code,
			inform_ref_code: $scope.inform.ref_code,
			selectperiodx: $scope.rvcodeselect,
		};

	    setTimeout(function() {
	      angular.element('#reset').focus();
	    }, 0);

		dbSvc.request('cardUse', param).then(function(result) {
			if (result.status===true) {
				toaster.pop('success', '', 'บันทึกข้อมูลเรียบร้อยแล้ว');
				receiptPrintService.printBill(result.bill,1).then(function(){
					console.log("ปริ้นแล้ว");//$scope.reset();
				});
				$scope.reset();
			} else {
				var e1 = (result.reason===null) ? '' : result.reason;
				var e2 = (result.myError===null) ? '' : result.myError;
				//console.log(e1,e2);
				toaster.pop('warning', '', e1 +''+ e2);
			}
			$scope.isValid = function(form) {
                if (form.$invalid || 1*$scope.cardUse.balanceAfter < 0 || typeof $scope.inform=='undefined' || $scope.inform.uuid=='') {
                    return false;
                }
                return true;
            };
		});
	}
	$scope.jCheck = function(){
		var param = {
			card_code: $scope.carddb.code,
			acc_code: $scope.cardAccount.code,
			inform_code: $scope.inform.code,
			inform_ref_code: $scope.inform.ref_code,
		};
		console.log(param);
	}

	var flipTo = function(idx) {
		// prepare back image to show
		angular.element('.ns-front img').attr({src:angular.element('.ns-cover img').attr('src')});
		angular.element('.ns-back .card-type').html(cardTypeList[idx].type);
		angular.element('.ns-back .card-code').html($scope.carddb.card_number);
		angular.element('.ns-back .card-name').html($scope.carddb.holder_name);
		angular.element('.ns-back .card-corp').html(cardTypeList[idx].type=='CORPORATE' ? $scope.cardAccount.name_th : '');
		angular.element('.ns-back img').attr({src:cardTypeList[idx].img});
		// start animation
		angular.element('.ns-wrapper').addClass('ns-perspective');
		angular.element('.ns-cover').addClass('ns-hide');
		angular.element('.ns-transition').addClass('ns-show');
		// update image cover image
		angular.element('.ns-cover .card-type').html(cardTypeList[idx].type);
		angular.element('.ns-cover .card-code').html($scope.carddb.card_number);
		angular.element('.ns-cover .card-name').html($scope.carddb.holder_name);
		angular.element('.ns-cover .card-corp').html(cardTypeList[idx].type=='CORPORATE' ? $scope.cardAccount.name_th : '');
		angular.element('.ns-cover img').attr({src:cardTypeList[idx].img});
	}
	
	$scope.reset = function() {
		$scope.cardUse = angular.copy(initial);
		$scope.cardAccount = {};
		$scope.inform = {uuid:''};
		$scope.informList = [];
		$scope.member = {selected:{address:[]}};
		$scope.memberResult = [];

		$scope.selectedInform = '';
		$scope.member_name = '';
		$scope.nation_name = '';
		$scope.flight_name = '';
		//$scope.flagCard = '';
		$scope.carddb = {};
		$scope.carddb.card_number = '';
		$scope.carddb.holder_name = '';
		flipTo(0);
		//$scope.selectedInform = '';

		cardReaderService.readCardInfo().then(function(info) {
			if (info.carddb == null) {
				flipTo(0);
				return false;
			}
			
			if (!info.carddb.is_active) {
				toaster.pop('warning', 'บัตรยังไม่ถูกเปิดใช้งาน',
					'กรุณาตรวจสอบ\nหมายเลขบัตร:' + info.carddb.card_number + '\n' + 
					'ประเภทบัตร:' + info.carddb.type, 10000);
				flipTo(0);
				return false;
			}

			$scope.carddb = angular.copy(info.carddb);
			$scope.cardAccount = angular.copy(info.cardAccount);

			$scope.cardUse.cardId = info.carddb.code;
			$scope.cardUse.cardCode = info.carddb.card_number;
			$scope.cardUse.cardType = info.carddb.type;
			$scope.cardUse.holderName = info.carddb.holder_name;

			$scope.cardUse.accountName = info.cardAccount.name_th;
			$scope.cardUse.balanceBefore = parseInt(info.cardAccount.balance);
			$scope.cardUse.paxBefore = parseInt(info.cardAccount.balance);
			$scope.informList = [];
			
			flipTo($scope.carddb.type=='CORPORATE'?1:2);
			// dbSvc.request('informListByCard', {card_code:$scope.carddb.code}).then(function(result) {
			// 	if (result.status===true) {
			// 		result.informs.forEach(function(inform) {
			// 			$scope.informList.push(inform);
			// 		});
			// 		if ($scope.informList.length > 0) {
			// 			$scope.inform = $scope.informList[0];
			// 			$scope.changeInform();
			// 		}
			// 	} else {
			// 		toaster.pop('warning', '', result.reason);
			// 	}
			// });
		});
		
		dbSvc.request('nextCode', {table:'usage'}).then(function(result) {
			if (result.status===true) {
				$scope.cardIssue.receiptCode = result.code;
			}
		});
	}

	$scope.reset();
		
	setTimeout(function(){
		angular.element('.ns-wrapper').on('webkitAnimationStart', function() {
		}).on('webkitAnimationEnd', function() {
			angular.element('.ns-cover').removeClass('ns-hide');
			angular.element('.ns-wrapper').removeClass('ns-perspective');
			angular.element('.ns-transition').removeClass('ns-show');
		});
	},0);
}]).controller('CardIssueCtrl', [
		'$scope', '$state', '$rootScope', 'dbSvc', 'toaster', '$filter', 'helper', 
		'receiptPrintService', 'cardReaderService', 'ngDialog',
		function($scope, $state, $rootScope, dbSvc, toaster, $filter, helper, 
			receiptPrintService, cardReaderService, ngDialog){
	//////////////////////////////////////////////////////////////////////////////
	// CardIssueCtrl
	//////////////////////////////////////////////////////////////////////////////

	var cardTypeList = [
		{type:'',img:'img/rapidcard.png'},
		{type:'CORPORATE',img:'img/rapidcard_corporate.png'},
		{type:'FREELANCE',img:'img/rapidcard_freelance.png'}
	];

	var vatRate = parseFloat($rootScope.config.vat_rate);
	var cardPrice = parseFloat($rootScope.config.card_price);
	var billAmount = parseFloat((cardPrice*100/(100 + vatRate)).toFixed(2));
	var vatAmount = parseFloat((billAmount*vatRate/100).toFixed(2));
	var initial = {
		holderName:'',
		receipt:'',
		memberAddress:'',
		billAddress:'',
		billAmount:billAmount,
		vatRate:parseInt(vatRate*100)/100.0,
		vatAmount:vatAmount,
		billTotal:parseInt(cardPrice*100)/100.0,
		carddb:{},
		cardAccount:{},
		member:{},
	}

	$scope.carddb = {};
	$scope.cardAccount = {};
	$scope.member = {};
	$scope.memberAddresses = [];
	$scope.selectedCardAccount = '';
	$scope.selectedMember = '';

	
	$scope.showLovCardAccount = function($event) {
		if ($event.keyCode != 32) {
			return;
		}
		if (typeof $scope.carddb.type == 'undefined') {
			return;
		}

		$scope.lovQuery = "SELECT code, name_en, name_th, mem_code, balance, uuid FROM card_account "
			+ " WHERE type='"+$scope.carddb.type+"' AND is_active='YES' ORDER BY name_en";
		$scope.fields = [
			{name:'uuid', text:'', hidden:true},
			{name:'mem_code', text:'', hidden:true},
			{name:'code', text:'',hidden:true},
			{name:'name_en', text:'ชื่อสมาชิก (อังกฤษ)'},
			{name:'name_th', text:'ชื่อสมาชิก (ไทย)'},
			{name:'balance',text:'PAX คงเหลือ'},
		];
		ngDialog.open({
			template: 'views/lov.html',
			controller: 'LovDialogCtrl',
			className: 'ngdialog-theme-default ngdialog-theme-lov',
			scope:$scope,
		}).closePromise.then(function(result) {
			if (result.value=='$closeButton' || typeof result.value==='undefined') {
				setTimeout(function() {
					angular.element('#cardAccount').focus().select();
				}, 0);
				return;
			}
			$scope.cardAccount = angular.copy(result.value);
			$scope.selectedCardAccount = $scope.cardAccount.code + ':' + $scope.cardAccount.name_th;
			$scope.cardIssue.holderName = $scope.cardAccount.name_th;

			if ($scope.carddb.type=='CORPORATE') {
				dbSvc.request('memberByCode', {code:result.value.mem_code}).then(function(result) {
					if (result.status===true) {
						$scope.member = angular.copy(result.member);
						$scope.selectedMember = $scope.member.code+':'+$scope.member.name_en;
						changeMember();
					}
				});
			}
			setTimeout(function() {
				angular.element('#cardHolder').focus().select();
			}, 0);
		});
	}

	$scope.showLovMember = function($event) {
		if ($event.keyCode != 32) {
			return;
		}
		if ($scope.carddb.type=='CORPORATE') {
			return;
		}

		$scope.lovQuery = "SELECT code, name_en, name_th, type, "
			+ "IF(type='ORDINARY','สามัญ',IF(type='EXTRA','สมทบ',IF(type='VIP','กิติมศักดิ์','เงินสด'))) type_name, "
			+ "uuid FROM member "
			+ " WHERE is_active='YES' ORDER BY name_en";
		$scope.fields = [
			{name:'uuid', text:'', hidden:true},
			{name:'mem_code', text:'', hidden:true},
			{name:'code', text:'',hidden:true},
			{name:'name_en', text:'ชื่อสมาชิก (อังกฤษ)'},
			{name:'name_th', text:'ชื่อสมาชิก (ไทย)'},
			{name:'type',text:'',hidden:true},
			{name:'type_name',text:'ประเภทสมาชิก'},
		];
		ngDialog.open({
			template: 'views/lov.html',
			controller: 'LovDialogCtrl',
			className: 'ngdialog-theme-default ngdialog-theme-lov',
			scope:$scope,
		}).closePromise.then(function(result) {
			if (result.value=='$closeButton' || typeof result.value==='undefined') {
				setTimeout(function() {
					angular.element('#member').focus().select();
				}, 0);
				return;
			}

			dbSvc.request('memberByUuid', {uuid:result.value.uuid}).then(function(result) {
				if (result.status===true) {
					$scope.member = angular.copy(result.member);
					$scope.selectedMember = $scope.member.code+':'+$scope.member.name_en;
					changeMember();
				}
			});
		});
	}

	var changeMember = function() {
		var member = $scope.member;
		var out = [];

		for(var i = 0; i < member.addresses.length; i++) {
			var addr = [];
			
			if (member.addresses[i].addr1) {
				addr.push(member.addresses[i].addr1.trim());
			}
			
			if (member.addresses[i].addr2) {
				addr.push(member.addresses[i].addr2.trim());
			}
			
			addr.push(((member.addresses[i].tambon + ' ' + member.addresses[i].amphur).trim()
					 + ' ' + member.addresses[i].province + ' ' + member.addresses[i].zipcode).trim());
			
			out.push({
				code:member.addresses[i].code,
				name:member.addresses[i].name,
				addr:addr.join('\r\n'),
				lang:member.addresses[i].lang,
			});
		}

		$scope.memberAddresses = out;
		
		if (out.length > 0) {
			$scope.memberAddress = $scope.memberAddresses[0];
			setTimeout(function() {
				angular.element('#corp_addr').focus();
			}, 0);
		}
	}

	$scope.test = function(){
		console.log($scope.cardIssue.cardNumText);
	}
	
	$scope.save = function() {
		var addr = {
			code: $scope.memberAddress.code,
			name: $scope.memberAddress.name,
			addr: $scope.memberAddress.addr.replace(/\s+/g, ' '),
			lang: $scope.memberAddress.lang,
		};

    setTimeout(function() {
      angular.element('#reset').focus();
    }, 0);

		dbSvc.request('cardIssue', {
			card_code:$scope.carddb.code,
			holder_name:$scope.cardIssue.holderName,
			acc_code:$scope.cardAccount.code,
			cardNo:$scope.cardIssue.cardNumText,
			mem_code:$scope.member.code,
			address:addr,
		}).then(function(result) {
			if (result.status===true) {
				toaster.pop('success', '', 'ออกบัตรเรียบร้อยแล้ว');
				$scope.cardIssue.receiptCode=result.receipt_code;

				// PRINT RECEIPT
				receiptPrintService.printReceipt(result.receipt_code, 1);
			} else {
				toaster.pop('warning', '', result.reason);
			}
		});
	};

	var flipTo = function(idx) {
		// prepare back image to show
		angular.element('.ns-front img').attr({src:angular.element('.ns-cover img').attr('src')});
		angular.element('.ns-back .card-type').html(cardTypeList[idx].type);
		angular.element('.ns-back .card-code').html($scope.carddb.card_number);
		angular.element('.ns-back .card-name').html($scope.carddb.holder_name);
		angular.element('.ns-back .card-corp').html(cardTypeList[idx].type=='CORPORATE' ? $scope.cardIssue.cardAccount.name_th : '');
		angular.element('.ns-back img').attr({src:cardTypeList[idx].img});
		// start animation
		angular.element('.ns-wrapper').addClass('ns-perspective');
		angular.element('.ns-cover').addClass('ns-hide');
		angular.element('.ns-transition').addClass('ns-show');
		// update image cover image
		angular.element('.ns-cover .card-type').html(cardTypeList[idx].type);
		angular.element('.ns-cover .card-code').html($scope.carddb.card_number);
		angular.element('.ns-cover .card-name').html($scope.carddb.holder_name);
		angular.element('.ns-cover .card-corp').html(cardTypeList[idx].type=='CORPORATE' ? $scope.cardIssue.cardAccount.name_th : '');
		angular.element('.ns-cover img').attr({src:cardTypeList[idx].img});
	}

	$scope.reset = function() {
		$scope.cardIssue = angular.copy(initial);
		$scope.carddb = {};
		$scope.cardAccount = {};
		$scope.member = {};
		$scope.memberAddresses = [];
		$scope.selectedCardAccount = '';
		$scope.selectedMember = '';
		
		cardReaderService.readCardInfo().then(function(info) {
			if (info.carddb == null) {
				flipTo(0);
				return false;
			}
			
			if (info.carddb.is_cancel=='YES') {
				toaster.pop('warning', 'บัตรถูกยกเลิกการใช้งานแล้ว', 'กรุณาตรวจสอบ\nหมายเลขบัตร:' + info.carddb.card_number
					+ '\nประเภทบัตร: ' + info.carddb.type
					+ '\nชื่อบนบัตร: ' + info.carddb.holder_name
					+ '\nวันที่ยกเลิก: ' + info.carddb.cancel_date
					+ '\nสาเหตุ: ' + info.carddb.cancel_reason, 10000);
				flipTo(0);
				return;
			}

			if (info.carddb.is_active=='YES') {
				toaster.pop('warning', 'บัตรถูกเปิดใช้งานแล้ว', 'กรุณาตรวจสอบ\nหมายเลขบัตร:' + info.carddb.card_number
					+ '\nประเภทบัตร: ' + info.carddb.type
					+ '\nชื่อบนบัตร: ' + info.carddb.holder_name
					+ '\nวันที่เปิดใช้งาน: ' + info.carddb.issue_date, 10000);
				flipTo(0);
				return;
			}

			$scope.carddb = angular.copy(info.carddb);
			flipTo(info.carddb.type=='CORPORATE' ? 1 : 2);

			dbSvc.request('nextCode', {table:'receipt'}).then(function(result) {
				if (result.status===true) {
					$scope.cardIssue.receiptCode = result.code;
				}
			});
		});

		setTimeout(function() {
			angular.element('[autofocus] input').focus().select();
		},0);
	};

	$scope.printReceipt = function() {
		receiptPrintService.printReceipt($scope.cardIssue.receipt.uuid, 1);
	}

	$scope.reset();

	setTimeout(function(){
		angular.element('.ns-wrapper').on('webkitAnimationStart', function() {
		}).on('webkitAnimationEnd', function() {
			angular.element('.ns-cover').removeClass('ns-hide');
			angular.element('.ns-wrapper').removeClass('ns-perspective');
			angular.element('.ns-transition').removeClass('ns-show');
		});
	},0);
}]).controller('CardTopupCtrl',['$scope', '$rootScope', '$state', 'dbSvc', 'toaster',
		'helper', '$filter', 'receiptPrintService', 'cardReaderService', 'ngDialog', 
		function($scope, $rootScope, $state, dbSvc, toaster,
		 	helper, $filter, receiptPrintService, cardReaderService, ngDialog){
////////////////////////////////////////////////////////////////////////////////
// CardTopupCtrl
////////////////////////////////////////////////////////////////////////////////

	var cardTypeList = [
		{type:'',img:'img/rapidcard.png'},
		{type:'CORPORATE',img:'img/rapidcard_corporate.png'},
		{type:'FREELANCE',img:'img/rapidcard_freelance.png'}
	];

	$scope.currentPage = 0;
	$scope.pageSize = 10;
	$scope.numPages = function() {
		return $scope.cardTx.length;
	}
	$scope.cardTx = [];
	
	$scope.carddb = null;
	$scope.cardAccount = null;
	$scope.memberAddress = {};
	$scope.cardAccounts = [];
	$scope.memberAddresses = [];
	$scope.member = null;
	$scope.selectedMember = '';

	var initial = {
		receiptCode:'',
		paymentType:'CASH',
		cardId:'',
		cardCode:'',
		cardType:'',
		accountName:'',
		holderName:'',
		balance:0,
		amount:0,
		balanceAfter:0,
		vatRate:1*$rootScope.config.vat_rate,
		vatAmount:0,
		totalAmount:0,
	};

	$scope.changeAddress = function() {
		$scope.cardTopup.receiptAddress = $scope.memberAddress.addr;
		setTimeout(function() {
			angular.element('#numPax').focus().select();
		},0);
	}
	$scope.paxChange = function() {
		var topupAmount = $scope.cardTopup.pax * $rootScope.config.coupon_price;
		$scope.cardTopup.amount = topupAmount;
		$scope.cardTopup.paxAfter = 1*$scope.cardTopup.paxBefore + $scope.cardTopup.pax;
		$scope.cardTopup.vatAmount = topupAmount * $scope.cardTopup.vatRate / 100.0;
		$scope.cardTopup.totalAmount = topupAmount + $scope.cardTopup.vatAmount;
	}

	var changeMember = function() {
		var member = $scope.member;
		var out = [];
		for(var i = 0; i < member.addresses.length; i++) {
			var addr = [];
			if (member.addresses[i].addr1) {
				addr.push(member.addresses[i].addr1.trim());
			}
			if (member.addresses[i].addr2) {
				addr.push(member.addresses[i].addr2.trim());
			}
			addr.push(((member.addresses[i].tambon + ' ' + member.addresses[i].amphur).trim()
					 + ' ' + member.addresses[i].province + ' ' + member.addresses[i].zipcode).trim());
			out.push({
				code:member.addresses[i].code,
				name:member.addresses[i].name,
				addr:addr.join('\r\n'),
				lang:member.addresses[i].lang,
			});
		}
		$scope.memberAddresses = out;
		if (out.length > 0) {
			$scope.memberAddress = $scope.memberAddresses[0];
			$scope.changeAddress();
		}
	}
	$scope.Jtest = function() {
		if ($scope.cardAccount == null) {
			toaster.pop('warning', 'เกิดข้อผิดพลาด', 'ไม่พบบัญชีของบัตร');
			return;
		}

		var topupPax = parseFloat($scope.cardTopup.pax);
		if (isNaN(topupPax) || topupPax <= 0) {
			toaster.pop('warning', 'เกิดข้อผิดพลาด', 'จำนวนเงินไม่ถูกต้อง');
			return;
		}

		var addr = {
			code: $scope.memberAddress.code,
			name: $scope.memberAddress.name,
			addr: $scope.memberAddress.addr.replace(/\s+/g, ' '),
			lang: $scope.memberAddress.lang,
		};
		var param = {
			card_code:$scope.carddb.code,
			acc_code:$scope.cardAccount.code,
			mem_code:$scope.member.code,
			address:addr,
			pax:topupPax,
			payment_type:$scope.cardTopup.paymentType,
			amount:$scope.cardTopup.totalAmount,
		};
		console.log(param);
	}
	$scope.save = function() {

		if ($scope.cardAccount == null) {
			toaster.pop('warning', 'เกิดข้อผิดพลาด', 'ไม่พบบัญชีของบัตร');
			return;
		}

		var topupPax = parseFloat($scope.cardTopup.pax);
		if (isNaN(topupPax) || topupPax <= 0) {
			toaster.pop('warning', 'เกิดข้อผิดพลาด', 'จำนวนเงินไม่ถูกต้อง');
			return;
		}

		var addr = {
			code: $scope.memberAddress.code,
			name: $scope.memberAddress.name,
			addr: $scope.memberAddress.addr.replace(/\s+/g, ' '),
			lang: $scope.memberAddress.lang,
		};
		var param = {
			card_code:$scope.carddb.code,
			acc_code:$scope.cardAccount.code,
			mem_code:$scope.member.code,
			address:addr,
			pax:topupPax,
			payment_type:$scope.cardTopup.paymentType,
			amount:$scope.cardTopup.totalAmount,
		};
		if ($scope.cardTopup.paymentType=='CHEQUE') {
			param.cheque_bank = $scope.bank.code;
			param.cheque_branch = $scope.cardTopup.paymentBranch;
			param.cheque_number = $scope.cardTopup.paymentChequeNo;
			param.cheque_date = $scope.cardTopup.paymentChequeDate;
		}
		$scope.reset();
		dbSvc.request('cardTopup', param).then(function(result) {
			if (result.status===true) {
				toaster.pop('success', '', 'เติม PAX เรียบร้อยแล้ว');

				receiptPrintService.printReceipt(result.receipt_code, 1);
				console.log(result.receipt_code);

			} else {
				toaster.pop('warning', '', 'เติม PAX ไม่สำเร็จ');
			}
		});
	}
	$scope.printReceipt = function() {
		receiptPrintService.printReceipt($scope.cardTopup.receipt.uuid, 1);
	}
	
	$scope.isValid = function(form) {
		if (form.$invalid) {
			return false;
		} else {
			var topupAmount = parseFloat($scope.cardTopup.amount);
			if (isNaN(topupAmount) || topupAmount <= 0) {
				return false;
			}
		}
		return true;
	}
	var flipTimer = null;
	var flipTo = function(idx) {
		// prepare back image to show
		angular.element('.ns-front img').attr({src:angular.element('.ns-cover img').attr('src')});
		angular.element('.ns-back .card-type').html(cardTypeList[idx].type);
		angular.element('.ns-back .card-code').html($scope.carddb.card_number);
		angular.element('.ns-back .card-name').html($scope.carddb.holder_name);
		angular.element('.ns-back .card-corp').html(cardTypeList[idx].type=='CORPORATE' ? $scope.cardAccount.name_th : '');
		angular.element('.ns-back img').attr({src:cardTypeList[idx].img});
		// start animation
		angular.element('.ns-wrapper').addClass('ns-perspective');
		angular.element('.ns-cover').addClass('ns-hide');
		angular.element('.ns-transition').addClass('ns-show');
		// update image cover image
		angular.element('.ns-cover .card-type').html(cardTypeList[idx].type);
		angular.element('.ns-cover .card-code').html($scope.carddb.card_number);
		angular.element('.ns-cover .card-name').html($scope.carddb.holder_name);
		angular.element('.ns-cover .card-corp').html(cardTypeList[idx].type=='CORPORATE' ? $scope.cardAccount.name_th : '');
		angular.element('.ns-cover img').attr({src:cardTypeList[idx].img});
	}

	$scope.reset = function() {
		// read card
		$scope.cardTopup = angular.copy(initial);
		$scope.member = null;
		$scope.selectedMember = '';
		$scope.carddb = {};
		$scope.carddb.card_number = '';
		$scope.carddb.holder_name = '';
		flipTo(0);

		cardReaderService.readCardInfo().then(function(info) {
			console.log('card info = ', info);

			if (info.carddb == null) {
				flipTo(0);
				return false;
			}
			
			if (!info.carddb.is_active) {
				toaster.pop('warning', 'บัตรยังไม่ถูกเปิดใช้งาน',
					'กรุณาตรวจสอบ\nหมายเลขบัตร:' + info.carddb.card_number + '\n' + 
					'ประเภทบัตร:' + info.carddb.type, 10000);
				flipTo(0);
				return false;
			}

			$scope.carddb = angular.copy(info.carddb);
			$scope.cardAccount = angular.copy(info.cardAccount);

			$scope.cardTopup.paxBefore = 1*info.cardAccount.balance;

			$scope.memberAddresses = [];

			if (info.carddb.type=='CORPORATE') {
				$scope.member = angular.copy(info.member);
				$scope.selectedMember = $scope.member.code+':'+$scope.member.name_en;
				changeMember();
			}

			flipTo(info.carddb.type=='CORPORATE' ? 1 : 2);

			dbSvc.request('nextCode', {table:'receipt'}).then(function(result) {
				if (result.status===true) {
					$scope.cardTopup.receiptCode = result.code;
				}
			});

			$scope.cardTx = [];
			dbSvc.request('cardAccountTxList', {acc_code:$scope.cardAccount.code, limit:$scope.pageSize}).then(function(result) {
				if (result.status===true) {
					$scope.cardTx = angular.copy(result.card_account_tx);
				}
			});
			setTimeout(function() {
				if ($scope.carddb.type=='CORPORATE') {
					angular.element('#numPax').focus();
				} else {
					angular.element('#member').focus();
				}
			}, 0);
		});
	}

  $scope.showLovBank = function($event) {
    if ($event.keyCode != 32) {
      return;
    }

    $scope.lovQuery = 'SELECT code, name FROM bank ORDER BY name';
    $scope.fields = [
      {name:'code',text:'รหัส'},
      {name:'name',text:'ธนาคาร'},
    ];

    ngDialog.open({
      template: 'views/lov.html',
      controller: 'LovDialogCtrl',
      className: 'ngdialog-theme-default ngdialog-theme-lov',
      scope:$scope,
    }).closePromise.then(function(result) {
      if (result.value=='$closeButton' || typeof result.value==='undefined') {
        setTimeout(function() {
          angular.element('#bank').focus().select();
        }, 0);
        return;
      }

      $scope.selectedBank = result.value.code+':'+result.value.name;
      $scope.bank = result.value;
      setTimeout(function() {
        angular.element('#branch').focus().select();
      },0);
    }); 
  }


	$scope.showLovMember = function($event) {
		if ($event.keyCode != 32) {
			return;
		}
		if ($scope.carddb.type=='CORPORATE') {
			return;
		}

		$scope.lovQuery = "SELECT code, name_en, name_th, type, "
			+ "IF(type='ORDINARY','สามัญ',IF(type='EXTRA','สมทบ',IF(type='VIP','กิติมศักดิ์','เงินสด'))) type_name, "
			+ "uuid FROM member "
			+ " WHERE is_active='YES' ORDER BY name_en";
		$scope.fields = [
			{name:'uuid', text:'', hidden:true},
			{name:'mem_code', text:'', hidden:true},
			{name:'code', text:'',hidden:true},
			{name:'name_en', text:'ชื่อสมาชิก (อังกฤษ)'},
			{name:'name_th', text:'ชื่อสมาชิก (ไทย)'},
			{name:'type',text:'',hidden:true},
			{name:'type_name',text:'ประเภทสมาชิก'},
		];
		ngDialog.open({
			template: 'views/lov.html',
			controller: 'LovDialogCtrl',
			className: 'ngdialog-theme-default ngdialog-theme-lov',
			scope:$scope,
		}).closePromise.then(function(result) {
			if (result.value=='$closeButton' || typeof result.value==='undefined') {
				setTimeout(function() {
					angular.element('#member').focus().select();
				}, 0);
				return;
			}

			dbSvc.request('memberByUuid', {uuid:result.value.uuid}).then(function(result) {
				if (result.status===true) {
					$scope.member = angular.copy(result.member);
					console.log($scope.member);
					$scope.selectedMember = $scope.member.code+':'+$scope.member.name_en;
					changeMember();
				}
			});
		});
	}


	$scope.reset();

	setTimeout(function(){
		angular.element('.ns-wrapper').on('webkitAnimationStart', function() {
		}).on('webkitAnimationEnd', function() {
			console.log('animationEnd');
			angular.element('.ns-cover').removeClass('ns-hide');
			angular.element('.ns-wrapper').removeClass('ns-perspective');
			angular.element('.ns-transition').removeClass('ns-show');
		});
	},0);

}]).controller('CardAdjustCtrl', ['$scope', '$rootScope', 'dbSvc', 'toaster', 'helper'
	, '$filter', '$stateParams', 'cardReaderService'
	, function($scope, $rootScope, dbSvc, toaster, helper, $filter, $stateParams, cardReaderService){

	console.log('stateParams=', $stateParams);

	var cardTypeList = [
		{type:'',img:'img/rapidcard.png'},
		{type:'CORPORATE',img:'img/rapidcard_corporate.png'},
		{type:'FREELANCE',img:'img/rapidcard_freelance.png'}
	];
	$scope.currentPage = 0;
	$scope.pageSize = 20;
	$scope.numPages = function() {
		return $scope.cardTx.length;
	}
	$scope.carddb = {};
	$scope.cardAccount = {};
	$scope.cardTx = [];
	$scope.cardAdjust = {};
	$scope.cardAdjust.adjustType=$stateParams.type;

	$scope.updateBalanceAfter = function() {
		var before = (isNaN(1*$scope.cardAdjust.balanceBefore)?0:(1*$scope.cardAdjust.balanceBefore));
		var pax = isNaN(1*$scope.cardAdjust.pax) ? 0 : 1*$scope.cardAdjust.pax;
		$scope.cardAdjust.balanceAfter= before +($scope.cardAdjust.adjustType=='MINUS'?-1:1)*pax;
	}
	
	$scope.save = function() {
		if ($scope.cardAccount == null) {
			toaster.pop('warning', 'เกิดข้อผิดพลาด', 'ไม่พบบัญชีของบัตร');
			return;
		}
		var before = (isNaN(1*$scope.cardAdjust.balanceBefore)?0:(1*$scope.cardAdjust.balanceBefore));
		var pax = isNaN(1*$scope.cardAdjust.pax) ? 0 : 1*$scope.cardAdjust.pax;
		var after = before +($scope.cardAdjust.adjustType=='MINUS'?-1:1)*pax;

		if (pax <= 0) {
			toaster.pop('warning', 'เกิดข้อผิดพลาด', 'จำนวน PAX ไม่ถูกต้อง (ต้องเป็นจำนวนบวก)');
			return;
		}
		if (after < 0) {
			toaster.pop('warning', 'เกิดข้อผิดพลาด', 'จำนวนคงเหลือติดลบไม่ได้');
			return;
		}

		console.log('adjustPax=', pax);
		console.log('cardAccount', $scope.cardAccount);

		dbSvc.request('cardAdjust', {
			acc_code:$scope.cardAccount.code,
			card_code:$scope.carddb.code,
			type:$scope.cardAdjust.adjustType,
			pax:pax,
		}).then(function(result) {
			console.log('result', result);
			if (result.status===true) {
				toaster.pop('success', '', 'ปรับยอดเรียบร้อยแล้ว');
				$scope.reset();
			} else {
				toaster.pop('warning', '', result.reason);
			}
		});


		return;
		var txDate = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
		$scope.cardAccount.balance = 1.0*$scope.cardAccount.balance + adjustPax;
		$scope.cardAccount.sync = 0;
		dbSvc.saveData('card_account', $scope.cardAccount).then(function(result) {
			return dbSvc.saveData('card_account_tx', {
				uuid:helper.newUUID(),
				account_uuid:$scope.cardAccount.uuid,
				card_id: $scope.carddb.code,
				staff_uuid:$rootScope.sessionStaff.uuid,
				ref1_uuid:'', // TODO: add taxInvoiceUUID or receiptUUID
				ref2_uuid:'',
				tx_date:txDate,
				tx_type:'ADJUST',
				amount:adjustPax,
				balance:$scope.cardAccount.balance,
				remark:'ADJUST='+adjustPax+', REASON='+$scope.cardAdjust.reason+', CARDDB=' + $filter('json')($scope.carddb),
				sync:0,
			});
		}, function(e) {
			toaster.pop('warning', 'เกิดข้อผิดพลาด', 'บันทึกไม่สำเร็จ');
		}).then(function(result) {
			toaster.pop('success', '', 'แก้ไขยอดเงินเรียบร้อยแล้ว');
		});
	}
	var flipTo = function(idx) {
		// prepare back image to show
		angular.element('.ns-front img').attr({src:angular.element('.ns-cover img').attr('src')});
		angular.element('.ns-back .card-type').html(cardTypeList[idx].type);
		angular.element('.ns-back .card-code').html($scope.carddb.card_number);
		angular.element('.ns-back .card-name').html($scope.carddb.holder_name);
		angular.element('.ns-back .card-corp').html(cardTypeList[idx].type=='CORPORATE' ? $scope.cardAccount.name_th : '');
		angular.element('.ns-back img').attr({src:cardTypeList[idx].img});
		// start animation
		angular.element('.ns-wrapper').addClass('ns-perspective');
		angular.element('.ns-cover').addClass('ns-hide');
		angular.element('.ns-transition').addClass('ns-show');
		// update image cover image
		angular.element('.ns-cover .card-type').html(cardTypeList[idx].type);
		angular.element('.ns-cover .card-code').html($scope.carddb.card_number);
		angular.element('.ns-cover .card-name').html($scope.carddb.holder_name);
		angular.element('.ns-cover .card-corp').html(cardTypeList[idx].type=='CORPORATE' ? $scope.cardAccount.name_th : '');
		angular.element('.ns-cover img').attr({src:cardTypeList[idx].img});
	}
	var refreshTxList = function() {
		$scope.cardTx = [];
		dbSvc.request('cardAccountTxList', {acc_code:$scope.cardAccount.code, limit:200}).then(function(result) {
			if (result.status===true) {
				$scope.cardTx = angular.copy(result.card_account_tx);
			}
		});
	}
	$scope.reset = function() {
		$scope.carddb = {};
		$scope.carddb.card_number = '';
		$scope.carddb.holder_name = '';
		flipTo(0);
		// read card
		$scope.cardAdjust.pax = 0;
		cardReaderService.readCardInfo().then(function(info) {
			console.log('card info = ', info);

			if (info.carddb == null) {
				flipTo(0);
				return false;
			}
			
			if (!info.carddb.is_active) {
				toaster.pop('warning', 'บัตรยังไม่ถูกเปิดใช้งาน',
					'กรุณาตรวจสอบ\nหมายเลขบัตร:' + info.carddb.card_number + '\n' + 
					'ประเภทบัตร:' + info.carddb.type, 10000);
				flipTo(0);
				return false;
			}

			$scope.carddb = angular.copy(info.carddb);
			$scope.cardAccount = angular.copy(info.cardAccount);

			flipTo(info.carddb.type=='CORPORATE' ? 1 : 2);
			console.log($scope.cardAccount);
			$scope.cardAdjust.balanceBefore = $scope.cardAccount.balance;
			console.log('getTxList');
			refreshTxList();
		});
	};
	$scope.reset();
	setTimeout(function(){
		angular.element('.ns-wrapper').on('webkitAnimationStart', function() {
		}).on('webkitAnimationEnd', function() {
			angular.element('.ns-cover').removeClass('ns-hide');
			angular.element('.ns-wrapper').removeClass('ns-perspective');
			angular.element('.ns-transition').removeClass('ns-show');
		});
	},0);
}]).controller('CardHistoryCtrl',['$scope', '$rootScope', 'dbSvc', 'toaster', 'helper', '$filter'
	, 'cardReaderService'
	, function($scope, $rootScope, dbSvc, toaster, helper, $filter, cardReaderService){
	
	var cardTypeList = [
		{type:'',img:'img/rapidcard.png'},
		{type:'CORPORATE',img:'img/rapidcard_corporate.png'},
		{type:'FREELANCE',img:'img/rapidcard_freelance.png'}
	];
	
	$scope.currentPage = 0;
	$scope.pageSize = 50;
	$scope.numPages = function() {
		return $scope.cardTx.length;
	}
	$scope.carddb = {};
	$scope.cardAccount = {};

	$scope.selectedPeriod = {};
	$scope.periodList = [];
	$scope.cardTx = [];
	
	$scope.getCardNo = function(){
		console.log("CardNo. = ", $scope.cardAccount.setCartNo);
		var param = {
	      cardNo: $scope.cardAccount.setCartNo,
	    }
	    console.log('param=', param);
	    dbSvc.request('getAccCode', param).then(function(result) {
	      if (result.status === true) {
	        console.log("acc_code = ", result);
	        if(result.accCode == false){
	        	toaster.pop('warning', '', 'เลขที่บัตรไม่ถูกต้อง');
	        	return;
	        }
	        $scope.cardAccount.code = result.accCode;
	        getPeriodList();
	      } else {
	        toaster.pop('warning', '', result.reason);
	      }
	    });
	}

	var getPeriodList = function() { 
		console.log($scope.cardAccount.code);
		dbSvc.request('cardAccountPeriodList', {acc_code: $scope.cardAccount.code}).then(function(result) {
			if (result.status===true) {
				$scope.periodList = result.periods.map(function(item) {
					return {code:item}
				});
//				$scope.periodList = angular.copy(result.periods);
				if ($scope.periodList.length > 0) {
					$scope.selectedPeriod = $scope.periodList[0];
					$scope.getTxListByPeriod();
				}
			}
		});
	}

	$scope.getTxListByPeriod = function() {
		console.log($scope.cardAccount.code);
		dbSvc.request('cardAccountTxListByPeriod', {
			acc_code:$scope.cardAccount.code,
			period_code:$scope.selectedPeriod.code,
			limit:200,
		}).then(function(result) {
			if (result.status===true) {
				$scope.cardTx = angular.copy(result.card_account_tx);
				console.log($scope.cardTx);
			}
		});
	}
	$scope.doPreview = function() {
	    var param = {
	      report: 'card_tx_list',
	      acc_code: $scope.cardAccount.code,
	      period_code: $scope.selectedPeriod.code,
	      card_number: $scope.carddb.card_number,
	    }
	    console.log('param=', param);
	    dbSvc.request('report', param).then(function(result) {
	      if (result.status === true) {
	        window.open($rootScope.setting.RS_URL + '?uuid=' + result.uuid);
	        return;
	      } else {
	        toaster.pop('warning', '', result.reason);
	      }
	    });
	}
	
	var flipTo = function(idx) {
		// prepare back image to show
		angular.element('.ns-front img').attr({src:angular.element('.ns-cover img').attr('src')});
		angular.element('.ns-back .card-type').html(cardTypeList[idx].type);
		angular.element('.ns-back .card-code').html($scope.carddb.card_number);
		angular.element('.ns-back .card-name').html($scope.carddb.holder_name);
		angular.element('.ns-back .card-corp').html(cardTypeList[idx].type=='CORPORATE' ? $scope.cardAccount.name_th : '');
		angular.element('.ns-back img').attr({src:cardTypeList[idx].img});
		// start animation
		angular.element('.ns-wrapper').addClass('ns-perspective');
		angular.element('.ns-cover').addClass('ns-hide');
		angular.element('.ns-transition').addClass('ns-show');
		// update image cover image
		angular.element('.ns-cover .card-type').html(cardTypeList[idx].type);
		angular.element('.ns-cover .card-code').html($scope.carddb.card_number);
		angular.element('.ns-cover .card-name').html($scope.carddb.holder_name);
		angular.element('.ns-cover .card-corp').html(cardTypeList[idx].type=='CORPORATE' ? $scope.cardAccount.name_th : '');
		angular.element('.ns-cover img').attr({src:cardTypeList[idx].img});
	}

	$scope.reset = function() {
		$scope.carddb = {};
		$scope.carddb.card_number = '';
		$scope.carddb.holder_name = '';
		$scope.cardAccount.setCartNo = '';
		flipTo(0);
		cardReaderService.readCardInfo().then(function(info) {
			console.log('card info = ', info);

			if (info.carddb == null) {
				flipTo(0);
				return false;
			}
			
			if (!info.carddb.is_active) {
				toaster.pop('warning', 'บัตรยังไม่ถูกเปิดใช้งาน',
					'กรุณาตรวจสอบ\nหมายเลขบัตร:' + info.carddb.card_number + '\n' + 
					'ประเภทบัตร:' + info.carddb.type, 10000);
				flipTo(0);
				return false;
			}

			$scope.carddb = angular.copy(info.carddb);
			$scope.cardAccount = angular.copy(info.cardAccount);

			flipTo(info.carddb.type=='CORPORATE' ? 1 : 2);
			getPeriodList();
		});
	};
	$scope.reset();
	setTimeout(function(){
		angular.element('.ns-wrapper').on('webkitAnimationStart', function() {
		}).on('webkitAnimationEnd', function() {
			angular.element('.ns-cover').removeClass('ns-hide');
			angular.element('.ns-wrapper').removeClass('ns-perspective');
			angular.element('.ns-transition').removeClass('ns-show');
		});
	},0);
}]).controller('CardCancelCtrl',['$scope', '$rootScope', 'dbSvc', 'toaster', 'helper', '$filter', 'lovService'
	, function($scope, $rootScope, dbSvc, toaster, helper, $filter, lovService){

}]).controller('InformCtrl',['$scope', '$rootScope', 'dbSvc', 'toaster',
		'helper', '$filter', 'cardReaderService', 'ngDialog', '$state', 'lovService', 'receiptPrintService',
	function($scope, $rootScope, dbSvc, toaster,
			helper, $filter, cardReaderService, ngDialog, $state, lovService, receiptPrintService){
	$scope.cardType='';
	$scope.carddb = {type:''};
	$scope.cardAccount = {};
	$scope.isReceipt = $rootScope.setting.isReceipt;
	$scope.station_airport = $rootScope.station.code.substring(2,4);
	var is_saving = false;
	var cardTypeList = [
		{type:'',img:'img/rapidcard.png'},
		{type:'CORPORATE',img:'img/rapidcard_corporate.png'},
		{type:'FREELANCE',img:'img/rapidcard_freelance.png'}
	];
	var today = new Date();

	var initial = {
		uuid:'',
		code:'',
		nation:'',
		flight:'',
		date:$filter('date')(new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours()+2, 0, 0), 'yyyy-MM-dd'),
		time:'',
		hotel:'',
		group_name:'',
		note:'',
		totalPax:0,
		is_domestic:'NO',
		ref_uuid:'',
		bus_list:[],
		ref_code:'',
		is_tmp:'NO',
	};
	$scope.informList = [];
	$scope.informEdit = {};
	$scope.nationList = [];
	$scope.license = '';
	$scope.pax = 0;
	$scope.member = null;
	$scope.nation = null;
	$scope.hotel = null;
	$scope.selectedMember = '';
	$scope.selectedNation = '';
	$scope.selectedHotel = '';
	$scope.printInform = typeof $rootScope.setting.printInform === 'undefined' ? 'NO' : $rootScope.setting.printInform;
	$scope.savePrintInform = function() {
		$rootScope.setting.printInform = $scope.printInform;
		chrome.storage.local.set({setting:$rootScope.setting});
	}

	$scope.checkEndLicense = function($event) {
		console.log('keyCode=', $event.keyCode);
		if ($event.keyCode==13 && $scope.license=='') {
			if ($scope.inform.bus_list.length > 0) {
				setTimeout(function() {
					console.log('saveInfo focus');
					angular.element('#saveInform').focus();
				}, 100);
			} else {
				setTimeout(function() {
					angular.element('#license').focus();
				}, 0);				
			}
		}
	}

	$scope.addBus = function($event, form) {
		if ($event.keyCode != 13) {
			return;
		}
		
		if ($scope.license=='' && $scope.inform.bus_list.length > 0) {
			setTimeout(function() {
				console.log('saveInfo focus');
				angular.element('#saveInform').focus();
			}, 0);
			return;
		} else if (form.pax.$invalid || 1*$scope.pax <= 0) {
			toaster.pop('warning', '', 'จำนวนคนไม่ถูกต้อง');
			setTimeout(function() {
				angular.element('#pax').focus();
				angular.element('#pax').select();
			},0);
			return;
		}

		var list = $scope.license.split(/[^0-9\-nN]+/);
		console.log(list);
		list.forEach(function(license, i) {
			if (license.trim() === '') {
				return;
			}
			$scope.inform.bus_list.push({
				license:license,
				pax:i==0 ? 1*$scope.pax : 0,
			});
		});

		$scope.license='';
		$scope.pax=0;

		setTimeout(function() {
			angular.element('#license').focus().select();
		},0);
	}
	$scope.removeBus = function(e, idx) {
		console.log(e);
		e.preventDefault();
		$scope.inform.bus_list.splice(idx,1);

		setTimeout(function() {
			angular.element('#license').focus().select();
		},0);
	}
	$scope.jes_test = function(){
		console.log($scope.inform.bus_list);
	};
	$scope.save = function() {
		if (is_saving==true) {
			toaster.pop('warning', '', 'กำลังบันทึก กรุณารอสักครู่');
			return;
		}
		is_saving = true;
		if ($scope.inform.bus_list.length == 0) {
			is_saving = false;
			toaster.pop('warning', '', 'กรุณาระบุข้อมูลรถ');
			setTimeout(function() {
				angular.element('#license').focus().select();
			},0);
			return;
		}

		if (! /[0-2][0-9]:[0-5][0-9]/.test($scope.inform.time)) {
			is_saving = false;
			toaster.pop('warning', '', 'เวลาลงจอดไม่ถูกต้อง');
			setTimeout(function() {
				angular.element('#flight_time').focus().select();
			},0);
			return;
		}


		$scope.inform.flight = $scope.inform.flight.toUpperCase();
		var len = $scope.inform.bus_list.length;
		var totalPax = 0;
		
		for (var i = 0; i < len; i++) {
			totalPax += $scope.inform.bus_list[i].pax;
		}

		$scope.inform.totalPax = totalPax;
		var flight_date = $scope.inform.date + ' ' + $scope.inform.time+':00';
		var inform = {
		  uuid:$scope.inform.uuid,
		  code:$scope.inform.code,
		  card_code:$scope.carddb.code,
		  mem_code:$scope.member.code,
		  nation:$scope.nation.code,
		  flight:$scope.inform.flight,
		  flight_date:flight_date,
		  hotel:$scope.hotel.name,
		  group_name:$scope.inform.group_name,
		  note:$scope.inform.note,
		  ref_code:$scope.inform.ref_code,
		  total_pax:totalPax,
		  is_domestic:$scope.inform.is_domestic,
		  bus_list:$scope.inform.bus_list,
		  is_tmp:$scope.inform.is_tmp,
		  airport_code:$scope.station_airport,
		};
		console.log('inform to save=', inform);
		dbSvc.request('informSave', {inform:inform}).then(function(result) {
			is_saving = false;
			if (result.status===true) {
				$scope.inform.code = result.code;
				$scope.inform.uuid = result.uuid;
				toaster.pop('success', '', 'บันทึกข้อมูลเรียบร้อยแล้ว');

				if ($rootScope.setting.printInform=='YES') {
					var print_inform = angular.copy(inform);
					print_inform.code = result.code;
					print_inform.card_number = $scope.carddb.card_number;
					print_inform.member = $scope.selectedMember;
					print_inform.nationality = inform.nation + ' ' + $scope.selectedNation;
					print_inform.total_pax = ''+print_inform.total_pax;
					print_inform.created_at = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
					print_inform.issue_by = $rootScope.sessionStaff.user;
					print_inform.flight_time = inform.flight_date.substr(11, 5) + ' on ' + inform.flight_date.substr(0, 10);

					var bus_list = [];
					print_inform.bus_list = inform.bus_list.map(function(item) {
						return item.license;
					}).join(' ');

					receiptPrintService.printInform(print_inform,1).then(function(){
						$scope.reset();
					});
				} else {
					$scope.reset();
				}
			} else {
				toaster.pop('warning', '', result.reason);
			}
		}, function() {
			is_saving = false;
		});
	}

	var flipTo = function(idx) {
		// prepare back image to show
		angular.element('.ns-front img').attr({src:angular.element('.ns-cover img').attr('src')});
		angular.element('.ns-back .card-type').html(cardTypeList[idx].type);
		angular.element('.ns-back .card-code').html($scope.carddb.card_number);
		angular.element('.ns-back .card-name').html($scope.carddb.holder_name);
		angular.element('.ns-back .card-corp').html(cardTypeList[idx].type=='CORPORATE' ? $scope.cardAccount.name_th : '');
		angular.element('.ns-back img').attr({src:cardTypeList[idx].img});
		// start animation
		angular.element('.ns-wrapper').addClass('ns-perspective');
		angular.element('.ns-cover').addClass('ns-hide');
		angular.element('.ns-transition').addClass('ns-show');
		// update image cover image
		angular.element('.ns-cover .card-type').html(cardTypeList[idx].type);
		angular.element('.ns-cover .card-code').html($scope.carddb.card_number);
		angular.element('.ns-cover .card-name').html($scope.carddb.holder_name);
		angular.element('.ns-cover .card-corp').html(cardTypeList[idx].type=='CORPORATE' ? $scope.cardAccount.name_th : '');
		angular.element('.ns-cover img').attr({src:cardTypeList[idx].img});
	}
	

	$scope.isValid = function(form) {
		if ( form.$invalid
				|| $scope.inform.bus_list.length=='undefined'
				|| $scope.inform.bus_list.length==0
				|| typeof $scope.carddb == 'undefined'
				|| $scope.carddb.code == '') {
			return false;
		}
		return true;
	}

	$scope.getFlight = function() {
		console.log('getFlight');
		var flight = $scope.inform.flight;
		if (typeof flight == 'undefined' || flight == '') {
			return;
		}
		flight = flight.substr(0,2).toUpperCase()+('0000'+flight.substr(2)).substr(-4);
		$scope.inform.flight = flight;

		var airport = $rootScope.setting.airport;

		dbSvc.request('flightCheck', {airport:airport,flight:flight}).then(function(result) {
			if (result.status===true) {
				$scope.inform.date = result.flight.landing_time.substr(0, 10);
				$scope.inform.time = result.flight.landing_time.substr(11,5);
			} else {
				toaster.pop('warning', 'ไม่พบเที่ยวบินที่ระบุ กรุณาตรวจสอบอีกครั้ง');
				return;
			}
		});

		var mText = $scope.selectedMember;
		var memText = mText.substring(0, 5);
		// console.log(flight);
		// console.log(memText);
		if((memText != '' || memText !='undefined') && (flight != '' || flight !='undefined')){
			insertText(memText,flight);
		}
		return;
	}

	var insertText = function(memText,flight){
			if(memText != '' && flight != '')
		  {
				var param = {
					memCode: memText,
					flightCode: flight,
				}
				console.log(memText);
				console.log(flight);
				//console.log($rootScope.station.airport);
				dbSvc.request('insertInform', param).then(function(result) {
					if (result.status === true)
					{
					var flight_date = $scope.inform.date + ' ' + $scope.inform.time+':00';
						//$scope.inform = angular.copy(result.inFormText);
						$scope.inform.uuid = angular.copy(result.inFormText.uuid);
						$scope.selectedInform = result.inFormText.code;
						$scope.inform.code = angular.copy(result.inFormText.code);
					  $scope.selectedNation = result.inFormText.nation;
						$scope.nation = angular.copy(result.inFormHotalNation);
						$scope.selectedHotel = result.inFormText.hotel;
						$scope.hotel = angular.copy(result.inFormHotalNation);
						$scope.inform.group_name = result.inFormText.group_name;
						$scope.inform.ref_code = result.inFormText.ref_code;
						$scope.inform.is_domestic = result.inFormText.is_domestic;
						$scope.inform.bus_list = result.inFormText.bus_list;

					}
					else
					{
						console.log('bbbbb');
					}
				});

			}
			return;
		}



	$scope.reset = function() {
		$scope.carddb = {};
		$scope.carddb.card_number = '';
		$scope.carddb.holder_name = '';
		flipTo(0);

		// read card
		today = new Date();
		$scope.inform = angular.copy(initial);
		$scope.inform.uuid = '';
		$scope.nation = null;
		$scope.member = null;
		$scope.hotel = null;
		$scope.selectedMember = '';
		$scope.selectedNation = '';
		$scope.selectedHotel = '';
		$scope.selectedInform = '';

		cardReaderService.readCardInfo().then(function(info) {
			console.log('card info = ', info);

			if (info.carddb == null) {
				flipTo(0);
				return false;
			}
			
			if (!info.carddb.is_active) {
				toaster.pop('warning', 'บัตรยังไม่ถูกเปิดใช้งาน',
					'กรุณาตรวจสอบ\nหมายเลขบัตร:' + info.carddb.card_number + '\n' + 
					'ประเภทบัตร:' + info.carddb.type, 10000);
				flipTo(0);
				return false;
			}

			$scope.carddb = angular.copy(info.carddb);
			$scope.inform.card_code = info.carddb.code;
			$scope.cardAccount = angular.copy(info.cardAccount);
			$scope.informList=[];
			$scope.informList.push({uuid:'',title:''});
			$scope.informEdit=$scope.informList[0];

			if (info.carddb.type=='CORPORATE') {
				$scope.member = angular.copy(info.member);
				$scope.selectedMember = $scope.member.code+':'+$scope.member.name_en;
				setTimeout(function() {
					angular.element('#nation').focus();
				}, 0);
			} else {
				setTimeout(function() {
					angular.element('#member').focus();
				}, 0);
			}

			flipTo(info.carddb.type=='CORPORATE' ? 1 : 2);

			setTimeout(function() {
				angular.element('#inform').focus();
			},
			0);
			// dbSvc.request('informListByCard', {card_code:$scope.carddb.code}).then(function(result) {
			// 	if (result.status===true) {
			// 		result.informs.forEach(function(inform) {
			// 			$scope.informList.push(inform);
			// 		});
			// 	} else {
			// 		toaster.pop('warning', '', result.reason);
			// 	}
			// });
		});
	}

	var clearInform = function() {
		today = new Date();
		$scope.inform = angular.copy(initial);
		$scope.nation = null;
		$scope.hotel = null;
		$scope.selectedNation = '';
		$scope.selectedHotel = '';
		if ($scope.carddb.type=='FREELANCE') {
			$scope.selectedMember = '';
		}
		setTimeout(function() {
			angular.element('#inform').focus();
		},0);
	}

	$scope.showLovInform = function($event) {
		console.log('showLovInform');
		if ($event.keyCode != 32) {
			return;
		}
		if (typeof $scope.carddb.acc_code==='undefined'
			|| $scope.carddb.acc_code==''
			) {
			return;
		}
		// $scope.carddb.acc_code = 'F00015';

		lovService.showLov($scope, 'lov_inform_active', {cache:false, acc_code:$scope.carddb.acc_code, card_code:$scope.carddb.code}).then(function(result) {
			if (result===null) {
				clearInform();				
				return;
			}

			// show inform
			$scope.inform = angular.copy(result);
			$scope.selectedInform = $scope.inform.code;

			$scope.inform.date = $scope.inform.flight_date.substr(0, 10);
			$scope.inform.time = $scope.inform.flight_date.substr(11, 5);

			if ($scope.carddb.type=='FREELANCE') {
				$scope.member = {
					code: result.mem_code,
					name_en: result.mem_name_en
				};
				$scope.selectedMember = $scope.member.code+':'+$scope.member.name_en;
			}
			$scope.hotel = {
				name:$scope.inform.hotel,
			};
			$scope.selectedHotel = $scope.inform.hotel;
			$scope.nation = {
				code:result.nation,
				nation_en:result.nation_en,
			};
			$scope.selectedNation = $scope.nation.code + ':' + $scope.nation.nation_en;

			setTimeout(function() {
				if ($scope.carddb.type=='CORPORATE') {
					angular.element('#nation').focus();
				} else {
					angular.element('#member').focus();
				}
			}, 0);
		});
	}

	$scope.showLovMember = function($event) {
		if ($event.keyCode != 32) {
			return;
		}
		if ($scope.carddb.type=='CORPORATE') {
			return;
		}

		lovService.showLov($scope, 'lov_member', {}).then(function(result) {
			if (result===null) {
				setTimeout(function() {
					angular.element('#member').focus();
				}, 0);
				return;
			}
			console.log(result);
			$scope.member = result;
			$scope.selectedMember = $scope.member.code+':'+$scope.member.name_en;
			setTimeout(function() {
				angular.element('#nation').focus();
			}, 0);
		});
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
			$scope.selectedNation = $scope.nation.code+':'+$scope.nation.nation_en;
			setTimeout(function() {
				angular.element('#flight').focus();
			}, 0);
		});
	};

	$scope.showLovHotel = function($event) {
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
			$scope.hotel = result;
			$scope.selectedHotel = $scope.hotel.name;
			setTimeout(function() {
				angular.element('#group_name').focus();
			}, 0);
		});
	};

	$scope.showLovTrasferBy = function($event){
		if ($event.keyCode != 32) {
			return;
		}
		lovService.showLov($scope, 'transfer_by', {cache:false}).then(function(result) {
			if (result===null) {
				setTimeout(function() {
					angular.element('#note').focus();
				}, 0);
				return;
			}
			console.log(result);
			$scope.tranfers = result;
			$scope.inform.note = $scope.tranfers.name_en;
			setTimeout(function() {
				angular.element('#ref_code').focus();
			}, 0);
		});
	};
	
	$scope.buyInform = function() {
		// $rootScope.dummyReceipt = {
		// 	invoice_code:'AR15020014',
		// };
		// $state.go('home.receipt_new', {uuid:''});
		// return;		
		$rootScope.dummyReceipt = {
			items:[
				{code:'SHD',qty:1},
			],
		};

		if (typeof $scope.member === 'object' && $scope.member !== null) {
			$rootScope.dummyReceipt.mem_code = $scope.member.code;
		}

		$state.go('home.receipt_new', {uuid:''});
	}

	$scope.reset();

	setTimeout(function(){
		angular.element('.ns-wrapper').on('webkitAnimationStart', function() {
		}).on('webkitAnimationEnd', function() {
			angular.element('.ns-cover').removeClass('ns-hide');
			angular.element('.ns-wrapper').removeClass('ns-perspective');
			angular.element('.ns-transition').removeClass('ns-show');
		});
	},0);

}]).controller('CardCouponCtrl',['$scope', '$rootScope', '$state', 'dbSvc',
		'toaster', 'helper', '$filter', '$q', 'cardReaderService', 
		function($scope, $rootScope, $state, dbSvc,
				toaster, helper, $filter, $q, cardReaderService){

	var cardTypeList = [
		{type:'',img:'img/rapidcard.png'},
		{type:'CORPORATE',img:'img/rapidcard_corporate.png'},
		{type:'FREELANCE',img:'img/rapidcard_freelance.png'}
	];

	$scope.carddb = null;
	$scope.cardAccount = null;
	$scope.memberAddress = {};
	$scope.cardAccounts = [];
	$scope.memberAddresses = [];
	
	$scope.cardCoupon = {};
	$scope.cardCoupon.paymentType = 'COUPON';
	$scope.cardCoupon.balance = 0;
	$scope.cardCoupon.coupon = [];
	$scope.totalPax = 0;
	$scope.couponFrom = '';
	$scope.couponTo = '';

	$scope.checkEnter = function($event) {
		console.log($event.keyCode);
		if (typeof $event.keyCode != 'undefined' && $event.keyCode==13) {
			if ($scope.couponFrom=='' && $scope.couponTo=='') {
				setTimeout(function() {
					angular.element('#save').focus();
				}, 0);
				return;
			}
		}
	}

	$scope.addCoupon = function(form) {

		if (form.couponFrom.$invalid || form.couponTo.$invalid) {
			toaster.pop('warning', '', 'รหัสคูปองไม่ถูกต้อง');
			setTimeout(function() {
				angular.element('#couponFrom').focus().select();
			},0);
			return;
		}

		var prefix = '';
		var prefix2='';


		if ($scope.couponFrom.length==11) {
			prefix = $scope.couponFrom.substr(0, $scope.couponFrom.length-5).toUpperCase();
			prefix2 = $scope.couponTo.substr(0, $scope.couponTo.length-5).toUpperCase();
		} else {
			prefix = $scope.couponFrom.substr(0, $scope.couponFrom.length-6).toUpperCase();
			prefix2 = $scope.couponTo.substr(0, $scope.couponTo.length-6).toUpperCase();
		}

		if (prefix !== prefix2) {
			toaster.pop('warning', '', 'รหัสคูปองขึ้นต้นไม่เหมือนกัน');
			setTimeout(function() {
				angular.element('#couponFrom').focus().select();
			},0);
			return;
		}

		var couponFrom = 0;
		var couponTo = 0;
		if ($scope.couponFrom.length==11) {
			couponFrom = parseInt($scope.couponFrom.substr(-5));
			couponTo = parseInt($scope.couponTo.substr(-5));		
		} else {
			couponFrom = parseInt($scope.couponFrom.substr(-6));
			couponTo = parseInt($scope.couponTo.substr(-6));
		}

		if (isNaN(couponFrom) || isNaN(couponTo) || couponFrom < 0 || couponTo < 0) {
			toaster.pop('warning', '', 'รหัสคูปองไม่ถูกต้อง');
			setTimeout(function() {
				angular.element('#couponFrom').focus().select();
			},0);
			return;
		}
		// swap is need
		if (couponTo < couponFrom) {
			var tmp = couponFrom;
			couponFrom = couponTo;
			couponTo = tmp;
		}
		
		console.log('from - to', couponFrom, couponTo);

		// check already exists in list or not
		var couponList = $scope.cardCoupon.coupon;
		var len = couponList.length;
		for (var i = 0; i < len; i++) {
			console.log('couponList[' + i + ']=', couponList[i]);
			if (prefix+couponFrom <= couponList[i].to
				&& prefix+couponTo >= couponList[i].from) {
				toaster.pop('warning', '', 'เลขคูปองอยู่ในรายการแล้ว');
				setTimeout(function() {
					angular.element('#couponFrom').focus().select();
				},0);
				return;
			}
		}

		// check already used
		dbSvc.request('couponCheck', {from:$scope.couponFrom, to:$scope.couponTo}).then(function(result) {
			if (result.status===true) {
				if (result.coupons.length > 0) {
					toaster.pop('warning', '', 'มีคูปองถูกใช้ไปแล้วดังนี้\n' + result.coupons.join(', '));
					setTimeout(function() {
						angular.element('#couponFrom').focus().select();
					},0);
					return;
				}
				var qty = ($scope.couponFrom.length==12 ? 10 : 1) * (couponTo-couponFrom+1); 
				$scope.cardCoupon.coupon.push({
					from:prefix+('000000'+couponFrom).substr(-6),
					to:prefix+('000000'+couponTo).substr(-6),
					qty:qty,
				});

				$scope.totalPax += qty;
				$scope.cardCoupon.paxAfter = 1*$scope.cardCoupon.paxBefore + $scope.totalPax;
				$scope.couponFrom='';
				$scope.couponTo='';
				
				console.log('paxAfter', $scope.cardCoupon.paxAfter);
				
				setTimeout(function() {
					angular.element('#couponFrom').focus().select();
				},0);
			} else {
				toaster.pop('warning', '', result.reason);
			}
		});
	}

	$scope.removeCoupon = function(e, idx) {
		console.log(e);
		e.preventDefault();
		var coupon = $scope.cardCoupon.coupon[idx];
		$scope.totalPax -= coupon.qty;
		$scope.cardCoupon.amount = $scope.totalPax *  $rootScope.config.coupon_price;
		
		$scope.cardCoupon.coupon.splice(idx,1);
		setTimeout(function() {
			angular.element('#couponFrom').focus().select();
		},0);
	}


	$scope.save = function() {
		if ($scope.cardAccount == null) {
			toaster.pop('warning', 'เกิดข้อผิดพลาด', 'ไม่พบบัญชีของบัตร');
			return;
		}
		var totalPax = parseFloat($scope.totalPax);
		if (isNaN(totalPax) || totalPax <= 0) {
			toaster.pop('warning', 'เกิดข้อผิดพลาด', 'จำนวน PAX ไม่ถูกต้อง');
			return;
		}

		console.log('totalPax=', totalPax);

		var param = {
			acc_code:$scope.cardAccount.code,
			card_code:$scope.carddb.code,
			coupons:$scope.cardCoupon.coupon,
			totalPax:totalPax,
		};

    setTimeout(function() {
      angular.element('#reset').focus();
    }, 0);

		dbSvc.request('couponTopup', param).then(function(result) {
			if (result.status===true) {
				toaster.pop('success', '', 'บันึกคูปองเรียบร้อยแล้ว');
				$scope.reset();
			} else {
				toaster.pop('warning', '', result.reason);
			}
		});
	}

	
	$scope.isValid = function(form) {
		if (form.$invalid || $scope.totalPax==0) {
			return false;
		}
		return true;
	}
	var flipTo = function(idx) {
		// prepare back image to show
		angular.element('.ns-front img').attr({src:angular.element('.ns-cover img').attr('src')});
		angular.element('.ns-back .card-type').html(cardTypeList[idx].type);
		angular.element('.ns-back .card-code').html($scope.carddb.card_number);
		angular.element('.ns-back .card-name').html($scope.carddb.holder_name);
		angular.element('.ns-back .card-corp').html(cardTypeList[idx].type=='CORPORATE' ? $scope.cardAccount.name_th : '');
		angular.element('.ns-back img').attr({src:cardTypeList[idx].img});
		// start animation
		angular.element('.ns-wrapper').addClass('ns-perspective');
		angular.element('.ns-cover').addClass('ns-hide');
		angular.element('.ns-transition').addClass('ns-show');
		// update image cover image
		angular.element('.ns-cover .card-type').html(cardTypeList[idx].type);
		angular.element('.ns-cover .card-code').html($scope.carddb.card_number);
		angular.element('.ns-cover .card-name').html($scope.carddb.holder_name);
		angular.element('.ns-cover .card-corp').html(cardTypeList[idx].type=='CORPORATE' ? $scope.cardAccount.name_th : '');
		angular.element('.ns-cover img').attr({src:cardTypeList[idx].img});
	}
	
	$scope.reset = function() {
		// read card
		$scope.carddb = {};
		$scope.carddb.card_number = '';
		$scope.carddb.holder_name = '';
		flipTo(0);
		
		$scope.cardCoupon = {
			amount:0,
			coupon:[],
			paxBefore:0,
		};

		$scope.totalPax = 0;

		cardReaderService.readCardInfo().then(function(info) {
			console.log('card info = ', info);

			if (info.carddb == null) {
				flipTo(0);
				return false;
			}
			
			if (!info.carddb.is_active) {
				toaster.pop('warning', 'บัตรยังไม่ถูกเปิดใช้งาน',
					'กรุณาตรวจสอบ\nหมายเลขบัตร:' + info.carddb.card_number + '\n' + 
					'ประเภทบัตร:' + info.carddb.type, 10000);
				flipTo(0);
				return false;
			}

			$scope.carddb = angular.copy(info.carddb);
			$scope.cardAccount = angular.copy(info.cardAccount);

			$scope.cardCoupon.paxBefore = 1*info.cardAccount.balance;

			flipTo(info.carddb.type=='CORPORATE' ? 1 : 2);

			dbSvc.request('nextCode', {table:'coupon_voucher'}).then(function(result) {
				if (result.status===true) {
					$scope.cardCoupon.voucherCode = result.code;
				}
			});

			setTimeout(function() {
				angular.element('#couponFrom').focus();
			}, 0);
		});
	};
	$scope.reset();
	setTimeout(function(){
		angular.element('.ns-wrapper').on('webkitAnimationStart', function() {
		}).on('webkitAnimationEnd', function() {
			angular.element('.ns-cover').removeClass('ns-hide');
			angular.element('.ns-wrapper').removeClass('ns-perspective');
			angular.element('.ns-transition').removeClass('ns-show');
		});
	},0);
}]).controller('PeriodCloseCtrl', ['$rootScope', '$scope', '$http', 'dbSvc', 'helper', 'sysConfig', 'toaster', 'ngDialog',
	function($rootScope, $scope, $http, dbSvc, helper, sysConfig, toaster, ngDialog) {

	$scope.p_name = helper.thShortDate($rootScope.period.p_date.substr(0, 10))
		+ ' ' + ($rootScope.period.p_type=='AM' ? 'ผลัดกลางวัน(M)' : ($rootScope.period.p_type=='PM' ? 'ผลัดกลางคืน(N)' : 'ตลอดวัน(D)'));
	$scope.periodDate = $rootScope.period.p_date.substr(0, 10); $scope.selectDate = $rootScope.period.p_date.substr(2, 10);
	$scope.periodType = $rootScope.period.p_type;
	$scope.station = {};
	$scope.airportbox = {};
	//$scope.airportList=[];
	$scope.report = "receipt_summary";
	$scope.rvcodeselect = $rootScope.station.code+""+$scope.selectDate+""
						  +($rootScope.period.p_type=='AM' ? 'M' : ($rootScope.period.p_type=='PM' ? 'N' : 'D'));
	console.log($scope.rvcodeselect);
	var getAirport = function() {
		$scope.airportList=["DMK","BKK","HO"];
		// $scope.airportList.forEach(function(airport,j){
		// 	if(airport==$rootScope.station.airport){
		// 		$scope.airportbox = $scope.airportList[j];
		// 		console.log($scope.airportbox);
		// 		$scope.getStation();
		// 	}
		// });
		if(($rootScope.station.code).match(/DM.*/)){
			$scope.airportbox = 'DMK';
		}else if (($rootScope.station.code).match(/SU.*/)){
			$scope.airportbox = 'BKK';
		}else{
			$scope.airportbox = 'HO';
		}
		$scope.getStation();
	};

	$scope.getStation = function() {
		$scope.stationList=[{}];
		console.log($scope.airportbox);
		if($scope.airportbox == 'HO'||$scope.airportbox == 'HQ'){
			$scope.periodType = 'DAY';
		}else{
			$scope.periodType = 'AMPM';
		}
		var param = {
			prefix:$rootScope.station.code.substr(2,2),
			airport:$scope.airportbox,
		};
		dbSvc.request('stationList', param).then(function(result) {
			if (result.status===true) {
				if($scope.report == 'receipt_list1' || $scope.report == 'inform_list1' || $scope.report == 'inform_list_nopaid'
					|| $scope.report == 'sportCheckPrint'){
					$scope.fx = {"code":"All","airport":"All"};
					$scope.stationList.push($scope.fx);
				}
				$scope.stationLists = result.stations;
				result.stations.forEach(function(x,j){
					$scope.stationList.push(x);
				});
				console.log($scope.stationList);
				$scope.stationList.forEach(function(station, i) {
					if (station.code==$rootScope.station.code) {
						$scope.station = $scope.stationList[i];
						//console.log($scope.station);
					}
				});
			}
		});
	};
	getAirport();

$scope.validAirportList = function(){
	if(($rootScope.station.code).match(/HO.*/)){
		if ($scope.report == 'kingpower_list')
		{
			//console.log($scope.report);
			return true;
		}
		else
		{
			return false;
		}
	}else{
		return true;
	}
}

$scope.isHide = function()
	{
		if ($scope.report == 'kingpower_list')
		{
			//console.log($scope.report);
			return true;
		}
		else
		{
			return false;
		}
	};

$scope.isHideAllRedio = function()
    {
        if ($scope.report != 'inform_list1'&&$scope.report != 'inform_list_nopaid'&&$scope.report != 'sportCheckPrint'&&$scope.report != 'receipt_list1')
        {
            //console.log($scope.report);
            return true;
        }
        else
        {
            return false;
        }
    };

	$scope.disAirport = function()
	{
		var airPort = $rootScope.station.airport;
		if(airPort != "BKK")
		{
			return true;
		}
		else {
			return false;
		}
	};


	$scope.printReport = function() {
		var param = {
			airport:$scope.airportbox,
			station_code: $scope.station.code,
			report: $scope.report,
			p_date: $scope.periodDate,
			p_type: $scope.periodType,
			checker: $rootScope.sessionStaff.user,
		};
		dbSvc.request('report', param).then(function(result) {
			if (result.status === true) {
				window.open($rootScope.setting.RS_URL + '?uuid=' + result.uuid);
				return;
			} else {
				toaster.pop('warning', '', result.reason);
			}
		});
	};


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
	       return year + month + day + hour + minute + second;
	   }

function js_hh_mm_ss () {
			       now = new Date();

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
			       return hour + minute + second;
}


function doExportKingPower (){
		var param = {
			report: $scope.report,
			p_date: $scope.periodDate,
		};

		dbSvc.request('exportKingPower', param).then(function(result) {
			if (result.status === true)
			{
				//var dateNow = new Date();
				var dateNow = js_hh_mm_ss ();
				var mDate = $scope.periodDate.replace(/-/g,'') + dateNow;
				var saveText = "0299003_SALES_" + mDate + ".txt";

				var blob = new Blob([result.textFiles], {
            type: "text;charset=utf-8"
        });
		console.log(result.textFiles);
        saveAs(blob, saveText);

				toaster.pop('success','บันทึกเรียบร้อยแล้ว');

			}
			else
			{
				console.log('bbbbb');
			}
		});
	};

	$scope.exportKingPower = function() {

		var param = {
			p_date: $scope.periodDate,
		};

		var mDate = $scope.periodDate;
		mDate = mDate.substring(8,10) + '-' + mDate.substring(5,7) +'-'+ mDate.substring(0,4);
		//console.log(mDate.substring(8,10) + '-' + mDate.substring(5,7) +'-'+ mDate.substring(0,4));

		dbSvc.request('countInformPax', param).then(function(result) {
			if (result.status===true) {
				$scope.message = 'สรุปจำนวนยอดนักท่องเที่ยวส่ง KPS ของวันที่ ' + mDate +'\nทั้งหมดจำนวน '  + result.total_pax + ' PAX';
				$scope.positiveButton = 'ดาวน์โหลด';
				$scope.negativeButton = 'ยกเลิก';
				$scope.positiveResponse = function() {
					 doExportKingPower();
				};
				$scope.negativeResponse = function(){

				};
				ngDialog.open({
					template: 'views/confirm.html',
					controller: 'ConfirmDialogCtrl',
					className: 'ngdialog-theme-default ngdialog-theme-custom',
					scope:$scope,
				});
			}
		});
	};

	var doClosePeriod = function() {
		dbSvc.request('periodClose', {force:false,selectperiod:$scope.rvcodeselect,}).then(function(result) {
			if (result.status===true) {
				$rootScope.period = angular.copy(result.period);
				$scope.p_name = helper.thShortDate($rootScope.period.p_date.substr(0, 10))
					+ ' ' + ($rootScope.period.p_type=='AM' ? 'ผลัดกลางวัน(M)' : ($rootScope.period.p_type=='PM' ? 'ผลัดกลางคืน(N)' : 'ตลอดวัน(D)'));
				$scope.periodDate = $rootScope.period.p_date.substr(0, 10);
				$scope.periodType = $rootScope.period.p_type;
				
				toaster.pop('success', '', 'ปิดพลัดสำเร็จ');

				$scope.message = 'ปิดผลัดสำเร็จ ต้องเข้าสู่ระบบใหม่อีกครั้ง';
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
			} else if (result.status===false) {
				console.log(result.reason);
				console.log(result.error);
				toaster.pop('warning', '', 'ปิดผลัดไม่สำเร็จ');
				return;
			}else {
				toaster.pop('warning', '', 'ปิดผลัดไม่สำเร็จ');
				return;
			}
		});
	};

	$scope.closePeriod = function() {
		dbSvc.request('periodCheck', {}).then(function(result) {
			if (result.status === true) {
					$scope.message = "<div class='dPic'><img src='img/alerticon.png' alt='uptight' style='width:30px;height:22px;'></div>"
					+'<div class="dDetail">ต้องการปิดผลัด วันที่ ' +'<b><font color = "red">'+ $rootScope.period.p_date + '</font></b>'
						+ ($rootScope.period.p_type=='DAY' ? '<b><font color = "red"> (ตลอดวัน)</font></b>' : (
								$rootScope.period.p_type=='AM' ? '<b><font color = "red"> (ผลัดกลางวัน)</font></b>' : '<b><font color = "red"> (ผลัดกลางคืน</font></b>)'
							)) + ' หรือไม่'
						+ '\nจำนวนใบเสร็จทั้งหมดในผลัด: <b><font color = "red">' + result.num_receipt + ' ใบ</font></b></div>';
				$scope.positiveButton = 'ปิดผลัด';
				$scope.negativeButton = 'ยกเลิก';
				$scope.positiveResponse = function() {
					doClosePeriod();
				};
				$scope.negativeResponse = function(){

				};
				ngDialog.open({
					template: 'views/confirm.html',
					controller: 'ConfirmDialogCtrl',
					className: 'ngdialog-theme-default ngdialog-theme-custom',
					scope:$scope,
				});

			}
		});
	};
}]).controller('InformListCtrl', ['$scope', '$state', 'dbSvc',
		function($scope, $state, dbSvc) {
	$scope.is_domestic = 'NO';
	$scope.filtered = [];
	$scope.informs = [];
  $scope.currentPage = 0;
  $scope.pageSize = 50;
  $scope.inform_status = {
  	'WAIT': 'รอชำระ',
  	'PAID': 'ชำระแล้ว',
  	'DONE':'เสร็จสิ้น',
  	'CANCEL':'ยกเลิก',
  };
  $scope.numberOfPages=function(){
      return Math.ceil($scope.filtered.length/$scope.pageSize);
  };

  $scope.refreshData = function() {
  	dbSvc.request('informList', {is_domestic:$scope.is_domestic}).then(function(result) {
  		if (result.status===true) {
  			$scope.informs = result.informs;
  			//angular.element('#searchInform').focus();
  		}
  	});
  }

  $scope.informSearchAll = function(){
  	dbSvc.request('informListSearch', {code:$scope.searchInformAll}).then(function(result) {
  		if (result.status===true) {
  			$scope.informs = result.informs;
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
		angular.element('#searchInform').focus();
  },1000);
}]).controller('InformEditCtrl', ['$scope', '$rootScope', 'dbSvc', 'toaster',
		'helper', 'ngDialog', '$stateParams', '$q', '$state', '$filter', 'receiptPrintService',
		function($scope, $rootScope, dbSvc, toaster, helper, ngDialog, $stateParams, $q, $state, $filter, receiptPrintService) {
	
	$scope.inform = {};
	$scope.nation = {};
	$scope.hotel = {};
	$scope.tranfers ={};
	$scope.buscallList = [];
	$scope.validEdit = false;
	$scope.runNo = '';
	dbSvc.request('informByCode', {code:$stateParams['code']}).then(function(result) {
		if (result.status===true) {
			$scope.inform = angular.copy(result.inform);
			console.log('inform', $scope.inform);
			$scope.inform.date = result.inform.flight_date.substr(0, 10);
			$scope.inform.time = result.inform.flight_date.substr(11, 5);
			$scope.selectedMember = result.member.code + ':' + result.member.name_en;
			$scope.selectedNation = result.country.code + ':' + result.country.nation_en;
			$scope.buscallList = angular.copy(result.buscalls);
			$scope.selectedHotel = result.inform.hotel;

			if($scope.inform.status == 'PAID' || $scope.inform.status == 'DONE'){
				$scope.runNo = result.inform.run_no;
			} else {
				$scope.runNo = '';
			}
		}
	});

	dbSvc.request('getBuscallDoneTime', {code:$stateParams['code']}).then(function(result) {
		if (result.status===true) {
			$scope.buscallDoneTime = angular.copy(result.doneTime);
			console.log('buscall', $scope.buscallDoneTime);
			if($scope.buscallDoneTime.done_time == '0000-00-00 00:00:00'){
				console.log("It's 00" );
				$scope.validEdit = false;
			}else{
				console.log("It's not 00");
				if($scope.buscallDoneTime.time_diff > 40){
					console.log("> 40");
					$scope.validEdit = true;
				}else{
					console.log("< 40");
					$scope.validEdit = false;
				}
			}
		}else{
			console.log('false');
			$scope.validEdit = true;
		}
	});

	$scope.canEditInform = function(){
		if($scope.validEdit){
			return true;
		}
		return false;
	}

	$scope.showLovNation = function($event) {
		if ($event.keyCode != 32) {
			return;
		}

		$scope.lovQuery = 'SELECT code, nation_en, nation_th, name_en, name_th FROM country ORDER BY nation_en';
		$scope.fields = [
			{name:'code', text:'รหัส'},
			{name:'nation_en', text:'สัญชาติ (อังกฤษ)'},
			{name:'nation_th', text:'สัญชาติ (ไทย)'},
			{name:'name_th', text:'ประเทศ (ไทย)'},
			{name:'name_en', text:'ประเทศ (อังกฤษ)'},
		];
		ngDialog.open({
			template: 'views/lov.html',
			controller: 'LovDialogCtrl',
			className: 'ngdialog-theme-default ngdialog-theme-lov',
			scope:$scope,
		}).closePromise.then(function(result) {
			if (result.value=='$closeButton' || typeof result.value==='undefined') {
				setTimeout(function() {
					// if ($scope.nation != null) {
					// 	setTimeout(function() {
					// 		$scope.selectedNation = $scope.nation.code+':'+$scope.nation.nation_en;	
					// 	}, 0);
					// }
					angular.element('#nation').focus();
				}, 0);
				return;
			}
			$scope.nation = angular.copy(result.value);
			$scope.selectedNation = $scope.nation.code+':'+$scope.nation.nation_en;
			setTimeout(function() {
				angular.element('#flight').focus();
			}, 0);
		});
		return false;
	};

	$scope.showLovHotel = function($event) {
		if ($event.keyCode != 32) {
			return;
		}

		$scope.lovQuery = "SELECT name, place, tel FROM hotel ORDER BY name";
		$scope.fields = [
			{name:'name', text:'ชื่องโรงแรม/ที่พัก'},
			{name:'place', text:'ที่อยู่'},
			{name:'tel', text:'โทรศัพท์'},
		];
		ngDialog.open({
			template: 'views/lov.html',
			controller: 'LovDialogCtrl',
			className: 'ngdialog-theme-default ngdialog-theme-lov',
			scope:$scope,
		}).closePromise.then(function(result) {
			if (result.value=='$closeButton' || typeof result.value==='undefined') {
				setTimeout(function() {
					// if ($scope.hotel != null) {
					// 	$scope.selectedHotel = $scope.hotel.name;
					// }
					angular.element('#hotel').focus();
				}, 0);
				return;
			}
			$scope.hotel = angular.copy(result.value);
			$scope.selectedHotel = $scope.hotel.name;
			setTimeout(function() {
				angular.element('#group_name').focus();
			}, 0);
		});
	}

	$scope.showLovTrasferBy_Edit = function($event){
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
					angular.element('#note').focus();
				}, 0);
				return;
			}
			$scope.tranfers = angular.copy(result.value);
			$scope.inform.note = $scope.tranfers.name_en;
			setTimeout(function() {
				angular.element('#saveInform').focus();
			}, 0);
		});
	};

	$scope.addBus = function() {
		if ($scope.license=='') {
			return;
		}

		var list = $scope.license.split(/[^0-9\-nN]+/);
		console.log(list);
		list.forEach(function(license, i) {
			if (license.trim() === '') {
				return;
			}
			$scope.buscallList.push({
				code:'',
				license:license,
				pax:0,
			});
		});

		$scope.license='';
		setTimeout(function() {
			angular.element('#license').focus().select();
		},0);
	}

	$scope.getFlight = function() {	
		var flight = $scope.inform.flight;
		if (typeof flight == 'undefined' || flight == '') {
			return;
		}
		flight = flight.substr(0,2).toUpperCase()+('0000'+flight.substr(2)).substr(-4);
		$scope.inform.flight = flight;

		var airport = $rootScope.setting.airport;

		dbSvc.request('flightCheck', {airport:airport,flight:flight}).then(function(result) {
			if (result.status===true) {
				$scope.inform.date = result.flight.landing_time.substr(0, 10);
				$scope.inform.time = result.flight.landing_time.substr(11,5);
			} else {
				toaster.pop('warning', 'ไม่พบเที่ยวบินที่ระบุ กรุณาตรวจสอบอีกครั้ง');
				return;
			}
		});
		return;
	}

	$scope.save = function() {
		console.log("Save Edit Inform");
		$scope.inform.flight_date = $scope.inform.date + ' ' + $scope.inform.time+':00';
		$scope.inform.flight_schedule = $scope.inform.date + ' ' + $scope.inform.time+':00';
		// console.log('inform:', $scope.inform);
		// console.log('buscalls:', $scope.buscallList);
		dbSvc.request('informUpdate', {inform:$scope.inform,buscalls:$scope.buscallList}).then(function(result) {
			if (result.status===true) {
				toaster.pop('success', '', 'บันทึกข้อมูลเรียบร้อยแล้ว');
			} else {
				toaster.pop('warning', '', result.reason);
			}
		});
	}

	$scope.jes_check = function() {
		console.log($scope.inform);
		console.log($scope.buscallList);
	}

	$scope.canCancel = function() {
		return $scope.inform.is_domestic=='YES' || $scope.inform.status=='WAIT';
	}

	var doCancel = function() {
		dbSvc.request('informCancel', {code:$scope.inform.code}).then(function(result) {
			if (result.status===true) {
				toaster.pop('success', '', 'ยกเลิกเรียบร้อยแล้ว');
			} else {
				toaster.pop('warning', '', result.reason);
			}
		});
		return;
		$scope.inform.is_done = 1;
		dbSvc.saveData($scope.inform).then(function(result) {
			dbSvc.getTableIndex('buscall', 'ixInform', IDBKeyRange.only($scope.inform.uuid), 'next').then(function(result) {
				var all = [];
				for(var i = 0; i < result.length; i++) {
					result[i].call_status=2;
					all.push(dbSvc.saveData(result[i]));
				}
				return $q.all(all);
			}).then(function() {
				toaster.pop('success', '', 'ยกเลิกเรียบร้อยแล้ว');
				$scope.goBack();
			})
		});
	}
	$scope.cancel = function() {
		$scope.message = 'ระบบจะยกเลิกรายการเรียกรถทั้งหมด และไม่สามารถแก้ไขกลับ ยืนยันหรือไม่';
		$scope.positiveButton = 'ยืนยันการยกเลิกใบแจ้ง';
		$scope.negativeButton = 'ไม่ยกเลิกใบแจ้ง';
		$scope.positiveResponse = function() {
			doCancel();
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
	$scope.print = function() {
		var param = {
			inform_code: $scope.inform.code,
			format:'new'
		};
		dbSvc.request('billObj', param).then(function(result) {
			if (result.status===true) {
				receiptPrintService.printBill(result.bill,1).then(function(){
					//$scope.reset();
				});
			}
		});
		// var billObj = {
		// 	code:$scope.inform.code,
		// 	memCode:$scope.inform.mem_code,
		// 	name:$scope.selectedMember,
		// 	addr:'',
		// 	issueDate:$scope.inform.issue_date,
		// 	dueDate:'',
		// 	amount:$scope.inform.total_pax * $rootScope.config.coupon_price,
		// 	remark:'',
		// 	issueBy:$rootScope.sessionStaff.fullname,
		// 	items:[
		// 		{
		// 			no:'1',
		// 			detail:'ผู้โดยสาร สัญชาติ '+ $scope.selectedNation,
		// 			unitPrice:helper.formatNumber($rootScope.config.coupon_price,2),
		// 			qty:helper.formatNumber($scope.inform.total_pax,0),
		// 			unit:'PAX',
		// 			amount:helper.formatNumber($scope.inform.total_pax * $rootScope.config.coupon_price,2)
		// 		},
		// 		{no:'',detail:'เที่ยวบิน '+$scope.inform.flight +
		// 			' เวลา ' + $scope.inform.flight_date.substr(11,5),unitPrice:'',qty:'',unit:'',amount:''},
		// 		{no:'',detail:'พักโรงแรม '+$scope.inform.hotel,unitPrice:'',qty:'',unit:'',amount:''},
		// 		{no:'',detail:'ชื่อกลุ่ม ' + $scope.inform.group_name,unitPrice:'',qty:'',unit:'',amount:''},
		// 		{no:'',detail:$scope.inform.note,unitPrice:'',qty:'',unit:'',amount:''},
		// 		{no:'',detail:'',unitPrice:'',qty:'',unit:'',amount:''},
		// 	],
		// };
		// console.log('reprint=', billObj);
		// receiptPrintService.printBill(billObj,1).then(function(){
		// });
	}

	$scope.cannotBus = function() {
	  if ($scope.inform.status == 'CANCEL') {
	  	//console.log('True');
	  	return true;
	  }
	  else{
	  	//console.log('FFFF');
	  	if($scope.validEdit){
			return true;
		}
	  	return false;
	  };
	}

	$scope.goBack = function() {
		$state.go('home.inform_list');
	}

	$scope.goBack = function() {
		$state.go('home.inform_list');
	}

}]).controller('InformOneStopCtrl',['$scope', '$rootScope', 'dbSvc', 'toaster',
		'helper', '$filter', 'cardReaderService', 'ngDialog', '$state', 'receiptPrintService',
	function($scope, $rootScope, dbSvc, toaster,
			helper, $filter, cardReaderService, ngDialog, $state, receiptPrintService){
	var is_saving = false;
	var canSave = true;

	$scope.cardType='';
	$scope.carddb = {type:''};
	$scope.cardAccount = {};
	$scope.isReceipt = $rootScope.setting.isReceipt;
	
	var informPriceObj = {};

	var getInformPrice = function() {
		dbSvc.request('productByCode', {code:'SHD'}).then(function(result) {
			if (result.status===true) {
				informPriceObj = angular.copy(result.product);
				console.log(informPriceObj);
			}
		});
	}
	getInformPrice();

	var cardTypeList = [
		{type:'',img:'img/rapidcard.png'},
		{type:'CORPORATE',img:'img/rapidcard_corporate.png'},
		{type:'FREELANCE',img:'img/rapidcard_freelance.png'}
	];
	var today = new Date();

	var initial = {
		uuid:'',
		code:'',
		nation:'',
		flight:'',
		date:$filter('date')(new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours()+2, 0, 0), 'yyyy-MM-dd'),
		time:'',
		hotel:'',
		group_name:'',
		note:'',
		ref_code:'',
		totalPax:0,
		is_domestic:'NO',
		ref_uuid:'',
		bus_list:[],
	};
	$scope.receipt = {code:'',pax:0,vatRate:parseFloat($rootScope.config.vat_rate)};
	$scope.informList = [];
	$scope.informEdit = {};
	$scope.nationList = [];
	$scope.license = '';
	$scope.pax = 0;
	$scope.member = null;
	$scope.nation = null;
	$scope.hotel = null;
	$scope.tranfers = null;
	$scope.selectedMember = '';
	$scope.selectedNation = '';
	$scope.selectedHotel = '';

	$scope.checkEndLicense = function($event) {
		console.log('keyCode=', $event.keyCode);
		if ($event.keyCode==13 && $scope.license=='') {
			if ($scope.inform.bus_list.length > 0) {
				setTimeout(function() {
					angular.element('#saveInform').focus();
				}, 100);
			}
		} else if ($event.keyCode==13 && $scope.license != '') {
			setTimeout(function() {
				angular.element('#pax').focus().select();
			}, 0);
		}
	}
	$scope.changeInform = function() {
		if ($scope.informEdit.uuid=='') {
			today = new Date();
			$scope.inform = angular.copy(initial);
			$scope.nation = null;
			$scope.hotel = null;
			$scope.selectedNation = '';
			$scope.selectedHotel = '';
			setTimeout(function() {
				angular.element('input[autofocus]').focus().select();
			},0);
			return;
		}
		console.log('informEdit=', $scope.informEdit);
		$scope.inform = angular.copy($scope.informEdit);
		$scope.inform.date = $scope.inform.flight_date.substr(0, 10);
		$scope.inform.time = $scope.inform.flight_date.substr(11, 5);
		$scope.hotel = {
			name:$scope.inform.hotel,
		};
		$scope.selectedHotel = $scope.inform.hotel;
		dbSvc.request('countryByCode', {code:$scope.inform.nation}).then(function(result) {
			if (result.status === true) {
				$scope.nation = angular.copy(result.country);
				$scope.selectedNation = result.country.code + ':' + result.country.nation_en;
			}
		});
	}
	$scope.addBus = function($event, form) {
		if ($event.keyCode != 13) {
			return;
		}
		if ($scope.license=='' && $scope.inform.bus_list.length > 0) {
			setTimeout(function() {
				console.log('saveInfo focus');
				angular.element('#saveInform').focus();
			}, 0);
			return;
		} else if (form.pax.$invalid || 1*$scope.pax <= 0) {
			toaster.pop('warning', '', 'จำนวนคนไม่ถูกต้อง');
			setTimeout(function() {
				angular.element('#pax').focus().select();
			},0);
			return;
		}

		var list = $scope.license.split(/[^0-9\-nN]+/);
		console.log(list);
		list.forEach(function(license, i) {
			if (license.trim() === '') {
				return;
			}
			$scope.inform.bus_list.push({
				license:license,
				pax:i==0 ? 1*$scope.pax : 0,
			});
		});

		$scope.license='';
		$scope.pax=0;
		$scope.calcAmount();
		setTimeout(function() {
			angular.element('#license').focus().select();
		},0);
	}
	$scope.removeBus = function(e, idx) {
		console.log(e);
		e.preventDefault();
		$scope.inform.bus_list.splice(idx,1);
		$scope.calcAmount();
		setTimeout(function() {
			angular.element('#license').focus().select();
		},0);
	}

	$scope.admin_test = function() {
		console.log($scope.inform.note);
	}

	$scope.save = function() {
		if (is_saving==true) {
			toaster.pop('warning', '', 'กำลังบันทึก กรุณารอสักครู่');
			return;
		}
		is_saving = true;
		if ($scope.inform.bus_list.length == 0) {
			is_saving = false;
			toaster.pop('warning', '', 'กรุณาระบุข้อมูลรถ');
			setTimeout(function() {
				angular.element('#license').focus().select();
			},0);
			return;
		}

		if (! /[0-2][0-9]:[0-5][0-9]/.test($scope.inform.time)) {
			is_saving = false;
			toaster.pop('warning', '', 'เวลาลงจอดไม่ถูกต้อง');
			setTimeout(function() {
				angular.element('#flight_time').focus().select();
			},0);
			return;
		}
		if ($scope.cardAccount == null) {
			is_saving = false;
			toaster.pop('warning', 'เกิดข้อผิดพลาด', 'ไม่พบบัญชีของบัตร');
			return;
		}


		canSave = false;

		var addr = {
			code: $scope.memberAddress.code,
			name: $scope.memberAddress.name,
			addr: $scope.memberAddress.addr.replace(/\s+/g, ' '),
			lang: $scope.memberAddress.lang,
		};


		$scope.inform.flight = $scope.inform.flight.toUpperCase();
		var len = $scope.inform.bus_list.length;
		var totalPax = 0;
		
		for (var i = 0; i < len; i++) {
			totalPax += $scope.inform.bus_list[i].pax;
		}

		$scope.inform.totalPax = totalPax;
		var flight_date = $scope.inform.date + ' ' + $scope.inform.time+':00';
		var inform = {
			uuid:$scope.inform.uuid,
			code:$scope.inform.code,
		  card_code:$scope.carddb.code,
		  mem_code:$scope.member.code,
		  nation:$scope.nation.code,
		  flight:$scope.inform.flight,
		  flight_date:flight_date,
		  hotel:$scope.hotel.name,
		  group_name:$scope.inform.group_name,
		  note:$scope.inform.note,
		  ref_code:$scope.inform.ref_code,
		  total_pax:totalPax,
		  is_domestic:$scope.inform.is_domestic,
		  bus_list:$scope.inform.bus_list,
		};
		var param = {
			card_code:$scope.carddb.code,
			acc_code:$scope.cardAccount.code,
			mem_code:$scope.member.code,
			address:addr,
			pax:totalPax,
			payment_type:'CASH',
			amount:$scope.receipt.totalAmount,
			inform:inform,
			sellInform:$scope.sellInform,
		};
		console.log('inform to save=', param);

		setTimeout(function() {
			angular.element('#reset').focus();
		}, 0);

		dbSvc.request('informOneStopSave', param).then(function(result) {
			is_saving = false;
			if (result.status===true) {
				$scope.inform.code = result.code;
				$scope.inform.uuid = result.uuid;
				$scope.receipt.code = result.receipt_code;
				toaster.pop('success', '', 'บันทึกข้อมูลเรียบร้อยแล้ว');

				if ($scope.inform.is_domestic=='YES') {
					return;
				}

				receiptPrintService.printReceipt(result.receipt_code, 1);
				
				receiptPrintService.printBill(result.bill,1).then(function(){
					$scope.reset();
				});

			} else {
				toaster.pop('warning', '', result.reason);
				canSave = true;
			}
		}, function() {
			is_saving = false;
		});
	}

	var flipTo = function(idx) {
		// prepare back image to show
		angular.element('.ns-front img').attr({src:angular.element('.ns-cover img').attr('src')});
		angular.element('.ns-back .card-type').html(cardTypeList[idx].type);
		angular.element('.ns-back .card-code').html($scope.carddb.card_number);
		angular.element('.ns-back .card-name').html($scope.carddb.holder_name);
		angular.element('.ns-back .card-corp').html(cardTypeList[idx].type=='CORPORATE' ? $scope.cardAccount.name_th : '');
		angular.element('.ns-back img').attr({src:cardTypeList[idx].img});
		// start animation
		angular.element('.ns-wrapper').addClass('ns-perspective');
		angular.element('.ns-cover').addClass('ns-hide');
		angular.element('.ns-transition').addClass('ns-show');
		// update image cover image
		angular.element('.ns-cover .card-type').html(cardTypeList[idx].type);
		angular.element('.ns-cover .card-code').html($scope.carddb.card_number);
		angular.element('.ns-cover .card-name').html($scope.carddb.holder_name);
		angular.element('.ns-cover .card-corp').html(cardTypeList[idx].type=='CORPORATE' ? $scope.cardAccount.name_th : '');
		angular.element('.ns-cover img').attr({src:cardTypeList[idx].img});
	}
	
	$scope.isValid = function(form) {
		if ( form.$invalid
				|| $scope.inform.bus_list.length=='undefined'
				|| $scope.inform.bus_list.length==0
				|| typeof $scope.carddb == 'undefined'
				|| $scope.carddb.code == ''
				|| canSave === false) {
			return false;
		}
		return true;
	}
	$scope.getFlight = function() {	
		console.log('getFlight');
		var flight = $scope.inform.flight;
		if (typeof flight == 'undefined' || flight == '') {
			return;
		}
		flight = flight.substr(0,2).toUpperCase()+('0000'+flight.substr(2)).substr(-4);
		$scope.inform.flight = flight;

		var airport = $rootScope.setting.airport;

		dbSvc.request('flightCheck', {airport:airport,flight:flight}).then(function(result) {
			if (result.status===true) {
				$scope.inform.date = result.flight.landing_time.substr(0, 10);
				$scope.inform.time = result.flight.landing_time.substr(11,5);
			} else {
				toaster.pop('warning', 'ไม่พบเที่ยวบินที่ระบุ กรุณาตรวจสอบอีกครั้ง');
				return;
			}
		});
		return;
	}
	$scope.calcAmount = function() {
		var totalPax = 0;
		$scope.inform.bus_list.forEach(function(item) {
			totalPax += parseInt(item.pax);
		});
		$scope.receipt.pax = totalPax;
		$scope.receipt.amount = totalPax * $rootScope.config.coupon_price
				+ ($scope.sellInform ? parseFloat(informPriceObj.real_price) : 0);
		$scope.receipt.vatAmount = parseFloat(($scope.receipt.amount * $scope.receipt.vatRate / 100).toFixed(2));
		$scope.receipt.totalAmount = $scope.receipt.amount + $scope.receipt.vatAmount;
	}

	var changeMember = function() {
		var member = $scope.member;
		var out = [];

		for(var i = 0; i < member.addresses.length; i++) {
			var addr = [];
			
			if (member.addresses[i].addr1) {
				addr.push(member.addresses[i].addr1.trim());
			}
			
			if (member.addresses[i].addr2) {
				addr.push(member.addresses[i].addr2.trim());
			}
			
			addr.push(((member.addresses[i].tambon + ' ' + member.addresses[i].amphur).trim()
					 + ' ' + member.addresses[i].province + ' ' + member.addresses[i].zipcode).trim());
			
			out.push({
				code:member.addresses[i].code,
				name:member.addresses[i].name,
				addr:addr.join('\r\n'),
				lang:member.addresses[i].lang,
			});
		}

		$scope.memberAddresses = out;
		
		if (out.length > 0) {
			$scope.memberAddress = $scope.memberAddresses[0];
			$scope.changeAddress();
			setTimeout(function() {
				angular.element('#corp_addr').focus();
			}, 0);
		}
	}
	
	$scope.changeAddress = function() {
		console.log('selected=', $scope.memberAddress);
		$scope.receiptAddress = $scope.memberAddress.addr;
	}

	$scope.reset = function() {
		canSave = true;
		is_saving = false;
		// read card
		today = new Date();
		$scope.inform = angular.copy(initial);
		//$scope.selectedInform = '';
		$scope.receipt = {code:'',pax:0,vatRate:parseFloat($rootScope.config.vat_rate)};
		$scope.inform.uuid = '';
		$scope.nation = null;
		$scope.member = null;
		$scope.hotel = null;
		$scope.tranfers = null;
		$scope.selectedMember = '';
		$scope.selectedNation = '';
		$scope.selectedHotel = '';
		$scope.sellInform = false;

		cardReaderService.readCardInfo().then(function(info) {
			console.log('card info = ', info);

			if (info.carddb == null) {
				flipTo(0);
				return false;
			}
			
			if (!info.carddb.is_active) {
				toaster.pop('warning', 'บัตรยังไม่ถูกเปิดใช้งาน',
					'กรุณาตรวจสอบ\nหมายเลขบัตร:' + info.carddb.card_number + '\n' + 
					'ประเภทบัตร:' + info.carddb.type, 10000);
				flipTo(0);
				return false;
			}

			$scope.carddb = angular.copy(info.carddb);
			$scope.inform.card_code = info.carddb.code;
			$scope.cardAccount = angular.copy(info.cardAccount);
			$scope.informList=[];
			$scope.informList.push({uuid:'',title:''});
			$scope.informEdit=$scope.informList[0];

			if (info.carddb.type=='CORPORATE') {
				$scope.member = angular.copy(info.member);
				$scope.selectedMember = $scope.member.code+':'+$scope.member.name_en;
				changeMember();
				setTimeout(function() {
					angular.element('#nation').focus();
				}, 0);
			} else {
				setTimeout(function() {
					angular.element('#member').focus();
				}, 0);
			}

			flipTo(info.carddb.type=='CORPORATE' ? 1 : 2);
			dbSvc.request('informListByCard', {card_code:$scope.carddb.code}).then(function(result) {
				if (result.status===true) {
					result.informs.forEach(function(inform) {
						$scope.informList.push(inform);
					});
				} else {
					toaster.pop('warning', '', result.reason);
				}
			});
		});
	}

	$scope.showLovMember = function($event) {
		if ($event.keyCode != 32) {
			return;
		}
		if ($scope.carddb.type=='CORPORATE') {
			return;
		}

		$scope.lovQuery = "SELECT code, name_en, name_th, type, "
			+ "IF(type='ORDINARY','สามัญ',IF(type='EXTRA','สมทบ',IF(type='VIP','กิติมศักดิ์','เงินสด'))) type_name, "
			+ "uuid FROM member "
			+ " WHERE is_active='YES' ORDER BY name_en";
		$scope.fields = [
			{name:'uuid', text:'', hidden:true},
			{name:'mem_code', text:'', hidden:true},
			{name:'code', text:'',hidden:true},
			{name:'name_en', text:'ชื่อสมาชิก (อังกฤษ)'},
			{name:'name_th', text:'ชื่อสมาชิก (ไทย)'},
			{name:'type',text:'',hidden:true},
			{name:'type_name',text:'ประเภทสมาชิก'},
		];
		ngDialog.open({
			template: 'views/lov.html',
			controller: 'LovDialogCtrl',
			className: 'ngdialog-theme-default ngdialog-theme-lov',
			scope:$scope,
		}).closePromise.then(function(result) {
			if (result.value=='$closeButton' || typeof result.value==='undefined') {
				setTimeout(function() {
					angular.element('#member').focus().select();
				}, 0);
				return;
			}

			dbSvc.request('memberByUuid', {uuid:result.value.uuid}).then(function(result) {
				if (result.status===true) {
					$scope.member = angular.copy(result.member);
					$scope.selectedMember = $scope.member.code+':'+$scope.member.name_en;
					changeMember();
					setTimeout(function() {
						angular.element('#nation').focus();
					}, 0);
				}
			});
		});
	}

	$scope.showLovNation = function($event) {
		if ($event.keyCode != 32) {
			return;
		}

		$scope.lovQuery = 'SELECT code, nation_en, nation_th, name_en, name_th FROM country ORDER BY nation_en';
		$scope.fields = [
			{name:'code', text:'รหัส'},
			{name:'nation_en', text:'สัญชาติ (อังกฤษ)'},
			{name:'nation_th', text:'สัญชาติ (ไทย)'},
			{name:'name_th', text:'ประเทศ (ไทย)'},
			{name:'name_en', text:'ประเทศ (อังกฤษ)'},
		];
		ngDialog.open({
			template: 'views/lov.html',
			controller: 'LovDialogCtrl',
			className: 'ngdialog-theme-default ngdialog-theme-lov',
			scope:$scope,
		}).closePromise.then(function(result) {
			if (result.value=='$closeButton' || typeof result.value==='undefined') {
				setTimeout(function() {
					// if ($scope.nation != null) {
					// 	setTimeout(function() {
					// 		$scope.selectedNation = $scope.nation.code+':'+$scope.nation.nation_en;	
					// 	}, 0);
					// }
					angular.element('#nation').focus();
				}, 0);
				return;
			}
			$scope.nation = angular.copy(result.value);
			$scope.selectedNation = $scope.nation.code+':'+$scope.nation.nation_en;
			setTimeout(function() {
				angular.element('#flight').focus();
			}, 0);
		});
		return false;
	};

	$scope.showLovHotel = function($event) {
		if ($event.keyCode != 32) {
			return;
		}

		$scope.lovQuery = "SELECT name, place, tel FROM hotel ORDER BY name";
		$scope.fields = [
			{name:'name', text:'ชื่องโรงแรม/ที่พัก'},
			{name:'place', text:'ที่อยู่'},
			{name:'tel', text:'โทรศัพท์'},
		];
		ngDialog.open({
			template: 'views/lov.html',
			controller: 'LovDialogCtrl',
			className: 'ngdialog-theme-default ngdialog-theme-lov',
			scope:$scope,
		}).closePromise.then(function(result) {
			if (result.value=='$closeButton' || typeof result.value==='undefined') {
				setTimeout(function() {
					// if ($scope.hotel != null) {
					// 	$scope.selectedHotel = $scope.hotel.name;
					// }
					angular.element('#hotel').focus();
				}, 0);
				return;
			}
			$scope.hotel = angular.copy(result.value);
			console.log('hotel = ', $scope.hotel);
			$scope.selectedHotel = $scope.hotel.name;
			setTimeout(function() {
				angular.element('#group_name').focus();
			}, 0);
		});
	}

	$scope.showLovTrasferBy_OneStop = function($event){
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
					angular.element('#note').focus();
				}, 0);
				return;
			}
			$scope.tranfers = angular.copy(result.value);
			$scope.inform.note = $scope.tranfers.name_en;
			setTimeout(function() {
				angular.element('#ref_code').focus();
			}, 0);
		});
	};
	
	$scope.buyInform = function() {
		$rootScope.dummyReceipt = {
			items:[
				{code:'SHD',qty:1},
			],
		};

		if (typeof $scope.member === 'object' && $scope.member !== null) {
			$rootScope.dummyReceipt.mem_code = $scope.member.code;
		}

		$state.go('home.receipt_new', {uuid:''});
	}

	$scope.reset();

	setTimeout(function(){
		angular.element('.ns-wrapper').on('webkitAnimationStart', function() {
		}).on('webkitAnimationEnd', function() {
			angular.element('.ns-cover').removeClass('ns-hide');
			angular.element('.ns-wrapper').removeClass('ns-perspective');
			angular.element('.ns-transition').removeClass('ns-show');
		});
	},0);


}]).controller('CardCancelCtrl',['$scope', '$rootScope', 'dbSvc', 'toaster',
		'helper', '$filter', 'cardReaderService', 'ngDialog', '$state', 'lovService', 'receiptPrintService',
	function($scope, $rootScope, dbSvc, toaster,
			helper, $filter, cardReaderService, ngDialog, $state, lovService, receiptPrintService){
	console.log('aaa');

	//$scope.card.holder_name='';
	var initial = {
		member_name:'',
		holder_name:'',
		card_number:'',
		code:'',
	};

	$scope.cardCancelConfirm = function() {
    $scope.message = 'ต้องการยกเลิกบัตรเลขที่ ' + $scope.card.card_number + ' หรือไม่';
    $scope.positiveButton = 'ยกเลิกบัตร';
    $scope.negativeButton = 'ไม่ยกเลิก';
    $scope.positiveResponse = function() {
      doCancelCard();
    };
    $scope.negativeResponse = function(){

    };
    ngDialog.open({
	      template: 'views/confirm.html',
	      controller: 'ConfirmDialogCtrl',
	      className: 'ngdialog-theme-default ngdialog-theme-custom',
	      scope:$scope,
	    });
	}

	var doCancelCard = function(){
		var param = {
			card_code:$scope.card.code,
		};
		console.log('card code cancel=', param);
		setTimeout(function() {
			angular.element('#reset').focus();
		}, 0);

		dbSvc.request('cardCancel', param).then(function(result) {
			if (result.status===true) {
				toaster.pop('success', '', 'ยกเลิกบัตรสำเร็จ');
				$scope.reset();
			} else {
				toaster.pop('warning', '', result.reason);
			}
		});
	}

	var clearCard = function() {
		$scope.card = angular.copy(initial);
		setTimeout(function() {
			angular.element('#member').focus();
		},0);
	}

	$scope.showLovCard = function($event) {
		console.log('showLovCard');
		lovService.showLov($scope, 'lov_card_active', {cache:false}).then(function(result) {
			if (result===null) {
				clearInform();				
				return;
			}
			$scope.card = angular.copy(result);

			setTimeout(function() {
				angular.element('#member').focus();
			}, 0);
		});
	}

	$scope.reset = function() {
		$scope.card = angular.copy(initial);
		console.log($scope.card);
			setTimeout(function() {
				angular.element('#member').focus();
			},
			0);
	}

	$scope.isValid = function(form) {
		if ( form.$invalid
				|| $scope.card.holder_name=='undefined'
				|| $scope.card.holder_name==''
				|| $scope.card.holder_name==null) {
			return false;
		}
		if ( form.$invalid
				|| $scope.card.card_number=='undefined'
				|| $scope.card.card_number==''
				|| $scope.card.card_number==null) {
			return false;
		}
		if ( form.$invalid
				|| $scope.card.code=='undefined'
				|| $scope.card.code==''
				|| $scope.card.code==null) {
			return false;
		}
		return true;
	}


}]);


