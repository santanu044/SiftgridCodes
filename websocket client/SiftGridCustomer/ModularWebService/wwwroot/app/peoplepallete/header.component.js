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
var PeopleHeaderComponent = (function () {
    function PeopleHeaderComponent(aspectRatio, areaService, http) {
        this.aspectRatio = aspectRatio;
        this.areaService = areaService;
        this.http = http;
    }
    PeopleHeaderComponent.prototype.ngOnInit = function () {
        this.getCSSJSONData();
    };
    PeopleHeaderComponent.prototype.onResize = function () {
        this.getCSSJSONData();
    };
    PeopleHeaderComponent.prototype.getCSSJSONData = function () {
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
    PeopleHeaderComponent.prototype.createDynamicCSS = function () {
        var deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        var UIBackgroundWidthJSON = (this.json["UIBackground"])["width"];
        var currentWidthRatio = this.aspectRatio.WidthRatio((this.json["UIBackground"])["width"], deviceWidth);
        var currentComponentWidth = this.aspectRatio.ComponentWidth(currentWidthRatio, (this.json["PeoplePaletteHeader"])["width"]);
        var currentComponentHeight = this.aspectRatio.ComponentHeight(currentComponentWidth, (this.json["PeoplePaletteHeader"])["height"] / (this.json["PeoplePaletteHeader"])["width"]);
        var currentComponentLeft = this.aspectRatio.ComponentLeft(currentWidthRatio, (this.json["PeoplePaletteHeader"])["left"]);
        var currentComponentTop = this.aspectRatio.ComponentTop(currentComponentLeft, (this.json["PeoplePaletteHeader"])["top"] / (this.json["PeoplePaletteHeader"])["left"]);
        /**
         * this is used to create dynamic CSS
         */
        $.injectCSS({
            "#PeoplePaletteHeader": {
                "height": currentComponentHeight,
                "width": currentComponentWidth,
                "margin-left": currentComponentLeft,
                "margin-top": currentComponentTop,
                "background": "rgba(32, 32, 32, 0.50)",
                "box-shadow": "0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0,0,0,0.24)",
                "border": "6px 0 0 6px",
                "color": "white",
                "position": "absolute"
            }
        }); // end of dynamic css
    };
    __decorate([
        core_1.HostListener('window:resize'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], PeopleHeaderComponent.prototype, "onResize", null);
    PeopleHeaderComponent = __decorate([
        core_1.Component({
            selector: 'peopleheader',
            templateUrl: 'app/peoplepallete/peopleheader-template.html'
        }), 
        __metadata('design:paramtypes', [AspectRatioService_1.AspectRatioService, areaService_1.AreaService, http_1.Http])
    ], PeopleHeaderComponent);
    return PeopleHeaderComponent;
}());
exports.PeopleHeaderComponent = PeopleHeaderComponent;
//# sourceMappingURL=header.component.js.map