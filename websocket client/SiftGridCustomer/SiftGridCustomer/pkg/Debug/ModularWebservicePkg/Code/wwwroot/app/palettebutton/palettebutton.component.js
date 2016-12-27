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
var http_1 = require('@angular/http');
require('rxjs/add/operator/map');
require('rxjs/add/operator/catch');
var AspectRatioService_1 = require('../aspectratiocalculation/AspectRatioService');
var diagramService_1 = require("../diagram/diagramService");
var PaletteButtonComponent = (function () {
    function PaletteButtonComponent(http, aspectRatio, diagramService) {
        var _this = this;
        this.http = http;
        this.aspectRatio = aspectRatio;
        this.diagramService = diagramService;
        this.palletVisibility = true;
        this.areapalletVisibility = true;
        this.peoplepalletVisibility = true;
        this.diagramService.diagramTypeObservable.subscribe(function (res) {
            _this.diagramType = res;
        });
    }
    /**
     * this function is used to get device width
     */
    PaletteButtonComponent.prototype.ngOnInit = function () {
        this.getCSSJSONData();
        //this.createDynamicCSS();
    };
    PaletteButtonComponent.prototype.onResize = function () {
        this.getCSSJSONData();
    };
    PaletteButtonComponent.prototype.getCSSJSONData = function () {
        var _this = this;
        //this.http.get("app/css.json")
        //    //.map(this.extractData)
        //    .subscribe(json => {
        //        this.json = json.json();
        //        this.createDynamicCSS();
        //    });
        this.aspectRatio.GetCSSJSONData().subscribe(function (json) {
            _this.json = json;
            _this.createDynamicCSS();
        });
    };
    PaletteButtonComponent.prototype.extractData = function (res) {
        alert("dfdf");
        var body = res.json();
        return body.data || {};
    };
    PaletteButtonComponent.prototype.handleError = function (error) {
    };
    PaletteButtonComponent.prototype.createDynamicCSS = function () {
        var deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        var UIBackgroundWidthJSON = (this.json["UIBackground"])["width"];
        var currentWidthRatio = this.aspectRatio.WidthRatio((this.json["UIBackground"])["width"], deviceWidth);
        var currentComponentWidth = this.aspectRatio.ComponentWidth(currentWidthRatio, (this.json["ChatButton"])["width"]);
        var currentComponentHeight = this.aspectRatio.ComponentHeight(currentComponentWidth, (this.json["ChatButton"])["height"] / (this.json["ChatButton"])["width"]);
        var currentComponentLeft = this.aspectRatio.ComponentLeft(currentWidthRatio, (this.json["ChatButton"])["left"]);
        var currentComponentTop = this.aspectRatio.ComponentTop(currentComponentLeft, (this.json["ChatButton"])["top"] / (this.json["ChatButton"])["left"]);
        /**
         * this is used to create dynamic CSS
         */
        $.injectCSS({
            "#ChatButton": {
                "height": currentComponentHeight,
                "width": currentComponentWidth,
                "margin-left": currentComponentLeft,
                "margin-top": currentComponentTop,
                "margin-right": 0,
                "padding": 0
            }
        }); // end of dynamic css
    };
    PaletteButtonComponent.prototype.showPallet = function () {
        console.log("Diagram Type: " + this.diagramType);
        if (this.diagramType == 'areaDiagram') {
            if (this.areapalletVisibility == true) {
                document.getElementById("newPalette").style.visibility = "visible";
                this.areapalletVisibility = false;
                this.diagramService.isDiagramEdittableObservable.next("visible");
            }
            else {
                document.getElementById("newPalette").style.visibility = "hidden";
                this.areapalletVisibility = true;
                this.diagramService.isDiagramEdittableObservable.next("hidden");
            }
        }
        else if (this.diagramType == 'peoplediagram') {
            if (this.peoplepalletVisibility == true) {
                document.getElementById("peoplePalette").style.visibility = "visible";
                this.peoplepalletVisibility = false;
                this.diagramService.isDiagramEdittableObservable.next("visible");
            }
            else {
                document.getElementById("peoplePalette").style.visibility = "hidden";
                this.peoplepalletVisibility = true;
                this.diagramService.isDiagramEdittableObservable.next("hidden");
            }
        }
        else {
            if (this.palletVisibility == true) {
                document.getElementById("pallet").style.visibility = "visible";
                this.palletVisibility = false;
                this.diagramService.isDiagramEdittableObservable.next("visible");
            }
            else {
                document.getElementById("pallet").style.visibility = "hidden";
                this.palletVisibility = true;
                this.diagramService.isDiagramEdittableObservable.next("hidden");
            }
        }
    };
    __decorate([
        core_1.HostListener('window:resize'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], PaletteButtonComponent.prototype, "onResize", null);
    PaletteButtonComponent = __decorate([
        core_1.Component({
            selector: 'palettebutton',
            templateUrl: 'app/palettebutton/palettebutton.template.html'
        }), 
        __metadata('design:paramtypes', [http_1.Http, AspectRatioService_1.AspectRatioService, diagramService_1.DiagramService])
    ], PaletteButtonComponent);
    return PaletteButtonComponent;
}());
exports.PaletteButtonComponent = PaletteButtonComponent;
//# sourceMappingURL=palettebutton.component.js.map