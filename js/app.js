var DB_NAME = 'rapidcard';
var DB_VERSION = 73;
var ATTA_KEY = 'atta2014';

var chrome = chrome || {};
if ('undefined'===typeof chrome.storage) {
	chrome.storage = {};
	chrome.storage.local = {
		get:window.localStorage.getItem,
		set:window.localStorage.setItem,
	};
}

var attaApp = angular.module('attaApp', [
	'ui.router',
	'ngSanitize',
	'ui.select',
	'toaster',
	'ngDialog',
	'nsHelper',
	'nsWidget',
	'appAnimate',
	'attaDb',
	'attaDbms',
	'attaConfig',
	'attaMember',
	'attaCard',
	'attaBus',
 	'attaFinance',
 	'attaAccounting',
]);
attaApp.run(['sysConfig', 'dbSvc', function(sysConfig, dbSvc) {
	console.log('running...');
}]);

attaApp.constant('sysConfig', {
//	'API_URL': 'http://122.155.3.216/rapidpass/api.php',
//	'NODE_URL': 'http://localhost:3000',
//	'DB_URL' : 'http://localhost:3001/api.php',
	'ACC_URL': 'http://192.168.1.40:81/rapidpass/api.php',
});
attaApp.config( [
    '$compileProvider', function( $compileProvider ) {
	var currentImgSrcSanitizationWhitelist = $compileProvider.imgSrcSanitizationWhitelist();
	var newImgSrcSanitizationWhiteList = currentImgSrcSanitizationWhitelist.toString().slice(0,-1)
	+ '|chrome-extension:'
	+currentImgSrcSanitizationWhitelist.toString().slice(-1);
	$compileProvider.imgSrcSanitizationWhitelist(newImgSrcSanitizationWhiteList);
	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|chrome-extension):/);
//	$compileProvider.urlSanitizationWhitelist(/^(https?|ftp|mailto|file|chrome-extension):/);
    }
]);

attaApp.config(function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise('/loading');
	$stateProvider.state('loading', {
		url: '^/loading',
		templateUrl: 'views/loading.html',
		controller: 'LoadingCtrl',
	// }).state('loading.register', {
	// 	url: '^/register',
	// 	templateUrl: 'views/register.html',
	// 	controller: 'TerminalRegisterCtrl',
	}).state('signin', {
		url:'^/signin',
		templateUrl: 'views/signin.html',
	}).state('setting', {
		url:'^/setting',
		templateUrl: 'views/setting.html',
	}).state('home', {
		url:'^/home',
		templateUrl: 'views/home.html',
	}).state('home.welcome', {
		url:'^/welcome',
		templateUrl: 'views/welcome.html',
	}).state('home.control_panel', {
		url:'^/control_panel',
		templateUrl:'views/control_panel.html',
		controller: 'ControlPanelCtrl',
	}).state('home.config', {
		url:'^/config',
		templateUrl:'views/config.html',
		controller: 'ConfigCtrl',
	}).state('home.staff', {
		url:'^/staff',
		templateUrl: '/views/staff_list.html',
		controller: 'StaffListCtrl',
	}).state('home.staff_edit', {
		url: '^/staff/edit/:uuid',
		templateUrl: '/views/staff_edit.html',
		controller: 'StaffEditCtrl',
	}).state('home.member', {
		url: '^/member/:page/:searchs',
		templateUrl: '/views/member_list.html',
		controller: 'MemberListCtrl',
	}).state('home.member_edit', {
		url: '^/member/edit/:uuid/:page/:searchs',
		templateUrl: '/views/member_edit.html',
		controller: 'MemberEditCtrl',
	}).state('home.member_report', {
		url:'^/member/report',
		templateUrl:'views/member_report.html',
		controller:'MemberReportCtrl',
	}).state('home.accounting_report', {
		url:'^/accounting/report',
		templateUrl:'views/accounting_report.html',
		controller:'AccountingReportCtrl',
	}).state('home.statistic_report', {
		url:'^/statistic/report',
		templateUrl:'views/statistic_report.html',
		controller:'StatisticReportCtrl',
	}).state('home.freelance', {
		url: '^/freelance',
		templateUrl: '/views/freelance_list.html',
		controller: 'FreelanceListCtrl',
	}).state('home.freelance_edit', {
		url: '^/freelance/edit/:uuid',
		templateUrl: '/views/freelance_edit.html',
		controller: 'FreelanceEditCtrl',
	}).state('home.card_use', {
		url:'^/card/use',
		templateUrl:'/views/card_use.html',
		controller:'CardUseCtrl',
	}).state('home.card_issue', {
		url:'^/card/issue',
		templateUrl:'/views/card_issue.html',
		controller:'CardIssueCtrl',
	}).state('home.card_topup', {
		url:'^/card/topup',
		templateUrl:'/views/card_topup.html',
		controller:'CardTopupCtrl',
	}).state('home.card_adjust', {
		url:'^/card/adjust/:type',
		templateUrl:'/views/card_adjust.html',
		controller:'CardAdjustCtrl',
	}).state('home.card_history', {
		url:'^/card/history',
		templateUrl:'/views/card_history.html',
		controller:'CardHistoryCtrl',
	}).state('home.card_cancel', {
		url:'^/card/cancel',
		templateUrl:'/views/card_cancel.html',
		controller:'CardCancelCtrl',
	}).state('home.card_coupon', {
		url:'^/card/coupon',
		templateUrl:'views/card_coupon.html',
		controller:'CardCouponCtrl',
	}).state('home.period_close', {
		url:'^/period/close',
		templateUrl:'/views/period_close.html',
		controller:'PeriodCloseCtrl',
	}).state('home.inform_onestop', {
		url:'^/inform/onestop',
		templateUrl:'/views/inform_onestop.html',
		controller:'InformOneStopCtrl',
	}).state('home.inform', {
		url:'^/inform',
		templateUrl:'views/inform.html',
		controller:'InformCtrl',
	}).state('home.inform_list', {
		url:'^/inform/list',
		templateUrl:'views/inform_list.html',
		controller:'InformListCtrl',
	}).state('home.inform_edit', {
		url:'^/inform/edit/:code',
		templateUrl:'views/inform_edit.html',
		controller:'InformEditCtrl',
	}).state('home.checkin', {
		url:'^/checkin',
		templateUrl:'views/checkin.html',
		controller:'CheckInCtrl',
	}).state('home.buscall_office', {
		url:'^/buscall_office/:location',
		templateUrl:'views/buscall-office.html',
		controller:'BusCallCtrl',
	}).state('home.buscall', {
		url:'^/buscall/:location',
		templateUrl:'views/buscall.html',
		controller:'BusCallCtrl',
	}).state('home.invoice', {
		url:'^/invoice',
		templateUrl:'views/invoice_edit.html',
		controller:'InvoiceCtrl',
	}).state('home.re_invoice', {
		url:'^/reinvoice',
		templateUrl:'views/re_invoice.html',
		controller:'ReInvoiceCtrl',
	}).state('home.re_print_invoice', {
		url:'^/reprintinvoice',
		templateUrl:'views/re_print_invoice.html',
		controller:'RePrintInvoiceCtrl',
	}).state('home.invoice_edit', {
		url:'^/invoice/edit/:uuid',
		templateUrl:'views/invoice_edit.html',
		controller:'InvoiceEditCtrl',
	}).state('home.receipt', {
		url:'^/receipt_list',
		templateUrl:'views/receipt_list.html',
		controller:'ReceiptListCtrl',
	}).state('home.receipt_edit', {
		url:'^/receipt/edit/:uuid',
		templateUrl:'views/receipt_edit.html',
		controller:'ReceiptEditCtrl',
	}).state('home.receipt_new', {
		url:'^/receipt/new/:uuid',
		templateUrl:'views/receipt_new.html',
		controller:'ReceiptNewCtrl',
	}).state('home.re_issue', {
		url:'^/re_issue',
		templateUrl:'views/re_issue.html',
		controller:'ReIssueCtrl',
	}).state('home.accounting_post', {
		url:'^/accounting/post',
		templateUrl:'views/accounting_post.html',
		controller:'AccountingPostCtrl',
	}).state('home.product', {
		url:'^/product',
		templateUrl:'views/product.html',
		controller:'ProductCtrl',
	}).state('home.online', {
		url:'^/online',
		templateUrl:'views/online.html',
		controller:'OnlineCtrl',
	}).state('home.server_setting', {
		url:'^/home.server_setting',
		templateUrl:'views/server_setting.html',
		controller:'serverSetting',
	});
});

