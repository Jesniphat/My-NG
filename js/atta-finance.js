angular.module('attaFinance',[
]).controller('InvoiceListCtrl',
                ['$scope','$state','dbSvc',
                    function($scope,$state,dbSvc){

    $scope.filtered = [];
    $scope.members = [];
    $scope.currentPage = 0;
    $scope.pageSize = 10;
    
    $scope.numberOfPages=function(){
        return Math.ceil($scope.filtered.length/$scope.pageSize);                
    }

    var code_from = 'AR00000000';
    var code_to = 'AR99999999';

    var range = IDBKeyRange.bound(
                code_from,
                code_to
            );
    dbSvc.getTableIndex('invoice','ixInvoiceCode', range, 'next' /*prev*/).then(function(result) {
        if (result==null) {
            return false;
        }else{
            $scope.invoices = result;
        }
    });
	$scope.thStatus = function(status){
        var th = {
            WAITING: 'รอการชำระเงิน',
            PAID: 'ชำระเงินแล้ว',
            CANCELLED: 'ยกเลิก',
        }
        return th[status];
    }
}]).controller('InvoiceEditCtrl',
                ['$scope','$rootScope','$state','$stateParams','helper','$filter','dbSvc','$interval','toaster','ngDialog',
                    function($scope,$rootScope,$state,$stateParams,helper,$filter,dbSvc,$interval,toaster,ngDialog){
    $('#member_code').focus();
    $scope.invoice = {
        status:"WAITING",
    };

    if($stateParams.uuid == ''){
        $scope.status = 'create';
        $scope.invoice.uuid = helper.newUUID();
        var year = $filter('date')(new Date(), 'yy');
        var code_from = 'AR' + year + '000000';
        var code_to = 'AR' + year + '999999';

        var range = IDBKeyRange.bound(
                    code_from,
                    code_to
                );
        dbSvc.getTableIndex('invoice', 'ixInvoiceCode', range, 'next' /*prev*/).then(function(result) {
                if (result==null) {
                    return false;
                }
                if(result.length == 0){                    
                    $scope.invoice.code = 'AR' + year + '000001';
                    // console.log($scope.invoice.code);
                }else{
                    angular.forEach(result, function(data) {
                        $scope.invoice.code = $scope.convCode(data.code);
                        return false;
                    });
                }
        });
    }else{
        $scope.status = 'edit';
        $scope.invoice.uuid = $stateParams.uuid;
        dbSvc.getByKey('invoice',$stateParams.uuid).then(function(result) {
            console.log(result);
            $scope.invoice = result;
            $scope.products = result.items;
        });
    }

    $scope.save_type = 'member';

    $scope.products = [];

    $scope.invoice.issueDate = $filter('date')(new Date(), 'yyyy-MM-dd');
    
    
    for (var i = 0; i < 5; i++) {
        $scope.products.push({
            uuid:'',
            code:'',
            name:'',
            qty:'',
            unitPrice:'',
            unit:'',
            amount:'',
            isVat:false,
        });
    };

    $scope.calAll = function(){
        var amount = 0;
        for(var product in $scope.products){
            //console.log($scope.products[product]);
            amount = amount + ($scope.products[product].amount);            
        }
        $scope.invoice.amount = parseFloat(amount);
    };

    $scope.calVat = function(){
        var amount = 0;
        for(var product in $scope.products){
            //console.log($scope.products[product]);
            if($scope.products[product].isVat){
                amount = parseFloat(amount) + (parseFloat($scope.products[product].amount));
            }         
        }
        $scope.invoice.vatAmount = (parseFloat(amount) * parseFloat($scope.invoice.vatRate)) / 100;
        $scope.invoice.totalAmount = parseFloat($scope.invoice.amount) + parseFloat((isNaN($scope.invoice.vatAmount)?0:$scope.invoice.vatAmount));
    };

    $scope.goBack = function() {
        if($scope.invoiceForm.$dirty){
            $scope.message = 'ข้อมูลยังไม่ถูกบันทึก ต้องการออกจากหน้าจอนี้ใช่หรือไม่';
            $scope.positiveButton = 'ใช่';
            $scope.negativeButton = 'ไม่ใช่';
            $scope.positiveResponse = function() {
                $state.go('home.invoice');
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
            $state.go('home.invoice');
        }
    };
    
    $scope.reset = function(){
        // $('#member_code').focus();
        // $scope.invoice = {
        //     status:"WAITING",
        // };

        // if($stateParams.uuid == ''){
        //     $scope.status = 'create';
        //     $scope.invoice.uuid = helper.newUUID();
        //     var year = $filter('date')(new Date(), 'yy');
        //     var code_from = 'AR' + year + '000000';
        //     var code_to = 'AR' + year + '999999';

        //     var range = IDBKeyRange.bound(
        //                 code_from,
        //                 code_to
        //             );
        //     dbSvc.getTableIndex('invoice', 'ixInvoiceCode', range, 'next' /*prev*/).then(function(result) {
        //             if (result==null) {
        //                 return false;
        //             }
        //             if(result.length == 0){                    
        //                 $scope.invoice.code = 'AR' + year + '000001';
        //                 // console.log($scope.invoice.code);
        //             }else{
        //                 angular.forEach(result, function(data) {
        //                     $scope.invoice.code = $scope.convCode(data.code);
        //                     return false;
        //                 });
        //             }
        //     });
        // }else{
        //     $scope.status = 'edit';
        //     $scope.invoice.uuid = $stateParams.uuid;
        //     dbSvc.getByKey('invoice',$stateParams.uuid).then(function(result) {
        //         console.log(result);
        //         $scope.invoice = result;
        //         $scope.products = result.items;
        //     });
        // }

        // $scope.save_type = 'member';

        // $scope.products = [];

        // $scope.invoice.issueDate = $filter('date')(new Date(), 'yyyy-MM-dd');
        
        
        // for (var i = 0; i < 5; i++) {
        //     $scope.products.push({
        //         uuid:'',
        //         code:'',
        //         name:'',
        //         qty:'',
        //         unitPrice:'',
        //         unit:'',
        //         amount:'',
        //         isVat:false,
        //     });
        // };
        $state.transitionTo($state.current, $stateParams, {
            reload: true,
            inherit: false,
            notify: true
        });
    }
    $scope.convCode = function(code){
        var pattle = "000000";
        var last_code = (parseInt(code.replace('AR' + year,"")) + 1) + "";
        var res = (pattle.substring(0, 6-last_code.length)) + last_code;
        
        return 'AR' + year + res;
    }
    $scope.saveInvoice = function(isValid) {
        var txDate = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
        if(isValid == true){
            if($scope.save_type == 'member' || $scope.save_type == 'non_member'){
                var invoice = {
                    uuid:$scope.invoice.uuid,
                    code:$scope.invoice.code,
                    staff_uuid:$rootScope.sessionStaff.uuid,
                    period:$rootScope.sessionStaff.uuid,
                    memCode:$scope.invoice.memCode,
                    memType:$scope.invoice.memType,
                    receipt_uuid:'',
                    issueDate:$scope.invoice.issueDate,
                    dueDate:$scope.invoice.dueDate,
                    reIssueDate:$scope.invoice.issueDate,
                    reIssueBy_uuid:'',
                    name:$scope.invoice.name,
                    addr:$scope.invoice.addr,
                    status:$scope.invoice.status,
                    remark1:$scope.invoice.remark1,
                    remark2:$scope.invoice.remark2,
                    amount:$scope.invoice.amount,
                    vatRate:$scope.invoice.vatRate,
                    vatAmount:$scope.invoice.vatAmount,
                    totalAmount:$scope.invoice.totalAmount,
                    isPost:0,
                    postDate:'',
                    postBy_uuid:'',
                    items:$scope.products,
                    txDate:txDate,
                };
                //console.log(invoice);
                dbSvc.saveData('invoice',invoice).then(function(result) {
                    toaster.pop('success', '', 'บันทึกใบแจ้งหนี้เรียบร้อยแล้ว');
                    if($scope.status == 'create'){
                        $scope.reset();
                    }                
                    //update invoice
                }, function(e) {
                    toaster.pop('warning', 'เกิดข้อผิดพลาด', 'บันทึกไม่สำเร็จ');
                });
            }else{
                var range = IDBKeyRange.bound(
                    $scope.batch_from,
                    $scope.batch_to
                );
                dbSvc.getTableIndex('member', 'ixMemberCode', range, 'next' /*prev*/).then(function(result) {
                    if (result==null) {
                        return false;
                    }
                    console.log(result);
                    angular.forEach(result, function(data) {
                        var address1 =  (data.address1.addr1!=""?(data.address1.addr1 + " "):"") +
                                        (data.address1.addr2!=""?(data.address1.addr2 + " "):"") +
                                        (data.address1.district!=""?(data.address1.district + " "):"") +
                                        (data.address1.fax!=""?(data.address1.fax + " "):"") +
                                        (data.address1.name!=""?(data.address1.name + " "):"") +
                                        (data.address1.province!=""?(data.address1.province + " "):"") +
                                        (data.address1.subdistrict!=""?(data.address1.subdistrict + " "):"") +
                                        (data.address1.tel!=""?(data.address1.tel + " "):"") +
                                        (data.address1.zip!=""?(data.address1.zip):"");
                        var invoice = {
                            uuid:helper.newUUID(),
                            code:$scope.invoice.code,
                            staff_uuid:$rootScope.sessionStaff.uuid,
                            period:$rootScope.sessionStaff.uuid,
                            memCode:data.code,
                            memType:data.type,
                            receipt_uuid:'',
                            issueDate:$scope.invoice.issueDate,
                            dueDate:$scope.invoice.dueDate,
                            reIssueDate:$scope.invoice.issueDate,
                            reIssueBy_uuid:'',
                            name:data.name_th,
                            addr:address1,
                            status:$scope.invoice.status,
                            remark1:$scope.invoice.remark1,
                            remark2:$scope.invoice.remark2,
                            amount:$scope.invoice.amount,
                            vatRate:$scope.invoice.vatRate,
                            vatAmount:$scope.invoice.vatAmount,
                            totalAmount:$scope.invoice.totalAmount,
                            isPost:0,
                            postDate:'',
                            postBy_uuid:'',
                            items:$scope.products,
                            txDate:txDate,
                        };
                        console.log(data.name_th);
                        $scope.invoice.code = $scope.convCode($scope.invoice.code);
                        dbSvc.saveData('invoice',invoice);
                    });
                    toaster.pop('success', '', 'บันทึกใบแจ้งหนี้เรียบร้อยแล้ว');
                    if($scope.status == 'create'){
                        $scope.reset();
                    } 
                });
            }
        }
    };

    $scope.getMemType = function(code){
        var range = IDBKeyRange.bound(
                    code,
                    code
                );
        dbSvc.getTableIndex('member', 'ixMemberCode', range, 'next' /*prev*/).then(function(result) {
                if (result==null) {
                    return false;
                }
                //console.log(result);
                angular.forEach(result, function(data) {
                    $scope.invoice.memType = data.type;
                    $scope.invoice.name = data.name_th;
                    //console.log(data.address);
                    $scope.invoice.addr = 
                        (data.address1.addr1!=""?(data.address1.addr1 + " "):"") +
                        (data.address1.addr2!=""?(data.address1.addr2 + " "):"") +
                        (data.address1.district!=""?(data.address1.district + " "):"") +
                        (data.address1.fax!=""?(data.address1.fax + " "):"") +
                        (data.address1.name!=""?(data.address1.name + " "):"") +
                        (data.address1.province!=""?(data.address1.province + " "):"") +
                        (data.address1.subdistrict!=""?(data.address1.subdistrict + " "):"") +
                        (data.address1.tel!=""?(data.address1.tel + " "):"") +
                        (data.address1.zip!=""?(data.address1.zip):"");
                    console.log($scope.invoice.addr); 
                    $('#invoice_date').focus();   
                });
        });
    };

    $scope.clearInvoicetext = function(){
        $scope.invoice.memCode = '';
        $scope.batch_from = '';
        $scope.batch_to = '';
        $scope.invoice.name = '';
        $scope.invoice.addr = '';

        $('#invoice_name').focus(); 
    };
    $scope.getProduct = function(index){
        $scope.products[index].uuid = '';
        //$scope.products[index].code = '';
        $scope.products[index].name = '';
        $scope.products[index].unitPrice = '';
        $scope.products[index].unit = '';
        $scope.products[index].isVat = '';

        var range = IDBKeyRange.bound(
                    $scope.products[index].code ,
                    $scope.products[index].code 
                );
        dbSvc.getTableIndex('product', 'ixProductCode', range, 'next' /*prev*/).then(function(result) {
                if (result==null) {
                    return false;
                }
                //console.log(result);
                angular.forEach(result, function(data) {
                      $scope.products[index].uuid = data.uuid;
                      //$scope.products[index].code = data.code;
                      $scope.products[index].name = data.name;
                      $scope.products[index].unitPrice = data.unitPrice;
                      $scope.products[index].unit = data.unit;
                      $scope.products[index].isVat = data.isVat;

                      $('#qty_' + index).focus(); 
                });
        });
    };
    $scope.calAmount = function(index){
        var qty = $scope.products[index].qty;
        var unit_price = $scope.products[index].unitPrice;

        $scope.products[index].amount = qty*unit_price;
    };
    $scope.setFocus = function(to,event,index){
        if(event.which  == 13){
            $('#' + to + index).focus();
        }
    };                                                              
}]).controller('ReIssueCtrl',
                ['$scope','dbSvc','$filter','toaster','$rootScope','$state','ngDialog','$stateParams',
                    function($scope,dbSvc,$filter,toaster,$rootScope,$state,ngDialog,$stateParams){
    $scope.year = $filter('date')(new Date(), 'yy');
    $scope.reset = function(){
        // console.log('test');
        // $scope.year = $filter('date')(new Date(), 'yy');
        // $scope.invoice = undefined;
        $state.transitionTo($state.current, $stateParams, {
            reload: true,
            inherit: false,
            notify: true
        });
    };
    $scope.setFocus = function(to,event,index){
        if(event.which  == 13){
            $('#' + to + index).focus();
            console.log('test');
        }
    }; 
    $scope.goBack = function() {
        if($scope.reIssueForm.$dirty){
            $scope.message = 'ข้อมูลยังไม่ถูกบันทึก ต้องการออกจากหน้าจอนี้ใช่หรือไม่';
            $scope.positiveButton = 'ใช่';
            $scope.negativeButton = 'ไม่ใช่';
            $scope.positiveResponse = function() {
                $state.go('home.invoice');
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
            $state.go('home.invoice');
        }
    };
    $scope.saveReIssue =  function(isValid){
        var txDate = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');

        if(isValid == true){
            var range = null;
            var index_type = 'ixInvoiceReIssue';
            //console.log($scope.invoice.memCodeFrom);
            if($scope.invoice.memCodeFrom != undefined && $scope.invoice.memCodeTo != undefined ){
                var year = $filter('date')(new Date(), 'yy');
                range = IDBKeyRange.bound(
                        [$scope.invoice.memCodeFrom,"AR"+year+"000000"],
                        [$scope.invoice.memCodeTo,"AR"+year+"999999"] 
                );
            }else if($scope.invoice.codeFrom != undefined && $scope.invoice.codeTo != undefined){
                //console.log('test');
                range = IDBKeyRange.bound(
                        $scope.invoice.codeFrom.toUpperCase(),
                        $scope.invoice.codeTo.toUpperCase() 
                );
                index_type = 'ixInvoiceCode';
            }else if($scope.invoice.codeFrom != undefined && $scope.invoice.codeTo != undefined
                && $scope.invoice.memCodeFrom != undefined && $scope.invoice.memCodeTo != undefined){
                range = IDBKeyRange.bound(
                        [$scope.invoice.memCodeFrom,$scope.invoice.codeFrom.toUpperCase()],
                        [$scope.invoice.memCodeTo,$scope.invoice.codeTo.toUpperCase()] 
                );
            }else if($scope.invoice.codeFrom != undefined){
                //console.log($scope.invoice.codeFrom);
                range = IDBKeyRange.bound(
                        $scope.invoice.codeFrom.toUpperCase(),
                        $scope.invoice.codeFrom.toUpperCase() 
                );
                index_type = 'ixInvoiceCode';
            }else if($scope.invoice.memCodeFrom != undefined ){
                var year = $filter('date')(new Date(), 'yy');
                range = IDBKeyRange.bound(
                        [$scope.invoice.memCodeFrom,"AR"+year+"000000"],
                        [$scope.invoice.memCodeFrom,"AR"+year+"999999"] 
                );
            }else{
                if($scope.invoice.memCodeFrom == undefined){
                    toaster.pop('warning', 'เกิดข้อผิดพลาด', 'กรุณาใส่ข้อมูล "รหัสสมาชิก : ตั้งแต่"');
                }
                if($scope.invoice.memCodeTo == undefined){
                    toaster.pop('warning', 'เกิดข้อผิดพลาด', 'กรุณาใส่ข้อมูล "รหัสสมาชิก : ถึง"');
                }
                if($scope.invoice.codeFrom == undefined){
                    toaster.pop('warning', 'เกิดข้อผิดพลาด', 'กรุณาใส่ข้อมูล "เลขที่ใบแจ้งหนี้ : ตั้งแต่"');
                }
                if($scope.invoice.codeTo == undefined){
                    toaster.pop('warning', 'เกิดข้อผิดพลาด', 'กรุณาใส่ข้อมูล "เลขที่ใบแจ้งหนี้ : ถึง"');
                }
            }
            if(range != null){
                dbSvc.getTableIndex('invoice', index_type, range, 'next' /*prev*/).then(function(result) {
                    if (result==null) {
                        return false;
                    }
                    
                    //  issueDate:,dueDate:,reIssueDate:,reIssueBy_uuid:,
                    angular.forEach(result, function(data) {
                        if(data.status == 'PAID'){
                            var old_issueDate = new Date(data.issueDate).getTime();
                            var new_issueDate = new Date($scope.invoice.issueDate).getTime();
                            var old_dueDate = new Date(data.dueDate).getTime();
                            var new_dueDate = new Date($scope.invoice.dueDate).getTime();
                            
                            if(old_issueDate <= new_issueDate && old_dueDate <= new_dueDate){
                                data.issueDate = $scope.invoice.issueDate;
                                data.reIssueDate = $scope.invoice.issueDate;
                                data.reIssueBy_uuid = $rootScope.sessionStaff.uuid;
                                data.txDate = txDate;

                                console.log(data);
                                dbSvc.saveData('invoice',data).then(function(result) {
                                    toaster.pop('warning', 'เกิดข้อผิดพลาด', 'บันทึกใบแจ้งหนี้เรียบร้อยแล้ว');
                                }), function(e) {
                                    toaster.pop('warning', 'เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกได้');
                                }; 
                            }else{
                                toaster.pop('warning', 'ไม่สามารถบันทึกได้', 'วันที่ออกใบแจ้งหนี้ที่แก้ไข "'+$scope.invoice.issueDate+'" น้อยกว่าวันที่ออกใบแจ้งหนี้เดิม "'+data.issueDate+'"');
                                toaster.pop('warning', 'ไม่สามารถบันทึกได้', 'วันที่จ่าย ที่แก้ไข "'+$scope.invoice.dueDate+'" น้อยกว่าวันที่จ่ายเดิม "'+data.dueDate+'"');
                            }
                        }else{
                            toaster.pop('warning', 'ไม่สามารถบันทึกได้', 'รหัสใบแจ้งหนี้ร หัส "'+data.code+'" ยังไม่ได้ชำระเงิน');
                        }
                    });

                }, function(e) {
                    toaster.pop('warning', 'เกิดข้อผิดพลาด', 'ไม่มีข้อมูลอยู่จริง');
                }).then(function(result) {

                }); 
            }
        }        
    }
}]).controller('ReceiptEditCtrl',
            ['$scope','dbSvc','$filter','ngDialog','helper','toaster','$rootScope','$state','$stateParams',
                function($scope,dbSvc,$filter,ngDialog,helper,toaster,$rootScope,$state,$stateParams){

    var year = $filter('date')(new Date(), 'yy');
    var pc_num = '01';
    var code_from = year + '-' + pc_num + 'HQ' + '000000';
    var code_to = year + '-' + pc_num + 'HQ' + '999999';
    var range = null;
    console.log($stateParams.uuid);
    if($stateParams.uuid != '' && $stateParams.uuid != undefined){
        $scope.banks = [];
        dbSvc.getTable('bank').then(function(result) {
            if (result==null) {
                return false;
            }
            angular.forEach(result, function(data) {
                $scope.banks.push(data);                    
            });
        });  
        dbSvc.getByKey('receipt',$stateParams.uuid).then(function(result) {
            $scope.receipt = result;
            $scope.products = result.items;
            $scope.by_cash_count = result.cashAmout;
            $scope.by_cheque_count = result.chequeAmout;
            $scope.by_payin_count = result.payinAmout;

            $scope.by_cash = result.paidBy.cash;
            $scope.by_cheque = result.paidBy.cheque;
            $scope.by_payin = result.paidBy.payin;
            dbSvc.getByKey('invoice',result.invoice_uuid).then(function(result) {
                $scope.invoice_code = result.code;
            });
        });
    }else{
        range = IDBKeyRange.bound(
                            code_from,
                            code_to
                        );
        dbSvc.getTableIndex('receipt', 'ixReceiptCode', range, 'next' /*prev*/).then(function(result) {
                if (result==null) {
                    return false;
                }
                if(result.length == 0){                    
                    $scope.receipt.code = year + '-' + pc_num + 'HQ' + '000001';
                    // console.log($scope.invoice.code);
                }else{
                    angular.forEach(result, function(data) {
                        $scope.receipt.code = $scope.convCode(data.code);
                        return false;
                    });
                }
        });               
        $scope.banks = [];
        dbSvc.getTable('bank').then(function(result) {
            if (result==null) {
                return false;
            }
            angular.forEach(result, function(data) {
                $scope.banks.push(data);                    
            });
        });
        $scope.receipt = {};
        $scope.receipt = {
            status:"PAID",
            issueDate:$filter('date')(new Date(), 'yyyy-MM-dd'),
            taxId:'',
        };
        $scope.receipt.whTaxRate = '3';
        $scope.products = [];
        $scope.invoice_codes = [];
        for (var i = 0; i < 5; i++) {
            $scope.products.push({
                uuid:'',
                code:'',
                name:'',
                qty:'',
                unitPrice:'',
                unit:'',
                amount:'',
                isVat:false,
            });
        };
    }
    $scope.reset = function(){
        $state.transitionTo($state.current, $stateParams, {
            reload: true,
            inherit: false,
            notify: true
        });
    };
    $scope.saveReceipt = function(isValid){
        if(isValid){
            var receipt = {};
            var chk_c;
            var txDate = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');

            if($stateParams.uuid == '' || $stateParams.uuid == undefined){
                $scope.receipt.uuid = helper.newUUID();
            }           
            if(!($scope.get_money < $scope.receipt.totalAmount)){
                receipt = {
                    uuid:$scope.receipt.uuid,
                    code:$scope.receipt.code,
                    staff_uuid:$rootScope.sessionStaff.uuid,
                    period:$rootScope.sessionStaff.uuid,
                    memCode:$scope.receipt.memCode,
                    memType:$scope.receipt.memType,
                    taxId:$scope.receipt.taxId,
                    invoice_uuid:$scope.receipt.invoice_uuid,
                    issueDate:$scope.receipt.issueDate,
                    name:$scope.receipt.name,
                    addr:$scope.receipt.addr,
                    status:$scope.receipt.status,
                    remark1:$scope.receipt.remark1,
                    remark2:$scope.receipt.remark2,
                    amount:$scope.receipt.amount,
                    vatRate:$scope.receipt.vatRate,
                    vatAmount:$scope.receipt.vatAmount,
                    whTaxRate:$scope.receipt.whTaxRate,
                    whTaxAmount:$scope.receipt.whTaxAmount,
                    totalAmount:$scope.receipt.totalAmount,
                    paidBy:{
                        cash:false,
                        cheque:false,
                        payin:false,
                    },
                    bankCheque:'',
                    bankPayin:'',
                    branchCheque:'',
                    branchPayin:'',
                    chequeNo:'',
                    payinNo:'',
                    chequeDate:'',
                    payinDate:'',
                    cashAmout:'',
                    chequeAmout:'',
                    payinAmout:'',
                    isPost:0,
                    postDate:'',
                    postBy_uuid:'',
                    items:$scope.products,
                    txDate:txDate,
                };
                if($scope.by_cash){
                    receipt.paidBy.cash = true;
                    receipt.cashAmout = $scope.by_cash_count;
                }                
                if($scope.by_cheque){
                    receipt.paidBy.cheque = true;
                    receipt.bankCheque=$scope.receipt.bankCheque;
                    receipt.branchCheque=$scope.receipt.branchCheque;
                    receipt.chequeNo=$scope.receipt.chequeNo;
                    receipt.chequeDate=$scope.receipt.chequeDate;
                    receipt.chequeAmout = $scope.by_cheque_count;
                } 
                if($scope.by_payin){
                    receipt.paidBy.payin = true;
                    receipt.bankPayin=$scope.receipt.bankPayin;
                    receipt.branchPayin=$scope.receipt.branchPayin;
                    receipt.payinNo=$scope.receipt.payinNo;
                    receipt.payinDate=$scope.receipt.payinDate;
                    receipt.payinAmout = $scope.by_payin_count;  
                }
                //console.log(receipt);

                dbSvc.saveData('receipt',receipt).then(function(result) {
                    var receipt_uuid = result.uuid;
                    dbSvc.getByKey('invoice',$scope.receipt.invoice_uuid).then(function(result) {
                        //console.log(receipt_uuid);
                        result.status = 'PAID';
                        result.receipt_uuid =  receipt_uuid;
                        dbSvc.saveData('invoice',result);
                    });
                    toaster.pop('success', '', 'บันทึกใบเสร็จ เรียบร้อยแล้ว');
                    $scope.reset();
                }, function(e) {
                    toaster.pop('warning', 'เกิดข้อผิดพลาด', 'บันทึกไม่สำเร็จ');
                });

            }else{
                toaster.pop('warning', 'เกิดข้อผิดพลาด', 'กรุณาใส่ข้อมูล "จำนวนเงินที่จ่ายน้อยกว่าจำนวนเงินที่ต้องจ่าย"');
            }
        }
    }
    $scope.convCode = function(code){
        var pattle = "000000";
        var last_code = (parseInt(code.replace(year + '-' + pc_num + 'HQ',"")) + 1) + "";
        var res = (pattle.substring(0, 6-last_code.length)) + last_code;
        
        return year + '-' + pc_num + 'HQ' + res;
    }
    $scope.calAmount = function(index){
        var qty = $scope.products[index].qty;
        var unit_price = $scope.products[index].unitPrice;

        $scope.products[index].amount = qty*unit_price;

        var amount = 0;
        for(var product in $scope.products){
            //console.log($scope.products[product]);
            amount = amount + ($scope.products[product].amount);    
            console.log(amount);        
        }
        $scope.receipt.amount = parseFloat(amount);

        amount = 0;
        for(var product in $scope.products){
            //console.log($scope.products[product]);
            if($scope.products[product].isVat){
                amount = parseFloat(amount) + (parseFloat($scope.products[product].amount));
            }         
        }
        $scope.receipt.vatAmount = (parseFloat(amount) * parseFloat($scope.receipt.vatRate)) / 100;
        $scope.receipt.whTaxAmount = (parseFloat($scope.receipt.amount) * ($scope.receipt.whTaxRate))/100;
        $scope.receipt.totalAmount = parseFloat($scope.receipt.whTaxAmount) + parseFloat($scope.receipt.amount) + parseFloat((isNaN($scope.receipt.vatAmount)?0:$scope.receipt.vatAmount));
   };

    $scope.setChecked = function(model){        
        var chk_product = false;
        
        for (var i = 0; i < $scope.products.length; i++) {
            if($scope.products[i].code != ""){
                chk_product = true;
                break;
            }                
        };
        if(chk_product){
            if(model == 'by_cash_count'){
                if($scope.by_cash_count != undefined && $scope.by_cash_count != '' && $scope.by_cash_count != 0){
                    $scope.by_cash = true;
                }else{
                    $scope.by_cash = false;
                }
            }
            if(model == 'by_cheque_count'){
                if($scope.by_cheque_count != undefined && $scope.by_cheque_count != '' && $scope.by_cheque_count != 0){
                    $scope.by_cheque = true;
                }else{
                    $scope.by_cheque = false;
                }
            }
            if(model == 'by_payin_count'){
                if($scope.by_payin_count != undefined && $scope.by_payin_count != '' && $scope.by_payin_count != 0){
                    $scope.by_payin = true;
                }else{
                    $scope.by_payin = false;
                }
            }
            $scope.get_money = 0;
            $scope.give_money = 0;
            if($scope.by_cash_count != undefined && $scope.by_cash_count != '' && $scope.by_cash_count != 0){
                $scope.get_money += $scope.by_cash_count;
            }
            if($scope.by_cheque_count != undefined && $scope.by_cheque_count != '' && $scope.by_cheque_count != 0){
                $scope.get_money += $scope.by_cheque_count;
            }
            if($scope.by_payin_count != undefined && $scope.by_payin_count != '' && $scope.by_payin_count != 0){
                $scope.get_money += $scope.by_payin_count;
            }
            if($scope.get_money > $scope.receipt.totalAmount){
                $scope.give_money = $scope.get_money - $scope.receipt.totalAmount;
            }
        }else{
            $scope.by_cash_count = undefined;
            $scope.by_cheque_count = undefined;
            $scope.by_payin_count = undefined;
            $scope.by_cash = false;
            $scope.by_cheque = false;
            $scope.by_payin = false;
            toaster.pop('warning', 'เกิดข้อผิดพลาด', 'กรุณาใส่ข้อมูล "เลขที่สมาชิก หรือเลขที่ใบแจ้งหนี้"');
        }        
    };
    $scope.setFocus = function(to,event,index){
        if(event.which  == 13){
            $('#' + to + index).focus();
            console.log('test');
        }
    }; 
    $scope.getMemType = function(code){
        var range = IDBKeyRange.bound(
                    code,
                    code
                );
        dbSvc.getTableIndex('member', 'ixMemberCode', range, 'next' /*prev*/).then(function(result) {
            if (result==null) {
                return false;
            }
            angular.forEach(result, function(data) {
                $scope.receipt.memType = data.type;
                $scope.receipt.name = data.name_th;
                //console.log(data.address);
                $scope.receipt.addr = 
                    (data.address1.addr1!=""?(data.address1.addr1 + " "):"") +
                    (data.address1.addr2!=""?(data.address1.addr2 + " "):"") +
                    (data.address1.district!=""?(data.address1.district + " "):"") +
                    (data.address1.fax!=""?(data.address1.fax + " "):"") +
                    (data.address1.name!=""?(data.address1.name + " "):"") +
                    (data.address1.province!=""?(data.address1.province + " "):"") +
                    (data.address1.subdistrict!=""?(data.address1.subdistrict + " "):"") +
                    (data.address1.tel!=""?(data.address1.tel + " "):"") +
                    (data.address1.zip!=""?(data.address1.zip):""); 
                $scope.receipt.taxId = data.taxId;
                //$scope.receipt.invoice_uuid = '';    
            });
        });        
    };
    $scope.setProduct = function(){
        //console.log($scope.invoice_code.match("[a-zA-Z]{2,2}\\d{8,8}"));
        if($scope.invoice_code.match("[a-zA-Z]{2,2}\\d{8,8}")){
            var range = IDBKeyRange.bound(
                    $scope.invoice_code,
                    $scope.invoice_code
            );
            dbSvc.getTableIndex('invoice','ixInvoiceCode', range, 'next' /*prev*/).then(function(result) {
                if (result==null) {
                    return false;
                }
                angular.forEach(result, function(data) {
                    $scope.receipt.name = data.name;
                    $scope.receipt.addr = data.addr; 
                    $scope.receipt.memCode = data.memCode;
                    $scope.getMemType(data.memCode);
                    $scope.products = data.items;
                    $scope.receipt.amount = data.amount;
                    $scope.receipt.vatRate = data.vatRate;
                    $scope.receipt.vatAmount = data.vatAmount;
                    $scope.receipt.whTaxAmount = (data.amount * $scope.receipt.whTaxRate)/100;
                    $scope.receipt.totalAmount = data.totalAmount + $scope.receipt.whTaxAmount;
                    $scope.receipt.invoice_uuid = data.uuid;
                    $scope.receipt.remark1 = data.remark1;
                    $scope.receipt.remark2 = data.remark2;
                });
            });
        }
    }
    $scope.searchInvoice = function(){
        //$scope.message = 'ข้อมูลยังไม่ถูกบันทึก ต้องการออกจากหน้าจอนี้ใช่หรือไม่';
        $scope.setInvCode = function(code) {
            $scope.invoice_code = code;
            $scope.setProduct();
            $('#by_cash_count').focus();
        };
        ngDialog.open({
            template: 'views/search_invoice.html',
            controller: 'SearchInvoiceDialogCtrl',
            className: 'ngdialog-theme-default ngdialog-theme-custom',
            scope:$scope,
        });
    }
    $scope.goBack = function() {
        if($scope.receiptForm.$dirty){
            $scope.message = 'ข้อมูลยังไม่ถูกบันทึก ต้องการออกจากหน้าจอนี้ใช่หรือไม่';
            $scope.positiveButton = 'ใช่';
            $scope.negativeButton = 'ไม่ใช่';
            $scope.positiveResponse = function() {
                $state.go('home.invoice');
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
            $state.go('home.receipt');
        }
    };
}])
.controller('SearchInvoiceDialogCtrl',
            ['$scope','dbSvc','$filter',
                function($scope,dbSvc,$filter){
    $scope.filtered = [];
    $scope.members = [];
    $scope.currentPage = 0;
    $scope.pageSize = 5;
    var year = $filter('date')(new Date(), 'yy');
    $scope.numberOfPages=function(){
        return Math.ceil($scope.filtered.length/$scope.pageSize);                
    }

    var range =  null;

    if($scope.invoice_code != undefined && $scope.invoice_code != ''){
        range = IDBKeyRange.bound(
                [$scope.invoice_code.toUpperCase(),'WAITING'],
                [$scope.invoice_code.toUpperCase(),'WAITING']
        );
        dbSvc.getTableIndex('invoice','ixInvoiceStatusCode', range, 'next' /*prev*/).then(function(result) {
            if (result==null) {
                return false;
            }
            $scope.invoices = result;
        });
    }else if($scope.receipt.memCode != undefined && $scope.receipt.memCode != ''){    
        //Wait for Check  
        range = IDBKeyRange.bound(
                [$scope.receipt.memCode,"AR"+year+"000000",'WAITING'],
                [$scope.receipt.memCode,"AR"+year+"999999",'WAITING'] 
        );
        dbSvc.getTableIndex('invoice','ixInvoiceReIssueStatus', range, 'next' /*prev*/).then(function(result) {
            if (result==null) {
                return false;
            }
            $scope.invoices = result;
        });
    }
    if(range == null){
        range = IDBKeyRange.bound(
                'WAITING',
                'WAITING'
        );
        dbSvc.getTableIndex('invoice','ixInvoiceStatus', range, 'next' /*prev*/).then(function(result) {
            if (result==null) {
                return false;
            }
            $scope.invoices = result;
        });
    }
    $scope.confirm = function(code){
        if (typeof $scope.setInvCode == 'function') {
            $scope.setInvCode(code);
        }
        $scope.closeThisDialog();
    };
    $scope.cancle = function(){
        $scope.closeThisDialog();
    };
}])
;