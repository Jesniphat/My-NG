var attaDbms = angular.module('attaDbms', []);
attaDbms.service('dbService', ['$q', '$http', 'sysConfig',
    function($q, $http, sysConfig) {

  this.query = function(sql, param) {
    var deferred = $q.defer();
    
    $http.post(sysConfig.NODE_URL + '/query', {
      sql:sql,
      param:param,
    }).then(function(response) {
      console.log('data=', response.data);
      if (response.data.status === true) {
        deferred.resolve(response.data.data);
      } else {
        deferred.resolve(false);
      }
    }, function(e) {
      deferred.reject(false);
    });
    
    return deferred.promise;
  }
}]);