attaApp.service('globalMessage', [function() {
	var msgShow = false;
	var elMsg = angular.element('#global-message');
	var _showMessage = function (msg, color) {
		elMsg.html(msg);
		color = color || 'white';
		elMsg.css({color:color});
		if (!msgShow) {
			elMsg.css({top:0,opacity:1});
			msgShow = true;
		}
	}
	var _hideMessage = function() {
		if (msgShow) {
			elMsg.css({top:'-40px',opacity:0});
			msgShow = false;
		}
	}
	this.showMessage = _showMessage;
	this.hideMessage = _hideMessage;
}]);

attaApp.service('ddnsService', ['$rootScope', '$http', function($rootScope, $http) {
	var timer = null;
	var getIP = function() {
		$http.get($rootScope.setting.DDNS).then(function(response) {
			if (typeof response.data === 'undefined' || typeof response.data.ip === 'undefined'
				|| typeof response.data.ip==='0.0.0.0') {
				return;
			}
			var ip = response.data.ip;
			console.log('Got IP=', ip);
			if ($rootScope.setting.lastIP != ip) {
				$rootScope.setting.lastIP = ip;
				if ($rootScope.setting.webService.dynamic===true) {
					$rootScope.setting.WS_URL = 'http://' + ip + ':8000/rapidpass/client/api.php';
					$rootScope.setting.webService.url = $rootScope.setting.WS_URL;
				}
				if ($rootScope.setting.reportService.dynamic===true) {
					$rootScope.setting.RS_URL = 'http://' + ip + ':8000/rapidpass/client/report.php';
					$rootScope.setting.reportService.url = $rootScope.setting.RS_URL;
				}
				chrome.storage.local.set({setting:$rootScope.setting});
			}
		});
	}
	this.start = function() {
		if (timer != null) {
			clearInterval(timer);
			timer = null;
		}
		console.log('Starting DDNS Service...');
		getIP();
		timer = setInterval(getIP, 30*1000);
	};
	this.stop = function () {
		if (timer != null) {
			clearInterval(timer);
			timer = null;
		}
		console.log('Stopping DDNS Service...');
	}
}]);

attaApp.service('cardReaderService', ['$rootScope', 'dbSvc', '$http', '$q', 'toaster',
		function($rootScope, dbSvc, $http, $q, toaster) {

	this.readCardInfo = function() {
		var dfd = $q.defer();

		$http.get($rootScope.setting.RFID_URL + '/rfid/read').then(function(result) {
			if (result.data.status===true) {
				console.log(result.data);
				dbSvc.request('cardInfo', {code: result.data.cardId}).then(function(result) {
					if (result.status===true) {
						output = {
							carddb: result.carddb,
							cardAccount: result.card_account,
							member: result.member,
							freelance: result.freelance,
						};
						dfd.resolve(output);
					} else {
						throw 'CARD INFO NOT FOUND';
						dfd.reject(result);
					}
				});
			} else {
				console.log('ไม่มีบัตร');
				throw 'CARD NOT FOUND';
			}
		}).catch(function(e) {
			toaster.pop('warning', '', e);
			dfd.reject();
		});

		return dfd.promise;
	}
}]);

