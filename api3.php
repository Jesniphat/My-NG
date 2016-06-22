<?php
session_start();
$_SESSION['rnd'] = rand(0,10000);

////////////////////////////////////////////////////////////
// Bootstrap
////////////////////////////////////////////////////////////

$req = explode('/', $_SERVER['PATH_INFO']);
array_shift($req);

if (count($req)==0) {
  responseJson(array(
    'status' => false,
  ));
}


////////////////////////////////////////////////////////////
// REQUEST
////////////////////////////////////////////////////////////

$input = file_get_contents('php://input');
$param = array();
try {
  $param = json_decode($input, true);
} catch (Exception $e) {
  print_r($e);
}

////////////////////////////////////////////////////////////
// ROUTING
////////////////////////////////////////////////////////////
if (!in_array($req[0], array('test', 'signIn'))) {
  // check session
  if (!isset($_SESSION['staff']) || !is_array($_SESSION['staff'])) {
    responseJson(array(
      'status' => false,
      'session' => false,
      'reason' => 'ERR_SESSION_EXPIRED',
    ));
  }
}
if ($req[0]=='ping') {
    responseJson(array('status'=>true));
}
include_once 'init.php';

try {
  switch($req[0]) {
  case 'ping':
    responseJson(array('status'=>true));
    break;
  case 'test':
    responseJson(array('status'=>true, 'message' => 'ทดสอบภาษาไทย'));
    break;
  case 'signIn':
    doSignIn($req, $param);
    break;
  case 'query':
    doQuery($param['sql']);
    break;
  case 'nextCode':
    doNextCode($param);
    break;
  case 'staffList':
    doStaffList();
    break;
  case 'staffByUuid':
    doStaffByUuid($param['uuid']);
    break;
  case 'staffSave':
    doStaffSave($param);
    break;
  case 'freelanceList':
    doFreelanceList();
    break;
  case 'freelanceByUuid':
    doFreelanceByUuid($param['uuid']);
    break;
  case 'freelanceSave':
    doFreelanceSave($param['freelance']);
    break;
  case 'memberList':
    doMemberList($param['is_active']);
    break;
  case 'memberByUuid':
    doMemberByUuid($param['uuid']);
    break;
  case 'memberByCode':
    doMemberByCode($param['code']);
    break;
  case 'memberSave':
    doMemberSave($param);
    break;
  case 'marketList':
    doMarketList();
    break;
  case 'specialList':
    doSpecialList();
    break;
  case 'productListForPayment':
    doProductListForPayment();
    break;
  case 'productList':
    doProductList($param['site']);
    break;
  case 'productByCode':
    doProductByCode($param['code']);
    break;
  case 'cardInfo':
    doCardInfo($param['code']);
    break;
  case 'cardIssue':
    doCardIssue($param);
    break;
  case 'cardTopup':
    doCardTopup($param);
    break;
  case 'cardAdjust':
    doCardAdjust($param);
    break;
  case 'receiptByCode':
    doReceiptByCode($param['code']);
    break;
  case 'invoiceByCode':
    doInvoiceByCode($param['code']);
    break;
  case 'invoiceByCodeList':
    doInvoiceByCodeList($param['codeList']);
    break;
  case 'cardAccountPeriodList':
    doCardAccountPeriodList($param);
    break;
  case 'cardAccountTxListByPeriod':
    doCardAccountTxListByPeriod($param);
    break;
  case 'cardAccountTxList':
    doCardAccountTxList($param);
    break;
  case 'couponCheck':
    doCouponCheck($param);
    break;
  case 'couponTopup':
    doCouponTopup($param);
    break;
  case 'informListByCard':
    doInformListByCard($param);
    break;
  case 'informListByCardAccount':
    doInformListByCardAccount($param);
    break;
  case 'informByRefCode':
    doInformByRefCode($param);
    break;
  case 'informList':
    doInformList($param);
    break;
  case 'informUpdate':
    doInformUpdate($param);
    break;
  case 'informCancel':
    doInformCancel($param['code']);
    break;
  case 'informByCode':
    doInformByCode($param['code']);
    break;
  case 'flightCheck':
    doFlightCheck($param);
    break;
  case 'informSave':
    doInformSave($param);
    break;
  case 'informOneStopSave':
    doInformOneStopSave($param);
    break;
  case 'countryByCode':
    doCountryByCode($param['code']);
    break;
  case 'cardUse':
    doCardUse($param);
    break;
  case 'buscallList':
    doBusCallList($param);
    break;
  case 'buscallUpdate':
    doBusCallUpdate($param);
    break;
  case 'buscallClose':
    doBusCallClose($param);
    break;
  case 'callqueueAdd':
    doCallQueueAdd($param);
    break;
  case 'callqueueList':
    doCallQueueList($param);
    break;
  case 'callqueueNext':
    doCallQueueNext($param);
    break;
  case 'receiptAddressUpdate':
    doReceiptAddressUpdate($param);
    break;
  case 'receiptSave':
    doReceiptSave($param);
    break;
  case 'receiptCancel':
    doReceiptCancel($param);
    break;
  case 'periodCheck':
    doPeriodCheck($param);
    break;
  case 'periodClose':
    doPeriodClose($param);
    break;
  case 'report':
    doReport($param);
    break;
  case 'lov':
    doLov($param);
    break;
  case 'rvList':
    doRVList($param);
    break;
  case 'rvByCode':
    doRVByCode($param['code']);
    break;
  case 'rvUpdate':
    doRVUpdate($param['code']);
    break;
  case 'stationList':
    doStationList($param);
    break;
  case 'genReceipt':
    doGenReceipt($param);
    break;
  case 'invoiceItems':
    doInvoiceItems($param);
    break;
  case 'invoiceSave':
    doInvoiceSave($param);
    break;
  case 'invoiceCancel':
  doInvoiceCancel($param);
    break;
  case 'genReceipt':
    doGenReceipt($param);
    break;
  case 'ReinvoiceSave':
    doReInvoice($param);
    break;
  case 'listInvoiceCode':
    doListInvoiceCode($param);
    break;
  case 'listInvoiceCodeReprint':
    doListInvoiceCodeReprint($param);
    break;
  case 'invoiceByCodeList':
    doInvoiceByCodeList($param);
    break;
  case 'informYearList':
    doinformYearList();
    break;
  case 'syncPos':
    doSyncPos($param);
    break;
  case 'billObj':
    doBillObj($param);
    break;
  case 'syncList':
    doSyncList($param);
    break;
  case 'syncToCloud':
    doSyncToCloud($param);
    break;
  case 'saveCode':
    doSaveCode($param);
    break;
  case 'online':
    doOnline($param);
    break;
  case 'periodSummary':
    doPeriodSummary($param);
    break;
  case 'exportKingPower':
    doExportKingPower($param);
    break;
  // case 'insertInform':
	//    doInsertInform($param);
	//     break;
  case 'countInformPax':
    doCountInformPax($param);
    break;
  case 'stockSave':
    dostockSave($param);
    break;
  case 'reportProductList':
    doReportProductList();
    break;
  case 'branchList':
    doBranchList($param);
    break;
  case 'businessTypeList':
    doBusinessTypeList();
    break;
  case 'marketList2':
    doMarketList2();
    break;
  case 'exportExcelInfo':
    doexportExcelInfo($param);
    break;
  case 'exportExcelSportCheck':
    doExportExcelSportCheck($param);
    break;
  case 'cardCancel':
    doCardCancel($param);
    break;
  case 'selectMemberOnec':
    doSelectMemberOnec($param);
    break;
  case 'loadInvoiceByCode':
    doLoadInvoiceByCode($param);
    break;
  case 'lot_inList':
    doLot_inList($param);
    break;
  case 'getDataforRefcode':
    doGetDataforRefcode($param);
    break;
  case 'checkCancelData':
    doCheckCancelData($param);
    break;
  case 'getCancelData':
    doGetCancelData($param);
    break;
  case 'buscallListCheckIn':
    doBuscallListCheckIn($param);
    break;
  case 'saveListCheckIn':
    doSaveListCheckIn($param);
    break;
  case 'getLastReceiptCode':
    doGetLastReceiptCode($param);
    break;
  case 'getNextMemCode':
    doGetNextMemCode();
    break;
  case 'exportExcelMemberData':
    doExportExcelMemberData($param);
    break;
  case 'exportExcelMeetingSign':
    doExportExcelMeetingSign($param);
    break;
  case 'exportExcelMemberRecord':
    doExportExcelMemberRecord($param);
    break;
  case 'getNextUuid':
    doGetNextUuid($param);
    break;
  case 'getNextUuidFreelance':
    doGetNextUuidFreelance($param);
    break;
  case 'getNextReceipt':
    doGetNextReceipt($param);
    break;
  case 'getNextInvoice':
    doGetNextInvoice($param);
    break;
  case 'getBuscallDoneTime':
    doGetBuscallDoneTime($param);
    break;
  case 'loadSearchInvoice':
    doLoadSearchInvoice($param);
    break;
  case 'informListSearch':
    doInformListSearch($param);
    break;
  case 'checkRealReceipt':
    doCheckRealReceipt($param);
    break;
  case 'regisCard':
    doRegisCard($param);
    break;
  case 'getAccCode':
    doGetAccCode($param);
    break;
  case 'selectServerDown':
    doSelectServerDown($param);
    break;
  }

} catch(PDOException $e) {
  responseJson(array(
    'status' => false,
    'error' =>  $e->errorInfo,
  ));
}

////////////////////////////////////////////////////////////
// CONTROLLER
////////////////////////////////////////////////////////////

function responseJson($data) {
  header('Content-Type: application/json; charset=UTF-8');
  echo json_encode($data, JSON_UNESCAPED_UNICODE);
  exit;
}

///////////////////////////////////////////////
// FOR OFFLINE MODE
///////////////////////////////////////////////
function doOnline($param) {
  global $pdo;

  $data = array(
    'station_code' => $_SESSION['period']['station_code'],
  );
  $result = _postRequest(SYNC_URL . '/online', $data);
  if (!is_array($result) || !isset($result['status']) || $result['status'] !== true) {
    responseJson(array(
      'status' => false,
      'reason' => 'ERR_POST_REQUEST',
      'result' => $result,
    ));
  }
  $stmt = $pdo->prepare("TRUNCATE TABLE _sync_item");
  $stmt->execute();
  responseJson(array(
    'status' => true,
  ));
}

function _postRequest($url, &$data) {
  $opts = array('http' =>
      array(
          'method'  => 'POST',
          'header'  => 'Content-Type: text/json',
          'content' => json_encode($data)
      )
  );
  $context  = stream_context_create($opts);
  $result = file_get_contents($url, false, $context);
  return json_decode($result, true);
}

function doSaveCode($param) {
  global $pdo;

  $out = array();
  $out[] = "('" . $_SESSION['period']['station_code'] . "', 'receipt', '" . $param['receipt'] . "')";
  $out[] = "('" . $_SESSION['period']['station_code'] . "', 'inform', '" . $param['inform'] . "')";
  $out[] = "('" . $_SESSION['period']['station_code'] . "', 'coupon_voucher', '" . $param['coupon_voucher'] . "')";
  $stmt = $pdo->prepare("INSERT INTO _code (station_code, table_name, code) VALUES " . implode(',', $out) . " ON DUPLICATE KEY UPDATE code=VALUES(code)");
  $stmt->execute();
  responseJson(array(
    'status' => true,
  ));
}

function doSyncList($param) {
  global $pdo;

  $stmt = $pdo->prepare("SELECT table_name, SUM(IF(is_sync='YES', 1, 0)) cnt, COUNT(*) total FROM _sync_item GROUP BY table_name ORDER BY table_name");
  $stmt->execute();
  responseJson(array(
    'status' => true,
    'sync_list' => $stmt->fetchAll(),
  ));
}

function doSyncToCloud($param) {
  global $pdo;

  $stmt = $pdo->prepare("SELECT code FROM _sync_item WHERE is_sync='NO' AND table_name=:table_name ORDER BY code");
  $stmt->execute(array(
    ':table_name' => $param['table_name'],
  ));

  $code_list = array();
  while ($row = $stmt->fetch()) {
    $code_list[] = $row['code'];
  }

  if (count($code_list) > 0) {
    $ok = uploadToCloud($param['table_name'], $code_list);
    if ($ok) {
      $stmt = $pdo->prepare("UPDATE _sync_item SET is_sync='YES' WHERE table_name=:table_name AND code IN ('" . implode("','", $code_list) . "')");
      $stmt->execute(array(
        ':table_name' => $param['table_name'],
      ));
    }
  } else {
    $ok = true;
  }

  $stmt = $pdo->prepare("SELECT SUM(IF(is_sync='YES', 1, 0)) cnt, COUNT(*) total FROM _sync_item WHERE table_name=:table_name");
  $stmt->execute(array(
    ':table_name' => $param['table_name'],
  ));
  $row = $stmt->fetch();

  responseJson(array(
    'status' => $ok,
    'cnt' => $row['cnt'],
    'total' => $row['total'],
  ));
}

function uploadToCloud($table_name, $code_list) {
  global $pdo;

  $data = array(
    'table_name' => $table_name,
    'data' => array(),
  );
  if ($table_name!='receipt_item') {
    $stmt = $pdo->prepare("SELECT * FROM `" . $table_name . "` WHERE code IN ('" . implode("','", $code_list) . "')");
    $stmt->execute();
    $data['data'] = $stmt->fetchAll();
  } else {
    $list = array();
    foreach ($code_list as $row) {
      list($code, $line_num) = explode(',', $row);
      $list[] = "('" . pq($code) . "'," . ($line_num+0) . ')';
    }
    $stmt = $pdo->prepare("SELECT * FROM `receipt_item` WHERE (receipt_code,line_num) IN(" . implode(',', $list) . ")");
    $stmt->execute();
    $data['data'] = $stmt->fetchAll();
  }

  $result = _postRequest(SYNC_URL . '/sync', $data);
  return $result['status']===true;
}

////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////

function doPeriodSummary($param) {
  global $pdo;

  $stmt = $pdo->prepare("SELECT SUM(IF(status='CANCEL', 0, 1)) value1
  , SUM(IF(status='CANCEL', 1, 0)) value2
  , SUM(IF(status='CANCEL', 0, total_pax)) value3
FROM inform WHERE period_code=:period_code");
  $stmt->execute(array(
    ':period_code' => $_SESSION['period']['code'],
  ));
  $row = $stmt->fetch();
  $out[] = array(
    'item' => 'inform',
    'value1' => $row['value1']+0,
    'value2' => $row['value2']+0,
    'value3' => $row['value3']+0,
  );

  $stmt = $pdo->prepare("SELECT SUM(IF(status='PAID', 1, 0)) value1
  , SUM(IF(status='CANCELLED', 1, 0)) value2
  , SUM(IF(status='PAID', total_amount, 0)) value3
FROM receipt WHERE period_code=:period_code");
  $stmt->execute(array(
    ':period_code' => $_SESSION['period']['code'],
  ));
  $row = $stmt->fetch();
  $out[] = array(
    'item' => 'receipt',
    'value1' => $row['value1']+0,
    'value2' => $row['value2']+0,
    'value3' => 1.0*$row['value3'],
  );
  responseJson(array(
    'status' => true,
    'summary' => $out,
  ));
}

function doBillObj($param) {
  global $pdo;

  $stmt = $pdo->prepare("SELECT * FROM inform WHERE code=:code");
  $stmt->execute(array(
    ':code' => $param['inform_code'],
  ));
  $inform = $stmt->fetch();
  if ($inform===false) {
    responseJson(array(
      'status' => false,
      'reason' => 'ERR_NO_INFORM',
    ));
  }
  responseJson(array(
    'status' => true,
    //'bill' => _genBillObject($inform),
    'bill' => isset($param['format']) && $param['format']=='new' ? _genBillObjectNew($inform) : _genBillObject($inform),
  ));
}

function doSyncPos($param) {
  global $pdo;

  if (!is_array($param['list'])) {
    responseJson(array(
      'status' => false,
      'reason' => 'ERR_NO_SYNC_LIST',
    ));
  }
  $result = array(
    'status' => true,
  );

  foreach ($param['list'] as $syncItem) {
    $table = $syncItem['table'];

    if ($table=='member') {
      $sql = "SELECT code, type, name_en AS name, is_active, updated_at AS ts FROM member WHERE is_active='YES' AND updated_at > :ts";
    } elseif ($table=='member_address') {
      $sql = "SELECT code, lang, mem_code, name,
CONCAT(IFNULL(addr1, ''), ' ', IFNULL(addr2, ''), ' ',
IFNULL(tambon, ''), ' ', IFNULL(amphur, ''), ' ',
IFNULL(province, ''), ' ', IFNULL(zipcode, '')) AS addr,
updated_at AS ts
FROM member_address WHERE updated_at > :ts";
    } else {
      $result[$table] = array();
      continue;
    }

    $stmt = $pdo->prepare($sql);
    $stmt->execute(array(
      ':ts' => $syncItem['ts']=='' ? '0000-00-00' : $syncItem['ts'],
    ));
    $result[$table] = $stmt->fetchAll();
  }

  responseJson($result);
}


function doGenReceipt($param) {
  global $pdo;

  $code_prefix = substr($_SESSION['period']['p_date'], 2, 2) . '-' . $_SESSION['period']['station_code'] . '-';
  $receipt = array(
    'code' => _getNextCode('receipt', 'code', $code_prefix, 6),
    'vat_rate' => 7,
    'wht_rate' => 0,
    'cash' => $param['cash']+0,
    'cheque' => 0,
    'payin' => 0,
    'checque_date' => date('Y-m-d'),
    'status' => 'PAID',
    'issue_date' => isset($param['issue_date']) ? $param['issue_date'] : $_SESSION['period']['p_date'],
    'mem_code' => isset($param['mem_code']) ? $param['mem_code'] : '',
    'issue_by' => $_SESSION['staff']['user'],
  );

  if (isset($param['invoice_code'])) {
    $invoice = _getInvoiceByCode($param['invoice_code']);
//    print_r($invoice);
    $param['mem_code'] = $invoice['mem_code'];
    $param['items'] = array();
    foreach ($invoice['items'] as $item) {
      $param['items'][] = array(
        'prod_code' => $item['prod_code'],
        'qty' => $item['qty'],
      );
    }
    $receipt['mem_code'] = $invoice['mem_code'];
    $receipt['invoice_code'] = $invoice['code'];
  }

  $member = false;
  if ($receipt['mem_code'] != '') {
    $mem = _getMemberByCode($receipt['mem_code']);
    $member = _getMemberByUuid($mem['uuid']);
    $member['addr_id'] = $invoice['addr_id'];
  }
  if ($member !== false) {
    $receipt['name'] = $member['name_th'];
  }

  $items = array();
  if (is_array($param['items'])) {
//    print_r($param['items']);
    $prod_list = array();
    foreach ($param['items'] as $item) {
      $prod_list[$item['prod_code']] = $item['qty']+0;
    }
    if (count($prod_list) > 0) {
      $stmt = $pdo->prepare("SELECT * FROM product WHERE code IN ('" . implode("','", array_keys($prod_list)) . "')");
      $stmt->execute();
      while ($row = $stmt->fetch()) {
        $items[] = array(
          'prod_code' => $row['code'],
          'detail' => $row['name'],
          'qty' => $prod_list[$row['code']],
          'price' => $row['price'],
          'unit' => $row['unit'],
          'vat_type' => $row['vat_type'],
          'account_code' => $row['account_code'],
        );
      }
    }
  }

  responseJson(array(
    'status' => true,
    'receipt' => $receipt,
    'items' => $items,
    'member' => $member,
  ));
}

function doRVList($param) {
  global $pdo;

  $stmt = $pdo->prepare("SELECT * FROM (SELECT *,CONCAT('RV',SUBSTRING(code, -7, 6),SUBSTRING(station_code,3,2),SUBSTRING(station_code,1,2),SUBSTRING(code, -1, 1)) RV1 "
  .",concat(SUBSTRING(station_code,3,2),SUBSTRING(station_code,1,2)) station_code2 "
  ."FROM period where station_code in ('01DM','02DM','01SU','02SU','01HO') ORDER BY p_date DESC, p_type, SUBSTRING(station_code,3,2), code LIMIT 1000) RV "
  ."order by p_date DESC, RV1");
  $stmt->execute();
  $list = $stmt->fetchAll();

  responseJson(array(
    'status' => true,
    'rvList' => $list,
  ));
}

function doRVUpdate($code) {
  global $pdo;

  $stmt = $pdo->prepare("UPDATE period SET is_post='YES' where code=:code");
  $stmt->execute(array(
    ':code' => $code,
  ));
  responseJson(array(
    'status' => true,
  ));
}

function doRVByCode($code) {
  global $pdo;

  $bank_account = array(
    'HQ' => array('code' => '111204', 'name' => 'เงินฝากธนาคาร S/A กสิกรไทย พัฒนพงศ์ 018-2-77615-7'),
    'HO' => array('code' => '111204', 'name' => 'เงินฝากธนาคาร S/A กสิกรไทย พัฒนพงศ์ 018-2-77615-7'),
    'SU' => array('code' => '111205', 'name' => 'เงินฝากธนาคาร S/A ทหารไทย ท่าอากาศยาน 012-2-67293-4'),
    'DM' => array('code' => '111209', 'name' => 'เงินฝากธนาคาร S/A กรุงเทพ ดอนเมือง 225-0-70703-7'),
    'NS' => array('code' => '111204', 'name' => 'เงินฝากธนาคาร S/A กสิกรไทย พัฒนพงศ์ 018-2-77615-7'),
  );
  $acc_bank = $bank_account[substr($code,2,2)]['code'];
  $acc_wht = '191002';
  $acc_vat = '211001';

  $sql = "SELECT
  if (a.code=:acc_bank, 1, if(a.code=:acc_wht, 2, 4)) seq
  , if (a.code=:acc_vat, 2, 1) drcr
  , a.code
  , a.name
  , sum(if(a.code=:acc_bank, r.total_amount, if(a.code=:acc_wht, r.wht_amount, 0))) debit
  , sum(if(a.code=:acc_vat, r.vat_amount, 0)) credit
FROM account a, receipt r
WHERE a.code IN (:acc_bank, :acc_wht, :acc_vat)
  AND r.period_code=:period_code
  AND r.status='PAID'
GROUP BY a.code

UNION ALL

SELECT
  3 seq
  , 2 drcr
  , i.account_code
  , a.name
  , 0 debit
  , sum(if(i.vat_type='EXCLUDE', i.amount, round(i.amount*100/(100+r.vat_rate), 2))) credit
FROM receipt r
  JOIN receipt_item i ON r.code=i.receipt_code
  JOIN account a ON i.account_code=a.code
WHERE
  r.period_code=:period_code
  AND r.status='PAID'
GROUP BY
  i.account_code

ORDER BY seq, code";

  $stmt = $pdo->prepare($sql);
  $stmt->execute(array(
    ':period_code' => $code,
    ':acc_bank' => $acc_bank,
    ':acc_wht' => $acc_wht,
    ':acc_vat' => $acc_vat,
  ));
  $rv_item = $stmt->fetchAll();

  responseJson(array(
    'status' => true,
    'rv' => $rv_item,
  ));
}

function doSignIn($req, $param) {
  global $pdo;

  // 1. GET STATION

  $station = _getStationByCode($param['code']);
  if (!is_array($station)) {
    responseJson(array(
      'status' => false,
      'reason' => 'ERR_STATION_NOT_FOUND',
    ));
  }

  // 2. GET STAFF


  $staff = _getStaffByUser($param['user']);

  if (!is_array($staff)) {
    responseJson(array(
      'status' => false,
      'reason' => 'ERR_USER_NOT_FOUND'
    ));
  }

  if ($staff['is_active']=='NO') {
    responseJson(array(
      'status' => false,
      'reason' => 'ERR_USER_WAS_DISABLED'
    ));
  }

  if ($staff['pass'] != $param['pass']) {
    responseJson(array(
      'status' => false,
      'reason' => 'ERR_PASS_INCORRECT',
    ));
  }

  // 3. GET PERIOD
  $period = _getActivePeriodByStationCode($param['code']);

  if (!is_array($period)) {
    _addNewPeriod($param['code'], $station['period_type']);
    $period = _getActivePeriodByStationCode($param['code']);
  }

  $_SESSION['staff'] = $staff;
  $_SESSION['period'] = $period;
  $_SESSION['station'] = $station;

  responseJson(array(
    'status' => true,
    'station' => $station,
    'staff' => $staff,
    'period' => $period,
  ));
}

function doQuery($sql) {
  global $pdo;

  try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $data = $stmt->fetchAll();

    responseJson(array(
      'status' => true,
      'data' => &$data,
    ));
  } catch(Exception $e) {
    responseJson(array(
      'status' => false,
      'reason' => 'ERR_SQL',
      'error' => $stmt->errorInfo(),
    ));
  }
}

function doNextCode($param) {

  if ($param['table']=='receipt') {
    $_SESSION['period'] = _getActivePeriodByStationCode($_SESSION['station']['code']);
    $prefix = substr($_SESSION['period']['p_date'], 2, 2) . '-' . $_SESSION['period']['station_code'] . '-';
    $fld = 'code';
    $size = 6;
  } elseif ($param['table']=='member') {
    $prefix = '';
    $fld = 'code';
    $size = 5;
  } elseif ($param['table']=='freelance') {
    $prefix = '';
    $fld = 'code';
    $size = 5;
  } elseif ($param['table']=='coupon_voucher') {
    $prefix = 'CP-' . $_SESSION['station']['code'] . '-'
      . substr($_SESSION['period']['p_date'], 2, 2) . substr($_SESSION['period']['p_date'], 5, 2);
    $fld = 'code';
    $size = 4;
  } elseif ($param['table']=='inform') {
    $prefix = 'IF-' . $_SESSION['station']['code'] . '-'
      . substr(str_replace('-', '', $_SESSION['period']['p_date']), 2)
      . ($_SESSION['period']['p_type']=='AM' ? 'M' : ($_SESSION['period']['p_type']=='PM' ? 'N' : 'D')) . '-';
    $fld = 'code';
    $size = 4;
  } else {
    responseJson(array(
      'status' => false,
      'reason' => 'ERR_NO_TABLE',
    ));
  }

  responseJson(array(
    'status' => true,
    'code' => _getNextCode($param['table'], $fld, $prefix, $size),
    'period' => $_SESSION['period'],
  ));
}

function doStaffList() {
  global $pdo;

  $stmt = $pdo->prepare("SELECT * FROM staff ORDER BY user");
  $stmt->execute();

  $staffs = $stmt->fetchAll();

  responseJson(array(
    'status' => true,
    'staffs' => &$staffs,
  ));
}

function doStaffByUuid($uuid) {
  global $pdo;

  $stmt = $pdo->prepare("SELECT * FROM staff WHERE uuid=:uuid");
  $stmt->execute(array(
    ':uuid' => $uuid,
  ));
  $staff = $stmt->fetch();

  if ($staff===false) {
    responseJson(array(
      'status' => false,
      'reason' => 'ERR_STAFF_NOT_FOUND',
    ));
  }

  $staff['acl'] = explode(',', $staff['acl_list']);
  unset($staff['acl_list']);

  responseJson(array(
    'status' => true,
    'staff' => $staff,
  ));
}

function doStaffSave($staff) {
  $fld = explode(',', 'user,pass,fullname,department,acl_list,is_active');
  $result = _saveData('staff', $fld, $staff, array('user'));
  responseJson($result);
}

function doFreelanceList() {
  global $pdo;

  $stmt = $pdo->prepare("SELECT * FROM freelance ORDER BY code");
  $stmt->execute();

  $freelances = $stmt->fetchAll();

  responseJson(array(
    'status' => true,
    'freelances' => &$freelances,
  ));
}

function doFreelanceByUuid($uuid) {
  global $pdo;

  $stmt = $pdo->prepare("SELECT * FROM freelance WHERE uuid=:uuid");
  $stmt->execute(array(
    ':uuid' => $uuid,
  ));
  $freelance = $stmt->fetch();

  if ($freelance===false) {
    responseJson(array(
      'status' => false,
      'reason' => 'ERR_FREELANCE_NOT_FOUND',
    ));
  }

  responseJson(array(
    'status' => true,
    'freelance' => $freelance,
  ));
}

function doFreelanceSave($freelance) {
  global $pdo;

  if ($freelance['code']==='') {
    $freelance['code'] = _getNextCode('freelance', 'code', '', 5);
  }

  $fld = explode(',', 'code,name_th,name_en,address,email,mobile,is_active');
  try {
    $pdo->beginTransaction();
    $result = _saveData('freelance', $fld, $freelance, array('code'));
    if ($result['status']===false) {
      throw new Exception();
    }
    // create or update card_account
    $cardAccountResult = _createOrUpdateCardAccount('F', $freelance);
    if ($result['status']===false) {
      throw new Exception();
    }
    $pdo->commit();
  } catch (Exception $e) {
    $pdo->rollback();
    print_r($e);
  }

  responseJson(array(
    'status' => true,
    'code' => $freelance['code'],
    'uuid' => $result['uuid'],
  ));
}

function doMemberList($is_active) {
  global $pdo;

  $stmt = $pdo->prepare("SELECT * FROM member WHERE is_active=:is_active ORDER BY code");
  $stmt->execute(array(
    ':is_active' => $is_active,
  ));

  $members = $stmt->fetchAll();

  responseJson(array(
    'status' => true,
    'members' => &$members,
  ));
}

function doMemberByUuid($uuid) {
  $member = _getMemberByUuid($uuid);
  if ($member===false) {
    responseJson(array(
      'status' => false,
      'reason' => 'ERR_MEMBER_NOT_FOUND',
    ));
  }
  responseJson(array(
    'status' => true,
    'member' => $member,
  ));
}

function doMemberByCode($code) {
  global $pdo;

  $member = _getMemberByCode($code);
  if ($member===false) {
    responseJson(array(
      'status' => false,
      'reason' => 'ERR_MEMBER_NOT_FOUND',
    ));
  }

  $uuid = $member['uuid'];
  doMemberByUuid($uuid);
}

function doMemberSave($data) {
  global $pdo;

  $member = $data['member'];
  $contacts = $member['contacts'];
  $addresses = $member['addresses'];
  $contact_uuid = $data['contact_uuid'];
  $address_uuid = $data['address_uuid'];
  $member['specialist'] = implode(',', $member['specialist']);
  $member['market_inbound'] = implode(',', $member['market_inbound']);
  $member['market_outbound'] = implode(',', $member['market_outbound']);

  if ($member['uuid']===''||!isset($member['uuid'])) {
    $checkCode = $member['code'];
    $member['code'] = _getNextCode('member', 'code', '', 5);
    if ($checkCode <> $member['code']){
      $checkCodeResult = 'รหัสสมาชิก '.$checkCode.' ได้มีการใช้งานไปแล้ว ท่านได้รหัสสมาชิกใหม่เป็น '.$member['code'];
    } else {
      $checkCodeResult = '';
    }
  }
  $member['issue_by'] = $_SESSION['staff']['user'];
  $fld = explode(',', 'code,name_th,name_en,tel,fax,email,website,tax_id,tat_id,registrar_id,capital,year_start,remark,specialist,market_inbound,market_outbound,is_active,start_date,end_date,end_date2,domestic,type,issue_by');
  $fld_contact = explode(',', 'mem_code,seq,name_th,name_en,position,nation');
  $fld_addr = explode(',', 'mem_code,code,lang,name,addr1,addr2,tambon,amphur,province,zipcode,tel,fax,contactaddress_en,contactaddress_th,invoice_addr');

  try {
    $pdo->beginTransaction();
    if($member['uuid'] != ""){
      $end = "SELECT end_date FROM member WHERE uuid=:uuid";
      $stmt = $pdo->prepare($end);
      $stmt->execute(array(
        ':uuid' => $member['uuid'],
      ));
      $end_date = $stmt->fetchColumn();

      $end = "SELECT is_active FROM member WHERE uuid=:uuid";
      $stmt = $pdo->prepare($end);
      $stmt->execute(array(
        ':uuid' => $member['uuid'],
      ));
      $active_status = $stmt->fetchColumn();

      if($end_date != $member['end_date']){
        $member['end_date2'] = $end_date;
      }
      if($end_date == $member['end_date'] && $member['is_active'] == 'YES' && $active_status == 'NO'){
        $member['end_date2'] = $end_date;
      }
    }else{
      $member['end_date2'] = $member['end_date'];
    }

    $result = _saveData('member', $fld, $member, array('code'));
    if ($result['status']===false) {
      throw new Exception(print_r($result, true));
    }
    $uuid = $result['uuid'];
    // create or update card_account
    $cardAccountResult = _createOrUpdateCardAccount('M', $member);
    if ($result['status']===false) {
      throw new Exception();
    }
    foreach ($contacts as $contact) {
      if($contact['mem_code']==''||!isset($contact['mem_code'])){
        $contact['mem_code'] = $member['code'];
      }
      if($contact['nation'] == '') {
        $contact['nation'] = 'N/A';
      }
      $result = _saveData('member_contact', $fld_contact, $contact, array('mem_code', 'seq'));
      if ($result['status']===false) {
        throw new Exception();
      }
    }

    foreach ($addresses as $address) {
      if($address['mem_code']==''||!isset($address['mem_code'])){
        $address['mem_code'] = $member['code'];
      }
      //print_r($address);
      $result = _saveData('member_address', $fld_addr, $address, array('mem_code', 'code', 'lang'));
      if ($result['status']===false) {
        throw new Exception(print_r($result, true));
      }
    }

    _deleteByUuid('member_contact', $contact_uuid);
    _deleteByUuid('member_address', $address_uuid);

    $pdo->commit();
  } catch (Exception $e) {
    $pdo->rollback();
    print_r($e);
  }

  responseJson(array(
    'status' => true,
    'code' => $member['code'],
    'uuid' => $uuid,
    'checkCode' => ($checkCodeResult==undefined||$checkCodeResult==null||$checkCodeResult=='') ? 'x' : $checkCodeResult,
  ));
}

function doMarketList() {
  global $pdo;

  $stmt = $pdo->prepare("SELECT * FROM market ORDER BY code");
  $stmt->execute();

  $markets = $stmt->fetchAll();

  responseJson(array(
    'status' => true,
    'markets' => &$markets,
  ));
}

function doSpecialList() {
  global $pdo;

  $stmt = $pdo->prepare("SELECT * FROM specialist ORDER BY code");
  $stmt->execute();
  $specials = $stmt->fetchAll();

  responseJson(array(
    'status' => true,
    'specials' => &$specials,
  ));
}

function doProductListForPayment() {
  global $pdo;
  $stmt = $pdo->prepare("SELECT *,concat(code,':',name) codeName FROM product WHERE name<>'' ORDER BY code");
  $stmt->execute();
  $products = $stmt->fetchAll();

  responseJson(array(
    'status' => true,
    'products' => &$products,
  ));
}

function doProductList($site='ALL') {
  global $pdo;

  $cond = '';
  if ($site!='ALL') {
    $cond = " WHERE (site_list='ALL' OR concat(',',site_list,',') LIKE concat('%,',:site,',%')";
  }
  $stmt = $pdo->prepare("SELECT * FROM product" . $cond . " ORDER BY code");
  if ($cond=='') {
    $stmt->execute();
  } else {
    $stmt->execute(array(
      ':site' => $site,
    ));
  }

  $products = $stmt->fetchAll();

  responseJson(array(
    'status' => true,
    'products' => &$products,
  ));
}

function doProductByCode($code) {
  global $pdo;

  $stmt = $pdo->prepare("SELECT * FROM product WHERE code=:code");
  $stmt->execute(array(
    ':code' => $code,
  ));
  $product = $stmt->fetch();
  if ($product===false) {
    responseJson(array(
      'status' => false,
      'reason' => 'ERR_PRODUCT_NOT_FOUND',
    ));
  }
  responseJson(array(
    'status' => true,
    'product' => $product,
  ));
}

function doCardInfo($code) {
  global $pdo;

  $stmt = $pdo->prepare("SELECT * FROM carddb WHERE code=:code");
  $stmt->execute(array(
    ':code' => $code,
  ));
  $carddb = $stmt->fetch();

  if ($carddb===false) {
    responseJson(array(
      'status' => false,
      'reason' => 'ERR_NOT_ATTA_CARD',
    ));
  }

  if ($carddb['is_active']=='NO') {
    responseJson(array(
      'status' => true,
      'carddb' => $carddb,
    ));
  }

  $stmt = $pdo->prepare("SELECT * FROM card_account WHERE code=:code");
  $stmt->execute(array(
    ':code' => $carddb['acc_code'],
  ));
  $card_account = $stmt->fetch();

  $member = null;
  $freelance = null;

  if ($card_account['type']=='CORPORATE') {
    $stmt = $pdo->prepare("SELECT * FROM member WHERE code=:code");
    $stmt->execute(array(
      ':code' => $card_account['mem_code'],
    ));
    $member = $stmt->fetch();
    $stmt = $pdo->prepare("SELECT * FROM member_address WHERE mem_code=:mem_code ORDER BY code, lang");
    $stmt->execute(array(
      ':mem_code' => $member['code'],
    ));
    $member['addresses'] = $stmt->fetchAll();
  } elseif ($card_account['type']=='FREELANCE') {
    $stmt = $pdo->prepare("SELECT * FROM freelance WHERE code=:code");
    $stmt->execute(array(
      ':code' => $card_account['mem_code'],
    ));
    $freelance = $stmt->fetch();
  }

  responseJson(array(
    'status' => true,
    'carddb' => $carddb,
    'card_account' => $card_account,
    'member' => $member,
    'freelance' => $freelance,
  ));
}

function doCardIssue($param) {
  global $pdo;

  $receipt_code = '';

  // check valid code
  $stmt = $pdo->prepare("SELECT * FROM carddb WHERE code=:code");
  $stmt->execute(array(
    ':code' => $param['card_code'],
  ));
  $carddb = $stmt->fetch();
  if ($carddb===false) {
    responseJson(array(
      'status' => false,
      'reason' => 'ERR_CARDDB_NOT_FOUND',
    ));
  }

  $stmt = $pdo->prepare("SELECT * FROM card_account WHERE code=:code");
  $stmt->execute(array(
    ':code' => $param['acc_code'],
  ));
  $card_account = $stmt->fetch();
  if ($card_account===false) {
    responseJson(array(
      'status' => false,
      'reason' => 'ERR_CARD_ACCOUNT_NOT_FOUND',
    ));
  }

  $stmt = $pdo->prepare("SELECT * FROM member WHERE code=:code");
  $stmt->execute(array(
    ':code' => $param['mem_code'],
  ));
  $member = $stmt->fetch();
  if ($member===false) {
    responseJson(array(
      'status' => false,
      'reason' => 'ERR_MEMBER_NOT_FOUND',
    ));
  }

  // update period
  $_SESSION['period'] = _getActivePeriodByStationCode($_SESSION['station']['code']);

  try {
    $pdo->beginTransaction();

    // 1. UPDATE carddb
    $stmt = $pdo->prepare("UPDATE carddb SET is_active='YES', acc_code=:acc_code, mem_code=:mem_code, "
      . "holder_name=:holder_name "
      . "WHERE code=:code");
    $stmt->execute(array(
      ':acc_code' => $param['acc_code'],
      ':mem_code' => $param['mem_code'],
      ':holder_name' => $param['holder_name'],
      ':code' => $param['card_code'],
    ));

    // 2. create card_account_tx
    // $prefix = $param['acc_code'] . '-'
    //   . substr($_SESSION['period']['p_date'], 2,2) . substr($_SESSION['period']['p_date'], 5,2);
    // $tx_code = _getNextCode('card_account_tx', 'code', $prefix, 6);
    $prefix = $_SESSION['period']['code'] . '-';
    $tx_code = _getNextCode('card_account_tx', 'code', $prefix, 6);

    $stmt = $pdo->prepare("INSERT INTO card_account_tx SET code=:tx_code, period_code=:period_code, "
      . "acc_code=:acc_code, tx_date=NOW(), tx_type='ISSUE', card_code=:card_code, staff=:staff, "
      . "ref1_type='', ref1_code='', ref2_type='', ref2_code='', "
      . "pax=0, balance_pax=:balance_pax, remark=:remark, uuid=upper(uuid())");

    $stmt->execute(array(
      ':tx_code' => $tx_code,
      ':period_code' => $_SESSION['period']['code'],
      ':acc_code' => $card_account['code'],
      ':card_code' => $carddb['code'],
      ':staff' => $_SESSION['staff']['user'],
      ':balance_pax' => $card_account['balance'],
      ':remark' => 'ISSUE NEW CARD',
    ));

    // 3. create receipt and update card No.
    $receipt_code = _createReceipt(array(
      'mem_code' => $param['mem_code'],
      'address' => $param['address'],
      'cheque' => 0,
      'payin' => 0,
      'items' => array(
        array('prod_code' => 'CARD', 'qty' => 1),
      ),
      'remark' => 'REF# ' . $tx_code,
    ));

    $stmt = $pdo->prepare("UPDATE receipt_item SET detail=CONCAT(detail,:card_no) WHERE receipt_code=:receipt_code");
    $stmt->execute(array(
      ':card_no' => $param['cardNo'],
      ':receipt_code' => $receipt_code,
    ));


    // 4. update card_account_tx with receipt_code
    $stmt = $pdo->prepare("UPDATE card_account_tx SET ref1_type='receipt_code', ref1_code=:ref1_code"
      . " WHERE code=:tx_code");
    $stmt->execute(array(
      ':ref1_code' => $receipt_code,
      ':tx_code' => $tx_code,
    ));

    $pdo->commit();

    responseJson(array(
      'status' => true,
      'receipt_code' => $receipt_code,
      'period' => $_SESSION['period'],
    ));
  } catch (PDOException $e) {
    $pdo->rollback();
    responseJson(array(
      'status' => false,
      'reason' => 'ERR_UNKNOWN',
      'error' => $e->errorInfo,
    ));
  } catch (Exception $e) {
    $pdo->rollback();
    responseJson(array(
      'status' => false,
      'reason' => 'ERR_UNKNOWN',
      'msg' => $e->getMessage(),
    ));
  }
} //doCardIssue

function doCardTopup($param) {
  global $pdo;

  $receipt_code = '';

  // check valid code
  $stmt = $pdo->prepare("SELECT * FROM carddb WHERE code=:code");
  $stmt->execute(array(
    ':code' => $param['card_code'],
  ));
  $carddb = $stmt->fetch();
  if ($carddb===false) {
    responseJson(array(
      'status' => false,
      'reason' => 'ERR_CARDDB_NOT_FOUND',
    ));
  }

  $stmt = $pdo->prepare("SELECT * FROM card_account WHERE code=:code");
  $stmt->execute(array(
    ':code' => $param['acc_code'],
  ));
  $card_account = $stmt->fetch();
  if ($card_account===false) {
    responseJson(array(
      'status' => false,
      'reason' => 'ERR_CARD_ACCOUNT_NOT_FOUND',
    ));
  }

  $stmt = $pdo->prepare("SELECT * FROM member WHERE code=:code");
  $stmt->execute(array(
    ':code' => $param['mem_code'],
  ));
  $member = $stmt->fetch();
  if ($member===false) {
    responseJson(array(
      'status' => false,
      'reason' => 'ERR_MEMBER_NOT_FOUND',
    ));
  }

  if(($param['pax']+0) == 0 || ($param['pax']+0) == '0'){
    responseJson(array(
      'status' => false,
      'reason' => 'ERR_PAX_0',
    ));
    return;
  }


  // update period
  $_SESSION['period'] = _getActivePeriodByStationCode($_SESSION['station']['code']);

  try {
    $pdo->beginTransaction();

    // 1. adjust balance
    $stmt = $pdo->prepare("UPDATE card_account SET balance = balance + :pax WHERE code=:acc_code");
    $stmt->execute(array(
      ':acc_code' => $param['acc_code'],
      ':pax' => $param['pax']+0,
    ));

    // 2. get new balance
    $stmt = $pdo->prepare("SELECT balance FROM card_account WHERE code=:acc_code");
    $stmt->execute(array(
      ':acc_code' => $param['acc_code'],
    ));
    $new_balance = $stmt->fetchColumn()+0;

    // 3. create card_account_tx
    // $prefix = $param['acc_code'] . '-'
    //   . substr($_SESSION['period']['p_date'], 2,2) . substr($_SESSION['period']['p_date'], 5,2);
    // $tx_code = _getNextCode('card_account_tx', 'code', $prefix, 6);
    $prefix = $_SESSION['period']['code'] . '-';
    $tx_code = _getNextCode('card_account_tx', 'code', $prefix, 6);

    $stmt = $pdo->prepare("INSERT INTO card_account_tx SET code=:tx_code, period_code=:period_code, "
      . "acc_code=:acc_code, tx_date=NOW(), tx_type='TOPUP', card_code=:card_code, staff=:staff, "
      . "ref1_type='', ref1_code='', ref2_type='', ref2_code='', "
      . "pax=:pax, balance_pax=:balance_pax, remark=:remark, uuid=upper(uuid())");

    $stmt->execute(array(
      ':tx_code' => $tx_code,
      ':period_code' => $_SESSION['period']['code'],
      ':acc_code' => $card_account['code'],
      ':card_code' => $carddb['code'],
      ':staff' => $_SESSION['staff']['user'],
      ':pax' => $param['pax'],
      ':balance_pax' => $new_balance,
      ':remark' => 'TOP UP',
    ));

    // 4. create receipt
    $receipt_code = _createReceipt(array(
      'mem_code' => $param['mem_code'],
      'address' => $param['address'],
      'cheque' => $param['payment_type']=='CHEQUE' ? $param['amount']+0 : 0,
      'payin' => $param['payment_type']=='PAYIN' ? $param['amount']+0 : 0,
      'items' => array(
        array('prod_code' => 'TOPUP', 'qty' => $param['pax']+0),
      ),
      'remark' => 'REF# ' . $tx_code,
    ));

    // 5. update card_account_tx with receipt_code
    $stmt = $pdo->prepare("UPDATE card_account_tx SET ref1_type='receipt_code', ref1_code=:ref1_code"
      . " WHERE code=:tx_code");
    $stmt->execute(array(
      ':ref1_code' => $receipt_code,
      ':tx_code' => $tx_code,
    ));

    $pdo->commit();

    responseJson(array(
      'status' => true,
      'receipt_code' => $receipt_code,
      'period' => $_SESSION['period'],
      'receipt' => _genReceiptObject($receipt_code),
    ));
  } catch (PDOException $e) {
    $pdo->rollback();
    responseJson(array(
      'status' => false,
      'reason' => 'ERR_UNKNOWN',
      'error' => $e->errorInfo,
    ));
  } catch (Exception $e) {
    $pdo->rollback();
    responseJson(array(
      'status' => false,
      'reason' => 'ERR_UNKNOWN',
      'msg' => $e->getMessage(),
    ));
  }
}

function doCardAdjust($param) {
  global $pdo;

  $receipt_code = '';

  // check valid code
  $stmt = $pdo->prepare("SELECT * FROM carddb WHERE code=:code");
  $stmt->execute(array(
    ':code' => $param['card_code'],
  ));
  $carddb = $stmt->fetch();
  if ($carddb===false) {
    responseJson(array(
      'status' => false,
      'reason' => 'ERR_CARDDB_NOT_FOUND',
    ));
  }

  $stmt = $pdo->prepare("SELECT * FROM card_account WHERE code=:code");
  $stmt->execute(array(
    ':code' => $param['acc_code'],
  ));
  $card_account = $stmt->fetch();
  if ($card_account===false) {
    responseJson(array(
      'status' => false,
      'reason' => 'ERR_CARD_ACCOUNT_NOT_FOUND',
    ));
  }

   // update period
  $_SESSION['period'] = _getActivePeriodByStationCode($_SESSION['station']['code']);

  try {
    $pdo->beginTransaction();
    // 1. adjust balance
    $stmt = $pdo->prepare("UPDATE card_account SET balance = balance " . ($param['type']=='PLUS'?'+':'-') . " :pax WHERE code=:acc_code");
    $stmt->execute(array(
      ':acc_code' => $param['acc_code'],
      ':pax' => $param['pax']+0,
    ));

    // 2. get new balance
    $stmt = $pdo->prepare("SELECT balance FROM card_account WHERE code=:acc_code");
    $stmt->execute(array(
      ':acc_code' => $param['acc_code'],
    ));
    $new_balance = $stmt->fetchColumn()+0;

    // 3. create card_account_tx
    // $prefix = $param['acc_code'] . '-'
    //   . substr($_SESSION['period']['p_date'], 2,2) . substr($_SESSION['period']['p_date'], 5,2);
    // $tx_code = _getNextCode('card_account_tx', 'code', $prefix, 6);
    $prefix = $_SESSION['period']['code'] . '-';
    $tx_code = _getNextCode('card_account_tx', 'code', $prefix, 6);

    $stmt = $pdo->prepare("INSERT INTO card_account_tx SET code=:tx_code, period_code=:period_code, "
      . "acc_code=:acc_code, tx_date=NOW(), tx_type='ADJUST', card_code=:card_code, staff=:staff, "
      . "ref1_type='', ref1_code='', ref2_type='', ref2_code='', "
      . "pax=:pax, balance_pax=:balance_pax, remark=:remark, uuid=upper(uuid())");

    $stmt->execute(array(
      ':tx_code' => $tx_code,
      ':period_code' => $_SESSION['period']['code'],
      ':acc_code' => $card_account['code'],
      ':card_code' => $carddb['code'],
      ':staff' => $_SESSION['staff']['user'],
      ':pax' => ($param['type']=='PLUS'?1:-1) * $param['pax'],
      ':balance_pax' => $new_balance,
      ':remark' => 'ADJUST',
    ));


    $pdo->commit();

    responseJson(array(
      'status' => true,
      'tx_code' => $tx_code,
      'period' => $_SESSION['period'],
    ));
  } catch (PDOException $e) {
    $pdo->rollback();
    responseJson(array(
      'status' => false,
      'reason' => 'ERR_UNKNOWN',
      'error' => $e->errorInfo,
    ));
  } catch (Exception $e) {
    $pdo->rollback();
    responseJson(array(
      'status' => false,
      'reason' => 'ERR_UNKNOWN',
      'msg' => $e->getMessage(),
    ));
  }
}

function doReceiptByCode($code) {
  global $pdo;

  //$stmt = $pdo->prepare("SELECT * FROM receipt WHERE code=:code");
  $stmt = $pdo->prepare("SELECT r.id, r.code, r.period_code, r.mem_code, r.tax_id tt, m.tax_id, r.branch_code, r.branch_name, r.inv_code, r.issue_date, r.name rname, m.name_th name, r.status,
r.issue_by, r.cancel_by, r.cancel_reason, r.remark, r.amount, r.vat_rate, r.vat_amount, r.wht_rate, r.wht_amount, r.total_amount ee, r.amount+r.vat_amount as total_amount, r.cash,
r.cheque, r.payin, r.cheque_bank, r.cheque_branch, r.cheque_number, r.cheque_date, r.is_post, r.uuid, r.created_at, r.created_by, r.updated_at,
r.updated_by,r.addr addr FROM receipt r inner join member_address ma on r.mem_code = ma.mem_code
inner join member m on r.mem_code=m.code
where ma.lang = 'TH' and r.code=:code");
  $stmt->execute(array(
    ':code' => $code,
  ));
  $receipt = $stmt->fetch();
  if ($receipt===false) {
    responseJson(array(
      'status' => false,
      'reason' => 'ERR_RECEIPT_NOT_FOUND',
    ));
  }
//SELECT * FROM receipt_item WHERE receipt_code=:code ORDER BY line_num
  $sql = "select distinct *, case when (prod_code='OFD' or prod_code='OF' or prod_code='OF1' or prod_code='OF2' or prod_code='SHD' or prod_code='SH1' or prod_code='SH2') "
  ."then price*qty else amount1 end as amount "
  ."from(SELECT ri.receipt_code,ri.prod_code,ri.account_code "
  .",concat(ri.detail,'',IFNULL(concat('เล่มที่',ceil(lt.start_item/50),'-',ceil(((lt.start_item+lt.out_qty)-1)/50) "
  .",'เลขที่',IFNULL(li.prefix_code,''),IFNULL(lc.prefix_code,''),LPAD(lt.start_item, 5, '0'),'-' "
  .",IFNULL(li.prefix_code,''),IFNULL(lc.prefix_code,''),(LPAD((lt.start_item+lt.out_qty)-1, 5, '0'))),'')) as detail "
  .",ri.price,lt.out_qty ,ri.qty qty_receipt "
  .",case when (ri.prod_code='OFD' or ri.prod_code='OF' or ri.prod_code='OF1' or ri.prod_code='OF2') then FLOOR(lt.out_qty/50) "
  ."when (ri.prod_code='SHD' or ri.prod_code='SH1' or ri.prod_code='SH2') then lt.out_qty else ri.qty end qty "
  .",ri.unit,ri.amount as amount1,ri.vat_type,ri.created_at,ri.updated_at "
  .", IFNULL(concat('เล่มที่',ceil(lt.start_item/50),'-',ceil(((lt.start_item+lt.out_qty)-1)/50),'เลขที่' "
  .",IFNULL(li.prefix_code,''),IFNULL(lc.prefix_code,''),LPAD(lt.start_item, 5, '0'),'-' "
  .",IFNULL(li.prefix_code,''),IFNULL(lc.prefix_code,''),(LPAD((lt.start_item+lt.out_qty)-1, 5, '0'))),'') ref_code "
  ."FROM receipt_item ri left join lot_out lt on ri.receipt_code=lt.receipt_code and ri.prod_code=lt.prod_code and ri.qty= case when (ri.prod_code='OFD' or ri.prod_code='OF' or ri.prod_code='OF1' or ri.prod_code='OF2' or ri.prod_code='OFN') "
  ."then lt.out_qty/50 else lt.out_qty end "
  ."left join lot_in li on lt.lot_inid=li.id and lt.prod_code=li.prod_code "
  ."left join lot_cancel lc on lt.lot_inid=lc.real_id and lt.prod_code=lc.prod_code "
  ."WHERE ri.receipt_code = :code "
  ."ORDER BY ri.line_num) rec_it";
  $stmt = $pdo->prepare($sql);
  $stmt->execute(array(
    ':code' => $code,
  ));
  $receipt['items'] = $stmt->fetchAll();

  responseJson(array(
    'status' => true,
    'receipt' => $receipt,
  ));
}

function doInvoiceByCode($code) {
  global $pdo;

  $stmt = $pdo->prepare("SELECT * FROM invoice WHERE code=:code");
  $stmt->execute(array(
    ':code' => $code,
  ));
  $invoice = $stmt->fetch();
  if ($invoice===false) {
    responseJson(array(
      'status' => false,
      'reason' => 'ERR_RECEIPT_NOT_FOUND',
    ));
  }

  $stmt = $pdo->prepare("SELECT * FROM invoice_item WHERE invoice_code=:code ORDER BY line_num");
  $stmt->execute(array(
    ':code' => $code,
  ));
  $invoice['items'] = $stmt->fetchAll();

  responseJson(array(
    'status' => true,
    'invoice' => $invoice,
  ));
}
function doInvoiceByCodeList($param) {
  global $pdo;//$codeList = $param['codeList'];
  $codeList = $param;
  if (!is_array($codeList)) {
    $codeList = array($codeList);
  }
  $stmt = $pdo->prepare("select i.id,i.code,i.period_code,i.mem_code,i.branch_code,i.branch_name,i.receipt_code, "
    ."i.issue_date,i.reissue_date,i.num_reissue,i.deadline_date,ma.lang, "
    ."case when i.status='PAID' then i.name when (i.status='WAIT' and ma.lang='TH') then m.name_th when (i.status='WAIT' and ma.lang='EN') then m.name_en end as name, "
    ."i.addr,i.status,i.issue_by,i.cancel_by, "
    ."i.cancel_reason,i.remark,i.amount,i.vat_rate,i.vat_amount,i.wht_rate,i.wht_amount,i.total_amount,i.uuid, "
    ."i.created_at,i.created_by,i.updated_at,i.updated_by,m.tax_id "
    ."from invoice i left join member m on i.mem_code=m.code left join member_address ma ON i.addr_id = ma.id "
    ."WHERE i.code IN ('" . implode("','", $codeList) . "') order by i.code");
  $stmt->execute();
  $invoices = $stmt->fetchAll();
  if ($invoices===false || count($invoices)===0) {
    responseJson(array(
      'status' => false,
      'reason' => 'ERR_INVOiCE_NOT_FOUND',
    ));
  }

  $stmt = $pdo->prepare("SELECT * FROM invoice_item WHERE invoice_code IN ('" . implode("','", $codeList) . "') ORDER BY invoice_code, line_num");
  $stmt->execute();
  while ($row = $stmt->fetch()) {
    $items[$row['invoice_code']][] = $row;
  }
  foreach ($invoices as $i => $invoice) {
    $invoices[$i]['items'] = $items[$invoice['code']];
  }

  responseJson(array(
    'status' => true,
    'invoices' => $invoices,
  ));
}
function doCardAccountPeriodList($param) {
  global $pdo;

  $stmt = $pdo->prepare("SELECT distinct period_code FROM card_account_tx WHERE acc_code=:acc_code "
    . "ORDER BY period_code DESC LIMIT 30");
  $stmt->execute(array(
    ':acc_code' => $param['acc_code'],
  ));

  $out = array();
  while ($row = $stmt->fetch()) {
    $out[] = $row['period_code'];
  }
  responseJson(array(
    'status' => true,
    'periods' => $out,
  ));
}
function doCardAccountTxListByPeriod($param) {
  global $pdo;

  $stmt = $pdo->prepare("SELECT *,CASE WHEN tx_type='PAID' THEN CONCAT('-',FLOOR(pax)) ELSE FLOOR(pax) END AS new_pax "
    . "FROM card_account_tx WHERE acc_code=:acc_code "
    . "AND period_code=:period_code "
    . "ORDER BY tx_date DESC" . ($param['limit']+0==0?'': ' LIMIT ' . ($param['limit']+0)));
  $stmt->execute(array(
    ':acc_code' => $param['acc_code'],
    ':period_code' => $param['period_code'],
  ));

  responseJson(array(
    'status' => true,
    'card_account_tx' => $stmt->fetchAll(),
  ));
}
function doCardAccountTxList($param) {
  global $pdo;

  $stmt = $pdo->prepare("SELECT * FROM card_account_tx WHERE acc_code=:acc_code "
    . "ORDER BY tx_date DESC" . ($param['limit']+0==0?'': ' LIMIT ' . ($param['limit']+0)));
  $stmt->execute(array(
    ':acc_code' => $param['acc_code'],
  ));

  responseJson(array(
    'status' => true,
    'card_account_tx' => $stmt->fetchAll(),
  ));
}

function doCouponCheck($param) {
  global $pdo;

  $stmt = $pdo->prepare("SELECT code FROM coupon_used WHERE code BETWEEN :from AND :to");
  $stmt->execute(array(
    ':from' => $param['from'],
    ':to' => $param['to'],
  ));

  $coupons = array();
  while($code = $stmt->fetchColumn()) {
    $coupons[] = $code;
  }

  responseJson(array(
    'status' => true,
    'coupons' => $coupons,
  ));
}

function doCouponTopup($param) {
  global $pdo;

  // check valid code
  $stmt = $pdo->prepare("SELECT * FROM carddb WHERE code=:code");
  $stmt->execute(array(
    ':code' => $param['card_code'],
  ));
  $carddb = $stmt->fetch();
  if ($carddb===false) {
    responseJson(array(
      'status' => false,
      'reason' => 'ERR_CARDDB_NOT_FOUND',
    ));
  }

  $stmt = $pdo->prepare("SELECT * FROM card_account WHERE code=:code");
  $stmt->execute(array(
    ':code' => $param['acc_code'],
  ));
  $card_account = $stmt->fetch();
  if ($card_account===false) {
    responseJson(array(
      'status' => false,
      'reason' => 'ERR_CARD_ACCOUNT_NOT_FOUND',
    ));
  }

  // update period
  $_SESSION['period'] = _getActivePeriodByStationCode($_SESSION['station']['code']);

  try {
    $pdo->beginTransaction();

    $prefix = 'CP-' . $_SESSION['station']['code'] . '-'
      . substr($_SESSION['period']['p_date'], 2, 2) . substr($_SESSION['period']['p_date'], 5, 2);
    $voucher_code = _getNextCode('coupon_voucher', 'code', $prefix, 4);


    // 1. add coupon_used
    $stmt = $pdo->prepare("INSERT INTO coupon_used SET code=:code, voucher_code=:voucher_code, pax=:qty, uuid=upper(uuid())");

    $totalPax = 0;
    $detail = array();
    foreach ($param['coupons'] as $coupon) {
      $detail[] = $coupon['from'] . ' - '  . $coupon['to'];

      $from = substr($coupon['from'], -6) + 0;
      $to = substr($coupon['to'], -6) + 0;

      if ($to < $from) {
        $tmp = $from;
        $from = $to;
        $to = $tmp;
      }

      $qty = strlen($coupon['from'])==12 ? 10 : 1;
      $totalPax += ($to - $from + 1) * $qty;
      $prefix = substr($coupon['from'], 0, strlen($coupon['from'])-6);

      for ($i = $from; $i <= $to; $i++) {
        $res = $stmt->execute(array(
          ':code' => $prefix . substr('000000' . $i, -6),
          ':voucher_code' => $voucher_code,
          ':qty' => $qty,
        ));
        if (!$res) {
          throw new Exception('ERR_COUPON_USED');
        }
      }
    }
    if ($totalPax != $param['totalPax']+0) {
      throw new Exception('ERR_TOTAL_PAX');
    }

    // 2. create coupon_voucher
    $stmt = $pdo->prepare("INSERT INTO coupon_voucher SET code=:code, period_code=:period_code, "
      . "issue_date=:issue_date, issue_by=:issue_by, acc_code=:acc_code, card_code=:card_code, "
      . "detail=:detail, uuid=upper(uuid())");
    $stmt->execute(array(
      ':code' => $voucher_code,
      ':period_code' => $_SESSION['period']['code'],
      ':issue_date' => $_SESSION['period']['p_date'],
      ':issue_by' => $_SESSION['staff']['user'],
      ':acc_code' => $param['acc_code'],
      ':card_code' => $param['card_code'],
      ':detail' => implode(', ', $detail),
    ));

    // 3. update card_account balance
    $stmt = $pdo->prepare("UPDATE card_account SET balance = balance + :pax WHERE code=:acc_code");
    $stmt->execute(array(
      ':pax' => $totalPax,
      ':acc_code' => $param['acc_code'],
    ));

    // 4. get balance after
    $stmt = $pdo->prepare("SELECT balance FROM card_account WHERE code=:acc_code");
    $stmt->execute(array(
      ':acc_code' => $param['acc_code'],
    ));
    $balance_pax = $stmt->fetchColumn()+0;

    // 5. create card_account_tx
    // $prefix = $param['acc_code'] . '-'
    //   . substr($_SESSION['period']['p_date'], 2,2) . substr($_SESSION['period']['p_date'], 5,2);
    // $tx_code = _getNextCode('card_account_tx', 'code', $prefix, 6);
    $prefix = $_SESSION['period']['code'] . '-';
    $tx_code = _getNextCode('card_account_tx', 'code', $prefix, 6);

    $stmt = $pdo->prepare("INSERT INTO card_account_tx SET code=:tx_code, period_code=:period_code, "
      . "acc_code=:acc_code, tx_date=NOW(), tx_type='TOPUP', card_code=:card_code, staff=:staff, "
      . "ref1_type='coupon_voucher', ref1_code=:voucher_code, ref2_type='', ref2_code='', "
      . "pax=:pax, balance_pax=:balance_pax, remark=:remark, uuid=upper(uuid())");
    $stmt->execute(array(
      ':tx_code' => $tx_code,
      ':period_code' => $_SESSION['period']['code'],
      ':acc_code' => $param['acc_code'],
      ':card_code' => $param['card_code'],
      ':staff' => $_SESSION['staff']['user'],
      ':voucher_code' => $voucher_code,
      ':pax' => $totalPax,
      ':balance_pax' => $balance_pax,
      ':remark' => 'TOPUP BY COUPON',
    ));
    $pdo->commit();

    responseJson(array(
      'status' => true,
      'voucher_code' => $voucher_code,
    ));
  } catch (Exception $e) {
    $pdo->rollback();
    responseJson(array(
      'status' => false,
      'reason' => 'ERR_UNKNOWN',
      'msg' => $e->getMessage(),
    ));
  }
}

function doInformList($param) {
  global $pdo;

  $stmt = $pdo->prepare("SELECT i.*, m.name_en AS mem_name FROM inform i LEFT JOIN member m ON i.mem_code=m.code "
    . "WHERE i.airport=:airport "
    . "AND (i.code LIKE 'IF-%" . substr($_SESSION['station']['code'], 2,2) . "-%' OR i.code LIKE '%W%') "
    . "AND i.is_domestic=:is_domestic "
    . "ORDER BY i.created_at DESC LIMIT 2000");
  $stmt->execute(array(
    ':airport' => $_SESSION['station']['airport'],
    ':is_domestic' => isset($param['is_domestic']) ? $param['is_domestic'] : 'NO',
  ));
  $out = array();
  while ($row = $stmt->fetch()) {
    $row['bus_list'] = json_decode($row['bus_list'], true);
    $out[] = $row;
  }
  responseJson(array(
    'status' => true,
    'informs' => $out,
    'ssss' => substr($_SESSION['station']['code'], 2,2),
    'airport' => $_SESSION['station']['airport'],
  ));
}

function doInformListSearch($param) {
  global $pdo;

  $stmt = $pdo->prepare("SELECT i.*, m.name_en AS mem_name FROM inform i LEFT JOIN member m ON i.mem_code=m.code "
    . "WHERE i.code=:code OR i.ref_code=:ref_code "
    . "ORDER BY i.created_at DESC LIMIT 2000");
  $stmt->execute(array(
    ':code' => $param['code'],
    ':ref_code' => $param['code'],
  ));
  $out = array();
  while ($row = $stmt->fetch()) {
    $row['bus_list'] = json_decode($row['bus_list'], true);
    $out[] = $row;
  }
  responseJson(array(
    'status' => true,
    'informs' => $out,
    'ssss' => substr($_SESSION['station']['code'], 2,2),
    'airport' => $_SESSION['station']['airport'],
  ));
}

function doInformUpdate($param) {
  global $pdo;
  $staff_id = $_SESSION['staff']['id'];
  $inform = &$param['inform'];
  $buscalls = &$param['buscalls'];
  $bus_list = array();
  foreach ($buscalls as $buscall) {
    $bus_list[] = array(
      'license' => $buscall['license'],
      'pax' => $buscall['pax'],
    );
  }
  if (count($bus_list) == 0) {
    $bus_list = $inform['bus_list'];
  } else {
    $bus_list = json_encode($bus_list, JSON_UNESCAPED_UNICODE);
  }
  $stmt_inform = $pdo->prepare("UPDATE inform SET nation=:nation, flight=:flight, flight_schedule=:flight_date, flight_date=:flight_date, "
    . "hotel=:hotel, group_name=:group_name, note=:note, bus_list=:bus_list, ref_code=:ref_code, updated_time=NOW(), updated_by=$staff_id WHERE code=:code");
    $stmt_buscall = $pdo->prepare("UPDATE buscall SET status=if(license<>:license,'WAIT',status), num_call=if(license<>:license,0,num_call) , license=:license, flight=:flight, flight_schedule=:flight_date, "
      . "flight_landing=:flight_landing WHERE code=:code");
  $stmt_buscall_cancel = $pdo->prepare("UPDATE buscall SET status='CANCEL' WHERE code=:code");

  try {
    // $_SESSION['staff']['id']
    // prepare for new buscall, if have
    $stmt_max = $pdo->prepare("SELECT max(code) max_code FROM buscall WHERE inform_code=:inform_code");
    $stmt_max->execute(array(
      ':inform_code' => $inform['code'],
    ));

    $max_code = $stmt_max->fetchColumn();
    if ($max_code===false) {
      $max_code = 0;
    } else {
      $max_code = substr($max_code, -2) + 0;
    }

    $flight = _getFlight($inform['airport'], $inform['flight'], $inform['flight_date']);
    $fld = explode(',', 'code,inform_code,airport,license,pax,is_landing,is_park,'
      . 'flight,flight_schedule,flight_landing');
    $buscall_data = array(
      'inform_code' => $inform['code'],
      'airport' => $inform['airport'],
      'license' => '',
      'pax' => 0,
      'is_landing' => $flight===false ? 'NO' : ($flight['landing_status']=='LANDED' ? 'YES' : 'NO'),
      'is_park' => 'NO',
      'flight_schedule' => $flight===false ? $inform['flight_date'] : $flight['schedule_time'],
      'flight_landing' => $flight===false ? $inform['flight_date'] : $flight['landing_time'],
    );
    /////////////////////////////

    $pdo->beginTransaction();
    $stmt_inform->execute(array(
      ':nation' => $inform['nation'],
      ':flight' => $inform['flight'],
      ':flight_date' => $inform['flight_date'],
      ':hotel' => $inform['hotel'],
      ':group_name' => $inform['group_name'],
      ':note' => $inform['note'],
      ':bus_list' => $bus_list,
      ':code' => $inform['code'],
      ':ref_code' => $inform['ref_code'],
    ));

    foreach ($buscalls as $buscall) {
      if ($buscall['code'] != '') {
        if (strtoupper(substr($buscall['license'], -1))=='N') {
          $stmt_buscall_cancel->execute(array(
            ':code' => $buscall['code'],
          ));
        } else {
          $stmt_buscall->execute(array(
            ':code' => $buscall['code'],
            ':flight' => $inform['flight'],
            ':flight_date' => $inform['flight_date'],
            ':flight_landing' => $inform['flight_date'],
            ':license' => $buscall['license']
          ));
        }
      } else {
        if (strtoupper(substr($buscall['license'], -1))=='N') {
          continue;
        }
        $buscall_data['code'] = $inform['code'] . '-' . substr('00' . ($max_code+1), -2);
        $buscall_data['license'] = $buscall['license'];
        $buscall_data['pax'] = 0;
        $res = _saveData('buscall', $fld, $buscall_data, array('code'));
        $max_code++;
      }
    }

    $pdo->commit();
  } catch (Exception $e) {
    $pdo->rollback();
    responseJson(array(
      'status' => false,
      'reason' => 'ERR_UNKNOWN',
      'error' => $pdo->errorInfo(),
    ));
  }
  responseJson(array(
    'status' => true,
  ));
}

function doInformCancel($code) {
  global $pdo;

  try {
    $pdo->beginTransaction();

    $stmt = $pdo->prepare("UPDATE inform SET status='CANCEL' WHERE code=:code");
    $stmt->execute(array(
      ':code' => $code,
    ));
    if ($stmt->rowCount() == 0) {
      throw new Exception('ERR_INFORM_NOT_CANCEL');
    }

    $stmt = $pdo->prepare("UPDATE buscall b SET status='CANCEL' WHERE code LIKE '" . $code . "-%'");
    $stmt->execute();

    $pdo->commit();
  } catch (Exception $e) {
    $error = $stmt->errorInfo();
    $pdo->rollback();
    responseJson(array(
      'status' => false,
      'reason' => 'ERR_UNKNOWN',
      'error' => $error,
    ));
  }
  responseJson(array(
    'status' => true,
  ));
}

function doInformByCode($code) {
  global $pdo;

  $stmt = $pdo->prepare("SELECT * FROM inform WHERE code=:code");
  $stmt->execute(array(
    ':code' => $code,
  ));
  $inform = $stmt->fetch();

  $stmt = $pdo->prepare("SELECT * FROM member WHERE code=:code");
  $stmt->execute(array(
    ':code' => $inform['mem_code'],
  ));
  $member = $stmt->fetch();

  $stmt = $pdo->prepare("SELECT * FROM country WHERE code=:code");
  $stmt->execute(array(
    ':code' => $inform['nation'],
  ));
  $country = $stmt->fetch();

  $stmt = $pdo->prepare("SELECT * FROM buscall WHERE inform_code=:code ORDER BY code");
  $stmt->execute(array(
    ':code' => $inform['code'],
  ));
  $buscalls = $stmt->fetchAll();

  responseJson(array(
    'status' => true,
    'inform' => $inform,
    'buscalls' => $buscalls,
    'member' => $member,
    'country' => $country,
  ));
}

function doInformListByCard($param) {
  global $pdo;

  $stmt = $pdo->prepare("SELECT * FROM inform WHERE card_code=:card_code AND status='WAIT'");
  $stmt->execute(array(
    ':card_code' => $param['card_code'],
  ));
  $out = array();
  while ($row = $stmt->fetch()) {
    $row['bus_list'] = json_decode($row['bus_list'], true);
    $out[] = $row;
  }
  responseJson(array(
    'status' => true,
    'informs' => $out,
  ));
}
function doInformListByCardAccount($param) {
  global $pdo;

  $stmt = $pdo->prepare("SELECT i.*
  , SUBSTRING(i.flight_date, 12, 5) flight_time
  , m.name_en mem_name_en
  , n.name_en nation_en
FROM inform i
  JOIN carddb c ON i.card_code=c.code AND c.acc_code=:acc_code
  LEFT JOIN member m ON i.mem_code=m.code
  LEFT JOIN country n ON i.nation=n.code
WHERE i.`status`='WAIT' AND i.airport=:airport
ORDER BY i.code DESC");
  $res = $stmt->execute(array(
    ':acc_code' => $param['acc_code'],
    ':airport' => $_SESSION['station']['airport'],
  ));
  if (!$res) {
    print_r($stmt->errorInfo());
  }
  $out = array();
  while ($row = $stmt->fetch()) {
    $row['bus_list'] = json_decode($row['bus_list'], true);
    $out[] = $row;
  }
  responseJson(array(
    'status' => true,
    'informs' => $out,
    'acc_code' => $param['acc_code'],
  ));
}

function doInformByRefCode($param) {
  global $pdo;

  $stmt = $pdo->prepare("SELECT i.*
  , SUBSTRING(i.flight_date, 12, 5) flight_time
  , m.name_en mem_name_en
  , n.name_en nation_en
FROM inform i
  JOIN carddb c ON i.card_code=c.code AND c.acc_code=:acc_code
  LEFT JOIN member m ON i.mem_code=m.code
  LEFT JOIN country n ON i.nation=n.code
WHERE i.`status`='WAIT' AND i.airport=:airport AND ref_code=:ref_code
ORDER BY i.code DESC");
  $res = $stmt->execute(array(
    ':acc_code' => $param['acc_code'],
    ':airport' => $_SESSION['station']['airport'],
    ':ref_code' => $param['ref_code']
  ));
  if (!$res) {
    print_r($stmt->errorInfo());
  }
  $row = $stmt->fetch();
  if (!$row) {
    responseJson(array(
      'status' => false
    ));
  }
  $row['bus_list'] = json_decode($row['bus_list'], true);
  responseJson(array(
    'status' => true,
    'inform' => $row,
    'acc_code' => $param['acc_code']
  ));
}

function doFlightCheck($param) {
  global $pdo;

  $stmt = $pdo->prepare("SELECT * FROM flight WHERE airport=:airport AND flight=:flight AND schedule_time BETWEEN now() - INTERVAL 6 HOUR AND now() + INTERVAL 12 HOUR ORDER BY schedule_time ASC LIMIT 1");
  $stmt->execute(array(
    ':airport' => $param['airport'],
    ':flight' => $param['flight'],
  ));
  $flight = $stmt->fetch();
  if ($flight===false) {
    responseJson(array(
      'status' => false,
      'reason' => 'ERR_FLIGHT_NOT_FOUND',
    ));
  }
  responseJson(array(
    'status' => true,
    'flight' => $flight,
  ));
}

function doInformSave($param) {
  global $pdo;

  $inform = $param['inform'];
  $check_update = $param['inform']['uuid'];
  if (!isset($inform['is_tmp'])) {
    $inform['is_tmp'] = 'NO';
  }
  if (trim($inform['card_code'])=='') {
    responseJson(array(
      'status' => false,
      'reason' => 'ไม่พบรหัสบัตร',
    ));
  }

  if ($inform['is_domestic']=='NO' && $inform['is_tmp']!='YES' && $inform['ref_code']=='') {
    responseJson(array(
      'status' => false,
      'reason' => "กรุณาระบุรหัสใบแจ้งอ้างอิงก่อน",
    ));
  }

  try {
    $pdo->beginTransaction();
    if ($inform['code']=='') {
      $prefix = 'IF-' . $_SESSION['station']['code'] . '-'
        . substr(str_replace('-', '', $_SESSION['period']['p_date']), 2)
        . ($_SESSION['period']['p_type']=='AM' ? 'M' : ($_SESSION['period']['p_type']=='PM' ? 'N' : 'D')) . '-';
      $inform['code'] = _getNextCode('inform', 'code', $prefix, 4);
    }
    $inform['period_code'] = $_SESSION['period']['code'];
    $inform['airport'] = $_SESSION['station']['airport'];
    $inform['issue_date'] = $_SESSION['period']['p_date'];
    $inform['issue_by'] = $_SESSION['staff']['user'];
    $inform['status'] = $inform['is_domestic']=='YES' ? 'PAID' : 'WAIT';
    $inform['receipt_code'] = '';
    $inform['check_status'] = 'N/A';
    $inform['check_pax'] = 0;
    $inform['ref_code'] = isset($inform['ref_code']) ? $inform['ref_code'] : '';
    $inform['created_by'] = $_SESSION['staff']['id'];
    $inform['updated_by'] = $_SESSION['staff']['id'];
    $inform['updated_time'] = date("Y-m-d H:i:s");

    if ($inform['ref_code'] != '') {
      $ref_text = ''; $ref_num = '';
      $checkRefCode = $inform['ref_code'];
      $lengthRefCode = strlen($checkRefCode);
      if($lengthRefCode==7){
        $ref_text = substr($inform['ref_code'], 0,2);
        $ref_num = substr($inform['ref_code'], 2,7);
      }else if($lengthRefCode==6){
        $ref_text = substr($inform['ref_code'], 0,1);
        $ref_num = substr($inform['ref_code'], 1,6);
      }
      // $ref_text = substr($inform['ref_code'], 0,2);
      // $ref_num = substr($inform['ref_code'], 2,7);
      $stmt2 = $pdo->prepare("select min(start_item) min,max(next_item) max, prefix_code "
        . "from lot_in where prefix_code=:prefixCode group by prefix_code");
      $stmt2->execute(array(
        ':prefixCode' => $ref_text
      ));
      $check = $stmt2->fetch();
      if ($check == false){
        $pdo->rollback();
        responseJson(array(
          'status' => false,
          'reason' => "เลขใบแจ้งอ้างอิงยังไม่มีในระบบ1",
          //'sql' => $ref_text,
        ));
      }else{
        $ref_nums = intval($ref_num);
        $min_num = intval($check['min']);
        $max_num = intval($check['max']);
        //echo $ref_nums;
        if ($ref_nums < $min_num || $ref_nums >= $max_num){
            $pdo->rollback();
            responseJson(array(
              'status' => false,
              'reason' => "เลขใบแจ้งอ้างอิงยังไม่มีในระบบ",
            ));
        }
      }


      $stmt = $pdo->prepare("SELECT code FROM inform WHERE ref_code=:ref_code "
        . "AND status <> 'CANCEL' "
        . "AND code <> :code LIMIT 1");
      $stmt->execute(array(
        ':ref_code' => $inform['ref_code'],
        //':period_code' => $_SESSION['period']['code'],
        ':code' => $inform['code']
      ));
      $row = $stmt->fetch();
      if ($row !== false) {
        $pdo->rollback();
        responseJson(array(
          'status' => false,
          'reason' => "เลขใบแจ้งอ้างอิงมีการใช้งานแล้ว\nใบแจ้งเลขที่ " . $row['code'],
        ));
      }
    }

    if($check_update==""){
      //echo "A ".$param['uuid'];
      $fld = explode(',', 'code,airport,period_code,issue_date,issue_by,card_code,mem_code,'
        . 'nation,flight,flight_schedule,flight_date,hotel,group_name,note,ref_code,total_pax,is_domestic,'
        . 'status,receipt_code,check_status,check_pax,bus_list,created_by');
    }else {
      //echo "B ".$param['uuid'];
      $fld = explode(',', 'code,airport,period_code,issue_date,issue_by,card_code,mem_code,'
        . 'nation,flight,flight_schedule,flight_date,hotel,group_name,note,ref_code,total_pax,is_domestic,'
        . 'status,receipt_code,check_status,check_pax,bus_list,updated_by,updated_time');
    }

    $tmp = array();
    foreach ($inform['bus_list'] as $bus) {
      $tmp[] = $bus['license'] . ':' . ($bus['pax']+0);
    }
    $bus_list = $inform['bus_list'];
    $inform['bus_list'] = json_encode($inform['bus_list'], JSON_UNESCAPED_UNICODE);
    $inform['flight_schedule'] = $inform['flight_date'];
    $result = _saveData('inform', $fld, $inform, array('code'));
    if ($result['status']===false) {
      throw new Exception();
    }
    // cancel existing buscalls if change from DOM to INT

    // generate buscall
    if ($inform['is_domestic']=='YES') {
        if(count($bus_list) == 0){
            throw new Exception("Bus List = 0");
        }
      _createBuscall($_SESSION['station']['airport'], $inform, $bus_list);
    }
    // else {
    //   _cancelBuscall($inform['code']);
    // }

    $pdo->commit();
    responseJson(array(
      'status' => true,
      'code' => $inform['code'],
      'uuid' => $result['uuid'],
      //'see_session' => $_SESSION['staff']['id'],
    ));
  } catch (Exception $e) {
    $pdo->rollback();
    print_r($e);
    responseJson(array(
      'status' => false,
      'reason' => 'ERR_UNKNOWN',
    ));
  }
}

function doInformOneStopSave($param) {
  global $pdo;

  $inform = $param['inform'];
  if (trim($inform['card_code'])=='') {
    responseJson(array(
      'status' => false,
      'reason' => 'ไม่พบรหัสบัตร',
    ));
  }
  if ($inform['is_domestic']=='NO' && $inform['ref_code']=='') {
    responseJson(array(
      'status' => false,
      'reason' => "กรุณาระบุรหัสใบแจ้งอ้างอิงก่อน",
    ));
  }

  try {
    $pdo->beginTransaction();


    // if ($inform['code']=='') {
    $prefix = 'IF-' . $_SESSION['station']['code'] . '-'
      . substr(str_replace('-', '', $_SESSION['period']['p_date']), 2)
      . ($_SESSION['period']['p_type']=='AM' ? 'M' : ($_SESSION['period']['p_type']=='PM' ? 'N' : 'D')) . '-';
    $inform['code'] = _getNextCode('inform', 'code', $prefix, 4);
    // }
    $inform['airport'] = $_SESSION['station']['airport'];
    $inform['period_code'] = $_SESSION['period']['code'];
    $inform['issue_date'] = $_SESSION['period']['p_date'];
    $inform['issue_by'] = $_SESSION['staff']['user'];
    $inform['status'] = 'PAID';
    $inform['receipt_code'] = '';
    $inform['check_status'] = 'N/A';
    $inform['check_pax'] = 0;
    $inform['flight_schedule'] = $inform['flight_date'];
    $inform['ref_code'] = isset($inform['ref_code']) ? $inform['ref_code'] : '';

    if ($inform['ref_code'] != '') {
      $ref_text = substr($inform['ref_code'], 0,2);
      $ref_num = substr($inform['ref_code'], 2,7);
      $stmt2 = $pdo->prepare("select min(start_item) min,max(next_item) max, prefix_code "
        . "from lot_in where prefix_code=:prefixCode group by prefix_code");
      $stmt2->execute(array(
        ':prefixCode' => $ref_text
      ));
      $check = $stmt2->fetch();
      if ($check == false){
        $pdo->rollback();
        responseJson(array(
          'status' => false,
          'reason' => "เลขใบแจ้งอ้างอิงยังไม่มีในระบบ",
        ));
      }else{
        $ref_nums = intval($ref_num);
        $min_num = intval($check['min']);
        $max_num = intval($check['max']);
        if ($ref_nums < $min_num || $ref_nums >= $max_num){
            $pdo->rollback();
            responseJson(array(
              'status' => false,
              'reason' => "เลขใบแจ้งอ้างอิงยังไม่มีในระบบ",
            ));
        }
      }


      $stmt = $pdo->prepare("SELECT code FROM inform WHERE ref_code=:ref_code AND period_code <> :period_code AND status <> 'CANCEL' AND is_domestic='NO' LIMIT 1");
      $stmt->execute(array(
        ':ref_code' => $inform['ref_code'],
        ':period_code' => $_SESSION['period']['code'],
      ));
      $row = $stmt->fetch();
      if ($row !== false) {
        $pdo->rollback();
        responseJson(array(
          'status' => false,
          'reason' => "เลขใบแจ้งอ้างอิงมีการใช้งานแล้ว\nใบแจ้งเลขที่ " . $row['code'],
        ));
      }
    }
    $fld = explode(',', 'code,airport,period_code,issue_date,issue_by,card_code,mem_code,'
      . 'nation,flight,flight_schedule,flight_date,hotel,group_name,note,ref_code,total_pax,is_domestic,'
      . 'status,receipt_code,check_status,check_pax,bus_list');
    $tmp = array();
    foreach ($inform['bus_list'] as $bus) {
      $tmp[] = $bus['license'] . ':' . ($bus['pax']+0);
    }
    $bus_list = $inform['bus_list'];
    $inform['bus_list'] = json_encode($inform['bus_list'], JSON_UNESCAPED_UNICODE);

    // 1. SAVE inform
    $result = _saveData('inform', $fld, $inform, array('code'));
    if ($result['status']!==true) {
      throw new Exception();
    }

    // check is inform was saved
    $stmt = $pdo->prepare("SELECT * FROM inform WHERE code=:code");
    $stmt->execute(array(
      ':code' => $inform['code'],
    ));
    $tmp3 = $stmt->fetch();
    if ($tmp3===false) {
      throw new Exception();
    }

    // 2. GENERATE buscall
    _createBuscall($_SESSION['station']['airport'], $inform, $bus_list);

    if ($inform['is_domestic']=='NO') {
     // 3. get card balance
      $stmt = $pdo->prepare("SELECT * FROM card_account WHERE code=:code");
      $stmt->execute(array(
        ':code' => $param['acc_code'],
      ));
      $card_account = $stmt->fetch();

      // $prefix = $param['acc_code'] . '-'
      //   . substr($_SESSION['period']['p_date'], 2,2) . substr($_SESSION['period']['p_date'], 5,2);
      // $tx_code1 = _getNextCode('card_account_tx', 'code', $prefix, 6);
      $prefix = $_SESSION['period']['code'] . '-';
      $tx_code1 = _getNextCode('card_account_tx', 'code', $prefix, 6);

      // 4. create receipt
      $items = array(
        array('prod_code' => 'TOPUP', 'qty' => $inform['total_pax']+0),
      );
      if ($param['sellInform']) {
        $items[] = array('prod_code' => 'SHD', 'qty' => 1);
      }
      $receipt_code = _createReceipt(array(
        'mem_code' => $param['mem_code'],
        'address' => $param['address'],
        'cheque' => $param['payment_type']=='CHEQUE' ? $param['amount']+0 : 0,
        'payin' => 0,
        'items' => $items,
        'remark' => 'REF# ' . $tx_code1,
      ));
      if ($param['sellInform']) {
        $scock_out[] = array('prod_code' => 'SHD', 'qty' => 1);
        $memberCode = $param['mem_code'];
        $stocks_out = _scockOut($scock_out,$memberCode,$receipt_code);
      }

      // 5.1 create card_account_tx (TOPUP)

      $stmt = $pdo->prepare("INSERT INTO card_account_tx SET code=:tx_code, period_code=:period_code, "
        . "acc_code=:acc_code, tx_date=NOW(), tx_type='TOPUP', card_code=:card_code, staff=:staff, "
        . "ref1_type='receipt', ref1_code=:receipt_code, ref2_type='', ref2_code='', "
        . "pax=:pax, balance_pax=:balance_pax, remark=:remark, uuid=upper(uuid())");

      $stmt->execute(array(
        ':tx_code' => $tx_code1,
        ':period_code' => $_SESSION['period']['code'],
        ':acc_code' => $card_account['code'],
        ':card_code' => $param['card_code'],
        ':staff' => $_SESSION['staff']['user'],
        ':pax' => $inform['total_pax'],
        ':balance_pax' => $card_account['balance']+$inform['total_pax'],
        ':remark' => 'TOP UP',
        ':receipt_code' => $receipt_code,
      ));


      // 5.2 create card_account_tx (PAID)
      $tx_code2 = _getNextCode('card_account_tx', 'code', $prefix, 6);

      $stmt = $pdo->prepare("INSERT INTO card_account_tx SET code=:tx_code, period_code=:period_code, "
        . "acc_code=:acc_code, tx_date=NOW(), tx_type='PAID', card_code=:card_code, staff=:staff, "
        . "ref1_type='inform', ref1_code=:inform_code, ref2_type='', ref2_code='', "
        . "pax=:pax, balance_pax=:balance_pax, remark=:remark, uuid=upper(uuid())");

      $stmt->execute(array(
        ':tx_code' => $tx_code2,
        ':period_code' => $_SESSION['period']['code'],
        ':acc_code' => $card_account['code'],
        ':card_code' => $param['card_code'],
        ':staff' => $_SESSION['staff']['user'],
        ':inform_code' => $inform['code'],
        ':pax' => -1*$inform['total_pax'],
        ':balance_pax' => $card_account['balance'],
        ':remark' => 'PAID',
      ));

      // UPDATE inform WITH receipt_code
      $stmt = $pdo->prepare("UPDATE inform SET receipt_code=:receipt_code, tx_code=:tx_code WHERE code=:code");
      $stmt->execute(array(
        ':code' => $inform['code'],
        ':receipt_code' => $receipt_code,
        ':tx_code' => $tx_code2,
      ));
      $inform['tx_code'] = $tx_code2;
    } else {
      $receipt_code = null;
    }

    $pdo->commit();
    responseJson(array(
      'status' => true,
      'inform_code' => $inform['code'],
      'uuid' => $result['uuid'],
      'receipt_code' => $receipt_code,
      'inform' => $inform,
      'balance_before' => $card_account['balance']+$inform['total_pax'],
      'balance_after' => $card_account['balance']+0,
      'bill' => _genBillObjectNew($inform),
      'stockss' => $stocks_out,
    ));
  } catch (Exception $e) {
    $pdo->rollback();
    responseJson(array(
      'status' => false,
      'reason' => 'ERR_UNKNOWN',
      'check' => $fld,
      'check2' => $inform['code'],
    ));
  }
}

function doCountryByCode($code) {
  global $pdo;

  $stmt = $pdo->prepare("SELECT * FROM country WHERE code=:code");
  $stmt->execute(array(
    ':code' => $code,
  ));
  $country = $stmt->fetch();
  if ($country===false) {
    responseJson(array(
      'status' => false,
      'reason' => 'ERR_COUNTRY_NOT_FOUND',
    ));
  }
  responseJson(array(
    'status' => true,
    'country' => $country,
  ));
}

function doCardUse($param) {
  global $pdo;
  $staff_idupdate = $_SESSION['staff']['id'];

  try {
    $pdo->beginTransaction();

    // 1. get card balance
    $stmt = $pdo->prepare("SELECT * FROM card_account WHERE code=:code");
    $stmt->execute(array(
      ':code' => $param['acc_code'],
    ));
    $card_account = $stmt->fetch();
   //1.1 check ref_code
    if ($param['inform_ref_code'] != '') {
      $sql = "SELECT code FROM inform WHERE ref_code=:ref_code AND status <> 'CANCEL' AND code <> :code LIMIT 1";
      $stmt = $pdo->prepare($sql);
      $stmt->execute(array(
        ':ref_code' => $param['inform_ref_code'],
        ':code' => $param['inform_code'],
      ));
      $row = $stmt->fetch();
      if ($row !== false) {
        $pdo->rollback();
        responseJson(array(
          'status' => false,
          'reason' => "เลขใบแจ้งอ้างอิงมีการใช้งานแล้ว\nใบแจ้งเลขที่ " . $row['code'],
        ));
      }
    }

    // 2. get inform
    $stmt = $pdo->prepare("SELECT * FROM inform WHERE code=:code");
    $stmt->execute(array(
      ':code' => $param['inform_code'],
    ));
    $inform = $stmt->fetch();

    if ($inform['total_pax'] == 0) {
      $myError = 'ไม่สามารถบันทึกได้ยอด PAX เป็น 0';
      throw new Exception("ERR_PAX_0");
    }

    if ($card_account['balance'] < $inform['total_pax']) {
      throw new Exception("ERR_CARD_ACCOUNT_BALANCE_NOT_ENOUGHT");
    }

    // 2.2 get RunnigNumber
    $date = substr($_SESSION['period']['p_date'],2,8);
    $code = $_SESSION['station']['code'];
    $p_type = $_SESSION['period']['p_type'];
    if(!isset($param['selectperiodx'])){
      $param['selectperiodx'] = $code . $date . ($p_type == 'AM' ? 'M' : ($p_type=='PM' ? 'N' : 'D'));
    }else{
      $param['selectperiodx'] = $param['selectperiodx'];
    }

    $counter_b = array('01SU','03SU','04SU','14SU','15SU');
    $counter_c = array('02SU','05SU','16SU','17SU','01NS');
    $period_codex = str_replace("-", "", $param['selectperiodx']);
    $a =  substr($period_codex,4,6).'M';
    $b =  substr($period_codex,4,6).'N';
    $stationx =  substr($period_codex,0,4);
    // echo $period_codex; echo "<br/>";
    // echo $a; echo "<br/>";
    // echo $stationx; echo "<br/>";
    if (in_array($stationx, $counter_b)){
      $counter = 'B';
    } elseif (in_array($stationx, $counter_c)){
      $counter = 'C';
    } else {
      $counter = 'N';
    }
    if($counter=='B'){
      $stmt = $pdo->prepare("SELECT MAX(run_no) as numRunning FROM inform WHERE ".
                            "complete_by in ('01SU$a','03SU$a','04SU$a','14SU$a','15SU$a','01SU$b','03SU$b','04SU$b','14SU$b','15SU$b')");
      $stmt->execute();
      $runningNo = $stmt->fetchColumn();
      if($runningNo===false||$runningNo==null){
        $runningNo=0;
      }
    } elseif ($counter=='C') {
      $stmt = $pdo->prepare("SELECT MAX(run_no) as numRunning FROM inform WHERE ".
                            "complete_by in ('02SU$a','05SU$a','16SU$a','17SU$a','01NS$a','02SU$b','05SU$b','16SU$b','17SU$b','01NS$b')");
      $stmt->execute();
      $runningNo = $stmt->fetchColumn();
      if($runningNo===false||$runningNo==null){
        $runningNo=0;
      }
    } else {
      $runningNo = 'X';
    }
    //echo $runningNo; echo "<br/>";


    // 3. create card_account_tx
    // $prefix = $param['acc_code'] . '-'
    //   . substr($_SESSION['period']['p_date'], 2,2) . substr($_SESSION['period']['p_date'], 5,2);
    // $tx_code = _getNextCode('card_account_tx', 'code', $prefix, 6);
    $prefix = $_SESSION['period']['code'] . '-';
    $tx_code = _getNextCode('card_account_tx', 'code', $prefix, 6);

    $stmt = $pdo->prepare("INSERT INTO card_account_tx SET code=:tx_code, period_code=:period_code, "
      . "acc_code=:acc_code, tx_date=NOW(), tx_type='PAID', card_code=:card_code, staff=:staff, "
      . "ref1_type='inform', ref1_code=:inform_code, ref2_type='', ref2_code='', "
      . "pax=:pax, balance_pax=:balance_pax, remark=:remark, uuid=upper(uuid())");

    $stmt->execute(array(
      ':tx_code' => $tx_code,
      ':period_code' => $_SESSION['period']['code'],
      ':acc_code' => $card_account['code'],
      ':card_code' => $param['card_code'],
      ':staff' => $_SESSION['staff']['user'],
      ':inform_code' => $param['inform_code'],
      ':pax' => $inform['total_pax']+0,
      ':balance_pax' => $card_account['balance']-$inform['total_pax'],
      ':remark' => 'PAID',
    ));

    // 4. adjust card account balance
    $stmt = $pdo->prepare("UPDATE card_account SET balance = balance - :pax WHERE code=:code");
    $stmt->execute(array(
      ':code' => $param['acc_code'],
      ':pax' => $inform['total_pax']+0,
    ));
    $card_account['balance'] -= $inform['total_pax'];

    // 5. update inform status
    if (isset($param['inform_ref_code'])) {
      $inform['ref_code'] = $param['inform_ref_code'];
    }
    $inform['tx_code'] = $tx_code;

    $stmt = $pdo->prepare("UPDATE inform SET status='PAID', ref_code=:ref_code, tx_code=:tx_code, complete_by=:complete_by, complete_at=NOW(), complete_by_id=:complete_by_id WHERE code=:code");
    $stmt->execute(array(
      ':code' => $param['inform_code'],
      ':ref_code' => $inform['ref_code'],
      ':tx_code' => $tx_code,
      ':complete_by' => $_SESSION['period']['code'],
      ':complete_by_id' => $_SESSION['staff']['id'],
    ));
    $checkUpdateStatus = $stmt->rowCount();
    if($checkUpdateStatus==0){
      $myError = 'ชำระไม่สำเร็จ';
      throw new Exception("ERR_STATUS_NOT_UPDATE");
    }
    $inform['status'] = 'PAID';

    // 6. update runnig number
    $updateRunNoSql = "UPDATE inform dest, (SELECT max(i.run_no)+1 r
    FROM inform i where i.complete_by in ('01SU$a','03SU$a','04SU$a','14SU$a','15SU$a','01SU$b','03SU$b','04SU$b','14SU$b','15SU$b')) src_b,
    (SELECT max(i.run_no)+1 r
    FROM inform i where i.complete_by in ('02SU$a','05SU$a','16SU$a','17SU$a','01NS$a','02SU$b','05SU$b','16SU$b','17SU$b','01NS$b')) src_c
    SET dest.run_no = case when 'B'=:counter then src_b.r when 'C'=:counter then src_c.r else '0' end
    WHERE dest.code=:inform_code ";
    $stmt = $pdo->prepare($updateRunNoSql);
    $stmt->execute(array(
      ':counter' => $counter,
      ':inform_code' => $param['inform_code'],
    ));
    $checkUpdateRunNo = $stmt->rowCount();
    if($checkUpdateRunNo==0){
      $myError = 'ชำระไม่สำเร็จ';
      if($counter == 'B' || $counter == 'C'){
        throw new Exception("ERR_STATUS_NOT_UPDATE");
      }
    }

    // 7. Get Running Number
    $stmt = $pdo->prepare("SELECT run_no FROM inform WHERE code=:code");
    $stmt->execute(array(
      ':code' => $param['inform_code'],
    ));
    $inform['run_no'] = $stmt->fetchColumn();

    // 8. add buscall
    $bus_list = json_decode($inform['bus_list'], true);
    if(count($bus_list)==0){
        $myError = 'ไม่สามารถบันทึกได้ยอด PAX เป็น 0';
        throw new Exception("ERR_PAX_0");
    }
    _createBuscall($_SESSION['station']['airport'], $inform, $bus_list);


    $pdo->commit();

    responseJson(array(
      'status' => true,
      'tx_code' => $tx_code,
      'bill' => _genBillObjectNew($inform),
      'run_no' => $inform['run_no'],
      'updated' => $checkUpdateStatus,
    ));
  } catch(Exception $e) {
    $pdo->rollback();
    responseJson(array(
      'status' => false,
      'reason' => $e->errorInfo, //'ERR_UNKNOWN',
      'error' => $e->errorInfo,
      'myError' => $myError,
      'cc' => $updateRunNoSql,
    ));
  }
}

function _genBillObjectNew(&$inform) {
  global $pdo;

  $runningNum = '';
  if($inform['run_no'] == ''||$inform['run_no'] == null||$inform['run_no']== '0'||$inform['run_no']==0||$inform['run_no']==undefined){
    $runningNum = '';
  }else {
    $runningNum = ' # '.$inform['run_no'];
  }
  $stmt = $pdo->prepare("SELECT name_en FROM member WHERE code=:code");
  $stmt->execute(array(
    ':code' => $inform['mem_code'],
  ));
  $mem_name = $stmt->fetchColumn();

  $stmt = $pdo->prepare("SELECT nation_en FROM country WHERE code=:code");
  $stmt->execute(array(
    ':code' => $inform['nation'],
  ));
  $nation_name = $stmt->fetchColumn();

  $stmt = $pdo->prepare("SELECT price FROM product WHERE code=:code");
  $stmt->execute(array(
    ':code' => 'TOPUP',
  ));
  $coupon_price = $stmt->fetchColumn()+0;
  $billCopy = array();
  $bill = array(
    'code'        => $inform['code'],
    'memCode'     => $inform['mem_code'],
    'name'        => $mem_name,
    'addr'        => '',
    'date1'       => thDate($inform['issue_date']),
    'dueDate'     => '',
    'bahtText'    => bahtText($inform['total_pax'] * $coupon_price),
    'amount'      => number_format($inform['total_pax']*$coupon_price, 2),
    'unitPrice'   => number_format($coupon_price, 2),
    'qty'         => number_format($inform['total_pax'], 0),
    'unit'        => 'PAX',
    'line1'       => 'ผู้โดยสาร สัญชาติ ' . $inform['nation'] . ':' . $nation_name,
    'line2'       => 'เที่ยวบิน ' . $inform['flight'] . ' เวลา ' . substr($inform['flight_schedule'], 11, 5),
    'line3'       => 'พักโรงแรม ' . $inform['hotel'],
    'line4'       => 'ชื่อกลุ่ม ' . $inform['group_name'],
    'line5'       => 'รหัสใบแจ้งอ้างอิง: ' . $inform['ref_code'],
    'line6'       => 'รหัสธุรกรรมอ้างอิง: ' . $inform['tx_code'],
    'total'       => number_format($inform['total_pax']*$coupon_price, 2),
    'remark'      => '',
    'issueBy'     => $inform['issue_by'],
    'copy'        => 'ต้นฉบับ'.$runningNum,
    'copy_en'     => 'ORIGINAL'
  );
  $billCopy = $bill;
  $billCopy['copy'] = 'สำเนา'.$runningNum;
  $billCopy['copy_en'] = 'COPY';
  return array($bill, $billCopy);
}

function _genBillObject(&$inform) {
  global $pdo;

  $stmt = $pdo->prepare("SELECT name_en FROM member WHERE code=:code");
  $stmt->execute(array(
    ':code' => $inform['mem_code'],
  ));
  $mem_name = $stmt->fetchColumn();

  $stmt = $pdo->prepare("SELECT nation_en FROM country WHERE code=:code");
  $stmt->execute(array(
    ':code' => $inform['nation'],
  ));
  $nation_name = $stmt->fetchColumn();

  $stmt = $pdo->prepare("SELECT price FROM product WHERE code=:code");
  $stmt->execute(array(
    ':code' => 'TOPUP',
  ));
  $coupon_price = $stmt->fetchColumn()+0;

  $bill = array(
    'code'        => $inform['code'],
    'memCode'     => $inform['mem_code'],
    'name'        => $mem_name,
    'addr'        => '',
    'issueDate'   => thDate($inform['issue_date']),
    'dueDate'     => '',
    'bahtText'    => bahtText($inform['total_pax'] * $coupon_price),
    'amount'      => number_format($inform['total_pax']*$coupon_price, 2),
    'remark'      => '',
    'issueBy'     => $inform['issue_by'],
    'items'       => array(
      array(
        'no'        => '1',
        'detail'    => 'ผู้โดยสาร สัญชาติ ' . $inform['nation'] . ':' . $nation_name,
        'unitPrice' => number_format($coupon_price, 2),
        'qty'       => number_format($inform['total_pax'], 0),
        'unit'      => 'PAX',
        'amount'    => number_format($inform['total_pax']*$coupon_price,2),
      ),
      array(
        'no'        => '',
        'detail'    => 'เที่ยวบิน ' . $inform['flight'] . ' เวลา ' . substr($inform['flight_schedule'], 11, 5),
        'unitPrice' => '',
        'qty'       => '',
        'unit'      => '',
        'amount'    => '',
      ),
      array(
        'no'        => '',
        'detail'    => 'พักโรงแรม ' . $inform['hotel'],
        'unitPrice' => '',
        'qty'       => '',
        'unit'      => '',
        'amount'    => '',
      ),
      array(
        'no'        => '',
        'detail'    => 'ชื่อกลุ่ม ' . $inform['group_name'],
        'unitPrice' => '',
        'qty'       => '',
        'unit'      => '',
        'amount'    => '',
      ),
      array(
        'no'        => '',
        'detail'    => 'รหัสใบแจ้งอ้างอิง: ' . $inform['ref_code'],
        'unitPrice' => '',
        'qty'       => '',
        'unit'      => '',
        'amount'    => '',
      ),
      array(
        'no'        => '',
        'detail'    => 'รหัสธุรกรรมอ้างอิง: ' . $inform['tx_code'],
        'unitPrice' => '',
        'qty'       => '',
        'unit'      => '',
        'amount'    => '',
      ),
    ),
    'copy'        => array(
      array('th' => 'ต้นฉบับ', 'en' => 'ORIGINAL'),
      array('th' => 'สำเนา', 'en' => 'COPY'),
    ),
  );
  return $bill;
}

function _genReceiptObject($receipt_code) {
  global $pdo;

  $stmt = $pdo->prepare("SELECT * FROM receipt WHERE code=:code");
  $stmt->execute(array(
    ':code' => $receipt_code,
  ));
  $receipt = $stmt->fetch();
  $stmt = $pdo->prepare("SELECT * FROM receipt_item WHERE receipt_code=:code ORDER BY line_num");
  $stmt->execute(array(
    ':code' => $receipt_code,
  ));
  $items = $stmt->fetchAll();
  if ($receipt===false || count($items)==0) {
    return array();
  }

  // 65
  $from = explode("\n", wordwrap($receipt['name'] . ' ID#' . $receipt['mem_code']
    . ($receipt['tax_id']=='' ? '' : ' TAX#' . $receipt['tax_id'])
    . ' [' . $receipt['branch_code'] . ']', 65, "\n", false));

  // 70
  $addr = explode("\n", wordwrap($receipt['branch_name'] . ' ' . $receipt['addr'], 70, "\n", false));
  if ($receipt['mem_code']=='000000') {
    $from = ['เงินสด', ''];
    $addr = $receipt['addr'];
  }

  $remark = ($receipt['payin']+0 > 0 ? '*** PAY-IN ***' . ($receipt['remark'] != '' ? ' ' : '') : '') . $receipt['remark'];

  $obj = array(
    'from1' => trim($from[0]),
    'from2' => isset($from[1]) ? trim($from[1]) : '',
    'addr1' => trim($addr[0]),
    'addr2' => isset($addr[1]) ? trim($addr[1]) : '',
    'code' => $receipt_code,
    'date' => thDate($receipt['issue_date']),
    'date2' => '',
    'qty' => 'จำนวน',
    'price' => 'ราคา/หน่วย',
    'total' => substr('            ' . number_format($receipt['amount'], 2), -13),
    'vat_rate' => number_format($receipt['vat_rate'],2),
    'vat_amount' => substr('             ' . number_format($receipt['vat_amount'],2), -13),
    'grand_total' => substr('            ' . number_format($receipt['total_amount'], 2), -13),
    'baht_text' => '***' . bahtText($receipt['total_amount']+0) . '***',
    'remark' => $remark,
    'cash_chk' => $receipt['cash']+0 > 0 ? 'X' : '',
    'cheque_chk' => $receipt['cheque']+0 > 0 ? 'X' : '',
    'cheque1' => $receipt['cheque_bank'],
    'cheque2' => $receipt['cheque_branch'],
    'cheque_no' => $receipt['cheque_number'],
    'cheque_date' => $receipt['cheque_date'] != '0000-00-00' ? thDate($receipt['cheque_date']) : thDate($receipt['issue_date']),
  );
  $len = count($items);
  for ($i = 0; $i < 5; $i++) {
    if ($i < $len) {
      $obj['line_' . ($i+1) . '_1'] = $items[$i]['prod_code'];
      $obj['line_' . ($i+1) . '_2'] = $items[$i]['detail'];
      $obj['line_' . ($i+1) . '_3'] = substr('   ' . number_format($items[$i]['qty'], 0), -3);
      $obj['line_' . ($i+1) . '_4'] = substr('       ' . number_format($items[$i]['price'], 2), -7);
      $obj['line_' . ($i+1) . '_5'] = substr('             ' . number_format($items[$i]['amount'], 2), -13);
    } else {
      $obj['line_' . ($i+1) . '_1'] = '';
      $obj['line_' . ($i+1) . '_2'] = '';
      $obj['line_' . ($i+1) . '_3'] = '';
      $obj['line_' . ($i+1) . '_4'] = '';
      $obj['line_' . ($i+1) . '_5'] = '';
    }
  }
  return $obj;
}

function doBusCallList($param) {
  global $pdo;

   $status = !is_array($param['status']) ? array($param['status']) : $param['status'];
  if (in_array('DONE', $status) || in_array('CANCEL', $status)) {
    $interval = '2 DAY';
    $sort='DESC';

	$sqlCon = " AND b.flight_landing >= NOW() - INTERVAL " . $interval . "
				ORDER BY b.flight_landing " . $sort;

  } else {

	$sort='ASC';

	$sqlCon = " ORDER BY b.flight_landing " . $sort;

  }
  $status_list = "'" . implode("', '", $status) . "'";

  $sql = "SELECT b.*, i.flight, m.name_en name,i.ref_code, i.is_domestic
FROM buscall b
  JOIN inform i ON b.inform_code=i.code
  JOIN member m ON i.mem_code=m.code
WHERE b.airport=:airport
  AND i.airport=:airport
  AND i.status IN ('PAID','DONE')
  AND b.status IN (" . $status_list . ") " . $sqlCon;
//echo $sql;
//echo $sql . PHP_EOL;
  $stmt = $pdo->prepare($sql);
  $stmt->execute(array(
    ':airport' => $_SESSION['station']['airport'],
  ));
  $buscall = array();
  while ($row = $stmt->fetch()) {
    $buscall[] = $row;
  }

  responseJson(array(
    'status' => true,
    'buscall' => $buscall,
    'sqlqurey' => $sql,
  ));
}

function doBusCallUpdate($param) {
  global $pdo;

  if ($param['status'] == 'READY') {
    $stmt = $pdo->prepare("UPDATE buscall SET status=:status, ready_time=NOW(), ready_by=:ready_by WHERE uuid=:uuid");
    $stmt->execute(array(
      ':status' => $param['status'],
      ':uuid' => $param['uuid'],
      ':ready_by' => $_SESSION['staff']['user'],
    ));
  } elseif ($param['status'] == 'CALL') {
    $stmt = $pdo->prepare("UPDATE buscall SET status=:status, call_time=if(num_call=0,NOW(),call_time), num_call=num_call+1 WHERE uuid=:uuid");
    $stmt->execute(array(
      ':status' => $param['status'],
      ':uuid' => $param['uuid'],
    ));
  } elseif ($param['status'] == 'DONE') {
    $stmt = $pdo->prepare("UPDATE buscall SET status=:status, done_time=NOW(), done_by=:done_by WHERE uuid=:uuid");
    $stmt->execute(array(
      ':status' => $param['status'],
      ':uuid' => $param['uuid'],
      ':done_by' => $_SESSION['staff']['user'],
    ));
  } else {
    // CANCEL
    $stmt = $pdo->prepare("UPDATE buscall SET status=:status WHERE uuid=:uuid");
    $stmt->execute(array(
      ':status' => $param['status'],
      ':uuid' => $param['uuid'],
    ));
  }


  responseJson(array(
    'status' => true,
  ));
}

function doBusCallClose($param) {
  global $pdo;

  try {
    $pdo->beginTransaction();

    $stmt = $pdo->prepare("UPDATE buscall SET status='DONE', done_time=NOW(), done_by=:done_by WHERE code=:code");
    $res = $stmt->execute(array(
      ':code' => $param['code'],
      ':done_by' => $_SESSION['staff']['user'],
    ));

    $stmt = $pdo->prepare("UPDATE inform SET status='DONE' WHERE code=:code");
    $stmt->execute(array(
      ':code' => substr($param['code'], 0, 20),
    ));

    $stmt = $pdo->prepare("SELECT b.*, i.flight, m.name_en AS name "
      . "FROM buscall b JOIN inform i ON b.inform_code=i.code "
      . "JOIN member m ON i.mem_code=m.code "
      . "WHERE b.code=:code");
    $stmt->execute(array(
      ':code' => $param['code'],
    ));
    $buscall = $stmt->fetch();

    $pdo->commit();
  } catch (Exception $e) {
    $pdo->rollback();
    responseJson(array(
      'status' => false,
      'reason' => 'ERR_UNKNOWN',
      'error' => $e->errorInfo,
    ));
  }
  responseJson(array(
    'status' => true,
    'buscall' => $buscall,
  ));
}

function doCallQueueAdd($param){
  global $pdo;

  $stmt = $pdo->prepare("SELECT 1 FROM callqueue WHERE buscall_code=:code AND is_play='NO'");
  $stmt->execute(array(
    ':code' => $param['code'],
  ));

  $found = $stmt->fetchColumn();
  if ($found==1) {
    responseJson(array(
      'status' => true,
      'hasCallQueue' => true,
    ));
  }
  try {
    $pdo->beginTransaction();

    $stmt = $pdo->prepare("SELECT * FROM buscall WHERE code=:code");
    $stmt->execute(array(
      ':code' => $param['code'],
    ));
    $buscall = $stmt->fetch();

    if ($buscall['num_call']+0 == 0) {
//      $stmt = $pdo->prepare("UPDATE buscall SET num_call=1, call_time=NOW(), status='CALL' WHERE code=:code");
      $stmt = $pdo->prepare("UPDATE buscall SET num_call=1, call_time=NOW(), last_call_time=NOW(), status='CALL' WHERE code=:code");
      $stmt->execute(array(
        ':code' => $buscall['code'],
      ));
    } else {
//      $stmt = $pdo->prepare("UPDATE buscall SET num_call=num_call+1 WHERE code=:code");
      $stmt = $pdo->prepare("UPDATE buscall SET num_call=num_call+1, last_call_time=NOW() WHERE code=:code");
      $stmt->execute(array(
        ':code' => $buscall['code'],
      ));
    }

    $code = _getNextCode('callqueue', 'code', $param['code'].'-', 2, 1);

    $stmt = $pdo->prepare("INSERT INTO callqueue SET code=:code, airport=:airport, buscall_code=:buscall_code, "
      . "license=:license, call_by=:call_by, call_time=NOW(), play_time='0000-00-00', is_play='NO', "
      . "uuid=upper(uuid())");
    $stmt->execute(array(
      ':code' => $code,
      ':airport' => $_SESSION['station']['airport'],
      ':buscall_code' => $param['code'],
      ':license' => $param['license'],
      ':call_by' => $_SESSION['staff']['user'],
    ));

    $pdo->commit();
  } catch(Exception $e) {
    responseJson(array(
      'status' => false,
      'reason' => 'ERR_UNKNOWN',
      'error' => $e->errorInfo,
    ));
  }

  responseJson(array(
    'status' => true,
    'hasCallQueue' => false,
  ));
}

function doCallQueueList($param) {
  global $pdo;

  $stmt = $pdo->prepare("SELECT * FROM callqueue WHERE airport=:airport AND is_play='NO' ORDER BY call_time ASC");
  $stmt->execute(array(
    ':airport' => $_SESSION['station']['airport'],
  ));

  responseJson(array(
    'status' => true,
    'callqueue' => $stmt->fetchAll(),
  ));
}

function doCallQueueNext($param) {
  global $pdo;

  try {
    $pdo->beginTransaction();
    $stmt = $pdo->prepare("SELECT code,license FROM callqueue WHERE airport=:airport AND is_play='NO' ORDER BY call_time ASC LIMIT 1");
    $stmt->execute(array(
      ':airport' => $_SESSION['station']['airport'],
    ));
    $callqueue = $stmt->fetch();
    if (!$callqueue) {
      $pdo->rollback();
      responseJson(array(
        'status' => true,
        'callqueue' => false,
      ));
    }
    $stmt = $pdo->prepare("UPDATE callqueue SET play_time=NOW(), is_play='YES' WHERE code=:code");
    $stmt->execute(array(
      ':code' => $callqueue['code'],
    ));
    $pdo->commit();
  } catch (Exception $e) {
    $pdo->rollback();
    responseJson(array(
      'status' => false,
      'reason' => 'ERR_UNKNOWN',
      'error' => $e->errorInfo,
    ));
  }
  responseJson(array(
    'status' => true,
    'callqueue' => $callqueue,
  ));
}

function doReceiptAddressUpdate($param) {
  global $pdo;

  $stmt = $pdo->prepare("UPDATE receipt SET branch_code=:branch_code, branch_name=:branch_name, addr=:addr, updated_by=:updated_by, updated_time=NOW() WHERE code=:code");
  $res = $stmt->execute(array(
    ':branch_code' => $param['address']['code'],
    ':branch_name' => $param['address']['name'],
    ':addr' => $param['address']['addr'],
    ':code' => $param['code'],
    ':updated_by' => $_SESSION['staff']['id'],
  ));
  if (!$res) {
    responseJson(array(
      'status' => false,
      'reason' => 'ERR_UNKNOWN',
      'error' => $stmt->errorInfo(),
    ));
  }
  responseJson(array(
    'status' => true,
  ));
}

function doReceiptSave($param) {
  global $pdo;
  $staff_id = $_SESSION['staff']['id'];
  try {
    $pdo->beginTransaction();
    // 3. create receipt
    $data = array(
      'issue_date' => $param['issue_date'],
      'mem_code' => $param['mem_code'],
      'address' => $param['address'],
      'cheque' => $param['cheque']+0,
      'payin' => $param['payin']+0,
      'cheque_bank' => $param['cheque_bank'],
      'cheque_branch' => $param['cheque_branch'],
      'cheque_number' => $param['cheque_number'],
      'cheque_date' => $param['cheque_date'],
      'wht_rate' => $param['wht_rate'],
      'inv_code' => $param['inv_code'],
      'cancel_reason' => $param['reason'],
      'items' => array(),
    );
    foreach ($param['items'] as $item) {
      if ($item['prod_code']=='') {
        continue;
      }
      $data['items'][] = array(
        'prod_code' => $item['prod_code'],
        'qty' => $item['qty'],
      );
    }

    $receipt_code = _createReceipt($data);

    if ($param['inv_code'] != ''){
        //echo "Hello!!";
        $stmt = $pdo->prepare("UPDATE invoice SET receipt_code=:receiptCode, status='PAID', updated_time=NOW(), updated_by=$staff_id WHERE code=:invoiceCode");
        $res = $stmt->execute(array(
      ':receiptCode' => $receipt_code,
      ':invoiceCode' => $param['inv_code'],
      ));
      if (!$res) {
      $pdo->rollback();
      responseJson(array(
        'status' => false,
      ));
      }
    }

    $scock_out = array();
    $scock_cancel_out = array();
    foreach ($param['items'] as $productList) {
      if ($productList['prod_code']=='') {
          continue;
      }
      if(($productList['prod_code']=='OF'
        ||$productList['prod_code']=='OF1'
        ||$productList['prod_code']=='OF2'
        ||$productList['prod_code']=='OFD'
        ||$productList['prod_code']=='SH1'
        ||$productList['prod_code']=='SH2'
        ||$productList['prod_code']=='SHD'
        ||$productList['prod_code']=='OFN'
        ||$productList['prod_code']=='SHN')
        &&$productList['flage']=='N') {
        //$scock_out = _scockOut($productList['prod_code'],$productList['qty'],$param['mem_code'],$receipt_code);
        array_push($scock_out, $productList);
      }elseif(($productList['prod_code']=='OF'
        ||$productList['prod_code']=='OF1'
        ||$productList['prod_code']=='OF2'
        ||$productList['prod_code']=='OFD'
        ||$productList['prod_code']=='SH1'
        ||$productList['prod_code']=='SH2'
        ||$productList['prod_code']=='SHD'
        ||$productList['prod_code']=='OFN'
        ||$productList['prod_code']=='SHN')
        &&$productList['flage']=='C') {
        array_push($scock_cancel_out, $productList);
      }
    }
    $memberCode = $param['mem_code'];
    $check_item_list = array();
    foreach ($param['items'] as $productList) {
        if ($productList['prod_code']=='') {
            continue;
        }
        array_push($check_item_list, $productList['prod_code']);
    }
    //print_r($check_item_list);
    if (in_array("OF1", $check_item_list)||in_array("OF2", $check_item_list)||
        in_array("OFD", $check_item_list)||in_array("SH1", $check_item_list)||
        in_array("SH2", $check_item_list)||in_array("SHD", $check_item_list)||
        in_array("OFN", $check_item_list)||in_array("SHN", $check_item_list)||
        in_array("OF", $check_item_list))
        {
            $stocks_out = _scockOut($scock_out,$memberCode,$receipt_code);
            $stocks_cancel_out = _scockCancelOut($scock_cancel_out,$memberCode,$receipt_code);
            if($stocks_out == 0 && $stocks_cancel_out == 0){
                throw new Exception('ERR_NOT_INSERT_LOT_OUT');
            }
        }

    $pdo->commit();
  } catch (Exception $e) {
    $pdo->rollback();
    responseJson(array(
      'status' => false,
      'reason' => 'ERR_UNKNOWN',
      'error' => $e->errorInfo,
      'error2' => $e->getMessage(),
    ));
  }
  responseJson(array(
    'status' => true,
    'receipt_code' => $receipt_code,
    'stock_out' => $stocks_out,
    'stock_out_cancel' => $stocks_cancel_out,
    'item' => $data['items'],
    'mem' => $memberCode,
  ));
}

function doReceiptCancel($param) {
  global $pdo;

  try {
    $pdo->beginTransaction();
    $stmt = $pdo->prepare("UPDATE receipt SET status='CANCELLED', cancel_by=:cancel_by, cancel_reason=:reason WHERE code=:code");
    $stmt->execute(array(
      ':cancel_by' => $_SESSION['staff']['user'],
      ':code' => $param['code'],
      ':reason' => $param['reason'],
    ));

    $stmt = $pdo->prepare("UPDATE lot_out SET status='CANCEL' WHERE receipt_code=:code");
    $stmt->execute(array(
      ':code' => $param['code'],
    ));

    $stmt = $pdo->prepare("INSERT INTO lot_cancel (prod_code, issue_date, in_qty, start_item, aval_qty, next_item, prefix_code, "
                         ."book_no, book_qty, created_at, created_by, updated_at, updated_by, uuid, airport) "
                         ."select lt.prod_code, lt.issue_date, lt.out_qty, lt.start_item, lt.out_qty, lt.start_item, "
                         ."li.prefix_code,'0','0',NOW(),'0',NOW(),'0',upper(uuid()),li.airport "
                         ."from lot_out lt inner join lot_in li on lt.lot_inid=li.id where lt.receipt_code=:code and lt.status='CANCEL'");
    $stmt->execute(array(
      ':code' => $param['code'],
    ));
    $id = $pdo->lastInsertId();

    $stmt = $pdo->prepare("UPDATE lot_cancel SET real_id=:id WHERE id=:id");
    $stmt->execute(array(
      ':id' => $id,
    ));

    $pdo->commit();
  } catch (Exception $e) {
    responseJson(array(
      'status' => false,
      'reason' => 'ERR_UNKNOWN',
      'error' => $e,
    ));
  }
  responseJson(array(
    'status' => true,
  ));
}

function doPeriodCheck($param) {
  global $pdo;

  $stmt = $pdo->prepare("SELECT count(*) cnt FROM receipt WHERE period_code=:period_code AND status='PAID'");
  $stmt->execute(array(
    ':period_code' => $_SESSION['period']['code'],
  ));
  $num_receipt = $stmt->fetchColumn();
  responseJson(array(
    'status' => true,
    'num_receipt' => $num_receipt,
  ));
}

function doPeriodClose($param) {
  global $pdo;
  $period_code = str_replace("-", "", $param['selectperiod']);
  try {
    $pdo->beginTransaction();


    list($y, $m, $d) = explode('-', $_SESSION['period']['p_date']);
    $next_day = date('Y-m-d', mktime(0, 0, 0, $m+0, $d+1, $y));

    if ($_SESSION['period']['p_type'] == 'DAY') {
        $dayOfWeek = date('w', strtotime($_SESSION['period']['p_date']));
        if($dayOfWeek == 5 || $dayOfWeek == '5'){
            $next_day = date('Y-m-d', mktime(0, 0, 0, $m+0, $d+3, $y));
        }
      $type='DAY';
      $from=$next_day . ' 00:00:00';
      $to =$next_day . ' 23:59:59';
      $date = $next_day;
      $code = $_SESSION['station']['code'] . substr(str_replace('-', '', $date), -6) . 'D';
    } elseif ($_SESSION['period']['p_type']=='AM') {
      $type='PM';
      $from=substr($_SESSION['period']['p_from'], 0, 10) . ' 19:00:00';
      $to=$next_day . ' 07:59:59';
      $date = $_SESSION['period']['p_date'];
      $code = $_SESSION['station']['code'] . substr(str_replace('-', '', $date), -6) . 'N';
    } elseif ($_SESSION['period']['p_type']=='PM') {
      $type='AM';
      $from=$next_day . ' 08:00:00';
      $to=$next_day . ' 18:59:59';
      $date = $next_day;
      $code = $_SESSION['station']['code'] . substr(str_replace('-', '', $date), -6) . 'M';
    }

	// if (isset($param['p_code'])) {
 //      $p_codes = $param['p_code'];
 //    } elseif (isset($param['station_code'])) {
 //      $p_codes = $param['station_code'] . substr(str_replace('-', '', $date), 2) .
 //        ($_SESSION['period']['p_type'] == 'AM' ? 'M' : ($_SESSION['period']['p_type']=='PM' ? 'N' : 'D'));
 //    } else {
 //      $p_codes = $_SESSION['station']['code'] . substr(str_replace('-', '', $date), 2) .
 //        ($_SESSION['period']['p_type'] == 'AM' ? 'M' : ($_SESSION['period']['p_type']=='PM' ? 'N' : 'D'));
 //    }
 //    $period_code = $p_codes;
	$bank_account = array(
      'HQ' => array('code' => '111204', 'name' => 'เงินฝากธนาคาร S/A กสิกรไทย พัฒนพงศ์ 018-2-77615-7'),
      'HO' => array('code' => '111204', 'name' => 'เงินฝากธนาคาร S/A กสิกรไทย พัฒนพงศ์ 018-2-77615-7'),
      'SU' => array('code' => '111205', 'name' => 'เงินฝากธนาคาร S/A ทหารไทย ท่าอากาศยาน 012-2-67293-4'),
      'DM' => array('code' => '111209', 'name' => 'เงินฝากธนาคาร S/A กรุงเทพ ดอนเมือง 225-0-70703-7'),
      'NS' => array('code' => '111204', 'name' => 'เงินฝากธนาคาร S/A กสิกรไทย พัฒนพงศ์ 018-2-77615-7'),
    );
    $acc_bank = $bank_account[substr($period_code,2,2)]['code'];
    $acc_wht = '191002';
    $acc_vat = '211001';

	$stmt = $pdo->prepare("SELECT IFNULL(min(r.code),'-') fCode, IFNULL(max(r.code),'-') lCode, count(distinct r.code) codeQty,
								 IFNULL(sum(if(a.code=:acc_bank, r.total_amount, if(a.code=:acc_wht, r.wht_amount, 0))),0) debit
								, IFNULL(sum(if(a.code=:acc_vat, r.vat_amount, 0)),0) credit
							FROM account a, receipt r
							WHERE a.code IN (:acc_bank,:acc_wht,:acc_vat)
								AND r.period_code=:period_code
								AND r.status='PAID'");
      $stmt->execute(array(
        ':period_code' => $period_code,
        ':acc_bank' => $acc_bank,
        ':acc_wht' => $acc_wht,
        ':acc_vat' => $acc_vat,
      ));
	  $acc_sum = $stmt->fetch();
	  $fCode = $acc_sum['fCode'];
	  $lCode = $acc_sum['lCode'];
	  $amount_debit = $acc_sum['debit'];
	  $codeQty = $acc_sum['codeQty'];

  //  1. close active period  is_active = 'NO',
    $stmt = $pdo->prepare("UPDATE period SET is_active = 'NO', receipt_from = :fCode, receipt_to = :lCode, receipt_count = :codeQty, receipt_amount = :amount WHERE is_active='YES' and station_code=:station_code");
    $stmt->execute(array(
      ':station_code' => $_SESSION['station']['code'],
      ':fCode' => $acc_sum['fCode'],
      ':lCode' => $acc_sum['lCode'],
      ':amount' => $acc_sum['debit'],
      ':codeQty' => $acc_sum['codeQty'],
    ));
// 2. Update receipt is post=YES
    $stmt = $pdo->prepare("UPDATE receipt SET is_post = 'YES' WHERE period_code=:period");
    $stmt->execute(array(
      ':period' => $period_code,
    ));
// 3. insert period
    $stmt = $pdo->prepare("INSERT INTO period SET code=:code, station_code=:station_code, p_date=:p_date, "
      . "p_type=:p_type, p_from=:p_from, p_to=:p_to, is_active='YES', is_post='NO', uuid=upper(uuid()) "
      . "ON DUPLICATE KEY UPDATE is_active='YES'");
    $stmt->execute(array(
      ':code' => $code,
      ':station_code' => $_SESSION['station']['code'],
      ':p_date' => $date,
      ':p_type' => $type,
      ':p_from' => $from,
      ':p_to' => $to,
    ));
    $period = _getActivePeriodByStationCode($_SESSION['station']['code']);

     $pdo->commit();
  } catch (Exception $e) {
    $pdo->rollback();
    responseJson(array(
      'status' => false,
      'reason' => 'ERR_UNKNOWN',
      'error' => $e->errorInfo,
    ));
  }
  responseJson(array(
    'status' => true,
    'period' => $period,
    'result1' => $period_code,
    'result2' => $fCode,
    'result3' => $lCode,
    'result4' => $amount_debit,
  ));
}

function doReport($param) {
  global $pdo;

  $report = $param['report'];
  $out = false;
  if (!in_array($report, array('receipt_summary', 'receive_voucher', 'receipt_list', 'inform_list', 'coupon_list','inform_list1'
    , 'card_tx_list', 'output_tax', 'meeting_sign', 'member_list', 'member_detail', 'member_record','statistic_by_nation'
	, 'statistic_by_member', 'statistic_by_nation_member', 'statistic_by_member_nation', 'statistic_by_year_nation'
	, 'statistic_by_year_member', 'statistic_by_month_nation', 'statistic_by_month_member', 'receive_voucher_tax','payment','payment1',
	  'inform_list_nopaid', 'arrearage', 'labal_report','labal_report2', 'member_data', 'member_datadetail', 'sportCheckPrint','receipt_list1'))) {
    responseJson(array(
      'status' => false,
      'reason' => 'ERR_REPORT_NOT_FOUND',
    ));
  }
  $data = array(
    'report' => $param['report'],
    'repFile' => $param['report'] . '.jasper',
    'param' => array(),
  );
  if (in_array($report, array('receipt_summary', 'receive_voucher', 'receipt_list', 'coupon_list', 'inform_list'))) {

	if (isset($param['p_code'])) {
      $p_code = $param['p_code'];
    } elseif (isset($param['station_code'])) {
      $p_code = $param['station_code'] . substr(str_replace('-', '', $param['p_date']), 2) .
        ($param['p_type'] == 'AM' ? 'M' : ($param['p_type']=='PM' ? 'N' : 'D'));
    } else {
      $p_code = $_SESSION['station']['code'] . substr(str_replace('-', '', $param['p_date']), 2) .
        ($param['p_type'] == 'AM' ? 'M' : ($param['p_type']=='PM' ? 'N' : 'D'));
    }
  if ($param['airport']=='HO'||$param['airport']=='HQ'){
    $p_code = '01HO' . substr(str_replace('-', '', $param['p_date']), 2) . 'D';
        //($param['p_type'] == 'AM' ? 'M' : ($param['p_type']=='PM' ? 'N' : 'D'));
  }
    //echo $p_code;
    $data['param']['period_code'] = $p_code;
  }

  if ($report=='receive_voucher') {
    $bank_account = array(
      'HO' => array('code' => '111204', 'name' => 'เงินฝากธนาคาร S/A กสิกรไทย พัฒนพงศ์ 018-2-77615-7'),
      'SU' => array('code' => '111205', 'name' => 'เงินฝากธนาคาร S/A ทหารไทย ท่าอากาศยาน 012-2-67293-4'),
      'DM' => array('code' => '111209', 'name' => 'เงินฝากธนาคาร S/A กรุงเทพ ดอนเมือง 225-0-70703-7'),
      'NS' => array('code' => '111204', 'name' => 'เงินฝากธนาคาร S/A กสิกรไทย พัฒนพงศ์ 018-2-77615-7'),
      'HQ' => array('code' => '111204', 'name' => 'เงินฝากธนาคาร S/A กสิกรไทย พัฒนพงศ์ 018-2-77615-7'),
    );
    $data['param']['acc_bank'] = $bank_account[substr($p_code,2,2)]['code'];
    $data['param']['acc_wht'] = '191002';
    $data['param']['acc_vat'] = '211001';
  }elseif ($report=='inform_list1'){
  	if (isset($param['p_code'])) {
      $p_code = $param['p_code'];
	  $p_counter = '';
    }
    elseif ($param['airport'] == 'DMK') {
      if (isset($param['station_code'])&&$param['station_code']!='All') {
        if($param['p_type'] == 'All'){
          $p_code =
          "'".$param['station_code'] . substr(str_replace('-', '', $param['p_date']), 2).'N'."'".','.
          "'".$param['station_code'] . substr(str_replace('-', '', $param['p_date']), 2).'M'."'".','.
          "'".$param['station_code'] . substr(str_replace('-', '', $param['p_date']), 2).'D'."'";
		  $p_counter = '';
          $p_countName = $param['station_code'];
          $p_date = $param['p_date']; $shift = $param['p_type'];
            //($param['p_type'] == 'AM' ? 'M' : ($param['p_type']=='PM' ? 'N' : 'D'));
        }else {
          $p_code = "'".$param['station_code'] . substr(str_replace('-', '', $param['p_date']), 2).
          ($param['p_type'] == 'AM' ? 'M' : ($param['p_type']=='PM' ? 'N' : 'D'))."'";
		  $p_counter = '';
          $p_countName = $param['station_code'];
          $p_date = $param['p_date']; $shift = $param['p_type'];
        }

      }elseif (isset($param['station_code'])&&$param['station_code']=='All') {
        if($param['p_type'] == 'All'){
          $counter = array('01DM','02DM','03DM','04DM','05DM','06DM','07DM');
          $p_code = '';
            foreach ($counter as $counters) {
             $p_code =  $p_code ."'".$counters . substr(str_replace('-', '', $param['p_date']), 2).'N'."'".','.
                        "'".$counters . substr(str_replace('-', '', $param['p_date']), 2).'M'."'".','.
                        "'".$counters . substr(str_replace('-', '', $param['p_date']), 2).'D'."'".',';
            }
            $p_code = $p_code."'".'01DM'."'";
			$p_counter = '';
            $p_countName = 'All';
            $p_date = $param['p_date']; $shift = $param['p_type'];
        }else {
        	$counter = array('01DM','02DM','03DM','04DM','05DM','06DM','07DM');
			$p_code = '';
			foreach($counter as $counters){
				$p_code =
				$p_code."'".'01DM' . substr(str_replace('-', '', $param['p_date']), 2) .
          		($param['p_type'] == 'AM' ? 'M' : ($param['p_type']=='PM' ? 'N' : 'D'))."'".',';
			}
			$p_code = $p_code."'".'01DM'."'";
			$p_counter = '';
            $p_countName = 'All';
            $p_date = $param['p_date']; $shift = $param['p_type'];
        }

      } else {
        if($param['p_type'] == 'All'){
          $p_code =
          "'".$_SESSION['station']['code'] . substr(str_replace('-', '', $param['p_date']), 2).'N'."'".','.
          "'".$_SESSION['station']['code'] . substr(str_replace('-', '', $param['p_date']), 2).'M'."'".','.
          "'".$_SESSION['station']['code'] . substr(str_replace('-', '', $param['p_date']), 2).'D'."'";
		  $p_counter = '';
          $p_countName = $_SESSION['station']['code'];
          $p_date = $param['p_date']; $shift = $param['p_type'];
        }else {
          $p_code = "'".$_SESSION['station']['code'] . substr(str_replace('-', '', $param['p_date']), 2) .
            ($param['p_type'] == 'AM' ? 'M' : ($param['p_type']=='PM' ? 'N' : 'D'))."'";
			$p_counter = '';
            $p_countName = $_SESSION['station']['code'];
            $p_date = $param['p_date']; $shift = $param['p_type'];
        }

      }
    }
	elseif ($param['airport'] == 'BKK') {
      if(isset($param['station_code'])&&$param['station_code']!='All'&&(in_array($param['station_code'],array('01SU','03SU','04SU','14SU','15SU')))){
      	$counter = array('01SU','03SU','04SU','14SU','15SU');
		if($param['p_type'] == 'All'){
			$p_code = '';
            foreach ($counter as $counters) {
             $p_code =  $p_code ."'".$counters . substr(str_replace('-', '', $param['p_date']), 2).'N'."'".','.
                        "'".$counters . substr(str_replace('-', '', $param['p_date']), 2).'M'."'".','.
                        "'".$counters . substr(str_replace('-', '', $param['p_date']), 2).'D'."'".',';
            }
            $p_code = $p_code."'".'01XX'."'";
			$p_counter = 'Counter B';
			$p_countName = 'Counter B';
            $p_date = $param['p_date']; $shift = $param['p_type'];
		}else{
			$p_code = '';
			foreach($counter as $counters){
				$p_code =
				$p_code."'".$counters . substr(str_replace('-', '', $param['p_date']), 2) .
          		($param['p_type'] == 'AM' ? 'M' : ($param['p_type']=='PM' ? 'N' : 'D'))."'".',';
			}

			$p_code = $p_code."'".'01XX'."'";
			$p_counter = 'Counter B';
            $p_countName = 'Counter B';
            $p_date = $param['p_date']; $shift = $param['p_type'];
		}

      }elseif(isset($param['station_code'])&&$param['station_code']!='All'&&(in_array($param['station_code'],array('02SU','05SU','16SU','17SU')))){
      	$counter = array('02SU','05SU','16SU','17SU');
		if($param['p_type'] == 'All'){
			$p_code = '';
            foreach ($counter as $counters) {
             $p_code =  $p_code ."'".$counters . substr(str_replace('-', '', $param['p_date']), 2).'N'."'".','.
                        "'".$counters . substr(str_replace('-', '', $param['p_date']), 2).'M'."'".','.
                        "'".$counters . substr(str_replace('-', '', $param['p_date']), 2).'D'."'".',';
            }
            $p_code = $p_code."'".'01XX'."'";
			$p_counter = 'Counter C';
			$p_countName = 'Counter C';
            $p_date = $param['p_date']; $shift = $param['p_type'];
		}else{
			$p_code = '';
			foreach($counter as $counters){
				$p_code =
				$p_code."'".$counters . substr(str_replace('-', '', $param['p_date']), 2) .
          		($param['p_type'] == 'AM' ? 'M' : ($param['p_type']=='PM' ? 'N' : 'D'))."'".',';
			}

			$p_code = $p_code."'".'01XX'."'";
			$p_counter = 'Counter C';
            $p_countName = 'Counter C';
            $p_date = $param['p_date']; $shift = $param['p_type'];
		}

      }elseif(isset($param['station_code'])&&$param['station_code']!='All'&&(!in_array($param['station_code'],array('02SU','05SU','16SU',
      '17SU','01SU','03SU','14SU','15SU','04SU')))){
      	if($param['p_type'] == 'All'){
          $p_code =
          "'".$param['station_code'] . substr(str_replace('-', '', $param['p_date']), 2).'N'."'".','.
          "'".$param['station_code'] . substr(str_replace('-', '', $param['p_date']), 2).'M'."'".','.
          "'".$param['station_code'] . substr(str_replace('-', '', $param['p_date']), 2).'D'."'";
            //($param['p_type'] == 'AM' ? 'M' : ($param['p_type']=='PM' ? 'N' : 'D'));
          $p_counter = '';
          $p_countName = $param['station_code'];
          $p_date = $param['p_date']; $shift = $param['p_type'];
        }else {
          $p_code = "'".$param['station_code'] . substr(str_replace('-', '', $param['p_date']), 2).
          ($param['p_type'] == 'AM' ? 'M' : ($param['p_type']=='PM' ? 'N' : 'D'))."'";
		  $p_counter = '';
          $p_countName = $param['station_code'];
          $p_date = $param['p_date']; $shift = $param['p_type'];
        }
      }elseif (isset($param['station_code'])&&$param['station_code']=='All') {
        if($param['p_type'] == 'All'){
          $counter = array('01SU','02SU','03SU','04SU','05SU','06SU','07SU','08SU','09SU','10SU','11SU','12SU','13SU','14SU','15SU'
		  ,'16SU','17SU','18SU','19SU','20SU','21SU','22SU','23SU','24SU');
          $p_code = '';
            foreach ($counter as $counters) {
             $p_code =  $p_code ."'".$counters . substr(str_replace('-', '', $param['p_date']), 2).'N'."'".','.
                        "'".$counters . substr(str_replace('-', '', $param['p_date']), 2).'M'."'".','.
                        "'".$counters . substr(str_replace('-', '', $param['p_date']), 2).'D'."'".',';
            }
            $p_code = $p_code."'".'01SU'."'";
			$p_counter = '';
            $p_countName = 'All';
            $p_date = $param['p_date']; $shift = $param['p_type'];
        }else {
        	$counter = array('01SU','02SU','03SU','04SU','05SU','06SU','07SU','08SU','09SU','10SU','11SU','12SU','13SU','14SU','15SU'
		  ,'16SU','17SU','18SU','19SU','20SU','21SU','22SU','23SU','24SU');
			$p_code = '';
			foreach($counter as $counters){
				$p_code =
				$p_code."'".$counters . substr(str_replace('-', '', $param['p_date']), 2) .
          		($param['p_type'] == 'AM' ? 'M' : ($param['p_type']=='PM' ? 'N' : 'D'))."'".',';
			}

			$p_code = $p_code."'".'01SU'."'";
			$p_counter = '';
            $p_countName = 'All';
            $p_date = $param['p_date']; $shift = $param['p_type'];
        }

      } else {
        if($param['p_type'] == 'All'){
          $p_code =
          "'".$_SESSION['station']['code'] . substr(str_replace('-', '', $param['p_date']), 2).'N'."'".','.
          "'".$_SESSION['station']['code'] . substr(str_replace('-', '', $param['p_date']), 2).'M'."'".','.
          "'".$_SESSION['station']['code'] . substr(str_replace('-', '', $param['p_date']), 2).'D'."'";
		  $p_counter = '';
          $p_countName = $_SESSION['station']['code'];
          $p_date = $param['p_date']; $shift = $param['p_type'];
        }else {
          $p_code = "'".$_SESSION['station']['code'] . substr(str_replace('-', '', $param['p_date']), 2) .
            ($param['p_type'] == 'AM' ? 'M' : ($param['p_type']=='PM' ? 'N' : 'D'))."'";
			$p_counter = '';
            $p_countName = $_SESSION['station']['code'];
            $p_date = $param['p_date']; $shift = $param['p_type'];
        }

      }
    }
	elseif ($param['airport'] == 'HQ') {
      if (isset($param['station_code'])&&$param['station_code']!='All') {
        if($param['p_type'] == 'All'){
          $p_code =
          "'".$param['station_code'] . substr(str_replace('-', '', $param['p_date']), 2).'N'."'".','.
          "'".$param['station_code'] . substr(str_replace('-', '', $param['p_date']), 2).'M'."'".','.
          "'".$param['station_code'] . substr(str_replace('-', '', $param['p_date']), 2).'D'."'";
		  $p_counter = '';
          $p_countName = $param['station_code'];
          $p_date = $param['p_date']; $shift = $param['p_type'];
            //($param['p_type'] == 'AM' ? 'M' : ($param['p_type']=='PM' ? 'N' : 'D'));
        }else {
          $p_code = "'".$param['station_code'] . substr(str_replace('-', '', $param['p_date']), 2).
          ($param['p_type'] == 'AM' ? 'M' : ($param['p_type']=='PM' ? 'N' : 'D'))."'";
          $p_counter = '';
          $p_countName = $param['station_code'];
          $p_date = $param['p_date']; $shift = $param['p_type'];
        }

      }elseif (isset($param['station_code'])&&$param['station_code']=='All') {
        if($param['p_type'] == 'All'){
          $counter = array('01HQ','02HQ','03HQ','04HQ','05HQ','06HQ','07HQ','08HQ','09HQ','10HQ');
          $p_code = '';
            foreach ($counter as $counters) {
             $p_code =  $p_code ."'".$counters . substr(str_replace('-', '', $param['p_date']), 2).'N'."'".','.
                        "'".$counters . substr(str_replace('-', '', $param['p_date']), 2).'M'."'".','.
                        "'".$counters . substr(str_replace('-', '', $param['p_date']), 2).'D'."'".',';
            }
            $p_code = $p_code."'".'01HQ'."'";
			$p_counter = '';
            $p_countName = 'All';
            $p_date = $param['p_date']; $shift = $param['p_type'];
        }else {
        	$counter = array('01HQ','02HQ','03HQ','04HQ','05HQ','06HQ','07HQ','08HQ','09HQ','10HQ');
			$p_code = '';
			foreach($counter as $counters){
				$p_code =
				$p_code."'".$counters . substr(str_replace('-', '', $param['p_date']), 2) .
          		($param['p_type'] == 'AM' ? 'M' : ($param['p_type']=='PM' ? 'N' : 'D'))."'".',';
			}

			$p_code = $p_code."'".'01HQ'."'";
			$p_counter = '';
            $p_countName = 'All';
            $p_date = $param['p_date']; $shift = $param['p_type'];
        }

      } else {
        if($param['p_type'] == 'All'){
          $p_code =
          "'".$_SESSION['station']['code'] . substr(str_replace('-', '', $param['p_date']), 2).'N'."'".','.
          "'".$_SESSION['station']['code'] . substr(str_replace('-', '', $param['p_date']), 2).'M'."'".','.
          "'".$_SESSION['station']['code'] . substr(str_replace('-', '', $param['p_date']), 2).'D'."'";
		  $p_counter = '';
          $p_countName = $_SESSION['station']['code'];
          $p_date = $param['p_date']; $shift = $param['p_type'];
        }else {
          $p_code = "'".$_SESSION['station']['code'] . substr(str_replace('-', '', $param['p_date']), 2) .
            ($param['p_type'] == 'AM' ? 'M' : ($param['p_type']=='PM' ? 'N' : 'D'))."'";
			$p_counter = '';
            $p_countName = $_SESSION['station']['code'];
            $p_date = $param['p_date']; $shift = $param['p_type'];
        }

      }
    }

    $data['param']['period_code'] = $p_code;
	  $data['param']['counter'] = $p_counter;
    $data['param']['counterName'] = (substr($p_countName,0,1)=='0' || substr($p_countName,0,1)=='1') ? substr($p_countName,2,4).substr($p_countName,0,2) : $p_countName;
    //$data['param']['p_date'] = $p_date;
    $data['param']['shift'] = $shift;
    $date1=date_create($p_date);
    $data['param']['p_date'] = date_format($date1,"d/m/Y");
    $data['param']['airport'] = $param['airport'];
    //$p_code = 'ERD';
  }


  elseif ($report=='inform_list_nopaid'){
    if (isset($param['p_code'])) {
      $p_code = $param['p_code'];
      $p_counter = '';
    }
    elseif ($param['airport'] == 'DMK') {
      if (isset($param['station_code'])&&$param['station_code']!='All') {
        if($param['p_type'] == 'All'){
          $p_code =
          "'".$param['station_code'] . substr(str_replace('-', '', $param['p_date']), 2).'N'."'".','.
          "'".$param['station_code'] . substr(str_replace('-', '', $param['p_date']), 2).'M'."'".','.
          "'".$param['station_code'] . substr(str_replace('-', '', $param['p_date']), 2).'D'."'";
          $p_counter = '';
          $p_countName = $param['station_code'];
          $p_date = $param['p_date']; $shift = $param['p_type'];
            //($param['p_type'] == 'AM' ? 'M' : ($param['p_type']=='PM' ? 'N' : 'D'));
        }else {
          $p_code = "'".$param['station_code'] . substr(str_replace('-', '', $param['p_date']), 2).
          ($param['p_type'] == 'AM' ? 'M' : ($param['p_type']=='PM' ? 'N' : 'D'))."'";
          $p_counter = '';
          $p_countName = $param['station_code'];
          $p_date = $param['p_date']; $shift = $param['p_type'];
        }

      }elseif (isset($param['station_code'])&&$param['station_code']=='All') {
        if($param['p_type'] == 'All'){
          $counter = array('01DM','02DM','03DM','04DM','05DM','06DM','07DM');
          $p_code = '';
            foreach ($counter as $counters) {
             $p_code =  $p_code ."'".$counters . substr(str_replace('-', '', $param['p_date']), 2).'N'."'".','.
                        "'".$counters . substr(str_replace('-', '', $param['p_date']), 2).'M'."'".','.
                        "'".$counters . substr(str_replace('-', '', $param['p_date']), 2).'D'."'".',';
            }
            $p_code = $p_code."'".'01DM'."'";
            $p_counter = '';
            $p_countName = 'All';
            $p_date = $param['p_date']; $shift = $param['p_type'];
        }else {
            $counter = array('01DM','02DM','03DM','04DM','05DM','06DM','07DM');
            $p_code = '';
            foreach($counter as $counters){
                $p_code =
                $p_code."'".'01DM' . substr(str_replace('-', '', $param['p_date']), 2) .
                ($param['p_type'] == 'AM' ? 'M' : ($param['p_type']=='PM' ? 'N' : 'D'))."'".',';
            }
            $p_code = $p_code."'".'01DM'."'";
            $p_counter = '';
            $p_countName = 'All';
            $p_date = $param['p_date']; $shift = $param['p_type'];
        }

      } else {
        if($param['p_type'] == 'All'){
          $p_code =
          "'".$_SESSION['station']['code'] . substr(str_replace('-', '', $param['p_date']), 2).'N'."'".','.
          "'".$_SESSION['station']['code'] . substr(str_replace('-', '', $param['p_date']), 2).'M'."'".','.
          "'".$_SESSION['station']['code'] . substr(str_replace('-', '', $param['p_date']), 2).'D'."'";
          $p_counter = '';
          $p_countName = $_SESSION['station']['code'];
          $p_date = $param['p_date']; $shift = $param['p_type'];
        }else {
          $p_code = "'".$_SESSION['station']['code'] . substr(str_replace('-', '', $param['p_date']), 2) .
            ($param['p_type'] == 'AM' ? 'M' : ($param['p_type']=='PM' ? 'N' : 'D'))."'";
            $p_counter = '';
            $p_countName = $_SESSION['station']['code'];
            $p_date = $param['p_date']; $shift = $param['p_type'];
        }

      }
    }
    elseif ($param['airport'] == 'BKK') {
      if(isset($param['station_code'])&&$param['station_code']!='All'&&(in_array($param['station_code'],array('01SU','03SU','04SU','14SU','15SU')))){
        $counter = array('01SU','03SU','04SU','14SU','15SU');
        if($param['p_type'] == 'All'){
            $p_code = '';
            foreach ($counter as $counters) {
             $p_code =  $p_code ."'".$counters . substr(str_replace('-', '', $param['p_date']), 2).'N'."'".','.
                        "'".$counters . substr(str_replace('-', '', $param['p_date']), 2).'M'."'".','.
                        "'".$counters . substr(str_replace('-', '', $param['p_date']), 2).'D'."'".',';
            }
            $p_code = $p_code."'".'01XX'."'";
            $p_counter = 'Counter B';
            $p_countName = 'Counter B';
            $p_date = $param['p_date']; $shift = $param['p_type'];
        }else{
            $p_code = '';
            foreach($counter as $counters){
                $p_code =
                $p_code."'".$counters . substr(str_replace('-', '', $param['p_date']), 2) .
                ($param['p_type'] == 'AM' ? 'M' : ($param['p_type']=='PM' ? 'N' : 'D'))."'".',';
            }

            $p_code = $p_code."'".'01XX'."'";
            $p_counter = 'Counter B';
            $p_countName = 'Counter B';
            $p_date = $param['p_date']; $shift = $param['p_type'];
        }

      }elseif(isset($param['station_code'])&&$param['station_code']!='All'&&(in_array($param['station_code'],array('02SU','05SU','16SU','17SU')))){
        $counter = array('02SU','05SU','16SU','17SU');
        if($param['p_type'] == 'All'){
            $p_code = '';
            foreach ($counter as $counters) {
             $p_code =  $p_code ."'".$counters . substr(str_replace('-', '', $param['p_date']), 2).'N'."'".','.
                        "'".$counters . substr(str_replace('-', '', $param['p_date']), 2).'M'."'".','.
                        "'".$counters . substr(str_replace('-', '', $param['p_date']), 2).'D'."'".',';
            }
            $p_code = $p_code."'".'01XX'."'";
            $p_counter = 'Counter C';
            $p_countName = 'Counter C';
            $p_date = $param['p_date']; $shift = $param['p_type'];
        }else{
            $p_code = '';
            foreach($counter as $counters){
                $p_code =
                $p_code."'".$counters . substr(str_replace('-', '', $param['p_date']), 2) .
                ($param['p_type'] == 'AM' ? 'M' : ($param['p_type']=='PM' ? 'N' : 'D'))."'".',';
            }

            $p_code = $p_code."'".'01XX'."'";
            $p_counter = 'Counter C';
            $p_countName = 'Counter C';
            $p_date = $param['p_date']; $shift = $param['p_type'];
        }

      }elseif(isset($param['station_code'])&&$param['station_code']!='All'&&(!in_array($param['station_code'],array('02SU','05SU','16SU',
      '17SU','01SU','03SU','14SU','15SU','04SU')))){
        if($param['p_type'] == 'All'){
          $p_code =
          "'".$param['station_code'] . substr(str_replace('-', '', $param['p_date']), 2).'N'."'".','.
          "'".$param['station_code'] . substr(str_replace('-', '', $param['p_date']), 2).'M'."'".','.
          "'".$param['station_code'] . substr(str_replace('-', '', $param['p_date']), 2).'D'."'";
            //($param['p_type'] == 'AM' ? 'M' : ($param['p_type']=='PM' ? 'N' : 'D'));
          $p_counter = '';
          $p_countName = $param['station_code'];
          $p_date = $param['p_date']; $shift = $param['p_type'];
        }else {
          $p_code = "'".$param['station_code'] . substr(str_replace('-', '', $param['p_date']), 2).
          ($param['p_type'] == 'AM' ? 'M' : ($param['p_type']=='PM' ? 'N' : 'D'))."'";
          $p_counter = '';
          $p_countName = $param['station_code'];
          $p_date = $param['p_date']; $shift = $param['p_type'];
        }
      }elseif (isset($param['station_code'])&&$param['station_code']=='All') {
        if($param['p_type'] == 'All'){
          $counter = array('01SU','02SU','03SU','04SU','05SU','06SU','07SU','08SU','09SU','10SU','11SU','12SU','13SU','14SU','15SU'
          ,'16SU','17SU','18SU','19SU','20SU','21SU','22SU','23SU','24SU');
          $p_code = '';
            foreach ($counter as $counters) {
             $p_code =  $p_code ."'".$counters . substr(str_replace('-', '', $param['p_date']), 2).'N'."'".','.
                        "'".$counters . substr(str_replace('-', '', $param['p_date']), 2).'M'."'".','.
                        "'".$counters . substr(str_replace('-', '', $param['p_date']), 2).'D'."'".',';
            }
            $p_code = $p_code."'".'01SU'."'";
            $p_counter = '';
            $p_countName = 'All';
            $p_date = $param['p_date']; $shift = $param['p_type'];
        }else {
            $counter = array('01SU','02SU','03SU','04SU','05SU','06SU','07SU','08SU','09SU','10SU','11SU','12SU','13SU','14SU','15SU'
          ,'16SU','17SU','18SU','19SU','20SU','21SU','22SU','23SU','24SU');
            $p_code = '';
            foreach($counter as $counters){
                $p_code =
                $p_code."'".$counters . substr(str_replace('-', '', $param['p_date']), 2) .
                ($param['p_type'] == 'AM' ? 'M' : ($param['p_type']=='PM' ? 'N' : 'D'))."'".',';
            }

            $p_code = $p_code."'".'01SU'."'";
            $p_counter = '';
            $p_countName = 'All';
            $p_date = $param['p_date']; $shift = $param['p_type'];
        }

      } else {
        if($param['p_type'] == 'All'){
          $p_code =
          "'".$_SESSION['station']['code'] . substr(str_replace('-', '', $param['p_date']), 2).'N'."'".','.
          "'".$_SESSION['station']['code'] . substr(str_replace('-', '', $param['p_date']), 2).'M'."'".','.
          "'".$_SESSION['station']['code'] . substr(str_replace('-', '', $param['p_date']), 2).'D'."'";
          $p_counter = '';
          $p_countName = $_SESSION['station']['code'];
          $p_date = $param['p_date']; $shift = $param['p_type'];
        }else {
          $p_code = "'".$_SESSION['station']['code'] . substr(str_replace('-', '', $param['p_date']), 2) .
            ($param['p_type'] == 'AM' ? 'M' : ($param['p_type']=='PM' ? 'N' : 'D'))."'";
            $p_counter = '';
            $p_countName = $_SESSION['station']['code'];
            $p_date = $param['p_date']; $shift = $param['p_type'];
        }

      }
    }
    elseif ($param['airport'] == 'HQ') {
      if (isset($param['station_code'])&&$param['station_code']!='All') {
        if($param['p_type'] == 'All'){
          $p_code =
          "'".$param['station_code'] . substr(str_replace('-', '', $param['p_date']), 2).'N'."'".','.
          "'".$param['station_code'] . substr(str_replace('-', '', $param['p_date']), 2).'M'."'".','.
          "'".$param['station_code'] . substr(str_replace('-', '', $param['p_date']), 2).'D'."'";
          $p_counter = '';
          $p_countName = $param['station_code'];
          $p_date = $param['p_date']; $shift = $param['p_type'];
            //($param['p_type'] == 'AM' ? 'M' : ($param['p_type']=='PM' ? 'N' : 'D'));
        }else {
          $p_code = "'".$param['station_code'] . substr(str_replace('-', '', $param['p_date']), 2).
          ($param['p_type'] == 'AM' ? 'M' : ($param['p_type']=='PM' ? 'N' : 'D'))."'";
          $p_counter = '';
          $p_countName = $param['station_code'];
          $p_date = $param['p_date']; $shift = $param['p_type'];
        }

      }elseif (isset($param['station_code'])&&$param['station_code']=='All') {
        if($param['p_type'] == 'All'){
          $counter = array('01HQ','02HQ','03HQ','04HQ','05HQ','06HQ','07HQ','08HQ','09HQ','10HQ');
          $p_code = '';
            foreach ($counter as $counters) {
             $p_code =  $p_code ."'".$counters . substr(str_replace('-', '', $param['p_date']), 2).'N'."'".','.
                        "'".$counters . substr(str_replace('-', '', $param['p_date']), 2).'M'."'".','.
                        "'".$counters . substr(str_replace('-', '', $param['p_date']), 2).'D'."'".',';
            }
            $p_code = $p_code."'".'01HQ'."'";
            $p_counter = '';
            $p_countName = 'All';
            $p_date = $param['p_date']; $shift = $param['p_type'];
        }else {
            $counter = array('01HQ','02HQ','03HQ','04HQ','05HQ','06HQ','07HQ','08HQ','09HQ','10HQ');
            $p_code = '';
            foreach($counter as $counters){
                $p_code =
                $p_code."'".$counters . substr(str_replace('-', '', $param['p_date']), 2) .
                ($param['p_type'] == 'AM' ? 'M' : ($param['p_type']=='PM' ? 'N' : 'D'))."'".',';
            }

            $p_code = $p_code."'".'01HQ'."'";
            $p_counter = '';
            $p_countName = 'All';
            $p_date = $param['p_date']; $shift = $param['p_type'];
        }

      } else {
        if($param['p_type'] == 'All'){
          $p_code =
          "'".$_SESSION['station']['code'] . substr(str_replace('-', '', $param['p_date']), 2).'N'."'".','.
          "'".$_SESSION['station']['code'] . substr(str_replace('-', '', $param['p_date']), 2).'M'."'".','.
          "'".$_SESSION['station']['code'] . substr(str_replace('-', '', $param['p_date']), 2).'D'."'";
          $p_counter = '';
          $p_countName = $_SESSION['station']['code'];
          $p_date = $param['p_date']; $shift = $param['p_type'];
        }else {
          $p_code = "'".$_SESSION['station']['code'] . substr(str_replace('-', '', $param['p_date']), 2) .
            ($param['p_type'] == 'AM' ? 'M' : ($param['p_type']=='PM' ? 'N' : 'D'))."'";
            $p_counter = '';
            $p_countName = $_SESSION['station']['code'];
            $p_date = $param['p_date']; $shift = $param['p_type'];
        }

      }
    }

    $data['param']['period_code'] = $p_code;
    $data['param']['counter'] = $p_counter;
    $data['param']['counterName'] = (substr($p_countName,0,1)=='0' || substr($p_countName,0,1)=='1') ? substr($p_countName,2,4).substr($p_countName,0,2) : $p_countName;
    //$data['param']['p_date'] = $p_date;
    $data['param']['shift'] = $shift;
    $date1=date_create($p_date);
    $data['param']['p_date'] = date_format($date1,"d/m/Y");
    //$p_code = 'ERD';
  }


  elseif ($report=='output_tax') {
    $airport = '';
    if($param['airport']=='DMK'){
      $airport = 'DM';
    }elseif ($param['airport']=='BKK') {
      $airport = 'SU';
    }else{
      $airport = 'HO';
    }
    $data['param']['date_from'] = $param['date_from'];
    $data['param']['date_to'] = $param['date_to'];
    $data['param']['vat_rate'] = $param['vat_rate'];
    $data['param']['station_code'] = $param['station_code'];
    $data['param']['airport'] = $airport;
  } elseif ($report=='card_tx_list') {
    $data['param']['acc_code'] = $param['acc_code'];
    $data['param']['period_code'] = $param['period_code'];
    $data['param']['card_number'] = $param['card_number'];
  } elseif ($report=='meeting_sign') {
    foreach (array('title1', 'title2', 'code_from', 'code_to', 'type', 'is_active', 'order_by') as $name) {
      $data['param'][$name] = $param[$name];
    }
  } elseif ($report=='member_record') {
    foreach (array('code_from', 'code_to', 'type_ordinary', 'type_extra', 'type_vip', 'is_active', 'sign_by', 'doc_no', 'vipCheck', 'pageNo') as $name) {
      $data['param'][$name] = $param[$name];
    }
  }elseif($report=='labal_report') {
    $order = '';
    if ($param['order'] == 'member_name' && $param['language'] == 'TH') {
      $order = 'm.name_th';
    } elseif ($param['order'] == 'member_name' && $param['language'] == 'EN') {
      $order = 'm.name_en';
    } elseif ($param['order'] == 'member_code') {
      $order = 'm.code';
    } elseif ($param['order'] == 'zip_code') {
      $order = 'ma.zipcode,m.code';
    } elseif ($param['order'] == 'name_en') {
      $order = 'm.name_en';
    } elseif ($param['order'] == 'province') {
      $order = 'ma.province,m.code';
    }

    $data['param'] = array(
      'prod_code' => $param['product_code'],
      'code_from' => $param['code_from'],
      'code_to' => $param['code_to'],
      'lang' => $param['language'],
      'branch' => $param['branch_code'],
      'member_type' => $param['member_type'],
      'member_status' => $param['is_active'],
      'Province' => $param['province'],
      'Order' => $order,
      'inbound' => '%'.$param['inbound'].'%',
      'outbound' => '%'.$param['outbound'].'%',
      'specialist' => '%'.$param['special'].'%',
      'domestic' => $param['domestic'],
      'to_person' => $param['to_person'],
      );
  }elseif($report=='labal_report2'){
      $order = '';
    if ($param['order'] == 'member_name' && $param['language'] == 'TH') {
      $order = 'm.name_th';
    } elseif ($param['order'] == 'member_name' && $param['language'] == 'EN') {
      $order = 'm.name_en';
    } elseif ($param['order'] == 'member_code') {
      $order = 'm.code';
    } elseif ($param['order'] == 'zip_code') {
      $order = 'ma.zipcode,m.code';
    } elseif ($param['order'] == 'name_en') {
      $order = 'm.name_en';
    } elseif ($param['order'] == 'province') {
      $order = 'ma.province,m.code';
    }

    $data['param'] = array(
      'prod_code' => $param['product_code'],
      'code_from' => $param['code_from'],
      'code_to' => $param['code_to'],
      'lang' => $param['language'],
      'branch' => $param['branch_code'],
      'member_type' => $param['member_type'],
      'member_status' => $param['is_active'],
      'Province' => $param['province'],
      'Order' => $order,
      'inbound' => '%'.$param['inbound'].'%',
      'outbound' => '%'.$param['outbound'].'%',
      'specialist' => '%'.$param['special'].'%',
      'domestic' => $param['domestic'],
      'show_prod' => $param['show_prod'],
      'to_person' => $param['to_person'],
      );
  }elseif($report=='member_data') {
    if($param['province']=='north_th'){
      $province = "'เชียงราย','เชียงใหม่','น่าน','พะเยา','แพร่','แม่ฮ่องสอน','ลำปาง','ลำพูน','อุตรดิตถ์'";
    }elseif($param['province']=='northeast_th'){
      $province = "'กาฬสินธุ์','ขอนแก่น','ชัยภูมิ','นครพนม','นครราชสีมา','บึงกาฬ','บุรีรัมย์','มหาสารคาม','มุกดาหาร','ยโสธร','ร้อยเอ็ด','เลย','สกลนคร','สุรินทร์',
      'ศรีสะเกษ','หนองคาย','หนองบัวลำภู','อุดรธานี','อุบลราชธานี','อำนาจเจริญ'";
    }elseif($param['province']=='center_th'){
      $province = "'กำแพงเพชร','ชัยนาท','นครนายก','นครปฐม','นครสวรรค์','นนทบุรี','ปทุมธานี','พระนครศรีอยุธยา','พิจิตร','พิษณุโลก','เพชรบูรณ์','ลพบุรี','สมุทรปราการ',
      'สมุทรสงคราม','สมุทรสาคร','สิงห์บุรี','สุโขทัย','สุพรรณบุรี','สระบุรี','อ่างทอง','อุทัยธานี'";
    }elseif($param['province']=='east_th'){
      $province = "'จันทบุรี','ฉะเชิงเทรา','ชลบุรี','ตราด','ปราจีนบุรี','ระยอง','สระแก้ว'";
    }elseif($param['province']=='west_th'){
      $province = "'กาญจนบุรี','ตาก','ประจวบคีรีขันธ์','เพชรบุรี','ราชบุรี'";
    }elseif($param['province']=='south_th'){
      $province = "'กระบี่','ชุมพร','ตรัง','นครศรีธรรมราช','นราธิวาส','ปัตตานี','พังงา','พัทลุง','ภูเก็ต','ยะลา','ระนอง','สงขลา','สตูล','สุราษฎร์ธานี'";
    }elseif($param['province']=='north_en'){
      $province = "'Chiang Rai','Chiang Mai','Nan','Phayao','Phrae','Mae Hong Son','Lampang','Lamphun','Uttaradit'";
    }elseif($param['province']=='northeast_en'){
      $province = "'Kalasin','Khon Kaen','Chaiyaphum','Nakhon Phanom','Nakhon Ratchasima','Bueng Kan','Buri Ram','Maha Sarakham',
      'Mukdahan','Yasothon','Roi Et','Loei','Si Sa Ket','Sakon Nakhon','Surin','Nong Khai','Nong Bua Lam Phu','Amnat Charoen','Udon Thani',
      'Ubon Ratchathani'";
    }elseif($param['province']=='center_en'){
      $province = "'Kamphaeng Phet','Chai Nat','Nakhon Nayok','Nakhon Pathom','Nakhon Sawan','Nonthaburi','Pathum Thani','Ayutthaya',
      'Phichit','Phitsanulok','Petchabun','Lop Buri','Samut Prakan','Samut Songkhram','Samut Sakhon','Sing Buri','Sukhothai','Suphan Buri',
      'Saraburi','Ang Thong','Uthai Thani'";
    }elseif($param['province']=='east_en'){
      $province = "'Chanthaburi','Chachoengsao','Chon Buri','Trat','Prachin Buri','Prachin Buri','Rayong','Sa Kaeo'";
    }elseif($param['province']=='west_en'){
      $province = "'Kanchanaburi','Tak','Prachuap Khiri Khan','Phetchaburi','Ratchaburi'";
    }elseif($param['province']=='south_en'){
      $province = "'Krabi','Chumphon','Trang','Nakhon Si Thammarat','Narathiwat','Pattani','Phangnga','Phatthalung','Phuket','Yala','Ranong',
      'Songkhla','Satun','Surat Thani'";
    }else{
      $province = "'".$param['province']."'";
    }

    $data['param'] = array(
      'code_from' => $param['code_from'],
      'code_to' => $param['code_to'],
      'business_type' => $param['business_type'],
      'pMember_type' => $param['member_type'],
      'is_active' => $param['is_active'],
      'inbound' => '%'.$param['inbound'].'%',
      'outbound' => '%'.$param['outbound'].'%',
      'specialist' => '%'.$param['special'].'%',
      'language' => $param['language'],
      'province' => $province,
      'zipcode' => $param['zipcode'],
      'order' => $param['order'],
      'zone' => $param['province'],
      'domestic' => $param['domestic'],
      );
  }elseif($report=='member_datadetail'){
    $data['param'] = array(
        'code_from' => $param['code_from'],
        'code_to' => $param['code_to'],
        'member_type' => $param['member_type'],
        'member_status' => $param['is_active'],
        'lang' => $param['language'],
      );
  }elseif ($report=='statistic_by_member') {
    $data['param'] = array(
      'date_from' => $param['date_from'],
      'date_to' => $param['date_to'],
      'airport' => $param['airport'],
	  'airport' => $param['airport'],
    );
  } elseif ($report=='statistic_by_nation') {
	  $data['param'] = array(
      'date_from' => $param['date_from'],
      'date_to' => $param['date_to'],
      'airport' => $param['airport'],
    );
  } elseif ($report=='statistic_by_nation_member') {
	  $data['param'] = array(
      'date_from' => $param['date_from'],
      'date_to' => $param['date_to'],
      'airport' => $param['airport'],
    );
  } elseif ($report=='statistic_by_member_nation') {
	  $data['param'] = array(
      'date_from' => $param['date_from'],
      'date_to' => $param['date_to'],
      'airport' => $param['airport'],
    );
  } elseif ($report=='statistic_by_year_nation') {
	$data['param'] = array(
      'year' => $param['year'],
      'airport' => $param['airport'],
    );
  } elseif ($report=='statistic_by_year_member') {
	$data['param'] = array(
      'year' => $param['year'],
      'airport' => $param['airport'],
    );
  } elseif ($report=='statistic_by_month_nation') {
	$data['param'] = array(
      'date_from' => $param['date_from'],
      'date_to' => $param['date_to'],
      'airport' => $param['airport'],
    );
  } elseif ($report=='statistic_by_month_member') {
	$data['param'] = array(
      'date_from' => $param['date_from'],
      'date_to' => $param['date_to'],
      'airport' => $param['airport'],
    );
  } elseif ($report=='sportCheckPrint'){
    $date_from = $param['p_date'];
    if (strtoupper($param['p_type'])=='AM'){
      $period = '%M';
    }elseif (strtoupper($param['p_type'])=='PM'){
      $period = '%N';
    }elseif (strtoupper($param['p_type'])=='ALL'){
      $period = 'ALL';
    }elseif (strtoupper($param['p_type'])=='DAY'){
      $period = 'ALL';
    }
    if (!isset($param['p_date2'])||$param['p_date2']==undefined||$param['p_date2']==''){
      $date_to = $param['p_date'];
    }else{
      $date_to = $param['p_date2'];
    }
    $data['param'] = array(
      'date_from' => $date_from,
      'date_to' => $date_to,
      'airport' => $param['airport'],
      'period' => $period,
      'checker' => $param['checker'],
      'from' => date_format(date_create($date_from),"d/m/Y"),
      'to' => date_format(date_create($date_to),"d/m/Y")
    );
    //print_r($data['param']);
  } else if ($report=='receive_voucher_tax') {
	$data['param']['period_code'] = $param['station_code'];
	$bank_account = array(
      'HQ' => array('code' => '111204', 'name' => 'เงินฝากธนาคาร S/A กสิกรไทย พัฒนพงศ์ 018-2-77615-7'),
      'HO' => array('code' => '111204', 'name' => 'เงินฝากธนาคาร S/A กสิกรไทย พัฒนพงศ์ 018-2-77615-7'),
      'SU' => array('code' => '111205', 'name' => 'เงินฝากธนาคาร S/A ทหารไทย ท่าอากาศยาน 012-2-67293-4'),
      'DM' => array('code' => '111209', 'name' => 'เงินฝากธนาคาร S/A กรุงเทพ ดอนเมือง 225-0-70703-7'),
      'NS' => array('code' => '111204', 'name' => 'เงินฝากธนาคาร S/A กสิกรไทย พัฒนพงศ์ 018-2-77615-7'),
    );
    $data['param']['acc_bank'] = $bank_account[substr($param['station_code'],2,2)]['code'];
    $data['param']['acc_wht'] = '191002';
    $data['param']['acc_vat'] = '211001';
	$data['param']['date_from'] = $param['p_date_from'];
    $data['param']['date_to'] = $param['p_date_to'];
  } else if ($report == 'payment1') {
    //print_r($param['productcode']);
    $productcode = "'".implode("','",$param['productcode'])."'";
	  $data['param']['date_from'] = $param['date_from'];
	  $data['param']['date_to'] = $param['date_to'];
	  $data['param']['mem_from'] = $param['mem_from'];
	  $data['param']['mem_to'] = $param['mem_to'];
	  $data['param']['productcode'] = $productcode;
  } else if ($report == 'arrearage') {
	  $data['param']['date_from'] = $param['date_from'];
	  $data['param']['date_to'] = $param['date_to'];
	  $data['param']['mem_from'] = $param['mem_from'];
	  $data['param']['mem_to'] = $param['mem_to'];
	  $data['param']['productcode'] = $param['productcode'];
  } else if ($report == 'receipt_list1') {
    if (isset($param['p_code'])) {
      $p_code = $param['p_code'];
    } elseif (isset($param['station_code'])) {
      $p_station = $param['station_code'];
      $p_code = $param['station_code'] . substr(str_replace('-', '', $param['p_date']), 2) .
        ($param['p_type'] == 'AM' ? 'M' : ($param['p_type']=='PM' ? 'N' : 'D'));
    } else {
      $p_station = $_SESSION['station']['code'];
      $p_code = $_SESSION['station']['code'] . substr(str_replace('-', '', $param['p_date']), 2) .
        ($param['p_type'] == 'AM' ? 'M' : ($param['p_type']=='PM' ? 'N' : 'D'));
    }

    if ($param['airport']=='HO'||$param['airport']=='HQ'){
      if(isset($param['station_code'])){
        $p_station = $param['station_code'];
      }else{
        $p_station = '01HO';
      }
      $p_code = '01HO' . substr(str_replace('-', '', $param['p_date']), 2) . 'D';
      $p_airport = 'HO';
    } elseif ($param['airport']=='DMK'){
      $p_airport = 'DM';
    } else {
      $p_airport = 'SU';
    }

    if ($param['p_type'] == 'AM') {
      $p_type = 'M';
    } elseif ($param['p_type'] == 'PM') {
      $p_type = 'N';
    } elseif ($param['p_type'] == 'All') {
      $p_type = 'A';
    } else {
      $p_type = 'D';
    }
      //echo $p_code;
      $data['param']['period_code'] = $p_code;
      $data['param']['p_type'] = $p_type;
      $data['param']['p_date'] = substr(str_replace('-', '', $param['p_date']), 2);
      $data['param']['p_station'] = $p_station;
      $data['param']['p_airport'] = $p_airport;
    }

  $stmt = $pdo->prepare("INSERT INTO _session SET uuid=upper(uuid()), data=:data, ts=now()");
  $stmt->execute(array(
    ':data' => json_encode($data, JSON_UNESCAPED_UNICODE),
  ));
  $id = $pdo->lastInsertId();

  $stmt = $pdo->prepare("SELECT uuid FROM _session WHERE id=:id");
  $stmt->execute(array(
    ':id' => $id,
  ));
  $uuid = $stmt->fetchColumn();



  responseJson(array(
    'status' => true,
    'uuid' => $uuid,
    'myCode' => $province,
    'myCode2' => $data['param'],
    'Type' => $shift,
  ));
}


function doLov($param) {
  global $pdo;

  $lov = $param['lov'];
  if ($lov=='receipt') {
    $stationCode2 = substr($param['stationCode'],2);
    if (in_array('receipt', $_SESSION['staff']['acl'])) {
      $date_from = date('Y-m-d', mktime(0, 0, 0, date('m')+0, date('d')-90, date('Y')));
      $sql = "SELECT r.code, r.issue_date,DATE_FORMAT(r.issue_date,'%d-%m-%Y') issue_date2, m.name_en, r.total_amount, r.vat_amount, r.status, r.is_post
      FROM receipt r FORCE INDEX(ix_issue_date) LEFT JOIN member m ON r.mem_code=m.code
      WHERE case when '$stationCode2'='HO' then r.code=r.code else r.code like '%$stationCode2%' end AND r.issue_date >= '" . $date_from . "' and r.is_post = 'NO'
      ORDER BY r.issue_date DESC, r.created_at DESC";
    } else {
      $p_start = $_SESSION['station']['code'] . substr(date('Ymd', mktime(0, 0, 0, date('m')+0, date('d')-90, date('Y')+0)), -6) . 'A';
      $p_end = $_SESSION['station']['code'] . '999999Z';
//      $sql = "SELECT r.code, r.issue_date, m.name_en, r.total_amount, r.vat_amount, r.status, r.is_post FROM receipt r LEFT JOIN member m ON r.mem_code=m.code WHERE r.period_code LIKE '" . $_SESSION['station']['code']  . "%' AND r.issue_date >= NOW() - INTERVAL 90 DAY ORDER BY r.issue_date DESC, r.created_at DESC LIMIT 1000";
        $sql = "SELECT r.code, r.issue_date, m.name_en, r.total_amount, r.vat_amount, r.status, r.is_post
FROM receipt r LEFT JOIN member m ON r.mem_code=m.code
WHERE r.period_code >= '" . $p_start . "' AND r.period_code <= '" . $p_end . "'
ORDER BY r.period_code desc, r.code desc LIMIT 1000";
    }
    //echo $sql;
    $fields = array(
      array('name' => 'code', 'text' => 'เลขที่ใบเสร็จ'),
      array('name' => 'issue_date2', 'text' => 'วันที่'),
      array('name' => 'mem_code', 'text' => 'รหัส', 'hidden' => true),
      array('name' => 'name_en', 'text' => 'ชื่อ'),
      array('name' => 'total_amount', 'text' => 'ยอดสุทธิ'),
      array('name' => 'vat_amount', 'text' => 'VAT'),
      array('name' => 'status', 'text' => 'สถานะ'),
      array('name' => 'is_post', 'text' => 'ปิดพลัด'),
    );
    //echo $sql;
  } elseif ($lov=='lov_member') {//, m.type
    $sql = "
SELECT m.code, m.name_en, m.name_th
  , IF(m.type='ORDINARY', 'สามัญ', IF(m.type='EXTRA', 'สมทบ', IF(m.type='VIP', 'กิติมศักดิ์', 'เงินสด'))) type_name
FROM member m
WHERE m.is_active='YES' ORDER BY m.name_en
";
    $fields = array(
      array('name' => 'code', 'text' => 'รหัสสมาชิก'),
      array('name' => 'name_en', 'text' => 'ชื่อ(อังกฤษ)'),
      array('name' => 'name_th', 'text' => 'ชื่อ(ไทย)'),
      array('name' => 'type_name', 'text' => 'ประเภท'),
      array('name' => 'type', 'text' => 'ประเภท', 'hidden' => true),
    );
  } elseif ($lov=='lov_nation') {
    $sql = "SELECT code, nation_en, nation_th, name_en, name_th FROM country ORDER BY nation_en";
    $fields = array(
      array('name' => 'code', 'text' => 'รหัส'),
      array('name' => 'nation_en', 'text' => 'สัญชาติ (อังกฤษ)'),
      array('name' => 'nation_th', 'text' => 'สัญชาติ (ไทย)'),
      array('name' => 'name_th', 'text' => 'ประเทศ (ไทย)'),
      array('name' => 'name_en', 'text' => 'ประเทศ (อังกฤษ)'),
    );
  } elseif ($lov=='lov_hotel') {
    $sql = "SELECT name, place, tel FROM hotel ORDER BY name";
    $fields = array(
      array('name' => 'name', 'text' => 'ชื่อโรงแรม/ที่พัก'),
      array('name' => 'place', 'text' => 'ที่อยู่'),
      array('name' => 'tel', 'text' => 'โทรศัพท์'),
    );
  } elseif ($lov=='transfer_by') {
    $sql = "SELECT code, name_th, name_en, address, email, mobile FROM freelance ORDER BY code";
    $fields = array(
      array('name' => 'code', 'text' => 'รหัส'),
      array('name' => 'name_th', 'text' => 'ชื่อ (ไทย)'),
      array('name' => 'name_en', 'text' => 'ชื่อ (อังกฤษ)'),
      array('name' => 'address', 'text' => 'ที่อยู่'),
      array('name' => 'email', 'text' => 'Email'),
      array('name' => 'mobile', 'text' => 'โทรศัพท์'),
      );
  } elseif ($lov=='lov_inform_active') {
    $sql = "
SELECT i.*
  , SUBSTRING(i.flight_date, 12, 5) flight_time
  , m.name_en mem_name_en
  , n.name_en nation_en
FROM inform i
  JOIN carddb c ON i.card_code=c.code AND c.acc_code='" . $param['acc_code'] . "'
  LEFT JOIN member m ON i.mem_code=m.code
  LEFT JOIN country n ON i.nation=n.code
WHERE i.`status`='WAIT' AND i.card_code='" . $param['card_code'] . "'
ORDER BY i.code DESC";
$sql2 = "
SELECT i.*
, SUBSTRING(i.flight_date, 12, 5) flight_time
, m.name_en mem_name_en
, n.name_en nation_en
FROM inform i
JOIN carddb c ON i.card_code=c.code AND c.acc_code='" . $param['acc_code'] . "'
LEFT JOIN member m ON i.mem_code=m.code
LEFT JOIN country n ON i.nation=n.code
WHERE i.`status`='WAIT'
ORDER BY i.code DESC";

    $fields = array(
      array('name' => 'code', 'text' => 'รหัสใบแจ้ง'),
      array('name' => 'ref_code', 'text' => 'เลขที่อ้างอิง'),
      array('name' => 'mem_name_en', 'text' => 'สมาชิก'),
      array('name' => 'flight', 'text' => 'เที่ยวบิน'),
      array('name' => 'flight_time', 'text' => 'เวลา'),
      array('name' => 'nation_en', 'text' => 'สัญชาติ'),
      array('name' => 'pax', 'text' => 'PAX'),
    );

    if(!isset($param['card_code'])||$param['card_code']==""||$param['card_code']==null){
      $stmt = $pdo->prepare($sql2);
    }else {
      $stmt = $pdo->prepare($sql);
    }

    $stmt->execute();
    $out = array();
    while ($row = $stmt->fetch()) {
      $row['bus_list'] = json_decode($row['bus_list'], true);
      $out[] = $row;
    }
    responseJson(array(
      'status' => true,
      'data' => $out,
      'fields' => $fields,
    ));
 } elseif ($lov=='lov_card_active') {
    $sql = "select c.code, c.card_number, c.type, c.acc_code, c.mem_code, c.holder_name, c.is_active, c.is_cancel, "
          ."concat(m.code, ':', m.name_en) member_name, m.name_th, m.name_en "
          ."from carddb c left join member m on c.mem_code=m.code where c.is_active = 'YES'";
    $fields = array(
        array('name'=>'member_name','text'=>'รหัส/ชื่อ สมาชิก'),
        array('name'=>'holder_name','text'=>'ผู้ถือบัตร'),
        array('name'=>'code','text'=>'รหัสบัตร'),
        array('name'=>'card_number','text'=>'เลขบัตร'),
        array('name'=>'type','text'=>'ประเภทบัตร'),
      );
 } elseif ($lov=='lov_productAll') {
     $where_text = $param['where_text'];
     $sql = "select *,price as unit_price from product";
     $fields = array(
      array('name'=>'code','text'=>'รหัส'),
      array('name'=>'name','text'=>'ชื่อสินค้า/บริการ'),
      array('name'=>'price','text'=>'ราคา'),
      array('name'=>'unit','text'=>'หน่วยนับ'),
      array('name'=>'account_code', 'text'=>'รหัสบัญชี'),
      array('name'=>'vat_type','text'=>'VAT'),
    );
 }else if($lov == 'lov_account'){
    $sql = "select * from account";
    $fields = array(
      array('name'=>'code','text'=>'รหัส'),
      array('name'=>'name','text'=>'ชื่อรหัสสินค้า'),
      );
 }elseif ($lov=='member') {//, m.type
    $sql = "
SELECT m.code, m.name_en, m.name_th
  , IF(m.type='ORDINARY', 'สามัญ', IF(m.type='EXTRA', 'สมทบ', IF(m.type='VIP', 'กิติมศักดิ์', 'เงินสด'))) type_name
  , a.addr1 , concat(a.addr2,' ',a.tambon,' ',a.amphur) addr2  , a.province , a.zipcode
FROM member m
  LEFT JOIN member_address a ON m.code=a.mem_code AND a.invoice_addr='Y'
WHERE m.is_active='YES' ORDER BY m.name_en
";
    $fields = array(
      array('name' => 'code', 'text' => 'รหัสสมาชิก'),
      array('name' => 'name_en', 'text' => 'ชื่อ(อังกฤษ)'),
      array('name' => 'name_th', 'text' => 'ชื่อ(ไทย)'),
      array('name' => 'type_name', 'text' => 'ประเภท'),
      array('name' => 'type', 'text' => 'ประเภท', 'hidden' => true),
      array('name' => 'addr1', 'text' => '', 'hidden' => true),
      array('name' => 'addr2', 'text' => '', 'hidden' => true),
      array('name' => 'province', 'text' => '', 'hidden' => true),
      array('name' => 'zipcode', 'text' => '', 'hidden' => true),
    );
  } elseif ($lov=='product'){
    $sql = " SELECT * FROM product WHERE site_list='ALL'
      OR concat(',', site_list, ',') LIKE '%,"
     . substr($_SESSION['station']['code'],2,2) .",%' ORDER BY code ";

    $fields = array(
      array('name' => 'code', 'text' => 'รหัส'),
      array('name' => 'name', 'text' => 'ชื่อสินค้า/บริการ'),
      array('name' => 'price', 'text' => 'ราคา'),
      array('name' => 'unit', 'text' => 'หน่วยนับ'),
      array('name' => 'account_code', 'text' => 'รหัสบัญชี'),
      array('name' => 'vat_type', 'text' => 'VAT'),
    );
  } elseif ($lov=='invoice'){

    $date_from = date('Y-m-d', mktime(0, 0, 0, date('m')+0, date('d')-90, date('Y')));
    $sql = "SELECT inv.code, inv.issue_date, concat(m.code,':',m.name_en) full_name, case when inv.status='PAID' then inv.name else m.name_th end as name_en , inv.total_amount, inv.vat_amount, inv.status, inv.receipt_code
          , m.code mem_code, inv.deadline_date, inv.reissue_date, ma.addr1 , ma.addr2, ma.tambon, ma.amphur ,ma.province ,ma.zipcode, inv.remark, inv.real_receipt, ii.detail, inv.branch_name
        FROM invoice inv LEFT JOIN member m ON inv.mem_code=m.code LEFT JOIN invoice_item ii ON inv.code = ii.invoice_code
        LEFT JOIN member_address ma on m.code = ma.mem_code AND ma.invoice_addr='Y'
        where inv.status in ('WAIT','PAID') AND ii.line_num = '1'
        ORDER BY inv.code DESC,inv.issue_date DESC, inv.created_at DESC limit 2000";

    $fields = array(
      array('name' => 'code', 'text' => 'เลขที่ใบแจ้งหนี้'),
      array('name' => 'issue_date', 'text' => 'วันที่'),
      array('name' => 'mem_code', 'text' => 'รหัส', 'hidden' => true),
      array('name' => 'full_name', 'text' => 'ชื่อ'),
      array('name' => 'detail', 'text' => 'รายละเอียด'),
      array('name' => 'total_amount', 'text' => 'ยอดสุทธิ'),
      array('name' => 'vat_amount', 'text' => 'VAT' ,'hidden' => true),
      array('name' => 'status', 'text' => 'สถานะ'),
      array('name' => 'receipt_code', 'text' => 'เลขที่ใบเสร็จ' ,'hidden' => true),
      array('name' => 'deadline_date', 'text' => 'วันกำหนดชำระ' ,'hidden' => true),
      array('name' => 'reissue_date', 'text' => 'วันที่ Reissue' ,'hidden' => true),
      array('name' => 'addr1', 'text' => 'addr1' ,'hidden' => true),
      array('name' => 'addr2', 'text' => 'addr2' ,'hidden' => true),
      array('name' => 'province', 'text' => 'จังหวัด' ,'hidden' => true),
      array('name' => 'zipcode', 'text' => 'รหัสไปรษณีย์' ,'hidden' => true),
    );
  } elseif ($lov=='invoice_re'){

    $date_from = date('Y-m-d', mktime(0, 0, 0, date('m')+0, date('d')-90, date('Y')));
    $sql = "SELECT inv.code, inv.issue_date, concat(m.code,':',m.name_en) full_name, m.name_en, inv.total_amount, inv.vat_amount, inv.status, inv.receipt_code
          , m.code mem_code, inv.deadline_date, inv.reissue_date, ma.addr1 , ma.addr2, ma.tambon, ma.amphur ,ma.province ,ma.zipcode, inv.remark, inv.real_receipt
        FROM invoice inv LEFT JOIN member m ON inv.mem_code=m.code
        LEFT JOIN member_address ma on m.code = ma.mem_code AND ma.invoice_addr='Y'
        where inv.status in ('WAIT')
        ORDER BY inv.code DESC,inv.issue_date DESC, inv.created_at DESC limit 2000";

    $fields = array(
      array('name' => 'code', 'text' => 'เลขที่ใบแจ้งหนี้'),
      array('name' => 'issue_date', 'text' => 'วันที่'),
      array('name' => 'mem_code', 'text' => 'รหัส', 'hidden' => true),
      array('name' => 'full_name', 'text' => 'ชื่อ'),
      array('name' => 'total_amount', 'text' => 'ยอดสุทธิ'),
      array('name' => 'vat_amount', 'text' => 'VAT'),
      array('name' => 'status', 'text' => 'สถานะ'),
      array('name' => 'receipt_code', 'text' => 'เลขที่ใบเสร็จ' ,'hidden' => true),
      array('name' => 'deadline_date', 'text' => 'วันกำหนดชำระ' ,'hidden' => true),
      array('name' => 'reissue_date', 'text' => 'วันที่ Reissue' ,'hidden' => true),
      array('name' => 'addr1', 'text' => 'addr1' ,'hidden' => true),
      array('name' => 'addr2', 'text' => 'addr2' ,'hidden' => true),
      array('name' => 'province', 'text' => 'จังหวัด' ,'hidden' => true),
      array('name' => 'zipcode', 'text' => 'รหัสไปรษณีย์' ,'hidden' => true),
    );
  }elseif ($lov=='lov_member_pos') {
    $stmt = $pdo->prepare("SELECT a.mem_code, a.code, a.lang, a.name, a.addr1, a.addr2, a.tambon, a.amphur, a.province FROM member_address a JOIN member m ON a.mem_code=m.code WHERE m.is_active='YES'");
    $stmt->execute();
    $addr = array();
    while ($row = $stmt->fetch()) {
      $addr[$row['mem_code']][$row['lang']][$row['code']] = $row['name'] . PHP_EOL . trim(preg_replace('#\s+#', '', $row['addr1'] . ' ' . $row['addr2'] . ' ' . $row['tambon'] . ' ' . $row['amphur'] . ' ' . $row['province']));
    }
    $stmt = $pdo->prepare("SELECT m.code, m.name_en name, IF(m.type='ORDINARY', 'สามัญ', IF(m.type='EXTRA', 'สมทบ', IF(m.type='VIP', 'กิติมศักดิ์', 'เงินสด'))) type, m.tel, m.fax
FROM member m
WHERE m.is_active='YES' ORDER BY m.name_en");
    $stmt->execute();
    $out = array();
    while ($row = $stmt->fetch()) {
      $row['addresses'] = array();
      if (isset($addr[$row['code']])) {
        foreach (array('TH', 'EN') as $lang) {
          if (!is_array($addr[$row['code']][$lang])) {
            $row['addresses'][] = array(
              'code' => '000000',
              'lang' => $lang,
              'addr' => '',
            );
            continue;
          }
          foreach ($addr[$row['code']][$lang] as $code => $a) {
            $row['addresses'][] = array(
              'code' => $code,
              'lang' => $lang,
              'addr' => $a,
            );
          }
        }
      }
      $out[] = $row;
    }
    responseJson(array(
      'status' => true,
      'members' => $out,
    ));
  } else {
    responseJson(array(
      'status' => false,
      'reason' => 'ERR_NO_LOV_DEFINED',
    ));
  }

  $stmt = $pdo->prepare($sql);
  $stmt->execute();
  responseJson(array(
    'status' => true,
    'data' => $stmt->fetchAll(),
    'fields' => $fields,
    'SQL' => $sql,
    'check' => $_SESSION['staff']['acl'],
  ));
}

function doStationList($param) {
  global $pdo;
  // TODO: ACL
  $airport1 = '';
  if ($param['airport'] == 'DMK') {
    $airport1 = "like '%DM'";
  }
  elseif ($param['airport'] == 'BKK') {
    $airport1 = "like '%SU'";
  }
  elseif ($param['airport'] == 'HQ'||$param['airport'] == 'HO'){
    $airport1 = "like '%HO'";
  }
  else{
    //$airport1 = " = code";
    if (!in_array('accounting', $_SESSION['staff']['acl'])&&(substr($_SESSION['period']['station_code'], 2, 2) == 'SU'||
      substr($_SESSION['period']['station_code'], 2, 2) == 'DM')) {
     $airport1 = "LIKE '%" . substr($_SESSION['period']['station_code'], 2, 2) . "'";
    }
    else{
      $airport1 = " = code";
    }
  }
  $cond = '';
  // if (!in_array('accounting', $_SESSION['staff']['acl'])) {
  //   $cond = " AND code LIKE '%" . substr($_SESSION['period']['station_code'], 2, 2) . "'";
  // }
  $sql = "SELECT code,airport,period_type FROM station WHERE is_active='YES' and code $airport1" . $cond . " ORDER BY substring(code,-2,2),substring(code,-4,2),substring(code,-3,2)";
  $stmt = $pdo->prepare($sql);
  $stmt->execute();
  responseJson(array(
    'status' => true,
    'stations' => $stmt->fetchAll(),
//    'acl' => $_SESSION['staff']['acl'],
    'sql' => $sql,
    'T1' => $_SESSION['staff']['acl'],
    'T2' => substr($_SESSION['period']['station_code'], 2, 2),
  ));
}


function doReportProductList(){
  global $pdo;

  $stmt = $pdo->prepare("SELECT code value, name label FROM product ORDER BY code");
  $stmt->execute();
  //$products = $stmt->fetchAll();
  responseJson(array(
    'status' => true,
    'products' => $stmt->fetchAll(),
  ));
}

function doBranchList($param){
  global $pdo;

  $sql = "SELECT code value, name label FROM member_address WHERE mem_code=:memCode AND lang=:lang";
  $stmt = $pdo->prepare($sql);
  $stmt->execute(array(
    ':memCode' => $param['memCode'],
    ':lang' => $param['lang'],
  ));
  $products = $stmt->fetchAll();

  responseJson(array(
    'status' => true,
    'products' => $products,
  ));
}

function doBusinessTypeList(){
global $pdo;

$sql = "SELECT id value, concat(name_th,' ',name_en) label FROM member_type";
$stmt = $pdo->prepare($sql);
$stmt->execute();
responseJson(array(
    'status' => true,
    'businessList' => $stmt->fetchAll(),
  ));
}

function doMarketList2(){
  global $pdo;
  $stmt = $pdo->prepare("SELECT code value, name label FROM market");
  $stmt->execute();
  responseJson(array(
      'status' => true,
      'marketsList' => $stmt->fetchAll(),
    ));
}

function doInvoiceItems($param) {

  global $pdo;

  $stmt = $pdo->prepare(" SELECT invd.id, invd.invoice_code, invd.line_num, invd.prod_code, p.name, "
            . " invd.detail, invd.price, invd.qty, invd.unit, invd.amount, invd.vat_type "
            . " FROM invoice_item invd "
            . " inner join product p on invd.prod_code = p.code "
            . " WHERE invd.invoice_code=:code "
            . " ORDER BY invd.line_num ");
  $stmt->execute(array(
    ':code' => $param['code'],
  ));
  $invoice['items'] = $stmt->fetchAll();

  responseJson(array(
    'status' => true,
    'invoice' => $invoice,
  ));

}

function doCheckRealReceipt($param){
  global $pdo;
  $stmt = $pdo->prepare("SELECT count(code) rc FROM receipt WHERE code =:rc_check ");
  $stmt->execute(array(':rc_check' => $param['code'],));
  $num_rc = $stmt->fetchColumn();

  if($num_rc != 0){
    responseJson(array(
      'status' => true
    ));
  }else{
    responseJson(array(
      'status' => false
    ));
  }
}

function doInvoiceSave($param) {
  global $pdo;
  if($param['invoice_code'] !== ''){
    //echo "Hello wold";
    $pdo->beginTransaction();

    $stmt = $pdo->prepare(" select m.name_th, ma.name branch, concat(ma.addr1  ,' ', ma.addr2 ,' ', ma.tambon ,' ', ma.amphur,' ', ma.province ,' ', ma.zipcode) addr "
      . " from member m inner join member_address ma "
      . " on m.code = ma.mem_code "
      . " where m.code = :memcode and ma.invoice_addr='Y' ");

    $stmt->execute(array(
      ':memcode' => $param['mem_code'],
    ));
    $member = $stmt->fetch();

    $data = array(
        ':code' => $param['invoice_code'],
        ':mem_code' => $param['mem_code'],
        ':branch_name' => $param['branch_name'],
        ':receipt_code' => $param['receipt_code'],
        ':deadline_date' => $param['deadline_date'],
        ':issue_date' => $param['issue_date'],
        ':name' => $member['name_th'],
        ':addr' => $param['addr'],
        ':remark' => $param['remark'],
        ':status' => ($param['receipt_code']=='' || $param['receipt_code']==undefined || $param['receipt_code']==null) ? 'WAIT' : 'PAID',
        ':real_receipt' => 'N',
        ':member_name' => $param['member_name'],
        ':addrId' => $param['addrId'],
        ':updated_by' => $_SESSION['staff']['id'],
    );
    $sql = "UPDATE invoice SET mem_code=:mem_code, branch_name=:branch_name, receipt_code=:receipt_code, deadline_date=:deadline_date, "
          ."name=:name, addr=:addr, status=:status, remark=:remark, real_receipt=:real_receipt, issue_date=:issue_date, name=:member_name, addr_id=:addrId, updated_time=NOW(), updated_by=:updated_by WHERE code=:code";
    $stmt = $pdo->prepare($sql);
    $res = $stmt->execute($data);
      if (!$res) {
      $pdo->rollback();
      responseJson(array(
        'status' => false,
      ));
      }

    if ($param['receipt_code'] != ''){
      $stmt = $pdo->prepare("SELECT count(code) rc FROM receipt WHERE code =:rc_check ");
      $stmt->execute(array(':rc_check' => $param['receipt_code'],));
      $num_rc = $stmt->fetchColumn();

      if($num_rc != 0){
        $stmt1 = $pdo->prepare("UPDATE receipt SET inv_code=:inVoiceCode WHERE code=:receiptCode");
        $res1 = $stmt1->execute(array(
        ':inVoiceCode' => $param['invoice_code'],
        ':receiptCode' => $param['receipt_code'],
        ));
        if (!$res1) {
          $pdo->rollback();
          responseJson(array(
            'status' => false,
            'B' => 'B'
          ));
        }
      }else{
        $stmt1 = $pdo->prepare("UPDATE invoice SET real_receipt='Y' WHERE code=:inVoiceCode");
        $res1 = $stmt1->execute(array(
        ':inVoiceCode' => $param['invoice_code'],
        ));
        if (!$res1) {
          $pdo->rollback();
          responseJson(array(
            'status' => false,
            'B' => 'C'
          ));
        }
      }
    }

    $stmt = $pdo->prepare("select prod_code from invoice_item where invoice_code=:invoiceCode");
    $stmt->execute(array(
      ':invoiceCode' => $param['invoice_code'],
    ));
    $invoiceItem = $stmt->fetchAll();
    $itemCheck = array();
    foreach ($invoiceItem as $invoiceItems) {
        array_push($itemCheck,$invoiceItems['prod_code']);
    }

    $line_num = 1;
    $total_amount = 0;
    $total_non_vat = 0;
    $vat_rate = 7;
    $test=0;
    foreach ($param['items'] as $item){
        $stmt = $pdo->prepare("SELECT * FROM product WHERE code=:code");
        $stmt->execute(array(
            ':code' => $item['prod_code'],
        ));
    $product = $stmt->fetch();

        if (!$product){

        }else{
          $amt = $product['price'] * $item['qty'];
          if ($product['vat_type']=='INCLUDE') {
            $total_non_vat += $amt * 100/(100+$vat_rate);
            $total_amount += $amt;
          } else {
            $total_non_vat += $amt;
            $total_amount += $amt * (100+$vat_rate) / 100;
          }
          $item['invoice_code'] = $param['invoice_code'];
          $item['line_num'] = $line_num;
          $item['account_code'] = $product['account_code'];
          $item['detail'] = $product['name'];
          $item['price'] = $product['price'];
          $item['unit'] = $product['unit'];
          $item['amount'] = $amt;
          $item['vat_type'] = $product['vat_type'];

          if (in_array($item['prod_code'], $itemCheck )){
              $sql = "UPDATE invoice_item SET amount = $item[amount], qty = $item[qty] WHERE invoice_code = '$item[invoice_code]' "
                    ."and prod_code = '$item[prod_code]'";
              $stmt = $pdo->prepare($sql);
              $res = $stmt->execute();
                if (!$res) {
                $pdo->rollback();
                responseJson(array(
                  'status' => false,
                  'C' => 'C'
                ));
               }
          }else {
              $sql = "INSERT INTO invoice_item "
                    ."(invoice_code,line_num,prod_code,account_code,detail,price,qty,unit,amount,vat_type,uuid,created_at,created_by,updated_at,updated_by) "
                    ."VALUES "
                    ."('$item[invoice_code]','$item[line_num]','$item[prod_code]','$item[account_code]','$item[detail]','$item[price]','$item[qty]',"
                    ."'$item[unit]','$item[amount]','$item[vat_type]',upper(uuid()),NOW(),'0',NOW(),'0')";
              $stmt = $pdo->prepare($sql);
              $res = $stmt->execute();
                if (!$res) {
                $pdo->rollback();
                responseJson(array(
                  'status' => false,
                  'D' => 'D'
                ));
               }
          }
          $line_num++;
        }
        $stmt = $pdo->prepare("UPDATE invoice SET amount=:amount, vat_amount=:vat_amount, total_amount=:total_amount WHERE code=:code");
        $res = $stmt->execute(array(
        ':amount' => $total_non_vat,
        ':vat_amount' => $total_amount - $total_non_vat,
        ':total_amount' => $total_amount,
        ':code' => $param['invoice_code'],
        ));
        if (!$res) {
        $pdo->rollback();
        responseJson(array(
          'status' => false,
          'E' => 'E'
        ));
        }
    }
	$arrayInvoiceCode = array();
	array_push($arrayInvoiceCode,$param['invoice_code']);
    $pdo->commit();
      responseJson(array(
        'status' => true,
        'code' => $param['invoice_code'],
        'invoiceList' => $arrayInvoiceCode,
        'data' => $sql,
        'itemCheck' => $itemCheck,
        'invoiceCode' => $param['invoice_code'],
        'ResuleInvoice' => $invoiceItem,
      ));
  }else{
  // AR1501xxxx
  $year = substr(date('Y'),-2);
  $month = date('m');

  $arrayInvoiceCode = array();

  $memFrom = $param['mem_code'];
  $memTo = $param['mem_code'];

  $invoiceCode = '';

  if ($param['mem_code_to'] != '' && $param['invoice_code'] == ''){
  $memTo = $param['mem_code_to'];
  }

   $pdo->beginTransaction();
   $stmt = $pdo->prepare(" select code from member "
    . " where code between :memcode and :memcodeto and is_active = 'YES' order by code");

    $stmt->execute(array(
      ':memcode' => $memFrom,
    ':memcodeto' => $memTo,
    ));
    $memberQuery = $stmt->fetchAll();

  foreach ($memberQuery as $memberLoop) {

    $fld = explode(',', 'code,period_code,mem_code,tax_id,branch_code,branch_name,'
      . 'receipt_code,issue_date,reissue_date,num_reissue,deadline_date,name,'
      . 'addr_id,addr,status,issue_by,cancel_by,cancel_reason,remark,'
      . 'amount,vat_rate,vat_amount,wht_rate,wht_amount,total_amount,created_by');
    $fld2 = explode(',', 'invoice_code,line_num,prod_code,account_code,detail,price,qty,unit,amount,vat_type');

    $code = _getNextCode('invoice', 'code', 'AR' . $year . $month, 4);
    if ($param['invoice_code'] != ''){
      $code = $param['invoice_code'];
      array_push($arrayInvoiceCode,$code);
    }else{
      array_push($arrayInvoiceCode,$code);
    }
    // query for member
    $stmt = $pdo->prepare(" select m.code, CASE WHEN ma.lang='TH' THEN m.name_th ELSE m.name_en END AS name, ma.id, ma.name branch, concat(ma.addr1  ,' ', ma.addr2 ,' ', ma.tambon ,' ', ma.amphur,' ', ma.province ,' ', ma.zipcode) addr "
      . " from member m left join member_address ma "
      . " on m.code = ma.mem_code "
      . " where m.code = :memcode and ma.invoice_addr='Y' ");

    $stmt->execute(array(
      ':memcode' => $memberLoop['code'],
    ));
    $member = $stmt->fetch();

    //query for member_address
    //print_r($member);

    $data = $param;
    $data['mem_code'] = $memberLoop['code'];
    $data['code'] = $code;
    $data['period_code'] = $_SESSION['period']['code'];
    $data['tax_id'] = '';
    $data['branch_code'] = '';
    $data['branch_name'] = $member['branch'];
    $data['receipt_code'] = $param['receipt_code'];
    $data['issue_date'] = $param['issue_date'];           //$_SESSION['period']['p_date'];
    $data['reissue_date'] = '0000-00-00';
    $data['num_reissue']=0;
    $data['name'] = $member['name'];
    $data['addr_id'] = $member['id'];
    $data['addr'] = $member['addr'];
    $data['status'] = ($param['receipt_code']=='' || $param['receipt_code']==undefined || $param['receipt_code']==null) ? 'WAIT' : 'PAID';
    $data['issue_by'] = $_SESSION['staff']['user'];
    $data['cancel_by'] = '';
    $data['cancel_reason'] = '';
    $data['amount'] = 0;
    $data['vat_rate'] = 7;
    $data['vat_amount'] = 0;
    $data['wht_rate'] = 0;
    $data['wht_amount'] = 0;
    $data['total_amount'] = 0;
    $data['created_by'] = $_SESSION['staff']['id'];
//print_r($data);
    $result = _saveData('invoice', $fld, $data, array('code'));
    //$result = _saveDataInvoice('invoice',$data);
    if ($result['status'] !== true) {
    $pdo->rollback();
    responseJson(array(
      'status' => false,
    ));
    }

    $line_num = 1;
    $total_amount = 0;
    $total_non_vat = 0;
    $vat_rate = 7;
        $test=0;
    foreach ($param['items'] as $item) {

    $stmt = $pdo->prepare("SELECT * FROM product WHERE code=:code");
    $stmt->execute(array(
      ':code' => $item['prod_code'],
    ));
    $product = $stmt->fetch();

    if (!$product){

    }else{
      $amt = $product['price'] * $item['qty'];
      if ($product['vat_type']=='INCLUDE') {
        $total_non_vat += $amt * 100/(100+$vat_rate);
        $total_amount += $amt;
      } else {
        $total_non_vat += $amt;
        $total_amount += $amt * (100+$vat_rate) / 100;
      }

      $item['invoice_code'] = $code;
      $item['line_num'] = $line_num;
      $item['account_code'] = $product['account_code'];
      $item['detail'] = $product['name'];
      $item['price'] = $product['price'];
      $item['unit'] = $product['unit'];
      $item['amount'] = $amt;
      $item['vat_type'] = $product['vat_type'];
      $result = _saveData('invoice_item', $fld2, $item, array('invoice_code', 'line_num'));
      //$result = _saveDataInvoice('invoice_item',$item);

      if ($result['status'] !== true) {
        $pdo->rollback();
        responseJson(array(
        'status' => false,
        ));
      }
      $line_num++;
      }

      //
      $stmt = $pdo->prepare("UPDATE invoice SET amount=:amount, vat_amount=:vat_amount, total_amount=:total_amount WHERE code=:code");
      $res = $stmt->execute(array(
      ':amount' => $total_non_vat,
      ':vat_amount' => $total_amount - $total_non_vat,
      ':total_amount' => $total_amount,
      ':code' => $code,
      ));
      if (!$res) {
      $pdo->rollback();
      responseJson(array(
        'status' => false,
      ));
      }
    }

    if ($param['receipt_code'] != ''){
      $stmt = $pdo->prepare("SELECT count(code) rc FROM receipt WHERE code =:rc_check ");
      $stmt->execute(array(':rc_check' => $param['receipt_code'],));
      $num_rc = $stmt->fetchColumn();

      if($num_rc != 0){
        $stmt1 = $pdo->prepare("UPDATE receipt SET inv_code=:inVoiceCode WHERE code=:receiptCode");
        $res1 = $stmt1->execute(array(
        ':inVoiceCode' => $code,
        ':receiptCode' => $param['receipt_code'],
        ));
        if (!$res1) {
          $pdo->rollback();
          responseJson(array(
            'status' => false,
            'B' => 'B'
          ));
        }
      }else{
        $stmt1 = $pdo->prepare("UPDATE invoice SET real_receipt='Y' WHERE code=:inVoiceCode");
        $res1 = $stmt1->execute(array(
        ':inVoiceCode' => $code,
        ));
        if (!$res1) {
          $pdo->rollback();
          responseJson(array(
            'status' => false,
            'B' => 'C'
          ));
        }
      }
    }

  }
  //echo $code;

  $pdo->commit();
  responseJson(array(
    'status' => true,
    'code' => $arrayInvoiceCode[0],
  'invoiceList' => $arrayInvoiceCode,
  ));
}
}

function doinformYearList() {
  global $pdo;

  $stmt = $pdo->prepare("select distinct substr(issue_date,1,4) year from inform ");
  $stmt->execute();
  responseJson(array(
    'status' => true,
    'year' => $stmt->fetchAll(),
  ));
}

function doInvoiceCancel($param){
  global $pdo;
  $pdo->beginTransaction();

  $stmt = $pdo->prepare("UPDATE invoice SET status='CANCELLED' WHERE code=:code");
      $res = $stmt->execute(array(
      ':code' => $param['invoice_code'],
      ));
      if (!$res) {
      $pdo->rollback();
      responseJson(array(
        'status' => false,
      ));
      }

  $pdo->commit();
  responseJson(array(
    'status' => true,
  ));
}

function doListInvoiceCode($param) {
  global $pdo;

  $memFrom = $param['mem_code'];
  $memTo = $param['mem_code'];

  if ($param['mem_code_to'] != '' ) {
    $memTo = $param['mem_code_to'];
  }

  $invFrom = $param['invoice_code'];
  $invTo = $param['invoice_code'];

  if ($param['invoice_code_to'] != '' ) {
    $invTo = $param['invoice_code_to'];
  }

  $pdo->beginTransaction();

  $p = array();
  if ($param['prod_code'] == ''){
      $sql = "select distinct inv.code from invoice inv inner join invoice_item invd on inv.code = invd.invoice_code "
            ."where status = 'WAIT' ";
  }else{
      $sql = "select inv.code from invoice inv inner join invoice_item invd on inv.code = invd.invoice_code "
            ."and invd.prod_code=:prod_code where status = 'WAIT' ";
            $p[':prod_code'] = $param['prod_code'];
  }

  if ($invFrom != '') {
  //echo 'code_inv';
    $sql = $sql . " and (code between :invcode and :invcodeto) ";
    $p[':invcode'] = $invFrom;
    $p[':invcodeto'] = $invTo;
  }
  if ($memFrom != '') {
  //echo 'code_mem';
    $sql = $sql . " or (mem_code between :memcode and :memcodeto) ";
    $p[':memcode'] = $memFrom;
    $p[':memcodeto'] = $memTo;
  }
  //echo $p[':prod_code'];
  $stmt = $pdo->prepare($sql);
  $stmt->execute($p);

    $invQuery = $stmt->fetchAll();
  $code_list = array();
  foreach($invQuery as $row) {
    $code_list[] = $row['code'];
  }
  $pdo->commit();
  responseJson(array(
    'status' => true,
    'code' => $code_list,
    'sql' => $sql,
  ));
}

function doListInvoiceCodeReprint($param){
  global $pdo;

  $memFrom = $param['mem_code'];
  $memTo = $param['mem_code'];
  $mem_type = $param['member_type'];
  $memstatus = $param['is_active'];

  if ($param['mem_code_to'] != '' ) {
    $memTo = $param['mem_code_to'];
  }

  $invFrom = $param['invoice_code'];
  $invTo = $param['invoice_code'];

  if ($param['invoice_code_to'] != '' ) {
    $invTo = $param['invoice_code_to'];
  }

  $pdo->beginTransaction();

  $p = array();
  $sql = "select distinct iv.code from invoice iv inner join member m on iv.mem_code=m.code "
        ."where iv.status in ('WAIT') ";

  if ($invFrom != '') {
  //echo 'code_inv';
    $sql = $sql . " and (iv.code between :invcode and :invcodeto) ";
    $p[':invcode'] = $invFrom;
    $p[':invcodeto'] = $invTo;
  }
  if ($memFrom != '') {
  //echo 'code_mem';
    $sql = $sql . " and ((iv.mem_code between :memcode and :memcodeto) and "
      ."(case when :memtype='ALL' then m.type=m.type else m.type=:memtype end) and "
      ."(case when :memstatus='ALL' then m.is_active=m.is_active else m.is_active='YES' end)) ";
    $p[':memcode'] = $memFrom;
    $p[':memcodeto'] = $memTo;
    $p[':memtype'] = $mem_type;
    $p[':memstatus'] = $memstatus;
  }
  //echo $p[':prod_code'];
  $stmt = $pdo->prepare($sql);
  $stmt->execute($p);

    $invQuery = $stmt->fetchAll();
  $code_list = array();
  foreach($invQuery as $row) {
    $code_list[] = $row['code'];
  }
  $pdo->commit();
  responseJson(array(
    'status' => true,
    'code' => $code_list,
    'sql' => $sql,
  ));
}

function doReInvoice($param) {

  global $pdo;

  $memFrom = $param['mem_code'];
  $memTo = $param['mem_code'];

  if ($param['mem_code_to'] != '' ) {
    $memTo = $param['mem_code_to'];
  }

  $invFrom = $param['invoice_code'];
  $invTo = $param['invoice_code'];

  if ($param['invoice_code_to'] != '' ) {
    $invTo = $param['invoice_code_to'];
  }

  $pdo->beginTransaction();

  $p = array();
  if ($param['prod_code'] == ''){
      $sql = "select distinct inv.code from invoice inv inner join invoice_item invd on inv.code = invd.invoice_code "
            ."where status = 'WAIT' ";
  }else{
      $sql = "select inv.code from invoice inv inner join invoice_item invd on inv.code = invd.invoice_code "
            ."and invd.prod_code=:prod_code where status = 'WAIT' ";
            $p[':prod_code'] = $param['prod_code'];
  }

  if ($invFrom != '') {
  //echo 'code_inv';
    $sql = $sql . " and (code between :invcode and :invcodeto) ";
    $p[':invcode'] = $invFrom;
    $p[':invcodeto'] = $invTo;
  }
  if ($memFrom != '') {
  //echo 'code_mem';
    $sql = $sql . " and (mem_code between :memcode and :memcodeto) ";
    $p[':memcode'] = $memFrom;
    $p[':memcodeto'] = $memTo;
  }
  //echo $p[':prod_code'];
  $stmt = $pdo->prepare($sql);
  $stmt->execute($p);

  $invQuery = $stmt->fetchAll();
  $code_list = array();
  foreach($invQuery as $row) {
    $code_list[] = $row['code'];
  }
  //print_r($code_list);
  $list = implode("','", $code_list);
  $sql = "update invoice set remark=:remarker, reissue_date=:reissue_date, issue_date=:reissue_date, deadline_date=:deadline_date,num_reissue = num_reissue + 1 where status <> 'PAID' and code in('" . $list . "')";

  $stmt = $pdo->prepare($sql);
  $res = $stmt->execute(array(
      ':reissue_date' => $param['reissue_date'],
      ':deadline_date' => $param['deadline_date'],
      ':remarker' => $param['remark'],
      ));
      if (!$res) {
      $pdo->rollback();
      responseJson(array(
        'status' => false,
      ));
      }

  $pdo->commit();
  responseJson(array(
    'status' => true,
    'code' => $code_list,
    'invoiceList' => $arrayInvoiceCode,
    'sql' => $sql,
  ));
}


////////////////////////////////////////////////////////////
// PRIVATE FUNCTIONS
////////////////////////////////////////////////////////////

function _saveData($table, $fld, $data, $uk=array()) {
  global $pdo;

  // check dup
  if (is_array($uk) && count($uk) > 0) {
    $tmp = array();
    $param = array(
      ':uuid' => $data['uuid'],
    );
    foreach ($uk as $f) {
      $tmp[] = "`" . $f . "`=:" . $f;
      $param[':' . $f] = '' . $data[$f];
    }
//    print_r($param);
    // echo "SELECT 1 FROM `" . $table . "` WHERE " . implode(' AND ', $tmp) . " AND uuid <> :uuid" . PHP_EOL;
    $stmt = $pdo->prepare("SELECT 1 FROM `" . $table . "` WHERE " . implode(' AND ', $tmp) . " AND uuid <> :uuid");
    $stmt->execute($param);
    $row = $stmt->fetch();

    if (is_array($row)) {
      return array(
        'status' => false,
        'reason' => 'ERR_DUPLICATE',
      );
    }
  }
  $tmp = array();
  $param = array();
  foreach ($fld as $f) {
    $tmp[] = "`" . $f . "`=:" . $f;
    $param[':' . $f] = '' . $data[$f];
  }
  $found = true;

  if ($data['uuid'] != '') {
    $stmt = $pdo->prepare("SELECT 1 FROM `" . $table . "` WHERE uuid=:uuid");
    $stmt->execute(array(
      ':uuid' => $data['uuid'],
    ));
    $row = $stmt->fetch();
    if (!is_array($row)) {
      $found = false;
    }
  }

  if ($data['uuid'] == '' || !$found) {
    // INSERT
    $tmp[] = "`uuid`=upper(uuid())";
    $stmt = $pdo->prepare("INSERT INTO `" . $table . "` SET " . implode(",", $tmp));
    $res = $stmt->execute($param);
    if (!$res) {
      return array(
        'status' => false,
        'reason' => 'ERR_SQL',
        'msg' => $stmt->errorInfo(),
      );
    }

    $tmp = array();
    $param = array();
    foreach ($uk as $f) {
      $tmp[] = "`" . $f . "`=:" . $f;
      $param[':' . $f] = $data[$f];
    }
    $stmt = $pdo->prepare("SELECT uuid FROM `" . $table . "` WHERE " . implode(' AND ', $tmp));
    $stmt->execute($param);
    $uuid = $stmt->fetchColumn();
    if (!$uuid) {
      return array(
        'status' => false,
        'reason' => 'ERR_INSERT',
      );
    }
    $data['uuid'] = $uuid;
  } else {
    // UPDATE
    $param[':uuid'] = $data['uuid'];
    $stmt = $pdo->prepare("UPDATE `" . $table . "` SET " . implode(",", $tmp) . " WHERE `uuid`=:uuid");

    $res = $stmt->execute($param);
    if (!$res) {
      return array(
        'status' => false,
        'reason' => 'ERR_SQL',
        'msg' => $stmt->errorInfo(),
      );
    }
  }
  return array(
    'status' => true,
    'uuid' => $data['uuid'],
  );
}

// function _saveDataInvoice($table,$param){
    // global $pdo;
//
    // try{
        // $pdo->beginTransaction();
        // if ($table == 'invoice'){
            // $data = array(
            // ':code' => $param['code'],
            // ':period_code' => $param['period_code'],
            // ':mem_code' => $param[''],
            // ':tax_id' => $param['tax_id'],
            // ':branch_code' => $param['branch_code'],
            // ':branch_name' => $param['branch_name'],
            // ':receipt_code' => $param['receipt_code'],
            // ':issue_date' => $param['issue_date'],
            // ':reissue_date' => $param['reissue_date'],
            // ':num_reissue' => $param['num_reissue'],
            // ':name' => $param['name'],
            // ':addr' => $param['addr'],
            // ':status' => $param['status'],
            // ':issue_by' => $param['issue_by'],
            // ':cancel_by' => $param['cancel_by'],
            // ':cancel_reason' => $param['cancel_reason'],
            // ':amount' => $param['amount'],
            // ':vat_rate' => $param['vat_rate'],
            // ':vat_amount' => $param['vat_amount'],
            // ':wht_rate' => $param['wht_rate'],
            // ':wht_amount' => $param['wht_amount'],
            // ':total_amount' => $param['total_amount'],
            // );
            // $stmt = $pdo->prepare("INSERT INTO invoice SET code=:code, period_code=:period_code, mem_code=:")
        // }
    // }
// }

function _getStaffByUser($user) {
  global $pdo;

  $stmt = $pdo->prepare("SELECT * FROM staff WHERE user=:user");
  $stmt->execute(array(
    ':user' => $user,
  ));

  $staff = $stmt->fetch();
  if (!$staff) {
    return false;
  }
  $staff['acl'] = explode(',', $staff['acl_list']);
  return $staff;
}

function _addNewPeriod($station_code, $station_type) {
  global $pdo;

  // get station type
  $p_date = date('Y-m-d');

  if ($station_type=='DAY') {
    $p_type='DAY';
    $p_from = $p_date . ' 00:00:00';
    $p_to = $p_date . ' 23:59:59';
  } else {
    $p_type='AM';
    $p_from = $p_date . ' 08:00:00';
    $p_to = $p_date . ' 18:59:59';
  };

  $code = $station_code . substr(str_replace('-', '', $p_date), -6) . ($p_type=='AM' ? 'M' : 'D');

  $stmt = $pdo->prepare("INSERT INTO period "
    . "(code, station_code, p_date, p_type, p_from, p_to, is_active, is_post, uuid) "
    . "VALUES(:code, :station_code, :p_date, :p_type, :p_from, :p_to, :is_active, :is_post, UPPER(UUID()))");

  $stmt->execute(array(
    ':code' => $code,
    ':station_code' => $station_code,
    ':p_date' => $p_date,
    ':p_type' => $p_type,
    ':p_from' => $p_from,
    ':p_to' => $p_to,
    ':is_active' => 'YES',
    ':is_post' => 'NO',
  ));
}

function _getActivePeriodByStationCode($station_code) {
  global $pdo;

  $stmt = $pdo->prepare("SELECT * FROM period WHERE station_code=:station_code AND is_active='YES' order by created_at desc limit 1");
  $stmt->execute(array(
    ':station_code' => $station_code,
  ));

  return $stmt->fetch();
}

function _getStationByCode($code) {
  global $pdo;

  $stmt = $pdo->prepare("SELECT * FROM station WHERE code=:code");
  $stmt->execute(array(
    ':code' => $code,
  ));

  $station = $stmt->fetch();
  if (!$station) {
    return false;
  }

  try {
    $station['setting'] = json_decode($station['setting'], true);
  } catch(Exception $e) {
    $station['setting'] = array();
  }

  return $station;
}

function _genData($fld, $data) {
  $out = array();
  foreach ($fld as $f) {
    $out[':' . $f] = $data[$f];
  }
  return $out;
}

function _getNextCode($table, $fld, $prefix='', $size=5, $start=1) {
  global $pdo;

  $sql = "SELECT max(`" . $fld . "`) maxCode FROM `" . $table . "`";
  if ($prefix != '') {
    $sql .= " WHERE `" . $fld . "` LIKE '" . $prefix . "%'";
  }
  $stmt = $pdo->prepare($sql);
  $stmt->execute();
  $maxCode = $stmt->fetchColumn();
  if ($maxCode===false) {
    $next = $start + 0;
  } else {
    $next = substr($maxCode, strlen($prefix)) + 1;
  }
  return $prefix . substr('0000000000000' . $next, -$size);
}

function _createOrUpdateCardAccount($type, $member) {
  global $pdo;

  // check existing
  $stmt = $pdo->prepare("SELECT uuid FROM card_account WHERE code=:code");
  $stmt->execute(array(
    ':code' => $type . $member['code'],
  ));

  $uuid = $stmt->fetchColumn();
  if ($uuid===false) {
    // CREATE NEW card_account
    $stmt = $pdo->prepare("INSERT INTO card_account SET code=:code, type=:type, mem_code=:mem_code, name_th=:name_th, name_en=:name_en, "
      . "balance=0, daily_quota=1000, is_active='YES', uuid=upper(uuid())");
    $stmt->execute(array(
      ':code' => $type . $member['code'],
      ':type' => $type=='M' ? 'CORPORATE' : 'FREELANCE',
      ':mem_code' => $member['code'],
      ':name_th' => $member['name_th'],
      ':name_en' => $member['name_en'],
    ));

    $stmt = $pdo->prepare("SELECT uuid FROM card_account WHERE code=:code");
    $stmt->execute(array(
      ':code' => $type . $member['code'],
    ));

    $uuid = $stmt->fetchColumn();
    if (!$uuid) {
      return array(
        'status' => false,
        'reason' => 'ERR_INSERT',
      );
    }


  } else {
    // UPDATE name and status
    $stmt = $pdo->prepare("UPDATE card_account SET name_th=:name_th, name_en=:name_en, is_active=:is_active"
      . " WHERE uuid=:uuid");
    $stmt->execute(array(
      ':name_th' => $member['name_th'],
      ':name_en' => $member['name_en'],
      ':is_active' => $member['is_active'],
      ':uuid' => $uuid,
    ));
  }
  return array(
    'status' => true,
    'uuid' => $uuid,
  );
}

function _deleteByUuid($table, $uuid) {
  global $pdo;

  if (!is_array($uuid)) {
    $uuid = array($uuid);
  }

  $stmt = $pdo->prepare("DELETE FROM `" . $table . "` WHERE uuid IN('" . implode("', '", $uuid) . "')");
  $stmt->execute();
}

function _appendCardAccountTx($data) {
  global $pdo;

  $stmt = $pdo->prepare("INSERT INTO card_account_tx SET acc_code=:acc_code, "
    . "tx_date=NOW(), tx_type=:tx_type, card_code=:card_code, staff=:staff, "
    . "ref1_type=:ref1_type, ref1_code=:ref1_code, ref2_type=:ref2_type, ref2_code=:ref2_code, "
    . "pax=:pax, balance_pax=:balance_pax, remark=:remark, uuid=upper(uuid())");
  $stmt->execute(array(
    ':acc_code' => $data['acc_code'],
    ':tx_type' => isset($data['tx_type']) ? $data['tx_type'] : 'NONE',
    ':card_code' => isset($data['card_code']) ? $data['card_code'] : '',
    ':ref1_type' => isset($data['ref1_type']) ? $data['ref1_type'] : '',
    ':ref1_code' => isset($data['ref1_code']) ? $data['ref1_code'] : '',
    ':ref2_type' => isset($data['ref2_type']) ? $data['ref2_type'] : '',
    ':ref2_code' => isset($data['ref2_code']) ? $data['ref2_code'] : '',
    ':pax' => $data['pax']+0,
    ':balance_pax' => $data['balance_pax']+0,
    ':remark' => isset($data['remark']) ? $data['remark'] : '',
    ':staff' => $_SESSION['staff']['user'],
  ));
}

function _getMemberByCode($code) {
  global $pdo;

  $stmt = $pdo->prepare("SELECT * FROM member WHERE code=:code");
  $stmt->execute(array(
    ':code' => $code,
  ));

  return $stmt->fetch();
}

function _getMemberByUuid($uuid) {
  global $pdo;

  $stmt = $pdo->prepare("SELECT * FROM member WHERE uuid=:uuid");
  $stmt->execute(array(
    ':uuid' => $uuid,
  ));
  $member = $stmt->fetch();

  if ($member===false) {
    return false;
  }

  $member['specialist'] = explode(',', $member['specialist']);
  $member['market_inbound'] = explode(',', $member['market_inbound']);
  $member['market_outbound'] = explode(',', $member['market_outbound']);

  $stmt = $pdo->prepare("SELECT id, mem_code, seq, name_th, name_en, position, CASE WHEN nation = 'N/A' THEN '-' ELSE nation END as nation, "
                      . " uuid, created_at, created_by, updated_at, updated_by FROM member_contact "
                      . " WHERE mem_code=:mem_code ORDER BY seq");
  $stmt->execute(array(
    ':mem_code' => $member['code'],
  ));
  $member['contacts'] = $stmt->fetchAll();

  $stmt = $pdo->prepare("SELECT * FROM member_address WHERE mem_code=:mem_code ORDER BY code, lang");
  $stmt->execute(array(
    ':mem_code' => $member['code'],
  ));
  $member['addresses'] = $stmt->fetchAll();

  return $member;
}

function _getInvoiceByCode($code) {
  global $pdo;

  $stmt = $pdo->prepare("SELECT * FROM invoice WHERE code=:code");
  $stmt->execute(array(
    ':code' => $code,
  ));

  $invoice = $stmt->fetch();
  $stmt = $pdo->prepare("SELECT * FROM invoice_item WHERE invoice_code=:code ORDER BY line_num");
  $stmt->execute(array(
    ':code' => $code,
  ));
  $invoice['items'] = $stmt->fetchAll();
  return $invoice;
}

function _createBuscall($airport, $inform, $bus_list) {
  global $pdo;

  $flight = _getFlight($airport, $inform['flight'], $inform['flight_date']);
  // $fld = explode(',', 'code,inform_code,airport,license,pax,is_landing,is_park,'
  //   . 'flight_schedule,flight_landing');
  $data = array(
    ':code' => '',
    ':inform_code' => $inform['code'],
    ':airport' => $airport,
    ':license' => '',
    ':pax' => 0,
    ':is_landing' => $flight===false ? 'NO' : ($flight['landing_status']=='LANDED' ? 'YES' : 'NO'),
    ':is_park' => 'NO',
    ':flight' => $inform['flight'],
    ':flight_schedule' => $flight===false ? $inform['flight_date'] : $flight['schedule_time'],
    ':flight_landing' => $flight===false ? $inform['flight_date'] : $flight['landing_time'],
    ':num_call' => 0,
    ':status' => 'WAIT',
  );

  // cancel existing buscall
  $stmt = $pdo->prepare("UPDATE buscall SET status='CANCEL' WHERE inform_code=:inform_code AND status <> 'DONE'");
  $stmt->execute(array(
    ':inform_code' => $inform['code'],
  ));

  // create new buscall
  $stmt = $pdo->prepare("INSERT INTO buscall (code,inform_code,airport,license,pax,is_landing,is_park,"
    . "flight,flight_schedule,flight_landing,num_call,status,uuid) VALUES(:code,:inform_code,:airport,:license,:pax,:is_landing,:is_park,"
    . ":flight,:flight_schedule,:flight_landing,:num_call,:status,upper(uuid())) "
    . "ON DUPLICATE KEY UPDATE license=VALUES(license), pax=VALUES(pax), is_landing=VALUES(is_landing), "
    . "is_park=VALUES(is_park), flight=VALUES(flight), flight_schedule=VALUES(flight_schedule), flight_landing=VALUES(flight_landing), "
    . "num_call=IF(status='DONE',num_call,VALUES(num_call)), "
    . "status=IF(status='DONE',status,VALUES(status)) ");
  $i = 0;
  foreach($bus_list as $bus) {
    if (strtoupper(substr($bus['license'], -1))=='N') {
      continue;
    }
    $data[':code'] = $inform['code'] . '-' . substr('00' . ($i+1), -2);
    $data[':license'] = $bus['license'];
    $data[':pax'] = $bus['pax']+0;
//    $res = _saveData('buscall', $fld, $buscall, array('code'));
    $res = $stmt->execute($data);
    $i++;
  }
}

function _createBuscall_bak($airport, $inform, $bus_list) {
  global $pdo;

  $flight = _getFlight($airport, $inform['flight'], $inform['flight_date']);
  $fld = explode(',', 'code,inform_code,airport,license,pax,is_landing,is_park,'
    . 'flight,flight_schedule,flight_landing');
  $buscall = array(
    'inform_code' => $inform['code'],
    'airport' => $airport,
    'license' => '',
    'pax' => 0,
    'is_landing' => $flight===false ? 'NO' : ($flight['landing_status']=='LANDED' ? 'YES' : 'NO'),
    'is_park' => 'NO',
    'flight' => $inform['flight'],
    'flight_schedule' => $flight===false ? $inform['flight_date'] : $flight['schedule_time'],
    'flight_landing' => $flight===false ? $inform['flight_date'] : $flight['landing_time'],
  );
  $i = 0;
  foreach($bus_list as $bus) {
    if (strtoupper(substr($bus['license'], -1))=='N') {
      continue;
    }
    $buscall['code'] = $inform['code'] . '-' . substr('00' . ($i+1), -2);
    $buscall['license'] = $bus['license'];
    $buscall['pax'] = $bus['pax']+0;
    $res = _saveData('buscall', $fld, $buscall, array('code'));
    $i++;
  }
}

function _cancelBuscall($inform_code) {
  global $pdo;

  $stmt = $pdo->prepare("UPDATE buscall SET status='CANCEL' WHERE code like concat(:inform_code, '-%')");
  $stmt->execute(array(
    ':inform_code' => $inform_code,
  ));
}

function _getFlight($airport, $flight, $time) {
  global $pdo;

  $stmt = $pdo->prepare("SELECT * FROM flight WHERE airport=:airport AND flight=:flight "
    . "AND schedule_time BETWEEN :time - INTERVAL 1 HOUR AND :time + INTERVAL 1 HOUR"
    . " ORDER BY schedule_time ASC LIMIT 1");
  $stmt->execute(array(
    ':airport' => $airport,
    ':flight' => $flight,
    ':time' => $time,
  ));
  return $stmt->fetch();
}

function _createReceipt($param) {
  global $pdo;

  $member = _getMemberByCode($param['mem_code']);
  if ($member===false) {
    throw new Exception('ERR_MEMBER_NOT_FOUND');
  }

  $issue_date = isset($param['issue_date']) ? $param['issue_date'] : $_SESSION['period']['p_date'];
  $prefix = substr($issue_date, 2,2) . '-' . $_SESSION['period']['station_code'] . '-';
  $code = _getNextCode('receipt', 'code', $prefix, 6);

  // prepare products
  $prod_list = array();
  foreach ($param['items'] as $item) {
    $prod_list[] = $item['prod_code'];
  }
  $stmt = $pdo->prepare("SELECT * FROM product WHERE code IN ('" . implode("', '", $prod_list) . "')");
  $stmt->execute();
  $products = array();
  while ($row = $stmt->fetch()) {
    $products[$row['code']] = $row;
  }

  // calcute amount
  $amount = 0;
  $vat_amount = 0;
  $vat_rate = 7.0;
  $tmp_amount = 0;
  $tmp = 0;
  $items = array();
  $line_num = 1;
  foreach ($param['items'] as $item) {
    if (!isset($products[$item['prod_code']])) {
       throw new Exception('ERR_PRODUCT_NOT_FOUND');
    }
    $product = $products[$item['prod_code']];
    if ($product['vat_type']=='EXCLUDE') {
      $amount += $product['price'] * $item['qty'];
      // $vat_amount += round($product['price'] * $item['qty'] * $vat_rate / 100.0, 2);
      $vat = round($product['price'] * $item['qty'] * $vat_rate / 100.0, 2);
    } else {
      $tmp_amount += $product['price'] * $item['qty'];
      $tmp += round($product['price'] * $item['qty'] * 100.0 / (100.0+$vat_rate), 2);
      // $vat_amount += round((($product['price'] * $item['qty']) * $vat_rate) / (100.0+$vat_rate), 2);
      $vat = round((($product['price'] * $item['qty']) * $vat_rate) / (100.0+$vat_rate), 2);
    }
    $vat_amount += $vat;
    $acc_code = $product['account_code'];
    if ($product['code']=='TOPUP') {
      $acc_code = substr($code,5,2)=='SU' ? '410801' : '410901';
    }
    $items[] = array(
      ':receipt_code' => $code,
      ':line_num' => $line_num,
      ':prod_code' => $product['code'],
      ':account_code' =>  $acc_code,
      ':detail' => $product['name'] . (isset($item['detail']) ? ' ' . $item['detail'] : ''),
      ':price' => $product['price'],
      ':qty' => $item['qty'],
      ':unit' => $product['unit'],
      ':amount' => round($product['price'] * $item['qty'], 2),
      ':vat_type' => $product['vat_type'],
      ':vat' => $vat
    );
    $line_num++;
  }
  // $tmp = round($tmp_amount * 100.0 / (100.0+$vat_rate), 2);
  $amount = round($amount + $tmp, 2);
  // $vat_amount = round($vat_amount + $tmp_amount - $tmp, 2);
  $wht_rate = $param['wht_rate']+0;
  $wht_amount = round(($amount * $wht_rate)/100, 2);//ส่วนที่คำนวณผืด
  $total_amount = round($amount + $vat_amount - $wht_amount, 2);
  $cash = round($total_amount - $param['cheque'] - $param['payin'], 2);


  $data = array(
    ':code' => $code,
    ':period_code' => $_SESSION['period']['code'],
    ':mem_code' => $member['code'],
    ':tax_id' => $member['tax_id'],
    ':branch_code' => $param['address']['code'],
    ':branch_name' => $param['address']['name'],
    ':inv_code' => isset($param['inv_code']) ? $param['inv_code'] : '',
    ':issue_date' => $issue_date,
    ':name' => $param['address']['lang']=='EN' ? $member['name_en'] : $member['name_th'],
    ':addr' => $param['address']['addr'],
    ':issue_by' => $_SESSION['staff']['user'],
    ':remark' => isset($param['remark']) ? $param['remark'] : '',
    ':amount' => $amount,
    ':vat_rate' => $vat_rate,
    ':vat_amount' => $vat_amount,
    ':wht_rate' => $wht_rate,
    ':wht_amount' => $wht_amount,
    ':total_amount' => $total_amount,
    ':cash' => $cash,
    ':cheque' => $param['cheque']+0,
    ':payin' => $param['payin']+0,
    ':cheque_bank' => $param['cheque'] > 0 ? $param['cheque_bank'] : '',
    ':cheque_branch' => $param['cheque'] > 0 ? $param['cheque_branch'] : '',
    ':cheque_number' => $param['cheque'] > 0 ? $param['cheque_number'] : '',
    ':cheque_date' => $param['cheque'] > 0 ? $param['cheque_date'] : '0000-00-00',
    ':staff_id' => $_SESSION['staff']['id'],
    ':cancel_reason' => $param['cancel_reason'] == null ? "" : $param['cancel_reason']
  );
  $stmt = $pdo->prepare("INSERT INTO receipt SET code=:code, period_code=:period_code, "
    . "mem_code=:mem_code, tax_id=:tax_id, branch_code=:branch_code, branch_name=:branch_name, "
    . "inv_code=:inv_code, issue_date=:issue_date, name=:name, addr=:addr, "
    . "status='PAID', issue_by=:issue_by, cancel_by='', cancel_reason=:cancel_reason, "
    . "remark=:remark, amount=:amount, vat_rate=:vat_rate, vat_amount=:vat_amount, "
    . "wht_rate=:wht_rate, wht_amount=:wht_amount, total_amount=:total_amount, "
    . "cash=:cash, cheque=:cheque, payin=:payin, cheque_bank=:cheque_bank, "
    . "cheque_branch=:cheque_branch, cheque_number=:cheque_number, cheque_date=:cheque_date, "
    . "is_post='NO', uuid=upper(uuid()), created_by=:staff_id");
  $stmt->execute($data);

  $stmt = $pdo->prepare("INSERT INTO receipt_item SET receipt_code=:receipt_code, "
    . "line_num=:line_num, prod_code=:prod_code, account_code=:account_code, "
    . "detail=:detail, price=:price, qty=:qty, unit=:unit, amount=:amount, "
    . "vat_type=:vat_type,vat=:vat, uuid=upper(uuid())");
  foreach ($items as $item) {
    $stmt->execute($item);
  }

  return $code;
}

function _doOutputTaxReport($dateFrom, $dateTo) {
  global $pdo;

  $stmt = $pdo->prepare("
SELECT r.issue_date, r.code, m.name_th, r.amount, r.vat_amount, r.total_amount
FROM receipt r JOIN member m on r.mem_code=m.code
WHERE r.period_id in (
  select id
  from period2
  where p_date between :date_from and :date_to
    and code=:code
) and r.status='PAID'
order by r.code");
  $stmt->execute(array(
    ':code' => $_GET['code'],
    ':date_from' => $dateFrom,
    ':date_to' => $dateTo,
  ));

  $sum_amount = 0;
  $sum_vat = 0;
  $sum_total = 0;

  $out = array();
  while ($row = $stmt->fetch()) {
    $out[] = array(
      'date' => thDate($row['issue_date']),
      'code' => $row['code'],
      'name' => $row['name_th'],
      'amount' => number_format($row['amount'], 2),
      'vat_amount' => number_format($row['vat_amount'], 2),
      'total_amount' => number_format($row['total_amount'], 2),
    );
    $sum_amount += $row['amount'];
    $sum_vat += $row['vat_amount'];
    $sum_total += $row['total_amount'];
  }
  return array(
    'date_from' => thDate($dateFrom),
    'date_to' => thDate($dateTo),
    'sum_amount' => number_format($sum_amount, 2),
    'sum_vat' => number_format($sum_vat, 2),
    'sum_total' => number_format($sum_total, 2),
    'items' => $out,
  );
}

function _doReceiptSummary($param) {
  global $pdo;


  $sql = "select sum(r.amount) sub_total, sum(r.vat_amount) vat_total
    , sum(r.wht_amount) wht_total
    , sum(r.total_amount) grand_total
    , min(r.code) code_from, max(r.code) code_to, count(*) num_receipt
    , sum(r.cash) cash_total
    , sum(r.cheque) cheque_total
    , sum(r.payin) payin_total
  from receipt r
  where r.period_code=:p_code
    and r.status='PAID'";
  $stmt = $pdo->prepare($sql);
  $stmt->execute(array(
    ':p_code' => $param['p_code'],
  ));
  $summary = $stmt->fetch();
  if ($summary === false) {
    return false;
  }
  $summary['p_date'] = thDate($param['p_date']);
  $summary['p_type'] = $param['p_type'];
  $summary['p_from_time'] = '';
  $summary['p_to_date'] = '';
  $summary['p_to_time'] = '';
  $summary['sub_total'] = number_format($summary['sub_total'], 2);
  $summary['vat_total'] = number_format($summary['vat_total'], 2);
  $summary['wht_total'] = number_format($summary['wht_total'], 2);
  $summary['grand_total'] = number_format($summary['grand_total'], 2);
  $summary['cash_total'] = number_format($summary['cash_total'], 2);
  $summary['cheque_total'] = number_format($summary['cheque_total'], 2);
  $summary['payin_total'] = number_format($summary['payin_total'], 2);
  $sql = "select p.code, p.name, p.unit, i.price,
  sum(i.qty) sum_qty,
  sum(if(i.vat_type='EXCLUDE', i.amount, i.amount*100/(100+r.vat_rate))) sum_amount
from receipt r
  join receipt_item i
    on r.code=i.receipt_code and r.period_code=:p_code and r.status='PAID'
  join product p
    on i.prod_code=p.code
group by prod_code, i.price";
  $stmt = $pdo->prepare($sql);
  $res = $stmt->execute(array(
    ':p_code' => $param['p_code'],
  ));
  if (!$res) {
    print_r($stmt->errorInfo());
    return false;
  }

  $summary['items'] = array();
  while ($row = $stmt->fetch()) {
    $row['sum_qty'] = number_format($row['sum_qty'], 0);
    $row['sum_amount'] = number_format($row['sum_amount'], 2);
    $summary['items'][] = $row;
  }
  return $summary;
}
// http://122.155.3.254/rapidpass/api.php?act=report&report=receive_voucher&uuid=29F400FA-5EFE-40DD-B14E-C4787FF6E75B&p_date=2014-09-14&p_type=PM

function _doReceiveVoucher($param) {
  global $pdo;

  $bank_account = array(
    'HQ' => array('code' => '111204', 'name' => 'เงินฝากธนาคาร S/A กสิกรไทย พัฒนพงศ์ 018-2-77615-7'),
    'HO' => array('code' => '111204', 'name' => 'เงินฝากธนาคาร S/A กสิกรไทย พัฒนพงศ์ 018-2-77615-7'),
    'SU' => array('code' => '111205', 'name' => 'เงินฝากธนาคาร S/A ทหารไทย ท่าอากาศยาน 012-2-67293-4'),
    'DM' => array('code' => '111212', 'name' => 'เงินฝากธนาคาร C/A ทหารไทย ท่าอากาศยาน 012-1-05454-8'),
    'NS' => array('code' => '111204', 'name' => 'เงินฝากธนาคาร S/A กสิกรไทย พัฒนพงศ์ 018-2-77615-7'),
  );

  $sql = "select sum(r.amount) sub_total, sum(r.vat_amount) vat_total
    , sum(r.wht_amount) wht_total
    , sum(r.total_amount) grand_total
    , min(r.code) code_from, max(r.code) code_to, count(*) num_receipt
    , sum(r.cash) cash_total
    , sum(r.cheque) cheque_total
    , sum(r.payin) payin_total
  from receipt r
  where r.period_code=:p_code
    and r.status='PAID'";

  $stmt = $pdo->prepare($sql);
  $stmt->execute(array(
    ':p_code' => $param['p_code'],
  ));
  $summary = $stmt->fetch();
  if ($summary === false) {
    return false;
  }

  $sql = "
SELECT i.account_code
  , a.name
  , sum(round(if(i.vat_type='EXCLUDE', i.amount, i.amount*100/(100+r.vat_rate)),2)) sum_amount
  , sum(round(if(i.vat_type='EXCLUDE', i.amount*r.vat_rate/100.0, i.amount*r.vat_rate/(100+r.vat_rate)),2)) sum_vat
FROM receipt r
  JOIN receipt_item i
    on r.code=i.receipt_code
  JOIN account a
    on i.account_code=a.code
WHERE r.period_code=:p_code
  AND r.status='PAID'
GROUP BY a.code
ORDER BY a.code";
  $stmt = $pdo->prepare($sql);
  $stmt->execute(array(
    ':p_code' => $param['p_code'],
  ));
  $tmp = array();
  while ($row = $stmt->fetch()) {
    $tmp[] = array(
      'acc_code' => $row['account_code'],
      'acc_name' => $row['name'],
      'dr_amount' => '',
      'cr_amount' => number_format($row['sum_amount'], 2),
    );
  }
  $items = array();

  $items[] = array(
    'acc_code' => $bank_account[substr($_SESSION['station']['code'],2,2)]['code'],
    'acc_name' => $bank_account[substr($_SESSION['station']['code'],2,2)]['name'],
    'dr_amount' => number_format($summary['grand_total'], 2),
    'cr_amount' => '',
  );

  foreach ($tmp as $item) {
    $items[] = $item;
  }
  $items[] = array(
    'acc_code' => '211001',
    'acc_name' => 'ภาษีขาย',
    'dr_amount' => '',
    'cr_amount' => number_format($summary['vat_total'], 2),
  );
  $code = 'RV' . substr(str_replace('-', '', $param['p_date']), 2, 6)
    . $_SESSION['station']['code'] . ($param['p_type']=='AM' ? 'M' : ($param['p_type']=='PM' ? 'N' : 'D'));
  return array(
    'code' => $code,
    'code_from' => $summary['code_from'],
    'code_to' => $summary['code_to'],
    'p_date' => thDate($param['p_date']),
    'p_type' => $param['p_type'],
    'dr_total' => number_format($summary['grand_total'], 2),
    'cr_total' => number_format($summary['grand_total'], 2),
    'baht_text' => bahttext($summary['grand_total']+0),
    'items' => $items,
  );
}

function _doReceiptList($param) {
  global $pdo;

  $stmt = $pdo->prepare("
SELECT i.*
FROM receipt_item i
  JOIN receipt r ON i.receipt_code=r.code
WHERE r.period_code=:p_code
ORDER BY i.receipt_code, i.line_num");
  $stmt->execute(array(
    ':p_code' => $param['p_code'],
  ));

  $detail = array();
  while ($row = $stmt->fetch()) {
    if (!isset($detail[$row['receipt_code']])) {
      $detail[$row['receipt_code']] = array();
    }
    $detail[$row['receipt_code']][] = array(
      'detail' => $row['detail'],
      'qty' => $row['qty'],
      'unit' => $row['unit'],
      'price' => number_format($row['price'], 2),
    );
  }


  if(count($detail) == 0) {
    return false;
  }
  $sql = "SELECT r.* FROM receipt r WHERE r.code IN('" . implode("','", array_keys($detail)) . "') ORDER BY code";
  $stmt = $pdo->prepare($sql);
  $stmt->execute();
  $items = array();
  $seq = 1;
  $num_cancel = 0;
  $total_amount = 0;
  $total_vat = 0;
  $total_wht = 0;
  $total_net = 0;
  $total_cash = 0;
  $total_cheque = 0;
  $total_payin = 0;
  while ($row = $stmt->fetch()) {
    $items[] = array(
      'seq' => $seq,
      'code' => $row['code'],
      'issue_date' => $row['issue_date'],
      'mem_code' => $row['mem_code'],
      'mem_name' => $row['name'],
      'amount' => number_format($row['amount'],2),
      'vat' => number_format($row['vat_amount'],2),
      'wht' => $row['wht_amount']==0 ? '' : number_format($row['wht_amount']),
      'net_amount' => number_format($row['total_amount'],2),
      'cash' => number_format($row['cash'], 2),
      'cheque' => $row['cheque']==0 ? '' : number_format($row['cheque'],2),
      'payin' => $row['payin']==0 ? '' : number_format($row['payin'],2),
      'items' => isset($detail[$row['code']]) ? $detail[$row['code']] : array(),
      'staff' => $row['issue_by'],
      'status' => ($row['status']=='PAID' ? '' : 'ยกเลิกโดย ' . $row['cancel_by'] . ' ' . $row['cancel_reason']),
    );
    if ($row['status']=='CANCELLED') {
      $num_cancel++;
    }
    if ($row['status']=='PAID') {
      $total_amount += $row['amount'];
      $total_vat += $row['vat_amount'];
      $total_wht += $row['wht_amount'];
      $total_net += $row['total_amount'];
      $total_cash += $row['cash'];
      $total_cheque += $row['cheque'];
      $total_payin += $row['payin'];
    }
    $seq++;
  }

  return array(
    'p_date' => $param['p_date'],
    'p_type' => $param['p_type'],
    'site' => $_SESSION['station']['code'],
    'num_receipt' => number_format(count($items), 0),
    'num_cancel' => number_format($num_cancel, 0),
    'total_amount' => number_format($total_amount, 2),
    'total_vat' => number_format($total_vat, 2),
    'total_wht' => $total_wht > 0 ? number_format($total_wht, 2) : '',
    'total_net' => number_format($total_net, 2),
    'total_cash' => number_format($total_cash, 2),
    'total_cheque' => $total_cheque > 0 ? number_format($total_cheque, 2) : '',
    'total_payin' => $total_payin > 0 ? number_format($total_payin, 2) : '',
    'items' => $items,
  );
}
function thDate($d) {
  list($yy, $mm, $dd) = explode('-', substr($d, 0, 10));
  return $dd . '/' . $mm . '/' . ($yy+543);
}

function _numText($s) {
  $text = array('', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า');
  $unit = array('', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน');
  $out = '';
  $j = 0;
  for ($i = strlen($s)-1; $i >= 0; $i--) {
    $num = substr($s, $i, 1)+0;
    $t = $text[$num];
    $u = $unit[$j];
    if ($num==1 && $j==1) {
      $t = '';
    } else if($num==1 && $j==0 && strlen($s) > 1) {
      $t = 'เอ็ด';
    } else if ($num==2 && $j==1) {
      $t = 'ยี่';
    } else if ($num==0) {
      $u = '';
    }
    $out =  $t . $u . $out;
    $j++;
  }
  return $out;
}

function bahttext($n) {
  $num = '' . round($n, 2);
  $tmp = explode('.', $num);
  $out = '';

  $t = $tmp[0];
  while ($t != '') {
    if (strlen($t) <= 6) {
      $out = _numText($t) . $out;
      $t = '';
      break;
    } else {
      $out = _numText(substr($t, -6)) . $out;
      $t = substr($t, 0, strlen($t)-6);
    }
    if ($t != '') {
      $out = 'ล้าน' . $out;
    }
  }
  $out .= 'บาท';
  if ($tmp[1]+0 > 0) {
    $out .= _numText(substr($tmp[1].'00', 0, 2)) . 'สตางค์';
  } else {
    $out .= 'ถ้วน';
  }
  return $out;
}

function _mail() {

}
//////////////////////////////////////////////////////////////
// Export King Power function
//////////////////////////////////////////////////////////////
function doExportKingPower($param)
{
	global $pdo;

	$date = $param['p_date'];

  // $stmt = $pdo->prepare("select substring(r.period_code,1,4) as posId1,r.code,r.period_code as pc1,ri.prod_code,r.issue_date,r.created_at,p.station_code,sum(ri.amount) as amount,
  //            Round(sum((ri.amount*7)/100),2) as vat_amount,
  //            Round(sum(ri.amount + ((ri.amount*7)/100)),2) as total_amount,
  //            case when r.period_code like '01SU%' Then '001' else '002' end as posId,
  //            case when r.period_code like '01SU%' then 'ATTAPOS001'else 'ATTAPOS002' end as period_code
  //            from receipt as r inner join receipt_item as ri on ri.receipt_code = r.code
  //            inner join period as p on r.period_code = p.code
  //            where r.issue_date = '$date' and ri.prod_code IN ('TOPUP','CF2') and
  //            (p.station_code like ('%02SU%') or p.station_code like ('%01SU%'))
  //            and r.status ='PAID'
  //            group by r.code,r.period_code,ri.prod_code,r.issue_date,r.created_at
  //            order by r.code");


  $stmt = $pdo->prepare("select * from (select substring(i.complete_by,1,4) as posId1,i.ref_code as code,i.period_code as pc1,p.p_date issue_date,i.created_at,p.station_code,(15.00 * i.total_pax) as amount,
              Round((((15.00 * i.total_pax)*7)/100),2) as vat_amount,
              Round(((15.00 * i.total_pax) + (((15.00 * i.total_pax)*7)/100)),2) as total_amount,
              case when substring(i.complete_by,1,4) in ('01SU','03SU','04SU','14SU','15SU') Then '001' else '002' end as posId,
              case when substring(i.complete_by,1,4) in ('01SU','03SU','04SU','14SU','15SU') then 'ATTAPOS001'else 'ATTAPOS002' end as period_code
              from inform as i
              inner join period as p on i.complete_by = p.code
              where i.period_code like '%SU%' and p.p_date = '$date'
              and i.status in('DONE','PAID') and i.is_domestic='NO')xx
              order by posId,code");


  $stmt->execute();
  $saleHeader = $stmt->fetchAll();

  $xSaleHeader = "[SALESHEADER]"."\r\n";
  foreach ($saleHeader as $saleHeaders)
  {
    $xSaleHeader = $xSaleHeader."0299003"."|".$saleHeaders[posId]."|".$saleHeaders[code]."|".$saleHeaders[period_code]."|"."1"."|".$saleHeaders[issue_date]."|"
                   ."1"."|".$saleHeaders[created_at]."|".$saleHeaders[created_at]."|".$saleHeaders[created_at]."|".""."|".""."|".""."|".""."|".""."|".""."|"
             .""."|".""."|".""."|"."1"."|".$saleHeaders[amount]."|".$saleHeaders[vat_amount]."|".$saleHeaders[total_amount]."|".""."|".""."|"
             .""."|".""."|".""."|".""."|".""."|".""."|".""."|".""."|"."\r\n";
  }

  // $stmt2 = $pdo->prepare("SELECT substring(r.period_code,1,4) as posId1,r.code,r.period_code as pc1,r.issue_date,r.vat_rate,ri.qty,ri.price,p.station_code,
  //            Round((ri.price + ((ri.price*r.vat_rate)/100)),2) as priceVat,ri.amount,
  //            Round(ri.qty * ((ri.price*r.vat_rate)/100),2) as vatAmount,
  //            Round(ri.amount + (ri.qty * ((ri.price*r.vat_rate)/100)),2) as Total,
  //            case when r.period_code like '01SU%' Then '001' else '002' end as posId,
  //            case when r.period_code like '01SU%' then 'ATTAPOS001'else 'ATTAPOS002' end as period_code
  //            FROM receipt_item ri inner join receipt r on ri.receipt_code = r.code inner join period as p on r.period_code = p.code
  //            where r.issue_date = '$date' and ri.prod_code IN ('TOPUP','CF2') and
  //            (p.station_code like ('%02SU%') or p.station_code like ('%01SU%')) and r.status ='PAID'
  //            order by r.code");


  $stmt2 = $pdo->prepare("select * from (SELECT substring(i.complete_by,1,4) as posId1,i.ref_code as code,i.period_code as pc1,p.p_date issue_date,7.00 vat_rate,i.total_pax qty,15.00 price,p.station_code,
              Round((15.00 + ((15.00 * 7.00)/100)),2) as priceVat,(15.00 * i.total_pax) amount,
              Round(i.total_pax * ((15.00 * 7.00)/100),2) as vatAmount,
              Round((15.00 * i.total_pax) + (i.total_pax * ((15.00 * 7.00)/100)),2) as Total,
              case when substring(i.complete_by,1,4) in ('01SU','03SU','04SU','14SU','15SU') Then '001' else '002' end as posId,
              case when substring(i.complete_by,1,4) in ('01SU','03SU','04SU','14SU','15SU') then 'ATTAPOS001'else 'ATTAPOS002' end as period_code
              FROM inform i inner join period as p on i.complete_by = p.code
              where i.period_code like '%SU%' and p.p_date = '$date' and i.status in('DONE','PAID') and i.is_domestic='NO')xx
              order by posId,code");


  $stmt2->execute();
  $saleDetail = $stmt2->fetchAll();

  $xSaleDetail = "[SALESDETAIL]"."\r\n";
  foreach ($saleDetail as $saleDetails)
  {
    $xSaleDetail = $xSaleDetail."0299003"."|".$saleDetails[posId]."|".$saleDetails[code]."|".$saleDetails[period_code]."|"
    ."1"."|".$saleDetails[issue_date]."|"."1"."|"."2902"."|"."1"."|"."ATTA"."|"."1"."|".$saleDetails[vat_rate]."|".$saleDetails[qty]."|"
    ."0037"."|".$saleDetails[price]."|".$saleDetails[priceVat]."|".$saleDetails[amount]."|".$saleDetails[vatAmount]."|".$saleDetails[Total]."|"
    .""."|".""."|".""."|".""."|"."\r\n";
  }

  $xSalePayment = "[SALESPAYMENT]"."\r\n";
  foreach ($saleHeader as $salePayments)
  {
    $xSalePayment = $xSalePayment."0299003"."|".$salePayments[posId]."|".$salePayments[code]."|".$salePayments[period_code]."|"
    ."1"."|".$salePayments[issue_date]."|"."1"."|"."THB"."|"."1.0000"."|".$salePayments[total_amount]."|".$salePayments[total_amount]."|"."\r\n";
  }



  // $stmt3 = $pdo->prepare("select case when sumpayment.posId like '%01SU%' then '001' else '002' end as posId,
  //            case when sumpayment.posId like '%01SU%' then 'ATTAPOS001' else 'ATTAPOS002' end as period_code,
  //            sumpayment.period_code as pc1,sumpayment.prod_code,sumpayment.issue_date,
  //            sum(sumpayment.amount) as amount,sum(sumpayment.vat_amount) as vat_amount,sum(sumpayment.total_amount) as total_amount FROM
  //            (select substring(r.period_code,1,4) as posId,substring(r.period_code,1,10) as period_code,ri.prod_code,r.issue_date,p.station_code,
  //            sum(ri.amount) as amount,
  //            Round(sum((ri.amount*7)/100),2) as vat_amount,
  //            Round(sum(ri.amount + ((ri.amount*7)/100)),2) as total_amount
  //            from receipt as r inner join receipt_item as ri on ri.receipt_code = r.code inner join period as p on r.period_code = p.code
  //            where r.issue_date = '$date' and ri.prod_code IN ('TOPUP','CF2') and (p.station_code like ('%02SU%') or p.station_code like ('%01SU%')) and r.status ='PAID'
  //            group by r.period_code,ri.prod_code,r.issue_date
  //            order by r.period_code) as sumpayment
  //            Group by sumpayment.posId,sumpayment.period_code,sumpayment.issue_date
  //            order by sumpayment.posId");


  $stmt3 = $pdo->prepare("select posId,period_code,sumpayment.period_code as pc1,sumpayment.issue_date,
              sum(sumpayment.amount) as amount,sum(sumpayment.vat_amount) as vat_amount,sum(sumpayment.total_amount) as total_amount FROM
              (select case when substring(i.complete_by,1,4) in ('01SU','03SU','04SU','14SU','15SU') Then '001' else '002' end as posId
              ,case when substring(i.complete_by,1,4) in ('01SU','03SU','04SU','14SU','15SU') then 'ATTAPOS001'else 'ATTAPOS002' end as period_code,p.p_date issue_date,p.station_code,
              (15.00 * i.total_pax) as amount,
              Round((((15.00 * i.total_pax)*7)/100),2) as vat_amount,
              Round(((15.00 * i.total_pax) + (((15.00 * i.total_pax)*7)/100)),2) as total_amount
              from inform as i inner join period as p on i.complete_by = p.code
              where i.period_code like '%SU%' and p.p_date = '$date' and i.status in('DONE','PAID') and i.is_domestic='NO'
              order by i.period_code) as sumpayment
              Group by sumpayment.posId,sumpayment.period_code,sumpayment.issue_date
              order by sumpayment.posId");

  $stmt3->execute();
  $sumPayment = $stmt3->fetchAll();

  $xSumPayment = "[SUMPAYMENT]"."\r\n";
  foreach ($sumPayment as $sumPayments)
  {
  $xSumPayment = $xSumPayment."0299003"."|".$sumPayments[posId]."|".$sumPayments[issue_date]."|"."1"."|"."THB"."|"."1.0000"."|".$sumPayments[total_amount].
  "|".$sumPayments[total_amount]."|"."\r\n";
  }

  $xSumSales = "[SUMSALES]"."\r\n";
  foreach ($sumPayment as $sumSales)
  {
    $xSumSales = $xSumSales."0299003"."|".$sumSales[posId]."|".$sumSales[issue_date]."|".$sumSales[total_amount]."|".$sumSales[total_amount]."|".
    $sumSales[total_amount]."|".$sumSales[total_amount]."|".$sumSales[total_amount]."\r\n";
  }


  $all = $xSaleHeader .$xSaleDetail .$xSalePayment .$xSumPayment .$xSumSales;

   responseJson(array(
    'status' => true,
    'textFiles' => $all,
  ));
}

function doCountInformPax($param)
{

  global $pdo;

  $date = $param['p_date'];

//   $stmt = $pdo->prepare("select sum(total_pax) total_pax from inform
// 							where airport='BKK' and issue_date = '$date'
// 							and status in('DONE','PAID') and is_domestic='NO'");

  $stmt = $pdo->prepare("select sum(i.total_pax) total_pax from inform i inner join period p ON i.complete_by = p.`code`
                         where i.airport='BKK' and p.p_date = '$date'
                         and i.status in('DONE','PAID') and i.is_domestic='NO'");

  $stmt->execute();
  $inFormPax = $stmt->fetch();

  $countInFormPax = json_decode($inFormPax['total_pax'], true);

  responseJson(array(
   'status' => true,
   'total_pax' => $countInFormPax,
 ));

};
 ////////////////////////////////////////////////////////////////////////////////////////////////////
 // Insert Text Inform
 ////////////////////////////////////////////////////////////////////////////////////////////////////

 function doInsertInform($param)
 {
	global $pdo;

	$memCode = $param['memCode'];
	$flightCode = $param['flightCode'];


      $stmt = $pdo->prepare("select inf.code,inf.mem_code,inf.flight,inf.ref_code,inf.group_name,inf.hotel,inf.nation,mb.name_th,mb.name_en,inf.is_domestic,
							inf.uuid,inf.total_pax,inf.bus_list
						   from inform as inf inner join member as mb ON inf.mem_code = mb.code
						   where inf.mem_code = :memCode and inf.flight = :flightCode and issue_date >= (select DATE_FORMAT(NOW(),'%Y-%m-%d')) and inf.status <> 'CANCEL'");
      $stmt->execute(array(
        ':memCode' => $memCode,
        ':flightCode' => $flightCode,
      ));

	  $stmt2 = $pdo->prepare("select inf.hotel as name,inf.nation as code
						   from inform as inf inner join member as mb ON inf.mem_code = mb.code
						   where inf.mem_code = :memCode and inf.flight = :flightCode and issue_date >= (select DATE_FORMAT(NOW(),'%Y-%m-%d')) and inf.status <> 'CANCEL'");
      $stmt2->execute(array(
        ':memCode' => $memCode,
        ':flightCode' => $flightCode,
      ));

    $inFormText = $stmt->fetch();
	  $inFormHotalNation = $stmt2->fetch();

	  $inFormText['bus_list'] = json_decode($inFormText['bus_list'], true);

      if ($inFormText == false || $inFormHotalNation == false) {
        $pdo->rollback();
        responseJson(array(
          'status' => false,
          'reason' => "",//"เลขใบแจ้งอ้างอิงมีการใช้งานแล้ว\nใบแจ้งเลขที่ " . $inFormText['code'],
        ));
      }
	  else{
			responseJson(array(
			'status' => true,
			'inFormText' => $inFormText,
			'inFormHotalNation' => $inFormHotalNation,
			));

		}

 }

 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 ////stock function
 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 function dostockSave($param){
   global $pdo;
   try {
   $pdo->beginTransaction();
    $data = array(
      'prodCode' => $param['prodCode'],
      'prodName' => $param['prodName'],
      'accCode' => $param['accCode'],
      'prodPrice' => $param['prodPrice'],
      'vatType' => (!isset($param['vatType'])||$param['vatType']==null||$param['vatType']==undefined) ? 'EXCLUDE' : $param['vatType'],
      'prodUnit' => $param['prodUnit'],
      'airPort' => $param['airPort'],
      'isStock' => (!isset($param['isStock'])||$param['isStock']==null||$param['isStock']==undefined) ? 'NO' : $param['isStock'],
      'prodStockItem' => $param['prodStockItem'],
      'prodSellItem' => $param['prodSellItem'],
      'stock' => array(),
      );
    $reverseStock = array_reverse($param['stock']);
  foreach ($reverseStock as $stocks) {
    $start = (string)$stocks['start_item'];
    $startItem = '';
    $numStart = strlen($start);
          if ($numStart == 1)
          {
            $startItem = '0000'.$start;
          }else if ($numStart == 2)
          {
            $startItem = '000'.$start;
          }else if ($numStart == 3)
          {
            $startItem = '00'.$start;
          }else if ($numStart == 4)
          {
            $startItem = '0'.$start;
          }else if ($numStart == 5){
            $startItem = $start;
          }
    $next = (string)$stocks['next_item'];
    $nextItem = '';
    $numNext = strlen($next);
          if ($numNext == 1)
          {
            $nextItem = '0000'.$next;
          }else if ($numNext == 2)
          {
            $nextItem = '000'.$next;
          }else if ($numNext == 3)
          {
            $nextItem = '00'.$next;
          }else if ($numNext == 4)
          {
            $nextItem = '0'.$next;
          }else if ($numNext == 5){
            $nextItem = $next;
          }

      $data['stock'][] = array(
        ':prefix' => $stocks['prefix'],
        ':book_num' => $stocks['book_num'],
        ':book_qty' => $stocks['book_qty'],
        ':start_item' => $startItem,
        ':start_qty' => $stocks['start_qty'],
        ':avail_qty' => $stocks['avail_qty'],
        ':next_item' => $nextItem,
        ':theProdCode' => $param['prodCode'],
        ':airPorts' => $param['airPort'],
      );
    }
    $product = _getProductByCode($data[prodCode]);
    if($product===false){
      $N = _createStocksCreateProduct($data);
    }else{
      $N = _createStocksUpdateProduct($data);
    }

    //$stockPost = _createStocks($data);

    $pdo->commit();
  }catch (Exception $e) {
    $pdo->rollback();
    responseJson(array(
      'status' => false,
      'reason' => 'ERR_UNKNOWN',
      'error' => $e->errorInfo,
    ));
  }
  responseJson(array(
    'status' => true,
    'Stocks_post' => $N,
    'proddd' => $product,
  ));
  //print_r($data['stock']);
 }

function _getProductByCode($param){
  global $pdo;

  $stmt = $pdo->prepare("SELECT * FROM product WHERE code=:code");
  $stmt->execute(array(
    ':code' => $param,
  ));

  return $stmt->fetch();
}

function _createStocksCreateProduct($param){
  global $pdo;
  $stmt = $pdo->prepare("INSERT INTO product SET code=:prodCode, name=:name, price=:price, real_price=:real_price, "
    . "vat_type=:vat_type, account_code=:account_code, unit=:unit, is_stock=:isStock, is_active='YES', "
    . "stock_item=:prodStockItem, sell_item=:prodSellItem, site_list=:airPort, uuid=upper(uuid()), created_by=0, updated_by=0");
  $stmt->execute(array(
    ':prodCode' => $param['prodCode'],
    ':name' => $param['prodName'],
    ':price' => $param['prodPrice'],
    ':real_price' => $param['prodPrice'],
    ':vat_type' => $param['vatType'],
    ':account_code' => $param['accCode'],
    ':unit' => $param['prodUnit'],
    ':isStock' => $param['isStock'],
    ':prodStockItem' => $param['prodStockItem'],
    ':prodSellItem' => $param['prodSellItem'],
    ':airPort' => $param['airPort'],
    ));
  //$updated = $stmt->rowCount() . " records UPDATED successfully";

  $stack = $param['stock'];
  $stmt = $pdo->prepare("INSERT INTO lot_in SET prod_code=:theProdCode, "
    . "issue_date=NOW(), in_qty=:avail_qty, start_item=:start_item, "
    . "aval_qty=:avail_qty, next_item=:next_item, prefix_code=:prefix, book_no=:book_num, book_qty=:book_qty, "
    . "created_at=NOW(), created_by=0, updated_at=NOW(), updated_by=0, uuid=upper(uuid()), airport=:airPorts");
  foreach ($stack as $stacks) {
    $stmt->execute($stacks);
  }
  $resultScript = "Insert Complete. ";
  return $resultScript;
}

function _createStocksUpdateProduct($param){
  global $pdo;
  $stmt = $pdo->prepare("UPDATE product set is_stock=:isStock,stock_item=:prodStockItem,sell_item=:prodSellItem, "
  . "vat_type=:vat_type, account_code=:account_code, unit=:unit, name=:name, price=:price, "
  . "site_list=:airPort"
  . " WHERE code=:prodCode");
  $stmt->execute(array(
    ':prodCode' => $param['prodCode'],
    ':name' => $param['prodName'],
    ':price' => $param['prodPrice'],
    ':unit' => $param['prodUnit'],
    ':airPort' => $param['airPort'],
    ':isStock' => $param['isStock'],
    ':account_code' => $param['accCode'],
    ':prodStockItem' => $param['prodStockItem'],
    ':prodSellItem' => $param['prodSellItem'],
    ':vat_type' => $param['vatType'],
    ));
  $updated = $stmt->rowCount() . " records UPDATED successfully";

  $stack = $param['stock'];
  $stmt = $pdo->prepare("INSERT INTO lot_in SET prod_code=:theProdCode, "
    . "issue_date=NOW(), in_qty=:avail_qty, start_item=:start_item, "
    . "aval_qty=:avail_qty, next_item=:next_item, prefix_code=:prefix, book_no=:book_num, book_qty=:book_qty, "
    . "created_at=NOW(), created_by=0, updated_at=NOW(), updated_by=0, uuid=upper(uuid()), airport=:airPorts");
  foreach ($stack as $stacks) {
    $stmt->execute($stacks);
  }
  $resultScript = "Insert Complete. ".$updated;
  return $resultScript;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////  function Stock Out
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function _scockOut($stockList,$memberCodes,$receipt_code){
  // $itemList = $param['items'];
  // $arrayQty = count($itemList)-1;
  $lot_out_id_insert = array();
  foreach ($stockList as $item) {

    $prodCode = $item['prod_code'];
    $sellQty = _getSellQtyFromProduct($prodCode);
    $qty = ($item['qty'] * $sellQty['sell_item']);
    $memberCode = $memberCodes;
    $receiptCode = $receipt_code;

    $lotInIds = _findLastLotInIdFromLotOut($prodCode);
    if($lotInIds === false||$lotInIds == ''||$lotInIds == undefined||$lotInIds == null){
      $lotInId = 1;
    }else if ($lotInIds['lot_in_id'] == null||$lotInIds['lot_in_id']===false||$lotInIds['lot_in_id']==''||
              $lotInIds['lot_in_id']==undefined){
      $lotInId = 1;
    }else{
      $lotInId = $lotInIds['lot_in_id'];
    }

    $lotOutQtys = _findAllLotOutQtyFromLotOut($lotInId,$prodCode);
    if ($lotOutQtys===false||$lotOutQtys==''||$lotOutQtys==undefined||$lotOutQtys==null) {
      $lotOutQty = 0;
    } else if($lotOutQtys['alloutqty']===false||$lotOutQtys['alloutqty']==''||$lotOutQtys['alloutqty']==undefined||
      $lotOutQtys['alloutqty']==null){
      $lotOutQty = 0;
    }else{
      $lotOutQty = $lotOutQtys['alloutqty'];
    }


    $lotInQtys = _findAllLotinQtyFromLotin($lotInId,$prodCode);
    if($lotInQtys === false||$lotInQtys==''||$lotInQtys==undefined||$lotInQtys==null){
      $lotInQty = 0;
    }else if ($lotInQtys['lotinqty']===false||$lotInQtys['lotinqty']==''||$lotInQtys['lotinqty']==undefined||$lotInQtys['lotinqty']==null){
      $lotInQty = 0;
    }else{
      $lotInQty = $lotInQtys['lotinqty'];
    }

    if(($qty+$lotOutQty) > $lotInQty){
        throw new Exception('ERR_OUT_OF_STOCK');
    }
    else{
       $controlLoop = true;
       $seq_no = 1;
       while ( $controlLoop == true) {
        $lotInQtyByIds = _findLotinQtyById($lotInId,$prodCode);
        if($lotInQtyByIds === false||$lotInQtyByIds==''||$lotInQtyByIds==undefined||$lotInQtyByIds==null){
          $lotInQtyById = 0;
        }else if ($lotInQtyByIds['in_qty']===false||$lotInQtyByIds['in_qty']==''||$lotInQtyByIds['in_qty']==undefined||
          $lotInQtyByIds['in_qty']==null){
          $lotInQtyById = 0;
        }else if ($lotInQtyByIds['start_item']===false||$lotInQtyByIds['start_item']==''||$lotInQtyByIds['start_item']==undefined||
          $lotInQtyByIds['start_item']==null) {
          $lotInQtyById = 0;
        }else{
          $lotInQtyById = $lotInQtyByIds['in_qty'];
          $lotInStartItem = $lotInQtyByIds['start_item'];
        }

        $lotOutQtyByIds = _findLotoutQtyById($lotInId,$prodCode);
        if($lotOutQtyByIds === false||$lotOutQtyByIds==''||$lotOutQtyByIds==undefined||$lotOutQtyByIds==null){
          $lotOutQtyById = 0;
        }else if ($lotOutQtyByIds['lotoutqty']===false||$lotOutQtyByIds['lotoutqty']==''||
          $lotOutQtyByIds['lotoutqty']==undefined||$lotOutQtyByIds['lotoutqty']==null) {
          $lotOutQtyById = 0;
        }else{
          $lotOutQtyById = $lotOutQtyByIds['lotoutqty'];
        }

        $lastStartItems = _getLastItemFromLotOutByLotinId($lotInId,$prodCode);
        if($lastStartItems === false||$lastStartItems==''||$lastStartItems==undefined||$lastStartItems==null){
          $lastStartItem = 0;
        }else if ($lastStartItems['lastitem']===false||$lastStartItems['lastitem']==''||
          $lastStartItems['lastitem']==undefined||$lastStartItems['lastitem']==null){
          $lastStartItem = 0;
        }else{
          $lastStartItem = $lastStartItems['lastitem'];
        }

         $qtyCheck = $lotInQtyById - $lotOutQtyById;
         //$controlLoop = false;
        if($qtyCheck>=$qty){
          global $pdo;
          $stmt = $pdo->prepare("INSERT INTO lot_out set receipt_code=:receipiCode,prod_code=:prodCode,lot_inid=:lotinid, "
            . "issue_date=NOW(), out_qty=:qty, start_item=:startItem, aval_qty=:startItem, member_id=:memCode, uuid=upper(uuid()), "
            . "created_at=NOW(), created_by=0, updated_at=NOW(), updated_by=0, seq_no='$seq_no'");
          if ($lastStartItem != 0){
            $stmt->execute(array(
              ':prodCode' => $prodCode,
              ':lotinid' => $lotInId,
              ':qty' => $qty,
              ':startItem' => $lastStartItem,
              ':receipiCode' => $receiptCode,
              ':memCode' => $memberCode,
              ));
            array_push($lot_out_id_insert,$pdo->lastInsertId());
            $nextItemForLotIn=$lastStartItem+$qty;
          }else{
            $stmt->execute(array(
              ':prodCode' => $prodCode,
              ':lotinid' => $lotInId,
              ':qty' => $qty,
              ':startItem' => $lotInStartItem,
              ':receipiCode' => $receiptCode,
              ':memCode' => $memberCode,
              ));
            array_push($lot_out_id_insert,$pdo->lastInsertId());
            $nextItemForLotIn=$lotInStartItem+$qty;
          }
          $stmts = $pdo->prepare("UPDATE lot_in SET next_item=:next_item_lotin, aval_qty=aval_qty-$qty WHERE id=:lot_in_id");
          $stmts->execute(array(
            ':next_item_lotin' => $nextItemForLotIn,
            ':lot_in_id' => $lotInId,
            ));
          $controlLoop = false;

        }else if($qtyCheck <= 0){
           $qty = $qty - $qtyCheck;
           $lotInId = $lotInId + 1;
           $controlLoop = true;
           $seq_no++;
        }else{
          global $pdo;
          $qty = $qty - $qtyCheck;
          $stmt = $pdo->prepare("INSERT INTO lot_out set receipt_code=:receipiCode,prod_code=:prodCode,lot_inid=:lotinid, "
            . "issue_date=NOW(), out_qty=:qty, start_item=:startItem, aval_qty=:startItem, member_id=:memCode, uuid=upper(uuid()), "
            . "created_at=NOW(), created_by=0, updated_at=NOW(), updated_by=0, seq_no='$seq_no'");
          if ($lastStartItem != 0){
            $stmt->execute(array(
              ':prodCode' => $prodCode,
              ':lotinid' => $lotInId,
              ':qty' => $qtyCheck,
              ':startItem' => $lastStartItem,
              ':receipiCode' => $receiptCode,
              ':memCode' => $memberCode,
              ));
            array_push($lot_out_id_insert,$pdo->lastInsertId());
            $nextItemForLotIn=$lastStartItem+$qtyCheck;
          }else{
            $stmt->execute(array(
              ':prodCode' => $prodCode,
              ':lotinid' => $lotInId,
              ':qty' => $qtyCheck,
              ':startItem' => $lotInStartItem,
              ':receipiCode' => $receiptCode,
              ':memCode' => $memberCode,
              ));
            array_push($lot_out_id_insert,$pdo->lastInsertId());
            $nextItemForLotIn=$lotInStartItem+$qtyCheck;
          }
          $stmts = $pdo->prepare("UPDATE lot_in SET next_item=:next_item_lotin, aval_qty=0 WHERE id=:lot_in_id");
          $stmts->execute(array(
            ':next_item_lotin' => $nextItemForLotIn,
            ':lot_in_id' => $lotInId,
            ));

          $lotInId = $lotInId + 1;
          $controlLoop = true;
          $seq_no++;
        }
      }
    }


  }
  $FHM = "ProductCode=".$prodCode." QTY=".$qty." LOTINID=".$lotInId." LOTINQTY=".$lotInQty;
  //return $qtyCheck."-".$qty;
  return count($lot_out_id_insert);
}

function _getSellQtyFromProduct($prodCode){
  global $pdo;

  $stmt = $pdo->prepare("select sell_item from product where code=:code");
  $stmt->execute(array(
    ':code' => $prodCode,
  ));

  return $stmt->fetch();
}

function _findLastLotInIdFromLotOut($prodCode){
  global $pdo;

  $stmt = $pdo->prepare("select max(lot_inid) as lot_in_id from lot_out where prod_code=:code and status='PAID' and is_cancel='NO'");
  $stmt->execute(array(
    ':code' => $prodCode,
  ));

  return $stmt->fetch();
}

function _findAllLotOutQtyFromLotOut($lotInId,$prodCode){
  global $pdo;

  $stmt = $pdo->prepare("select sum(out_qty) as alloutqty from lot_out where prod_code=:prodCode and lot_inid=:lotInId and is_cancel='NO'");
  $stmt->execute(array(
    ':prodCode' => $prodCode,
    ':lotInId' => $lotInId,
  ));

  return $stmt->fetch();
}

function _findAllLotinQtyFromLotin($lotInId,$prodCode){
  global $pdo;

  $stmt = $pdo->prepare("select sum(in_qty) as lotinqty from lot_in where prod_code=:prodCode and id>=:lotInId");
  $stmt->execute(array(
    ':prodCode' => $prodCode,
    ':lotInId' => $lotInId,
  ));

  return $stmt->fetch();
}

function _findLotinQtyById($lotInId,$prodCode){
  global $pdo;

  $stmt = $pdo->prepare("select in_qty,start_item from lot_in where prod_code=:prodCode and id=:lotInId");
  $stmt->execute(array(
    ':prodCode' => $prodCode,
    ':lotInId' => $lotInId,
  ));

  return $stmt->fetch();
}

function _findLotoutQtyById($lotInId,$prodCode){
  global $pdo;

  $stmt = $pdo->prepare("select sum(out_qty) as lotoutqty from lot_out where prod_code=:prodCode and lot_inid=:lotInId and is_cancel='NO'");
  $stmt->execute(array(
    ':prodCode' => $prodCode,
    ':lotInId' => $lotInId,
  ));

  return $stmt->fetch();
}

function _getLastItemFromLotOutByLotinId($lotInId,$prodCode){
  global $pdo;

  $stmt = $pdo->prepare("select (out_qty+start_item) as lastitem from lot_out where prod_code=:prodCode and lot_inid=:lotInId and is_cancel='NO'
    order by updated_at DESC LIMIT 1");
  $stmt->execute(array(
    ':prodCode' => $prodCode,
    ':lotInId' => $lotInId,
  ));

  return $stmt->fetch();
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////     function stock out cancel
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function _scockCancelOut($scock_cancel_out,$memberCode,$receipt_code){
  $lot_out_id_insert = array();
  foreach ($scock_cancel_out as $item) {

    $prodCode = $item['prod_code'];
    $sellQty = _getSellQtyFromProduct($prodCode);
    $qty = ($item['qty'] * $sellQty['sell_item']);
    $memberCode = $memberCodes;
    $receiptCode = $receipt_code;

    $lotInIds = _findLastLotcancelIdFromLotOut($prodCode);//
    if($lotInIds === false
    ||$lotInIds == ''
    ||$lotInIds == undefined
    ||$lotInIds == null){
      $lotInId = 1;
    }else if ($lotInIds['lot_in_id'] == null
    ||$lotInIds['lot_in_id']===false
    ||$lotInIds['lot_in_id']==''
    ||$lotInIds['lot_in_id']==undefined){
      $lotInId = 1;
    }else{
      $lotInId = $lotInIds['lot_in_id'];
    }

    $lotOutQtys = _findAllLotOutQtyFromLotOutCancel($lotInId,$prodCode);
    if ($lotOutQtys===false
    ||$lotOutQtys==''
    ||$lotOutQtys==undefined
    ||$lotOutQtys==null) {
      $lotOutQty = 0;
    } else if($lotOutQtys['alloutqty']===false
    ||$lotOutQtys['alloutqty']==''
    ||$lotOutQtys['alloutqty']==undefined
    ||$lotOutQtys['alloutqty']==null){
      $lotOutQty = 0;
    }else{
      $lotOutQty = $lotOutQtys['alloutqty'];
    }


    $lotCancelQtys = _findAllLotinQtyFromLotcancel($lotInId,$prodCode);
    if($lotCancelQtys === false
    ||$lotCancelQtys==''
    ||$lotCancelQtys==undefined
    ||$lotCancelQtys==null){
      $lotCancelQty = 0;
    }else if ($lotCancelQtys['lotinqty']===false
    ||$lotCancelQtys['lotinqty']==''
    ||$lotCancelQtys['lotinqty']==undefined
    ||$lotCancelQtys['lotinqty']==null){
      $lotCancelQty = 0;
    }else{
      $lotCancelQty = $lotCancelQtys['lotinqty'];
    }

    if(($qty+$lotOutQty) > $lotCancelQty){
      //echo $qty." ".$lotOutQty." ".$lotCancelQty." ".$lotInId;
        throw new Exception('ERR_OUT_OF_STOCK');
    }
    else{
      // echo $qty;
      // echo $lotInId;
       $controlLoop = true;
       $seq_no = 1;
       while ( $controlLoop == true) {
        $lotCancelQtyByIds = _findLotCancelQtyById($lotInId,$prodCode);
        if($lotCancelQtyByIds === false
        ||$lotCancelQtyByIds==''
        ||$lotCancelQtyByIds==undefined
        ||$lotCancelQtyByIds==null){
          $lotCancelQtyById = 0;
        }else if ($lotCancelQtyByIds['in_qty']===false
        ||$lotCancelQtyByIds['in_qty']==''
        ||$lotCancelQtyByIds['in_qty']==undefined
        ||$lotCancelQtyByIds['in_qty']==null){
          $lotCancelQtyById = 0;
        }else if ($lotCancelQtyByIds['start_item']===false
        ||$lotCancelQtyByIds['start_item']==''
        ||$lotCancelQtyByIds['start_item']==undefined
        ||$lotCancelQtyByIds['start_item']==null) {
          $lotCancelQtyById = 0;
        }else{
          $lotCancelQtyById = $lotCancelQtyByIds['in_qty'];
          $lotCancelStartItem = $lotCancelQtyByIds['start_item'];
        }

        $lotOutCancelQtyByIds = _findLotoutCancelQtyById($lotInId,$prodCode);
        if($lotOutCancelQtyByIds === false
          ||$lotOutCancelQtyByIds==''
          ||$lotOutQtyByIds==undefined
          ||$lotOutCancelQtyByIds==null){
          $lotOutCancelQtyById = 0;
        }else if ($lotOutCancelQtyByIds['lotoutqty1']===false
          ||$lotOutCancelQtyByIds['lotoutqty1']==''
          ||$lotOutCancelQtyByIds['lotoutqty1']==undefined
          ||$lotOutCancelQtyByIds['lotoutqty1']==null) {
          $lotOutCancelQtyById = 0;
        }else{
          $lotOutCancelQtyById = $lotOutCancelQtyByIds['lotoutqty1'];
        }

        $lastStartItems = _getLastItemFromLotOutCancelByLotinId($lotInId,$prodCode);
        if($lastStartItems === false||$lastStartItems==''||$lastStartItems==undefined||$lastStartItems==null){
          $lastStartItem = 0;
        }else if ($lastStartItems['lastitem1']===false||$lastStartItems['lastitem1']==''||
          $lastStartItems['lastitem1']==undefined||$lastStartItems['lastitem1']==null){
          $lastStartItem = 0;
        }else{
          $lastStartItem = $lastStartItems['lastitem1'];
        }

         $qtyCheck = $lotCancelQtyById - $lotOutCancelQtyById;
         //$controlLoop = false;
        if($qtyCheck>=$qty){
          global $pdo;
          $stmt = $pdo->prepare("INSERT INTO lot_out set receipt_code=:receipiCode,prod_code=:prodCode,lot_inid=:lotinid, "
            . "issue_date=NOW(), out_qty=:qty, start_item=:startItem, aval_qty=:startItem, member_id=:memCode, uuid=upper(uuid()), "
            . "created_at=NOW(), created_by=0, updated_at=NOW(), updated_by=0, seq_no='$seq_no', is_cancel='YES'");
          if ($lastStartItem != 0){
            $stmt->execute(array(
              ':prodCode' => $prodCode,
              ':lotinid' => $lotInId,
              ':qty' => $qty,
              ':startItem' => $lastStartItem,
              ':receipiCode' => $receiptCode,
              ':memCode' => $memberCode,
              ));
            array_push($lot_out_id_insert,$pdo->lastInsertId());
            $nextItemForLotIn=$lastStartItem+$qty;
          }else{
            $stmt->execute(array(
              ':prodCode' => $prodCode,
              ':lotinid' => $lotInId,
              ':qty' => $qty,
              ':startItem' => $lotCancelStartItem,
              ':receipiCode' => $receiptCode,
              ':memCode' => $memberCode,
              ));
            array_push($lot_out_id_insert,$pdo->lastInsertId());
            $nextItemForLotIn=$lotCancelStartItem+$qty;
          }
          $stmts = $pdo->prepare("UPDATE lot_cancel SET next_item=:next_item_lotin, aval_qty=aval_qty-$qty WHERE real_id=:lot_in_id and prod_code='$prodCode'");
          $stmts->execute(array(
            ':next_item_lotin' => $nextItemForLotIn,
            ':lot_in_id' => $lotInId,
            ));
          $controlLoop = false;

        }else if($qtyCheck <= 0){
           $qty = $qty - $qtyCheck;
           $lotInId = $lotInId + 1;
           $controlLoop = true;
           $seq_no++;
        }else{
          global $pdo;
          $qty = $qty - $qtyCheck;
          $stmt = $pdo->prepare("INSERT INTO lot_out set receipt_code=:receipiCode,prod_code=:prodCode,lot_inid=:lotinid, "
            . "issue_date=NOW(), out_qty=:qty, start_item=:startItem, aval_qty=:startItem, member_id=:memCode, uuid=upper(uuid()), "
            . "created_at=NOW(), created_by=0, updated_at=NOW(), updated_by=0, seq_no='$seq_no', is_cancel='YES'");
          if ($lastStartItem != 0){
            $stmt->execute(array(
              ':prodCode' => $prodCode,
              ':lotinid' => $lotInId,
              ':qty' => $qtyCheck,
              ':startItem' => $lastStartItem,
              ':receipiCode' => $receiptCode,
              ':memCode' => $memberCode,
              ));
            array_push($lot_out_id_insert,$pdo->lastInsertId());
            $nextItemForLotIn=$lastStartItem+$qtyCheck;
          }else{
            $stmt->execute(array(
              ':prodCode' => $prodCode,
              ':lotinid' => $lotInId,
              ':qty' => $qtyCheck,
              ':startItem' => $lotCancelStartItem,
              ':receipiCode' => $receiptCode,
              ':memCode' => $memberCode,
              ));
            array_push($lot_out_id_insert,$pdo->lastInsertId());
            $nextItemForLotIn=$lotCancelStartItem+$qtyCheck;
          }
          $stmts = $pdo->prepare("UPDATE lot_cancel SET next_item=:next_item_lotin, aval_qty=0 WHERE real_id=:lot_in_id and prod_code='$prodCode'");
          $stmts->execute(array(
            ':next_item_lotin' => $nextItemForLotIn,
            ':lot_in_id' => $lotInId,
            ));

          $lotInId = $lotInId + 1;
          $controlLoop = true;
          $seq_no++;
        }
      }
    }


  }
  //$FHM = "ProductCode=".$prodCode." QTY=".$qty." LOTINID=".$lotInId." LOTINQTY=".$lotInQty;
  //return $qtyCheck."-".$qty;
  return count($lot_out_id_insert);
}

function _findLastLotcancelIdFromLotOut($prodCode){
  global $pdo;

  $stmt = $pdo->prepare("select max(lot_inid) as lot_in_id from lot_out where prod_code=:code and status='PAID' and is_cancel='YES'");
  $stmt->execute(array(
    ':code' => $prodCode,
  ));

  return $stmt->fetch();
}
function _findAllLotOutQtyFromLotOutCancel($lotInId,$prodCode){
  global $pdo;

  $stmt = $pdo->prepare("select sum(out_qty) as alloutqty from lot_out where prod_code=:prodCode and lot_inid=:lotInId and is_cancel='YES'");
  $stmt->execute(array(
    ':prodCode' => $prodCode,
    ':lotInId' => $lotInId,
  ));

  return $stmt->fetch();
}
function _findAllLotinQtyFromLotcancel($lotInId,$prodCode){
  global $pdo;

  $stmt = $pdo->prepare("select sum(in_qty) as lotinqty from lot_cancel where prod_code=:prodCode and real_id>=:lotInId");
  $stmt->execute(array(
    ':prodCode' => $prodCode,
    ':lotInId' => $lotInId,
  ));

  return $stmt->fetch();
}
function _findLotCancelQtyById($lotInId,$prodCode){
  global $pdo;

  $stmt = $pdo->prepare("select in_qty,start_item from lot_cancel where prod_code=:prodCode and real_id=:lotInId");
  $stmt->execute(array(
    ':prodCode' => $prodCode,
    ':lotInId' => $lotInId,
  ));

  return $stmt->fetch();
}
function _findLotoutCancelQtyById($lotInId,$prodCode){
  global $pdo;

  $stmt = $pdo->prepare("select sum(out_qty) as lotoutqty1 from lot_out where prod_code=:prodCode and lot_inid=:lotInId and is_cancel='YES'");
  $stmt->execute(array(
    ':prodCode' => $prodCode,
    ':lotInId' => $lotInId,
  ));

  return $stmt->fetch();
}
function _getLastItemFromLotOutCancelByLotinId($lotInId,$prodCode){
  global $pdo;

  $stmt = $pdo->prepare("select (out_qty+start_item) as lastitem1 from lot_out where prod_code=:prodCode and lot_inid=:lotInId and is_cancel='YES'
    order by updated_at DESC LIMIT 1");
  $stmt->execute(array(
    ':prodCode' => $prodCode,
    ':lotInId' => $lotInId,
  ));

  return $stmt->fetch();
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////      function Export Info
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 function doexportExcelInfo($param){
  global $pdo;

  if($param['checkInfo']=='NO'){
    $exportData = array(
      ':airportInfo' => $param['airportInfo'],
      ':date_from' => $param['date_from'],
      ':date_to' => $param['date_to'],
      ':flightInfo' => ($param['flightInfo']==null) ? '' :  $param['flightInfo'],
      //':guideNameInfo' => $param['guideNameInfo'],
      ':hotelInfoName' => ($param['hotelInfoName']==null) ? '' : $param['hotelInfoName'],
      //':licenseInfo' => $param['licenseInfo'],
      ':memberInfoCode' => ($param['memberInfoCode']==null) ? '' : $param['memberInfoCode'],
      ':nationInfoCode' => ($param['nationInfoCode']==null) ? '' : $param['nationInfoCode'],
      ':statusInfo' => $param['statusInfo'],
      );
    $sql = "select i.airport,i.issue_date,i.code informcode,i.ref_code,CONCAT(i.mem_code,':',m.name_en)as member_name,i.issue_by, "
          ."concat(c.name_en)as nation,i.flight,i.hotel,i.note,i.status,GROUP_CONCAT(b.license SEPARATOR ', ') as lc, i.total_pax, "
          ."CASE WHEN i.is_domestic='YES' THEN 'Domestic' ELSE 'International' END AS type "
          ."from inform i inner join member m ON i.mem_code=m.code inner join country c on i.nation=c.code "
          ."left join buscall b on i.code=b.inform_code "
          ."where (case when :airportInfo = 'ALL' then i.airport=i.airport else i.airport=:airportInfo end) "
          ."and (i.issue_date between :date_from and :date_to) "
          ."and (case when :memberInfoCode='' then i.mem_code=i.mem_code else i.mem_code = :memberInfoCode end) "
          ."and (case when :nationInfoCode='' then i.nation=i.nation else i.nation=:nationInfoCode end) "
          ."and (case when :flightInfo='' then i.flight=i.flight else i.flight =:flightInfo end) "
          ."and (case when :hotelInfoName='' then i.hotel=i.hotel else i.hotel =:hotelInfoName end) "
          ."and (case when '$param[guideNameInfo]' is null then i.note=i.note else i.note like '%$param[guideNameInfo]%' end) "
          ."and (case when :statusInfo = 'ALL' then i.status=i.status when :statusInfo = 'FINISH' then i.status in ('DONE','PAID') else i.status =:statusInfo end) "
          ."and (case when '$param[licenseInfo]' is null then i.bus_list=i.bus_list else i.bus_list like '%$param[licenseInfo]%' end)"
          ."group by i.code order by i.airport,i.issue_date,i.code,i.is_domestic";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($exportData);
    $infoData = $stmt->fetchAll();

    $a = "<table width='100%' border='1'>
        <thead>
            <tr>
                <th>Airport</th>
                <th>Inform Date</th>
                <th>Inform No.</th>
                <th>Ref. Inform No.</th>
                <th>Member Name</th>
                <th>Nationality</th>
                <th>Type</th>
                <th>Flight</th>
                <th>License</th>
                <th>Hotal Name</th>
                <th>Guide Name</th>
                <th>Status</th>
                <th>PAX</th>
                <th>Issue By</th>
            </tr>
        </thead>
        <tbody>";
        $b = "";
        foreach ($infoData as $infoDatas) {
            $b=$b."<tr>
                <td>".$infoDatas['airport']."</td>
                <td>".$infoDatas['issue_date']."</td>
                <td>".$infoDatas['informcode']."</td>
                <td>".$infoDatas['ref_code']."</td>
                <td>".$infoDatas['member_name']."</td>
                <td>".$infoDatas['nation']."</td>
                <td>".$infoDatas['type']."</td>
                <td>".$infoDatas['flight']."</td>
                <td>"."'".$infoDatas['lc']."'"."</td>
                <td>".$infoDatas['hotel']."</td>
                <td>".$infoDatas['note']."</td>
                <td>".$infoDatas['status']."</td>
                <td>".$infoDatas['total_pax']."</td>
                <td>".$infoDatas['issue_by']."</td>
            </tr>";
          }
        $c="</tbody>
    </table>";
  }else{
    $exportData = array(
      ':airportInfo' => $param['airportInfo'],
      ':date_from' => $param['date_from'],
      ':date_to' => $param['date_to'],
      ':memberInfoCode' => ($param['memberInfoCode']==null) ? '' : $param['memberInfoCode'],
      //':nationInfoCode' => ($param['nationInfoCode']==null) ? '' : $param['nationInfoCode'],
      );
    $sql = "select *,total_pax -receipt_pax as coupon, concat(mem_code,':',name_en) mem_name from "
          ."(select sum(i.total_pax) total_pax, IFNULL(sr.receipt_pax,0) receipt_pax, "
          ."i.mem_code,m.name_th,m.name_en,i.airport from inform i "
          ."left join ("
          ."select sum(ri.qty) receipt_pax, r.mem_code, case when (SUBSTRING(r.period_code,3,2)='DM') then 'DMK' "
          ."when (SUBSTRING(r.period_code,3,2)='SU') then 'BKK' end as airport from receipt r "
          ."inner join receipt_item ri on r.code = ri.receipt_code "
          ."where r.issue_date between :date_from and :date_to and ri.prod_code = 'TOPUP' "
          ."and r.status = 'PAID' and case when :airportInfo='ALL' then r.period_code=r.period_code when :airportInfo='DMK' then r.period_code like '%DM%' else r.period_code like '%SU%' end "
          ."group by r.mem_code, SUBSTRING(r.period_code,3,2)) sr "
          ."on i.mem_code = sr.mem_code and i.airport = sr.airport inner join member m on i.mem_code=m.code "
          ."where i.status in ('DONE','PAID') and i.is_domestic = 'NO' "
          ."and (i.issue_date between :date_from and :date_to) and "
          ."case when :airportInfo = 'ALL' then i.airport=i.airport else i.airport = :airportInfo end "
          ."and case when :memberInfoCode='' then i.mem_code = i.mem_code else i.mem_code=:memberInfoCode end "
          ."group by i.mem_code,i.airport) as alla order by airport, receipt_pax desc";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($exportData);
    $infoData = $stmt->fetchAll();

    $a = "<table width='100%' border='1'>
        <thead>
            <tr>
                <th>Airport</th>
                <th>Member Name</th>
                <th>Pax Top Up</th>".
                // <th>Change Coupon</th>
                // <th>Total Pax</th>
            "</tr>
        </thead>
        <tbody>";
        $b = "";
        foreach ($infoData as $infoDatas) {
          $coupon = '';
          if($infoDatas['coupon']<=0){
            $coupon = '0';
          }
          else{
            $coupon = $infoDatas['coupon'];
          }
            $b=$b."<tr>
                <td>".$infoDatas['airport']."</td>
                <td>".$infoDatas['mem_name']."</td>
                <td>".$infoDatas['receipt_pax']."</td>".
                // <td>".$coupon."</td>
                // <td>".$infoDatas['total_pax']."</td>
            "</tr>";
          }
        $c="</tbody>
    </table>";
  }
    $msa = $a.$b.$c;
    responseJson(array(
    'status' => true,
    'textFiles' => $msa,
    //'OP' => $exportData,
    //'O' => $infoData,
    'GN' => $param['guideNameInfo'],
    'LC' => $param['licenseInfo'],
  ));
}


function doExportExcelSportCheck($param){
  global $pdo;

      $period = '';
  if (strtoupper($param['period'])=='AM'){
      $period = '%M';
    }elseif (strtoupper($param['period'])=='PM'){
      $period = '%N';
    }elseif (strtoupper($param['period'])=='ALL'){
      $period = 'ALL';
    }elseif (strtoupper($param['period'])=='DAY'){
      $period = 'ALL';
    }
  $sql = "SELECT group_concat(DISTINCT i.code ORDER BY i.code SEPARATOR ',') code"
        .", i.mem_code, concat(m.name_th, ' - ', i.group_name) mem_name, i.is_domestic, i.flight"
        .", group_concat(DISTINCT i.ref_code ORDER BY i.ref_code SEPARATOR ',') ref_code"
        .", group_concat(b.license ORDER BY b.license separator ', ') license_list"
        .", max(i.total_pax) total_pax, max(b.done_time) last_time"
        .", i.check_status, max(i.check_pax) check_pax, max(i.check_pax_child) check_pax_child"
        .", max(i.check_pax_leader) check_pax_leader"
        .", max(i.check_pax)+max(i.check_pax_child)+max(i.check_pax_leader) as total "
        ."FROM inform i INNER JOIN buscall b ON i.code=b.inform_code "
        ."INNER JOIN member m ON i.mem_code=m.code "
        ."WHERE b.airport='$param[airport]' AND b.status='DONE' AND i.check_status = 'YES' "
        ."AND (i.issue_date between '$param[date_from]' AND '$param[date_to]') "
        ."AND (CASE WHEN '$period' = 'ALL' THEN i.period_code = i.period_code ELSE i.period_code LIKE '$period' END) "
        ."AND (CASE WHEN '$param[check_by]' = 'All_User' THEN i.check_by = i.check_by ELSE i.check_by = '$param[check_by]' END) "
        ."GROUP BY i.mem_code, i.group_name, i.flight, i.is_domestic, i.check_status "
        ."ORDER BY max(b.done_time) DESC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $sportCheck = $stmt->fetchAll();

    $a = "<table width='100%' border='1'>
        <thead>
            <tr>
                <th>Inform No.</th>
                <th>Inform Ref Code</th>
                <th>Member Name</th>
                <th>Flight</th>
                <th>License</th>
                <th>Real Total Pax</th>
                <th>Adult Pax</th>
                <th>Child Pax</th>
                <th>Leader Pax</th>
                <th>Totat Pax</th>
            </tr>
        </thead>
        <tbody>";
        $b = "";
        foreach ($sportCheck as $sportChecks) {
            $b=$b."<tr>
                <td>".$sportChecks['code']."</td>
                <td>".$sportChecks['ref_code']."</td>
                <td>".$sportChecks['mem_name']."</td>
                <td>".$sportChecks['flight']."</td>
                <td>".$sportChecks['license_list']."</td>
                <td>".$sportChecks['total_pax']."</td>
                <td>".$sportChecks['check_pax']."</td>
                <td>".$sportChecks['check_pax_child']."</td>
                <td>".$sportChecks['check_pax_leader']."</td>
                <td>".$sportChecks['total']."</td>
            </tr>";
          }
        $c="</tbody>
    </table>";

    $msa = $a.$b.$c;
    responseJson(array(
    'status' => true,
    'textFiles' => $msa,
    'SQL' => $sql,
  ));
}

function doExportExcelMemberData($param){
  global $pdo;
  if($param['province']=='north_th'){
    $province = "'เชียงราย','เชียงใหม่','น่าน','พะเยา','แพร่','แม่ฮ่องสอน','ลำปาง','ลำพูน','อุตรดิตถ์'";
  }elseif($param['province']=='northeast_th'){
    $province = "'กาฬสินธุ์','ขอนแก่น','ชัยภูมิ','นครพนม','นครราชสีมา','บึงกาฬ','บุรีรัมย์','มหาสารคาม','มุกดาหาร','ยโสธร','ร้อยเอ็ด','เลย','สกลนคร','สุรินทร์',
    'ศรีสะเกษ','หนองคาย','หนองบัวลำภู','อุดรธานี','อุบลราชธานี','อำนาจเจริญ'";
  }elseif($param['province']=='center_th'){
    $province = "'กำแพงเพชร','ชัยนาท','นครนายก','นครปฐม','นครสวรรค์','นนทบุรี','ปทุมธานี','พระนครศรีอยุธยา','พิจิตร','พิษณุโลก','เพชรบูรณ์','ลพบุรี','สมุทรปราการ',
    'สมุทรสงคราม','สมุทรสาคร','สิงห์บุรี','สุโขทัย','สุพรรณบุรี','สระบุรี','อ่างทอง','อุทัยธานี'";
  }elseif($param['province']=='east_th'){
    $province = "'จันทบุรี','ฉะเชิงเทรา','ชลบุรี','ตราด','ปราจีนบุรี','ระยอง','สระแก้ว'";
  }elseif($param['province']=='west_th'){
    $province = "'กาญจนบุรี','ตาก','ประจวบคีรีขันธ์','เพชรบุรี','ราชบุรี'";
  }elseif($param['province']=='south_th'){
    $province = "'กระบี่','ชุมพร','ตรัง','นครศรีธรรมราช','นราธิวาส','ปัตตานี','พังงา','พัทลุง','ภูเก็ต','ยะลา','ระนอง','สงขลา','สตูล','สุราษฎร์ธานี'";
  }elseif($param['province']=='north_en'){
    $province = "'Chiang Rai','Chiang Mai','Nan','Phayao','Phrae','Mae Hong Son','Lampang','Lamphun','Uttaradit'";
  }elseif($param['province']=='northeast_en'){
    $province = "'Kalasin','Khon Kaen','Chaiyaphum','Nakhon Phanom','Nakhon Ratchasima','Bueng Kan','Buri Ram','Maha Sarakham',
    'Mukdahan','Yasothon','Roi Et','Loei','Si Sa Ket','Sakon Nakhon','Surin','Nong Khai','Nong Bua Lam Phu','Amnat Charoen','Udon Thani',
    'Ubon Ratchathani'";
  }elseif($param['province']=='center_en'){
    $province = "'Kamphaeng Phet','Chai Nat','Nakhon Nayok','Nakhon Pathom','Nakhon Sawan','Nonthaburi','Pathum Thani','Ayutthaya',
    'Phichit','Phitsanulok','Petchabun','Lop Buri','Samut Prakan','Samut Songkhram','Samut Sakhon','Sing Buri','Sukhothai','Suphan Buri',
    'Saraburi','Ang Thong','Uthai Thani'";
  }elseif($param['province']=='east_en'){
    $province = "'Chanthaburi','Chachoengsao','Chon Buri','Trat','Prachin Buri','Prachin Buri','Rayong','Sa Kaeo'";
  }elseif($param['province']=='west_en'){
    $province = "'Kanchanaburi','Tak','Prachuap Khiri Khan','Phetchaburi','Ratchaburi'";
  }elseif($param['province']=='south_en'){
    $province = "'Krabi','Chumphon','Trang','Nakhon Si Thammarat','Narathiwat','Pattani','Phangnga','Phatthalung','Phuket','Yala','Ranong',
    'Songkhla','Satun','Surat Thani'";
  }else{
    $province = "'".$param['province']."'";
  }

  $data = array(
    'code_from' => "'".$param['code_from']."'",
    'code_to' => "'".$param['code_to']."'",
    'business_type' => "'".$param['business_type']."'",
    'pMember_type' => "'".$param['member_type']."'",
    'is_active' => "'".$param['is_active']."'",
    'inbound' => "'%".$param['inbound']."%'",
    'outbound' => "'%".$param['outbound']."%'",
    'specialist' => "'%".$param['special']."%'",
    'language' => "'".$param['language']."'",
    'province' => $province,
    'zipcode' => "'".$param['zipcode']."'",
    'order' => "'".$param['order']."'",
    'zone' => "'".$param['province']."'",
    'domestic' => "'".$param['domestic']."'",
    );

  $sql = "select m.code,CASE WHEN ma.lang='TH' THEN m.name_th ELSE m.name_en END AS com_name,
          CASE WHEN ma.lang='TH' THEN mc.name_th ELSE mc.name_en END AS con_name,
          mc.position, m.tel, m.fax, m.email , ma.province
          from member m inner join member_contact mc on m.code = mc.mem_code inner join member_address ma on m.code = ma.mem_code
          where seq = 1 and (m.code between $data[code_from] and $data[code_to]) and ma.contactaddress_th = 'Y'
          and (case when $data[business_type]='ALL' then m.mem_type_id = m.mem_type_id else m.mem_type_id=$data[business_type] end)
          and (case when $data[pMember_type]='ALL' then m.type = m.type else m.type=$data[pMember_type] end)
          and (case when $data[is_active]='ALL' then m.is_active=m.is_active else m.is_active=$data[is_active] end)
          and (case when $data[inbound]='%ALL%' or $data[inbound]='ALL' then m.market_inbound=m.market_inbound else m.market_inbound like $data[inbound] end)
          and (case when $data[outbound]='%ALL%' or $data[inbound]='ALL' then m.market_outbound=m.market_outbound else m.market_outbound like $data[outbound] end)
          and (case when $data[specialist]='%ALL%' or $data[inbound]='ALL' then m.specialist=m.specialist else m.specialist like $data[specialist] end)
          and (case when $data[zipcode]='' then ma.zipcode=ma.zipcode else ma.zipcode=$data[zipcode] end)
          and ma.lang=$data[language]
          and (case when $data[domestic] = 'ALL' then m.domestic = m.domestic else m.domestic = $data[domestic] end)
          and (case when $data[zone]='ALL' then ma.province=ma.province else ma.province in ($data[province])end)
          order by ma.province, (case when $data[order]='member_name' then (case when $data[language]='TH' then m.name_th else m.name_en end)
          when $data[order]='zip_code' then ma.zipcode else m.code end)";
  $stmt = $pdo->prepare($sql);
  $stmt->execute();
  $memberData = $stmt->fetchAll();

  $a = "<table width='100%' border='1'>
      <thead>
          <tr>
              <th>Code</th>
              <th>Company Name</th>
              <th>Contact</th>
              <th>Position</th>
              <th>Telephone</th>
              <th>Fax</th>
              <th>Email</th>
              <th>Province</th>
          </tr>
      </thead>
      <tbody>";
      $b = "";
      foreach ($memberData as $memberDatas) {
          $b=$b."<tr>
              <td>".$memberDatas['code']."</td>
              <td>".$memberDatas['com_name']."</td>
              <td>".$memberDatas['con_name']."</td>
              <td>".$memberDatas['position']."</td>
              <td>".$memberDatas['tel']."</td>
              <td>".$memberDatas['fax']."</td>
              <td>".$memberDatas['email']."</td>
              <td>".$memberDatas['province']."</td>
          </tr>";
        }
      $c="</tbody>
      </table>";

      $msa = $a.$b.$c;
      responseJson(array(
      'status' => true,
      'textFiles' => $msa,
      'SQL' => $sql,
    ));
}

function doExportExcelMeetingSign($param){
  global $pdo;
  $data = array(
    'code_from' => "'".$param['code_from']."'",
    'code_to' => "'".$param['code_to']."'",
    'is_active' => "'".$param['is_active']."'",
    'order_by' => "'".$param['order_by']."'",
    'type' => "'".$param['type']."'"
  );

  $sql = "SELECT code, name_th, name_en
          FROM member
          WHERE ( $data[is_active] ='NO' OR  is_active='YES' )
          	AND (code BETWEEN  $data[code_from]  AND  $data[code_to] )
          	AND type=$data[type]
          ORDER BY IF($data[order_by]='code', code, IF($data[order_by]='name_en', name_en, name_th))";
  $stmt = $pdo->prepare($sql);
  $stmt->execute();
  $signData = $stmt->fetchAll();

  $a = "<table width='100%' border='1'>
      <thead>
          <tr>
              <th>ATTA NO.</th>
              <th>COMPANY NAME</th>
              <th>SIGNTURE</th>
          </tr>
      </thead>
      <tbody>";
      $b = "";
      foreach ($signData as $signDatas) {
          $b=$b."<tr>
              <td>".$signDatas['code']."</td>
              <td>".$signDatas['name_en']."</td>
              <td>"." "."</td>
          </tr>";
        }
      $c="</tbody>
      </table>";

      $msa = $a.$b.$c;
      responseJson(array(
      'status' => true,
      'textFiles' => $msa,
      'SQL' => $sql,
    ));
}

function doExportExcelMemberRecord($param) {
  global $pdo;
  $data = array(
    'code_from' => "'".$param['code_from']."'",
    'code_to' => "'".$param['code_to']."'",
    'is_active' => "'".$param['is_active']."'",
    'type_extra' => "'".$param['type_extra']."'",
    'type_ordinary' => "'".$param['type_ordinary']."'",
    'type_vip' => "'".$param['type_vip']."'"
  );
  $sql = "SELECT m.code code, m.name_th, m.name_en
      	, case when m.`type`='ORDINARY' then 'ท่องเที่ยว' else t.name end as type_name
      	, case type when 'ORDINARY' then 'สามัญ' when 'EXTRA' then 'สมทบ' else 'กิติมศักดิ์' end as type
      	, IFNULL(a.addr1, '') addr1
      	, IFNULL(a.addr2, '') addr2
      	, a.tambon
      	, a.amphur
      	, a.province
      	, a.zipcode
      	, IF(m.start_date='0000-00-00',NULL,m.start_date) start_date
      	, IF(m.end_date='0000-00-00',NULL,m.end_date) end_date
      	, c1.name_th as contact1_name
      	, case when n1.nation_th = 'N/A' then '' else n1.nation_th end as contact1_nation
        	, c2.name_th as contact2_name
      	, case when n2.nation_th = 'N/A' then '' else n2.nation_th end as contact2_nation
      	, c3.name_th as contact3_name
      	, case when n3.nation_th = 'N/A' then '' else n3.nation_th end as contact3_nation
      FROM member m
      	LEFT JOIN specialist t ON m.specialist like concat('%',t.code,'%')
      	LEFT JOIN member_address a ON m.code=a.mem_code AND a.code='000001' AND a.lang='TH'
      	LEFT JOIN (
      		member_contact c1 JOIN country n1 ON c1.nation=n1.code
      	) ON m.code=c1.mem_code AND c1.seq=1
      	LEFT JOIN (
      		member_contact c2 JOIN country n2 ON c2.nation=n2.code
      	) ON m.code=c2.mem_code AND c2.seq=2
      	LEFT JOIN (
      		member_contact c3 JOIN country n3 ON c3.nation=n3.code
      	) ON m.code=c3.mem_code AND c3.seq=3
      WHERE ( $data[is_active] ='NO' OR  m.is_active='YES' )
      	AND (m.code BETWEEN  $data[code_from]  AND  $data[code_to] )
      	AND (
      		m.type=IF($data[type_ordinary]='YES','ORDINARY','')
      		OR m.type=IF($data[type_extra]='YES','EXTRA','')
      		OR m.type=IF($data[type_vip]='YES','VIP','')
      	)
      ORDER BY m.code";

  $stmt = $pdo->prepare($sql);
  $stmt->execute();
  $memberRecord = $stmt->fetchAll();

  $a = "<table width='100%' border='1'>
      <thead>
          <tr>
              <th>เลขที่สมาชิก</th>
              <th>ชื่อสมาชิก</th>
              <th>สัญชาติ</th>
              <th>ชื่อที่ใช้ประกอบวิสาหกิจ</th>
              <th>ประเภทวิสาหกิจ</th>
              <th>ที่ตั้งสำนักงาน</th>
              <th>วันที่เริ่มสมาชิกภาพ</th>
              <th>วันที่สิ้นสมาชิกภาพ</th>
              <th>ประเภทสมาชิก</th>
              <th>หมายเหตุ</th>
          </tr>
      </thead>
      <tbody>";
      $b = "";
      foreach ($memberRecord as $memberRecords) {
          $b=$b."<tr>
              <td>".$memberRecords['code']."</td>
              <td>".$memberRecords['name_th']."<br/>"."โดยมี"."<br/>".$memberRecords['contact1_name']."<br/>".$memberRecords['contact2_name']."<br/>".$memberRecords['contact3_name']."</td>
              <td>"."<br/><br/>".$memberRecords['contact1_nation']."<br/>".$memberRecords['contact2_nation']."<br/>".$memberRecords['contact3_nation']."</td>
              <td>".$memberRecords['name_en']."<br/>".$memberRecords['name_th']."</td>
              <td>".$memberRecords['type_name']."</td>
              <td>".$memberRecords['addr1']." ".$$memberRecords['addr2']."<br/>".$memberRecords['tambon']." ".$memberRecords['amphur']."<br/>".$memberRecords['province']." ".$memberRecords['zipcode']."</td>
              <td>".$memberRecords['start_date']."</td>
              <td>".$memberRecords['end_date']."</td>
              <td>".$memberRecords['type']."</td>
              <td>"." "."</td>
          </tr>";
        }
      $c="</tbody>
      </table>";

      $msa = $a.$b.$c;
      responseJson(array(
      'status' => true,
      'textFiles' => $msa,
      'SQL' => $sql,
    ));
}

function doCardCancel($param){
  //echo $param['card_code'];
  global $pdo;

  try {
    $pdo->beginTransaction();

    $sql = "UPDATE carddb SET is_active='NO', is_cancel='YES' WHERE code=:card_code";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(array(
      ':card_code' => $param['card_code'],
    ));
    $pdo->commit();
  } catch (Exception $e) {
    $error = $stmt->errorInfo();
    $pdo->rollback();
    responseJson(array(
      'status' => false,
      'reason' => 'ERR_UNKNOWN',
      'error' => $error,
    ));
  }
  responseJson(array(
    'status' => true,
  ));
}

function doSelectMemberOnec($param) {
  global $pdo;
  //echo $param['mem_code'];
  $sql = "SELECT m.code, m.name_en, m.name_th "
        .", IF(m.type='ORDINARY', 'สามัญ', IF(m.type='EXTRA', 'สมทบ', IF(m.type='VIP', 'กิติมศักดิ์', 'เงินสด'))) type_name "
        .", a.addr1 , concat(a.addr2,' ',a.tambon,' ',a.amphur) addr2  , a.province , a.zipcode "
        ."FROM member m "
        ."LEFT JOIN member_address a ON m.code=a.mem_code AND a.invoice_addr='Y' "
        ."WHERE m.is_active='YES' AND m.code=:memCode ORDER BY m.name_en";
  $stmt = $pdo->prepare($sql);
  $stmt->execute(array(
    ':memCode' => $param['mem_code'],
    ));
  $member_data = $stmt->fetch();
  if(!$member_data){
    responseJson(array(
      'status' => false,
      'reason' => 'กรุณาเว็ครหัสสมาชิก',
    ));
  }else{
    responseJson(array(
      'status' => true,
      'member_data' => $member_data,
    ));
  }

}

function doLoadInvoiceByCode($param) {
  //echo $param['code'];
  $code = $param['code'];
  global $pdo;

  $stmt = $pdo->prepare("SELECT code,period_code,mem_code,branch_name,issue_date,name,addr,issue_by,addr_id FROM invoice WHERE code=:code");
  $stmt->execute(array(
    ':code' => $code,
  ));
  $invoice = $stmt->fetch();
  if ($invoice===false) {
    responseJson(array(
      'status' => false,
      'reason' => 'ERR_RECEIPT_NOT_FOUND',
    ));
  }
//SELECT * FROM receipt_item WHERE receipt_code=:code ORDER BY line_num
  $sql = "SELECT account_code,detail,price,prod_code,qty,unit,vat_type FROM invoice_item WHERE invoice_code=:code ORDER BY line_num";
  $stmt = $pdo->prepare($sql);
  $stmt->execute(array(
    ':code' => $code,
  ));
  $invoice['items'] = $stmt->fetchAll();

  responseJson(array(
    'status' => true,
    'invoice' => $invoice,
  ));
}

function doLot_inList($param){
  global $pdo;
  $posNo = substr($param['countter'],2);
  if ($posNo=='SU'){
    $prodCode = "('OF1','OF2','SH1','SH2')";
  } elseif ($posNo=='DM'){
    $prodCode = "('OFD','SHD')";
  } elseif ($posNo=='HO'||$posNo=='HQ'){
    $prodCode = "('OF','SH')";
  } else {
    $prodCode = "('OFN','SHN')";
  }
  $sql = "select aval_qty avail_qty, book_no book_num, book_qty, LPAD(next_item,5,0) next_item, prefix_code prefix, start_item, "
        ."in_qty start_qty, ceil(aval_qty/50) avail_book FROM lot_in WHERE prod_code in $prodCode ORDER BY id DESC LIMIT 10";
  $stmt = $pdo->prepare($sql);
  $stmt->execute();
  $lotinLists = $stmt->fetchAll();

  responseJson(array(
    'status' => true,
    'lotinLists' => $lotinLists,
    'countter' => $posNo,
  ));
}

function doGetDataforRefcode($param){
  $data = array();
  global $pdo;
  $stmt = $pdo->prepare("select sell_item from product where code=:code");
  $stmt->execute(array(
    ':code' => $param['prodCode'],
  ));
  $data['sell_item'] = $stmt->fetchColumn();

  if (!isset($param['lotin_id'])||$param['lotin_id']==''||$param['lotin_id']==null||$param['lotin_id']==undefined){
    $stmt = $pdo->prepare("select max(lot_inid) from lot_out where prod_code=:code and is_cancel = 'NO'");
    $stmt->execute(array(
      ':code' => $param['prodCode'],
    ));
    $data['last_lotinid_from_lotout'] = $stmt->fetchColumn();
  }else{
    $data['last_lotinid_from_lotout'] = $param['lotin_id'];
  }

  $stmt = $pdo->prepare("select id, prod_code, in_qty, start_item, aval_qty, next_item, prefix_code, book_no, book_qty "
                       ."from lot_in where id=:id");
  $stmt->execute(array(
    ':id' => $data['last_lotinid_from_lotout'],
  ));
  $data['firstLotinData'] = $stmt->fetch();

  //$data['next_last_lotinid_from_lotout'] = $data['last_lotinid_from_lotout']+1;
  $stmt = $pdo->prepare("select id, prod_code, in_qty, start_item, aval_qty, next_item, prefix_code, book_no, book_qty "
                       ."from lot_in where id>:id and prod_code=:prodCode order by id limit 1");
  $stmt->execute(array(
    ':id' => $data['last_lotinid_from_lotout'],
    ':prodCode' => $param['prodCode'],
  ));
  $data['nextLotinData'] = $stmt->fetch();

  responseJson(array(
    'status' => true,
    'refdata' => $data,
  ));

}

function doCheckCancelData($param){
  //$dataCheckCancel=array();
  global $pdo;
  $stmt = $pdo->prepare("select sum(aval_qty) avail_qty from lot_cancel where aval_qty>0 and prod_code=:code");
  $stmt->execute(array(
      ':code' => $param['prodCode'],
    ));
  $dataCheckCancel = $stmt->fetch();

  if($dataCheckCancel['avail_qty']==null){
    responseJson(array(
      'status' => false,
      'reason' => 'ERR_CANCEL_NOT_FOUND',
    ));
  }else{
    responseJson(array(
    'status' => true,
    'dataCheckCancel' => $dataCheckCancel,
  ));
  }

}

function doGetCancelData($param){
  $cancelData = array();
  global $pdo;
  $stmt = $pdo->prepare("select sell_item from product where code=:code");
  $stmt->execute(array(
    ':code' => $param['prodCode'],
  ));
  $cancelData['sell_item'] = $stmt->fetchColumn();

  $stmt = $pdo->prepare("select sum(aval_qty) aval_qty from lot_cancel where real_id>=:id and prod_code=:prodCode and aval_qty<>0");
  $stmt->execute(array(
    'id' => ($param['lotin_id']=='') ? '1' : $param['lotin_id'],
    'prodCode' => $param['prodCode'],
  ));
  $cancelData['sumAllQty'] = $stmt->fetchColumn();

  if($param['lotin_id']==''){
    $stmt = $pdo->prepare("select max(lot_inid) from lot_out where prod_code=:code and is_cancel='YES'");
    $stmt->execute(array(
      ':code' => $param['prodCode'],
    ));
    $cancelData['last_lotcancelid_from_lotout'] = $stmt->fetchColumn();
  }else{
    $cancelData['last_lotcancelid_from_lotout'] = $param['lotin_id'];
  }

  $stmt = $pdo->prepare("select id, prod_code, in_qty, start_item, aval_qty, next_item, prefix_code, book_no, book_qty "
                       ."from lot_cancel where real_id>=:id and prod_code=:prodCode and aval_qty<>0 order by id limit 1");
  $stmt->execute(array(
    ':id' => ($cancelData['last_lotcancelid_from_lotout']=='') ? '1' : $cancelData['last_lotcancelid_from_lotout'],
    ':prodCode' => $param['prodCode'],
  ));
  $cancelData['firstLotcancelData'] = $stmt->fetch();

  $stmt = $pdo->prepare("select id, prod_code, in_qty, start_item, aval_qty, next_item, prefix_code, book_no, book_qty "
                       ."from lot_cancel where real_id>:id and prod_code=:prodCode and aval_qty<>0 order by id limit 1");
  $stmt->execute(array(
    ':id' => ($cancelData['last_lotcancelid_from_lotout']=='') ? '1' : $cancelData['last_lotcancelid_from_lotout'],
    ':prodCode' => $param['prodCode'],
  ));
  $cancelData['nextLotcancelData'] = $stmt->fetch();

  responseJson(array(
    'status' => true,
    'dataCheckCancel' => $cancelData,
  ));
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////   function checkin /////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function doBuscallListCheckIn($param){
  $airport = $param['airport'];
  $limit = $param['limit'];
  global $pdo;

  $stmt = $pdo->prepare("select license,DATE_FORMAT(ready_time,'%H:%i:%s') time from buscall where airport=:airport and ready_time <> '0000-00-00 00:00:00' order by ready_time desc limit 15");
  $stmt->execute(array(
    ':airport' => $airport
  ));
  $data = $stmt->fetchAll();

  responseJson(array(
    'status' => true,
    'dataCheckeIn' => $data,
  ));
}

function doSaveListCheckIn($param){
  //print_r($param);
  global $pdo;

  try {
    $pdo->beginTransaction();

    $sql = "UPDATE buscall SET ready_time=:ready_time WHERE status='WAIT' AND ready_time='0000-00-00 00:00:00' AND airport=:airport AND license=:license";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(array(
      ':airport' => $param['airport'],
      ':ready_time' => $param['tx_date'],
      ':license' => $param['license'],
    ));

    if ($stmt->rowCount() == 0) {
      throw new Exception('CAN_NOT_UPDATE_BUS_CALL');
    }

    $pdo->commit();
  } catch (Exception $e) {
    $error = $stmt->errorInfo();
    $pdo->rollback();
    responseJson(array(
      'status' => false,
      'reason' => 'ไม่มีเลขทะเบียนที่กำหนด',
      'error' => $error,
    ));
  }
  responseJson(array(
    'status' => true,
    'sql' => $sql,
  ));
}

function doGetLastReceiptCode($param){
  $pos = $param['pos'];
  global $pdo;

  $stmt = $pdo->prepare("select code from receipt where substr(code,4,4) =:pos order by id desc limit 1");
  $stmt->execute(array(
    ':pos' => $pos
  ));
  $data = $stmt->fetchColumn();
  $data2 = substr($data,8,6);

  $data3 = $data2 + 1;
  if(strlen($data3) == 1) {
    $datax = '00000'.$data3;
  }elseif (strlen($data3) == 2) {
    $datax = '0000'.$data3;
  }elseif (strlen($data3) == 3) {
    $datax = '000'.$data3;
  }elseif (strlen($data3) == 4) {
    $datax = '00'.$data3;
  }elseif (strlen($data3) == 5) {
    $datax = '0'.$data3;
  }elseif (strlen($data3) == 6) {
    $datax = $data3;
  }

  $nextReceiptCode = substr($data,0,8)."".$datax;

  responseJson(array(
    'status' => true,
    'lastReceipt' => $data,
    'nextReceipt' => $nextReceiptCode
  ));
}

function doGetNextMemCode(){
  global $pdo;

  $stmt = $pdo->prepare("select code from member order by code desc limit 1");
  $stmt->execute();
  $data = $stmt->fetchColumn();

  $data3 = $data + 1;
  if(strlen($data3) == 1) {
    $datax = '0000'.$data3;
  }elseif (strlen($data3) == 2) {
    $datax = '000'.$data3;
  }elseif (strlen($data3) == 3) {
    $datax = '00'.$data3;
  }elseif (strlen($data3) == 4) {
    $datax = '0'.$data3;
  }elseif (strlen($data3) == 5) {
    $datax = $data3;
  }

  $nextCode = $datax;

  responseJson(array(
    'status' => true,
    'lastReceipt' => $data,
    'nextCode' => $nextCode
  ));
}

function doGetNextUuid($param) {
  global $pdo;

  $sql = "select uuid from member where code=:mem_code";
  try{
    $stmt = $pdo->prepare($sql);
    if($stmt){
      $stmt->execute(array(
        ':mem_code' => $param['mem_code']
      ));
      $mem_uuid = $stmt->fetchColumn();
      if($mem_uuid){
        responseJson(array(
          'status' => true,
          'mem_uuid' => $mem_uuid,
          'mem_code' => $param['mem_code']
        ));
      }else {
        responseJson(array(
          'status' => false,
          'mem_code' => $param['mem_code'],
          //'error' => "A database problem has occurred: " . $e->getMessage()
        ));
      }
    }
  } catch (PDOException $e) {
    responseJson(array(
      'status' => false,
      'mem_code' => $param['mem_code'],
      //'error' => "A database problem has occurred: " . $e->getMessage()
    ));
    echo "A database problem has occurred: " . $e->getMessage();
  }
}

function doGetNextUuidFreelance($param) {
  global $pdo;

  $sql = "select uuid from freelance where code=:freelance_code";
  try{
    $stmt = $pdo->prepare($sql);
    if($stmt){
      $stmt->execute(array(
        ':freelance_code' => $param['freelance_code']
      ));
      $freelance_uuid = $stmt->fetchColumn();
      if($freelance_uuid){
        responseJson(array(
          'status' => true,
          'freelance_uuid' => $freelance_uuid,
          'freelance_code' => $param['freelance_code']
        ));
      }else {
        responseJson(array(
          'status' => false,
          'freelance_code' => $param['freelance_code'],
          //'error' => "A database problem has occurred: " . $e->getMessage()
        ));
      }
    }
  } catch (PDOException $e) {
    responseJson(array(
      'status' => false,
      'freelance_code' => $param['freelance_code'],
      //'error' => "A database problem has occurred: " . $e->getMessage()
    ));
    echo "A database problem has occurred: " . $e->getMessage();
  }
}

function doGetNextReceipt($param) {
  global $pdo;

  $sql = "select code from receipt where code=:receipt_code";
  try{
    $stmt = $pdo->prepare($sql);
    if($stmt){
      $stmt->execute(array(
        ':receipt_code' => $param['receipt_code']
      ));
      $receipt_code = $stmt->fetchColumn();
      if($receipt_code){
        responseJson(array(
          'status' => true,
          'receipt_code' => $receipt_code
        ));
      }else {
        responseJson(array(
          'status' => false
          //'error' => "A database problem has occurred: " . $e->getMessage()
        ));
      }
    }
  } catch (PDOException $e) {
    responseJson(array(
      'status' => false
      //'error' => "A database problem has occurred: " . $e->getMessage()
    ));
    echo "A database problem has occurred: " . $e->getMessage();
  }
}

function doGetNextInvoice($param) {
  global $pdo;

  $sql = "SELECT inv.code, inv.issue_date, case when inv.status='PAID' then inv.name else inv.name end as thai_name, concat(m.code,':',m.name_en) full_name, case when inv.status='PAID' then inv.name else m.name_th end as name_en,inv.amount as totals, inv.total_amount, inv.vat_amount, inv.status, inv.receipt_code
          , m.code mem_code, inv.deadline_date, inv.reissue_date, ma.addr1 , ma.addr2 , ma.tambon , ma.amphur
          , ma.province , ma.zipcode, inv.remark, m.code as mem_code, m.tax_id, inv.real_receipt, inv.branch_name
        FROM invoice inv LEFT JOIN member m ON inv.mem_code=m.code
        LEFT JOIN member_address ma on m.code = ma.mem_code AND inv.addr_id=ma.id
        where inv.code =:invoice_code";
  try{
    $stmt = $pdo->prepare($sql);
    if($stmt){
      $stmt->execute(array(
        ':invoice_code' => $param['invoice_code']
      ));
      $invoice_code = $stmt->fetch();
      if($invoice_code){
        responseJson(array(
          'status' => true,
          'invoice_code' => $invoice_code
        ));
      }else {
        responseJson(array(
          'status' => false
          //'error' => "A database problem has occurred: " . $e->getMessage()
        ));
      }
    }
  } catch (PDOException $e) {
    responseJson(array(
      'status' => false
      //'error' => "A database problem has occurred: " . $e->getMessage()
    ));
    echo "A database problem has occurred: " . $e->getMessage();
  }
}

function doLoadSearchInvoice($param){
  global $pdo;
  $sql = "SELECT inv.code, inv.issue_date, concat(m.code,':',m.name_en) full_name, case when inv.status='PAID' then inv.name else m.name_th end as name_en, inv.total_amount, inv.vat_amount, inv.status, inv.receipt_code
          , m.code mem_code, inv.deadline_date, inv.reissue_date, ma.addr1 , ma.addr2, ma.tambon, ma.amphur ,ma.province ,ma.zipcode, inv.remark, inv.real_receipt, inv.branch_name
        FROM invoice inv LEFT JOIN member m ON inv.mem_code=m.code
        LEFT JOIN member_address ma on m.code = ma.mem_code AND ma.invoice_addr='Y'
        where inv.status in ('WAIT','PAID') and inv.code=:code limit 1";
  try{
    $stmt = $pdo->prepare($sql);
    if($stmt){
      $stmt->execute(array(
        ':code' => $param['code']
      ));
      $invoice = $stmt->fetch();
      if($invoice){
        responseJson(array(
          'status' => true,
          'invoice' => $invoice
        ));
      }else {
        responseJson(array(
          'status' => false,
          'cc' => $param['code'],
          //'error' => "A database problem has occurred: " . $e->getMessage()
        ));
      }
    }
  } catch (PDOException $e) {
    responseJson(array(
      'status' => false
      //'error' => "A database problem has occurred: " . $e->getMessage()
    ));
    echo "A database problem has occurred: " . $e->getMessage();
  }
}

function doGetBuscallDoneTime($param){
  global $pdo;

  $sql = "select done_time,TIMESTAMPDIFF(Minute,done_time,NOW()) AS time_diff from buscall where inform_code=:inform_code limit 1";
  try{
    $stmt = $pdo->prepare($sql);
    if($stmt){
      $stmt->execute(array(
        ':inform_code' => $param['code']
      ));
      $doneTime = $stmt->fetch();
      if($doneTime){
        responseJson(array(
          'status' => true,
          'doneTime' => $doneTime
        ));
      }else {
        responseJson(array(
          'status' => false
          //'error' => "A database problem has occurred: " . $e->getMessage()
        ));
      }
    }
  } catch (PDOException $e) {
    responseJson(array(
      'status' => false
      //'error' => "A database problem has occurred: " . $e->getMessage()
    ));
    echo "A database problem has occurred: " . $e->getMessage();
  }
}

function doRegisCard($param){

  global $pdo;
  $stmt = $pdo->prepare("SELECT id FROM regis_card WHERE code =:code ");
  $stmt->execute(array(':code' => $param['code']));
  $num_rc = $stmt->fetchColumn();

  if($num_rc != 0){
    responseJson(array(
      'status' => false
    ));
  }else{

    $stmt = $pdo->prepare("INSERT INTO regis_card SET code=:code");
    $stmt->execute(array(
      ':code' => $param['code']
    ));

    responseJson(array(
      'status' => true
    ));
  }
}

function doGetAccCode($param){
  global $pdo;

  try{
    $stmt = $pdo->prepare("SELECT acc_code FROM carddb WHERE card_number = :cardNo");
    $stmt->execute(array(':cardNo' => $param['cardNo']));
    $accCode = $stmt->fetchColumn();

    responseJson(array(
      'status' => true,
      'accCode' => $accCode
    ));
  } catch (PDOException $e) {
    responseJson(array(
      'status' => false,
      'error' => "A database problem has occurred: " . $e->getMessage(),
      'reason' => $e->getMessage()
    ));
    echo "A database problem has occurred: " . $e->getMessage();
  }

}

function doSelectServerDown($param){
  global $pdo;

  try{
    $pdo->beginTransaction();

    $stmt = $pdo->prepare("UPDATE check_down_server SET server = :server WHERE airport = 'BKK'");
    $stmt->execute(array(':server' => $param['server']));
    $rowUpdate = $stmt->rowCount();

    $pdo->commit();
    responseJson(array(
      'status' => true,
      'rowUpdate' => $rowUpdate
    ));
  } catch (PDOException $e) {
    $pdo->rollback();
    responseJson(array(
      'status' => false,
      'error' => "A database problem has occurred: " . $e->getMessage(),
      'reason' => $e->getMessage()
    ));
    echo "A database problem has occurred: " . $e->getMessage();
  }
}

?>
