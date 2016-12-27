/// <reference path="../../libs/gojs.d.ts" />
import {Component, AfterViewInit, OnInit, ViewChild, Directive, HostListener, Inject, ElementRef} from '@angular/core';
import {Http, Response} from '@angular/http';
import {AspectRatioService} from '../aspectratiocalculation/AspectRatioService'
import { AreaService} from "../area/areaService";
declare var jQuery: any;
declare var $: any;

@Component({
    selector: 'peoplepalette',
    templateUrl: 'app/peoplepallete/people.palette.component.html',
    styleUrls: ['app/peoplepallete/NewPeoplepalette.css']
})
export class PeoplePaletteComponent implements OnInit {
    elementRef: ElementRef;
    json: Object;
    areaPalette: go.Diagram;
    constructor(public aspectRatio: AspectRatioService,
        private areaService: AreaService, @Inject(ElementRef) elementRef: ElementRef, public http: Http) {
        this.elementRef = elementRef;
    }

    ngOnInit() {
       // this.getCSSJSONData();
        this.CreatePeoplePalette();
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
        let currentComponentWidth = this.aspectRatio.ComponentWidth(currentWidthRatio, (this.json["PeoplePalette"])["width"]);
        let currentComponentHeight = this.aspectRatio.ComponentHeight(currentComponentWidth, (this.json["PeoplePalette"])["height"] / (this.json["PeoplePalette"])["width"]);
        let currentComponentLeft = this.aspectRatio.ComponentLeft(currentWidthRatio, (this.json["PeoplePalette"])["left"]);
        let currentComponentTop = this.aspectRatio.ComponentTop(currentComponentLeft, (this.json["PeoplePalette"])["top"] / (this.json["PeoplePalette"])["left"]);

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
    }

    CreatePeoplePalette() {
        jQuery(this.elementRef.nativeElement).find('.draggable').draggable({ containment: '#draggable-parent' });

           const GO = go.GraphObject.make;
           var peoplePalette = GO(go.Palette, "myPeoplePaletteDiv");
            peoplePalette.nodeTemplate = GO(go.Node, "Auto",
                new go.Binding("text", "name"),
                // bind the Part.layerName to control the Node's layer depending on whether it isSelected
                new go.Binding("layerName", "isSelected", function (sel) { return sel ? "Foreground" : ""; }).ofObject(),
                // define the node's outer shape
                GO(go.Shape, "Rectangle",
                    {
                        name: "SHAPE", fill: "#424242", stroke: "grey", height: 54, width: 175,
                        // set the port properties:
                        portId: "", fromLinkable: true, toLinkable: true, cursor: "pointer"
                    }),
                GO(go.Panel, "Horizontal",
                    GO(go.Picture,
                        {
                            name: 'Picture',
                            desiredSize: new go.Size(33, 33),
                            margin: new go.Margin(6, 8, 6, 10),
                        },
                        new go.Binding("source", "key", findHeadShot)),
                    // define the panel where the text will appear
                    GO(go.Panel, "Table",
                        {
                            margin: new go.Margin(6, 10, 0, 3),
                            defaultAlignment: go.Spot.Left
                        },
                        GO(go.RowColumnDefinition, { column: 2, width: 4 }),

                        GO(go.TextBlock, "Person: ", textStyle(),
                            { row: 0, column: 0 }),
                        GO(go.TextBlock, textStyle(),
                            {
                                row: 0, column: 1, columnSpan: 4,
                                isMultiline: false,
                                margin: new go.Margin(0, 0, 0, 3)
                            },
                            new go.Binding("text", "title").makeTwoWay()),
                        GO(go.TextBlock, "Title: ", textStyle(),
                            { row: 1, column: 0 }),
                        GO(go.TextBlock, textStyle(),
                            {
                                row: 1, column: 1, columnSpan: 4,
                                isMultiline: false,
                                margin: new go.Margin(0, 0, 0, 3)
                            },

                            new go.Binding("text", "comments").makeTwoWay())
                    )));

            //Group tamplate Start

            peoplePalette.groupTemplateMap.add("OfGroups",
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
                                    margin: 3,
                                    font: "bold 9px sans-serif",
                                    stroke: "white",
                                    height: 15
                                    //width: 150
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
        document.getElementById("peoplePalette").style.visibility = "hidden";
        //this.palletVisibility = true;
    }
    }