attaApp.service('receiptPrintService', ['$rootScope', '$http', '$q', 'dbSvc', 'helper', 'toaster', function($rootScope, $http, $q, dbSvc, helper, toaster) {

	this.printReceipt = function(code, numCopy) {
		var dfd = $q.defer();
		numCopy = parseInt(numCopy);
		numCopy = isNaN(numCopy) ? 1 : numCopy;

		dbSvc.request('receiptByCode', {code:code}).then(function(result) {
			if (result.status===true) {
				var receipt = result.receipt;

				var from = helper.thSplit(receipt.mem_code +" "
						+ receipt.name
						+ (receipt.tax_id=='' ? '' : ' TAX#' + receipt.tax_id)
					, 55);//receipt.branch_name + ' ' +
				var addr = helper.thSplit(receipt.branch_name + ' ' + receipt.addr.replace(/\s+/g, ' ')
					, 60); //  15cpi=70, 12cpi=60
				if (receipt.mem_code=='000000') {
					from = ['เงินสด',''];
					addr = helper.thSplit(receipt.addr.replace(/\s+/g, ' '), 70);
				}
				var remark = (1.0*receipt.payin > 0 ? '*** PAY-IN ***' + (receipt.remark != '' ? '  ' :'') : '')
					+ receipt.remark;

				var data = {
					uuid: helper.newUUID(),
					report: 'receipt',
					param: {
						from1:from[0],
						from2:from[1]||'',
						addr0:addr.length > 2 ? addr[0] : '' ,
						addr1:addr.length > 2 ? addr[1] : addr[0],
						addr2:addr.length > 2 ? addr[2] : addr[1],
						code:receipt.code,
						date:helper.thDate(receipt.issue_date), // "30/12/2556",
						date2:'',
						qty:'จำนวน',
						price:'ราคา/หน่วย',
						line_1_1:receipt.items[0] ? receipt.items[0].prod_code : '',
						line_1_2:receipt.items[0] ? receipt.items[0].detail : '',
						line_1_3:receipt.items[0] ? helper.formatNumber(receipt.items[0].qty, 0, 6) : '',
						line_1_4:receipt.items[0] ? helper.formatNumber(receipt.items[0].price, 2, 12) : '',
						line_1_5:receipt.items[0] ? helper.formatNumber(receipt.items[0].amount, 2, 13) : '',
						line_2_1:receipt.items[1] ? receipt.items[1].prod_code : '',
						line_2_2:receipt.items[1] ? receipt.items[1].detail : '',
						line_2_3:receipt.items[1] ? helper.formatNumber(receipt.items[1].qty, 0, 6) : '',
						line_2_4:receipt.items[1] ? helper.formatNumber(receipt.items[1].price, 2, 12) : '',
						line_2_5:receipt.items[1] ? helper.formatNumber(receipt.items[1].amount, 2, 13) : '',
						line_3_1:receipt.items[2] ? receipt.items[2].prod_code : '',
						line_3_2:receipt.items[2] ? receipt.items[2].detail  : '',
						line_3_3:receipt.items[2] ? helper.formatNumber(receipt.items[2].qty, 0, 6) : '',
						line_3_4:receipt.items[2] ? helper.formatNumber(receipt.items[2].price, 2, 12) : '',
						line_3_5:receipt.items[2] ? helper.formatNumber(receipt.items[2].amount, 2, 13) : '',
						line_4_1:receipt.items[3] ? receipt.items[3].prod_code : '',
						line_4_2:receipt.items[3] ? receipt.items[3].detail  : '',
						line_4_3:receipt.items[3] ? helper.formatNumber(receipt.items[3].qty, 0, 6) : '',
						line_4_4:receipt.items[3] ? helper.formatNumber(receipt.items[3].price, 2, 12) : '',
						line_4_5:receipt.items[3] ? helper.formatNumber(receipt.items[3].amount, 2, 13) : '',
						line_5_1:receipt.items[4] ? receipt.items[4].prod_code : '',
						line_5_2:receipt.items[4] ? receipt.items[4].detail : '',
						line_5_3:receipt.items[4] ? helper.formatNumber(receipt.items[4].qty, 0, 6) : '',
						line_5_4:receipt.items[4] ? helper.formatNumber(receipt.items[4].price, 2, 12) : '',
						line_5_5:receipt.items[4] ? helper.formatNumber(receipt.items[4].amount, 2, 13) : '',
						total:helper.formatNumber(receipt.amount, 2, 13),
						vat_rate:helper.formatNumber(receipt.vat_rate, 2),
						vat_amount:helper.formatNumber(receipt.vat_amount, 2, 13),
						grand_total:helper.formatNumber(receipt.total_amount, 2, 13),
						baht_text:'***'+helper.bahtText(receipt.total_amount) + '***',
						remark:remark,
						cash_chk:receipt.cash > 0 ? "X": "",
						cheque_chk:receipt.cheque > 0 ? "X":"",
						cheque1:receipt.cheque_bank,
						cheque2:receipt.cheque_branch,
						cheque_no:receipt.cheque_number,
						cheque_date:receipt.cheque_date != '0000-00-00' ? helper.thDate(receipt.cheque_date) : helper.thDate(receipt.issue_date),
					},
					format: 'ESC',
					printer:$rootScope.setting.printerDot,
					numCopy:numCopy,
				};
				$http.post($rootScope.setting.printServerDot+'/printer/submit', data).then(function(response) {
//				$http.post($rootScope.setting.printServerDot+'/submit', data).then(function(response) {
					console.log('SUBMIT PRINT JOB DONE', response);
					dfd.resolve(true);
				});
				dfd.resolve(true);
			} else {
				toaster.pop('warning', '', result.reason);
				dfd.resolve(false);
			}
		});

		return dfd.promise;
	};

	var doPrintInvoice = function(invoice, numCopy) {
		var dfd = $q.defer();

		var from = helper.thSplit(invoice.mem_code +" "
				+ invoice.name
				+ (invoice.tax_id=='' ? '' : ' TAX#' + invoice.tax_id)
			, 55);
		var addr = helper.thSplit(invoice.branch_name + ' ' + invoice.addr.replace(/\s+/g, ' ')
			, 60);
		if (invoice.mem_code=='000000') {
			from = ['เงินสด',''];
			addr = helper.thSplit(invoice.addr.replace(/\s+/g, ' '), 70);
		}

		var data = {
			uuid: helper.newUUID(),
			report: 'receipt',
			param: {
				from1:from[0],
				from2:from[1]||'',
				// addr1:addr[0],
				// addr2:addr[1]||'',
				addr0:addr.length > 2 ? addr[0] : '' ,
				addr1:addr.length > 2 ? addr[1] : addr[0],
				addr2:addr.length > 2 ? addr[2] : addr[1],
				code:invoice.code,
				date:helper.thDate(invoice.issue_date), // "30/12/2556",
				date2:helper.thDate(invoice.deadline_date),
				qty:'จำนวน',
				price:'ราคา/หน่วย',
				line_1_1:invoice.items[0] ? invoice.items[0].prod_code : '',
				line_1_2:invoice.items[0] ? invoice.items[0].detail : '',
				line_1_3:invoice.items[0] ? helper.formatNumber(invoice.items[0].qty, 0, 6) : '',
				line_1_4:invoice.items[0] ? helper.formatNumber(invoice.items[0].price, 2, 12) : '',
				line_1_5:invoice.items[0] ? helper.formatNumber(invoice.items[0].amount, 2, 13) : '',
				line_2_1:invoice.items[1] ? invoice.items[1].prod_code : '',
				line_2_2:invoice.items[1] ? invoice.items[1].detail : '',
				line_2_3:invoice.items[1] ? helper.formatNumber(invoice.items[1].qty, 0, 6) : '',
				line_2_4:invoice.items[1] ? helper.formatNumber(invoice.items[1].price, 2, 12) : '',
				line_2_5:invoice.items[1] ? helper.formatNumber(invoice.items[1].amount, 2, 13) : '',
				line_3_1:invoice.items[2] ? invoice.items[2].prod_code : '',
				line_3_2:invoice.items[2] ? invoice.items[2].detail : '',
				line_3_3:invoice.items[2] ? helper.formatNumber(invoice.items[2].qty, 0, 6) : '',
				line_3_4:invoice.items[2] ? helper.formatNumber(invoice.items[2].price, 2, 12) : '',
				line_3_5:invoice.items[2] ? helper.formatNumber(invoice.items[2].amount, 2, 13) : '',
				line_4_1:invoice.items[3] ? invoice.items[3].prod_code : '',
				line_4_2:invoice.items[3] ? invoice.items[3].detail : '',
				line_4_3:invoice.items[3] ? helper.formatNumber(invoice.items[3].qty, 0, 6) : '',
				line_4_4:invoice.items[3] ? helper.formatNumber(invoice.items[3].price, 2, 12) : '',
				line_4_5:invoice.items[3] ? helper.formatNumber(invoice.items[3].amount, 2, 13) : '',
				line_5_1:invoice.items[4] ? invoice.items[4].prod_code : '',
				line_5_2:invoice.items[4] ? invoice.items[4].detail : '',
				line_5_3:invoice.items[4] ? helper.formatNumber(invoice.items[4].qty, 0, 6) : '',
				line_5_4:invoice.items[4] ? helper.formatNumber(invoice.items[4].price, 2, 12) : '',
				line_5_5:invoice.items[4] ? helper.formatNumber(invoice.items[4].amount, 2, 13) : '',
				total:helper.formatNumber(invoice.amount, 2, 13),
				vat_rate:helper.formatNumber(invoice.vat_rate, 2),
				vat_amount:helper.formatNumber(invoice.vat_amount, 2, 13),
				grand_total:helper.formatNumber(invoice.total_amount, 2, 13),
				baht_text:'***'+helper.bahtText(invoice.total_amount) + '***',
				remark:invoice.remark,
				cash_chk:"",
				cheque_chk:"",
				cheque1:"",
				cheque2:"",
				cheque_no:"",
				cheque_date:"",
			},
			format: 'ESC',
			printer:$rootScope.setting.printerDot,
			numCopy:numCopy,
		};
		$http.post($rootScope.setting.printServerDot+'/printer/submit', data).then(function(response) {
//		$http.post($rootScope.setting.printServerDot+'/submit', data).then(function(response) {
			console.log('SUBMIT PRINT JOB DONE', response);
			dfd.resolve(true);
		}, function() {
			dfd.reject();
		});

		return dfd.promise;
	}

	this.printInvoiceList = function (codeList, numCopy) {
		var dfd = $q.defer();
		numCopy = parseInt(numCopy);
		numCopy = isNaN(numCopy) ? 1 : numCopy;

		dbSvc.request('invoiceByCodeList', {codeList:codeList}).then(function(result) {
			if (result.status===true) {
				var all = [];
				result.invoices.forEach(function(invoice) {
					all.push(doPrintInvoice(invoice, numCopy));
				});
				$q.all(all).then(function() {
					$q.resolve(true);
				}, function() {
					$q.reject();
				});
			} else {
				toaster.pop('warning', '', result.reason);
				dfd.resolve(false);
			}
		});

		return dfd.promise;
	}

	this.printInvoice = function(code, numCopy) {
		var dfd = $q.defer();
		numCopy = parseInt(numCopy);
		numCopy = isNaN(numCopy) ? 1 : numCopy;

		dbSvc.request('invoiceByCode', {code:code}).then(function(result) {
			if (result.status===true) {
				doPrintInvoice(result.invoice).then(function() {
					$q.resolve();
				}, function() {
					$q.reject();
				});
			} else {
				toaster.pop('warning', '', result.reason);
				dfd.resolve(false);
			}
		});

		return dfd.promise;
	};
	this.printBill = function(billObj, numCopy) {
		var dfd = $q.defer();
		numCopy = parseInt(numCopy);
		numCopy = isNaN(numCopy) ? 1 : numCopy;

		var data = {
			uuid: helper.newUUID(),
			report: 'bill',
			param: billObj,
			format: 'PDF',
			printer:$rootScope.setting.printerLaser,
			numCopy:numCopy,
		};

		$http.post($rootScope.setting.printServerLaser + '/printer/submit', data).then(function(response) {
//		$http.post($rootScope.setting.printServerLaser + '/submit', data).then(function(response) {
			console.log('SUBMIT PRINT JOB DONE', response);
			dfd.resolve(true);
		});
		return dfd.promise;
	}; // printBill
	this.printInform = function(informObj, numCopy) {
		var dfd = $q.defer();
		numCopy = parseInt(numCopy);
		numCopy = isNaN(numCopy) ? 1 : numCopy;
		console.log(informObj);

		var data = {
			uuid: helper.newUUID(),
			report: 'inform',
			param: informObj,
			format: 'PDF',
			printer:$rootScope.setting.printerLaser,
			numCopy:1,
		};
		$http.post($rootScope.setting.printServerLaser + '/printer/submit', data).then(function(response) {
//		$http.post($rootScope.setting.printServerLaser + '/submit', data).then(function(response) {
			console.log('SUBMIT PRINT JOB DONE', response);
			dfd.resolve(true);
		});
		return dfd.promise;
	}; // printBill
}]);

