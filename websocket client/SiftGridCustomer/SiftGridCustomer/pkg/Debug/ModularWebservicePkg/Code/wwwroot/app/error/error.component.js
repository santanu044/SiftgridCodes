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
var core_1 = require('@angular/core');
var InspectorService_1 = require('../diagram/InspectorService');
var ErrorsComponent = (function () {
    function ErrorsComponent(inspectorService) {
        this.inspectorService = inspectorService;
        var self = this;
        console.log(self.diagram);
        inspectorService.errorObjectObservable.map(function (res) { return res; })
            .subscribe(function (res) {
            console.log("errorObjectObservable subscribing");
            self.JsonId = res;
            for (var _i = 0; _i < self.JsonId.length; _i++) {
                if (self.JsonId[_i]["ValidationType"] === "Application") {
                    var num = self.JsonId[_i]["LocationId"] + "," + self.JsonId[_i]["Type"] + "," + self.JsonId[_i]["ValidationType"];
                    console.log("Application", num);
                    var nodetype = self.JsonId[_i]["Type"];
                    var node = self.diagram.findNodeForKey(self.JsonId[_i]["LocationId"]);
                    var mode = self.diagram.model.setDataProperty(node.data, "color", "pink");
                }
                if (self.JsonId[_i]["ValidationType"] === "Business") {
                    var num = self.JsonId[_i]["LocationId"] + "," + self.JsonId[_i]["Type"] + "," + self.JsonId[_i]["ValidationType"];
                    console.log("Business", num);
                    var nodetype = self.JsonId[_i]["Type"];
                    var node = self.diagram.findNodeForKey(self.JsonId[_i]["LocationId"]);
                    var mode = self.diagram.model.setDataProperty(node.data, "color", "blue");
                }
                if (self.JsonId[_i]["ValidationType"] === "Compliance") {
                    var num = self.JsonId[_i]["LocationId"] + "," + self.JsonId[_i]["Type"] + "," + self.JsonId[_i]["ValidationType"];
                    console.log("Compliance", num);
                    var nodetype = self.JsonId[_i]["Type"];
                    var node = self.diagram.findNodeForKey(self.JsonId[_i]["LocationId"]);
                    var mode = self.diagram.model.setDataProperty(node.data, "color", "red");
                }
            }
            console.log("node lenght", self.diagram.model.nodeDataArray.length);
        }, function (err) { return console.log(err); }, function () { return console.log("completed error comp"); });
    }
    ErrorsComponent.prototype.GetErrorsBy = function (guid) {
        console.log("Diagram id for error :" + guid);
        this.inspectorService.getErrors(guid);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', go.Diagram)
    ], ErrorsComponent.prototype, "diagram", void 0);
    ErrorsComponent = __decorate([
        core_1.Component({
            selector: 'error',
            templateUrl: 'app/error/error.template.html',
            styleUrls: ['app/error/error.styles.css']
        }), 
        __metadata('design:paramtypes', [InspectorService_1.Inspector])
    ], ErrorsComponent);
    return ErrorsComponent;
}());
exports.ErrorsComponent = ErrorsComponent;
//# sourceMappingURL=error.component.js.map