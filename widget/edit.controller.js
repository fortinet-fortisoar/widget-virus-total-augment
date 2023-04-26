/* Copyright start
  Copyright (C) 2008 - 2023 Fortinet Inc.
  All rights reserved.
  FORTINET CONFIDENTIAL & FORTINET PROPRIETARY SOURCE CODE
  Copyright end */
'use strict';
(function () {
    angular
        .module('cybersponse')
        .controller('editVtAugment100Ctrl', editVtAugment100Ctrl);

    editVtAugment100Ctrl.$inject = ['$scope', '$uibModalInstance', 'config', '$state', 'Entity', '_', 'widget'];

    function editVtAugment100Ctrl($scope, $uibModalInstance, config, $state, Entity, _, widget) {
        $scope.cancel = cancel;
        $scope.save = save;
        $scope.config = config;
        $scope.addField = addField;
        $scope.removeField = removeField;
        $scope.module = $state.params.module;
        $scope.config.rows = $scope.config.rows || [{
            columns: [{
                fields: []
            }],
            style: 'display-inline-block'
        }];
        $scope.config.includeAll = $scope.config.includeAll ? $scope.config.includeAll : false;
        $scope.config.excludeFieldsArray = $scope.config.excludeFieldsArray ? $scope.config.excludeFieldsArray : [];
        loadAttributes();

        function removeField(index, column) {
            column.fields.splice(index, 1);
        }

        function addField(newField) {
            for (var index = 0; index < $scope.fieldsArray.length; index++) {
                if ($scope.fieldsArray && $scope.fieldsArray[index].type === 'object' && $scope.fieldsArray[index].name === newField) {
                    $scope.config.rows[0].columns[0].fields.push({
                        name: newField,
                        renderWidget: 'json',
                        renderWidgetHeight: 250,
                        readOnly: true,
                        highlightMode: true
                    });
                    break;
                } else {
                    $scope.config.rows[0].columns[0].fields.push({
                        name: newField,
                        readOnly: true,
                        highlightMode: true
                    });
                    break;
                }
            }
            //checkReadOnlyAndAllHighlight();
        }
        function loadAttributes() {
            var entity = new Entity($scope.module);
            entity.loadFields().then(function () {
                $scope.fields = entity.getFormFields();
                $scope.fieldsArray = _.values($scope.fields);
            });
        }
        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        function save() {
            $uibModalInstance.close($scope.config);
        }
    }
})();