attaApp.service('lovService', ['dbSvc', 'ngDialog', '$q', function(dbSvc, ngDialog, $q) {
	var cache = {};


	this.showLov = function($scope, name, param) {
		var dfd = $q.defer();
		var tmp_data = [];
		var tmp_fields = [];

		var doShowLov = function() {
			$scope.data = tmp_data;
			$scope.fields = tmp_fields;

			ngDialog.open({
				template: 'views/lov.html',
				controller: 'LovDialogCtrl',
				className: 'ngdialog-theme-default ngdialog-theme-lov',
				scope:$scope,
			}).closePromise.then(function(result) {
				if (typeof result.value==='undefined' || result.value==='$closeButton' || result.value==='$document') {
					dfd.resolve(null);
				} else {
					dfd.resolve(result.value);
				}
			});
		};

		if (typeof cache[name]==='undefined'
			|| (typeof param !== 'undefined' && param.cache===false)
			) {
			if (typeof param==='undefined' || param===null) {
				param = {};
			}
			param.lov = name;
			dbSvc.request('lov', param).then(function(result) {
				if (result.status===true) {
					if (param.cache!==false) {
						cache[name] = {
							data: result.data,
							fields: result.fields,
						}
					}
					tmp_data = result.data;
					tmp_fields = result.fields;
					doShowLov();
				} else {
					dfd.reject();
				}
			}, function(result) {
				dfd.reject();
			});
		} else {
			tmp_data = cache[name].data;
			tmp_fields = cache[name].fields;
			doShowLov();
		}
		return dfd.promise;
	};
}]);

attaApp.directive('myCurrentTime', ['$interval', 'dateFilter', function($interval, dateFilter) {
	function link(scope, element, attrs) {
		var format,
			timeoutId;

		function updateTime() {
			element.text(dateFilter(new Date(), format).toUpperCase());
		}

		scope.$watch(attrs.myCurrentTime, function(value) {
			format = value;
			updateTime();
		});

		element.on('$destroy', function() {
			$interval.cancel(timeoutId);
		});

		// start the UI update process; save the timeoutId for canceling
		timeoutId = $interval(function() {
			updateTime(); // update DOM
		}, 1000);
	}

	return {
		link: link
	};
}]);
attaApp.filter('checkedItems', function() {
	return function(items, showComplete) {
		var resultArr = [];
		angular.forEach(items, function(item) {
			if (item.done == false || showComplete == true) {
				resultArr.push(item);
			}
		});
		return resultArr;
	}
});
attaApp.filter('toDate', function() {
	return function(s) {
		//console.log(s.substr(0, 10)+' '+s.substr(11));
		return new Date(s.substr(0, 10)+' '+s.substr(11));
	};
});

attaApp.filter('startFrom', function() {
  return function(input, start) {
    start = +start; //parse to int
    return input.slice(start);
  }
});

attaApp.filter('propsFilter', function() {
  return function(items, props) {
    var out = [];

    if (angular.isArray(items)) {
      items.forEach(function(item) {
        var itemMatches = false;

        var keys = Object.keys(props);

        for (var i = 0; i < keys.length; i++) {
          var prop = keys[i];
          var text = props[prop].toLowerCase();
		  if (text=='') {
			continue;
		  }
          if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
            itemMatches = true;
            break;
          }
        }

        if (itemMatches) {
          out.push(item);
        }
      });
    } else {
      // Let the output be the input untouched
      out = items;
    }

    return out;
  }
});

attaApp.controller('LoadingCtrl', ['$scope', '$rootScope', '$state', '$http', 'sysConfig', 'helper', 'toaster', 'ddnsService',
		function($scope, $rootScope, $state, $http, sysConfig, helper, toaster, ddnsService) {
	console.log('loading...');
    // console.log('test num = ',helper.formatNumber('333333', 0, 6));

	$scope.msg = 'กรุณารอสักครู่';
	$scope.terminal = {
		uuid:'',
		code:'',
		airport:'',
		locked:false,
		sync:true,
	}

	var setting = {};
	var isNotFound = true;

	var setSetting = function(){
		setting.WS_URL = 'http://122.155.3.216/rapidpass/client/api3.php';
		setting.RS_URL = 'http://122.155.3.216/rapidpass/client/report.php';
		setting.WS_LOCAL_URL = 'http://localhost/rapidpass/client/api3.php';
		setting.RS_LOCAL_URL = 'http://localhost/rapidpass/client/report.php';
		//setting.code='01NS';
		
		console.log('SETTING=', setting);
		chrome.storage.local.set({setting:setting});
		$rootScope.setting = angular.copy(setting);
		console.log("$rootScope.setting = ",$rootScope.setting);
		$scope.$apply(function() {
			$scope.terminal.uuid = setting.uuid;
			$scope.terminal.code = setting.code;
			$scope.terminal.airport = setting.airport;
			$scope.terminal.locked = setting.locked;
			$scope.terminal.sync = setting.sync;
		});
		$rootScope.setting = angular.copy(setting);
		if ($rootScope.setting.useDDNS===true) {
			ddnsService.start();
		}
		$state.go('signin');
		console.log('start go');
	};

	chrome.storage.local.get('setting', function(result) {
		setting = result.setting;
		isNotFound = false;

		if (typeof setting === 'undefined') {
			isNotFound = true;
			setting = {
				uuid:'',
				code:'01NS',
				airport:'DMK',
				locked:false,
				sync:true,
				remember:true,
				rememberStaff:'',
				playAudio:false,
				playAlarm:true,
				isReceipt:false,
				startReceipt:'',
				codePrefix:'DM01',
				printerDot:'LQ 310',
				printerLaser:'HP Deskjet 123',
				printServerDot:'http://localhost:9001',
				printServerLaser:'http://localhost:9001',
			};
		}
		if (typeof setting.remember === 'undefined') {
			setting.remember = true;
			setting.rememberStaff = '';
			setting.playAudio = false;
		}
		if (typeof setting.isReceipt === 'undefined') {
			setting.isReceipt = false;
			setting.startReceipt = '';
			setting.codePrefix = 'DM01';
		}
		if (typeof setting.playAlarm === 'undefined') {
			setting.playAlarm = true;
		}
		if (typeof setting.WS_URL === 'undefined') {
			setting.WS_URL = 'http://122.155.3.216/rapidpass/client/api.php';
			setting.RS_URL = 'http://122.155.3.216/rapidpass/client/report.php';
			setting.WS_LOCAL_URL = 'http://localhost/rapidpass/client/api.php';
			setting.RS_LOCAL_URL = 'http://localhost/rapidpass/client/report.php';
		}
		if (typeof setting.DDNS === 'undefined') {
			setting.webService = {};
			setting.reportService = {};
			setting.lastIP = '192.168.1.1';
			setting.useDDNS = false;
			setting.DDNS = 'http://122.155.3.254/getip.php?id=ATTA-BKK';
		}

		if (typeof setting.RFID_URL === 'undefined') {
			setting.RFID_URL = 'http://localhost:9001';
			setting.RFID_READER = '';
		}

		if (typeof setting.printInform === 'undefined') {
			setting.printInform = 'NO';
		}
		if (typeof setting.playAlarm === 'undefined') {
			setting.isOffline = false;
		}
		if (typeof setting.CLOUD_URL === 'undefined') {
			setting.CLOUD_URL = 'http://122.155.3.216/rapidpass/client/api.php';
		}
		setting.CLOUD_URL = 'http://122.155.3.216/rapidpass/client/api.php';

		if(setting.airport == 'BKK'){
			$.ajax({
				url:'http://122.155.3.216/rapidpass/client/check_bkk.php',
				data:{},
				type:'post',
				dataType:'json',
				success: function(res){
					console.log("test = ", res);
					if(res.status===true){
						var dataServer = res.data; console.log("data dot server = ", dataServer);
						if(dataServer.server == "DMK") {
							console.log("Sever = DMK");
							setting.WS_URL = dataServer.cloud_ip;
							setting.RS_URL = dataServer.cloud_rp;
							setting.WS_LOCAL_URL = 'http://localhost/rapidpass/client/api.php';
							setting.RS_LOCAL_URL = 'http://localhost/rapidpass/client/report.php';
						}else{
							console.log("Sever = BKK");
							setting.WS_URL = dataServer.bkk_ip;
							setting.RS_URL = dataServer.bkk_rp;
							setting.WS_LOCAL_URL = 'http://localhost/rapidpass/client/api.php';
							setting.RS_LOCAL_URL = 'http://localhost/rapidpass/client/report.php';
						}
					} else {
						console.log("status false");
						setting.WS_URL = 'http://192.168.171.254/rapidpass/client/api.php';
						setting.RS_URL = 'http://192.168.171.254/rapidpass/client/report.php';
						setting.WS_LOCAL_URL = 'http://localhost/rapidpass/client/api.php';
						setting.RS_LOCAL_URL = 'http://localhost/rapidpass/client/report.php';
					}
					setSetting();
				},
				error: function(){
					console.log("Can't go to api");
					setting.WS_URL = 'http://192.168.171.254/rapidpass/client/api.php';
					setting.RS_URL = 'http://192.168.171.254/rapidpass/client/report.php';
					setting.WS_LOCAL_URL = 'http://localhost/rapidpass/client/api.php';
					setting.RS_LOCAL_URL = 'http://localhost/rapidpass/client/report.php';
					setSetting();
				},

			});

		}else{
			console.log("is not BKK");
			setting.WS_URL = 'http://122.155.3.216/rapidpass/client/api.php';
			setting.RS_URL = 'http://122.155.3.216/rapidpass/client/report.php';
			setting.WS_LOCAL_URL = 'http://localhost/rapidpass/client/api.php';
			setting.RS_LOCAL_URL = 'http://localhost/rapidpass/client/report.php';
			setSetting();
		}
	});

	$scope.goToSetting = function() {
		$state.go('home.setting');
	}
}]);

