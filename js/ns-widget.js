var nsWidget = angular.module('nsWidget', []);
nsWidget.directive('attaCard', function() {
	return {
		restrict:'E',
		replace:true,
		template:'<div class="ns-wrapper"><div class="ns-cover"><div><img src="img/rapidcard.png"/><div class="card-type"></div><div class="card-code"></div><div class="card-name"></div><div class="card-corp" ></div></div></div><div class="ns-transition ns-flip3"><div class="ns-card"><div class="ns-front"><div><img src="img/rapidcard.png"/><div class="card-type"></div><div class="card-code"></div><div class="card-name"></div><div class="card-corp" ></div></div></div><div class="ns-back"><div><img src="img/rapidcard_corporate.png"/><div class="card-type"></div><div class="card-code"></div><div class="card-name" ></div><div class="card-corp"></div></div></div></div></div></div>',
	};
});
nsWidget.directive('formInput', function() {
    return {
        restrict: 'E',
		scope:{
			model:'=',
			change:'=',
			disabled:'=',
			ngClass:'=',
			required:'=',
			readonly:'=',
			hint:'@',
			formId:'@',
			blurfn:'&blur',
		},
		require:'?ngModel',
		template:'<div class="input" ng-class="ngClass"><label>{{hint}}</label><input ng-model="model" ng-change="change"/></div>',
		compile:function(element, attrs, ctrl) {
			var input = element.find('input');
			var div = element.find('div');
			if (attrs.hasOwnProperty('type')) {
				if (attrs.type=='number') {
					div.addClass('number');
					input.attr({'type':'text','number-only':''});
					if (!attrs.hasOwnProperty('pattern')) {
						var pattern = '/^\-?[0-9,]+(\\.[0-9]*)?$/';
						if (attrs.hasOwnProperty('digit')) {
							pattern = '/^\-?[0-9,]+(\\.[0-9]{,'+attrs.digit+'})?$/';
						}
						input.attr({'ng-pattern':pattern});
					}
					if (attrs.hasOwnProperty('unit')) {
						div.addClass('unit')
							.append('<label>'+attrs.unit+'</label>');
					}
					if (attrs.hasOwnProperty('money')) {
						var digit = parseInt(attrs.money);
						if (isNaN(digit)) {
							digit=2;
						}
						input.attr({'format-money':digit});
					}
				} else {
					input.attr({'type':attrs.type});
				}
			} else {
				input.attr({'type':'text'});
			}
			if (attrs.hasOwnProperty('disabled')) {
				input.attr({'ng-disabled':'disabled'});
			}
			if (attrs.hasOwnProperty('minLength')) {
				input.attr({'ng-minlength':attrs.minLength});
			}
			if (attrs.hasOwnProperty('maxLength')) {
				input.attr({'ng-maxlength':attrs.maxLength,'maxlength':attrs.maxLength});
			}
			if (attrs.hasOwnProperty('pattern')){
				input.attr({'ng-pattern':'/'+attrs.pattern+'/'});
			}
			if (attrs.hasOwnProperty('required')){
				input.attr({'ng-required':attrs.required==''?'true':'required'});
			}
			if (attrs.hasOwnProperty('icon')) {
				div.css({backgroundImage: 'url(img/icon/'+attrs.icon+'.png)'});
			}
			if (attrs.hasOwnProperty('autofocus')) {
				input.attr({'auto-focus':true});
			}
			if (attrs.hasOwnProperty('readonly')) {
				input.attr({'ng-readonly':attrs.readonly==''?'true':'readonly'});
			} else if (!attrs.hasOwnProperty('notab')) {
				input.attr({'tab-stop':true});
			}
			if (attrs.hasOwnProperty('formId')) {
				input.attr({'id':attrs.formId});
			}
			if (attrs.hasOwnProperty('tab')) {
				input.attr({'tab-stop':true});
			}
			
			return function(scope, element, attrs) {
				var input = element.find('input');
				if (attrs.hasOwnProperty('blur')) {
					input.on('blur', function() {
						scope.blurfn();
					});
				}
			}
		},
    }
});
nsWidget.directive('formatMoney', ['$filter', function($filter) {
	return {
		restrict:'A',
		require:'?ngModel',
		link:function(scope, element, attrs, ctrl){
			ctrl.$formatters.push(function(value) {
				if (value) {
					return $filter('number')(value*1, 1*attrs.formatMoney);
				}
				return "0" + (1*attrs.formatMoney == 0 ? '' : '.' + '000000000'.substr(0, 1*attrs.formatMoney));
			});
			ctrl.$parsers.push(function(value) {
				//if (value) {
					var data = parseFloat((''+value).replace(/[^0-9\.\-\+]/g, ''));
					if (isNaN(data)) {
						return 0;
					}
					return data;
				//}
			});
//			console.log($filter);
			// element.bind('focus', function() {
				// console.log('viewValue=', ctrl.$viewValue);
				// console.log('modelValue=', ctrl.$modelValue);
			// });
			
			element.bind('blur', function() {
//				ctrl.$viewValue = (ctrl.$modelValue*1).toFixed(attrs.formatMoney);
				ctrl.$viewValue = $filter('number')(ctrl.$modelValue*1, attrs.formatMoney);
				ctrl.$render();
			});
			
		}
	}
}]);

