/* Copyright start
  Copyright (C) 2008 - 2023 Fortinet Inc.
  All rights reserved.
  FORTINET CONFIDENTIAL & FORTINET PROPRIETARY SOURCE CODE
  Copyright end */
'use strict';
(function () {
  angular
    .module('cybersponse')
    .controller('vtAugment100Ctrl', vtAugment100Ctrl);
  vtAugment100Ctrl.$inject = ['$scope', '$sce', '$resource', 'API', '_', 'toaster', '$rootScope', '$state', 'Entity'];

  function vtAugment100Ctrl($scope, $sce, $resource, API, _, toaster, $rootScope, $state, Entity) {
    $scope.renderingURL = null;
    $scope.loadProcessing = true;
    $scope.healthCheck = true;
    $scope.connectorConfig = true;
    //var vtConfig = null;
    $scope.module = $state.params.module; //Get module name
    $scope.moduleUUID = $state.params.id; //Get module uuid
    var entity = new Entity($scope.module); //Create module entity
    entity.get($scope.moduleUUID, {
      $relationships: true
    }).then(function () {
      $scope.indicatorValue = entity.fields[$scope.config.rows[0].columns[0].fields[0].name].value;
    }); //Get module fields values


    function _getConnectorConfig() {
      $resource('/api/query/solutionpacks').save(
        {
          'logic': 'AND',
          'filters': [
            {
              'field': 'type',
              'operator': 'eq',
              'value': 'connector'

            },
            {
              'field': 'configCount',
              'operator': 'gt',
              'value': 0
            },
            {
              'field': 'installed',
              'operator': 'eq',
              'value': true
            },
            {
              'field': 'name',
              'operator': 'like',
              'value': 'virustotal%'
            }
          ]
        }, function (configResp) {
          if (configResp['hydra:member'].length > 0) {
            var vtPremiumConfig = _.find(configResp['hydra:member'], function (item) { return item.label === 'VirusTotal Premium'; });
            if (!angular.isUndefined(vtPremiumConfig)) {
              getWidgetRenderingURL(vtPremiumConfig);
            }
            else {
              getWidgetRenderingURL(configResp['hydra:member'][0]);
            }
          }
          else {
            $scope.connectorConfig = false;
          }

        });
    }

    function getWidgetRenderingURL(vtConfig) {
      var params = {};
      var theme = $rootScope.theme;
      var qparams = {
        query: $scope.indicatorValue
      };
      if (theme.id === 'light') {
        qparams.fg1 = '4d4d4d';
        qparams.bg1 = 'ffffff';
        qparams.bg2 = 'f9f9f9';
        qparams.bd1 = 'e6e6e6';
      } else if (theme.id === 'steel') {
        qparams.fg1 = 'FFFFFF';
        qparams.bg1 = '323B47';
        qparams.bg2 = '0D1218';
        qparams.bd1 = '1B2430';
      } else {
        qparams.fg1 = 'EFEFEF';
        qparams.bg1 = '444242';
        qparams.bg2 = '161616';
        qparams.bd1 = '1B2430';
      }
      var requestParams = {
        connector: vtConfig.name,
        version: vtConfig.version,
        config: null,
        operation: 'get_widget_rendering_url',
        params: qparams,
        audit: null,
        audit_info: null
      };
      $resource(API.INTEGRATIONS + 'execute/?format=json').save(requestParams, function (urlResp) {
        console.log(urlResp);
        $scope.loadProcessing = false;
        $scope.renderingURL = urlResp.data.data.url;
      }, function (error) {
        $scope.healthCheck = false;
        console.log(error);
      });
    }
    _getConnectorConfig();

  }
})();