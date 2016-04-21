angular.module('attaAccounting')

.controller('InvoiceCtrl', ['$scope', '$rootScope', 'dbSvc', 'toaster', 'ngDialog','lovService','receiptPrintService','$state', function($scope, $rootScope, dbSvc, toaster, ngDialog,lovService,receiptPrintService,$state) {
	$scope.invoice = {
		code:'',
		mem_code:'',
		status:'WAIT',
		reissue_date:'',
		receipt_code:'',
		deadline_date:'',
	};
	$scope.invoiceItems = [
		{
			prod_code:'',
			name:'',
			qty:1,
			unit:'',
			price:0,
			amount:0,
		},
	];
	$scope.memberObj = null;
	$scope.selectedMember = {};
	$scope.selectedMember.codeTo = "";
	$scope.selectedReceipt = {};
	$scope.selectedInvoice = {};
	$scope.address = '';
	$scope.addressId = '0';
	$scope.invoiceItems = [{}];
	//$scope.invoivePrint = [{}];
	$scope.invoicePrint = '';
	$scope.invoiceList = [{}];
	$scope.isNext = false;
	$scope.isRealReceipt = false;
	$scope.memberAddresses = [];
	$scope.isLockInvoice = false;

	$scope.jCheck = function() {
		var data = {
			mem_code: $scope.selectedMember.code,
			mem_code_to: $scope.selectedMember.codeTo,
			deadline_date: $scope.invoice.deadline_date,
			remark: $scope.invoice.remark,
			items: [],
			invoice_code: $scope.invoice.code,
			receipt_code: $scope.selectedReceipt.code,
		};

		for(var i in $scope.invoiceItems) {
			data.items.push({
				prod_code: $scope.invoiceItems[i].prod_code,
				qty: $scope.invoiceItems[i].qty
				//id: ($scope.invoiceItems[i].id==undefined) ? '' : $scope.invoiceItems[i].id
			});
		}

		console.log(data);
	}

	var save = function() {

		var data = {
			mem_code: $scope.selectedMember.code,
			mem_code_to: $scope.selectedMember.codeTo,
			deadline_date: $scope.invoice.deadline_date,
			remark: ($scope.invoice.remark == null || $scope.invoice.remark == undefined) ? "" : $scope.invoice.remark,
			items: [],
			invoice_code: $scope.invoice.code,
			receipt_code: ($scope.selectedReceipt.code == null || $scope.selectedReceipt.code == undefined) ? "" : $scope.selectedReceipt.code,
			issue_date: $scope.invoice.issue,
			branch_name: $scope.memberAddress.name,
			addr: $scope.address,
			member_name:$scope.selectedMember.name_th,
			addrId: $scope.addressId
		};
		
		console.log(data);

		for(var i in $scope.invoiceItems) {
			data.items.push({
				prod_code: $scope.invoiceItems[i].prod_code,
				qty: $scope.invoiceItems[i].qty
			});
		}

		dbSvc.request('invoiceSave', data).then(function(result) {
			if (result.status===true) {
				//console.log(result.code);
				$scope.invoiceList = result.invoiceList;
				if(result.invoiceList.length > 0){
					if (result.invoiceList[0] == result.invoiceList[result.invoiceList.length - 1]){
						$scope.invoicePrint = result.invoiceList[0];
					}else{
						$scope.invoicePrint = result.invoiceList[0] + '-' + result.invoiceList[result.invoiceList.length - 1];
					}
				}
				//console.log($scope.invoicePrint);
				$scope.invoice.code = result.code;
				toaster.pop('success', '', 'บันทึกเรียบร้อยแล้ว');
				$scope.isNext = true;
				$scope.checkRealReceiptFn();
				$scope.ConfirmPrint();
			} else {
				toaster.pop('warning', '', 'เกิดข้อผิดพลาด');
			}
		})
	}

	$scope.printNow = function(){
		console.log("printNow");
		var data = {
			mem_code: $scope.selectedMember.code,
			mem_code_to: $scope.selectedMember.codeTo,
			deadline_date: $scope.invoice.deadline_date,
			remark: ($scope.invoice.remark == null || $scope.invoice.remark == undefined) ? "" : $scope.invoice.remark,
			items: [],
			invoice_code: $scope.invoice.code,
			receipt_code: ($scope.selectedReceipt.code == null || $scope.selectedReceipt.code == undefined) ? "" : $scope.selectedReceipt.code,
			issue_date: $scope.invoice.issue,
			branch_name: $scope.memberAddress.name,
			addr: $scope.address,
			member_name:$scope.selectedMember.name_th
		};
		
		console.log(data);

		for(var i in $scope.invoiceItems) {
			data.items.push({
				prod_code: $scope.invoiceItems[i].prod_code,
				qty: $scope.invoiceItems[i].qty
			});
		}

		dbSvc.request('invoiceSave', data).then(function(result) {
			if (result.status===true) {
				//console.log(result.code);
				$scope.invoiceList = result.invoiceList;
				if(result.invoiceList.length > 0){
					if (result.invoiceList[0] == result.invoiceList[result.invoiceList.length - 1]){
						$scope.invoicePrint = result.invoiceList[0];
					}else{
						$scope.invoicePrint = result.invoiceList[0] + '-' + result.invoiceList[result.invoiceList.length - 1];
					}
				}
				//console.log($scope.invoicePrint);
				$scope.invoice.code = result.code;
				console.log('บันทึกเรียบร้อยแล้ว');
				$scope.isNext = true;
				$scope.checkRealReceiptFn();
				$scope.ConfirmPrint();
			} else {
				toaster.pop('warning', '', 'เกิดข้อผิดพลาด');
			}
		})
	}

	var Cancel = function() {

		var data = {
			invoice_code: $scope.invoice.code,
		};

		dbSvc.request('invoiceCancel', data).then(function(result) {
			if (result.status===true) {
				$scope.invoice.status = 'CANCELLED';
				toaster.pop('success', '', 'บันทึกเรียบร้อยแล้ว');
			} else {
				toaster.pop('warning', '', 'เกิดข้อผิดพลาด');
			}
		})
	}

	$scope.loadSearchInvoice = function(){
		dbSvc.request('loadSearchInvoice', {code:$scope.invoice.codeSearch}).then(function(result){
			if (result.status === true) {
				console.log(result);
				$scope.selectedInvoice = result.invoice;
				$scope.invoice.code = $scope.selectedInvoice.code;
				$scope.selectedMember.code = $scope.selectedInvoice.mem_code;
				//$scope.selectedMember.name_th = $scope.selectedInvoice.name_en;
				$scope.invoice.deadline_date = $scope.selectedInvoice.deadline_date;
				$scope.invoice.issue = $scope.selectedInvoice.issue_date;
				$scope.invoice.reissue_date = $scope.selectedInvoice.reissue_date;
				$scope.invoice.status = $scope.selectedInvoice.status;
				$scope.address = $scope.selectedInvoice.addr1 + ' ' + $scope.selectedInvoice.addr2 
								+ '\n' + $scope.selectedInvoice.tambon + ' ' + $scope.selectedInvoice.amphur 
								+ '\n' + $scope.selectedInvoice.province + ' ' + $scope.selectedInvoice.zipcode;
				$scope.invoice.remark = $scope.selectedInvoice.remark;
				$scope.selectedReceipt.code = $scope.selectedInvoice.receipt_code;
				$scope.isRealReceipt = ($scope.selectedInvoice.real_receipt=='Y') ? true : false;
				$scope.invoice.branch_name = $scope.selectedInvoice.branch_name;

				$scope.invoicePrint =  $scope.selectedInvoice.code;

				if(result.invoice.status == 'PAID'){
					$scope.isLockInvoice = true;
				}else{
					$scope.isLockInvoice = false;
				}
				console.log($scope.isLockInvoice)

				dbSvc.request('memberByCode', {code:$scope.selectedInvoice.mem_code}).then(function(result) {
			      if (result.status===true) {
			          $scope.memberObj = angular.copy(result.member);
			          $scope.selectedMember.code = result.member.code;
			          //$scope.receipt.name =  result.member.name_th;
			          changeMember();
			      }
		        });

				loadInvoice($scope.selectedInvoice.code);

				// setTimeout(function() {
				// 	angular.element('#member').focus();
				// },0);
			}else{
				if($scope.invoice.codeSearch==''||$scope.invoice.codeSearch==undefined||$scope.invoice.codeSearch==null){
		          console.log('non');
		        } else {
		          toaster.pop('wanring', '', 'ไม่พบใบเสร็จที่ค้นหา');
		        }
			}
		});
	}

	$scope.showLovMember = function($event) {
	if ($event.keyCode != 32) {
      return;
    }
		lovService.showLov($scope, 'member', {cache:false}).then(function(result) {
			if (result===null) {
				angular.element('#member').focus();
				return;
			}
			
			console.log(result);
			$scope.selectedMember = result;
			console.log($scope.selectedMember.code);
			dbSvc.request('memberByCode', {code:$scope.selectedMember.code}).then(function(result) {
		      if (result.status===true) {
		          $scope.memberObj = angular.copy(result.member);
		          $scope.selectedMember.code = result.member.code;
		          //$scope.receipt.name =  result.member.name_th;
		          changeMember();

		      	  setTimeout(function() {
		          	angular.element('#memberTo').focus();
		          }, 0);
		      }
	        });
			//console.log($scope.selectedMember.addr1);
			//$scope.address = $scope.selectedMember.addr1 + ' ' + $scope.selectedMember.addr2 + '\n' + $scope.selectedMember.province + ' ' + $scope.selectedMember.zipcode;

			// setTimeout(function() {
			// 	angular.element('#deadline_date').focus();
			// },0);

		});

	}

	var changeMember = function() {
	    var member = $scope.memberObj;
	    console.log('member=', $scope.memberObj);
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
	        invoiceAddr:member.addresses[i].invoice_addr,
	        addrId:member.addresses[i].id,
	      });
	    }

	    $scope.memberAddresses = out;
	    console.log($scope.memberAddresses);
	    if (out.length > 0) {
	      if (typeof $scope.invoice.branch_name==='undefined' || $scope.invoice.branch_name=='') {
	      	for(var j = 0; j < $scope.memberAddresses.length; j++){
	      	  if($scope.memberAddresses[j].invoiceAddr=='Y'){
	      		  $scope.memberAddress = $scope.memberAddresses[j];
	      		  break;
	      	  }
	      	}
	      } else {
	        for(var i = 0; i < $scope.memberAddresses.length; i++) {
	          if ($scope.memberAddresses[i].name==$scope.invoice.branch_name) {
	            $scope.memberAddress = $scope.memberAddresses[i];
	            break;
	          }
	        }
	      }
	      $scope.changeAddress();
	      setTimeout(function() {
	        angular.element('#corp_addr').focus();
	      }, 0);
	    }
	  };
	  $scope.changeAddress = function() {
	    $scope.address = $scope.memberAddress.addr;
	    $scope.addressId = $scope.memberAddress.addrId;
	    if($scope.memberAddress.lang=='TH'){
	    	$scope.selectedMember.name_th = $scope.memberObj.name_th;
	    } else {
	    	$scope.selectedMember.name_th = $scope.memberObj.name_en;
	    }
	  }

	$scope.selectMemberOnec = function() {
		//console.log($scope.selectedMember.code);
		if ($scope.selectedMember.code==''||$scope.selectedMember.code==undefined||$scope.selectedMember.code==null){
			console.log('Nodata');
			return;
		}else{
			var data = {
				mem_code:$scope.selectedMember.code,
			};
			dbSvc.request('memberByCode', {code:$scope.selectedMember.code}).then(function(result) {
		      if (result.status===true) {
		          $scope.memberObj = angular.copy(result.member);
		          $scope.selectedMember.code = result.member.code;
		          //$scope.selectedMember.name_th = result.member.name_th;
		          //$scope.receipt.name =  result.member.name_th;
		          changeMember();

		      	  setTimeout(function() {
		          	angular.element('#memberTo').focus();
		          }, 0);
		      }
	        });
			// dbSvc.request('selectMemberOnec', data).then(function(result) {
			// 	if (result.status===true) {
			// 		var member_data=result.member_data;
			// 		//console.log(member_data);
			// 		$scope.selectedMember = angular.copy(member_data);
			// 		$scope.address = $scope.selectedMember.addr1 + ' ' + $scope.selectedMember.addr2 + '\n' + $scope.selectedMember.province + ' ' + $scope.selectedMember.zipcode;
			// 	} else {
			// 		toaster.pop('warning', '', 'รหัสสมาชิกไม่ถูกต้อง');
			// 	}
			// })
		}

	}

	$scope.showLovMember2 = function($event) {
	if ($event.keyCode != 32) {
      return;
    }

		lovService.showLov($scope, 'member', {cache:false}).then(function(result) {
			if (result===null) {
				angular.element('#member').focus();
				return;
			}
			console.log(result);
			$scope.selectedMember.codeTo = result.code;
			//console.log($scope.selectedMember.addr1);

			setTimeout(function() {
				angular.element('#deadline_date').focus();
			},0);

		});

	}

	$scope.showLovReceipt = function($event) {
		if ($event.keyCode != 32) {
		return;
		}

			lovService.showLov($scope, 'receipt', {cache:false}).then(function(result) {
				if (result===null) {
					angular.element('#receipt').focus();
					return;
				}

				$scope.selectedReceipt = result;
				$scope.checkRealReceiptFn();

				//setTimeout(function() {
					//angular.element('#deadline_date').focus();
				//},0);

		});

	}

	dbSvc.request('invoiceByCode', {code:'14-0005'}).then(function(result){
		if (result.status === true) {
//			$scope.invoice = angular.copy(result.invoice);
			$scope.invoice = result.invoice;
		}
	});

	$scope.checkDone = function() {
	  return true;
	};

	$scope.updateInvoice = function() {

    var totalAmount = 0;
    var totalAmount2 = 0;
   //console.log('testtt', $scope.invoiceItems);
    $scope.invoiceItems.forEach(function(item) {
      if (typeof item.price === 'undefined') {
        return;
      }
      if (item.vat_type=='EXCLUDE') {
        totalAmount += parseFloat(item.price) * item.qty;
      } else {
        totalAmount2 += parseFloat(item.price) * item.qty;
      }
    });
    //console.log(totalAmount, totalAmount2);
    var vat = parseFloat((totalAmount * 7 / 100.0).toFixed(2));
    var vat2 = parseFloat((totalAmount2 * 7 / (100+$rootScope.config.vat_rate)).toFixed(2));
    $scope.invoice.amount = totalAmount + totalAmount2 - vat2;
    $scope.invoice.vat_amount = vat+vat2;
    $scope.invoice.total_amount = $scope.invoice.amount + vat+vat2;

  }

	$scope.showLovProduct = function($event, rowNumber) {
    if ($event.keyCode != 32) {
      return;
    }
//  console.log($rootScope.setting.code.substr(-2));

    if (typeof $scope.invoiceItems[rowNumber].prod_code === 'string') {
      $scope.keyword = $scope.invoiceItems[rowNumber].prod_code;
    } else {
      $scope.keyword = '';
    }

	lovService.showLov($scope, 'product', {cache:false}).then(function(result) {
		if (result===null) {
			if (rowNumber < $scope.invoiceItems.length-1) {
				$scope.invoiceItems.splice(rowNumber, 1);
			}
			setTimeout(function() {
				angular.element('code_' + ($scope.invoiceItems.length-1)).focus().select();
			}, 0);
			return;
		}

		//show inform
		//console.log(result.code);
		$scope.invoiceItems[rowNumber].prod_code = result.code;
		$scope.invoiceItems[rowNumber].detail = result.name;
		$scope.invoiceItems[rowNumber].qty = 1;
		$scope.invoiceItems[rowNumber].price = result.price;
		$scope.invoiceItems[rowNumber].unit = result.unit;
		$scope.invoiceItems[rowNumber].vat_type = result.vat_type;
		$scope.invoiceItems[rowNumber].account_code = result.account_code;
		//addItem(rowNumber, result.value, 1);
		$scope.updateInvoice();
		if (rowNumber == $scope.invoiceItems.length-1) {
			$scope.invoiceItems.push({});
		}
		setTimeout(function() {
			var qtyObj = angular.element('#qty_' + rowNumber);
			qtyObj.attr({readonly:false}).focus().select();
		},0);

	});

  }

  $scope.showLovInvoice = function($event) {
	if ($event.keyCode != 32) {
      return;
    }

		lovService.showLov($scope, 'invoice', {cache:false}).then(function(result) {
			if (result===null) {
				console.log("xxx");
				angular.element('#invoicecode').focus();
				return;
			}
			$scope.selectedInvoice = result;
			$scope.invoice.code = $scope.selectedInvoice.code;
			$scope.selectedMember.code = $scope.selectedInvoice.mem_code;
			//$scope.selectedMember.name_th = $scope.selectedInvoice.name_en;
			$scope.invoice.deadline_date = $scope.selectedInvoice.deadline_date;
			$scope.invoice.issue = $scope.selectedInvoice.issue_date;
			$scope.invoice.reissue_date = $scope.selectedInvoice.reissue_date;
			$scope.invoice.status = $scope.selectedInvoice.status;
			$scope.address = $scope.selectedInvoice.addr1 + ' ' + $scope.selectedInvoice.addr2 
							+ '\n' + $scope.selectedInvoice.tambon + ' ' + $scope.selectedInvoice.amphur 
							+ '\n' + $scope.selectedInvoice.province + ' ' + $scope.selectedInvoice.zipcode;
			$scope.invoice.remark = $scope.selectedInvoice.remark;
			$scope.selectedReceipt.code = $scope.selectedInvoice.receipt_code;
			$scope.isRealReceipt = ($scope.selectedInvoice.real_receipt=='Y') ? true : false;
			$scope.invoice.branch_name = $scope.selectedInvoice.branch_name;

			$scope.invoicePrint =  $scope.selectedInvoice.code;
			console.log(result);

			if(result.status == 'PAID'){
				$scope.isLockInvoice = true;
			}else{
				$scope.isLockInvoice = false;
			}
			console.log($scope.isLockInvoice)
			dbSvc.request('memberByCode', {code:$scope.selectedInvoice.mem_code}).then(function(result) {
		      if (result.status===true) {
		          $scope.memberObj = angular.copy(result.member);
		          $scope.selectedMember.code = result.member.code;
		          //$scope.receipt.name =  result.member.name_th;
		          changeMember();
		      }
	        });

			loadInvoice($scope.selectedInvoice.code);

			setTimeout(function() {
				angular.element('#member').focus();
			},0);

		});

  }

  $scope.reset = function() {

	$scope.selectedMember = {};
	$scope.selectedMember.codeTo = "";
	$scope.selectedReceipt = {};
	$scope.address = '';
	$scope.invoiceItems = [{}];
    $scope.memberObj = null;
    $scope.invoiceObj = null;
	$scope.invoicePrint = '';
	$scope.invoiceList = {};
	$scope.isNext = false;
	$scope.isRealReceipt = false;
	$scope.invoice.issue = undefined;
	$scope.memberAddresses = [];
	$scope.isLockInvoice = false;

    $scope.invoice = {
      code:'',
		mem_code:'',
		status:'WAIT',
		reissue_date:'',
		receipt_code:'',
    };
    //$scope.isLock = $scope.receipt.uuid!='';
    $scope.invoiceItems = [{}];
    $scope.staff_name = $rootScope.sessionStaff.fullname;
    setTimeout(function() {
      angular.element('#member').focus().select();
    }, 0);
  }

   $scope.isValidPrint = function() {

	  if ((typeof $scope.invoicePrint === 'undefined' || $scope.invoicePrint.trim()=='')) {
        return false;
      }

	  return true;

   }

   $scope.isValid = function() {
    if ((typeof $scope.selectedMember.code === 'undefined' || $scope.selectedMember.code=='')) {
      return false;
    }

	if ((typeof $scope.invoice.deadline_date === 'undefined' || $scope.invoice.deadline_date=='')) {
      return false;
    }

    if ((typeof $scope.invoice.issue === 'undefined' || $scope.invoice.issue=='')) {
      return false;
    }

    if ($scope.invoiceItems.length <= 1) {
      return false;
    }
    return true;
  }

  $scope.nextAndPreviodsCheck = function() {
  	if ($scope.isNext){
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

	var print = function(){
		console.log($scope.invoiceList); //["AR15110001", "AR15110002", "AR15110003"]
		 receiptPrintService.printInvoiceList($scope.invoiceList,1).then(function(){
			console.log($scope.invoiceList);
	      })

	}

  $scope.nextClick = function(code){
    console.log(code);
    var str = (parseInt(code.substr(2, 8)) + 1) + "";
    var pad = "00000000";
    var nextCode = code.substr(0, 2) + pad.substring(0, pad.length - str.length) + str;

    dbSvc.request('getNextInvoice', {invoice_code:nextCode}).then(function(result) {
      if(result.status===true){
        //console.log(result);
        $scope.selectedInvoice = result.invoice_code;
		$scope.invoice.code = $scope.selectedInvoice.code;
		$scope.selectedMember.code = $scope.selectedInvoice.mem_code;
		//$scope.selectedMember.name_th = $scope.selectedInvoice.name_en;
		$scope.invoice.deadline_date = $scope.selectedInvoice.deadline_date;
		$scope.invoice.issue = $scope.selectedInvoice.issue_date;
		$scope.invoice.reissue_date = $scope.selectedInvoice.reissue_date;
		$scope.invoice.status = $scope.selectedInvoice.status;
		$scope.address = $scope.selectedInvoice.addr1 + ' ' + $scope.selectedInvoice.addr2 
						+ '\n' + $scope.selectedInvoice.tambon + ' ' + $scope.selectedInvoice.amphur 
						+ '\n' + $scope.selectedInvoice.province + ' ' + $scope.selectedInvoice.zipcode;
		$scope.invoice.remark = $scope.selectedInvoice.remark;
		$scope.selectedReceipt.code = $scope.selectedInvoice.receipt_code;
		$scope.invoicePrint =  $scope.selectedInvoice.code;
		$scope.isRealReceipt = ($scope.selectedInvoice.real_receipt=='Y') ? true : false;
		$scope.invoice.branch_name = $scope.selectedInvoice.branch_name;

		if($scope.selectedInvoice.status == 'PAID'){
			$scope.isLockInvoice = true;
		}else{
			$scope.isLockInvoice = false;
		}

		dbSvc.request('memberByCode', {code:$scope.selectedInvoice.mem_code}).then(function(result) {
	      if (result.status===true) {
	          $scope.memberObj = angular.copy(result.member);
	          $scope.selectedMember.code = result.member.code;
	          //$scope.receipt.name =  result.member.name_th;
	          changeMember();
	      }
        });

        loadInvoice($scope.selectedInvoice.code);
      } else {
        console.log(result);
        toaster.pop('warning', '', 'ไม่พบเลข Invoice ' + nextCode);
      }
    });
  }

  $scope.previousClick = function(code){
    console.log(code);
    var str = (parseInt(code.substr(2, 8)) - 1) + "";
    var pad = "00000000";
    var nextCode = code.substr(0, 2) + pad.substring(0, pad.length - str.length) + str;

    dbSvc.request('getNextInvoice', {invoice_code:nextCode}).then(function(result) {
      if(result.status===true){
        //console.log(result);
        $scope.selectedInvoice = result.invoice_code;
		$scope.invoice.code = $scope.selectedInvoice.code;
		$scope.selectedMember.code = $scope.selectedInvoice.mem_code;
		//$scope.selectedMember.name_th = $scope.selectedInvoice.name_en;
		$scope.invoice.deadline_date = $scope.selectedInvoice.deadline_date;
		$scope.invoice.issue = $scope.selectedInvoice.issue_date;
		$scope.invoice.reissue_date = $scope.selectedInvoice.reissue_date;
		$scope.invoice.status = $scope.selectedInvoice.status;
		$scope.address = $scope.selectedInvoice.addr1 + ' ' + $scope.selectedInvoice.addr2 
							+ '\n' + $scope.selectedInvoice.tambon + ' ' + $scope.selectedInvoice.amphur 
							+ '\n' + $scope.selectedInvoice.province + ' ' + $scope.selectedInvoice.zipcode;
		$scope.invoice.remark = $scope.selectedInvoice.remark;
		$scope.selectedReceipt.code = $scope.selectedInvoice.receipt_code;
		$scope.invoicePrint =  $scope.selectedInvoice.code;
		$scope.isRealReceipt = ($scope.selectedInvoice.real_receipt=='Y') ? true : false;
		$scope.invoice.branch_name = $scope.selectedInvoice.branch_name;

		if($scope.selectedInvoice.status == 'PAID'){
			$scope.isLockInvoice = true;
		}else{
			$scope.isLockInvoice = false;
		}

		dbSvc.request('memberByCode', {code:$scope.selectedInvoice.mem_code}).then(function(result) {
	      if (result.status===true) {
	          $scope.memberObj = angular.copy(result.member);
	          $scope.selectedMember.code = result.member.code;
	          //$scope.receipt.name =  result.member.name_th;
	          changeMember();
	      }
        });

        loadInvoice($scope.selectedInvoice.code);
      } else {
        console.log(result);
        toaster.pop('warning', '', 'ไม่พบเลข Invoice ' + nextCode);
      }
    });
  }


  var loadInvoice = function(code) {
  	//console.log(code);
    dbSvc.request('invoiceItems', {code:code}).then(function(result) {
      if (result.status===true) {
        var invoice = result.invoice;
        //console.log(invoice);
        $scope.invoiceItems = [];
        for(var i = 0; i < invoice.items.length; i++) {
          invoice.items[i].qty = parseInt(invoice.items[i].qty);
          $scope.invoiceItems.push(invoice.items[i]);
        }
        $scope.invoiceItems.push({});
        console.log($scope.invoiceItems);
		$scope.updateInvoice();
		$scope.invoiceList[0] = code;
		$scope.isNext = true;
      }
    });
  }

  $scope.ConfrimSave = function(){
	//selectedMember.codeTo

	if ((typeof $scope.selectedMember.codeTo === 'undefined' || $scope.selectedMember.codeTo.trim()=='')){
		save();
	}else{

		var memFrom = $scope.selectedMember.code;
		var memTo = $scope.selectedMember.codeTo;

		if ($scope.selectedMember.codeTo.trim() != '' && ($scope.selectedMember.code > $scope.selectedMember.codeTo)) {
			memFrom = $scope.selectedMember.codeTo;
			memTo = $scope.selectedMember.code;

			$scope.selectedMember.code = memFrom;
			$scope.selectedMember.codeTo = memTo;
		}

		$scope.message = 'ต้องการบันทึกใบแจ้งหนี้ หรือไม่ '
		+ '\nสมาชิกเลขที่: ' + $scope.selectedMember.code + '-' + $scope.selectedMember.codeTo;
		$scope.positiveButton = 'บันทึก';
		$scope.negativeButton = 'ยกเลิก';
		$scope.positiveResponse = function() {
			save();
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

  $scope.ConfirmCancel = function() {

	$scope.message = 'ต้องการยกเลิกใบแจ้งหนี้ หรือไม่ '
		+ '\nใบแจ้งหนี้เลขที่: ' + $scope.invoicePrint;
	$scope.positiveButton = 'ตกลง';
	$scope.negativeButton = 'ยกเลิก';
	$scope.positiveResponse = function() {
		Cancel();
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

	$scope.checkHideByReceipt = function(){

	};

	$scope.checkRealReceiptFn = function(){
		if($scope.selectedReceipt.code==''||$scope.selectedReceipt.code==undefined||$scope.selectedReceipt.code==null){
			$scope.isRealReceipt = false;
		}else{
			dbSvc.request('checkRealReceipt', {code:$scope.selectedReceipt.code}).then(function(result) {
		      if (result.status===true) {
		      	$scope.isRealReceipt = false;
		      }else{
		      	$scope.isRealReceipt = true;
		      }
		    });
		}
	}

	$scope.offAddress = function(){
		if($scope.selectedMember.codeTo != "" && $scope.selectedMember.codeTo != undefined) {
			return true;
		} else {
			return false;
		}
	}

	$scope.checkIt = function(){
		console.log($scope.selectedMember.codeTo);
	}

}]);