nsWidget.directive('formTextarea', function() {
    return {
        restrict: 'E',
		scope:{
			model:'=',
			change:'=',
			disabled:'=',
			ngClass:'=',
			required:'=',
			readonly:'=',
			hint:'@',
			formId:'@',
		},
		template:'<div class="input" ng-class="ngClass"><label>{{hint}}</label><textarea ng-model="model" ng-change="change" ng-required="required" ng-trim="true" tab-stop></textarea></div>',
		compile:function(element, attrs) {
			var input = element.find('textarea');
			var div = element.find('div');
			if (attrs.hasOwnProperty('disabled')) {
				input.attr({'ng-disabled':'disabled'});
			}
			if (attrs.hasOwnProperty('minLength')) {
				input.attr({'ng-minlength':attrs.minLength});
			}
			if (attrs.hasOwnProperty('maxLength')) {
				input.attr({'ng-maxlength':attrs.maxLength});
			}
			if (attrs.hasOwnProperty('pattern')){
				input.attr({'ng-pattern':'/'+attrs.pattern+'/'});
			}
			if (attrs.hasOwnProperty('required')){
				input.attr({'ng-required':attrs.required==''?'true':'required'});
			}
			if (attrs.hasOwnProperty('icon')) {
				div.css({backgroundImage: 'url(img/icon/'+attrs.icon+'.png)'});
			}
			if (attrs.hasOwnProperty('autofocus')) {
				input.attr({'auto-focus':true});
			}
			if (attrs.hasOwnProperty('readonly')) {
				input.attr({'ng-readonly':attrs.readonly==''?'true':'readonly'});
			} else if (!attrs.hasOwnProperty('notab')) {
				input.attr({'tab-stop':true});
			}
			if (attrs.hasOwnProperty('formId')) {
				console.log('formId');
				input.attr({'id':attrs.formId});
			}
		},
    }
});
nsWidget.directive('formSwitch', function() {
    return {
        restrict: 'E',
		scope:{
			model:'=',
			change:'=',
			disabled:'=',
			ngClass:'=',
			hint:'@',
			statusOn:'@',
			statusOff:'@',
			formId:'@',
		},
		replace:true,
		template:'<div class="input number" ng-class="ngClass"><div class="wrap"><label>{{hint}}</label><input type="checkbox" ng-model="model" class="switch" id="{{formId}}" ng-change="change"/><label for="{{formId}}">{{model?statusOn:statusOff}}</label></div></div>',
		compile:function(element, attrs) {
			var input = element.find('input');
			if (attrs.hasOwnProperty('disabled')) {
				input.attr({'ng-disabled':'disabled'});
			}
			if (attrs.hasOwnProperty('icon')) {
				element.css({backgroundImage: 'url(img/icon/'+attrs.icon+'.png)'});
			}
			if (attrs.hasOwnProperty('readonly')) {
				input.attr({'readonly':true});
			}
		},
    }
});