attaApp.controller('SignInCtrl', ['$scope', '$rootScope', 'dbSvc', '$state', '$http', 'sysConfig', 'toaster', '$q', 'helper',
		function($scope, $rootScope, dbSvc, $state, $http, sysConfig, toaster, $q, helper) {
	$scope.user = '';
	$scope.version = chrome.runtime.getManifest().version;
	$scope.remember = $rootScope.setting.remember;
	$scope.user = $rootScope.setting.rememberStaff;
	$scope.offline = false;

	var doSignIn = function(apiUrl) {
		var param = {
			user: $scope.user,
			pass: helper.md5(ATTA_KEY + $scope.pass),
			code: $rootScope.setting.code,
		}

		dbSvc.request('signIn', param, apiUrl).then(function(result) {

			if (result.status===false) {
				var msg = {
					'ERR_STATION_NOT_FOUND':'ไม่พบรหัสที่ทำการ',
					'ERR_USER_NOT_FOUND':'ไม่พบชื่อผู้ใช้',
					'ERR_USER_WAS_DISABLED':'ถูกระงับการใช้งานชั่วคราว',
					'ERR_PASS_INCORRECT':'รหัสผ่านไม่ถูกต้อง',
				}

				toaster.pop('warning', '', msg[result.reason]);

				if (result.reason=='ERR_PASS_INCORRECT') {

					setTimeout(function() {
						angular.element('#pass').focus().select();
					}, 0);

				} else {

					setTimeout(function() {
						angular.element('#user').focus().select();
					}, 0);

				}
			} else if (result.status===true) {
				// 1. SAVE rootScope
				$rootScope.sessionStaff = angular.copy(result.staff);
				$rootScope.period = angular.copy(result.period);
				$rootScope.station = angular.copy(result.station);

				// 2. SAVE localStorage
				$rootScope.setting.remember = $scope.remember;
				$rootScope.setting.rememberStaff = $scope.remember ? $scope.user : '';
				$rootScope.setting.otp = $rootScope.station.otp;
				// console.log('OTP=' + $rootScope.setting.otp);
				chrome.storage.local.set({setting:$rootScope.setting});

				$state.go('home.welcome');
			} else {
				toaster.pop('warning', '', 'ERROR');
			}
		}, function() {
			toaster.pop('warning', 'ไม่สามารถติดต่อ Web Service ได้');
			toaster.pop('warning', 'พยายามเข้าสู่ระบบผ่าน Cloud แทน กรุณารอสักครู่');
			doSignIn($rootScope.setting.CLOUD_URL);
		});
	}

	var doOffline = function() {
		$rootScope.setting.isOffline=true;
		doSignIn();
	}

	$scope.signIn = function() {
		if ($scope.offline==false) {
			doSignIn();
			return;
		}
		if ($scope.otp != $rootScope.setting.otp) {
			toaster.pop('warning', '', 'รหัส OTP สำหรับ Offline ไม่ถูกต้อง');
			return;
		}
		doOffline();
	}

	setTimeout(function() {
		if ($scope.user=='') {
			angular.element('#user').focus();
		} else {
			angular.element('#pass').focus();
		}
	})

}]);
attaApp.controller('ControlPanelCtrl', ['$scope', '$rootScope', 'dbSvc',
		'$state', 'sysConfig', 'ngDialog', 'toaster', '$http', 'helper', '$q', '$filter',
		'dbService',
		function($scope, $rootScope, dbSvc,
			$state, sysConfig, ngDialog, toaster, $http, helper, $q, $filter,
			dbService) {
	var db;
	$scope.pageSize = 10;
	$scope.currentTab = 2;
	$scope.objectStoreList = [];
	$scope.objectStore = '';
	$scope.columnList = [];
	$scope.data = [];
	$scope.printers = [];
	$scope.printer = {};
	$scope.myTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
	$scope.switchTab = function(tab) {
		$scope.currentTab = tab;
	}

	// getPrinter
	$http.get('http://localhost:3000/printers').then(function(response){
		var printers = response.data;
		if (!(printers instanceof Array)) {
			return;
		}
		var len = printers.length;
		for (var i = 0; i < len; i++) {
			$scope.printers.push(printers[i]);
		}
	});

	$scope.doSaveSync = function() {
		chrome.storage.local.set({setting:$rootScope.setting});
	}

	/*
	$scope.doSync = function() {
		if (!$scope.objectStore || $scope.objectStore=='') {
			toaster.pop('warning', 'WARNING', 'NO TABLE WAS SELECTED');
			return;
		}
		var requestUrl = sysConfig.API_URL+'?act=sync&uuid='+$rootScope.setting.uuid;
		$http.post(requestUrl, {force:[$scope.objectStore]}).then(function(response) {
			console.log('all data=', response.data);
			if (!response.data.status) {
				return;
			}
			dbSvc.updateDataFromServer(response.data.data).then(function() {
				toaster.pop('success', 'SUCCESS', 'FORCE SYNC DONE');
			});
		});
	}
	*/
	$scope.doClear = function() {
		dbSvc.clearTable($scope.objectStore);
	}
	$scope.doPrint = function() {
		var data = {
			uuid: helper.newUUID(),
			report: 'bill',
			param: {
				bill:{
					code:'AR13110001',
					memCode:'03069',
					name:'บริษัท รักสยาม พรอพเพอร์ตี้ แอนด์ดีเวลลอปเม้นท์ 2004 จำกัด',
					addr:'สำนักงานใหญ่ เลขที่ 54/7 หมู่ที่ 4 ถนนแจ้งวัฒนะ แขวงทุ่งสองห้อง เขตหลักสี่ กรุงเทพมหานคร 10210',
					issueDate:'30/12/2556',
					dueDate:'',
					bahtText:'สามร้อยบาทถ้วน',
					amount:'300.00',
					vatRate:'7',
					vatAmount:'-&nbsp;',
					totalAmount:'300.00',
					remark:'กรุณาชำระค่าสมาชิกปี 2557 ภายในวันที่ 30 มกราคม 2557',
					issueBy:'สมศักดิ์ แซ่ลิ้ม',
					items:[
						{no:'1',detail:'ค่าบริการ',unitPrice:'15.00',qty:'20',unit:'PAX',amount:'30.00'},
						{no:'',detail:'',unitPrice:'',qty:'',unit:'',amount:''},
						{no:'',detail:'',unitPrice:'',qty:'',unit:'',amount:''},
						{no:'',detail:'',unitPrice:'',qty:'',unit:'',amount:''},
						{no:'',detail:'',unitPrice:'',qty:'',unit:'',amount:''},
					],
					copy:[
						{th:'ต้นฉบับ',en:'ORIGINAL'},
						{th:'สำเนา',en:'COPY'},
					],
				}
			},
			format: 'PDF',
			printer:$scope.printer.name,
			numCopy:1,
		};
		$http.post('http://localhost:3000/printer/submit', data).then(function(response) {
//		$http.post('http://localhost:3000/submit', data).then(function(response) {
			console.log(response);
		});
	}
	$scope.doPrintEsc = function() {
		var from = helper.thSplit('บริษัท ซิลเวอร์ คอนเซ็ปท์ อินเตอร์เนชั่นแนล เทรดดิ้ง (ประเทศไทย) จำกัด ID#04262 TAX#0105554041352', 65);
		var addr = helper.thSplit('สำนักงานใหญ่ เลขที่ 54/7 หมู่ที่ 4 ถนนแจ้งวัฒนะ แขวงทุ่งสองห้อง เขตหลักสี่ กรุงเทพมหานคร 10210', 70);
		var data = {
			uuid: helper.newUUID(),
			report: 'receipt',
			param: {
				from1:from[0],
				from2:from[1]||'',
				addr1:addr[0],
				addr2:addr[1]||'',
				code:"AR13110001",
				date:"30/12/2556",
				date2:"01/02/2557",
				line_1_1:"MEM57",
				line_1_2:"ค่าสมาชิกปี 2557",
				line_1_3:"    10,000.00",
				line_2_1:"12345678",
				line_2_2:"1234567890123456789012345678901234567890",
				line_2_3:"12,345,678.00",
/*				line_3_1:"ดูดีที่สุด",
				line_3_2:"ดูดีที่สุด",
				line_3_3:"ดูดีที่สุด",
				line_4_1:"ดูดีที่สุด",
				line_4_2:"ดูดีที่สุด",
				line_4_3:"ดูดีที่สุด",
				line_5_1:"ดูดีที่สุด",
				line_5_2:"ดูดีที่สุด",
				line_5_3:"ดูดีที่สุด",*/
				total:"    10,000.00",
				vat_rate:"7",
				vat_amount:"       700.00",
				grand_total:"    10,700.00",
				baht_text:"*หนึ่งหมื่นเจ็ดร้อยบาทถ้วน*",
				remark:"กรุณาชำระค่าสมาชิกปี 2557 ภายในวันที่ 30 มกราคม 2557",
//				cash_chk:"",
				cheque_chk:"X",
				cheque1:"กสิกรไทย",
				cheque2:"สำนักพหลโยธิน",
				cheque_no:"1234567890",
				cheque_date:"12/25/2557",
			},
			format: 'ESC',
			printer:$scope.printer.name,
			numCopy:1,
		};
		$http.post('http://localhost:3000/submit', data).then(function(response) {
			console.log(response);
		});
	}
	$scope.doPrint2 = function() {
//		var docDefinition = { content: 'This is an sample PDF printed with pdfMake' };
//		pdfMake.createPdf(docDefinition).print();
//		pdfMake.createPdf(docDefinition).open();
		var ESC = String.fromCharCode(27);
		var LF = String.fromCharCode(10);
		var CR = String.fromCharCode(13);
		var FF = String.fromCharCode(12);
		var line = '         1         2         3         4         5         6         7         8         9         0         1         2         3' + LF;
		var text = '012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456' + LF
			+ '0' + line;
		var data = ESC + '@'
			+ ESC + 'P'  // 10 cpi
//			+ ESC + 'l' + String.fromCharCode(10) // LEFT MARGIN  10 char = 10char/10cpi = 1 inch
//			+ ESC + 'Q' + String.fromCharCode(75) // RIGH MARGIN  75 char
			+ ESC + '2'		// PAGE LENGTH = 1/6 inch
			+ ESC + 'C' + String.fromCharCode(33) // 33 line = 33*1/6 = 5.5in;
			+ ESC + 'x0' // draft quality
			+ text
//			+ ESC + 'M' // 12 cpi
//			+ text
			;
		for (var i = 2; i <= 25; i++) {
			data += (i%10) + line;
		}
		data += 'ภาษาไทย' + LF;
		data += FF;

		data = ESC + '@'
			+ ESC + 'P'  // 10 cpi
			+ ESC + '2'		// PAGE LENGTH = 1/6 inch
			+ ESC + 'C' + String.fromCharCode(33) // 33 line = 33*1/6 = 5.5in;
			+ helper.toTIS620('กขคง');
		console.log('data=', data);

		$http.post('http://localhost:3000/print', {data:data, printer:$scope.printer.name, type:$scope.printer.datatype}).then(function(response) {
			console.log(response.data);
		});
	}
	$scope.showData = function(data) {
		$scope.message = data;
		$scope.positiveButton = 'ปิด';
		ngDialog.open({
				template: 'views/msgBox.html',
				controller: 'ConfirmDialogCtrl',
				className: 'ngdialog-theme-default ngdialog-theme-custom',
				scope:$scope,
		});
	}
	$scope.change = function() {
		if (!$scope.objectStore || $scope.objectStore=='') {
			return;
		}
		dbSvc.getTable($scope.objectStore).then(function(data) {
			console.log('data=',data);
			$scope.currentPage = 0;
			$scope.columnList = [];
			$scope.data = data;
			if (data.length == 0) {
				return;
			}
			for(var key in data[0]) {
				$scope.columnList.push(key);
			}
			$scope.data = angular.copy(data);
		});
	}

	var req = indexedDB.open('rapidcard', DB_VERSION);
	req.onsuccess = function(e) {
		db = e.target.result;
		$scope.$apply(function(){
			for(var i = 0; i < db.objectStoreNames.length; i++) {
				$scope.objectStoreList.push({key:db.objectStoreNames[i],name:db.objectStoreNames[i]});
			}
		});
	};

	$scope.togglePlay = function() {
		$rootScope.callBus = !$rootScope.callBus;
	}
	$scope.addNumber = function() {
		dbSvc.saveData('callqueue', {
			uuid:helper.newUUID(),
			ref_uuid:'',
			staff_uuid:'',
			license:$scope.number,
			call_num:1,
			queue_date:$filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss'),
			call_date:'',
			status:0,
		});
	}
	$scope.query = function() {
		dbService.query('SELECT * FROM table');
	}
}]);
attaApp.controller('HomeCtrl', ['$scope', '$rootScope', 'dbSvc', '$state', '$q', '$filter', 'helper',
		function($scope, $rootScope, dbSvc, $state, $q, $filter, helper) {
	$scope.acl = {};
	$scope.acl.card = true;
	$scope.curSubmenu = '';
	$scope.showSubmenu = false;
	$scope.dateFormat = 'dd MMM yyyy HH:mm';
	$rootScope.txtPeriod = $rootScope.period.code + ': ' + $rootScope.period.p_date;
	$rootScope.txtMode = ($rootScope.setting.isOffline ? '[OFFLINE MODE]': '');
	$rootScope.txtUser = $rootScope.sessionStaff.fullname + ' - ' + $rootScope.setting.code
		+ ' - '+($rootScope.period.p_type=='AM'?'ผลัดกลางวัน': ($rootScope.period.p_type=='PM' ? 'ผลัดกลางคืน' : $rootScope.period.p_date.substr(0,10)));
	$rootScope.period.prefix = $rootScope.setting.codePrefix + '-'
			+ $rootScope.period.p_date.substr(2,2)
			+ $rootScope.period.p_date.substr(5,2)
			+ $rootScope.period.p_date.substr(8,2)
			+ ($rootScope.period.p_type=='AM'?'M':($rootScope.period.p_type=='PM' ? 'N' : 'D'))
			+ '-';
	$rootScope.infoMsg = '';
	$scope.hasUpdate = false;
	$scope.version = chrome.runtime.getManifest().version;
	$scope.updateProgram = function() {
		chrome.runtime.reload();
	}
	$rootScope.showMsg = function(msg, timeout) {
		$rootScope.infoMsg = msg;
		setTimeout(function(){$rootScope.infoMsg='';}, timeout);
	}
	var lastMenu = '';
	$scope.mainmenu = [
		{code:'card',title:'บัตร',submenu:[
			{code:'card_use',title:'ชำระเงิน',sref:'home.card_use',acl:'card_user'},
			{code:'card_issue',title:'ออกบัตร',sref:'home.card_issue',acl:'card_issue',receipt:true},
			{code:'card_topup',title:'เติมเงิน',sref:'home.card_topup',acl:'card_topup',receipt:true},
			{code:'card_adjust_plus',title:'แก้ไขPAX(เพิ่ม)',sref:'home.card_adjust',param:{type:'PLUS'},acl:'card_adjust_plus'},
			{code:'card_adjust_minus',title:'แก้ไขPAX(ลด)',sref:'home.card_adjust',param:{type:'MINUS'},acl:'card_adjust_minus'},
			{code:'card_history',title:'ประวัติบัตร',sref:'home.card_history',acl:'card_history'},
			{code:'card_cancel',title:'ยกเลิกบัตร',sref:'home.card_cancel',acl:'card_cancel'},
			{code:'card_coupon',title:'ใช้คูปอง',sref:'home.card_coupon',acl:'card_coupon'},
			{code:'period_close',title:'ปิดผลัด',sref:'home.period_close',acl:'period_close_inform'},
			{code:'inform_list',title:'ใบรับแจ้ง',sref:'home.inform_list',acl:'inform_list'},
			{code:'inform_onestop',title:'รับแจ้ง OneStop',sref:'home.inform_onestop',acl:'inform_onestop',receipt:true},
			{code:'receipt',title:'ใบเสร็จรับเงิน',sref:'home.receipt_new',acl:'receipt_new',receipt:true},
		]},
		{code:'bus',title:'รถ',submenu:[
			{code:'checkin',title:'เช็คอินรถ',sref:'home.checkin',acl:'checkin'},
			{code:'buscall',title:'เรียกรถ',sref:'home.buscall_office',param:{location:'OFFICE'},acl:'buscall'},
			{code:'buscall',title:'ลานจอด',sref:'home.buscall',param:{location:'PARKING'},acl:'parking'},
		]},
		{code:'finance',title:'บัญชี/การเงิน',submenu:[
			{code:'invoice',title:'ใบแจ้งหนี้',sref:'home.invoice',acl:'invoice'},
			{code:'invoice',title:'แก้ไขใบแจ้งหนี้',sref:'home.re_invoice',acl:'re_invoice'},
			{code:'invoice',title:'พิมพ์ใบแจ้งหนี้',sref:'home.re_print_invoice',acl:'re_print_invoice'},
			{code:'receipt',title:'ใบเสร็จรับเงิน',sref:'home.receipt_new',acl:'receipt',receipt:true},
			{code:'product',title:'สินค้า',sref:'home.product',acl:'product',receipt:true},
			{code:'accounting_post',title:'โพสต์บัญชี',sref:'home.accounting_post',acl:'accounting_post',receipt:true},
			{code:'period_close',title:'ปิดผลัด',sref:'home.period_close',acl:'period_close',receipt:true},
		]},
		{code:'report',title:'รายงาน',submenu:[
			{code:'member_report',title:'สมาชิก',sref:'home.member_report',acl:'member_report'},
			{code:'accounting_report',title:'การเงิน',sref:'home.accounting_report',acl:'accounting_report'},
			{code:'stat_report',title:'สถิติ',sref:'home.statistic_report',acl:'statistic_report'},
		]},
		{code:'setting',title:'ตั้งค่า',submenu:[
			{code:'config',title:'ข้อมูลพื้นฐาน', sref:'home.config',acl:'config'},
			{code:'staff',title:'จัดการผู้ใช้งาน', sref:'home.staff',acl:'staff'},
			{code:'config',title:'จัดการเซิร์ฟเวอร์', sref:'home.server_setting',acl:'serversetting'},
		]},
	];
	if ($rootScope.setting.isOffline===true) {
		$scope.mainmenu.push({code:'setting',title:'ตั้งค่า',submenu:[
			{code:'config',title:'ข้อมูลพื้นฐาน', sref:'home.config'},
			{code:'staff',title:'จัดการผู้ใช้งาน', sref:'home.staff',acl:'staff'},
			{code:'online',title:'ออนไลน์', sref:'home.online'},
		]});
	} else {
		$scope.mainmenu.push({code:'setting',title:'ตั้งค่า',submenu:[
			{code:'config',title:'ข้อมูลพื้นฐาน', sref:'home.config',acl:'config'},
			{code:'staff',title:'จัดการผู้ใช้งาน', sref:'home.staff',acl:'staff'},
			{code:'config',title:'จัดการเซิร์ฟเวอร์', sref:'home.server_setting',acl:'serversetting'},
		]});
	}
	////////////////////////////////////////////
	// calculate ACL
	///////////////////////////////////////////
	$scope.mainmenu.forEach(function(mainmenu, i) {
		mainmenu.submenu.forEach(function(submenu, j) {
			if (typeof submenu.acl === 'undefined') {
				$scope.mainmenu[i].submenu[j].ok = true;
				return;
			}
//			console.log($rootScope.sessionStaff);
			$scope.mainmenu[i].submenu[j].ok = ($rootScope.sessionStaff.is_admin==='YES' || $rootScope.sessionStaff.acl.indexOf(submenu.acl) >= 0)
					&& (typeof submenu.receipt=='undefined' || $rootScope.setting.isReceipt===true);
		});
	})
	//console.log($rootScope.sessionStaff);
	$scope.menuInform = $rootScope.sessionStaff.is_admin==='YES' || $rootScope.sessionStaff.acl.indexOf('inform') >= 0;
	$scope.menuMember = $rootScope.sessionStaff.is_admin==='YES' || $rootScope.sessionStaff.acl.indexOf('member') >= 0;
	$scope.menuFreelance = $rootScope.sessionStaff.is_admin==='YES' || $rootScope.sessionStaff.acl.indexOf('freelance') >= 0;


	$rootScope.config = {
		id:1,
		card_price:50,
		coupon_price:15,
		vat_rate:7,
	};
	// dbSvc.getByKey('config', 1).then(function(result) {
	// 	$rootScope.config = result;
	// });



	var confirmToExit = function() {
		var dfd = $q.defer();
		if (typeof $rootScope.confirmToExit != 'undefined') {
			$rootScope.confirmToExit().then(function(result) {
				dfd.resolve(result);
			});
		} else {
			dfd.resolve(true);
		}
		return dfd.promise;
	}

	$scope.pageTitle = new Date();

	$scope.homeClick = function() {
		$scope.showSubmenu = false;
		$scope.lastMenu = lastMenu;
	}


	$scope.checkAcl = function(acl) {
		return
	}

	$scope.menuClick = function(menu, evt) {
		lastMenu = $scope.curSubmenu;
		$scope.curSubmenu = menu;
		$scope.showSubmenu = true;
		evt.stopPropagation();
		evt.preventDefault();
	};

	$scope.shouldShowSubmenu = function(menu) {
		return $scope.curSubmenu == menu && $scope.showSubmenu == true;
	}

	$scope.menuClass = function(menu) {
		return $scope.curSubmenu==menu ? 'active':'';
	};

	$scope.gotoMenu = function(menu, submenu) {
		confirmToExit().then(function(result) {
			if (!result) {
				$scope.curSubmenu = lastMenu;
				return;
			}
			$rootScope.confirmToExit = undefined;
			setTimeout(function() {
				if (submenu.sref) {
					console.log('go to ', submenu.sref, submenu.param);
					$state.go(submenu.sref, submenu.param);
				} else if (submenu.link) {
					window.location.href=submenu.link;
				}
			}, 0);
		});
	};
	$scope.gotoMember = function() {
		$scope.gotoMenu('', {sref:'home.member'});
	}
	$scope.gotoFreelance = function() {
		confirmToExit().then(function(result){
			if (!result) {
				$scope.curSubmenu = lastMenu;
				return;
			}
			setTimeout(function() {
				$state.go('home.freelance');
			}, 0);
		});
	}
	$scope.signout = function() {
		confirmToExit().then(function(result) {
			if (!result) {
				$scope.curSubmenu = lastMenu;
				return;
			}
			$rootScope.confirmToExit = undefined;
//			$http.get(sysConfig.API_URL + '?act=signout&')
			chrome.runtime.reload();
		});
	}
	var list = [];
	var airport = 'DMK';
	var range = IDBKeyRange.only([airport, '0000-00-00 00:00:00']);
	var lastCall = null;
	var playTimer = null;
	var isPlaying = false;

	setInterval(function() {
			dbSvc.request('ping', {hash:Math.random()}).then(function(result) {});
	}, 60*1000);
	//////////////////////////////////////////////////////////////
	// PRE-LOAD MEMBER LOV

	$rootScope.lovCache = {};

	//////////////////////////////////////////////////////////////
	$scope.playAudio = function() {
		if ($rootScope.setting.playAudio !== true) {
			setTimeout($scope.playAudio, 100);
			return;
		}
		dbSvc.request('callqueueNext', {}).then(function(result) {
			if (result.status===true && result.callqueue !== false) {
				setTimeout(function() {
					playAudio(result.callqueue).then(function() {
						setTimeout($scope.playAudio, 1000);
					});
				}, 0);
			} else {
				setTimeout($scope.playAudio, 2000);
			}
		});
	}

	var playAudio = function(item) {
		//console.log('item=', item);
		var dfd = $q.defer();
		var number = item.license.replace(/[^0-9\-]/g, '');
		var len = number.length;
		var audioList = [];
		//audioList.push('audio/number.ogg');
		for (var i = 0; i < len; i++) {
			if (number.substr(i, 1)=='-') {
				audioList.push('audio/dash.ogg');
			} else {
				audioList.push('audio/' + number.substr(i, 1) + '.ogg');
			}
		}
		//audioList.push('audio/start.ogg');
		console.log(audioList);
		var pos = 0;
		var audio = angular.element('#audio1').get(0);
		//console.log(audio);
		audio.addEventListener('canplaythrough', function() {
			audio.play();
			pos++;
		});
		audio.addEventListener('ended', function() {
			if (pos < audioList.length) {
				audio.src = audioList[pos];
				audio.load();
			} else {
				dfd.resolve(item);
			}
		});
		audio.src = audioList[pos];
		audio.load();
		return dfd.promise;
	}
	$scope.playAudio();
}]);
attaApp.controller('ConfirmDialogCtrl', function($scope) {
	if (typeof $scope.message == 'undefined') {
		$scope.message = 'ยืนยัน';
	}
	if (typeof $scope.positiveButton == 'undefined') {
		$scope.positiveButton = 'ใช่';
	}
	if (typeof $scope.negativeButton == 'undefined') {
		$scope.negativeButton = 'ไม่ใช่';
	}
	$scope.positiveFeedback = function() {
		if (typeof $scope.positiveResponse == 'function') {
			$scope.positiveResponse();
		}
		$scope.closeThisDialog();
	}
	$scope.negativeFeedback = function() {
		if (typeof $scope.negativeResponse == 'function') {
			$scope.negativeResponse();
		}
		$scope.closeThisDialog();
	}
});

