angular.module('attaAccounting', [

]).controller('ReceiptListCtrl', [
    '$scope','dbSvc',
    function($scope,dbSvc){
  $scope.currentPage = 0;
  $scope.pageSize = 10;
  $scope.receipts = [];
  $scope.filtered = [];

  $scope.numberOfPages=function(){
    return Math.ceil($scope.filtered.length/$scope.pageSize);
  };

  // var code_from = '14-00AA000000';
  // var code_to = '14-99ZZ999999';

  // var range = IDBKeyRange.bound(
  //   code_from,
  //   code_to
  // );
  // dbSvc.getTableIndex('receipt','ixReceiptCode', range, 'prev' /*prev*/).then(function(result) {
  //   if (result==null) {
  //     return false;
  //   }else{
  //     $scope.receipts = result;
  //   }
  // });

  $scope.thStatus = {
    WAITING:'รอการชำระเงิน',
    PAID:'ชำระเงินแล้ว',
    CANCELLED:'ยกเลิก',
  };

}]).controller('ReceiptNewCtrl', ['$rootScope', '$scope', '$stateParams',
    'ngDialog', 'dbSvc', '$q', '$filter', 'receiptPrintService', 'toaster', 'lovService',
    function($rootScope, $scope, $stateParams, ngDialog, dbSvc, $q, $filter
        , receiptPrintService, toaster, lovService) {

  console.log('uuid=', $stateParams.uuid);
  $scope.airportStaion = $rootScope.station.code;
  $scope.isLock = false;
  $scope.memberObj = null;
  $scope.invoiceObj = null;
  $scope.selectedReceipt = '';
  $scope.selectedMember = '';
  $scope.selectedInvoice = '';
  $scope.memberAddresses = [];
  $scope.invoiceCode = {};
  $scope.receipt = {
    uuid:'',
    period_id:$rootScope.period.id,
    issue_date:$rootScope.period.p_date.substr(0, 10),
    vat_rate:$rootScope.config.vat_rate,
    wht_rate:0.0,
    cash:0,
    cheque:0,
    payin:0,
    cheque_date:$rootScope.period.p_date.substr(0, 10),
//    payin_date:$rootScope.period.p_date.substr(0, 10),
    status:'PAID',
    is_post:'NO',
  };
  $scope.receiptItems = [{}];
  $scope.currentTab = 0;
  var is_saving_receipt = false;

  $scope.enableTeb = function(){
    if($scope.airportStaion.substring(2) == 'HQ' || $scope.airportStaion.substring(2) == 'HO'){
        return false;
    }
    return true;
  };

  $scope.switchTab = function(tabIndex) {
    $scope.currentTab = tabIndex;
  };

  $scope.getLastReceiptCode = function() {
    var pos = $scope.airportStaion;
    dbSvc.request('getLastReceiptCode', {pos:pos}).then(function(result) {
      if (result.status===true){
        //console.log(result);
        $scope.selectedReceipt = result.nextReceipt;
      }else{
        toaster.pop('warning', '', 'ไม่พบเลขที่บิลล่าสุด');
      }
    });
  };

  $scope.getLastReceiptCode();

  $scope.showLovReceipt = function($event) {
    $scope.fields = [];
    $scope.data = [];
    $scope.lovQuery = null;
    dbSvc.request('lov', {lov:'receipt',stationCode:$scope.airportStaion}).then(function(result) {
      if (result.status===true) {
        $scope.fields = result.fields;
        $scope.data = result.data;
        //$scope.items = result.data;
        // console.log($scope.fields);
        //console.log($scope.items);
        // console.log(result.SQL);
        // console.log(result.check);

        ngDialog.open({
          template: 'views/lov.html',
          controller: 'LovDialogCtrl',
          className: 'ngdialog-theme-default ngdialog-theme-lov',
          scope:$scope,
        }).closePromise.then(function(result) {
          if (typeof result.value==='undefined' || result.value==='$closeButton') {
            return;
          }
          loadReceipt(result.value.code);
        });
      }
    });
  };

$scope.jCheck = function(){
  if($scope.currentTab == 1 &&
    ($scope.receipt.cheque_branch == ''|| $scope.receipt.cheque_branch == undefined || $scope.receipt.cheque_branch == null)){
    toaster.pop('warning', '', 'คุณไม่ได้ใส่สาขาธนาคาร');
  }
  if ($scope.isLock) {
      var param = {
        code: $scope.receipt.code,
        address: {
          code: $scope.memberAddress.code,
          name: $scope.memberAddress.name,
          addr: $scope.memberAddress.addr.replace(/\s+/g, ' '),
          lang: $scope.memberAddress.lang,
        },
      };
    } else {
      var param = {
        mem_code:$scope.memberObj.code,
        inv_code:$scope.invoiceObj != null ? $scope.invoiceObj.code : '',
        address:{
          code: $scope.memberAddress.code,
          name: $scope.memberAddress.name,
          addr: $scope.memberAddress.addr.replace(/\s+/g, ' '),
          lang: $scope.memberAddress.lang,
        },
        issue_date:$scope.receipt.issue_date,
        items:$scope.receiptItems,
        vat_rate:$scope.receipt.vat_rate,
        wht_rate:$scope.receipt.wht_rate,
        cash:$scope.receipt.cash,
        cheque:$scope.receipt.cheque,
        payin:$scope.receipt.payin,
        cheque_bank:$scope.receipt.cheque_bank,
        cheque_branch:$scope.receipt.cheque_branch,
        cheque_number:$scope.receipt.cheque_number,
        cheque_date:$scope.receipt.cheque_date,
        inv_code:$scope.selectedInvoice,
      };
    }
      console.log(param);
}

  $scope.showLovInvoice = function($event) {
    if ($event.keyCode != 32) {
      return;
    }
    if ($scope.memberObj==null||$scope.memberObj==undefined||$scope.memberObj==''){
      var memberCode = '';
    } else {
      var memberCode = $scope.memberObj.code;
      console.log(memberCode);
    }
    $scope.lovQuery = "SELECT inv.code, inv.issue_date, m.name_en, inv.total_amount, inv.vat_amount, inv.status, inv.receipt_code"
          +", m.code mem_code, inv.deadline_date, inv.reissue_date, ma.addr1 , ma.addr2  , ma.province , ma.zipcode, inv.remark, ii.detail "
          +"FROM invoice inv LEFT JOIN member m ON inv.mem_code=m.code LEFT JOIN invoice_item ii ON inv.code = ii.invoice_code "
          +"LEFT JOIN member_address ma on m.code = ma.mem_code AND ma.invoice_addr='Y' "
          +"where ii.line_num = '1' AND inv.status = 'WAIT' and case when '"+memberCode+"' = '' then inv.mem_code=inv.mem_code else inv.mem_code = '"+memberCode+"' end "
          +"ORDER BY inv.issue_date DESC, inv.created_at DESC";
    $scope.fields = [
        {name:'code', text:'ใบแจ้งหนี้'},
        {name:'issue_date', text:'  วันที่ออก...'},
        {name:'mem_code', text:'รหัส', hidden:true},
        {name:'name_en', text:" ชื่อสมาชิก "},
        {name:'detail', text:'รายละเอียด'},
        {name:'total_amount', text:'ยอดสุทธิ'},
        {name:'vat_amount', text:'VAT' ,hidden:true},
        {name:'status', text:'สถานะ'},
        {name:'receipt_code', text:'เลขที่ใบเสร็จ' ,hidden:true},
        {name:'deadline_date', text:'วันกำหนดชำระ' ,hidden:true},
        {name:'reissue_date', text:'วันที่ Reissue' ,hidden:true},
        {name:'addr1', text:'addr1' ,hidden:true},
        {name:'addr2', text:'addr2' ,hidden:true},
        {name:'province', text:'จังหวัด' ,hidden:true},
        {name:'zipcode', text:'รหัสไปรษณีย์' ,hidden:true},
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
          angular.element('#invoiceCode').focus();
        }, 0);
        return;
      }
      $scope.invoiceCode = angular.copy(result.value);
      //console.log($scope.invoiceCode);
      $scope.selectedInvoice = $scope.invoiceCode.code;
      loadInvoice($scope.invoiceCode.code);
      setTimeout(function() {
        angular.element('#issueDate').focus();
      }, 0);
    });
  };

  $scope.showLovMember = function($event) {
    $scope.lovQuery = "SELECT code, name_en, name_th, "
      + "IF(type='ORDINARY','สามัญ',IF(type='EXTRA','สมทบ',IF(type='VIP','กิติมศักดิ์','เงินสด'))) type_name, "
      + "uuid FROM member "
      + " WHERE is_active='YES' ORDER BY name_en";

    $scope.fields = [
      {name:'uuid', text:'', hidden:true},
      {name:'code', text:'รหัส'},
      {name:'name_en', text:'ชื่อสมาชิก (อังกฤษ)'},
      {name:'name_th', text:'ชื่อสมาชิก (ไทย)'},
      {name:'tel', text:'โทรศัพท์'},
      {name:'email',text:'อีเมล'},
      {name:'website',text:'เว็บไซต์', hidden:true},
      {name:'tax_id',text:'', hidden:true},
      {name:'tat_id',text:'', hidden:true},
    ];
    ngDialog.open({
      template: 'views/lov.html',
      controller: 'LovDialogCtrl',
      className: 'ngdialog-theme-default ngdialog-theme-lov',
      scope:$scope,
    }).closePromise.then(function(result) {
      if (typeof result.value==='undefined') {
        setTimeout(function() {
          if ($scope.memberObj != null) {
            $scope.selectedMember = $scope.memberObj.code + ':' + $scope.memberObj.name_th;
          }
          angular.element('#member').focus().select();
        }, 0);
        return;
      }
      dbSvc.request('memberByCode', {code:result.value.code}).then(function(result) {
        if (result.status===true) {
          $scope.memberObj = angular.copy(result.member);
          $scope.selectedMember = result.member.code + ':' + result.member.name_en;
          $scope.receipt.name =  result.member.name_th;
          changeMember();

      setTimeout(function() {
        angular.element('#invoiceCode').focus();
      }, 0);
        }
      });
    });
  };

  $scope.checkDone = function($event, rowNumber) {
    if ($event.keyCode==13) {
      // ENTER
      console.log($scope.receiptItems[rowNumber]);
      if (typeof $scope.receiptItems[rowNumber].prod_code=='undefined'
          || $scope.receiptItems[rowNumber].prod_code=='') {
        setTimeout(function() {
          angular.element('#cash').focus().select();
        });
        return;
      }
    }
  };

  $scope.showLovProduct = function($event, rowNumber) {
      //console.log(rowNumber);console.log($event);
      var filterStation = $rootScope.station.code;
      var sta = filterStation.substring(2, 4);
      $scope.stationWhere = "";
      if(sta == 'DM'){
        $scope.stationWhere = "AND substring(account_code,4,1) = '9'";
      }else if(sta == 'SU'&&
      (filterStation=='01SU'||filterStation=='03SU'||filterStation=='04SU'||filterStation=='14SU'||filterStation=='15SU')){
        $scope.stationWhere = "AND substring(account_code,4,1) = '8' AND code not in ('OF2','SH2','CF2')";
      }else if(sta == 'SU'&&
      (filterStation=='02SU'||filterStation=='05SU'||filterStation=='16SU'||filterStation=='17SU')){
        $scope.stationWhere = "AND substring(account_code,4,1) = '8' AND code not in ('OF1','SH1','CF1')";
      }else if(sta == 'SU'&&
      (filterStation!='02SU'||filterStation!='05SU'||filterStation!='16SU'||filterStation!='17SU'||
       filterStation!='01SU'||filterStation!='03SU'||filterStation!='04SU'||filterStation!='14SU'||filterStation!='15SU')){
        $scope.stationWhere = "AND substring(account_code,4,1) = '8'";
      }else{
        $scope.stationWhere = "AND substring(account_code,4,1) not in ('8','9')";
      }
    if ($event.keyCode != 32) {
      return;
    }
//    console.log($rootScope.setting.code.substr(-2));
    $scope.lovQuery = "SELECT * FROM product WHERE (site_list='ALL' "
      + "OR concat(',', site_list, ',') LIKE '%," + $rootScope.setting.code.substr(-2) + ",%') " + $scope.stationWhere
      + " ORDER BY code";
      //console.log($scope.lovQuery);
    if (typeof $scope.receiptItems[rowNumber].prod_code === 'string') {
      $scope.keyword = $scope.receiptItems[rowNumber].prod_code;
    } else {
      $scope.keyword = '';
    }

    $scope.fields = [
      {name:'code',text:'รหัส'},
      {name:'name',text:'ชื่อสินค้า/บริการ'},
      {name:'price',text:'ราคา'},
      {name:'unit',text:'หน่วยนับ'},
      {name:'account_code', text:'รหัสบัญชี'},
      {name:'vat_type',text:'VAT'},
    ];



    ngDialog.open({
      template: 'views/lov.html',
      controller: 'LovDialogCtrl',
      className: 'ngdialog-theme-default ngdialog-theme-lov',
      scope:$scope,
    }).closePromise.then(function(result) {
      if (typeof result.value==='undefined') {
        if (rowNumber < $scope.receiptItems.length-1) {
          $scope.receiptItems.splice(rowNumber, 1);
        }
        setTimeout(function() {
          angular.element('code_' + ($scope.receiptItems.length-1)).focus().select();
        }, 0);
        return;
      }
//      console.log(result.value);
      addItem(rowNumber, result.value, 1);
      if (rowNumber == $scope.receiptItems.length-1) {
        $scope.receiptItems.push({});
        console.log($scope.receiptItems);
      }
      setTimeout(function() {
        var qtyObj = angular.element('#qty_' + rowNumber);
        qtyObj.attr({readonly:false}).focus().select();
      },0);
//      angular.element('#qty_' + rowNumber).focus();
    });
  };

  $scope.showLovBank = function($event, type) {
    if ($event.keyCode != 32) {
      return;
    }
    $scope.lovQuery = 'SELECT code, name FROM bank ORDER BY name ASC';
    if (typeof $scope.receipt[type+'_bank'] === 'string') {
      $scope.keyword = $scope.receipt[type+'_bank'];
    } else {
      $scope.keyword = '';
    }

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
      if (typeof result.value==='undefined') {
        setTimeout(function() {
          angular.element('#'+type+'_bank').focus().select();
        }, 0);
        return;
      }
      $scope.receipt[type+'_bank'] = result.value.code+':'+result.value.name;
      setTimeout(function() {
        angular.element('#'+type+'_branch').focus().select();
      },0);
    });
  };

  var addItem = function(idx, item, qty) {
    $scope.receiptItems[idx].prod_code = item.code;
    $scope.receiptItems[idx].detail = item.name;
    $scope.receiptItems[idx].qty = qty;
    $scope.receiptItems[idx].price = item.price;
    $scope.receiptItems[idx].unit = item.unit;
    $scope.receiptItems[idx].vat_type = item.vat_type;
    $scope.receiptItems[idx].account_code = item.account_code;
    $scope.receiptItems[idx].lotin_id = '';
    $scope.receiptItems[idx].flage = '';
  };

  $scope.changeQty = function(index){
    var qty = $scope.receiptItems[index].qty;
    var prod_code = $scope.receiptItems[index].prod_code;
    var detail = $scope.receiptItems[index].detail;
    var lotin_id = $scope.receiptItems[index].lotin_id;
    var realQty = 0;
    var refDataCancel = checkCancelRefCode(qty,prod_code,index,detail,lotin_id);
  }

  var checkCancelRefCode = function(qty,prod_code,index,detail,lotin_id){
    dbSvc.request('checkCancelData',{prodCode:prod_code}).then(function(result) {
      if (result.status===true) {
        console.log($scope.receiptItems[index].flage);
        if($scope.receiptItems[index].flage==''||$scope.receiptItems[index].flage=='C'){
          getCancelData(qty,prod_code,index,detail,lotin_id);
        }else{
          getDataforRefCode(qty,prod_code,index,detail,lotin_id);
        }
      } else{
        getDataforRefCode(qty,prod_code,index,detail,lotin_id);
      }
    });
  }

  var getCancelData = function(qty,prod_code,index,detail,lotin_id){
    dbSvc.request('getCancelData',{prodCode:prod_code,lotin_id:lotin_id}).then(function(result) {
      if(result.status===true) { console.log(result);
        var cancelData = result.dataCheckCancel;
        if(prod_code=='OF'||prod_code=='OFN'||prod_code=='OFD'||prod_code=='OF1'||prod_code=='OF2'){
            sumAllQty = cancelData.sumAllQty/50;
        }else{
          sumAllQty = cancelData.sumAllQty;
        }
        console.log(sumAllQty);
        if (sumAllQty < qty) {
          var qtyRef = qty - sumAllQty;
          getDataforRefCode(qtyRef,prod_code,index,detail,'');
          $scope.receiptItems[index].qty = qtyRef;

          $scope.receiptItems[index+1].prod_code = $scope.receiptItems[index].prod_code;
          $scope.receiptItems[index+1].detail = $scope.receiptItems[index].detail;
          $scope.receiptItems[index+1].price = $scope.receiptItems[index].price;
          $scope.receiptItems[index+1].unit = $scope.receiptItems[index].unit;
          $scope.receiptItems[index+1].vat_type = $scope.receiptItems[index].vat_type;
          $scope.receiptItems[index+1].account_code = $scope.receiptItems[index].account_code;
          $scope.receiptItems[index+1].qty = parseInt(sumAllQty);
          angular.element('#'+'qty_'+index+1).focus();
          $scope.receiptItems.push({})
          genCancelSell(sumAllQty,prod_code,index+1,detail,lotin_id,cancelData);
          //console.log(qtyRef,qty,cancelData.sumAllQty);
        } else {
          genCancelSell(qty,prod_code,index,detail,lotin_id,cancelData);
          console.log('aaa');
        }
      }
    });
  }

  var genCancelSell = function(qty,prod_code,index,detail,lotCancel_id,data){
    var firstCdata = data.firstLotcancelData;
    var nextCdata = data.nextLotcancelData;

    var ref = firstCdata.prefix_code+pad(firstCdata.next_item,5)+'-'+
    firstCdata.prefix_code+pad((parseInt(firstCdata.next_item)+(qty*data.sell_item))-1,5);
    var book = 'เล่มที่ '+Math.ceil(firstCdata.next_item/50)+'-'+
    Math.ceil(((parseInt(firstCdata.next_item)+(qty*data.sell_item))-1)/50);
    console.log(qty);
    //$scope.receiptItems[index].qty = qty;
    $scope.receiptItems[index].ref_code = (ref=='undefinedundefined-undefined00NaN') ? '' : book + '  '+ ref;
    $scope.receiptItems[index].lotin_id = firstCdata.id;
    $scope.receiptItems[index].flage = 'C';
    //$scope.receiptItems[index].qty = qty;
    console.log(firstCdata,nextCdata);

    if (parseInt(firstCdata.aval_qty)<(qty*data.sell_item)){
      console.log(firstCdata.aval_qty);
      $scope.receiptItems[index].qty = firstCdata.aval_qty/data.sell_item;
      var ref = firstCdata.prefix_code+pad(firstCdata.next_item,5)+'-'+
      firstCdata.prefix_code+pad((parseInt(firstCdata.next_item)+(firstCdata.aval_qty*1))-1,5);
      var book = 'เล่มที่ '+Math.ceil(firstCdata.next_item/50)+'-'+
      Math.ceil(((parseInt(firstCdata.next_item)+(firstCdata.aval_qty*1))-1)/50);
      $scope.receiptItems[index].ref_code = book + '  '+ ref;

      if (nextCdata===false) {
        toaster.pop('warning', '', 'สินค้าในสต๊อกไม่พอขาย');
      }else{
        console.log('มันมาแล้ว2');
        var nextIndex = index+1;
        var nextQty = ((qty*data.sell_item)-(firstCdata.aval_qty))/data.sell_item;
        var ref_next = nextCdata.prefix_code+pad(nextCdata.next_item,5)+'-'+
        nextCdata.prefix_code+pad((parseInt(nextCdata.next_item)+(nextQty*data.sell_item))-1,5);
        var book_next = 'เล่มที่ '+Math.ceil(nextCdata.next_item/50)+'-'+
        Math.ceil(((parseInt(nextCdata.next_item)+(nextQty*data.sell_item))-1)/50);
        console.log(book_next + '  '+ ref_next);
        console.log($scope.receiptItems[index].prod_code);
        console.log(nextIndex);
        $scope.receiptItems[nextIndex].prod_code = $scope.receiptItems[index].prod_code;
        $scope.receiptItems[nextIndex].detail = $scope.receiptItems[index].detail;
        $scope.receiptItems[nextIndex].qty = nextQty;
        $scope.receiptItems[nextIndex].price = $scope.receiptItems[index].price;
        $scope.receiptItems[nextIndex].unit = $scope.receiptItems[index].unit;
        $scope.receiptItems[nextIndex].vat_type = $scope.receiptItems[index].vat_type;
        $scope.receiptItems[nextIndex].account_code = $scope.receiptItems[index].account_code;
        $scope.receiptItems[nextIndex].ref_code = (ref_next=='undefinedundefined-undefined00NaN') ? '' : book_next + '  '+ ref_next;
        $scope.receiptItems[nextIndex].lotin_id = nextCdata.id;
        $scope.receiptItems[nextIndex].flage = 'C';
        angular.element('#'+'qty_'+nextIndex).focus();
        $scope.receiptItems.push({})
      }
    }
  }

  var getDataforRefCode = function(qty,prod_code,index,detail,lotin_id){
    dbSvc.request('getDataforRefcode', {qty:qty,prodCode:prod_code,lotin_id:lotin_id}).then(function(result) {
        if (result.status===true) {
          console.log(index,qty);
          var refdata = result.refdata;
          console.log(refdata);
          var ref = refdata.firstLotinData.prefix_code+pad(refdata.firstLotinData.next_item,5)+'-'+
          refdata.firstLotinData.prefix_code+pad((parseInt(refdata.firstLotinData.next_item)+(qty*refdata.sell_item))-1,5);
          var book = 'เล่มที่ '+Math.ceil(refdata.firstLotinData.next_item/50)+'-'+
          Math.ceil(((parseInt(refdata.firstLotinData.next_item)+(qty*refdata.sell_item))-1)/50);

          $scope.receiptItems[index].ref_code = (ref=='undefinedundefined-undefined00NaN') ? '' : book + '  '+ ref;
          $scope.receiptItems[index].lotin_id = refdata.firstLotinData.id;
          $scope.receiptItems[index].flage = 'N';
          console.log($scope.receiptItems[index].ref_code);
          //refdata={};
          if(parseInt(refdata.firstLotinData.aval_qty) == 0) {
            if (refdata.nextLotinData===false) {
              toaster.pop('warning', '', 'สินค้าในสต๊อกไม่พอขาย');
              $scope.reset();
            }else {
              console.log('XZX');
              var ref = refdata.nextLotinData.prefix_code+pad(refdata.nextLotinData.next_item,5)+'-'+
              refdata.nextLotinData.prefix_code+pad((parseInt(refdata.nextLotinData.next_item)+(qty*refdata.sell_item))-1,5);
              var book = 'เล่มที่ '+Math.ceil(refdata.nextLotinData.next_item/50)+'-'+
              Math.ceil(((parseInt(refdata.nextLotinData.next_item)+(qty*refdata.sell_item))-1)/50);

              $scope.receiptItems[index].ref_code = (ref=='undefinedundefined-undefined00NaN') ? '' : book + '  '+ ref;
              $scope.receiptItems[index].lotin_id = refdata.nextLotinData.id;
              $scope.receiptItems[index].flage = 'N';
            }
          }

          if(parseInt(refdata.firstLotinData.aval_qty)<(qty*refdata.sell_item) && parseInt(refdata.firstLotinData.aval_qty) != 0){
            console.log(refdata.firstLotinData.aval_qty);
            $scope.receiptItems[index].qty = refdata.firstLotinData.aval_qty/refdata.sell_item;
            var ref = refdata.firstLotinData.prefix_code+pad(refdata.firstLotinData.next_item,5)+'-'+
            refdata.firstLotinData.prefix_code+pad((parseInt(refdata.firstLotinData.next_item)+(refdata.firstLotinData.aval_qty*1))-1,5);
            var book = 'เล่มที่ '+Math.ceil(refdata.firstLotinData.next_item/50)+'-'+
            Math.ceil(((parseInt(refdata.firstLotinData.next_item)+(refdata.firstLotinData.aval_qty*1))-1)/50);
            $scope.receiptItems[index].ref_code = book + '  '+ ref;


            if (refdata.nextLotinData===false){
              toaster.pop('warning', '', 'สินค้าในสต๊อกไม่พอขาย');
            }else{
              console.log('มันมาแล้ว');
              var nextIndex = index+1;
              var nextQty = ((qty*refdata.sell_item)-(refdata.firstLotinData.aval_qty))/refdata.sell_item;
              var ref_next = refdata.nextLotinData.prefix_code+pad(refdata.nextLotinData.next_item,5)+'-'+
              refdata.nextLotinData.prefix_code+pad((parseInt(refdata.nextLotinData.next_item)+(nextQty*refdata.sell_item))-1,5);
              var book_next = 'เล่มที่ '+Math.ceil(refdata.nextLotinData.next_item/50)+'-'+
              Math.ceil(((parseInt(refdata.nextLotinData.next_item)+(nextQty*refdata.sell_item))-1)/50);
              console.log(book_next + '  '+ ref_next);
              console.log($scope.receiptItems[index].prod_code);
              console.log(nextIndex);
              $scope.receiptItems[nextIndex].prod_code = $scope.receiptItems[index].prod_code;
              $scope.receiptItems[nextIndex].detail = $scope.receiptItems[index].detail;
              $scope.receiptItems[nextIndex].qty = nextQty;
              $scope.receiptItems[nextIndex].price = $scope.receiptItems[index].price;
              $scope.receiptItems[nextIndex].unit = $scope.receiptItems[index].unit;
              $scope.receiptItems[nextIndex].vat_type = $scope.receiptItems[index].vat_type;
              $scope.receiptItems[nextIndex].account_code = $scope.receiptItems[index].account_code;
              $scope.receiptItems[nextIndex].ref_code = (ref_next=='undefinedundefined-undefined00NaN') ? '' : book_next + '  '+ ref_next;
              $scope.receiptItems[nextIndex].lotin_id = refdata.nextLotinData.id;
              $scope.receiptItems[nextIndex].flage = 'N';
              angular.element('#'+'qty_'+nextIndex).focus();
              $scope.receiptItems.push({})
            }
          }
        } else {
          toaster.pop('warning', '', result.reason);
        };
      });
  }

  function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

  var changeMember = function(addr_id) {
    console.log("addr_id = ", addr_id);
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
        addr_id:member.addresses[i].id,
      });
    }

    $scope.memberAddresses = out;
    //console.log("$scope.memberAddresses = ", $scope.memberAddresses);
    if (out.length > 0) {
      if (typeof $scope.receipt.branch_name==='undefined' || $scope.receipt.branch_name=='') {
        $scope.memberAddress = $scope.memberAddresses[0];
      } else {
        for(var i = 0; i < $scope.memberAddresses.length; i++) {
          if ($scope.memberAddresses[i].name==$scope.receipt.branch_name) {
            $scope.memberAddress = $scope.memberAddresses[i];
            break;
          }
        }
      }

      if(addr_id != undefined){
        for(var i = 0; i < $scope.memberAddresses.length; i++) {
          if ($scope.memberAddresses[i].addr_id==addr_id) {
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
    $scope.receipt.addr = $scope.memberAddress.addr;
    if($scope.memberAddress.lang=='TH'){
        $scope.receipt.name = $scope.memberObj.name_th;
      } else {
        $scope.receipt.name = $scope.memberObj.name_en;
      }
  }

  $scope.updateReceipt = function() {
    var totalAmount = 0;
    var totalAmount2 = 0;
    //console.log($scope.receiptItems);
    $scope.receiptItems.forEach(function(item) {
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
    var vat = parseFloat((totalAmount * Math.ceil($scope.receipt.vat_rate) / 100.0).toFixed(2));
    var vat2 = parseFloat((totalAmount2 * Math.ceil($scope.receipt.vat_rate) / (100+Math.ceil($scope.receipt.vat_rate))).toFixed(2));
    $scope.receipt.amount = totalAmount + totalAmount2 - vat2;
    var wht = parseFloat(($scope.receipt.amount * $scope.receipt.wht_rate / 100).toFixed(2));
    $scope.receipt.vat_amount = vat+vat2;
    $scope.receipt.wht_amount = wht;

    $scope.receipt.total_amount = $scope.receipt.amount + vat+vat2 - wht;
    $scope.receipt.total_receive = parseFloat($scope.receipt.cash) + parseFloat($scope.receipt.cheque) + parseFloat($scope.receipt.payin);
    $scope.receipt.change = $scope.receipt.total_receive - $scope.receipt.total_amount;

  }

  var removePrefix =function(s) {
    var l = s.indexOf(':');
    if (l===-1) {
      return s;
    }
    return s.substr(l+1).trim();
  }

  var doCancelReceipt = function() {
    dbSvc.request('receiptCancel', {
      code:$scope.receipt.code,
      reason:$scope.receipt.cancel_reason,
    }).then(function(result) {
      if (result.status===true) {
        toaster.pop('success', '', 'ยกเลิกใบเสร็จเรียบร้อยแล้ว');
        $scope.receipt.status='CANCELLED';
      }
    });
  }

  $scope.cancel = function() {
    if ($scope.receipt.cancel_reason=='') {
      toaster.pop('warning', '', 'กรุณาระบุเหตุผลของการยกเลิกใบเสร็จ');
      setTimeout(function() {
        angular.element('#cancel_reason').focus();
      },0);
      return false;
    }

    $scope.message = 'หากยกเลิกใบเสร็จแล้ว จะแก้ไขไม่ได้อีก ยืนยันการยกเลิก';
    $scope.positiveButton = 'ยกเลิกใบเสร็จ';
    $scope.negativeButton = 'ไม่ยกเลิก';
    $scope.positiveResponse = function() {
      doCancelReceipt();
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

  $scope.save = function(print) {
    if($scope.currentTab == 1 &&
      ($scope.receipt.cheque_branch == ''|| $scope.receipt.cheque_branch == undefined || $scope.receipt.cheque_branch == null)){
      toaster.pop('warning', '', 'คุณไม่ได้ใส่สาขาธนาคาร');
    }
    if ($scope.memberAddress==null || typeof $scope.memberAddress.code==='undefined') {
      toaster.pop('warning', '', 'กรุณาเลือกที่อยู่ในการออกบิลก่อน');
      return;
    }
    if(is_saving_receipt==true){
      toaster.pop('warning', '', 'กำลังทำการบันทึกข้อมูลกรุณารอสักครู่');
      return;
    }
    is_saving_receipt = true;
    if ($scope.isLock) {
      var param = {
        code: $scope.receipt.code,
        address: {
          code: $scope.memberAddress.code,
          name: $scope.memberAddress.name,
          addr: $scope.memberAddress.addr.replace(/\s+/g, ' '),
          lang: $scope.memberAddress.lang,
        },
      };
      dbSvc.request('receiptAddressUpdate', param).then(function(result) {
        if (result.status===true) {
          toaster.pop('success', '', 'บันทึกใบเสร็จเรียบร้อยแล้ว');
          is_saving_receipt = false;
          setTimeout(function() {
            angular.element('#reset').focus();
          }, 0);
          if (print===false) {
            return;
          }
          receiptPrintService.printReceipt($scope.receipt.code, 1);
          $scope.reset();
        } else {
          if(result.nonProd==''){
            toaster.pop('warning', '', result.reason);
          }else {
            toaster.pop('warning', '', result.nonProd);
          }
          is_saving_receipt = false;
        }
      });
    } else {
      var param = {
        mem_code:$scope.memberObj.code,
        //inv_code:$scope.invoiceObj != null ? $scope.invoiceObj.code : '',
        address:{
          code: $scope.memberAddress.code,
          name: $scope.memberAddress.name,
          addr: $scope.memberAddress.addr.replace(/\s+/g, ' '),
          lang: $scope.memberAddress.lang,
        },
        issue_date:$scope.receipt.issue_date,
        items:$scope.receiptItems,
        vat_rate:$scope.receipt.vat_rate,
        wht_rate:$scope.receipt.wht_rate,
        cash:$scope.receipt.cash,
        cheque:$scope.receipt.cheque,
        payin:$scope.receipt.payin,
        cheque_bank:$scope.receipt.cheque_bank,
        cheque_branch:$scope.receipt.cheque_branch,
        cheque_number:$scope.receipt.cheque_number,
        cheque_date:$scope.receipt.cheque_date,
        inv_code:$scope.selectedInvoice,
      };

      setTimeout(function() {
        angular.element('#reset').focus();
      }, 0);
      console.log(param);
      dbSvc.request('receiptSave', param).then(function(result) {
        if (result.status===true) {
          toaster.pop('success', '', 'บันทึกใบเสร็จเรียบร้อยแล้ว');
          is_saving_receipt = false;

          $scope.receipt.code=result.receipt_code;
          receiptPrintService.printReceipt($scope.receipt.code, 1);
          $scope.reset();
        } else {
          toaster.pop('warning', '', 'บันทึกข้อมูลไม่สำเร็จ');
          //result.reason
          is_saving_receipt = false;
        };
      });
    }
  }

  $scope.print = function() {
    receiptPrintService.printReceipt($scope.receipt.code, 1);
  }

  $scope.reset = function() {
    $scope.memberObj = null;
    $scope.invoiceObj = null;
    $scope.selectedReceipt = '';
    $scope.selectedMember = '';
    $scope.selectedInvoice = '';
    $scope.memberAddresses = [];
    $scope.selectedReceiptSearch = '';
    $scope.receipt = {
      uuid:'',
      period_id:$rootScope.period.id,
      issue_date:$rootScope.period.p_date.substr(0, 10),
      issue_by:$rootScope.sessionStaff.user,
      vat_rate:$rootScope.config.vat_rate,
      wht_rate:0.0,
      cash:0,
      cheque:0,
      payin:0,
      cheque_date:$rootScope.period.p_date.substr(0, 10),
//      payin_date:$rootScope.period.p_date.substr(0, 10),
      status:'PAID',
      is_post:'NO',
    };
    $scope.isLock = $scope.receipt.uuid!='';
    $scope.receiptItems = [{}];
    $scope.staff_name = $rootScope.sessionStaff.fullname;
    setTimeout(function() {
      angular.element('#member').focus().select();
    }, 0);

    $scope.getLastReceiptCode();
  }

  var getMemberByCode = function(mem_code) {
    return dbSvc.getTableIndex('member', 'ixMemberCode', IDBKeyRange.only(mem_code), 'next').then(function(result) {
      if (result.length==0) {
        console.log('NOT FOUND');
        return;
      }
      $scope.memberObj = angular.copy(result[0]);
      $scope.selectedMember = result[0].code + ':' + result[0].name_th;
      $scope.receipt.name = result[0].name_th;
      changeMember();
    });
  }

  var genReceipt = function(param) {
    var deferred = $q.defer();
    var all = [];
    $scope.receipt = {
      vat_rate:$rootScope.config.vat_rate,
      wht_rate:0.0,
      cash:0,
      cheque:0,
      payin:0,
      cheque_date:$filter('date')(new Date(), 'yyyy-MM-dd'),
//      payin_date:$filter('date')(new Date(), 'yyyy-MM-dd'),
      status:'PAID',
    };

    if (typeof param.issue_date === 'undefined') {
      $scope.receipt.issue_date = $rootScope.period.p_from.substr(0, 10);
    }

    if (typeof param.mem_code == 'string') {
      all.push(dbSvc.request('memberByCode', {code:param.mem_code}).then(function(result) {
        if (result.status===true) {
          $scope.memberObj = angular.copy(result.member);
          $scope.selectedMember = result.member.code + ':' + result.member.name_en;
          $scope.receipt.name = result.member.name_th;
          changeMember();
        }
      }));
    }

    if (typeof param.items == 'object' && param.items.length > 0) {
      $scope.receiptItems = [{}];
      param.items.forEach(function(item, i) {
        all.push(dbSvc.request('productByCode', {code:item.code}).then(function(result) {
          if (result.status===true) {
            addItem(i, result.product, item.qty);
            angular.element('#qty_' + i).attr({readonly:false});
            $scope.receiptItems.push({});
          }
        }));
      });
    }

    if (typeof param.cash !== 'undefined') {
      $scope.receipt.cash = param.cash;
    }
    all.push(dbSvc.request('nextCode', {table:'receipt'}).then(function(result) {
      if (result.status===true) {
        $scope.receipt.code = result.code;
        $scope.selectedReceipt = result.code;
      }
    }));

    $q.all(all).then(function() {
      $scope.updateReceipt();
      deferred.resolve(receipt);
      setTimeout(function() {
        if ($scope.memberObj == null) {
          angular.element('#member').focus().select();
        } else if ($scope.receiptItems.length == 1) {
          angular.element('#code_0').focus().select();
        } else {
          angular.element('#cash').focus().select();
        }
      })
    });

    return deferred.promise;
  }

  $scope.isVat = function(){
    var checkVat = $scope.airportStaion;
    //console.log(checkVat,$scope.isLock);
    if(checkVat.match(/HO.*/) && !$scope.isLock){
      return false;
    }
    return true;
  }

  $scope.isValid = function() {

    if ((typeof $scope.memberObj == 'undefined' || $scope.memberObj == null)
        && (typeof $scope.receipt == 'undefined' || $scope.receipt == null
          || typeof $scope.receipt.name === 'undefined'
          || $scope.receipt.name.trim()=='')) {
      return false;
    }

    if ($scope.receiptItems.length <= 1) {
      return false;
    }

    if($scope.receiptItems[0].detail == 'undefined' || $scope.receiptItems[0].detail == null){
      return false;
    }

    if ($scope.receipt.change < 0||$scope.receipt.change=='undefined'||$scope.receipt.change==null) {
      return false;
    }
    for (i in $scope.receiptItems){
      if ($scope.receiptItems[i].qty == 0 || $scope.receiptItems[i].qty == '' || $scope.receiptItems[i].qty == null) {
        return false;
      } else {
        return true;
      }
      //console.log($scope.receiptItems[i].qty);
    }

    return true;
  }

  $scope.nextAndPreviodsCheck = function(){
    if ($scope.isLock) {
      return false;
    }
    return true;
  }

  $scope.nextClick = function(code){
    console.log(code);
    var str = (parseInt(code.substr(8, 6)) + 1) + "";
    var pad = "000000";
    var nextCode = code.substr(0, 8) + pad.substring(0, pad.length - str.length) + str;

    dbSvc.request('getNextReceipt', {receipt_code:nextCode}).then(function(result) {
      if(result.status===true){
        console.log(result);
        loadReceipt(nextCode);
      } else {
        console.log(result);
        toaster.pop('warning', '', 'ไม่พบเลขที่ใบเสร็จ ' + nextCode);
      }
    });
  }

  $scope.previousClick = function(code){
    console.log(code);
    var str = (parseInt(code.substr(8, 6)) - 1) + "";
    var pad = "000000";
    var nextCode = code.substr(0, 8) + pad.substring(0, pad.length - str.length) + str;

    dbSvc.request('getNextReceipt', {receipt_code:nextCode}).then(function(result) {
      if(result.status===true){
        console.log(result);
        loadReceipt(nextCode);
      } else {
        console.log(result);
        toaster.pop('warning', '', 'ไม่พบเลขที่ใบเสร็จ ' + nextCode);
      }
    });
  }

  $scope.switchTab(0);

  var loadReceipt = function(code) {
    //console.log(code);
    dbSvc.request('receiptByCode', {code:code}).then(function(result) {
      if (result.status===true) {
        var receipt = result.receipt;
        $scope.receipt = angular.copy(receipt);
        $scope.selectedReceipt = receipt.code;
        $scope.selectedInvoice = receipt.inv_code;
        $scope.receiptItems = [];
        for(var i = 0; i < receipt.items.length; i++) {
          receipt.items[i].qty = parseInt(receipt.items[i].qty);
          $scope.receiptItems.push(receipt.items[i]);
        }

        $scope.receiptItems.push({});
        $scope.isLock = true;
        console.log($scope.receiptItems);
        //$scope.updateReceipt();
        dbSvc.request('memberByCode', {code:receipt.mem_code}).then(function(result) {
          if (result.status===true) {
            $scope.memberObj = angular.copy(result.member);
            $scope.selectedMember = result.member.code + ':' + result.member.name_en;
            changeMember();
          }
        });
      } else {
        if ($scope.selectedReceiptSearch==''||$scope.selectedReceiptSearch==undefined||$scope.selectedReceiptSearch==null){
          console.log('non');
        } else {
          toaster.pop('wanring', '', 'ไม่พบใบเสร็จที่ค้นหา');
        }
      }
    });
  };

  $scope.loadReceipt2 = function(){
    loadReceipt($scope.selectedReceiptSearch);
  }

  var loadInvoice = function(receiptCode) {
    console.log(receiptCode);
    dbSvc.request('loadInvoiceByCode',{code:receiptCode}).then(function(result){
      if (result.status===true) {
        var receipt = result.invoice;
        $scope.receipt.issue_by = receipt.issue_by;
        $scope.receipt.name = receipt.name;
        $scope.receiptItems = [];
        for(var i = 0; i < receipt.items.length; i++) {
          receipt.items[i].qty = parseInt(receipt.items[i].qty);
          $scope.receiptItems.push(receipt.items[i]);
        }

        $scope.receiptItems.push({});
        $scope.isLock = false;
        console.log($scope.receiptItems);
        //$scope.updateReceipt();
        dbSvc.request('memberByCode', {code:receipt.mem_code}).then(function(result) {
          if (result.status===true) {
            $scope.memberObj = angular.copy(result.member);
            $scope.selectedMember = result.member.code + ':' + result.member.name_en;
            changeMember(receipt.addr_id);
          }
        });
      }
    });
  }


  if (typeof $rootScope.dummyReceipt === 'object') {
    console.log($rootScope.dummyReceipt);
    dbSvc.request('genReceipt', $rootScope.dummyReceipt).then(function(result) {
      delete $rootScope.dummyReceipt;
      if (result.status === true) {
        $scope.receipt = result.receipt;
        if (result.member !== false) {
          $scope.memberObj = result.member;
          $scope.selectedMember = result.member.code + ':' + result.member.name_en;
          //console.log(result.member.addr_id);
          changeMember(result.member.addr_id);
        }
        $scope.receiptItems = result.items;
        $scope.receiptItems.push({});
        $scope.selectedReceipt = $scope.receipt.code;
        $scope.selectedInvoice = result.receipt.invoice_code;
      } else {
        toaster.pop('wanring', '', 'ไม่สามารถสร้างใบเสร็จได้');
      }
    });
    return;
    genReceipt($rootScope.dummyReceipt).then(function() {
      delete $rootScope.dummyReceipt;
    });
  } else if (typeof $stateParams.code !== 'undefined' && $stateParams.code!=='' && $stateParams.code !== null) {
    loadReceipt($stateParams.code);
  } else {
    setTimeout(function() {
      angular.element('#member').focus().select();
    },0);
  }

}]).controller('AccountingPostCtrl', ['$rootScope', '$scope', '$http', 'sysConfig', 'toaster'
    , 'helper', 'dbSvc', 'ngDialog',
    function($rootScope, $scope, $http, sysConfig, toaster, helper, dbSvc, ngDialog) {
  $scope.rvList = [];
  $scope.pageSize = 50;
  $scope.keyword = '';


  $scope.reload = function() {
    dbSvc.request('rvList', {}).then(function(result) {
      if (result.status===true) {
        console.log(result);
        $scope.rvList = angular.copy(result.rvList);
      } else {
        toaster.pop('warning', '', 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
      }
    });
    return;
  }

  var doPostToAccount = function(data) {
    console.log(data.code);
    dbSvc.request('rvByCode', {code:data.code}).then(function(result) {
      if (result.status===true) {
        var param = {
          rv_code:'RV' + data.code.substr(4,6) + data.code.substr(2,2) + data.code.substr(0,2) + data.code.substr(10,1),
          rv_date:data.p_date,
          detail:result.rv,
        }
          console.log(param);
        dbSvc.request('post', param, sysConfig.ACC_URL).then(function(result) {
          console.log(result);
          if (result.status===true) {
            toaster.pop('success', '', 'ส่งข้อมูลเข้าระบบบัญชีเรียบร้อยแล้ว');
            data.is_post='YES';

            dbSvc.request('rvUpdate', {code:data.code}).then(function() {
              toaster.pop('success', '', 'OK');
            });
          } else {
            toaster.pop('warning', '', 'ส่งข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
            return false;
          }
        });
      }
    });
    return;
  }
  $scope.viewClick = function(item) {
    var param = {
      report: 'receive_voucher',
      p_code: item.code,
      p_date: item.p_date,
      p_type: item.p_type,
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
  $scope.postClick = function(data) {
    $scope.message = 'ยืนยันการส่งข้อมูลเข้าระบบบัญชี';
    $scope.positiveButton = 'ส่งข้อมูล';
    $scope.negativeButton = 'ยกเลิก';
    $scope.positiveResponse = function() {
      doPostToAccount(data);
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

  $scope.reload();

}]).controller('ProductCtrl', ['$rootScope', '$scope', '$http', 'sysConfig', 'ngDialog', 'toaster', 'dbSvc','lovService',
    function($rootScope, $scope, $http, sysConfig, ngDialog, toaster, dbSvc, lovService) {
  $scope.siteList = [
    {code:'HQ',name:'สุรวงศ์'},
    {code:'SU',name:'สุวรรณภูมิ'},
    {code:'DM',name:'ดอนเมือง'},
  ];
  $scope.site = {ALL:true};
  $scope.product = {code:''};
  $scope.stockInList = [];
  $scope.selectedProduct = '';
  $scope.selectedAccount = '';
  $scope.stockIn = {};

  $scope.updateProductVatType = function(){
      chrome.storage.local.set({setting:$rootScope.setting});
      console.log($scope.product.vat_type);
      console.log($scope.product);
  }

  $scope.reset = function() {
    $scope.site = {ALL:true};
    $scope.product = {code:''};
    $scope.stockInList = [];
    $scope.selectedProduct = '';
    $scope.selectedAccount = '';
    $scope.stockIn = {};
    setTimeout(function() {
      angular.element('#code').focus();
    }, 0);
  };

  $scope.toggleAll = function() {
    console.log($scope.site);
    if ($scope.site.ALL) {
      $scope.siteList.forEach(function(item) {
        $scope.site[item.code] = false;
      });
    }
  }

  $scope.checkEnter = function($event) {
    console.log($event);
    if (typeof $event.keyCode != 'undefined' && $event.keyCode==13) {
      console.log($scope.selectedProduct);
    }
  }

  $scope.stockInClick = function() {
    $scope.stockInList.unshift(angular.copy($scope.stockIn));
    $scope.stockIn.prefix = '';
    $scope.stockIn.book_num = '';
    $scope.stockIn.book_qty = '';
    $scope.stockIn.start_item = '';
    $scope.stockIn.start_qty = '';
    $scope.stockIn.avail_qty = '';
    $scope.stockIn.avail_book_qty = '';
    $scope.stockIn.next_item = '';
    console.log($scope.stockInList);
    var listCheck1
    var book_prefix1;
    var book_numList1;
    if($scope.stockInList[1] == undefined){
      listCheck1 = 0;
      book_numList1 = 0;
      book_prefix1 = '';
    }else{
      listCheck1 = $scope.stockInList[1].book_qty + $scope.stockInList[1].book_num;
      book_prefix1 = $scope.stockInList[1].prefix;
      book_numList1 = $scope.stockInList[1].book_num;
    }
    var listCheck0 = $scope.stockInList[0].book_num;
    var book_prefix0 = $scope.stockInList[0].prefix;
    console.log(listCheck0);
    console.log(listCheck1)
    if(listCheck0 < listCheck1&&listCheck0 >= book_numList1&&book_prefix0==book_prefix1){
      toaster.pop('warning', '', 'เล่มนี้นำเข้าไปแล้ว');
    }
    setTimeout(function() {
      angular.element('#prefix').focus();
    },0);
  }

  $scope.updateStockIn = function() {
    var stock_item = parseInt($scope.product.stock_item);
    var book_num = parseInt($scope.stockIn.book_num);
    var book_qty = parseInt($scope.stockIn.book_qty);
    if (isNaN(stock_item) || isNaN(book_num) || isNaN(book_qty)
      || stock_item <= 0 || book_num <= 0 || book_qty <= 0) {
      console.log('not valid');
      return;
    }
    var start_item = (book_num-1) * stock_item + 1;
    var cur_start_item = parseInt($scope.stockIn.start_item);
    console.log(cur_start_item);
    if (isNaN(cur_start_item) || cur_start_item < start_item) {
      cur_start_item = start_item;
    }
    var start_qty = book_qty * stock_item - (cur_start_item-start_item);
    if (start_qty <= 0) {
      cur_start_item = start_item;
      start_qty = book_qty * stock_item - (cur_start_item-start_item);
    }
    $scope.stockIn.book_num = book_num;
    $scope.stockIn.book_qty = book_qty;
    $scope.stockIn.start_item = cur_start_item;
    $scope.stockIn.start_qty = start_qty;
    $scope.stockIn.avail_qty = start_qty;
    $scope.stockIn.avail_book_qty = book_qty;
    $scope.stockIn.next_item = cur_start_item;
    //$scope.stockIn.next_item = cur_start_item+start_qty;
  }

  var summarizeLotin = function(){
    //console.log($rootScope.station.code);
    dbSvc.request('lot_inList', {countter:$rootScope.station.code}).then(function(result) {
      if (result.status===true) {
        $scope.stockinLists = result.lotinLists;
        console.log($scope.stockinLists);
      }
    });
  }

  $scope.deleteStockInList = function(index){
    //console.log(index);
    var list = $scope.stockInList
    list.splice(index,1);
    //console.log($scope.stockInList);
  }

  var showStockIn = function(list) {
    $scope.stockInList = angular.copy(list);
  }

  var showProduct = function(product) {
    $scope.product = angular.copy(product);
    $scope.selectedProduct = product.code;
    $scope.site = {};
    var siteList = product.site_list.split(',');

    if (siteList.indexOf('ALL') >= 0) {
      $scope.site['ALL'] = true;
    } else {
      $scope.siteList.forEach(function(item) {
        if (siteList.indexOf(item.code) >= 0) {
          $scope.site[item.code] = true;
        }
      });
    }

    dbSvc.request('accountByCode', {cache:false, code:product.account_code}).then(function(result) {
      if (result.status===true) {
        $scope.selectedAccount = result.account.code + ':' + result.account.name;
      }
    });

    dbSvc.request('stockinList', {cache:false, prod_code:product.code}).then(function(result) {
      if (result.status===true) {
        $scope.stockInList = angular.copy(list);
      }
    });
  };

  var showAccount = function(account) {
  $scope.selectedAccount = account.code + ':' + account.name;
  };

  $scope.showLovProduct = function($event) {
    var filterStation = $rootScope.station.code;
      var sta = filterStation.substring(2, 4);
      $scope.stationWhere = "";
      if(sta == 'DM'){
        $scope.stationWhere = "substring(account_code,4,1) = '9'";
      }else if(sta == 'SU'){
        $scope.stationWhere = "substring(account_code,4,1) = '8'";
      }else{
        $scope.stationWhere = "substring(account_code,4,1) not in ('8','9')";
      }
    if ($event.keyCode != 32) {
      return;
    }
    console.log($scope.stationWhere);
    var param = {
      lov:'productAll',
      where_text: $scope.stationWhere,
    };
    lovService.showLov($scope, 'lov_productAll', {cache:false, where_text:$scope.stationWhere}).then(function(result) {
        $scope.product = angular.copy(result);
        $scope.selectedProduct = result.code;
        $scope.selectedAccount = result.account_code;
        console.log(result.site_list);
       var str = result.site_list;
       var stationCode = str.substr(0, 2);
       console.log(stationCode);
         if (stationCode == 'HQ') {
          $scope.site = {ALL: false, HQ: true, SU: false, DM: false};
         }else if(stationCode == 'SU'){
          $scope.site = {ALL: false, HQ: false, SU: true, DM: false};
         }else if(stationCode == 'DM'){
          $scope.site = {ALL: false, HQ: false, SU: false, DM: true};
         }else{
          $scope.site = {ALL: true, HQ: false, SU: false, DM: false};
         }
        console.log($scope.site);
        if($scope.product.is_stock == 'YES'){
          setTimeout(function() {
            angular.element('#prefix').focus();
          },0);
        }else{
          setTimeout(function() {
            angular.element('#save').focus();
          },0);
        }
    });
  };

  $scope.showLovAccount = function($event) {
    if ($event.keyCode != 32) {
      return;
    }
    lovService.showLov($scope, 'lov_account', {cache:false, where_text:$scope.stationWhere}).then(function(result) {
      $scope.selectedAccount = result.code;
      // if (result.status===true) {
      //   $scope.fields = result.fields;
      //   $scope.items = result.data;

      //   ngDialog.open({
      //     template: 'views/lov.html',
      //     controller: 'LovDialogCtrl',
      //     className: 'ngdialog-theme-default ngdialog-theme-lov',
      //     scope:$scope,
      //   }).closePromise.then(function(result) {
      //     if (typeof result.value==='undefined' || result.value==='$closeButton') {
      //       return;
      //     }
      //     $scope.product.acc_code = result.value.code;
      //     showAccount(result.value);
      //   });
      // }
      setTimeout(function() {
        angular.element('#invoice').focus();
      },0);
    });
  };

  $scope.isValid = function(){
      if($scope.selectedProduct == ''||$scope.product.name==''||$scope.selectedAccount==''||$scope.product.unit_price==''||
        $scope.product.unit==''||$scope.product.stock_item==''||$scope.product.sell_item==''||$scope.product.stock_item==''||
        $scope.product.sell_item==''){
          return false;
      }else if($scope.selectedProduct == undefined||$scope.product.name==undefined||$scope.selectedAccount==undefined||$scope.product.unit_price==undefined||
        $scope.product.unit==undefined||$scope.product.stock_item==undefined||$scope.product.sell_item==undefined||$scope.product.stock_item==undefined||
        $scope.product.sell_item==undefined){
          return false;
      }else{
          return true;
      }
  };

  $scope.isValidTable = function(){
    if($scope.product.is_stock == 'YES'){
      return true;
    }
    return false;
  }

  $scope.isListValid = function(){
    if($scope.stockIn.prefix==''||$scope.stockIn.prefix==undefined){
      return false;
    }else if($scope.stockIn.book_num==''||$scope.stockIn.book_num==undefined){
      return false;
    }else if($scope.stockIn.book_qty==''||$scope.stockIn.book_qty==undefined){
      return false;
    }else if($scope.stockIn.start_item==''||$scope.stockIn.start_item==undefined){
      return false;
    }else{
      return true;
    }
  };

  $scope.showByProd = function(){
    //console.log('show_table',$scope.selectedProduct);
    if($scope.selectedProduct == 'OF' ||
       $scope.selectedProduct == 'OF1'||
       $scope.selectedProduct == 'OF2'||
       $scope.selectedProduct == 'OFD'||
       $scope.selectedProduct == 'OFN'||
       $scope.selectedProduct == 'SH1'||
       $scope.selectedProduct == 'SH2'||
       $scope.selectedProduct == 'SHD'||
       $scope.selectedProduct == 'SHN') {
         return true;
       }
   return false;
  };

  $scope.save = function(){
    var airport = '';
    if ($scope.site.SU){
      airport = 'SU';
    }else if ($scope.site.DM){
      airport = 'DM';
    }else if ($scope.site.HQ){
      airport = 'HQ';
    }else{
      airport = 'ALL';
    }
    var param = {
      prodCode:$scope.selectedProduct,
      prodName:$scope.product.name,
      accCode:$scope.selectedAccount,
      prodPrice:$scope.product.unit_price,
      vatType:$scope.product.vat_type,
      prodUnit:$scope.product.unit,
      airPort:airport,
      isStock:$scope.product.is_stock,
      prodStockItem:$scope.product.stock_item,
      prodSellItem:$scope.product.sell_item,
      stock:$scope.stockInList,
    }
    console.log($scope.stockInList);
    dbSvc.request('stockSave', param).then(function(result) {
        if (result.status===true) {
          toaster.pop('success', '', 'บันทึกใบเสร็จเรียบร้อยแล้ว');
          summarizeLotin()
        } else {
          toaster.pop('warning', '', result.reason);
        };
        $scope.reset();
      });
  };
  summarizeLotin();
  //$scope.reset();
  setTimeout(function() {
    var $table = $('.table-list');
    $table.floatThead({
        scrollContainer: function($table){
          return $table.closest('.wrapper');
      },
      headerCellSelector:'tr.header>th:visible',
    });
    //$table.floatThead('reflow');
  },1000);
}]).controller('AccountingReportCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$q',
    'dbSvc', 'helper', 'toaster', 'ngDialog', '$http', '$filter', 'sysConfig','lovService',
    function($scope, $rootScope, $state, $stateParams, $q,
       dbSvc, helper, toaster, ngDialog, $http, $filter, sysConfig, lovService) {
////////////////////////////////////////////////////////////////////////////////
// AccountingReportCtrl
////////////////////////////////////////////////////////////////////////////////

  var today = new Date();
  var refDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()-7);

  $scope.currentTab=0;
  $scope.canPreview=true;
  $scope.canPrint=true;
  $scope.canExport=false;

  var acl = ($rootScope.sessionStaff.acl_list).split(',');
  $scope.stationList = [];
  $scope.productList = [];
  $scope.paymentProduct = {};
  dbSvc.request('productListForPayment', {}).then(function(result) { //ดึง product มาแสดงใน checkbox List ทั้งหมด
    if (result.status===true) {
      for(var i in result.products) {
        $scope.productList.push(result.products[i]);
      }
      //console.log($scope.productList);
    }
  });

  $scope.param0 = {
    date_from:$filter('date')(new Date(refDate.getFullYear(), refDate.getMonth(), 1), 'yyyy-MM-dd'),
    date_to:$filter('date')(new Date(refDate.getFullYear(), refDate.getMonth()+1, 0), 'yyyy-MM-dd'),
  };
  $scope.param0_station = {};
  $scope.param1 = {};
  $scope.param2 = {};
  $scope.param3_station = {};
  $scope.param3 = {
    stationCode:$rootScope.setting.code,
    periodDate:$filter('date')(new Date(refDate.getFullYear(), refDate.getMonth(), 1), 'yyyy-MM-dd'),
    periodType:'AM',
    report:'receipt_summary',
  };
  $scope.param3.stationPeriodType='AMPM';

  // dbSvc.request('stationList', {}).then(function(result) {
  //   var i;
  //   if (result.status===true) {
  //     $scope.stationList = angular.copy(result.stations);
  //     console.log($scope.stationList);
  //     for(i in $scope.stationList) {
  //       if ($scope.stationList[i].code==$rootScope.setting.code) {
  //         $scope.param0_station_code = $scope.stationList[i];
  //         $scope.param3_station = $scope.stationList[i];
  //         break;
  //       }
  //     }
  //   }
  // });
  var getAirport = function() {
      $scope.airportList=["DMK","BKK","HO"];
      // $scope.airportList.forEach(function(airport,j){
      //  if(airport==$rootScope.station.airport){
      //    $scope.airportbox = $scope.airportList[j];
      //    console.log($scope.airportbox);
      //    $scope.getStation();
      //  }
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
        if($scope.param3.report == 'receipt_list1' || $scope.param3.report == 'inform_list1' ||
          $scope.param3.report == 'inform_list_nopaid' || $scope.param3.report == 'sportCheckPrint' || $scope.currentTab==0){
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
            $scope.param0_station_code = $scope.stationList[i];
            $scope.param3_station = $scope.stationList[i];
          }
        });
      }
    });
  };
  getAirport();

  $scope.validAirportList = function(){
    if(($rootScope.station.code).match(/HO.*/)){
      return false;
    }else{
      return true;
    }
  }

  $scope.period_report_acl = function(){
    for(i in acl){
      if(acl[i] == 'period_close_report'){
        return true;
      }
    }
    return false;
  }

  $scope.period3_changeStation = function() {
    $scope.param3.stationCode = $scope.param3_station.code;
    if ($scope.param3_station.periodType=='DAY') {
      $scope.param3.periodType='DAY';
    } else {
      $scope.param3.periodType='AM';
    }
  }

  var doPrintOutputTax = function(preview) {
    var param = {
      report: 'output_tax',
      date_from: $scope.param0.date_from,
      date_to: $scope.param0.date_to,
      station_code: $scope.param0_station_code.code,
      vat_rate: 7,
      airport: $scope.airportbox,
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
  var doPrintPeriodReport = function(preview) {
    console.log($scope.param3);
    dbSvc.request('report', {
      airport:$scope.airportbox,
      report: $scope.param3.report,
      p_date: $scope.param3.periodDate,
      p_type: $scope.param3.periodType,
      station_code: $scope.param3.stationCode,
    }).then(function(result) {
      if (result.status === true) {
        window.open($rootScope.setting.RS_URL + '?uuid=' + result.uuid);
        return;
      } else {
        toaster.pop('warning', '', result.reason);
      }
    });
  };

  var doPrintPeriodReportSum = function(preview) {
    console.log($scope.param3);
    dbSvc.request('report', {
      report: $scope.param3.report,
      p_date_from: $scope.param3.periodDateFrom,
	    p_date_to: $scope.param3.periodDateTo,
      station_code: $scope.param3.stationCode,
    }).then(function(result) {
      if (result.status === true) {
        window.open($rootScope.setting.RS_URL + '?uuid=' + result.uuid);
        return;
      } else {
        toaster.pop('warning', '', result.reason);
      }
    });
  };

  var doPrintMeetingSign = function(preview) {
    var codeFrom = $scope.param2.codeFrom.replace(/\s+/g, '');
    var codeTo = $scope.param2.codeTo.replace(/\s+/g, '');
    if(codeFrom=='' && to=='') {
      codeFrom='00000';
      codeTo='99999';
    }
    if (codeTo=='') {
      codeTo = codeFrom;
    }
    var typeFrom, typeTo;
    if ($scope.param2.memberType=='ALL') {
      typeFrom='';
      typeTo='Z';
    } else {
      typeFrom = $scope.param2.memberType;
      typeTo = typeFrom;
    }
    console.log('type', typeFrom, typeTo);
    var range = IDBKeyRange.bound(codeFrom, codeTo, false /* include */, false /* include*/);
    dbSvc.getTableIndex('member', 'ixMemberCode', range, 'next').then(function(result) {
      if (result.length==0) {
        toaster.pop('warning', '', 'ไม่มีข้อมูลตามเงื่อนไข1');
        return;
      }
      var items = [];
      var len = result.length;
      console.log($scope.param2.memberStatus);
      for (var i = 0; i < len; i++) {
        if (($scope.param2.memberStatus=='ALL'
          || $scope.param2.memberStatus=='ACTIVE' && result[i].status
          || $scope.param2.memberStatus=='INACTIVE' && !result[i].status
          ) && (result[i].type >= typeFrom && result[i].type <= typeTo)
          ) {
          items.push({code:result[i].code,name_th:result[i].name_th,name_en:result[i].name_en,type:result[i].type});
        }
      }
      if (items.length==0) {
        toaster.pop('warning', '', 'ไม่มีข้อมูลตามเงื่อนไข2');
        return;
      }
      var data = {
        uuid: helper.newUUID(),
        report: 'meetingsign',
        param: {
          report:{
            line1:$scope.param2.line1,
            line2:$scope.param2.line2,
            status:$scope.param2.memberStatus=='ALL'?'(All Members)':($scope.param2.memberStatus=='ACTIVE'?'(Active Members)':'(Inactive Member)'),
            items:items,
          }
        },
        format: 'PDF',
        printer:'Foxit Reader PDF Printer', // 'EPSON LX-300+ /II (Copy 1)',
        numCopy:1,
      };
//      console.log(data);
      if (preview) {
        $http.post('http://localhost:3000/reports/meetingsign/pdf', data).then(function(response) {
          $scope.canPreview = true;
          var result = response.data;
          console.log(result);
          if (result.status) {
            var w = window.open('http://localhost:3000/' + result.pdf, '_blank');
          }
        });
      } else {
        $http.post('http://localhost:3000/submit', data).then(function(response) {
          $scope.canPrint = true;
        })
      }
    });
  }
  $scope.doPrint = function() {
    $scope.canPrint = false;

    if ($scope.currentTab==0) {
      doPrintOutputTax(false);
    } else if ($scope.currentTab==3) {
	  if ($scope.divRvSum == true){
		doPrintPeriodReportSum(false);
	  }else{
		doPrintPeriodReport(false);
	  }
    }
    else if ($scope.currentTab==1)
    {
      doPrintOutputPayment(true);
    }
    else if ($scope.currentTab==2)
    {
      doPrintOutputAarrearage(true);
    }
  }
  $scope.doPreview = function() {
    $scope.canPreview = false;
    if ($scope.currentTab==0) {
      doPrintOutputTax(true);
    } else if ($scope.currentTab==3) {
  	  if ($scope.divRvSum == true){
  		doPrintPeriodReportSum(true);
  	  }else{
  		doPrintPeriodReport(true);
  	  }
    }
    else if ($scope.currentTab==1)
    {
      doPrintOutputPayment(true);
    }
    else if ($scope.currentTab==2)
    {
      doPrintOutputAarrearage(true);
    }
  }
  $scope.switchTab = function(active) {
    $scope.currentTab = active;
    $scope.canExport = active==4;
    $scope.param0.date_from = "";
    $scope.param0.date_to = "";
    $scope.selectedMemberPayment = "";
    $scope.selectedMemberAarrearage = "";
    $scope.paymentProName = "";
    $scope.paymentProCode = "";

    $scope.aarrearageProName = "";
    $scope.aarrearageProCode = "";

  }

  $scope.divRvSum = false;
  $scope.divRv = true;
  $scope.divPeriod = true;

  $scope.doClickRadioRVSum = function() {
	$scope.divRvSum = true;
	$scope.divRv = false;
	$scope.divPeriod = false;
  $scope.getStation();
  }

  $scope.doClickRadio = function() {
	$scope.divRvSum = false;
	$scope.divRv = true;
	$scope.divPeriod = true;
  $scope.getStation();
  }

  $scope.isHide = function(){
    if ($scope.report == 'kingpower_list'){
      //console.log($scope.report);
      return true;
    }
    else{
      return false;
    }
  };

  $scope.isHideAllRedio = function(){
        if ($scope.report != 'inform_list1'&&$scope.report != 'inform_list_nopaid'&&$scope.report != 'sportCheckPrint'&&$scope.report != 'receipt_list1'){
            //console.log($scope.report);
            return true;
        }else{
            return false;
        }
    };

  // ฟังก์ชั่น แสดงรหัสสมาชิกหน้า Paymeny
  $scope.showLovMemberForPayment = function($event) {
	if ($event.keyCode != 32) {
      return;
    }

		lovService.showLov($scope, 'member', {cache:true}).then(function(result) {
			if (result===null) {
				angular.element('#member').focus();
				return;
			}
      console.log(result);
			$scope.selectedMemberPayment = result;
			setTimeout(function() {
				angular.element('#deadline_date').focus();
			},0);

		});

	};

  $scope.showLovMemberForPayment2 = function($event) {
  if ($event.keyCode != 32) {
      return;
    }

    lovService.showLov($scope, 'member', {cache:true}).then(function(result) {
      if (result===null) {
        angular.element('#member').focus();
        return;
      }

      $scope.selectedMemberPayment.codeTo = result.code;
      setTimeout(function() {
        angular.element('#deadline_date').focus();
      },0);

    });

  };

  // ฟังก์ชั่น แสดงรหัสสมาชิกหน้าค้างชำระ
  $scope.showLovMemberArrearage = function($event) {
	if ($event.keyCode != 32) {
      return;
    }

		lovService.showLov($scope, 'member', {cache:true}).then(function(result) {
			if (result===null) {
				angular.element('#member').focus();
				return;
			}

			//$scope.selectedMemberPayment = result;
      $scope.selectedMemberAarrearage = result;
			//console.log($scope.selectedMember.addr1);
			//$scope.address = $scope.selectedMember.addr1 + ' ' + $scope.selectedMember.addr2 + '\n' + $scope.selectedMember.province + '\n' + $scope.selectedMember.zipcode;

			setTimeout(function() {
				angular.element('#deadline_date').focus();
			},0);

		});

	};

  $scope.showLovMemberArrearage2 = function($event) {
  if ($event.keyCode != 32) {
      return;
    }

    lovService.showLov($scope, 'member', {cache:true}).then(function(result) {
      if (result===null) {
        angular.element('#member').focus();
        return;
      }
      $scope.selectedMemberAarrearage.codeTo = result.code;
      setTimeout(function() {
        angular.element('#deadline_date').focus();
      },0);

    });

  };


//ฟังก์ชั่นโชว์สินค้าสำหรับ tap การชำระเงิน
  $scope.showLovProductForPayment = function($event, rowNumber) {
    if ($event.keyCode != 32) {
      return;
    }

  lovService.showLov($scope, 'product', {cache:true}).then(function(result) {
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
    $scope.paymentProName = result.name;
    $scope.paymentProCode = result.code;
    console.log($scope.paymentProCode);
    //$scope.aarrearageProName = result.name;
    //$scope.aarrearageProCode = result.code;


  /*  $scope.updateInvoice();
    if (rowNumber == $scope.invoiceItems.length-1) {
      $scope.invoiceItems.push({});
    } */
    setTimeout(function() {
      var qtyObj = angular.element('#qty_' + rowNumber);
      qtyObj.attr({readonly:false}).focus().select();
    },0);

  });

  };




  //ฟังก์ชั่นโชว์สินค้าสำหรับ tap ค้างชำระ
  $scope.showLovProductArrearage = function($event, rowNumber) {
    if ($event.keyCode != 32) {
      return;
    }

  lovService.showLov($scope, 'product', {cache:true}).then(function(result) {
    if (result===null) {
      if (rowNumber < $scope.invoiceItems.length-1) {
        $scope.invoiceItems.splice(rowNumber, 1);
      }
      setTimeout(function() {
        angular.element('code_' + ($scope.invoiceItems.length-1)).focus().select();
      }, 0);
      return;
    }

    $scope.aarrearageProName = result.name;
    $scope.aarrearageProCode = result.code;
    console.log($scope.aarrearageProCode);

/*
    $scope.updateInvoice();
    if (rowNumber == $scope.invoiceItems.length-1) {
      $scope.invoiceItems.push({});
    }*/
    setTimeout(function() {
      var qtyObj = angular.element('#qty_' + rowNumber);
      qtyObj.attr({readonly:false}).focus().select();
    },0);

  });

  };

  var doPrintOutputPayment = function(preview) {
    $scope.paymentProductList = [];
    //$scope.paymentProductListb = [];
    angular.forEach($scope.paymentProduct, function(value, key){
      if (value==true){
        $scope.paymentProductList.push(key);
        //$scope.paymentProductListb.push(value);
      }
    });
    console.log($scope.paymentProductList);

    if ($scope.selectedMemberPayment.codeTo > $scope.selectedMemberPayment.code){
      $scope.startMemCode = $scope.selectedMemberPayment.code;
      $scope.lastMemCode = $scope.selectedMemberPayment.codeTo;
    }else if($scope.selectedMemberPayment.codeTo==''||$scope.selectedMemberPayment.codeTo==undefined||$scope.selectedMemberPayment.codeTo==null){
      $scope.startMemCode = $scope.selectedMemberPayment.code;
      $scope.lastMemCode = $scope.selectedMemberPayment.code;
    }else{
      $scope.startMemCode = $scope.selectedMemberPayment.codeTo;
      $scope.lastMemCode = $scope.selectedMemberPayment.code;
    }
    var param = {
      report: 'payment1',
      date_from: $scope.param0.date_from,
      date_to: $scope.param0.date_to,
      mem_from: $scope.startMemCode,
      mem_to: $scope.lastMemCode,
      productcode: $scope.paymentProductList,
    //  vat_rate: 7,
    };
    console.log(param);
    dbSvc.request('report', param).then(function(result) {
      if (result.status === true) {
        window.open($rootScope.setting.RS_URL + '?uuid=' + result.uuid);
        return;
      } else {
        toaster.pop('warning', '', result.reason);
      }
    });
  };


  var doPrintOutputAarrearage = function(preview) {
    if($scope.selectedMemberAarrearage.code > $scope.selectedMemberAarrearage.codeTo){
      $scope.startMemCode = $scope.selectedMemberAarrearage.codeTo;
      $scope.lastMemCode = $scope.selectedMemberAarrearage.code;
    }else if($scope.selectedMemberAarrearage.codeTo==''||$scope.selectedMemberAarrearage.codeTo==null||$scope.selectedMemberAarrearage.codeTo==undefined){
      $scope.startMemCode = $scope.selectedMemberAarrearage.code;
      $scope.lastMemCode = $scope.selectedMemberAarrearage.code;
    }else{
      $scope.startMemCode = $scope.selectedMemberAarrearage.code;
      $scope.lastMemCode = $scope.selectedMemberAarrearage.codeTo;
    }
    var param = {
      report: 'arrearage',
      date_from: $scope.param0.date_from,
      date_to: $scope.param0.date_to,
      mem_from: $scope.startMemCode,
      mem_to: $scope.lastMemCode,
      productcode: $scope.aarrearageProCode,
    //  vat_rate: 7,
    };
    console.log(param);
    dbSvc.request('report', param).then(function(result) {
      if (result.status === true) {
        window.open($rootScope.setting.RS_URL + '?uuid=' + result.uuid);
        return;
      } else {
        toaster.pop('warning', '', result.reason);
      }
    });
  };



  $scope.isValid = function()
  {

    //console.log('11111');

  if ($scope.currentTab == '0')
  {
       if ($scope.param0_station_code =='' || $scope.param0_station_code === 'undefined')
       {
         return false;
       }
  }
  else if($scope.currentTab == '1')
  {    //console.log($scope.selectedMemberPayment.code);
       if ($scope.selectedMemberPayment.code=='' || $scope.selectedMemberPayment.code==undefined)
       {
         return false;
       }

  }
  else if ($scope.currentTab == '2')
  {
       if ($scope.aarrearageProName.trim()=='' || $scope.aarrearageProName === 'undefined')
       {
          return false;
       }

       if ($scope.selectedMemberAarrearage.code =='' || $scope.selectedMemberAarrearage.code === 'undefined')
       {
         return false;
       }

  }
   return true;
 };




  // dbSvc.open().then(function() {
  //   console.log('DB OPENNED');
  //   dbSvc.getTable('market').then(function(data){
  //     angular.forEach(data, function(item){
  //       if (item.type=='INBOUND') {
  //         $scope.inboundList.push({value:item.code,label:item.name});
  //       }
  //       if (item.type=='INBOUND') {
  //         $scope.outboundList.push({value:item.code,label:item.name});
  //       }
  //     });
  //   });
  //   // load specialList
  //   dbSvc.getTable('specialist').then(function(data){
  //     angular.forEach(data, function(item){
  //       $scope.specialList.push({value:item.code,label:item.name});
  //     });
  //   });
  // });
}]);
