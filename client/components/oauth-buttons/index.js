'use strict';

import angular from 'angular';

/*@ngInject*/
export function OauthButtonsController($window) {
  this.loginOauth = function(provider) {
    $window.location.href = '/auth/' + provider;
  };
}

/*@ngInject*/
export default angular.module('trackingApp.oauthButtons', [])
  .directive('oauthButtons', function() {
    return {
      template: require('./oauth-buttons.html'),
      restrict: 'EA',
      controller: OauthButtonsController,
      controllerAs: 'OauthButtons',
      scope: {
        classes: '@'
      }
    };
  })
  .name;
