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
          $scope.renderingURL = { url: '' }
          $scope.loadProcessing = true;
          var vtConfig = null;
          $scope.module = $state.params.module; //Get module name
          $scope.moduleUUID = $state.params.id; //Get module uuid
          var entity = new Entity($scope.module); //Create module entity
          entity.get($scope.moduleUUID, {
              $relationships: true
          }).then(function () {
              $scope.indicatorValue = entity.fields[$scope.config.rows[0].columns[0].fields[0].name].value;
          }); //Get module fields values
  
  
          function _getConfigConnectorList() {
              $resource(API.INTEGRATIONS + 'connector_details/?format=json&configured=true').save({
                  'page_size': 300
              }, function (data) {
                  vtConfig = _.find(data.data, function (item) { return item.label === 'VirusTotal Premium'; });
                  if (typeof vtConfig == 'undefined') {
                      vtConfig = _.find(data.data, function (item) { return item.label === 'VirusTotal'; });
                  }
                  if (typeof vtConfig == 'undefined') {
                      toaster.error({ body: 'VirusTotal Augment Widget: VirusTotal connector configuration does not exists.' });
                  }
                  else {
                      var params = {};
                      $resource(API.INTEGRATIONS + 'connectors/healthcheck/' + vtConfig.name + '/' + vtConfig.version + '/?config=' + vtConfig.configuration[0].config_id).get(params, function (resp) {
                          if (resp.status === 'Available') {
                              var theme = $rootScope.theme;
                              var qparams = {
                                  query: $scope.indicatorValue
                              };
                              if (theme.id === "light") {
                                  qparams.fg1 = '4d4d4d';
                                  qparams.bg1 = 'ffffff';
                                  qparams.bg2 = 'f9f9f9';
                                  qparams.bd1 = 'e6e6e6';
                              } else if (theme.id === "steel") {
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
                                  config: vtConfig.configuration[0].config_id,
                                  operation: 'get_widget_rendering_url',
                                  params: qparams,
                                  audit: null,
                                  audit_info: null
                              };
                              $resource(API.INTEGRATIONS + 'execute/?format=json').save(requestParams, function (urlResp) {
                                  console.log(urlResp);
                                  $scope.loadProcessing = false;
                                  $scope.renderingURL.url = urlResp.data.data.url;
                              });
                          }
                          else {
                              toaster.error({ body: 'VirusTotal Augment Widget: VirusTotal connector health status failed.' });
                          }
                      });
                  }
              });
          }
          _getConfigConnectorList();
  
      }
  })();