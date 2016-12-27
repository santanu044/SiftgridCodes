/// <reference path="porthelpers.ts" />
/// <reference path="porthelpers.ts" />
/// <reference path="../../libs/gojs.d.ts" />
/// <reference path="../../libs/jquery.d.ts" />
import {Component, Injectable, Output, EventEmitter, AfterViewInit, OnInit, ViewChild, Directive, Input} from "@angular/core"
import {IconsComponent} from "./icons"
import { DiagramService} from "./diagramService"
import {NotesService} from '../notes/notesService'
import {Guid} from "../area/guid"
import {AreaService} from '../area/areaService'
import {AspectRatioService} from '../aspectratiocalculation/AspectRatioService'
import {Authenticator} from '../auth/Authenticator';
import {Observable} from "rxjs/Rx"
import {DiagramData} from "./DiagramData"
import {LocationData} from "./LocationData"
import { SearchService} from "../search/searchService";
import {TimeMachineService} from '../datepicker/TimeMachineService';
import {ErrorService} from '../errorpane/errorService';
import {PortHelpers} from './PortHelpers';
import {CustomDraggingTool} from './CustomDraggingTool';
import {CustomLinkingTool} from "./CustomLinkingTool"
import { ChatService} from '../websocket/chat.service';
import {NodeType} from './NodeType'


@Component({
    selector: "diagram",
    templateUrl: 'app/diagram/diagram.component.html',
    styleUrls: ["/inputElementStyle.css"]
})
/// <summary>
/// Intialize Diagram Object and Adding properties to the modelData.
/// </summary>

export class DiagramComponent implements OnInit{

    
    myDiagram: go.Diagram;
    diagramTree: go.Diagram;
    diagramName;
    @ViewChild("myDiagramDiv") div;
    notesInspector: NotesService;
    selectedPartInfo;
    guid: String;
    locationId: String;
    myTreeView: go.Diagram;
    diagramData: DiagramData
    myOverview: go.Diagram;

    /// <summary>
    /// Injecting Inspector to the Diagram component
    /// </summary>
    /// <param name="inspector">Contains angular http post and get methods.</param>
    constructor(private inspector: DiagramService, notesInspector: NotesService, private searchService: SearchService,
        public areaService: AreaService, public aspectRatio: AspectRatioService, public _authenticator: Authenticator,
        public errorService: ErrorService, public timeservice: TimeMachineService, private chatService: ChatService) {

        this.notesInspector = notesInspector;
        this.inspector.diagramTypeObservable.next("diagram");
      
        chatService.messages.subscribe(msg => {
            console.log(msg);
            console.log(msg.deviceid);
            var linkData = (<go.GraphLinksModel>this.myDiagram.model).findLinkDataForKey(msg.pipelineid);
            var nodeData1 = linkData
            console.log(nodeData1);
            this.myDiagram.startTransaction("changing diagram color");
            this.myDiagram.model.setDataProperty(nodeData1, "color", "red");
            this.myDiagram.commitTransaction("changing diagram color");

            var timer = Observable.create(function (observer: any) {
                setTimeout(() => {
                    observer.next('black');
                }, 10000);
            });

            timer.subscribe(
                (e: any) => {
                    console.log(e)
                    this.myDiagram.startTransaction("changing diagram black color");
                    this.myDiagram.model.setDataProperty(nodeData1, "color", e)
                    this.myDiagram.commitTransaction("changing diagram black color");
                });
            // var nmessage = {
            //     deviceid: '',
            //     pipelineid:'f3031f71',
            //     meter_value: ''
            // }
            // this.chatService.messages.next(nmessage);	
        });
    }

    public sendMsg() {
        var nmessage = {
            deviceid: '',
            pipelineid: '42f9f1ac',
            meter_value: ''
        }
        this.chatService.messages.next(nmessage);
    }

