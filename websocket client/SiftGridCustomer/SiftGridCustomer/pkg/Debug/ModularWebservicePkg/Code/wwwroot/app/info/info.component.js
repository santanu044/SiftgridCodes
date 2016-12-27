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
var inspectorservice_1 = require('../diagram/inspectorservice');
var InfoComponent = (function () {
    function InfoComponent(inspector) {
        var _this = this;
        this.inspector = inspector;
        this.myEvent = new core_1.EventEmitter();
        console.log("diagramId in info component :" + this.diagramId);
        inspector.updateInfoPaneObservable.subscribe(function (response) {
            _this.myEvent.emit(null);
            console.log(response);
            _this.infoProperties = response;
            var flag = _this.infoProperties["IsMissingField"];
            var key = response["LocationId"];
            var nodetype = response["Type"];
            console.log(key, nodetype);
            var nodeJson = _this.inspector._diagram.findNodeForKey(key);
            _this.inspector._diagram.startTransaction("Changing color");
            if (flag) {
            }
            else {
                _this.inspector._diagram.model.setDataProperty(nodeJson.data, "color", "black");
            }
            _this.inspector._diagram.commitTransaction("Changed color");
        });
        inspector.showDiagramInfoObservable.subscribe(function (response) {
            _this.infoProperties = response;
        });
    }
    InfoComponent.prototype.updateValue = function (val, key) {
        var locationId = this.infoProperties["LocationId"];
        this.infoProperties[key] = val;
        this.inspector.updateObjectProperties.next(JSON.stringify(this.infoProperties));
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], InfoComponent.prototype, "diagramId", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], InfoComponent.prototype, "myEvent", void 0);
    InfoComponent = __decorate([
        core_1.Component({
            selector: 'info',
            templateUrl: 'app/info/info.template.html',
            styleUrls: ['app/info/info.styles.css']
        }), 
        __metadata('design:paramtypes', [inspectorservice_1.Inspector])
    ], InfoComponent);
    return InfoComponent;
}());
exports.InfoComponent = InfoComponent;
//# sourceMappingURL=info.component.js.map