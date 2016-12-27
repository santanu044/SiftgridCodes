/// <reference path="../../libs/gojs.d.ts" />
import {Component, AfterViewInit, OnInit, Inject, ElementRef,  ViewChild, Directive, HostListener } from '@angular/core';
import {AspectRatioService} from '../aspectratiocalculation/AspectRatioService'
import { AreaService} from "../area/areaService";
import {Http, Response} from '@angular/http';

declare var jQuery: any;
declare var $: any;

@Component({
    selector: 'newareapalette',
    templateUrl: 'app/NewAreaPallet/newareapalette.component.html',
    styleUrls: ['app/NewAreaPallet/NewAreapalette.css']
})

export class NewAreaPaletteComponent implements OnInit {
    diagramDiv;
    elementRef: ElementRef;
    @ViewChild("myNewAreaPaletteDiv") div;
    json: Object;

    constructor(public aspectRatio: AspectRatioService,
        private areaService: AreaService, @Inject(ElementRef) elementRef: ElementRef,public http: Http) {
        console.log(".inside DiagramAreaComponent cons");
        console.log(this.diagramDiv);
        this.elementRef = elementRef;
        console.log(this.elementRef.nativeElement);
     }

    ngOnInit() {
       // this.getCSSJSONData();
        this.CreateAreaPalette();
    }

    @HostListener('window:resize')
    onResize() {
        this.getCSSJSONData();
    }

    getCSSJSONData() {
        //this.http.get("app/css.json")
        //    //.map(this.extractData)
        //    .subscribe(json => {
        //        this.json = json.json();
        //        this.createDynamicCSS();
        //    });
        this.aspectRatio.GetCSSJSONData().subscribe(json => {
            this.json = json;
            this.createDynamicCSS();
        })
    }

