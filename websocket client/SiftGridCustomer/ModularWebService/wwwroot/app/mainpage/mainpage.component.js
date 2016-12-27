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
var searchservice_1 = require("../search/searchservice");
var MainPageComponent = (function () {
    function MainPageComponent(inspectorService) {
        this.inspectorService = inspectorService;
        this.documentVisibility = true;
        this.consumerVisibility = true;
        this.myEvent = new core_1.EventEmitter();
        this.errorVisisbility = true;
        this.palletVisibility = true;
        this.infoVisibility = true;
    }
    MainPageComponent.prototype.showDocument = function () {
        if (this.documentVisibility == true) {
            document.getElementById("document").style.visibility = "visible";
            this.documentVisibility = false;
        }
        else {
            document.getElementById("document").style.visibility = "hidden";
            this.documentVisibility = true;
        }
    };
    MainPageComponent.prototype.showFuelConsumer = function () {
        if (this.consumerVisibility == true) {
            document.getElementById("fuel").style.visibility = "visible";
            this.consumerVisibility = false;
        }
        else {
            document.getElementById("fuel").style.visibility = "hidden";
            this.consumerVisibility = true;
        }
    };
    MainPageComponent.prototype.showError = function () {
        if (this.errorVisisbility == true) {
            document.getElementById("error").style.visibility = "visible";
            this.errorVisisbility = false;
        }
        else {
            document.getElementById("error").style.visibility = "hidden";
            this.errorVisisbility = true;
        }
    };
    MainPageComponent.prototype.showPallet = function () {
        if (this.palletVisibility == true) {
            document.getElementById("pallet").style.visibility = "visible";
            this.palletVisibility = false;
        }
        else {
            document.getElementById("pallet").style.visibility = "hidden";
            this.palletVisibility = true;
        }
    };
    MainPageComponent.prototype.showInfo = function () {
        if (this.infoVisibility == true) {
            document.getElementById("info").style.visibility = "visible";
            document.getElementById("notes").style.visibility = "visible";
            this.infoVisibility = false;
        }
        else {
            document.getElementById("info").style.visibility = "hidden";
            document.getElementById("notes").style.visibility = "hidden";
            this.infoVisibility = true;
        }
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], MainPageComponent.prototype, "diagramID", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], MainPageComponent.prototype, "myEvent", void 0);
    MainPageComponent = __decorate([
        core_1.Component({
            selector: 'mainpage',
            templateUrl: 'app/mainpage/mainpage.template.html',
            providers: [InspectorService_1.Inspector, searchservice_1.SearchService]
        }), 
        __metadata('design:paramtypes', [InspectorService_1.Inspector])
    ], MainPageComponent);
    return MainPageComponent;
}());
exports.MainPageComponent = MainPageComponent;
//# sourceMappingURL=mainpage.component.js.map