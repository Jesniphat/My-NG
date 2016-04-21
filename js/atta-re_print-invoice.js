angular.module('attaAccounting')

.controller('RePrintInvoiceCtrl', ['$scope', '$rootScope', 'dbSvc', 'toaster', 'ngDialog','lovService','receiptPrintService','$state', function($scope, $rootScope, dbSvc, toaster, ngDialog,lovService,receiptPrintService,$state) {

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
			remark: $scope.invoice.remark,
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
				angular.element('#invoicecodeTo').focus();
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
	
	  if ((typeof $scope.invoice.prod_code === 'undefined' || $scope.invoice.prod_code.trim()=='')) {
        return false;
      }		  
	
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
		
		if ($scope.selectedMember.codeTo.trim() != '' && ($scope.selectedMember.code > $scope.selectedMember.codeTo)) {
			memFrom = $scope.selectedMember.codeTo;
			memTo = $scope.selectedMember.code;

			$scope.selectedMember.code = memFrom;
			$scope.selectedMember.codeTo = memTo;
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
   
}]);