nsWidget.directive('nsWidget', function() {
	return {
		restrict:'E',
		replace:true,
		transclude:true,
		template:'<div class="widget"><div ng-transclude></div></div>',

		link: function(scope, element, attr) {
			element.css({
				left: (attr.col * 8) + 'px',
				top: (attr.row * 8) + 'px',
				width: (attr.width * 8) + 'px',
				height: (attr.height * 8) + 'px',
			});
		},
	}
});

nsWidget.directive('numberOnly', function() {
	return {
		require: '?ngModel',
		link: function(scope, element, attrs, ngModelCtrl) {
			if(!ngModelCtrl) {
				return; 
			}

			ngModelCtrl.$parsers.push(function(val) {
				if (typeof val == 'undefined') {
					return;
				}
				var clean = val.replace( /[^0-9\.\-]+/g, '');
				if (val !== clean) {
					ngModelCtrl.$setViewValue(clean);
					ngModelCtrl.$render();
				}
				return clean;
			});
			element.bind('keypress', function(event) {
				if(event.keyCode === 32) {
					event.preventDefault();
				}
			});
		}
	};
});
nsWidget.directive('autoFocus', function() {
	return {
		restrict: 'A',
		link: function($scope, $elem) {
			$scope.$on('formReady', function() {
				$elem[0].focus();
				$elem[0].select();
			});
			setTimeout(function() {
				$elem[0].focus();
				$elem[0].select();
			}, 0);
		}
	}
});

nsWidget.directive('tabStop', function() {
	return {
		restrict: 'A',
		link: function($scope,elem,attrs) {
			elem.bind('keydown', function(e) {
				if (e.keyCode==13 // ENTER_KEY
					|| e.keyCode==40 // DOWN_KEY
					|| e.keyCode==38 // UP_KEY
					) {
					
					// var focusable = document.querySelectorAll('[tab-stop]:not(:disabled)');
					// if (focusable.length==0) {
					// 	return false;
					// }
					
					var focusable = [];
					angular.element('[tab-stop]:not(:disabled)').each(function(i, el) {
						if (angular.element(el).is(':visible')) {
							focusable.push(el);
						}
					});

					var currentIndex = Array.prototype.indexOf.call(focusable, e.target);

					var nextIndex;
					if (e.keyCode==13 && this.tagName=='BUTTON') {
						return true;
					} else if ((e.keyCode==40 || e.keyCode==38) && this.tagName=='SELECT') {
						return true;
					} else if (e.keyCode==13 || e.keyCode==40) { // DOWN_KEY
						nextIndex = (currentIndex + 1)%focusable.length;
					} else {
						nextIndex = (focusable.length+currentIndex - 1)%focusable.length;
					}
					setTimeout(function(){
						if (focusable[nextIndex]) {
							if (focusable[nextIndex].focus) {
								focusable[nextIndex].focus();
							}
							if (focusable[nextIndex].select) {
								focusable[nextIndex].select();
							}
						}
					}, 0);
					return false;
				}
			});
		}
	}
});
nsWidget.directive('nsCounter', ['$interval', 'dateFilter', function($interval, dateFilter) {
	function link(scope, element, attrs) {
		var startTime,
			timeoutId;

		function updateTime() {
//			console.log('updateTime');
			var diff = Math.floor((new Date().getTime() - startTime.getTime())/1000);
			var hh = Math.floor(diff/3600);
			diff -= hh*3600;
			var mm = Math.floor(diff/60);
			diff -= mm*60;
			var ss = diff;

			element.text((hh>0?('00'+hh).substr(-2)+':':'')
				+ ('00'+mm).substr(-2) + ':' + ('00'+ss).substr(-2));
		}

		scope.$watch(attrs.nsCounter, function(value) {
			startTime = new Date(value);
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