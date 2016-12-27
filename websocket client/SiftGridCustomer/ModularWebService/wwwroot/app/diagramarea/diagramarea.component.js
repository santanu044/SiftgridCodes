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
var UIBackground_component_1 = require('../UIBackground/UIBackground.component');
var areaService_1 = require("../area/areaService");
var AspectRatioService_1 = require('../aspectratiocalculation/AspectRatioService');
var diagramService_1 = require("../diagram/diagramService");
var DiagramAreaComponent = (function () {
    function DiagramAreaComponent(http, uiBackground, areaService, aspectRatio, diagramService) {
        var _this = this;
        this.http = http;
        this.uiBackground = uiBackground;
        this.areaService = areaService;
        this.aspectRatio = aspectRatio;
        this.diagramService = diagramService;
        this.showAreaDiagram = false;
        this.showDiagram = true;
        this.showPeopleDiagram = true;
        console.log(".inside DiagramAreaComponent cons");
        areaService.displayAreaPaletteDiagram$
            .subscribe(function (res) { return _this.displayAreaPaletteDiagram(); });
        areaService.displayDiagram$
            .subscribe(function (res) { return _this.displayDiagram(); });
        areaService.displayPeopleDiagram$
            .subscribe(function (res) { return _this.displayPeopleDiagram(); });
    }
    /**
     * this function is used to get device width
     */
    DiagramAreaComponent.prototype.ngOnInit = function () {
        console.log(".inside DiagramAreaComponent ngoninit");
        this.getCSSJSONData();
        this.FirstTabCreateForArea('areas');
        this.areaService.CreateAreasDiagram$.next('areas');
    };
    DiagramAreaComponent.prototype.getCSSJSONData = function () {
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
    DiagramAreaComponent.prototype.displayAreaPaletteDiagram = function () {
        this.showAreaDiagram = false;
        this.showPeopleDiagram = true;
        this.showDiagram = true;
    };
    DiagramAreaComponent.prototype.displayDiagram = function () {
        this.showDiagram = false;
        this.showAreaDiagram = true;
        this.showPeopleDiagram = true;
    };
    DiagramAreaComponent.prototype.displayPeopleDiagram = function () {
        this.showPeopleDiagram = false;
        this.showAreaDiagram = true;
        this.showDiagram = true;
    };
    DiagramAreaComponent.prototype.zoomIn = function () {
        this.diagramService.zoomControlObservable.next("zoomIn");
    };
    DiagramAreaComponent.prototype.zoomOut = function () {
        this.diagramService.zoomControlObservable.next("zoomOut");
    };
    DiagramAreaComponent.prototype.onResize = function () {
        if (!this.uiBackground.showEnterprisePane) {
            var deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
            var UIBackgroundWidthJSON = (this.json["UIBackground"])["width"];
            var currentWidthRatio = this.aspectRatio.WidthRatio((this.json["UIBackground"])["width"], deviceWidth);
            var currentComponentWidth = this.aspectRatio.ComponentWidth(currentWidthRatio, (this.json["SmallDiagramArea"])["width"]);
            var currentComponentHeight = this.aspectRatio.ComponentHeight(currentComponentWidth, (this.json["SmallDiagramArea"])["height"] / (this.json["SmallDiagramArea"])["width"]);
            var currentComponentLeft = this.aspectRatio.ComponentLeft(currentWidthRatio, (this.json["SmallDiagramArea"])["left"]);
            var currentComponentTop = this.aspectRatio.ComponentTop(currentComponentLeft, (this.json["SmallDiagramArea"])["top"] / (this.json["SmallDiagramArea"])["left"]);
        }
        else {
            this.getCSSJSONData();
        }
    };
    DiagramAreaComponent.prototype.createDynamicCSS = function () {
        var deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        var UIBackgroundWidthJSON = (this.json["UIBackground"])["width"];
        var currentWidthRatio = this.aspectRatio.WidthRatio((this.json["UIBackground"])["width"], deviceWidth);
        var currentComponentWidth = this.aspectRatio.ComponentWidth(currentWidthRatio, (this.json["DiagramArea"])["width"]);
        var currentComponentHeight = this.aspectRatio.ComponentHeight(currentComponentWidth, (this.json["DiagramArea"])["height"] / (this.json["DiagramArea"])["width"]);
        var currentComponentLeft = this.aspectRatio.ComponentLeft(currentWidthRatio, (this.json["DiagramArea"])["left"]);
        var currentComponentTop = this.aspectRatio.ComponentTop(currentComponentLeft, (this.json["DiagramArea"])["top"] / (this.json["DiagramArea"])["left"]);
        if (this.uiBackground.showEnterprisePane) {
            /**
             * this is used to create dynamic CSS
             */
            $.injectCSS({
                ".DiagramArea": {
                    "height": currentComponentHeight,
                    "width": currentComponentWidth,
                    "margin-left": currentComponentLeft,
                    "margin-top": currentComponentTop,
                    "position": "absolute"
                }
            }); // end of dynamic css
            var areaPalletcurrentWidthRatio = this.aspectRatio.WidthRatio((this.json["UIBackground"])["width"], deviceWidth);
            var areaPalletcurrentComponentWidth = this.aspectRatio.ComponentWidth(currentWidthRatio, (this.json["AreaPaneBig"])["width"]);
            var areaPalletcurrentComponentHeight = this.aspectRatio.ComponentHeight(currentComponentWidth, (this.json["AreaPaneBig"])["height"] / (this.json["AreaPaneBig"])["width"]);
            var areaPalletcurrentComponentLeft = this.aspectRatio.ComponentLeft(currentWidthRatio, (this.json["AreaPaneBig"])["left"]);
            var areaPalletcurrentComponentTop = this.aspectRatio.ComponentTop(currentComponentLeft, (this.json["AreaPaneBig"])["top"] / (this.json["AreaPaneBig"])["left"]);
            /**
             * this is used to create dynamic CSS
             */
            $.injectCSS({
                ".AreaPaneSmall": {
                    "height": areaPalletcurrentComponentHeight,
                    "width": areaPalletcurrentComponentWidth,
                    "margin-left": areaPalletcurrentComponentLeft,
                    "margin-top": areaPalletcurrentComponentTop,
                    "position": "absolute",
                }
            }); // end of dynamic css
        }
    };
    DiagramAreaComponent.prototype.FirstTabCreateForArea = function (GUID) {
        console.log("=> inside FirstTabCreateForArea");
        var self = this;
        self.addTabForArea(GUID);
        $('#tabs a.' + GUID).on('click', function () {
            self.displayAreaPaletteDiagram();
            self.areaService.displayAreaTree$.next(10);
            self.areaService.CreateAreasDiagram$.next('areas');
            // hide all other tabs
            $("#tabs li").removeClass("current");
            // show current tab
            $(this).parent().addClass("current");
        });
        $('#tabs a.remove').on('click', { 'class': GUID }, function (e) {
            $(this).parent().remove();
            var guid = e.data.class;
            // if there is no current tab and if there are still tabs left, show the first one
            if ($("#tabs li.current").length == 0 && $("#tabs li").length > 0) {
                // find the first tab
                var firsttab = $("#tabs li:first-child");
                firsttab.addClass("current");
                // get its link name and show related content
                var firsttabid = $(firsttab).find("a.tab").attr("id");
            }
        });
    };
    DiagramAreaComponent.prototype.addTabForArea = function (GUID) {
        var self = this;
        if ($("#" + GUID).length != 0) {
            $("#" + GUID).parent().remove();
        }
        $("#tabs li").removeClass("current");
        $("#tabs").append("<li class='current' style='cursor: pointer;'><a class='" + GUID + "' id='" + GUID + "' >" + "Areas" + "</a><a  class='remove'>x</a></li>");
    };
    __decorate([
        core_1.HostListener('window:resize'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], DiagramAreaComponent.prototype, "onResize", null);
    DiagramAreaComponent = __decorate([
        core_1.Component({
            selector: 'diagramarea',
            templateUrl: 'app/diagramarea/diagramarea.template.html',
            styleUrls: ['app/diagramarea/inputElementStyle.css']
        }), 
        __metadata('design:paramtypes', [http_1.Http, UIBackground_component_1.UIBackgroundComponent, areaService_1.AreaService, AspectRatioService_1.AspectRatioService, diagramService_1.DiagramService])
    ], DiagramAreaComponent);
    return DiagramAreaComponent;
}());
exports.DiagramAreaComponent = DiagramAreaComponent;
//# sourceMappingURL=diagramarea.component.js.map