    ngOnInit() {
        var $ = go.GraphObject.make;
        var myDiagram: go.Diagram = $(go.Diagram, "diagramDiv",
            {
                "commandHandler.archetypeGroupData": { name: "Group", text: "Group", nodeType: "Boundary", isGroup: true, color: "blue" },
                allowDrop: true, "relinkingTool.isUnconnectedLinkValid": true, "draggingTool.dragsLink": true,
                "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
                "relinkingTool.portGravity": 20,
                "relinkingTool.fromHandleArchetype":
                $(go.Shape, "Circle",
                    {
                        segmentIndex: 0, cursor: "pointer", desiredSize: new go.Size(8, 8),
                        fill: "deepskyblue", stroke: "black"
                    }),
                "relinkingTool.toHandleArchetype":
                $(go.Shape, "Circle",
                    {
                        segmentIndex: -1, cursor: "pointer", desiredSize: new go.Size(8, 8),
                        fill: "deepskyblue", stroke: "black"
                    }),
                "linkReshapingTool.handleArchetype":
                $(go.Shape, "Square",
                    {
                        desiredSize: new go.Size(7, 7),
                        fill: "yellow", stroke: "black"
                    })
            });
        this.myDiagram = myDiagram
        var self = this;

        var nodeRotateAdornmentTemplate =
            $(go.Adornment,
                { locationSpot: go.Spot.Center },
                $(go.Shape, "Circle", { cursor: "pointer", desiredSize: new go.Size(9, 9), fill: "yellow", stroke: "black" })
            );

        myDiagram.nodeTemplate =
            $(go.Node, "Auto",
                {
                    resizable: true,
                    //    resizeAdornmentTemplate: nodeResizeAdornmentTemplate, selectionAdorned: true,
                    //   mouseDrop: function (e, nod) { finishDrop(e, nod.containingGroup); }
                },
                {
                    rotatable: true,
                    rotateAdornmentTemplate: nodeRotateAdornmentTemplate
                },
                new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                { contextMenu: $(go.Adornment) },
                $(go.Shape, { fill: "white", stroke: "black", strokeWidth: 2 },
                    new go.Binding("stroke", "color"),
                    new go.Binding("fill", "dColor"),
                    new go.Binding("width", "width"),
                    new go.Binding("height", "height"),
                    new go.Binding("geometryString", "name", self.geoFunc),
                    {
                        //portId: "", cursor: "pointer", fromLinkable: true, fromLinkableSelfNode: true, fromLinkableDuplicates: true,
                        //toLinkable: true, toLinkableSelfNode: true, toLinkableDuplicates: true
                    }),
                $(go.TextBlock, { margin: 5, text: "" }),
                this.makePort("T", go.Spot.Top, true, true),
                this.makePort("L", go.Spot.Left, true, true),
                this.makePort("R", go.Spot.Right, true, true),
                this.makePort("B", go.Spot.Bottom, true, false),
                {
                    mouseEnter: function (e: any, node: any) { self.showSmallPorts(node, true); },
                    mouseLeave: function (e: any, node: any) { self.showSmallPorts(node, false); },
                    toolTip:
                    $(go.Adornment, "Auto",
                        $(go.Shape, { fill: "#FFFFCC" }),
                        $(go.TextBlock, { margin: 2 },  // the tooltip shows the result of calling nodeInfo(data)
                            new go.Binding("text", "name"))
                    )
                }

            )

        go.Shape.defineArrowheadGeometry("ArrowFromArrow", "F1M5,1L0,5 5,9z");
        go.Shape.defineArrowheadGeometry("BlindedFromArrow", "F1M7.5,18.75L7.5,0 M0,18.75L0,0");
        go.Shape.defineArrowheadGeometry("CappedFromArrow", "F1M7.5,0L0,0 0,18.75 7.5,18.75");
        go.Shape.defineArrowheadGeometry("ArrowToArrow", "F1M0,1L5,5 0,9z");
        go.Shape.defineArrowheadGeometry("BlindedToArrow", "F1M7.5,18.75L7.5,0 M0,18.75L0,0");
        go.Shape.defineArrowheadGeometry("CappedToArrow", "F1M0,0L7.5,0 7.5,18.75 0,18.75");


        myDiagram.linkTemplate =
            $(go.Link,
                {
                    routing: go.Link.Orthogonal,
                    corner: 5,
                    curve: go.Link.JumpOver,
                    toShortLength: 2
                },
                {
                    selectable: true
                },
                {
                    reshapable: true, resegmentable: true, fromEndSegmentDirection: go.Node.DirectionRotatedNodeOrthogonal,
                    toEndSegmentDirection: go.Node.DirectionRotatedNodeOrthogonal
                },
                { adjusting: go.Link.Stretch },
                { toShortLength: 3, relinkableFrom: true, relinkableTo: true },
                new go.Binding("points", "points").makeTwoWay(),
                // allow the user to relink existing links
                $(go.Shape, { name: "LSHAPE", strokeWidth: 3, stroke: "black" }, new go.Binding("stroke", "color")
                ),
                $(go.Shape, { fromArrow: "", stroke: "black" },
                    new go.Binding("fromArrow", "fromArrow").makeTwoWay(), new go.Binding("stroke", "color")
                ),
                $(go.Shape, { toArrow: "Triangle", name: "LARROW", stroke: "black" },
                    new go.Binding("toArrow", "toArrow").makeTwoWay()
                )
            );

        var lollipop = $(go.Link,
            {
                selectable: true,
                movable: false,
                reshapable: true,
                deletable: false,
                selectionAdorned: true,
                routing: go.Link.Normal,
                curve: go.Link.None, corner: 0,
                fromEndSegmentLength: 0,
                toEndSegmentLength: 0,
                fromEndSegmentDirection: go.Node.DirectionRotatedNodeOrthogonal,
                toEndSegmentDirection: go.Node.DirectionRotatedNodeOrthogonal,
                toShortLength: 0,
                relinkableFrom: false,
                relinkableTo: false
                // if a node from the Palette is dropped on a link, the link is replaced by links to and from the new node
            },
            //{ routing: go.Link.Orthogonal },  // optional, but need to keep LinkingTool.temporaryLink in sync, above
            new go.Binding("points", "points").makeTwoWay(),
            $(go.Shape, { strokeWidth: 2 }, this.shapeStyle())
        );
        myDiagram.linkTemplateMap.add("lollipop", lollipop)
        myDiagram.model = go.Model.fromJson({
            "class": "go.GraphLinksModel",
            "nodeKeyProperty": "uuid",
            "linkKeyProperty": "uuid",
            "linkFromPortIdProperty": "fromPort",
            "linkToPortIdProperty": "toPort",
            "nodeDataArray": [
                { "name": "gas", "type": "well", "pColor": "#808080", "dColor": "white", "color": "black", "width": 50, "height": 50, "loc": "19 177", "category": "wellUWI", "key": -1, "uuid": "71a49f86" },
                { "key": 5, "name": "separator", "type": "tank", "pColor": "#808080", "dColor": "white", "color": "black", "width": 40, "height": 90, "label": "SEP", "category": "separator", "uuid": "ad1a82c4", "loc": "145 157" },
                { "key": 2, "name": "turbine", "type": "meter", "pColor": "#808080", "dColor": "white", "color": "black", "width": 50, "height": 50, "uuid": "2688e449", "loc": "274 108" },
                { "key": 2, "name": "turbine", "type": "meter", "pColor": "#808080", "dColor": "white", "color": "black", "width": 50, "height": 50, "uuid": "fb3489b5", "loc": "428 108" },
                { "key": 2, "name": "turbine", "type": "meter", "pColor": "#808080", "dColor": "white", "color": "black", "width": 50, "height": 50, "uuid": "eb63b6e6", "loc": "556 108" },
                { "key": 2, "name": "turbine", "type": "meter", "pColor": "#808080", "dColor": "white", "color": "black", "width": 50, "height": 50, "uuid": "3d1dbb98", "loc": "277 283" },
                { "key": 2, "name": "turbine", "type": "meter", "pColor": "#808080", "dColor": "white", "color": "black", "width": 50, "height": 50, "uuid": "8ef7bd17", "loc": "425 283" },
                { "key": 2, "name": "turbine", "type": "meter", "pColor": "#808080", "dColor": "white", "color": "black", "width": 50, "height": 50, "uuid": "4075dfda", "loc": "552 283" },
                { "key": 12, "name": "localMounted", "type": "meter", "pColor": "#808080", "dColor": "white", "color": "black", "width": 50, "height": 50, "locationSpot": { "class": "go.Spot", "x": 0.5, "y": 0.5, "offsetX": 0, "offsetY": 0 }, "category": "localReadOut", "uuid": "51e4af0f", "loc": "552 208" },
                { "key": 12, "name": "localMounted", "type": "meter", "pColor": "#808080", "dColor": "white", "color": "black", "width": 50, "height": 50, "locationSpot": { "class": "go.Spot", "x": 0.5, "y": 0.5, "offsetX": 0, "offsetY": 0 }, "category": "localReadOut", "uuid": "2f78e32b", "loc": "425 201" },
                { "key": 15, "name": "samplePoint", "type": "meter", "pColor": "#808080", "dColor": "white", "color": "black", "width": 50, "height": 50, "category": "samplePoint", "uuid": "f23388c9", "loc": "277 204" },
                { "key": 12, "name": "localMounted", "type": "meter", "pColor": "#808080", "dColor": "white", "color": "black", "width": 50, "height": 50, "locationSpot": { "class": "go.Spot", "x": 0.5, "y": 0.5, "offsetX": 0, "offsetY": 0 }, "category": "localReadOut", "uuid": "3a0d5979", "loc": "556 25" },
                { "key": 12, "name": "localMounted", "type": "meter", "pColor": "#808080", "dColor": "white", "color": "black", "width": 50, "height": 50, "locationSpot": { "class": "go.Spot", "x": 0.5, "y": 0.5, "offsetX": 0, "offsetY": 0 }, "category": "localReadOut", "uuid": "01bf19e5", "loc": "428 21" },
                { "key": 12, "name": "localMounted", "type": "meter", "pColor": "#808080", "dColor": "white", "color": "black", "width": 50, "height": 50, "locationSpot": { "class": "go.Spot", "x": 0.5, "y": 0.5, "offsetX": 0, "offsetY": 0 }, "category": "localReadOut", "uuid": "40ff84c1", "loc": "274 15" },
                { "key": 4, "name": "tank", "type": "tank", "pColor": "#808080", "dColor": "white", "color": "black", "width": 85, "height": 65, "uuid": "41b4c16a", "loc": "625 372" }
            ],
            "linkDataArray": [
                { "from": "40ff84c1", "to": "2688e449", "fromPort": "B", "toPort": "T", "uuid": "726dc546", "points": [300, 67, 300, 77, 300, 87.5, 300, 87.5, 300, 98, 300, 108] },
                { "from": "01bf19e5", "to": "fb3489b5", "fromPort": "B", "toPort": "T", "uuid": "f3031f71", "points": [454, 73, 454, 83, 454, 91, 454, 91, 454, 98, 454, 108] },
                { "from": "3a0d5979", "to": "eb63b6e6", "fromPort": "B", "toPort": "T", "uuid": "6ef4d5d8", "points": [582, 77, 582, 87, 582, 92.5, 582, 92.5, 582, 98, 582, 108] },
                { "from": "f23388c9", "to": "3d1dbb98", "fromPort": "B", "toPort": "T", "uuid": "bc502c86", "points": [303, 256, 303, 266, 303, 269.5, 303, 269.5, 303, 273, 303, 283] },
                { "from": "2f78e32b", "to": "8ef7bd17", "fromPort": "B", "toPort": "T", "uuid": "6bef0bce", "points": [451, 253, 451, 263, 451, 268, 451, 268, 451, 273, 451, 283] },
                { "from": "51e4af0f", "to": "4075dfda", "fromPort": "B", "toPort": "T", "uuid": "771c12b9", "points": [578, 260, 578, 270, 578, 271.5, 578, 271.5, 578, 273, 578, 283] },
                { "from": "ad1a82c4", "to": "2688e449", "fromPort": "T", "toPort": "L", "uuid": "42f9f1ac", "points": [166, 157, 166, 147, 166, 134, 215, 134, 264, 134, 274, 134] },
                { "from": "ad1a82c4", "to": "3d1dbb98", "fromPort": "B", "toPort": "L", "uuid": "fc32ee95", "points": [166, 249, 166, 259, 166, 309, 216.5, 309, 267, 309, 277, 309] },
                { "from": "2688e449", "to": "fb3489b5", "fromPort": "R", "toPort": "L", "uuid": "8a0aa29d", "points": [326, 134, 336, 134, 377, 134, 377, 134, 418, 134, 428, 134] },
                { "from": "fb3489b5", "to": "eb63b6e6", "fromPort": "R", "toPort": "L", "uuid": "10a65b04", "points": [480, 134, 490, 134, 518, 134, 518, 134, 546, 134, 556, 134] },
                { "from": "8ef7bd17", "to": "4075dfda", "fromPort": "R", "toPort": "L", "uuid": "c40d5b87", "points": [477, 309, 487, 309, 514.5, 309, 514.5, 309, 542, 309, 552, 309] },
                { "from": "3d1dbb98", "to": "8ef7bd17", "fromPort": "R", "toPort": "L", "uuid": "5882aadd", "points": [329, 309, 339, 309, 377, 309, 377, 309, 415, 309, 425, 309] },
                { "from": "71a49f86", "to": "ad1a82c4", "fromPort": "R", "toPort": "L", "uuid": "7c20a9be", "points": [71, 203, 81, 203, 108, 203, 108, 203, 135, 203, 145, 203] }
            ]
        });


        var self = this;
        myDiagram.model.nodeKeyProperty = "uuid";

        (<go.GraphLinksModel>myDiagram.model).linkKeyProperty = "uuid";

        //myDiagram.model.makeUniqueKeyFunction = function (model, data) {
        //    console.log("makeUniqueFunction called")
        //    return self.generateGuid();
        //};

        //(<go.GraphLinksModel>myDiagram.model).makeUniqueLinkKeyFunction = function (model, data) {
        //    console.log("makeUniqueFunction called")
        //    return self.generateGuid();
        //};


        myDiagram.addDiagramListener("SelectionGrouped", function (e) {
            e.diagram.selection.each(part => console.log(part.data));
            e.diagram.selection.each(part => console.log(part instanceof go.Group));
        });


        myDiagram.addDiagramListener("SelectionUngrouped", function (e) {
            e.diagram.selection.each(part => console.log(part.data));

        });
        myDiagram.addDiagramListener("SelectionDeleting", function (e) {
            e.diagram.selection.each(part => console.log(part.data));

        });

        myDiagram.addDiagramListener("SelectionDeleted", function (e) {
            e.diagram.selection.each(part => console.log(part.data));

        });

        myDiagram.addDiagramListener("ObjectSingleClicked", function (e) {
           
        });

        myDiagram.addDiagramListener("changedSelection", function (e) {
            //console.log(myDiagram.model.toJson());
        });

        myDiagram.addDiagramListener("ExternalObjectsDropped", function (e) {
            console.log(myDiagram.model.toJson());
            console.log("Hello");

        });

       // this.chatService.messages.next(this.message);


        var model = myDiagram.model;
        (<go.GraphLinksModel>model).linkFromPortIdProperty = "fromPort";
        (<go.GraphLinksModel>model).linkToPortIdProperty = "toPort";

        var link = new go.Link();
        link.routing = go.Link.AvoidsNodes
        link.curve = go.Link.JumpGap
        link.corner = 5
        link.fromEndSegmentLength = 15
        link.toEndSegmentLength = 15
        link.fromEndSegmentDirection = go.Node.DirectionRotatedNodeOrthogonal
        link.toEndSegmentDirection = go.Node.DirectionRotatedNodeOrthogonal
        link.toShortLength = 5
        link.relinkableFrom = true
        link.relinkableTo = true

        var shape = new go.Shape()
        shape.name = "Path";
        shape.stroke = "red";
        shape.strokeWidth = 1
        var arrow = new go.Shape();
        arrow.toArrow = "Triangle"
        link.add(shape);
        link.add(arrow);
        var tool = new CustomLinkingTool();
        tool.portGravity = 15
        tool.temporaryLink = link
        tool.isUnconnectedLinkValid = true;
        myDiagram.toolManager.linkingTool = tool;


        // Custom Dragging tool

        var customDraggingTool = new CustomDraggingTool();
        customDraggingTool.dragsLink = true

        myDiagram.toolManager.draggingTool = customDraggingTool
        myDiagram.focus = function () {
            go.Diagram.prototype.focus.call(this);
        }
    }


