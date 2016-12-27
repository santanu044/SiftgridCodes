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
var PeopleHeaderSubTextComponent = (function () {
    function PeopleHeaderSubTextComponent(aspectRatio, areaService, http) {
        this.aspectRatio = aspectRatio;
        this.areaService = areaService;
        this.http = http;
    }
    PeopleHeaderSubTextComponent.prototype.ngOnInit = function () {
        this.getCSSJSONData();
    };
    PeopleHeaderSubTextComponent.prototype.onResize = function () {
        this.getCSSJSONData();
    };
    PeopleHeaderSubTextComponent.prototype.getCSSJSONData = function () {
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
    PeopleHeaderSubTextComponent.prototype.createDynamicCSS = function () {
        var deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        var UIBackgroundWidthJSON = (this.json["UIBackground"])["width"];
        var currentWidthRatio = this.aspectRatio.WidthRatio((this.json["UIBackground"])["width"], deviceWidth);
        var currentComponentWidth = this.aspectRatio.ComponentWidth(currentWidthRatio, (this.json["PeoplePaletteHeaderSubtext"])["width"]);
        var currentComponentHeight = this.aspectRatio.ComponentHeight(currentComponentWidth, (this.json["PeoplePaletteHeaderSubtext"])["height"] / (this.json["PeoplePaletteHeaderSubtext"])["width"]);
        var currentComponentLeft = this.aspectRatio.ComponentLeft(currentWidthRatio, (this.json["PeoplePaletteHeaderSubtext"])["left"]);
        var currentComponentTop = this.aspectRatio.ComponentTop(currentComponentLeft, (this.json["PeoplePaletteHeaderSubtext"])["top"] / (this.json["PeoplePaletteHeaderSubtext"])["left"]);
        var top = this.json["PeoplePaletteHeaderSubtext"]["top"];
        /**
         * this is used to create dynamic CSS
         */
        $.injectCSS({
            "#PeoplePaletteHeaderSubtext": {
                "height": currentComponentHeight,
                "width": currentComponentWidth,
                "margin-left": currentComponentLeft,
                "margin-top": currentComponentTop,
                "font-family": "Roboto-Regular",
                "font-size": "12px",
                "color": "#9E9E9E",
                "position": "absolute"
            }
        }); // end of dynamic css
    };
    __decorate([
        core_1.HostListener('window:resize'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], PeopleHeaderSubTextComponent.prototype, "onResize", null);
    PeopleHeaderSubTextComponent = __decorate([
        core_1.Component({
            selector: 'peoplesubtitle',
            templateUrl: 'app/peoplepallete/peopleheadersubtitle-template.html'
        }), 
        __metadata('design:paramtypes', [AspectRatioService_1.AspectRatioService, areaService_1.AreaService, http_1.Http])
    ], PeopleHeaderSubTextComponent);
    return PeopleHeaderSubTextComponent;
}());
exports.PeopleHeaderSubTextComponent = PeopleHeaderSubTextComponent;
//# sourceMappingURL=headersubtext.component.js.map