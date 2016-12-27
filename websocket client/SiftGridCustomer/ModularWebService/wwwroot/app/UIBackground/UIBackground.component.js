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
require('rxjs/add/operator/map');
require('rxjs/add/operator/catch');
var areaService_1 = require('../area/areaService');
var AspectRatioService_1 = require('../aspectratiocalculation/AspectRatioService');
var UIBackgroundComponent = (function () {
    function UIBackgroundComponent(aspectRatio, areaService) {
        this.aspectRatio = aspectRatio;
        this.areaService = areaService;
        this.showEnterprisePane = false;
        this.showInfoPane = true;
        this.showDocumentPane = true;
        this.showErrorPane = true;
        this.showFuelConsumersPane = true;
        this.showNotesPane = true;
    }
    /**
     * this function is used to get device width
     */
    UIBackgroundComponent.prototype.ngOnInit = function () {
        this.getCSSJSONData();
    };
    UIBackgroundComponent.prototype.onResize = function () {
        this.getCSSJSONData();
    };
    UIBackgroundComponent.prototype.getCSSJSONData = function () {
        var _this = this;
        this.aspectRatio.GetCSSJSONData().subscribe(function (json) {
            _this.json = json;
            _this.createDynamicCSS();
            _this.showEnterprisePane1();
        });
    };
    UIBackgroundComponent.prototype.createDynamicCSS = function () {
        var deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        var UIBackgroundWidthJSON = (this.json["UIBackground"])["width"];
        var currentWidthRatio = this.aspectRatio.WidthRatio((this.json["UIBackground"])["width"], deviceWidth);
        var currentComponentWidth = this.aspectRatio.ComponentWidth(currentWidthRatio, (this.json["EnteprisePane"])["width"]);
        var currentComponentHeight = this.aspectRatio.ComponentHeight(currentComponentWidth, (this.json["EnteprisePane"])["height"] / (this.json["EnteprisePane"])["width"]);
        var currentComponentLeft = this.aspectRatio.ComponentLeft(currentWidthRatio, (this.json["EnteprisePane"])["left"]);
        var currentComponentTop = this.aspectRatio.ComponentTop(currentComponentLeft, (this.json["EnteprisePane"])["top"] / (this.json["EnteprisePane"])["left"]);
        /**
         * this is used to create dynamic CSS
         */
        $.injectCSS({
            "#UIBackground": {
                height: 1024,
                width: deviceWidth,
                left: 0,
                top: 0,
                position: "absolute"
            },
            "#container": {
                height: 1024,
                width: deviceWidth,
                left: 0,
                top: 0,
                position: "absolute"
            }
        }); // end of dynamic css
    };
    UIBackgroundComponent.prototype.showEnterprisePane1 = function () {
        //console.log("..inside UIBackgroundComponent showEnterprisePane1().");
        //console.log("===> showEnterprisePane is true");
        //this.ui.showEnterprisePane = false;
        //this.ui.showDocumentPane = true;
        //this.ui.showErrorPane = true;
        //this.ui.showFuelConsumersPane = true;    
        var deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        var UIBackgroundWidthJSON = (this.json["UIBackground"])["width"];
        var currentWidthRatio = this.aspectRatio.WidthRatio((this.json["UIBackground"])["width"], deviceWidth);
        var currentComponentWidth = this.aspectRatio.ComponentWidth(currentWidthRatio, (this.json["SmallDiagramArea"])["width"]);
        var currentComponentHeight = this.aspectRatio.ComponentHeight(currentComponentWidth, (this.json["SmallDiagramArea"])["height"] / (this.json["SmallDiagramArea"])["width"]);
        var currentComponentLeft = this.aspectRatio.ComponentLeft(currentWidthRatio, (this.json["SmallDiagramArea"])["left"]);
        var currentComponentTop = this.aspectRatio.ComponentTop(currentComponentLeft, (this.json["SmallDiagramArea"])["top"] / (this.json["SmallDiagramArea"])["left"]);
        $.injectCSS({
            ".DiagramArea": {
                "height": currentComponentHeight,
                "width": currentComponentWidth,
                "margin-left": currentComponentLeft,
                "margin-top": currentComponentTop,
                "position": "absolute",
                "z-index": 0,
            }
        });
        var areaPalletcurrentWidthRatio = this.aspectRatio.WidthRatio((this.json["UIBackground"])["width"], deviceWidth);
        var areaPalletcurrentComponentWidth = this.aspectRatio.ComponentWidth(currentWidthRatio, (this.json["AreaPaneSmall"])["width"]);
        var areaPalletcurrentComponentHeight = this.aspectRatio.ComponentHeight(currentComponentWidth, (this.json["AreaPaneSmall"])["height"] / (this.json["AreaPaneSmall"])["width"]);
        var areaPalletcurrentComponentLeft = this.aspectRatio.ComponentLeft(currentWidthRatio, (this.json["AreaPaneSmall"])["left"]);
        var areaPalletcurrentComponentTop = this.aspectRatio.ComponentTop(currentComponentLeft, (this.json["AreaPaneSmall"])["top"] / (this.json["AreaPaneSmall"])["left"]);
        /**
         * this is used to create dynamic CSS
         */
        $.injectCSS({
            ".AreaPaneSmall": {
                "height": areaPalletcurrentComponentHeight,
                "width": areaPalletcurrentComponentWidth,
                "margin-left": areaPalletcurrentComponentLeft,
                "margin-top": areaPalletcurrentComponentTop,
                "position": "absolute"
            }
        }); // end of dynamic css
        var areaDiagramcurrentWidthRatio = this.aspectRatio.WidthRatio((this.json["UIBackground"])["width"], deviceWidth);
        var areaDiagramcurrentComponentWidth = this.aspectRatio.ComponentWidth(currentWidthRatio, (this.json["AreaDiagramSmall"])["width"]);
        var areaDiagramcurrentComponentHeight = this.aspectRatio.ComponentHeight(currentComponentWidth, (this.json["AreaDiagramSmall"])["height"] / (this.json["AreaDiagramSmall"])["width"]);
        var areaDiagramcurrentComponentLeft = this.aspectRatio.ComponentLeft(currentWidthRatio, (this.json["AreaDiagramSmall"])["left"]);
        var areaDiagramcurrentComponentTop = this.aspectRatio.ComponentTop(currentComponentLeft, (this.json["AreaDiagramSmall"])["top"] / (this.json["AreaDiagramSmall"])["left"]);
        /**
         * this is used to create dynamic CSS
         */
        $.injectCSS({
            ".AreaDiagram": {
                "height": areaDiagramcurrentComponentHeight,
                "width": areaDiagramcurrentComponentWidth,
                "margin-left": areaDiagramcurrentComponentLeft,
                "margin-top": areaPalletcurrentComponentHeight,
                "position": "absolute",
            }
        });
    };
    __decorate([
        core_1.HostListener('window:resize'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], UIBackgroundComponent.prototype, "onResize", null);
    UIBackgroundComponent = __decorate([
        core_1.Component({
            selector: 'UIBackground',
            templateUrl: 'app/UIBackground/uibackground.template.html'
        }), 
        __metadata('design:paramtypes', [AspectRatioService_1.AspectRatioService, areaService_1.AreaService])
    ], UIBackgroundComponent);
    return UIBackgroundComponent;
}());
exports.UIBackgroundComponent = UIBackgroundComponent;
//# sourceMappingURL=UIBackground.component.js.map