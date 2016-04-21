var app = angular.module('app', ['ngRoute']);
app.run(function($http) {
	// TODO: 
});
app.config( [
    '$compileProvider', function( $compileProvider ) {
        var currentImgSrcSanitizationWhitelist = $compileProvider.imgSrcSanitizationWhitelist();
        var newImgSrcSanitizationWhiteList = currentImgSrcSanitizationWhitelist.toString().slice(0,-1)
        + '|chrome-extension:'
        +currentImgSrcSanitizationWhitelist.toString().slice(-1);
        $compileProvider.imgSrcSanitizationWhitelist(newImgSrcSanitizationWhiteList);
    }
]);
app.config(function($routeProvider) {
	$routeProvider.when('/page2', {
		templateUrl: '/views/page2.html',
	});
});

app.controller('HomeCtrl', function($scope) {
	$scope.name = 'Somsak';
	$scope.showSubmenu = false;

	$scope.mainmenu = [
		{code:'card',title:'บัตร',submenu:[
			{code:'card1',title:'บัตร 1'},
			{code:'card2',title:'บัตร 2'},
			{code:'card3',title:'บัตร 3'},
			{code:'card4',title:'บัตร 4'},
		]},
		{code:'bus',title:'รถ',submenu:[
			{code:'card1',title:'บัตร 1'},
			{code:'card2',title:'บัตร 2'},
			{code:'card3',title:'บัตร 3'},
			{code:'card4',title:'บัตร 4'},
		]},
		{code:'finance',title:'การเงิน',submenu:[
			{code:'card1',title:'บัตร 1'},
			{code:'card2',title:'บัตร 2'},
			{code:'card3',title:'บัตร 3'},
			{code:'card4',title:'บัตร 4'},
		]},
		{code:'report',title:'รายงาน',submenu:[
			{code:'card1',title:'บัตร 1'},
			{code:'card2',title:'บัตร 2'},
			{code:'card3',title:'บัตร 3'},
			{code:'card4',title:'บัตร 4'},
		]},
		{code:'setting',title:'ตั้งค่า',submenu:[
			{code:'card1',title:'ข้อมูลพื้นฐาน', link:'#/setting'},
			{code:'card2',title:'จัดการผู้ใช้งาน', link:'#/users'},
		]},
	];
	$scope.txtUser = 'Somsak';
	$scope.homeClick = function() {
		$scope.showSubmenu = false;
	}
	$scope.menuClick = function(menu, evt) {
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
		setTimeout(function() {
			window.location=submenu.link;
		}, 1000);
	};
});
