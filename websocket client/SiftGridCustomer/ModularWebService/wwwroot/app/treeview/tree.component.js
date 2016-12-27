"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/// <reference path="../../libs/gojs.d.ts" />
var core_1 = require('@angular/core');
var InspectorService_1 = require('../diagram/InspectorService');
var TreeComponent = (function () {
    function TreeComponent(inspectorService) {
        this.inspectorService = inspectorService;
    }
    TreeComponent.prototype.load = function () {
        //    myDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
        // share all of the data with the tree view
        //   myTreeView.model.nodeDataArray = myDiagram.model.nodeDataArray;
        // share the UndoManager too!
        //   myTreeView.model.undoManager = myDiagram.model.undoManager;
    };
    TreeComponent = __decorate([
        core_1.Component({
            selector: 'tree',
            templateUrl: 'app/treeview/tree.component.html'
        }), 
        __metadata('design:paramtypes', [InspectorService_1.Inspector])
    ], TreeComponent);
    return TreeComponent;
}());
exports.TreeComponent = TreeComponent;
//# sourceMappingURL=tree.component.js.map