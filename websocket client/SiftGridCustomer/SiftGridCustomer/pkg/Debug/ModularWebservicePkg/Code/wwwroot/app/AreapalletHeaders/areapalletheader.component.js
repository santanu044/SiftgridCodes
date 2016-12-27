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
var http_1 = require('@angular/http');
var AspectRatioService_1 = require('../aspectratiocalculation/AspectRatioService');
var areaService_1 = require("../area/areaService");
var AreaPalletHeaderComponent = (function () {
    function AreaPalletHeaderComponent(aspectRatio, areaService, http) {
        this.aspectRatio = aspectRatio;
        this.areaService = areaService;
        this.http = http;
    }
    AreaPalletHeaderComponent.prototype.ngOnInit = function () {
        this.getCSSJSONData();
    };
    AreaPalletHeaderComponent.prototype.onResize = function () {
        this.getCSSJSONData();
    };
    AreaPalletHeaderComponent.prototype.getCSSJSONData = function () {
        var _this = this;
        this.http.get("app/css.json")
            .subscribe(function (json) {
            _this.json = json.json();
            _this.createDynamicCSS();
        });
    };
    AreaPalletHeaderComponent.prototype.createDynamicCSS = function () {
        var deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        var UIBackgroundWidthJSON = (this.json["UIBackground"])["width"];
        var currentWidthRatio = this.aspectRatio.WidthRatio((this.json["UIBackground"])["width"], deviceWidth);
        var currentComponentWidth = this.aspectRatio.ComponentWidth(currentWidthRatio, (this.json["AreasPaletteHeader"])["width"]);
        var currentComponentHeight = this.aspectRatio.ComponentHeight(currentComponentWidth, (this.json["AreasPaletteHeader"])["height"] / (this.json["AreasPaletteHeader"])["width"]);
        var currentComponentLeft = this.aspectRatio.ComponentLeft(currentWidthRatio, (this.json["AreasPaletteHeader"])["left"]);
        var currentComponentTop = this.aspectRatio.ComponentTop(currentComponentLeft, (this.json["AreasPaletteHeader"])["top"] / (this.json["AreasPaletteHeader"])["left"]);
        /**
         * this is used to create dynamic CSS
         */
        $.injectCSS({
            "#AreasPaletteHeader": {
                "height": currentComponentHeight,
                "width": currentComponentWidth,
                "margin-left": currentComponentLeft,
                "margin-top": currentComponentTop,
                "background": "rgba(32, 32, 32, 0.50)",
                "box-shadow": "0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0,0,0,0.24)",
                "border-radius": "6px 0 0 6px",
                "position": "absolute"
            }
        }); // end of dynamic css
    };
    __decorate([
        core_1.HostListener('window:resize'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], AreaPalletHeaderComponent.prototype, "onResize", null);
    AreaPalletHeaderComponent = __decorate([
        core_1.Component({
            selector: 'areapalletheader',
            templateUrl: 'app/AreaPalletHeaders/areapalletheader-template.html'
        }), 
        __metadata('design:paramtypes', [AspectRatioService_1.AspectRatioService, areaService_1.AreaService, http_1.Http])
    ], AreaPalletHeaderComponent);
    return AreaPalletHeaderComponent;
}());
exports.AreaPalletHeaderComponent = AreaPalletHeaderComponent;
//# sourceMappingURL=areapalletheader.component.js.map