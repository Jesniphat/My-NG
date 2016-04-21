angular.module('attaAccounting')

.controller('ReInvoiceCtrl', ['$scope', '$rootScope', 'dbSvc', 'toaster', 'ngDialog','lovService','receiptPrintService','$state', function($scope, $rootScope, dbSvc, toaster, ngDialog,lovService,receiptPrintService,$state) {

console.log('ReInvoiceCtrl');
	$scope.invoice = {
		code:'',
		codeTo:'',
		mem_code:'',
		status:'WAIT',
		reissue_date:'',
		deadline_date:'',
		reissue_date:'',
		prod_code:'',
	};
	$scope.selectedMember = {
		code:'',
		codeTo:'',
	};
	$scope.selectedInvoice = {};
	$scope.selectedProduct= {};
	$scope.invoicePrint = '';
	$scope.invoiceList = [{}];

	var save = function() {
		console.log('SAVE');
		var data = {
			mem_code: $scope.selectedMember.code,
			mem_code_to: $scope.selectedMember.codeTo,
			deadline_date: $scope.invoice.deadline_date,
			invoice_code: $scope.invoice.code,
			invoice_code_to: $scope.invoice.codeTo,
			reissue_date: $scope.invoice.reissue_date,
			prod_code: $scope.invoice.prod_code,
			remark: ($scope.invoice.remark==''||$scope.invoice.remark==undefined||$scope.invoice.remark==null) ? '' : $scope.invoice.remark,
		};

		dbSvc.request('ReinvoiceSave', data).then(function(result) {
			if (result.status===true) {
				//console.log(result.code);
				//$scope.invoice.code = result.code;
				$scope.invoiceList = result.code;
				toaster.pop('success', '', 'บันทึกเรียบร้อยแล้ว');
			} else {
				toaster.pop('warning', '', 'เกิดข้อผิดพลาด');
			}
		})
	}

	$scope.showLovMember = function($event) {
	if ($event.keyCode != 32) {
      return;
    }

		lovService.showLov($scope, 'member', {cache:true}).then(function(result) {
			if (result===null) {
				angular.element('#member').focus();
				return;
			}

			$scope.selectedMember = result;

			setTimeout(function() {
				angular.element('#memberTo').focus();
			},0);

		});

	}

	$scope.showLovMember2 = function($event) {
	if ($event.keyCode != 32) {
      return;
    }

		lovService.showLov($scope, 'member', {cache:true}).then(function(result) {
			if (result===null) {
				angular.element('#member').focus();
				return;
			}

			$scope.selectedMember.codeTo = result.code;

			setTimeout(function() {
				angular.element('#productcode').focus();
			},0);

		});

	}

	$scope.showLovProduct = function($event) {
    if ($event.keyCode != 32) {
      return;
    }
//  console.log($rootScope.setting.code.substr(-2));
	lovService.showLov($scope, 'product', {cache:true}).then(function(result) {
		if (result===null) {
			setTimeout(function() {
				angular.element('#productcode').focus();
			}, 0);
			return;
		}

		//$scope.invoiceItems[rowNumber].prod_code = result.code;
		$scope.selectedProduct = result;
		$scope.invoice.prod_code = $scope.selectedProduct.code;
		setTimeout(function() {
			angular.element('#reissue_date').focus();
		},0);

	});

  }

	$scope.checkDone = function() {
	  return true;
	};


  $scope.showLovInvoice = function($event) {
	if ($event.keyCode != 32) {
      return;
    }

		lovService.showLov($scope, 'invoice', {cache:false}).then(function(result) {
			if (result===null) {
				angular.element('#invoicecode').focus();
				return;
			}

			$scope.selectedInvoice = result;
			$scope.invoice.code = $scope.selectedInvoice.code;

			setTimeout(function() {
				angular.element('#invoicecodeto').focus();
			},0);

		});

	}

	$scope.showLovInvoice2 = function($event) {
	if ($event.keyCode != 32) {
      return;
    }

		lovService.showLov($scope, 'invoice', {cache:false}).then(function(result) {
			if (result===null) {
				angular.element('#invoicecode').focus();
				return;
			}

			//$scope.selectedInvoice = result;
			$scope.invoice.codeTo = result.code;

			setTimeout(function() {
				angular.element('#member').focus();
			},0);

		});

	}

  $scope.reset = function() {

	$scope.selectedMember = {};
	$scope.address = '';
	$scope.invoiceItems = [{}];
	$scope.selectedProduct = {};
    $scope.memberObj = null;
    $scope.invoiceObj = null;

	$scope.selectedInvoice = {};
	$scope.invoicePrint = '';
	$scope.invoiceList = [{}];

    $scope.invoice = {
		code:'',
		codeTo:'',
		mem_code:'',
		status:'WAIT',
		reissue_date:'',
		deadline_date:'',
		reissue_date:'',
		prod_code:'',
    };
    //$scope.isLock = $scope.receipt.uuid!='';
    $scope.staff_name = $rootScope.sessionStaff.fullname;
    setTimeout(function() {
      angular.element('#invoicecode').focus().select();
    }, 0);
  }


   $scope.isValid = function() {
    if ((typeof $scope.selectedMember.code === 'undefined' || $scope.selectedMember.code.trim()=='') && (typeof $scope.invoice.code === 'undefined' || $scope.invoice.code.trim()=='')) {
      return false;
    }

	// if ((typeof $scope.invoice.prod_code === 'undefined' ||  $scope.invoice.prod_code.trim()=='')) {
 //      return false;
 //    }

	if ((typeof $scope.invoice.deadline_date === 'undefined' ||  $scope.invoice.deadline_date.trim()=='')) {
      return false;
    }

	if ((typeof $scope.invoice.reissue_date === 'undefined' ||  $scope.invoice.reissue_date.trim()=='')) {
      return false;
    }

	if ($scope.invoice.deadline_date < $scope.invoice.reissue_date){
	  return false;
	}

    return true;
  }

  $scope.buyInform = function() {
		//console.log($scope.invoice.code);
		$rootScope.dummyReceipt = {
			invoice_code:$scope.invoice.code,
		}
		//console.log($rootScope.dummyReceipt.invoice_code);
		$state.go('home.receipt_new', {uuid:''});
	}

	$scope.isValidPrint = function() {

	  //invoice.code
	  //selectedMember.code
	  //invoice.prod_code
	  if ((typeof $scope.invoice.code === 'undefined' || $scope.invoice.code.trim()=='') && (typeof $scope.selectedMember.code === 'undefined' || $scope.selectedMember.code.trim()=='')) {
        return false;
      }

	  // if ((typeof $scope.invoice.prod_code === 'undefined' || $scope.invoice.prod_code.trim()=='')) {
   //      return false;
   //    }

	  return true;

   }

	var print = function(){

		 receiptPrintService.printInvoiceList($scope.invoiceList,1).then(function(){
			console.log($scope.invoiceList);
	      })

	}

	$scope.ConfirmPrint = function() {

		$scope.message = 'ต้องการพิมพ์ใบแจ้งหนี้ หรือไม่ '
			+ '\nใบแจ้งหนี้เลขที่: ' + $scope.invoicePrint;
		$scope.positiveButton = 'พิมพ์';
		$scope.negativeButton = 'ยกเลิก';
		$scope.positiveResponse = function() {
			print();
			//toaster.pop('success', '', 'พิมพ์ข้อมูลใบแจ้งหนี้เรียบร้อยแล้ว');
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

	$scope.ConfrimSave = function(_action){

		var memFrom = $scope.selectedMember.code;
		var memTo = $scope.selectedMember.codeTo;
		var invCodeFrom =  $scope.invoice.code;
		var invCodeTo = $scope.invoice.codeTo;

		if ($scope.selectedMember.codeTo==''||$scope.selectedMember.codeTo==null||$scope.selectedMember.codeTo==undefined){
			$scope.selectedMember.codeTo = memFrom;
		}

		if ($scope.selectedMember.codeTo.trim() != '' && ($scope.selectedMember.code > $scope.selectedMember.codeTo)) {
			memFrom = $scope.selectedMember.codeTo;
			memTo = $scope.selectedMember.code;

			$scope.selectedMember.code = memFrom;
			$scope.selectedMember.codeTo = memTo;
		}

		if ($scope.invoice.codeTo==''||$scope.invoice.codeTo==null||$scope.invoice.codeTo==undefined){
			$scope.invoice.codeTo = invCodeFrom;
		}

		if ($scope.invoice.codeTo.trim() != '' && ($scope.invoice.code > $scope.invoice.codeTo)) {
			invCodeFrom = $scope.invoice.codeTo;
			invCodeTo = $scope.invoice.code;

			$scope.invoice.code = invCodeFrom;
			$scope.invoice.codeTo = invCodeTo;
		}

		var data = {
			mem_code: $scope.selectedMember.code,
			mem_code_to: $scope.selectedMember.codeTo,
			deadline_date: $scope.invoice.deadline_date,
			invoice_code: $scope.invoice.code,
			invoice_code_to: $scope.invoice.codeTo,
			reissue_date: $scope.invoice.reissue_date,
			prod_code: $scope.invoice.prod_code,
			remark: $scope.invoice.remark,
		};

		if (_action == 'save'){
			console.log(data);
			dbSvc.request('listInvoiceCode', data).then(function(result) {
			//console.log('save2222');
			if (result.status===true) {
				//console.log('save333');
				//console.log(result.code.length);
				if (result.code.length > 0){
					$scope.invoiceList = result.code;

					if(result.code.length > 0){
						if (result.code[0] == result.code[result.code.length - 1]){
							$scope.invoicePrint = result.code[0];
						}else{
							$scope.invoicePrint = result.code[0] + '-' + result.code[result.code.length - 1];
						}
					}

					$scope.message = 'ต้องการบันทึกใบแจ้งหนี้ หรือไม่ '
					+ '\nใบแจ้งหนี้เลขที่: ' + $scope.invoicePrint;
					$scope.positiveButton = 'บันทึก';
					$scope.negativeButton = 'ยกเลิก';
					$scope.positiveResponse = function() {
						save();
						$scope.ConfirmPrint();
					};
					$scope.negativeResponse = function(){

					}
					ngDialog.open({
						template: 'views/confirm.html',
						controller: 'ConfirmDialogCtrl',
						className: 'ngdialog-theme-default ngdialog-theme-custom',
						scope:$scope,
					});

				}else{
					toaster.pop('warning', '', 'ไม่พบใบแจ้งหนี้ ที่มีรายการสินค้านี้');
				}

			} else {
				toaster.pop('warning', '', 'เกิดข้อผิดพลาด');
			}
		  })
		}else{

			dbSvc.request('listInvoiceCode', data).then(function(result) {
			if (result.status===true ) {

				if (result.code.length > 0){
						$scope.invoiceList = result.code;

						if(result.code.length > 0){
						if (result.code[0] == result.code[result.code.length - 1]){
							$scope.invoicePrint = result.code[0];
						}else{
							$scope.invoicePrint = result.code[0] + '-' + result.code[result.code.length - 1];
						}
					}
					$scope.ConfirmPrint();
				}else{
					toaster.pop('warning', '', 'ไม่พบใบแจ้งหนี้ ที่มีรายการสินค้านี้');
				}

				//toaster.pop('success', '', 'บันทึกเรียบร้อยแล้ว');
			} else {
				toaster.pop('warning', '', 'เกิดข้อผิดพลาด');
			}
		  })
		}

  }

}])

.controller('RePrintInvoiceCtrl', ['$scope', '$rootScope', 'dbSvc', 'toaster', 'helper', 'ngDialog','lovService','receiptPrintService','$state', function($scope, $rootScope, dbSvc, toaster, helper, ngDialog,lovService,receiptPrintService,$state) {

console.log('RePrintInvoiceCtrl');
	$scope.invoice = {
		code:'',
		codeTo:'',
		mem_code:'',
		status:'WAIT',
		reissue_date:'',
		deadline_date:'',
		reissue_date:'',
		prod_code:'',
	};
	$scope.selectedMember = {
		code:'',
		codeTo:'',
	};
	$scope.selectedInvoice = {};
	$scope.selectedProduct= {};
	$scope.invoicePrint = '';
	$scope.invoiceList = [{}];
	$scope.isPreview = false;

	$scope.a_code = [];
	$scope.lengthListsCode = 1;
	$scope.billName = '';
	$scope.billAddress = '';
	$scope.invoiceBillCode = '';
	$scope.invoiceBillDate = '';
	$scope.paidBillDate = '';
	$scope.billTotal = '';
	$scope.vatBillAmount = '';
	$scope.grandBillTotal = '';
	$scope.billRemark = '';
	$scope.invoiceBillItems = [];
	$scope.totalBillText = '';
	$scope.pageFrom = '';
	$scope.pageTo = '';

	$scope.memberType = [
		{value:'ALL',label:'ทุกประเภท'},
		{value:'VIP',label:'กิติมศักดิ์'},
		{value:'ORDINARY',label:'สามัญ'},
		{value:'EXTRA',label:'สมทบ'},
	];

	$scope.isActiveList = [
		{value:'ALL',label:'ทั้งหมด'},
		{value:'YES',label:'เฉพาะสมาชิกปัจจุบัน'},
	];

	$scope.param = {
		memberType:'ALL',
		is_active:'ALL',
	};

	$scope.jCheck = function(){
		var memFrom = $scope.selectedMember.code;
		var memTo = $scope.selectedMember.codeTo;
		var invCodeFrom =  $scope.invoice.code;
		var invCodeTo = $scope.invoice.codeTo;

		if ($scope.selectedMember.codeTo==''||$scope.selectedMember.codeTo==null||$scope.selectedMember.codeTo==undefined){
			$scope.selectedMember.codeTo = memFrom;
		}

		if ($scope.selectedMember.codeTo.trim() != '' && ($scope.selectedMember.code > $scope.selectedMember.codeTo)) {
			memFrom = $scope.selectedMember.codeTo;
			memTo = $scope.selectedMember.code;

			$scope.selectedMember.code = memFrom;
			$scope.selectedMember.codeTo = memTo;
		}

		if ($scope.invoice.codeTo==''||$scope.invoice.codeTo==null||$scope.invoice.codeTo==undefined){
			$scope.invoice.codeTo = invCodeFrom;
		}

		if ($scope.invoice.codeTo.trim() != '' && ($scope.invoice.code > $scope.invoice.codeTo)) {
			invCodeFrom = $scope.invoice.codeTo;
			invCodeTo = $scope.invoice.code;

			$scope.invoice.code = invCodeFrom;
			$scope.invoice.codeTo = invCodeTo;
		}

		var data = {
			mem_code: $scope.selectedMember.code,
			mem_code_to: $scope.selectedMember.codeTo,
			invoice_code: $scope.invoice.code,
			invoice_code_to: $scope.invoice.codeTo,
			member_type: $scope.param.memberType,
			is_active: $scope.param.is_active,
		};
		console.log(data);
	};

	$scope.showLovMember = function($event) {
	if ($event.keyCode != 32) {
      return;
    }

		lovService.showLov($scope, 'member', {cache:true}).then(function(result) {
			if (result===null) {
				angular.element('#member').focus();
				return;
			}

			$scope.selectedMember = result;

			setTimeout(function() {
				angular.element('#memberTo').focus();
			},0);

		});

	}

	$scope.showLovMember2 = function($event) {
	if ($event.keyCode != 32) {
      return;
    }

		lovService.showLov($scope, 'member', {cache:true}).then(function(result) {
			if (result===null) {
				angular.element('#member').focus();
				return;
			}

			$scope.selectedMember.codeTo = result.code;

			setTimeout(function() {
				angular.element('#memberTo').focus();
			},0);

		});

	}

	$scope.showLovProduct = function($event) {
    if ($event.keyCode != 32) {
      return;
    }
//  console.log($rootScope.setting.code.substr(-2));
	lovService.showLov($scope, 'product', {cache:true}).then(function(result) {
		if (result===null) {
			setTimeout(function() {
				angular.element('#productcode').focus();
			}, 0);
			return;
		}

		//$scope.invoiceItems[rowNumber].prod_code = result.code;
		$scope.selectedProduct = result;
		$scope.invoice.prod_code = $scope.selectedProduct.code;
		setTimeout(function() {
			angular.element('#reissue_date').focus();
		},0);

	});

  }

	$scope.checkDone = function() {
	  return true;
	};


  $scope.showLovInvoice = function($event) {
	if ($event.keyCode != 32) {
      return;
    }

		lovService.showLov($scope, 'invoice_re', {cache:false}).then(function(result) {
			if (result===null) {
				angular.element('#invoicecode').focus();
				return;
			}

			$scope.selectedInvoice = result;
			$scope.invoice.code = $scope.selectedInvoice.code;

			setTimeout(function() {
				angular.element('#invoicecodeto').focus();
			},0);

		});

	}

	$scope.showLovInvoice2 = function($event) {
	if ($event.keyCode != 32) {
      return;
    }

		lovService.showLov($scope, 'invoice_re', {cache:false}).then(function(result) {
			if (result===null) {
				angular.element('#invoicecode').focus();
				return;
			}

			//$scope.selectedInvoice = result;
			$scope.invoice.codeTo = result.code;

			setTimeout(function() {
				angular.element('#member').focus();
			},0);

		});

	}

  $scope.reset = function() {

	$scope.selectedMember = {};
	$scope.address = '';
	$scope.invoiceItems = [{}];
	$scope.selectedProduct = {};
    $scope.memberObj = null;
    $scope.invoiceObj = null;

	$scope.selectedInvoice = {};
	$scope.invoicePrint = '';
	$scope.invoiceList = [{}];
	$scope.pageFrom = "";
	$scope.pageTo = "";

    $scope.invoice = {
		code:'',
		codeTo:'',
		mem_code:'',
		status:'WAIT',
		reissue_date:'',
		deadline_date:'',
		reissue_date:'',
		prod_code:'',
    };
    $scope.isPreview = false;
    //$scope.isLock = $scope.receipt.uuid!='';
    $scope.staff_name = $rootScope.sessionStaff.fullname;
    setTimeout(function() {
      angular.element('#invoicecode').focus().select();
    }, 0);
  }

   $scope.isValid = function() {
    if ((typeof $scope.selectedMember.code === 'undefined' || $scope.selectedMember.code.trim()=='') && (typeof $scope.invoice.code === 'undefined' || $scope.invoice.code.trim()=='')) {
      return false;
    }

	if ((typeof $scope.invoice.deadline_date === 'undefined' ||  $scope.invoice.deadline_date.trim()=='')) {
      return false;
    }

	if ((typeof $scope.invoice.reissue_date === 'undefined' ||  $scope.invoice.reissue_date.trim()=='')) {
      return false;
    }

	if ($scope.invoice.deadline_date < $scope.invoice.reissue_date){
	  return false;
	}

    return true;
  }

  $scope.isPreviewValid = function(){
  	if ($scope.isPreview){
  		return true;
  	}
  	return false;
  }

  $scope.buyInform = function() {
		//console.log($scope.invoice.code);
		$rootScope.dummyReceipt = {
			invoice_code:$scope.invoice.code,
		}
		//console.log($rootScope.dummyReceipt.invoice_code);
		$state.go('home.receipt_new', {uuid:''});
	}

	$scope.isValidPrint = function() {
	  if ((typeof $scope.invoice.code === 'undefined' || $scope.invoice.code.trim()=='') && (typeof $scope.selectedMember.code === 'undefined' || $scope.selectedMember.code.trim()=='')) {
        return false;
      }
	  return true;

   }

	var print = function(){
		//console.log($scope.invoiceList); // ["AR15100018", "AR15100019", "AR15100020"]
		 receiptPrintService.printInvoiceList($scope.invoiceList,1).then(function(){
			console.log($scope.invoiceList);// numberig Array
	      })

	}

	var printInvoicePreview = function(px){
		//console.log(px); // ["AR15100018", "AR15100019", "AR15100020"]
		receiptPrintService.printInvoiceList(px,1).then(function(){
			console.log(px);// numberig Array
	    })

	}

	$scope.ConfirmPrint = function() {

		$scope.message = 'ต้องการพิมพ์ใบแจ้งหนี้ หรือไม่ '
			+ '\nใบแจ้งหนี้เลขที่: ' + $scope.invoicePrint;
		$scope.positiveButton = 'พิมพ์';
		$scope.negativeButton = 'ยกเลิก';
		$scope.positiveResponse = function() {
			print();
			//toaster.pop('success', '', 'พิมพ์ข้อมูลใบแจ้งหนี้เรียบร้อยแล้ว');
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

	$scope.ConfrimSave = function(_action){

		var memFrom = $scope.selectedMember.code;
		var memTo = $scope.selectedMember.codeTo;
		var invCodeFrom =  $scope.invoice.code;
		var invCodeTo = $scope.invoice.codeTo;

		if ($scope.selectedMember.codeTo==''||$scope.selectedMember.codeTo==null||$scope.selectedMember.codeTo==undefined){
			$scope.selectedMember.codeTo = memFrom;
		}

		if ($scope.selectedMember.codeTo.trim() != '' && ($scope.selectedMember.code > $scope.selectedMember.codeTo)) {
			memFrom = $scope.selectedMember.codeTo;
			memTo = $scope.selectedMember.code;

			$scope.selectedMember.code = memFrom;
			$scope.selectedMember.codeTo = memTo;
		}

		if ($scope.invoice.codeTo==''||$scope.invoice.codeTo==null||$scope.invoice.codeTo==undefined){
			$scope.invoice.codeTo = invCodeFrom;
		}

		if ($scope.invoice.codeTo.trim() != '' && ($scope.invoice.code > $scope.invoice.codeTo)) {
			invCodeFrom = $scope.invoice.codeTo;
			invCodeTo = $scope.invoice.code;

			$scope.invoice.code = invCodeFrom;
			$scope.invoice.codeTo = invCodeTo;
		}

		var data = {
			mem_code: $scope.selectedMember.code,
			mem_code_to: $scope.selectedMember.codeTo,
			invoice_code: $scope.invoice.code,
			invoice_code_to: $scope.invoice.codeTo,
			member_type: $scope.param.memberType,
			is_active: $scope.param.is_active,
		};

		if (_action == 'save'){
			console.log(data);
			dbSvc.request('listInvoiceCode', data).then(function(result) {
			//console.log('save2222');
			if (result.status===true) {
				//console.log('save333');
				//console.log(result.code.length);
				if (result.code.length > 0){
					$scope.invoiceList = result.code;

					if(result.code.length > 0){
						if (result.code[0] == result.code[result.code.length - 1]){
							$scope.invoicePrint = result.code[0];
						}else{
							$scope.invoicePrint = result.code[0] + '-' + result.code[result.code.length - 1];
						}
					}

					$scope.message = 'ต้องการบันทึกใบแจ้งหนี้ หรือไม่ '
					+ '\nใบแจ้งหนี้เลขที่: ' + $scope.invoicePrint;
					$scope.positiveButton = 'บันทึก';
					$scope.negativeButton = 'ยกเลิก';
					$scope.positiveResponse = function() {
						save();
						$scope.ConfirmPrint();
					};
					$scope.negativeResponse = function(){

					}
					ngDialog.open({
						template: 'views/confirm.html',
						controller: 'ConfirmDialogCtrl',
						className: 'ngdialog-theme-default ngdialog-theme-custom',
						scope:$scope,
					});

				}else{
					toaster.pop('warning', '', 'ไม่พบใบแจ้งหนี้ ที่มีรายการสินค้านี้');
				}

			} else {
				toaster.pop('warning', '', 'เกิดข้อผิดพลาด');
			}
		  })
		}else{
			console.log('My Print');
			dbSvc.request('listInvoiceCodeReprint', data).then(function(result) {
			if (result.status===true ) {
				if (result.code.length > 0){
						$scope.invoiceList = result.code;
						if(result.code.length > 0){
						if (result.code[0] == result.code[result.code.length - 1]){
							$scope.invoicePrint = result.code[0];
						}else{
							$scope.invoicePrint = result.code[0] + '-' + result.code[result.code.length - 1];
						}
					}
					$scope.ConfirmPrint();
				}else{
					toaster.pop('warning', '', 'ไม่พบใบแจ้งหนี้ ที่มีรายการสินค้านี้');
				}

				//toaster.pop('success', '', 'บันทึกเรียบร้อยแล้ว');
			} else {
				toaster.pop('warning', '', 'เกิดข้อผิดพลาด');
			}
		  })
		}

  }

  var doPreviews = function(index){
  	var code = $scope.a_code[index];
  	console.log(code);
    var str = (parseInt(code.substr(2, 8))) + "";
    var pad = "00000000";
    var nextCode = code.substr(0, 2) + pad.substring(0, pad.length - str.length) + str;

    dbSvc.request('getNextInvoice', {invoice_code:nextCode}).then(function(result) {
      if(result.status===true){
        console.log(result);
        $scope.selectedInvoice = result.invoice_code;
		$scope.invoiceBillCode = 'เลขที่ : ' + $scope.selectedInvoice.code;
		$scope.billName = 'นาม : ' + $scope.selectedInvoice.mem_code + ' ' + $scope.selectedInvoice.thai_name + ' TAX#' + $scope.selectedInvoice.tax_id;
		$scope.billAddress = 'ที่อยู่ : ' + $scope.selectedInvoice.branch_name + ' ' + $scope.selectedInvoice.addr1 + ' ' + $scope.selectedInvoice.addr2
							+ '\n      ' + $scope.selectedInvoice.tambon + ' ' + $scope.selectedInvoice.amphur
							+ '\n      ' + $scope.selectedInvoice.province + ' ' + $scope.selectedInvoice.zipcode;
		$scope.invoiceBillDate = 'วันที่ : ' + helper.thDate($scope.selectedInvoice.issue_date);
		$scope.paidBillDate = 'ชำระภายในวันที่ : ' + helper.thDate($scope.selectedInvoice.deadline_date);
		$scope.billTotal = 'รวมเงิน : ' + helper.formatNumber($scope.selectedInvoice.totals);
		$scope.vatBillAmount = 'VAT AMOUNT : ' + helper.formatNumber($scope.selectedInvoice.vat_amount);
		$scope.grandBillTotal = 'รวมเงินทั้งสิ้น : ' + helper.formatNumber($scope.selectedInvoice.total_amount);
		$scope.billRemark = 'หมายเหตุ : ' + $scope.selectedInvoice.remark;
		$scope.totalBillText = '***' + helper.bahtText($scope.selectedInvoice.total_amount) + '***';
       loadInvoice($scope.selectedInvoice.code);
      } else {
        console.log(result);
        toaster.pop('warning', '', 'ไม่พบเลข Invoice ' + nextCode);
      }
    });
  }

	var loadInvoice = function(code) {
  	console.log(code);
    dbSvc.request('invoiceItems', {code:code}).then(function(result) {
      if (result.status===true) {
        var invoice = result.invoice;
        console.log(invoice);
        $scope.invoiceBillItems=[];
        for(var i = 0; i < invoice.items.length; i++) {
          invoice.items[i].qty = parseInt(invoice.items[i].qty);
          $scope.invoiceBillItems.push(invoice.items[i]);
        }
        console.log($scope.invoiceBillItems);
				//$scope.updateInvoice();
				$scope.invoiceList[0] = code;
				console.log($scope.invoiceList);
				//$scope.isNext = true;
      }
    });
  }

  $scope.previewInvoice = function() {
  	$scope.isPreview = true;
  	$scope.printAction = 'printAll';
  	var memFrom = $scope.selectedMember.code;
	var memTo = $scope.selectedMember.codeTo;
	var invCodeFrom =  $scope.invoice.code;
	var invCodeTo = $scope.invoice.codeTo;

	if ($scope.selectedMember.codeTo==''||$scope.selectedMember.codeTo==null||$scope.selectedMember.codeTo==undefined){
		$scope.selectedMember.codeTo = memFrom;
	}

	if ($scope.selectedMember.codeTo != '' && ($scope.selectedMember.code > $scope.selectedMember.codeTo)) {
		memFrom = $scope.selectedMember.codeTo;
		memTo = $scope.selectedMember.code;

		$scope.selectedMember.code = memFrom;
		$scope.selectedMember.codeTo = memTo;
	}

	if ($scope.invoice.codeTo==''||$scope.invoice.codeTo==null||$scope.invoice.codeTo==undefined){
		$scope.invoice.codeTo = invCodeFrom;
	}

	if ($scope.invoice.codeTo.trim() != '' && ($scope.invoice.code > $scope.invoice.codeTo)) {
		invCodeFrom = $scope.invoice.codeTo;
		invCodeTo = $scope.invoice.code;

		$scope.invoice.code = invCodeFrom;
		$scope.invoice.codeTo = invCodeTo;
	}

	var data = {
		mem_code: $scope.selectedMember.code,
		mem_code_to: $scope.selectedMember.codeTo,
		invoice_code: $scope.invoice.code,
		invoice_code_to: $scope.invoice.codeTo,
		member_type: $scope.param.memberType,
		is_active: $scope.param.is_active,
	};

	console.log('My Preview');
	dbSvc.request('listInvoiceCodeReprint', data).then(function(result) {
	if (result.status===true ) {
		if (result.code.length > 0){
			$scope.a_code = [{}];
			console.log(result.code);
			var f_code = result.code;
			var x = 1;
			for (i in f_code){
				$scope.a_code[x] = f_code[i];
				x++;
			}
		 	console.log($scope.a_code);
			// console.log($scope.a_code[1],($scope.a_code.length)-1);
			$scope.lengthListsCode = ($scope.a_code.length)-1;
			$scope.totalInvoiceList = $scope.lengthListsCode;
			$scope.nowInvoiceList = 1;
			doPreviews(1);
		}else{
			toaster.pop('warning', '', 'ไม่พบใบแจ้งหนี้ ที่มีรายการสินค้านี้');
		}
	} else {
		toaster.pop('warning', '', 'เกิดข้อผิดพลาด');
	}
  })

 }

 $scope.changePage = function(){
 	//$scope.invoiceBillItems = [];
 	doPreviews($scope.nowInvoiceList);
 }

 $scope.nextBill = function(){
 	if ($scope.nowInvoiceList < $scope.totalInvoiceList){
 		$scope.nowInvoiceList ++;
 		$scope.changePage();
 		//console.log($scope.nowInvoiceList);
 	}else{
 		//toaster.pop('warning', '', 'คุณเลือกใบแจ้งหนี้มาเกิน');
 		$scope.nowInvoiceList = $scope.totalInvoiceList;
 	}
 }

 $scope.previousBill = function(){
 	if ($scope.nowInvoiceList > 1){
 		$scope.nowInvoiceList --;
 		$scope.changePage();
 		//console.log($scope.nowInvoiceList);
 	}else{
 		//toaster.pop('warning', '', 'คุณเลือกใบแจ้งหนี้มาเกิน');
 		$scope.nowInvoiceList = 1;
 	}
 }

 $scope.printCheck = function(){
 	console.log($scope.printAction);
 	if($scope.printAction == 'printAll'){
 		var px = [];
 		for(var x in $scope.a_code){
 			px.push($scope.a_code[x]);
 		}
 		printInvoicePreview(px);
 	} else if ($scope.printAction == 'printPage'){
 		var px = [];
 		px.push($scope.a_code[$scope.nowInvoiceList]);
 		printInvoicePreview(px);
 	} else if ($scope.printAction == 'printPageTo'){
 		var px = [];
 		console.log($scope.pageFrom,$scope.pageTo);
 		var min = parseInt($scope.pageFrom);
 		var max = parseInt($scope.pageTo);
 		for(var i = min ; i <= max ; i++){
			console.log(i);
			px.push($scope.a_code[i]);
		}
		printInvoicePreview(px);
 	}
 }

 $scope.checkPageForm = function(){
 	//console.log($scope.pageFrom);
 	if ($scope.pageFrom  == '' || $scope.pageFrom == null || $scope.pageFrom ==undefined){
 		console.log("-");
 	} else if ($scope.pageFrom < 1 || $scope.pageFrom > $scope.totalInvoiceList){
 		toaster.pop('warning', '', 'คุณใส่ข้อมูลไม่ถูกต้อง');
 		$scope.pageFrom = '';
 	}
 }

 $scope.checkPageTo = function(){
 	if ($scope.pageTo  == '' || $scope.pageTo == null || $scope.pageTo ==undefined){
 		console.log("-");
 	} else if ($scope.pageTo < 1 || $scope.pageTo > $scope.totalInvoiceList){
 		toaster.pop('warning', '', 'คุณใส่ข้อมูลไม่ถูกต้อง');
 		$scope.pageTo = '';
 	}
 }

}]);