attaApp.controller('LovDialogCtrl', ['$scope', 'dbSvc', function($scope, dbSvc) {
	$scope.filtered = [];
	$scope.displayFields = [];
	$scope.selectedIndex = -1;
	$scope.limit = 100;

	var top=0;
	var bottom=14;

	$scope.fields.forEach(function(item) {
		if (item.hidden===true) {
			return;
		}
		$scope.displayFields.push(item);
	});
	$scope.startsWith = function (text, keyword) {
		var lowerStr = (text + "").toLowerCase();
		return lowerStr.indexOf(keyword.toLowerCase()) === 0;
	}

	$scope.doKeyDown = function($event) {
		var keyCode = $event.keyCode;
		var needScroll = false;

		if (keyCode==40) {// KEY_DOWN
			if ($scope.selectedIndex==-1) {
				$scope.selectedIndex = 0;
			} else if($scope.selectedIndex < $scope.limit-1) {
				$scope.selectedIndex++;
			}
			if ($scope.selectedIndex > bottom) {
				bottom = $scope.selectedIndex;
				top = bottom-14;
				needScroll = true;
			} else if ($scope.selectedIndex < top) {
				top = $scope.selectedIndex;
				bottom = top+14;
				needScroll = true;
			}
		} else if (keyCode==38) {//KEY_UP
			if ($scope.selectedIndex==-1) {
				$scope.selectedIndex = 0;
			} else if($scope.selectedIndex > 0) {
				$scope.selectedIndex--;
			}
			if ($scope.selectedIndex > bottom) {
				bottom = $scope.selectedIndex;
				top = bottom-14;
				needScroll = true;
			} else if ($scope.selectedIndex < top) {
				top = $scope.selectedIndex;
				bottom = top+14;
				needScroll = true;
			}
		} else if (keyCode==13) { // enter
			if ($scope.selectedIndex==-1) {
				$scope.closeThisDialog(null);
			} else {
				$scope.closeThisDialog($scope.filtered[$scope.selectedIndex]);
			}

		}

		if (needScroll) {
			$('.wrapper').animate({
			    scrollTop: $scope.selectedIndex > 14 ? 26*($scope.selectedIndex-14) : 0,
			},20);
		}
	}

	$scope.rowClick = function(item, i, isDone) {
		$scope.selectedIndex = i;
		if (isDone===true) {
			$scope.closeThisDialog($scope.filtered[$scope.selectedIndex]);
		}
	}

	var processData = function(result) {
		result.forEach(function(item) {
			var obj = {};
			$scope.fields.forEach(function(fld) {
				obj[fld.name] = item[fld.name];
			});
			$scope.items.push(obj);
		});
		if ($scope.items.length > 0) {
			$scope.selectedIndex=0;
		}
	}

	if ($scope.lovQuery != null) {
		$scope.items = [];

		dbSvc.request("query", {sql:$scope.lovQuery}).then(function(result) {
			if (result.status===true) {
				$scope.items = result.data;
				if ($scope.items.length > 0) {
					$scope.selectedIndex=0;
				}
			}
		});
	}

	if (typeof $scope.data == 'object' && $scope.data != null && $scope.data.length > 0) {
		$scope.items = $scope.data;
		if ($scope.items.length > 0) {
			$scope.selectedIndex=0;
		}
	}

  	setTimeout(function() {
		var $table = $('.table-list.scroll');
		$table.floatThead({
			scrollContainer: function($table){
				return $table.closest('.wrapper');
			},
			headerCellSelector:'tr.header>th:visible',
		});
		$table.floatThead('reflow');
		setTimeout(function() {
		    angular.element('#lov-keyword').focus().select();
		}, 0);
	},10);
}]);