    createDynamicCSS() {

        let deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        let UIBackgroundWidthJSON = (this.json["UIBackground"])["width"];
        let currentWidthRatio = this.aspectRatio.WidthRatio((this.json["UIBackground"])["width"], deviceWidth);
        let currentComponentWidth = this.aspectRatio.ComponentWidth(currentWidthRatio, (this.json["AreasCategoryExpanded"])["width"]);
        let currentComponentHeight = this.aspectRatio.ComponentHeight(currentComponentWidth, (this.json["AreasCategoryExpanded"])["height"] / (this.json["AreasCategoryExpanded"])["width"]);
        let currentComponentLeft = this.aspectRatio.ComponentLeft(currentWidthRatio, (this.json["AreasCategoryExpanded"])["left"]);
        let currentComponentTop = this.aspectRatio.ComponentTop(currentComponentLeft, (this.json["AreasCategoryExpanded"])["top"] / (this.json["AreasCategoryExpanded"])["left"]);

        /**
         * this is used to create dynamic CSS
         */
        $.injectCSS({
            ".AreasCategoryExpanded": {
                "height": currentComponentHeight,
                "width": currentComponentWidth,
                "margin-left": currentComponentLeft,
                "margin-top": currentComponentTop,
                "box-shadow": "inset 0 - 1px 0 0 rgba(255, 255, 255, 0.20), inset 0 0 5px 0 rgba(0,0,0,0.40)",
                "border-radius": "6px",
                "background": "rgba(51, 51, 51, 0.25)"
                 }
        }); // end of dynamic css

    }
    CreateAreaPalette() {

        jQuery(this.elementRef.nativeElement).find('.draggable').draggable({ containment: '#draggable-parent' });
        const GO = go.GraphObject.make;
        this.diagramDiv = document.getElementById("myAreaPaletteDiv");
        console.log("Inside New Area Pallet ");
        var areaPalette = GO(go.Palette, this.diagramDiv);

        var nodeResizeAdornmentTemplate =
            GO(go.Adornment, "Spot",
                { locationSpot: go.Spot.Right },
                GO(go.Placeholder),
                GO(go.Shape, { alignment: go.Spot.TopLeft, cursor: "nw-resize", desiredSize: new go.Size(9, 9), fill: "deepskyblue", stroke: "black" }),
                GO(go.Shape, { alignment: go.Spot.TopRight, cursor: "ne-resize", desiredSize: new go.Size(9, 9), fill: "deepskyblue", stroke: "black" }),

                GO(go.Shape, { alignment: go.Spot.BottomLeft, cursor: "se-resize", desiredSize: new go.Size(9, 9), fill: "deepskyblue", stroke: "black" }),
                GO(go.Shape, { alignment: go.Spot.BottomRight, cursor: "sw-resize", desiredSize: new go.Size(9, 9), fill: "deepskyblue", stroke: "black" })
            );

        areaPalette.nodeTemplate =
            GO(go.Node, "Auto",
                { resizable: true, resizeObjectName: "Rectangle", resizeAdornmentTemplate: nodeResizeAdornmentTemplate, selectionAdorned: true },
                GO(go.Shape, "Rectangle",
                    { fill: "#ACE600", stroke: null },
                    new go.Binding("fill", "color"),
                    new go.Binding("height", "height"),
                    new go.Binding("width", "width")
                ),
                GO(go.TextBlock,
                    {
                        margin: 5,
                        editable: true,
                        font: "bold 9px sans-serif",
                        opacity: 0.75,
                        stroke: "white",
                        height: 15,
                    },
                    new go.Binding("text", "text").makeTwoWay())
            );

        //Group tamplate Start

        var self = this;
        areaPalette.groupTemplateMap.add("OfGroups",
            GO(go.Group, "Auto",
                {
                    resizable: true,
                    background: "transparent",
                    // highlight when dragging into the Group
                    computesBoundsAfterDrag: true,
                    handlesDragDropForMembers: true,
                    layout:
                    GO(go.GridLayout,
                        {
                            wrappingColumn: 1, alignment: go.GridLayout.Position,
                            cellSize: new go.Size(1, 1), spacing: new go.Size(4, 4)
                        })
                },
                new go.Binding("background", "isHighlighted", function (h) { return h ? "rgba(255,0,0,0.2)" : "transparent"; }).ofObject(),
                GO(go.Panel, "Vertical",
                    GO(go.Panel, "Horizontal",
                        { stretch: go.GraphObject.Horizontal, background: "#616161" },
                        GO("SubGraphExpanderButton",
                            { alignment: go.Spot.TopLeft, margin: 1, height: 11, width: 11 }),
                        GO(go.TextBlock,
                            {
                                alignment: go.Spot.Right,
                                editable: true,
                                margin: 3,
                                font: "bold 9px sans-serif",
                                opacity: 0.75,
                                stroke: "white",
                                height: 15,
                                width: 150
                            },
                            new go.Binding("text", "text").makeTwoWay())
                    ),
                    GO(go.Shape, "Rectangle",
                        { fill: null, stroke: "#616161", strokeWidth: 2, height: 89, width: 175 }),
                    GO(go.Placeholder,
                        { padding: 5, alignment: go.Spot.TopLeft })
                )
            ));

        //Group Template End

        areaPalette.model.nodeDataArray = [
            { "key": 1, "text": "CONVENTIONAL GAS", color: "#F9A919", height: 37, width: 175, top: 25, left: 45 },
            { "key": 2, "text": "HEAVY OIL", color: "#2E7D32", height: 37, width: 175, top: 82, left: 45 },
            { "key": 3, "text": "CONVENTIONAL OIL", color: "#4CAF50", height: 37, width: 175, top: 139, left: 45 },
            { "key": 4, "text": "OIL SANDS", color: "#81C784", height: 37, width: 175, top: 196, left: 45 },
            { "key": 5, "text": "OFF-SHORE", color: "#42A5F5", height: 37, width: 175, top: 253, left: 45 },
            { "key": 6, "text": "GROUP", color: "#424242", height: 89, width: 175, top: 310, left: 45, "isGroup": true, category: "OfGroups" }
        ];



        function finishDrop(e, grp) {
            var ok = (grp !== null
                ? grp.addMembers(grp.diagram.selection, true)
                : e.diagram.commandHandler.addTopLevelParts(e.diagram.selection, true));
            if (!ok) e.diagram.currentTool.doCancel();
        }



        function highlightGroup(e, grp, show) {
            if (!grp) return;
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

    }
    collapse() {
        document.getElementById("newPalette").style.visibility = "hidden";
        //this.palletVisibility = true;
    }

   
}