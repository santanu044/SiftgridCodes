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
var FooterComponent = (function () {
    function FooterComponent(http, aspectRatio) {
        this.http = http;
        this.aspectRatio = aspectRatio;
    }
    /**
     * this function is used to get device width
     */
    FooterComponent.prototype.ngOnInit = function () {
        this.getCSSJSONData();
        //this.createDynamicCSS();
    };
    FooterComponent.prototype.onResize = function () {
        this.getCSSJSONData();
    };
    FooterComponent.prototype.getCSSJSONData = function () {
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
    FooterComponent.prototype.createDynamicCSS = function () {
        var deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        var UIBackgroundWidthJSON = (this.json["UIBackground"])["width"];
        var currentWidthRatio = this.aspectRatio.WidthRatio((this.json["UIBackground"])["width"], deviceWidth);
        var currentComponentWidth = this.aspectRatio.ComponentWidth(currentWidthRatio, (this.json["Footer"])["width"]);
        var currentComponentHeight = this.aspectRatio.ComponentHeight(currentComponentWidth, (this.json["Footer"])["height"] / (this.json["Footer"])["width"]);
        var currentComponentLeft = this.aspectRatio.ComponentLeft(currentWidthRatio, (this.json["Footer"])["left"]);
        var currentComponentTop = this.aspectRatio.ComponentTop(currentComponentLeft, (this.json["Footer"])["top"] / (this.json["Footer"])["left"]);
        /**
         * this is used to create dynamic CSS
         */
        $.injectCSS({
            "#Footer": {
                "height": currentComponentHeight,
                "width": currentComponentWidth,
                "margin-left": currentComponentLeft,
                "margin-top": currentComponentTop,
                "background-color": "#333333",
                "position": "absolute"
            }
        }); // end of dynamic css
    };
    __decorate([
        core_1.HostListener('window:resize'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], FooterComponent.prototype, "onResize", null);
    FooterComponent = __decorate([
        core_1.Component({
            selector: 'footer',
            templateUrl: 'app/footer/footer.template.html'
        }), 
        __metadata('design:paramtypes', [http_1.Http, AspectRatioService_1.AspectRatioService])
    ], FooterComponent);
    return FooterComponent;
}());
exports.FooterComponent = FooterComponent;
//# sourceMappingURL=footer.component.js.map