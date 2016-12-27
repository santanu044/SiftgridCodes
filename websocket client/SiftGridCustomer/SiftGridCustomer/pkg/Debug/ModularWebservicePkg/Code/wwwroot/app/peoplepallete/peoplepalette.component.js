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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
/// <reference path="../../libs/gojs.d.ts" />
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var AspectRatioService_1 = require('../aspectratiocalculation/AspectRatioService');
var areaService_1 = require("../area/areaService");
var PeoplePaletteComponent = (function () {
    function PeoplePaletteComponent(aspectRatio, areaService, elementRef, http) {
        this.aspectRatio = aspectRatio;
        this.areaService = areaService;
        this.http = http;
        this.elementRef = elementRef;
    }
    PeoplePaletteComponent.prototype.ngOnInit = function () {
        // this.getCSSJSONData();
        this.CreatePeoplePalette();
    };
    PeoplePaletteComponent.prototype.onResize = function () {
        this.getCSSJSONData();
    };
    PeoplePaletteComponent.prototype.getCSSJSONData = function () {
        //this.http.get("app/css.json")
        //    //.map(this.extractData)
        //    .subscribe(json => {
        //        this.json = json.json();
        //        this.createDynamicCSS();
        //    });
        var _this = this;
        this.aspectRatio.GetCSSJSONData().subscribe(function (json) {
            _this.json = json;
            _this.createDynamicCSS();
        });
    };
    PeoplePaletteComponent.prototype.createDynamicCSS = function () {
        var deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        var UIBackgroundWidthJSON = (this.json["UIBackground"])["width"];
        var currentWidthRatio = this.aspectRatio.WidthRatio((this.json["UIBackground"])["width"], deviceWidth);
        var currentComponentWidth = this.aspectRatio.ComponentWidth(currentWidthRatio, (this.json["PeoplePalette"])["width"]);
        var currentComponentHeight = this.aspectRatio.ComponentHeight(currentComponentWidth, (this.json["PeoplePalette"])["height"] / (this.json["PeoplePalette"])["width"]);
        var currentComponentLeft = this.aspectRatio.ComponentLeft(currentWidthRatio, (this.json["PeoplePalette"])["left"]);
        var currentComponentTop = this.aspectRatio.ComponentTop(currentComponentLeft, (this.json["PeoplePalette"])["top"] / (this.json["PeoplePalette"])["left"]);
        /**
         * this is used to create dynamic CSS
         */
        $.injectCSS({
            "#PeoplePalette": {
                "height": currentComponentHeight,
                "width": currentComponentWidth,
                "margin-left": currentComponentLeft,
                "margin-top": currentComponentTop,
                "background": "rgba(65, 65, 65, 0.95)",
                "box-shadow": "0 0 2px 0 rgba(0, 0, 0, 0.12)",
                "border-radius": "6px"
            }
        }); // end of dynamic css
    };
    PeoplePaletteComponent.prototype.CreatePeoplePalette = function () {
        jQuery(this.elementRef.nativeElement).find('.draggable').draggable({ containment: '#draggable-parent' });
        var GO = go.GraphObject.make;
        var peoplePalette = GO(go.Palette, "myPeoplePaletteDiv");
        peoplePalette.nodeTemplate = GO(go.Node, "Auto", new go.Binding("text", "name"), 
        // bind the Part.layerName to control the Node's layer depending on whether it isSelected
        new go.Binding("layerName", "isSelected", function (sel) { return sel ? "Foreground" : ""; }).ofObject(), 
        // define the node's outer shape
        GO(go.Shape, "Rectangle", {
            name: "SHAPE", fill: "#424242", stroke: "grey", height: 54, width: 175,
            // set the port properties:
            portId: "", fromLinkable: true, toLinkable: true, cursor: "pointer"
        }), GO(go.Panel, "Horizontal", GO(go.Picture, {
            name: 'Picture',
            desiredSize: new go.Size(33, 33),
            margin: new go.Margin(6, 8, 6, 10),
        }, new go.Binding("source", "key", findHeadShot)), 
        // define the panel where the text will appear
        GO(go.Panel, "Table", {
            margin: new go.Margin(6, 10, 0, 3),
            defaultAlignment: go.Spot.Left
        }, GO(go.RowColumnDefinition, { column: 2, width: 4 }), GO(go.TextBlock, "Person: ", textStyle(), { row: 0, column: 0 }), GO(go.TextBlock, textStyle(), {
            row: 0, column: 1, columnSpan: 4,
            isMultiline: false,
            margin: new go.Margin(0, 0, 0, 3)
        }, new go.Binding("text", "title").makeTwoWay()), GO(go.TextBlock, "Title: ", textStyle(), { row: 1, column: 0 }), GO(go.TextBlock, textStyle(), {
            row: 1, column: 1, columnSpan: 4,
            isMultiline: false,
            margin: new go.Margin(0, 0, 0, 3)
        }, new go.Binding("text", "comments").makeTwoWay()))));
        //Group tamplate Start
        peoplePalette.groupTemplateMap.add("OfGroups", GO(go.Group, "Auto", {
            resizable: true,
            background: "transparent",
            // highlight when dragging into the Group
            computesBoundsAfterDrag: true,
            handlesDragDropForMembers: true,
            layout: GO(go.GridLayout, {
                wrappingColumn: 1, alignment: go.GridLayout.Position,
                cellSize: new go.Size(1, 1), spacing: new go.Size(4, 4)
            })
        }, new go.Binding("background", "isHighlighted", function (h) { return h ? "rgba(255,0,0,0.2)" : "transparent"; }).ofObject(), GO(go.Panel, "Vertical", GO(go.Panel, "Horizontal", { stretch: go.GraphObject.Horizontal, background: "#616161" }, GO("SubGraphExpanderButton", { alignment: go.Spot.TopLeft, margin: 1, height: 11, width: 11 }), GO(go.TextBlock, {
            alignment: go.Spot.Right,
            margin: 3,
            font: "bold 9px sans-serif",
            stroke: "white",
            height: 15
        }, new go.Binding("text", "text").makeTwoWay())), GO(go.Shape, "Rectangle", { fill: null, stroke: "#616161", strokeWidth: 2, height: 89, width: 175 }), GO(go.Placeholder, { padding: 5, alignment: go.Spot.TopLeft }))));
        //Group Template End
        peoplePalette.model.nodeDataArray = [
            { "key": 1, "text": "Person", title: " ", img: "../../images/PersonAvatarIcon.svg", color: "#F9A919", height: 54, width: 175, category: "detailed" },
            { "key": 2, "text": "Department", color: "#424242", height: 89, width: 175, "isGroup": true, category: "OfGroups" }
        ];
        // This converter is used by the Picture.
        function findHeadShot(key) {
            return "../../images/PersonAvatarIcon.svg";
        }
        function textStyle() {
            return { font: "9pt  Segoe UI,sans-serif", stroke: "white" };
        }
        function finishDrop(e, grp) {
            var ok = (grp !== null
                ? grp.addMembers(grp.diagram.selection, true)
                : e.diagram.commandHandler.addTopLevelParts(e.diagram.selection, true));
            if (!ok)
                e.diagram.currentTool.doCancel();
        }
        function highlightGroup(e, grp, show) {
            if (!grp)
                return;
            e.handled = true;
            if (show) {
                var tool = grp.diagram.toolManager.draggingTool;
                var map = tool.draggedParts || tool.copiedParts;
                if (grp.canAddMembers(map.toKeySet())) {
                    grp.isHighlighted = true;
                    return;
                }
            }
            grp.isHighlighted = false;
        }
        //GroupTamplate Starting
    };
    PeoplePaletteComponent.prototype.collapse = function () {
        document.getElementById("peoplePalette").style.visibility = "hidden";
        //this.palletVisibility = true;
    };
    __decorate([
        core_1.HostListener('window:resize'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], PeoplePaletteComponent.prototype, "onResize", null);
    PeoplePaletteComponent = __decorate([
        core_1.Component({
            selector: 'peoplepalette',
            templateUrl: 'app/peoplepallete/people.palette.component.html',
            styleUrls: ['app/peoplepallete/NewPeoplepalette.css']
        }),
        __param(2, core_1.Inject(core_1.ElementRef)), 
        __metadata('design:paramtypes', [AspectRatioService_1.AspectRatioService, areaService_1.AreaService, core_1.ElementRef, http_1.Http])
    ], PeoplePaletteComponent);
    return PeoplePaletteComponent;
}());
exports.PeoplePaletteComponent = PeoplePaletteComponent;
//# sourceMappingURL=peoplepalette.component.js.map