    makePort(name: any, spot: any, output: any, input: any) {
        var GO = go.GraphObject.make;
        return GO(go.Shape, "Square",
            {
                name: "PSHAPE",
                fill: null,
                stroke: null,
                strokeWidth: 1.5,
                desiredSize: new go.Size(7, 7),
                alignment: spot,
                alignmentFocus: spot,
                portId: name,
                fromSpot: spot, toSpot: spot,
                fromLinkable: output, toLinkable: input,
                cursor: "pointer"
            });
    }

    showSmallPorts(node: any, show: any) {
        node.ports.each(function (port: any) {
            if (port.portId !== "") {
                port.fill = show ? "white" : null;
                port.stroke = show ? "black" : null;
            }
        });
    }

    shapeStyle() {
        //  console.log("called");
        return [
            { stroke: "rgb(63,63,63)", strokeWidth: 2 },
            new go.Binding("stroke", "isHighlighted", function (h) { return h ? "chartreuse" : "rgb(63,63,63)"; }).ofObject(),
            new go.Binding("strokeWidth", "isHighlighted", function (h) { return h ? 4 : 2; }).ofObject()
        ];
    }

    geoFunc(geoname: any) {
        return IconsComponent.icons[geoname];
    }






    //Making port for linking.
//    makePort(name, spot, output, input) {
//        var GO = go.GraphObject.make;

//        return GO(go.Shape, "Square",
//            {
//                fill: null,
//                stroke: null,
//                strokeWidth: 1.5,
//                desiredSize: new go.Size(7, 7),
//                alignment: spot,
//                alignmentFocus: spot,
//                portId: name,
//                fromSpot: spot, toSpot: spot,
//                fromLinkable: output, toLinkable: input,
//                fromMaxLinks: 1, toMaxLinks: 1,
//                cursor: "pointer"
//            });
//    }

//    //showing the linking ports.
//    showSmallPorts(node, show) {
//        node.ports.each(function (port) {
//            if (port.portId !== "") {
//                port.fill = show ? "white" : null;
//                port.stroke = show ? "black" : null;
//            }
//        });
//    }


//    DisplayDiagramForTimeMachine(res) {
//        console.log("Inside Diagram Component");
//        var self = this;
//        self.diagrams.model = go.Model.fromJson(res);
//        self.myTreeView.model.nodeDataArray = self.diagrams.model.nodeDataArray;
//        self.diagrams.isReadOnly = true;
//        (<HTMLInputElement>document.getElementById("diagramDiv")).style.backgroundColor = "white";
//    }


//    // Icons contains the geometrical representation of all shapes.
//    DisplayDiagram(GUID) {

//    //    this.guid = GUID;
//        var self = this;
//        console.log("GUID from area.diagram : " + GUID);
//        console.log("display guid id " + GUID["GUID"]);
//        console.log("display Name id " + GUID["locationName"]);
//         var diagramGuid = GUID["GUID"];
//        console.log("DisplayDiagram Guid : " + diagramGuid);
//        self.timeservice.getDiagramGuidObservable.next(diagramGuid);
//        this.guid = GUID["GUID"];
//        this.diagramName = GUID["locationName"];


//        if (self.diagrams != null || self.diagrams != undefined)
//            self.diagrams.div = null
//        if (self.diagramTree != null || self.diagramTree != undefined)
//            self.diagramTree.div = null

//        this.CreateDiagram();
//        console.log("===>" + this.diagrams);


//    }

//    CreateDiagram() {
//                this.inspector.diagramTypeObservable.next("diagram");

//        console.log("Create Diagram Calling ");
//        var GO = go.GraphObject.make;
//        var diagramDiv = document.getElementById("diagramDiv");

//        console.log(GO)
//        console.log(diagramDiv)

//        var myChangingSelection = false;

//        function finishDrop(e, grp) {
//            var ok = (grp !== null
//                ? grp.addMembers(grp.diagram.selection, true)
//                : e.diagram.commandHandler.addTopLevelParts(e.diagram.selection, true));
//            if (!ok) e.diagram.currentTool.doCancel();
//        }

//        function highlightGroup(e, grp, show) {
//            if (!grp) return;
//            e.handled = true;
//            if (show) {
//                var tool = grp.diagram.toolManager.draggingTool;
//                var map = tool.draggedParts || tool.copiedParts;
//                if (grp.canAddMembers(map.toKeySet())) {
//                    grp.isHighlighted = true;
//                    return;
//                }
//            }
//            grp.isHighlighted = false;
//        }
//        // instatiate Diagram with diagramDiv element, grid. 
//        var myDiagram: go.Diagram = GO(go.Diagram, diagramDiv,
//            {
//                mouseDrop: function (e) { finishDrop(e, null); },
//                initialContentAlignment: go.Spot.Default,
//                "undoManager.isEnabled": true,
//                "allowDrop": true, "allowDelete": true, "draggingTool.dragsLink": true,
//                "linkingTool.portGravity": 20, "relinkingTool.portGravity": 20,
//                "draggingTool.isGridSnapEnabled": true, "linkingTool.isUnconnectedLinkValid": true,
//                "relinkingTool.isUnconnectedLinkValid": true,
//                "relinkingTool.fromHandleArchetype":
//                GO(go.Shape, "Circle",
//                    {
//                        segmentIndex: 0, cursor: "pointer", desiredSize: new go.Size(8, 8),
//                        fill: "deepskyblue", stroke: "black"
//                    }),
//                "relinkingTool.toHandleArchetype":
//                GO(go.Shape, "Circle",
//                    {
//                        segmentIndex: -1, cursor: "pointer", desiredSize: new go.Size(8, 8),
//                        fill: "deepskyblue", stroke: "black"
//                    }),
//                "linkReshapingTool.handleArchetype":
//                GO(go.Shape, "Square",
//                    {
//                        desiredSize: new go.Size(7, 7),
//                        fill: "yellow", stroke: "black"
//                    }),
//                 // allow Ctrl-G to call groupSelection()
//                "commandHandler.archetypeGroupData": { name: "Group", NodeType: "Boundary", isGroup: true, color: "blue" },
//                "ChangedSelection": function (e) {
//                    if (myChangingSelection) return;
//                    myChangingSelection = true;
//                    var diagnodes = new go.Set < go.Part>();
//                    myDiagram.selection.each(function (n) {
//                        diagnodes.add(myTreeView.findNodeForData(n.data));
//                    });
//                    myTreeView.clearSelection();
//                    myTreeView.selectCollection(diagnodes);
//                    myChangingSelection = false;
//                }
//            });

//        var myTreeView: go.Diagram =
//            GO(go.Diagram, "LocationTree",
//                {
//                    allowMove: false,  // don't let users mess up the tree
//                    allowCopy: true,  // but you might want this to be false
//                    "commandHandler.copiesTree": true,
//                    "commandHandler.copiesParentKey": true,
//                    allowDelete: true,  // but you might want this to be false
//                    "commandHandler.deletesTree": true,
//                    allowHorizontalScroll: false,
//                    layout:
//                    GO(go.TreeLayout,
//                        {
//                            alignment: go.TreeLayout.AlignmentStart,
//                            angle: 0,
//                            compaction: go.TreeLayout.CompactionNone,
//                            layerSpacing: 16,
//                            layerSpacingParentOverlap: 1,
//                            nodeIndent: 2,
//                            nodeIndentPastParent: 0.88,
//                            nodeSpacing: 0,
//                            setsPortSpot: false,
//                            setsChildPortSpot: false,
//                            arrangementSpacing: new go.Size(0, 0)
//                        }),
//                    // when a node is selected in the tree, select the corresponding node in the main diagram
//                    "ChangedSelection": function (e) {
//                        if (myChangingSelection) return;
//                        myChangingSelection = true;
//                        var diagnodes = new go.Set < go.Part>();
//                        myTreeView.selection.each(function (n) {
//                            diagnodes.add(myDiagram.findNodeForData(n.data));
//                        });
//                        myDiagram.clearSelection();
//                        myDiagram.selectCollection(diagnodes);
//                        myChangingSelection = false;
//                    }
//                });


//        this.diagramTree = myTreeView;

//        myTreeView.addDiagramListener("ObjectSingleClicked", function (e) {
//            console.log("Inside NewDiagram ObjectSingleClicked");

//            var selectedparts = e.diagram.selection.iterator;
//            var selnode = myDiagram.selection.first();
//            var diagramGUID = self.guid;

//            while (selectedparts.next()) {
//                var data = selectedparts.value.data;
//                var locationId = data["uuid"];
//                console.log("Selected Node Id : " + locationId);
                
//                self.searchDiagram(myDiagram, locationId);

//            }
//        });
//        // allowing the to horizontal and vertical scrolling to Infinite
//        myDiagram.scrollMode = go.Diagram.InfiniteScroll

// //       myDiagram.commandHandler.selectAll();

//        //For resizing the icons.
//        var nodeResizeAdornmentTemplate =
//            GO(go.Adornment, "Spot",
//                { locationSpot: go.Spot.Right },
//                GO(go.Placeholder),
//                GO(go.Shape, { alignment: go.Spot.TopLeft, cursor: "nw-resize", desiredSize: new go.Size(9, 9), fill: "deepskyblue", stroke: "black" }),
//                GO(go.Shape, { alignment: go.Spot.TopRight, cursor: "ne-resize", desiredSize: new go.Size(9, 9), fill: "deepskyblue", stroke: "black" }),

//                GO(go.Shape, { alignment: go.Spot.BottomLeft, cursor: "se-resize", desiredSize: new go.Size(9, 9), fill: "deepskyblue", stroke: "black" }),
//                GO(go.Shape, { alignment: go.Spot.BottomRight, cursor: "sw-resize", desiredSize: new go.Size(9, 9), fill: "deepskyblue", stroke: "black" })
//            );

//        //For rotate the icons.
//        var nodeRotateAdornmentTemplate =
//            GO(go.Adornment,
//                { locationSpot: go.Spot.Center },
//                GO(go.Shape, "Circle", { cursor: "pointer", desiredSize: new go.Size(9, 9), fill: "yellow", stroke: "black" })
//            );

//        var self = this;
//        myDiagram.nodeTemplate =
//            GO(go.Node, "Auto",
//                {
//                    resizable: true,
//                    resizeAdornmentTemplate: nodeResizeAdornmentTemplate, selectionAdorned: false,
//                    mouseDrop: function (e, nod) { finishDrop(e, nod.containingGroup); }
//                },
//                {
//                    rotatable: true,
//                    rotateAdornmentTemplate: nodeRotateAdornmentTemplate, selectionAdorned: false
//                },
//                new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
//                { contextMenu: GO(go.Adornment) },
//                GO(go.Shape, { fill: "white", stroke: "black", strokeWidth: 2 },
//                    new go.Binding("stroke", "color"),
//                    new go.Binding("fill", "dColor"),
//                    new go.Binding("width", "width"),
//                    new go.Binding("height", "height"),
//                    new go.Binding("geometryString", "name", self.GetGeometryString),
//                    {
//                        portId: "", cursor: "pointer", fromLinkable: true, fromLinkableSelfNode: true, fromLinkableDuplicates: true,
//                        toLinkable: true, toLinkableSelfNode: true, toLinkableDuplicates: true
//                    }),
//                GO(go.TextBlock, { margin: 5, text: "" }),
//                this.makePort("T", go.Spot.Top, true, true),
//                this.makePort("L", go.Spot.Left, true, true),
//                this.makePort("R", go.Spot.Right, true, true),
//                this.makePort("B", go.Spot.Bottom, true, false),
//                {
//                    mouseEnter: function (e, node) { self.showSmallPorts(node, true); },
//                    mouseLeave: function (e, node) { self.showSmallPorts(node, false); },
//                    toolTip:
//                    GO(go.Adornment, "Auto",
//                        GO(go.Shape, { fill: "#FFFFCC" }),
//                        GO(go.TextBlock, { margin: 2 },  // the tooltip shows the result of calling nodeInfo(data)
//                            new go.Binding("text", "name"))
//                    ),
//                    contextMenu: GO(go.Adornment, "Vertical",
//                        this.makeButton("Cut",
//                            function (e: any, obj: any) { e.diagram.commandHandler.cutSelection(); },
//                            function (o: any) { return o.diagram.commandHandler.canCutSelection(); }),
//                        this.makeButton("Copy",
//                            function (e: any, obj: any) { e.diagram.commandHandler.copySelection(); },
//                            function (o: any) { return o.diagram.commandHandler.canCopySelection(); }),
//                        this.makeButton("Paste",
//                            function (e: any, obj: any) { e.diagram.commandHandler.pasteSelection(e.diagram.lastInput.documentPoint); },
//                            function (o: any) { return o.diagram.commandHandler.canPasteSelection(); }),
//                        this.makeButton("Delete",
//                            function (e: any, obj: any) { e.diagram.commandHandler.deleteSelection(); },
//                            function (o: any) { return o.diagram.commandHandler.canDeleteSelection(); })
//                    )
//                }

//            );


//        myDiagram.contextMenu =
//            GO(go.Adornment, "Vertical",
//                this.makeButton("Paste",
//                    function (e: any, obj: any) { e.diagram.commandHandler.pasteSelection(e.diagram.lastInput.documentPoint); },
//                    function (o: any) { return o.diagram.commandHandler.canPasteSelection(); })

//            );
//        var linkSelectionAdornmentTemplate =
//            GO(go.Adornment, "Link",
//                GO(go.Shape,
//                    { isPanelMain: true, strokeWidth: 0 }, new go.Binding("stroke", "", function (v) { return "green"; }))
//            );

//        myDiagram.linkTemplate =
//            GO(go.Link,
//                {
//                    routing: go.Link.Orthogonal,
//                    corner: 5,
//                    curve: go.Link.JumpOver,
//                    toShortLength: 2
//                },
//                {
//                    selectable: true,
//                    selectionAdornmentTemplate: linkSelectionAdornmentTemplate
//                },
//                {
//                    reshapable: true, resegmentable: true, fromEndSegmentDirection: go.Node.DirectionRotatedNodeOrthogonal,
//                    toEndSegmentDirection: go.Node.DirectionRotatedNodeOrthogonal
//                },
//                { adjusting: go.Link.Stretch },
//                { toShortLength: 3, relinkableFrom: true, relinkableTo: true },
//                new go.Binding("points", "points").makeTwoWay(),
//                { // handle dragging a Node onto a Link to (maybe) change the reporting relationship
//                    mouseDragEnter: function (e, link, prev) {

//                        var lshape = link.findObject("LSHAPE");
//                        lshape._prevFill = lshape.stroke;  // remember the original brush
//                        lshape.stroke = "pink";

//                    },
//                    mouseDragLeave: function (e, link, next) {

//                        var lshape = link.findObject("LSHAPE");
//                        lshape.stroke = lshape._prevFill;  // restore the original brush

//                    },
//                    mouseDrop: function (e, link) {

//                        var selnode = myDiagram.selection.first();
//                        var tnode = link.toNode;
//                        var larrow = link.findObject("LARROW");
//                        link.toNode = selnode;                     
//                        var model = myDiagram.model;

//                        if (tnode != null) {
//                            larrow.toArrow = "";
//                            (<go.GraphLinksModel>model).addLinkData({ from: selnode.data.uuid, to: tnode.data.uuid });
//                        }
//                        else {
                            
//                        }
//                    }
//                },

//                // allow the user to relink existing links
//                GO(go.Shape, { name: "LSHAPE", strokeWidth: 4 }, new go.Binding("stroke", "", function (v) { return "black"; })),
//                GO("Shape", { name: "LARROW", strokeWidth: 3, toArrow: "Standard" }, new go.Binding("stroke", "", function (v) { return "black"; })),
//                GO(go.Shape, { fromArrow: "" },
//                    new go.Binding("fromArrow", "fromArrow").makeTwoWay(), new go.Binding("stroke", "color").makeTwoWay()),
//                GO(go.Shape, { toArrow: "Triangle" },
//                    new go.Binding("toArrow", "toArrow").makeTwoWay(), new go.Binding("stroke", "color").makeTwoWay()),
//                {
//                    contextMenu: GO(go.Adornment, "Vertical",
//                        GO("ContextMenuButton",
//                            GO(go.TextBlock, "Reverse"),
//                            {
//                                click: function (e: go.InputEvent, obj: go.Panel) {

//                                    var linkData = e.diagram.selection.first().data;
//                                    e.diagram.startTransaction("Reversing link started");

//                                    var from = linkData["from"]
//                                    var to = linkData["to"]
//                                    e.diagram.model.setDataProperty(linkData, "from", to);
//                                    e.diagram.model.setDataProperty(linkData, "to", from);
//                                    e.diagram.startTransaction("Reversing link completed");

//                                }
//                            }))
//                }
//            );
//        var lollipop = GO(go.Link,
//            {
//                selectable: true,
//                movable: false,
//                reshapable: true,
//                deletable: false,
//                selectionAdorned: true,
//                routing: go.Link.Normal,
//                curve: go.Link.None, corner: 0,
//                fromEndSegmentLength: 0,
//                toEndSegmentLength: 0,
//                fromEndSegmentDirection: go.Node.DirectionRotatedNodeOrthogonal,
//                toEndSegmentDirection: go.Node.DirectionRotatedNodeOrthogonal,
//                toShortLength: 0,
//                relinkableFrom: false,
//                relinkableTo: false,
//                // if a node from the Palette is dropped on a link, the link is replaced by links to and from the new node
//            },
//            //{ routing: go.Link.Orthogonal },  // optional, but need to keep LinkingTool.temporaryLink in sync, above
//            new go.Binding("points", "points").makeTwoWay(),
//            GO(go.Shape, { strokeWidth: 2 }, this.shapeStyle())
//        );

//        myDiagram.linkTemplateMap.add("lollipop", lollipop)
//        var model = myDiagram.model;

//        (<go.GraphLinksModel>model).linkFromPortIdProperty = "fromPort";
//        (<go.GraphLinksModel>model).linkToPortIdProperty = "toPort";

//        var link = new go.Link();
//        link.routing = go.Link.AvoidsNodes
//        //link.curve = go.Link.JumpOver
//        link.corner = 5
//        link.fromEndSegmentLength = 15
//        link.toEndSegmentLength = 15
//        //link.fromEndSegmentDirection = go.Node.DirectionRotatedNodeOrthogonal
//        //link.toEndSegmentDirection = go.Node.DirectionRotatedNodeOrthogonal
//        link.toShortLength = 5
//        link.relinkableFrom = true
//        link.relinkableTo = true

//        var shape = new go.Shape()
//        shape.name = "Path";
//        shape.stroke = "red";
//        shape.strokeWidth = 1

//        var arrow = new go.Shape();

//        arrow.toArrow = "Triangle"
//        link.add(shape);
//        link.add(arrow);
//        var tool = new CustomLinkingTool();
//        tool.portGravity = 15
//        tool.temporaryLink = link
//        tool.isUnconnectedLinkValid = true;
//        //tool.temporaryLink.routing = go.Link.Orthogonal;  // optional, but need to keep link template in sync, below
//        myDiagram.toolManager.linkingTool = tool;
//        // Custom Dragging tool

//        var customDraggingTool = new CustomDraggingTool();
//        customDraggingTool.dragsLink = true
//        myDiagram.toolManager.draggingTool = customDraggingTool




//        // Groups consist of a title in the color given by the group node data
//        // above a translucent gray rectangle surrounding the member parts

//        myDiagram.groupTemplate =
//            GO(go.Group, "Vertical",
//            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
//                    {
//                    selectionObjectName: "PANEL",  // selection handle goes around shape, not label
//                    ungroupable: true,             // enable Ctrl-Shift-G to ungroupmydia a selected Group
//                    mouseDragEnter: function (e, grp, prev) { highlightGroup(e, grp, true); },
//                    mouseDragLeave: function (e, grp, next) { highlightGroup(e, grp, false); },
//                    mouseDrop: finishDrop,
//                    handlesDragDropForMembers: true,
//                    computesBoundsAfterDrag: true
//                }, GO(go.TextBlock,
//                    {
//                        font: "bold 19px sans-serif",
//                        isMultiline: false,  // don't allow newlines in text
//                        editable: true  // allow in-place editing by user
//                    },
//                    new go.Binding("text", "name").makeTwoWay(),
//                    new go.Binding("stroke", "color")
//                ),
//                GO(go.Panel, "Auto",
//                    { name: "PANEL" },
//                    GO(go.Shape, "Rectangle",   // the rectangular shape around the members
//                        { fill: "white", stroke: "gray", strokeWidth: 3 }
//                    ),
//                    GO(go.Placeholder, { padding: 10 })
//                )
//            );
//        var myChangingModel = false;  // to protect against recursive model changes



//        myDiagram.addModelChangedListener(function (e) {
//            if (e.model.skipsUndoManager) return;
//            if (myChangingModel) return;
//            myChangingModel = true;
//            // don't need to start/commit a transaction because the UndoManager is shared with myTreeView
//            if (e.modelChange === "nodeGroupKey" || e.modelChange === "nodeParentKey") {
//                // handle structural change: group memberships
//                var treenode = myTreeView.findNodeForData(e.object);
//                if (treenode !== null) treenode.updateRelationshipsFromData();
//            } else if (e.change === go.ChangedEvent.Property) {
//                var treenode = myTreeView.findNodeForData(e.object);
//                if (treenode !== null) treenode.updateTargetBindings();
//            } else if (e.change === go.ChangedEvent.Insert && e.propertyName === "nodeDataArray") {
//                // pretend the new data isn't already in the nodeDataArray for myTreeView
//                myTreeView.model.nodeDataArray.splice(e.newParam, 1);
//                // now add to the myTreeView model using the normal mechanisms
//                myTreeView.model.addNodeData(e.newValue);
//            } else if (e.change === go.ChangedEvent.Remove && e.propertyName === "nodeDataArray") {
//                // remove the corresponding node from myTreeView
//                var treenode = myTreeView.findNodeForData(e.oldValue);
//                if (treenode !== null) myTreeView.remove(treenode);
//            }
//            myChangingModel = false;
//        });



//        //TREE VIEW


//        myTreeView.nodeTemplate =
//            GO(go.Node,
//                // no Adornment: instead change panel background color by binding to Node.isSelected
//                { selectionAdorned: false },
//                GO("TreeExpanderButton",
//                    {
//                        width: 14,
//                        "ButtonBorder.fill": "white",
//                        "ButtonBorder.stroke": null,
//                        "_buttonFillOver": "rgba(0,128,255,0.25)",
//                        "_buttonStrokeOver": null
//                    }),
//                GO(go.Panel, "Horizontal",
//                    { position: new go.Point(16, 0) },
//                    new go.Binding("background", "isSelected", function (s) { return (s ? "lightblue" : null); }).ofObject(),
//                    GO(go.Picture,
//                        {
//                            width: 18, height: 18,
//                            margin: new go.Margin(0, 4, 0, 0),
//                            imageStretch: go.GraphObject.Uniform
//                        }),
//                    GO(go.TextBlock,
//                        {stroke: "white" },
//                        new go.Binding("text", "name").makeTwoWay())
//                )  // end Horizontal Panel
//            );  // end Node



//        // without lines
//        myTreeView.linkTemplate = GO(go.Link);




//        // cannot share the model itself, but can share all of the node data from the main Diagram,
//        // pretending the "group" relationship is the "tree parent" relationship
//        myTreeView.model = GO(go.TreeModel, { nodeParentKeyProperty: "group" });

//        myTreeView.addModelChangedListener(function (e) {
//            if (e.model.skipsUndoManager) return;
//            if (myChangingModel) return;
//            myChangingModel = true;
//            // don't need to start/commit a transaction because the UndoManager is shared with myDiagram
//            if (e.modelChange === "nodeGroupKey" || e.modelChange === "nodeParentKey") {
//                // handle structural change: tree parent/children
//                var node = myDiagram.findNodeForData(e.object);
//                if (node !== null) node.updateRelationshipsFromData();
//            } else if (e.change === go.ChangedEvent.Property) {
//                // propagate simple data property changes back to the main Diagram
//                var node = myDiagram.findNodeForData(e.object);
//                if (node !== null) node.updateTargetBindings();
//            } else if (e.change === go.ChangedEvent.Insert && e.propertyName === "nodeDataArray") {
//                // pretend the new data isn't already in the nodeDataArray for the main Diagram model
//                myDiagram.model.nodeDataArray.splice(e.newParam, 1);
//                // now add to the myDiagram model using the normal mechanisms
//                myDiagram.model.addNodeData(e.newValue);
//            } else if (e.change === go.ChangedEvent.Remove && e.propertyName === "nodeDataArray") {
//                // remove the corresponding node from the main Diagram
//                var node = myDiagram.findNodeForData(e.oldValue);
//                if (node !== null) myDiagram.remove(node);
//            }
//            myChangingModel = false;
//        });

//        this.myTreeView = myTreeView;

//        myDiagram.model.nodeKeyProperty = "uuid"
//        myTreeView.model.nodeKeyProperty = "uuid";
//            (<go.GraphLinksModel>myDiagram.model).linkKeyProperty = "uuid";
//        (<go.GraphLinksModel>myTreeView.model).linkKeyProperty = "uuid";

//        myDiagram.model.makeUniqueKeyFunction = function (model, data) {
//            console.log("makeUniqueFunction called")

//            return Guid.generateGuid();
//        };


//        myTreeView.model.makeUniqueKeyFunction = function (model, data) {


//            return Guid.generateGuid();
//        };
//        (<go.GraphLinksModel>myDiagram.model).makeUniqueLinkKeyFunction = function (model, data) {
//            console.log("makeUniqueFunction called")

//            return Guid.generateGuid();
//        };

//        this.myTreeView.model.nodeDataArray = myDiagram.model.nodeDataArray


//        myTreeView.model.undoManager = myDiagram.model.undoManager;

//        this.diagrams = myDiagram;

//        var displayDate = new Date().toLocaleDateString();
//        var displayTime = new Date().toLocaleTimeString();
//        var dateTime = displayDate + " : " + displayTime

//        var diagramData = new DiagramData()
//        diagramData.GUID = this.guid;
//        diagramData.tenantId = null
//        diagramData.name = null
//        diagramData.type = "Location"
//        diagramData.jurisdiction = null
//        diagramData.latitude = null
//        diagramData.longitude = null
//        diagramData.unitsofMeasurement = null
//        diagramData.status = null
//        diagramData.company = null
//        diagramData.LSD = null
//        diagramData.facility = null
//        diagramData.field = null
//        diagramData.location = null
//        diagramData.createdDateTime = dateTime
//        diagramData.createdBy = this._authenticator.username
//        diagramData.modifiedDateTime = dateTime
//        diagramData.modifiedBy = this._authenticator.username
//        diagramData.diagramJson = JSON.stringify({ class: go.GraphLinksModel, nodeKeyProperty: 'uuid', nodeDataArray: [], linkDataArray: [] });

//        var time = self.timeservice.selectedDate;
//        if (time == "false") {
//            this.inspector.CreateOrInsertDiagramJson(diagramData, this._authenticator.TenantName)
//                .subscribe(
//                (res) => {

//                    console.log(res);
//                    //  self.diagrams.model.clear();
//                    // self.diagrams.clear();
//                    this.diagramData = res;
//                    this.inspector.tenantId = this.diagramData.tenantId;
//                    self.diagrams.model.nodeDataArray = go.Model.fromJson(this.diagramData.diagramJson).nodeDataArray;
//                    (<go.GraphLinksModel>self.diagrams.model).linkDataArray = (<go.GraphLinksModel>go.Model.fromJson(this.diagramData.diagramJson)).linkDataArray;

//                    // self.diagrams.model = go.Model.fromJson(res).nodeDataArray;
//                    self.diagrams.isReadOnly = true;

//                    this.myTreeView.model.nodeDataArray = myDiagram.model.nodeDataArray

//                });

//            (<HTMLInputElement>document.getElementById("diagramDiv")).style.backgroundColor = "white";

//        }
//        else {

//            console.log(diagramData.GUID);

//            this.inspector.GetDiagramJsonUsingTime(diagramData.GUID, this._authenticator.TenantName, time)
//                .subscribe(
                
//                (res) => {
//                    time = time;
//                    if (res == "NOT") {
//                        alert("No Diagram Available On This Date And Time");
//                    } else {

//                        self.diagrams.model.nodeDataArray = go.Model.fromJson(res).nodeDataArray;
//                        (<go.GraphLinksModel>self.diagrams.model).linkDataArray = (<go.GraphLinksModel>go.Model.fromJson(res)).linkDataArray;
//                        self.diagrams.isReadOnly = true;
//                        self.diagramTree.isReadOnly = true;
//                    }
//                    });
//            (<HTMLInputElement>document.getElementById("diagramDiv")).style.backgroundColor = "gray";
//        }
//          if (this.myOverview != undefined) {
//            this.myOverview.div = null
//            this.myOverview = null
//        }
//var myOverview =
//            GO(go.Overview, "myOverviewDiv",  // the HTML DIV element for the Overview
//                { observed: myDiagram, contentAlignment: go.Spot.Center });

//        this.myOverview = myOverview;

//        this.inspector.zoomControlObservable.subscribe(res => {

//            if (res == "zoomIn") {

//                var zoomin = myDiagram.commandHandler.increaseZoom();

//            } else {
//                var zoomout = myDiagram.commandHandler.decreaseZoom();
//            }

//        });


// this.inspector.isDiagramEdittableObservable.subscribe(res =>{
//console.log("Inside isDiagramEdittableObservable Diagram ");
//if(res =="visible"){
//        this.diagrams.isReadOnly = false;
//}else {
//        this.diagrams.isReadOnly = true;
//}
//});

//   this.inspector.isDiagramEdittableObservable.next("hidden");

//        // adding custom properties
//        this.ListenToEvent(myDiagram);

//    }

//    shapeStyle() {
//        console.log("called");
//        return [
//            { stroke: "rgb(63,63,63)", strokeWidth: 2 },
//            new go.Binding("stroke", "isHighlighted", function (h) { return h ? "chartreuse" : "rgb(63,63,63)"; }).ofObject(),
//            new go.Binding("strokeWidth", "isHighlighted", function (h) { return h ? 4 : 2; }).ofObject()
//        ];
//    }

//    ListenToEvent(myDiagram: go.Diagram) {

//        var self = this;

//        myDiagram.addDiagramListener("BackgroundSingleClicked", function (e: go.DiagramEvent) {
//            var diagram = self.diagramData;
//            //self.inspector.GetLocationObjectFromSchema("DiagramData", self._authenticator.TenantName, diagram.tenantId);

//            //self.inspector.GetDiagramInfo(self.diagramName, diagram.GUID, self._authenticator.TenantName, diagram.tenantId);
//        }); 


//        myDiagram.addDiagramListener("ObjectSingleClicked", function (e) {
//            console.log("Inside NewDiagram ObjectSingleClicked");

//            //var userName = self._authenticator.username
//            //var createdDataTime = new Date().toDateString()
//            //var diagramID = self.guid;
//            //var tenantID = self.diagramData.tenantId;
//            //var tenantName = self._authenticator.TenantName;
//            //var diagramName = self.diagramName;

//            //var selectedparts = e.diagram.selection.iterator;
//            //var selnode = myDiagram.selection.first();
//            //var diagramGUID = self.guid;

//            //while (selectedparts.next()) {
//            //    var data = selectedparts.value.data;
//            //    var locationId = data["uuid"];
//            //    self.locationId = locationId;
//            //    self.inspector.locationId = data["uuid"]
//            //    console.log("Selected Node Id : " + locationId);
//            //    var nodeType
//            //    if (selectedparts.value instanceof go.Group || selectedparts.value instanceof go.Link)
//            //        nodeType = data["NodeType"]
//            //    else
//            //        nodeType = data["name"]
//            //    if (nodeType == undefined) return;
//            //    var locationData = new LocationData(data["uuid"], tenantID, tenantName, diagramID,
//            //        diagramName, nodeType, null, userName, userName, createdDataTime,
//            //        createdDataTime, selnode.position.x + "", selnode.position.y + "", true);


//            //    console.log("Inside While Date : " + self.timeservice.selectedDate);

//            //    if (self.timeservice.selectedDate == "false") {
//            //        console.log("Inside IF Date : " + self.timeservice.selectedDate);
//            //        self.notesInspector.getNotesObservable.next(locationId);



//            //        // Get Location Object/NodeType Schema from DocumentDB/Dictionary 
//            //        self.inspector.GetLocationObjectFromSchema(locationData.NodeType, locationData.TenantName, locationData.TenantId);

//            //        // Get Location Object data from SqlDB
//            //        self.inspector.getInfoPaneObservable.next(JSON.stringify(locationData));
//            //    }
//            //    else {
//            //        console.log("Inside Else Date : " + self.timeservice.selectedDate);
//            //        self.timeservice.GetNotesForTimeMachineObservable.next(JSON.stringify({
//            //            LocationId: locationId,
//            //            TenantName: self._authenticator.TenantName,
//            //            TenantId: self.diagramData.tenantId,
//            //            DateAndTime: self.timeservice.selectedDate
//            //        }));

//            //        self.timeservice.getInfoPaneObservableForTimeMachine.next(JSON.stringify({
//            //            LocationId: locationId,
//            //            NodeType: data["nodeType"],
//            //            TenantName: self._authenticator.TenantName,
//            //            TenantId: self.diagramData.tenantId,
//            //            DateAndTime: self.timeservice.selectedDate
//            //        }));


//            //    }

//            //}
//        });
     
//        myDiagram.addDiagramListener("ExternalObjectsDropped", function (e) {
//            //console.debug("ExternalObjectsDropped listener");
//            //var userName = self._authenticator.username
//            //var createdDataTime = new Date().toDateString()
//            //var diagramID = self.guid;
//            //var tenantID = self.diagramData.tenantId;
//            //var tenantName = self._authenticator.TenantName;
//            //var diagramName = self.diagramName;

//            //e.diagram.nodes.each(function (n) {
//            //    n.data.key = undefined;
//            //});

//            //var nodeCollection = new Array<go.Part>();

//            //e.diagram.selection.each(part => {
//            //    nodeCollection.push(part)
//            //});

//            //var nodecollection$ = Observable.from(nodeCollection).filter((value, i) => value != null);

//            //var meters = nodecollection$.filter((part, i) => part.data.nodeType == NodeType.Meter);

//            //meters.subscribe(part => {

//            //    var selectedNode = part;

//            //    e.diagram.startTransaction("Add attached local meter");

//            //    var localMountedDatum = {
//            //        name: "localMounted", nodeType: "meter", pColor: '#808080', dColor: 'white', color: 'black', width: 50, height: 50,
//            //        loc: new go.Point(), category: "simple"
//            //    };

//            //    e.diagram.model.addNodeData(localMountedDatum);
//            //    e.diagram.commitTransaction("created node");

//            //    var selectLocalMountedNode: go.Node = null;
//            //    e.diagram.nodes.each((e: go.Node) => {
//            //        if (e.data == localMountedDatum)
//            //            selectLocalMountedNode = e
//            //    });
//            //    var LollipopLength = 10;
//            //    //    e.diagram.select(selectedNode);
//            //    if (selectedNode != null)
//            //        var linkData = { to: selectedNode.data.uuid, from: selectLocalMountedNode.data.uuid, nodeType: "Pipeline", fromPort: "B", toPort: "T", category: "lollipop" };

//            //    (<go.GraphLinksModel>myDiagram.model).addLinkData(linkData);

//            //    var selectLink: go.Link = null;
//            //    e.diagram.links.each((e: go.Link) => {
//            //        if (e.data == linkData)
//            //            selectLink = e
//            //    });
//            //    if (selectLink != null) {

//            //        var portLocation = PortHelpers.GetPortLocation(selectLink.fromNode, selectLink.fromPort);
//            //        var point = PortHelpers.GetPortLocation(selectLink.toNode, selectLink.toPort);
//            //        var portDirection = PortHelpers.GetPortDirection(selectLink.toPort, selectLink.toNode.angle);

//            //        var num = portLocation.x;
//            //        var y = portLocation.y;

//            //        if (portDirection == "L") {
//            //            num = point.x - LollipopLength;
//            //            y = point.y;
//            //        }
//            //        else if (portDirection == "R") {
//            //            num = point.x + LollipopLength;
//            //            y = point.y;
//            //        }
//            //        else if (!(portDirection == "T")) {

//            //            num = point.x;
//            //            y = point.y + LollipopLength;
//            //        }
//            //        else {
//            //            num = point.x;
//            //            y = point.y - LollipopLength;
//            //        }

//            //        var point1 = new go.Point(num, y);
//            //        var num1 = portLocation.x;
//            //        var location = selectLink.fromNode.location;
//            //        var actualWidth = num1 - location.x;
//            //        var y1 = portLocation.y;
//            //        location = selectLink.fromNode.location;
//            //        var actualHeight = y1 - location.y;

//            //        if (selectLink.fromNode.locationSpot == go.Spot.Center) {
//            //            actualWidth = actualWidth + selectLink.fromNode.width / 2;
//            //            actualHeight = actualHeight + selectLink.fromNode.width / 2;
//            //        }
//            //        selectLink.fromNode.move(new go.Point(num - actualWidth - 16, y - actualHeight - 30));


//            //        // Update in database

//            //        var locationData = new LocationData(selectLocalMountedNode.data["uuid"], tenantID, tenantName, diagramID,
//            //            diagramName, selectLocalMountedNode.data["name"], null, userName, userName, createdDataTime,
//            //            createdDataTime, selectLocalMountedNode.position.x + "", selectLocalMountedNode.position.y + "", true);
//            //        console.debug(JSON.stringify(locationData))

//            //        self.diagrams.startTransaction("Modifying the Object Node Json data"); 0
//            //        self.diagrams.model.setDataProperty(selectLocalMountedNode.data, "locationInfo", JSON.parse(JSON.stringify(locationData)));
//            //        self.diagrams.commitTransaction("Object's Json data modified");


//            //        (<go.Node>selectedNode).findLinksConnected().each(e => {
//            //            //          console.log(e.data)
//            //            self.diagrams.startTransaction("removing arrow ");
//            //            var link = e;
//            //            self.diagrams.model.setDataProperty(link.data, "fromArrow", "");
//            //            self.diagrams.model.setDataProperty(link.data, "toArrow", "");
//            //            self.diagrams.commitTransaction("removing arrow ");

//            //        });

//            //        self.inspector.createObjectInfoObservable.next(JSON.stringify(locationData));
//            //    }
//            //}, err => console.error(err),
//            //    () => console.debug("meters$ completed")
//            //);

//            //var createNodeDataInDB = nodecollection$
//            //    .subscribe(part => {
//            //        var data = part.data;

//            //        var locationData = new LocationData(data["uuid"], tenantID, tenantName, diagramID,
//            //            diagramName, data["name"], null, userName, userName, createdDataTime,
//            //            createdDataTime, part.position.x + "", part.position.y + "", true);
//            //        console.debug(JSON.stringify(locationData))

//            //        self.diagrams.startTransaction("Modifying the Object Node Json data"); 0
//            //        self.diagrams.model.setDataProperty(data, "locationInfo", JSON.parse(JSON.stringify(locationData)));
//            //        self.diagrams.commitTransaction("Object's Json data modified");

//            //        self.inspector.createObjectInfoObservable.next(JSON.stringify(locationData));

//            //    }, err => console.error(err),
//            //    () => console.debug("meters$ completed")
//            //    )



//            //var diagramjson = myDiagram.model.toJson();
//            //self.diagramData.diagramJson = diagramjson;

//            //self.areaService
//            //    .UpdateAreaDiagramJson(self.diagramData, tenantName)
//            //    .subscribe(res => console.log(res));
//        });

//        myDiagram.addDiagramListener("Modified", function (e: go.DiagramEvent) {
//            console.log(e.diagram.model.toJson())
//        });


//        myDiagram.addDiagramListener("LinkDrawn", function (e: go.DiagramEvent) {
//            //console.log("**guid :" + self.guid);
//            //console.log("**guid length:" + self.guid.length);
//            //e.diagram.selection.each(e => {
//            //    e.diagram.startTransaction("Add node Type")
//            //    e.diagram.model.setDataProperty(e.data, "NodeType", "Pipeline");
//            //    e.diagram.commitTransaction("Add node Type")
//            //})
//            //var diagramGUID = self.guid;
//            //var diagramjson = myDiagram.model.toJson();

//            //self.diagramData.diagramJson = diagramjson;
//            //self.areaService
//            //    .UpdateAreaDiagramJson(self.diagramData, self._authenticator.TenantName)
//            //    .subscribe(res => console.log(res));
//            //var userName = self._authenticator.username
//            //var createdDataTime = new Date().toDateString()
//            //var diagramID = self.guid;
//            //var tenantID = self.diagramData.tenantId;
//            //var tenantName = self._authenticator.TenantName;
//            //var diagramName = self.diagramName;

//            //var linkCollection = new Array<go.Part>();

//            //e.diagram.selection.each(part => {
//            //    linkCollection.push(part)
//            //});

//            //var linkCollection$ = Observable.from(linkCollection).filter((value, i) => value != null);
//            //var createNodeDataInDB = linkCollection$
//            //    .subscribe(part => {
//            //        var data = part.data;

//            //        var locationData = new LocationData(data["uuid"], tenantID, tenantName, diagramID,
//            //            diagramName, data["NodeType"], null, userName, userName, createdDataTime,
//            //            createdDataTime, part.position.x + "", part.position.y + "", true);

//            //        console.debug(JSON.stringify(locationData))

//            //        self.inspector.createObjectInfoObservable.next(JSON.stringify(locationData));

//            //    }, err => console.error(err),
//            //    () => console.debug("createNodeDataInDB completed")
//            //    );

//        });
          


//        myDiagram.addDiagramListener("ClipboardPasted", function (e) {
//            // var firstSelection:go.Part  =  e.diagram.selection.first()
//            var firstSelection: go.Part
//            e.diagram.selection.each(part => {
//                if (part instanceof go.Link)
//                    return;
//                if (part instanceof go.Part)
//                    firstSelection = part

//            });
//            if (!firstSelection) return;
//            console.log(firstSelection.data)
//            var mouseLocation = e.diagram.lastInput.documentPoint;
//            var displaceX = mouseLocation.x - firstSelection.location.x + firstSelection.actualBounds.width / 2;
//            var displaceY = mouseLocation.y - firstSelection.location.y + firstSelection.actualBounds.height / 2;
//            console.log(displaceX)
//            console.log(displaceY)

//            // Pasting at mouse pointer last click
//            e.diagram.moveParts(e.diagram.selection, new go.Point(displaceX, displaceY), false);

//            var userName = self._authenticator.username
//            var createdDataTime = new Date().toDateString()
//            var diagramID = self.guid;
//            var tenantID = self.diagramData.tenantId;
//            var tenantName = self._authenticator.TenantName;
//            var diagramName = self.diagramName;
//            var nodeCollection = new Array<go.Part>();

//            e.diagram.selection.each(part => {
//                nodeCollection.push(part)
//            });

//            var nodecollection$ = Observable.from(nodeCollection).filter((value, i) => value != null);
//            var createNodeDataInDB = nodecollection$
//                .subscribe(part => {
//                    var data = part.data;
//                    var nodeType
//                    if (part instanceof go.Group || part instanceof go.Link)
//                        nodeType = data["NodeType"]
//                    else
//                        nodeType = data["name"]

//                    var locationData = new LocationData(data["uuid"], tenantID, tenantName, diagramID,
//                        diagramName, nodeType, null, userName, userName, createdDataTime,
//                        createdDataTime, part.position.x + "", part.position.y + "", true);
//                    console.debug(JSON.stringify(locationData))

//                    self.diagrams.startTransaction("Modifying the Object Node Json data"); 0
//                    self.diagrams.model.setDataProperty(data, "locationInfo", JSON.parse(JSON.stringify(locationData)));
//                    self.diagrams.commitTransaction("Object's Json data modified");

//                    self.inspector.createObjectInfoObservable.next(JSON.stringify(locationData));

//                }, err => console.error(err),
//                () => console.debug("createNodeDataInDB completed")
//                );

//            var diagramjson = myDiagram.model.toJson();
//            self.diagramData.diagramJson = diagramjson;

//            self.areaService
//                .UpdateAreaDiagramJson(self.diagramData, tenantName)
//                .subscribe(res => console.log(res));


//        });



//        myDiagram.addDiagramListener("LinkRelinked", function (e: go.DiagramEvent) {
//            //console.log("**guid :" + self.guid);
//            //console.log("**guid length:" + self.guid.length);

//            //var diagramGUID = self.guid;
//            //var diagramjson = myDiagram.model.toJson();
//            ////self.inspector.updateAreaInfoObservable.next({
//            ////    GUID: diagramGUID,
//            ////    DiagramJson: diagramjson
//            ////});
//            //self.diagramData.diagramJson = diagramjson;
//            //self.areaService
//            //    .UpdateAreaDiagramJson(self.diagramData, self._authenticator.TenantName)
//            //    .subscribe(res => console.log(res));
//        });

//        myDiagram.addDiagramListener("PartResized", function (e: go.DiagramEvent) {
//            //console.log("**guid :" + self.guid);
//            //console.log("**guid length:" + self.guid.length);

//            //var diagramGUID = self.guid;
//            //var diagramjson = myDiagram.model.toJson();
//            ////self.inspector.updateAreaInfoObservable.next({
//            ////    GUID: diagramGUID,
//            ////    DiagramJson: diagramjson
//            ////});
//            //self.diagramData.diagramJson = diagramjson;
//            //self.areaService
//            //    .UpdateAreaDiagramJson(self.diagramData, self._authenticator.TenantName)
//            //    .subscribe(res => console.log(res));
//        });

//        myDiagram.addDiagramListener("PartRotated", function (e: go.DiagramEvent) {
//            //console.log("**guid :" + self.guid);
//            //console.log("**guid length:" + self.guid.length);

//            //var diagramGUID = self.guid;
//            //var diagramjson = myDiagram.model.toJson();

//            ////self.inspector.updateAreaInfoObservable.next({
//            ////    GUID: diagramGUID,
//            ////    DiagramJson: diagramjson
//            ////});
//            //self.diagramData.diagramJson = diagramjson;
//            //self.areaService
//            //    .UpdateAreaDiagramJson(self.diagramData, self._authenticator.TenantName)
//            //    .subscribe(res => console.log(res));
//        });

//        myDiagram.addDiagramListener("SelectionMoved", function (e: go.DiagramEvent) {
//            //console.log("**guid :" + self.guid);
//            //console.log("**guid length:" + self.guid.length);

//            //var diagramGUID = self.guid;
//            //var diagramjson = myDiagram.model.toJson();
//            ////self.inspector.updateAreaInfoObservable.next({
//            ////    GUID: diagramGUID,
//            ////    DiagramJson: diagramjson
//            ////});
//            //self.diagramData.diagramJson = diagramjson;
//            //self.areaService
//            //    .UpdateAreaDiagramJson(self.diagramData, self._authenticator.TenantName)
//            //    .subscribe(res => console.log(res));
//        });

//        myDiagram.addDiagramListener("SelectionDeleting", function (e: go.DiagramEvent) {
//            //e.diagram.selection.each(res => {
//            //    self.inspector.DeleteLocationObject(res.data["uuid"], self._authenticator.TenantName, self.inspector.tenantId)
//            //});
//        });

//        myDiagram.addDiagramListener("SelectionDeleted", function (e: go.DiagramEvent) {
//            //console.log("**guid :" + self.guid);
//            //console.log("**guid length:" + self.guid.length);

//            //var diagramGUID = self.guid;
//            //var diagramjson = myDiagram.model.toJson();
//            ////self.inspector.updateAreaInfoObservable.next({
//            ////    GUID: diagramGUID,
//            ////    DiagramJson: diagramjson
//            ////});
//            //self.diagramData.diagramJson = diagramjson;
//            //self.areaService
//            //    .UpdateAreaDiagramJson(self.diagramData, self._authenticator.TenantName)
//            //    .subscribe(res => console.log(res));
//        });

//        myDiagram.addDiagramListener("SelectionGrouped", function (e: go.DiagramEvent) {
//           // console.log("=====> SelectionGrouped");
//           // console.log("**guid :" + self.guid);
//           // console.log("**guid length:" + self.guid.length);


//           // //e.diagram.startTransaction("Modifying the Object Node Json data");
//           // //e.diagram.model.setDataProperty(e.diagram.selection.first().data, "key", Guid.generateGuid());
//           // //e.diagram.startTransaction("Object's Json data modified");
//           //// console.log("key", e.diagram.selection.first().data["key"]);
//           // var selnode = myDiagram.selection.first();
//           // var locationName = selnode.data.text;

//           // var diagramGUID = self.guid;
//           // var diagramName = self.diagramName;
//           // var groupId = e.diagram.selection.first().data["uuid"];
//           // var GroupName = e.diagram.selection.first().data["name"];
//           // var X = selnode.location.x;
//           // var Y = selnode.location.y;

//           // console.log("locationName: " + locationName);
//           // console.log("DiagramId :" + self.guid);
//           // console.log("diagramName :" + self.diagramName);
//           // console.log("diagramNam :" + diagramName);
//           // console.log("group ID :" + groupId);
//           // console.log("Name :" + GroupName);
//           // console.log("X:" + X);
//           // console.log("Y:" + Y);

//           // self.searchService.InsertLoc_GroupDocObservable.next({
//           //     DiagramId: diagramGUID,
//           //     DiagramName: diagramName,
//           //     LocationId: groupId,
//           //     TenantId: self._authenticator.TenantName + "-" + self.inspector.tenantId,
//           //     Name: GroupName,
//           //     X: X,
//           //     Y: Y,
//           //     Type: "Location Group"
//            //}); 

//            //var diagramGUID = self.guid;
//            //var diagramjson = myDiagram.model.toJson();

//            //self.diagramData.diagramJson = diagramjson;
//            //self.areaService
//            //    .UpdateAreaDiagramJson(self.diagramData, self._authenticator.TenantName)
//            //    .subscribe(res => console.log(res));

//            //var userName = self._authenticator.username
//            //var createdDataTime = new Date().toDateString()
//            //var diagramID = self.guid;
//            //var tenantID = self.diagramData.tenantId;
//            //var tenantName = self._authenticator.TenantName;
//            //var diagramName = self.diagramName;
//            //var groupCollection = new Array<go.Part>();

//            //e.diagram.selection.each(part => {
//            //    groupCollection.push(part)
//            //});

//            //var groupCollection$ = Observable.from(groupCollection).filter((value, i) => value != null);
//            //var createNodeDataInDB = groupCollection$
//            //    .subscribe(part => {
//            //        var data = part.data;

//            //        var locationData = new LocationData(data["uuid"], tenantID, tenantName, diagramID,
//            //            diagramName, data["NodeType"], null, userName, userName, createdDataTime,
//            //            createdDataTime, part.position.x + "", part.position.y + "", true);
//            //        console.debug(JSON.stringify(locationData))

//            //        self.inspector.createObjectInfoObservable.next(JSON.stringify(locationData));

//            //    }, err => console.error(err),
//            //    () => console.debug("createNodeDataInDB completed")
//            //    );

//        });

//        myDiagram.addDiagramListener("TextEdited", function (e: go.DiagramEvent) {
//            //var selnode = myDiagram.selection.first();
//            //var locationName = selnode.data.text;
//            //var locationId = selnode.data.key;

//            //var diagramName = self.diagramName;
//            //var GroupName = e.diagram.selection.first().data["name"];
//            //var groupId = e.diagram.selection.first().data["uuid"];

//            //console.log("Text Editing Json :" + myDiagram.model.toJson());
//            //var X = selnode.location.x;
//            //var Y = selnode.location.y;

//            //console.log("locationName: " + locationName)
//            //console.log("self.guid :" + self.guid);
//            //console.log("self.diagramName :" + self.diagramName);
//            //console.log("diagramName :" + diagramName);
//            //console.log("group ID :" + groupId);
//            //console.log("Name :" + GroupName);
//            //console.log("X:" + X);
//            //console.log("Y:" + Y);


//            //self.searchService.Textediting_groupObjDocObservable.next({
//            //    DiagramId: self.guid,
//            //    DiagramName: diagramName,
//            //    LocationId: groupId,
//            //    TenantId: self._authenticator.TenantName + "-" + self.inspector.tenantId,
//            //    Name: GroupName,
//            //    X: X,
//            //    Y: Y,
//            //    Type: "Location Group"
//            //});
//            //var diagramGUID = self.guid;
//            //var diagramjson = myDiagram.model.toJson();
//            ////self.inspector.updateAreaInfoObservable.next({
//            ////    GUID: diagramGUID,
//            ////    DiagramJson: diagramjson
//            ////});

//            //self.diagramData.diagramJson = diagramjson;
//            //self.areaService
//            //    .UpdateAreaDiagramJson(self.diagramData, self._authenticator.TenantName)
//            //    .subscribe(res => console.log(res));
        
//        });

//        myDiagram.addDiagramListener("SelectionUngrouped", function (e: go.DiagramEvent) {
//            //console.log("=====> SelectionUngrouped");
//            //console.log("**guid :" + self.guid);
//            //console.log("**guid length:" + self.guid.length);

//            //var diagramGUID = self.guid;
//            //var diagramjson = myDiagram.model.toJson();
//            ////self.inspector.updateAreaInfoObservable.next({
//            ////    GUID: diagramGUID,
//            ////    DiagramJson: diagramjson
//            ////});

//            //self.diagramData.diagramJson = diagramjson;
//            //self.areaService
//            //    .UpdateAreaDiagramJson(self.diagramData, self._authenticator.TenantName)
//            //    .subscribe(res => console.log(res));

//        });

//        this.errorService.navigationObservable.subscribe(res => {
//            console.log("navigationObservable Subscribed " + res);
//            this.searchDiagramNavigation(myDiagram, res);
//        });

//        this.inspector._diagram = myDiagram;
//        this.inspector.diagramGuid = this.guid;
//    }

//    searchDiagram(myDiagram: go.Diagram, locationId) {  // called by button

//        myDiagram.clearHighlighteds();
      
//        if (locationId) {
//            var results = myDiagram.findNodeForKey(locationId);
//            myDiagram.centerRect(results.actualBounds);
//        }
//        myDiagram.commitTransaction("highlight search");
//    }

//    searchDiagramNavigation(myDiagram: go.Diagram, locationId) {  // called by button

//        myDiagram.startTransaction("highlight search");
//                myDiagram.clearHighlighteds();
//        var diagnodes = new go.Set<go.Part>();
//        diagnodes.add(myDiagram.findNodeForKey(locationId));
//            var results = myDiagram.findNodeForKey(locationId);
//            myDiagram.centerRect(results.actualBounds);
//            myDiagram.selectCollection(diagnodes);

//        myDiagram.commitTransaction("highlight search");
//    }

//    TabCreateForArea(GUID, locationName) {
//        var self = this;
//        this.diagramName = locationName;
//        console.log(".inside TabCreateForArea");
//        self.addTab1(GUID, locationName);
////        self.DisplayDiagram(GUID);
//        self.DisplayDiagram({ "GUID": GUID, "locationName": locationName });

//        console.log("GUID : " + GUID);
      

//        $('#tabs a.' + GUID).on('click', function () {
          

//            self.DisplayDiagram({ "GUID": GUID, "locationName": locationName });


//            // hide all other tabs
//            $("#tabs li").removeClass("current");
//            // show current tab
//            $(this).parent().addClass("current");


//        });

//        $('#tabs a.remove').on('click', { 'class': GUID }, function (e) {

//            $(this).parent().remove();

//            var guid = e.data.class;
//            if (self.inspector.diagramGuid == guid) {
//                self.inspector._diagram.div = null;

//            }
//            self.areaService.displayAreaPaletteDiagram$.next(10);
//            self.areaService.displayAreaTree$.next(10);
//            // if there is no current tab and if there are still tabs left, show the first one
//            if ($("#tabs li.current").length == 0 && $("#tabs li").length > 0) {

//                // find the first tab
//                var firsttab = $("#tabs li:first-child");
//                firsttab.addClass("current");

//                // get its link name and show related content
//                var firsttabid = $(firsttab).find("a.tab").attr("id");
//                console.log("firsttabid :" + firsttabid);
                
//            }
//        });

//    }

//    addTab1(GUID, locationName) {
//        console.log("addTab1 Calling... " + GUID);

//        var self = this;
//        console.log("-showing tab");

//        if ($("#" + GUID).length != 0) {
           
//            $("#" + GUID).parent().remove();
//        }

//        $("#tabs li").removeClass("current");

//        $("#tabs").append("<li class='current'><a class='" + GUID + "' id='" + GUID + "' >" + locationName + "</a><a  class='remove'>x</a></li>");

//    }

//    GetGeometryString(geoname) {
//         return IconsComponent.icons[geoname];     
//    }

//    makeButton(text: any, action: any, visiblePredicate: any) {
//        var GO = go.GraphObject.make

//        return GO("ContextMenuButton",
//            GO(go.TextBlock, text),
//            { click: action },
//            // don't bother with binding GraphObject.visible if there's no predicate
//            visiblePredicate ? new go.Binding("visible", "", visiblePredicate).ofObject() : {});
//    }

}
