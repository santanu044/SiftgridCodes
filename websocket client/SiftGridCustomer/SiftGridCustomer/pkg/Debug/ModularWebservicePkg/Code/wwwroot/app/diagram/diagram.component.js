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
/// <reference path="porthelpers.ts" />
/// <reference path="porthelpers.ts" />
/// <reference path="../../libs/gojs.d.ts" />
/// <reference path="../../libs/jquery.d.ts" />
var core_1 = require("@angular/core");
var icons_1 = require("./icons");
var diagramService_1 = require("./diagramService");
var notesService_1 = require('../notes/notesService');
var areaService_1 = require('../area/areaService');
var AspectRatioService_1 = require('../aspectratiocalculation/AspectRatioService');
var Authenticator_1 = require('../auth/Authenticator');
var Rx_1 = require("rxjs/Rx");
var searchService_1 = require("../search/searchService");
var TimeMachineService_1 = require('../datepicker/TimeMachineService');
var errorService_1 = require('../errorpane/errorService');
var CustomDraggingTool_1 = require('./CustomDraggingTool');
var CustomLinkingTool_1 = require("./CustomLinkingTool");
var chat_service_1 = require('../websocket/chat.service');
var DiagramComponent = (function () {
    /// <summary>
    /// Injecting Inspector to the Diagram component
    /// </summary>
    /// <param name="inspector">Contains angular http post and get methods.</param>
    function DiagramComponent(inspector, notesInspector, searchService, areaService, aspectRatio, _authenticator, errorService, timeservice, chatService) {
        var _this = this;
        this.inspector = inspector;
        this.searchService = searchService;
        this.areaService = areaService;
        this.aspectRatio = aspectRatio;
        this._authenticator = _authenticator;
        this.errorService = errorService;
        this.timeservice = timeservice;
        this.chatService = chatService;
        this.notesInspector = notesInspector;
        this.inspector.diagramTypeObservable.next("diagram");
        chatService.messages.subscribe(function (msg) {
            console.log(msg);
            console.log(msg.deviceid);
            var linkData = _this.myDiagram.model.findLinkDataForKey(msg.pipelineid);
            var nodeData1 = linkData;
            console.log(nodeData1);
            _this.myDiagram.startTransaction("changing diagram color");
            _this.myDiagram.model.setDataProperty(nodeData1, "color", "red");
            _this.myDiagram.commitTransaction("changing diagram color");
            var timer = Rx_1.Observable.create(function (observer) {
                setTimeout(function () {
                    observer.next('black');
                }, 10000);
            });
            timer.subscribe(function (e) {
                console.log(e);
                _this.myDiagram.startTransaction("changing diagram black color");
                _this.myDiagram.model.setDataProperty(nodeData1, "color", e);
                _this.myDiagram.commitTransaction("changing diagram black color");
            });
            // var nmessage = {
            //     deviceid: '',
            //     pipelineid:'f3031f71',
            //     meter_value: ''
            // }
            // this.chatService.messages.next(nmessage);	
        });
    }
    DiagramComponent.prototype.sendMsg = function () {
        var nmessage = {
            deviceid: '',
            pipelineid: '42f9f1ac',
            meter_value: ''
        };
        this.chatService.messages.next(nmessage);
    };
    DiagramComponent.prototype.ngOnInit = function () {
        var $ = go.GraphObject.make;
        var myDiagram = $(go.Diagram, "diagramDiv", {
            "commandHandler.archetypeGroupData": { name: "Group", text: "Group", nodeType: "Boundary", isGroup: true, color: "blue" },
            allowDrop: true, "relinkingTool.isUnconnectedLinkValid": true, "draggingTool.dragsLink": true,
            "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
            "relinkingTool.portGravity": 20,
            "relinkingTool.fromHandleArchetype": $(go.Shape, "Circle", {
                segmentIndex: 0, cursor: "pointer", desiredSize: new go.Size(8, 8),
                fill: "deepskyblue", stroke: "black"
            }),
            "relinkingTool.toHandleArchetype": $(go.Shape, "Circle", {
                segmentIndex: -1, cursor: "pointer", desiredSize: new go.Size(8, 8),
                fill: "deepskyblue", stroke: "black"
            }),
            "linkReshapingTool.handleArchetype": $(go.Shape, "Square", {
                desiredSize: new go.Size(7, 7),
                fill: "yellow", stroke: "black"
            })
        });
        this.myDiagram = myDiagram;
        var self = this;
        var nodeRotateAdornmentTemplate = $(go.Adornment, { locationSpot: go.Spot.Center }, $(go.Shape, "Circle", { cursor: "pointer", desiredSize: new go.Size(9, 9), fill: "yellow", stroke: "black" }));
        myDiagram.nodeTemplate =
            $(go.Node, "Auto", {
                resizable: true,
            }, {
                rotatable: true,
                rotateAdornmentTemplate: nodeRotateAdornmentTemplate
            }, new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), { contextMenu: $(go.Adornment) }, $(go.Shape, { fill: "white", stroke: "black", strokeWidth: 2 }, new go.Binding("stroke", "color"), new go.Binding("fill", "dColor"), new go.Binding("width", "width"), new go.Binding("height", "height"), new go.Binding("geometryString", "name", self.geoFunc), {}), $(go.TextBlock, { margin: 5, text: "" }), this.makePort("T", go.Spot.Top, true, true), this.makePort("L", go.Spot.Left, true, true), this.makePort("R", go.Spot.Right, true, true), this.makePort("B", go.Spot.Bottom, true, false), {
                mouseEnter: function (e, node) { self.showSmallPorts(node, true); },
                mouseLeave: function (e, node) { self.showSmallPorts(node, false); },
                toolTip: $(go.Adornment, "Auto", $(go.Shape, { fill: "#FFFFCC" }), $(go.TextBlock, { margin: 2 }, // the tooltip shows the result of calling nodeInfo(data)
                new go.Binding("text", "name")))
            });
        go.Shape.defineArrowheadGeometry("ArrowFromArrow", "F1M5,1L0,5 5,9z");
        go.Shape.defineArrowheadGeometry("BlindedFromArrow", "F1M7.5,18.75L7.5,0 M0,18.75L0,0");
        go.Shape.defineArrowheadGeometry("CappedFromArrow", "F1M7.5,0L0,0 0,18.75 7.5,18.75");
        go.Shape.defineArrowheadGeometry("ArrowToArrow", "F1M0,1L5,5 0,9z");
        go.Shape.defineArrowheadGeometry("BlindedToArrow", "F1M7.5,18.75L7.5,0 M0,18.75L0,0");
        go.Shape.defineArrowheadGeometry("CappedToArrow", "F1M0,0L7.5,0 7.5,18.75 0,18.75");
        myDiagram.linkTemplate =
            $(go.Link, {
                routing: go.Link.Orthogonal,
                corner: 5,
                curve: go.Link.JumpOver,
                toShortLength: 2
            }, {
                selectable: true
            }, {
                reshapable: true, resegmentable: true, fromEndSegmentDirection: go.Node.DirectionRotatedNodeOrthogonal,
                toEndSegmentDirection: go.Node.DirectionRotatedNodeOrthogonal
            }, { adjusting: go.Link.Stretch }, { toShortLength: 3, relinkableFrom: true, relinkableTo: true }, new go.Binding("points", "points").makeTwoWay(), 
            // allow the user to relink existing links
            $(go.Shape, { name: "LSHAPE", strokeWidth: 3, stroke: "black" }, new go.Binding("stroke", "color")), $(go.Shape, { fromArrow: "", stroke: "black" }, new go.Binding("fromArrow", "fromArrow").makeTwoWay(), new go.Binding("stroke", "color")), $(go.Shape, { toArrow: "Triangle", name: "LARROW", stroke: "black" }, new go.Binding("toArrow", "toArrow").makeTwoWay()));
        var lollipop = $(go.Link, {
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
        }, 
        //{ routing: go.Link.Orthogonal },  // optional, but need to keep LinkingTool.temporaryLink in sync, above
        new go.Binding("points", "points").makeTwoWay(), $(go.Shape, { strokeWidth: 2 }, this.shapeStyle()));
        myDiagram.linkTemplateMap.add("lollipop", lollipop);
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
        myDiagram.model.linkKeyProperty = "uuid";
        //myDiagram.model.makeUniqueKeyFunction = function (model, data) {
        //    console.log("makeUniqueFunction called")
        //    return self.generateGuid();
        //};
        //(<go.GraphLinksModel>myDiagram.model).makeUniqueLinkKeyFunction = function (model, data) {
        //    console.log("makeUniqueFunction called")
        //    return self.generateGuid();
        //};
        myDiagram.addDiagramListener("SelectionGrouped", function (e) {
            e.diagram.selection.each(function (part) { return console.log(part.data); });
            e.diagram.selection.each(function (part) { return console.log(part instanceof go.Group); });
        });
        myDiagram.addDiagramListener("SelectionUngrouped", function (e) {
            e.diagram.selection.each(function (part) { return console.log(part.data); });
        });
        myDiagram.addDiagramListener("SelectionDeleting", function (e) {
            e.diagram.selection.each(function (part) { return console.log(part.data); });
        });
        myDiagram.addDiagramListener("SelectionDeleted", function (e) {
            e.diagram.selection.each(function (part) { return console.log(part.data); });
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
        model.linkFromPortIdProperty = "fromPort";
        model.linkToPortIdProperty = "toPort";
        var link = new go.Link();
        link.routing = go.Link.AvoidsNodes;
        link.curve = go.Link.JumpGap;
        link.corner = 5;
        link.fromEndSegmentLength = 15;
        link.toEndSegmentLength = 15;
        link.fromEndSegmentDirection = go.Node.DirectionRotatedNodeOrthogonal;
        link.toEndSegmentDirection = go.Node.DirectionRotatedNodeOrthogonal;
        link.toShortLength = 5;
        link.relinkableFrom = true;
        link.relinkableTo = true;
        var shape = new go.Shape();
        shape.name = "Path";
        shape.stroke = "red";
        shape.strokeWidth = 1;
        var arrow = new go.Shape();
        arrow.toArrow = "Triangle";
        link.add(shape);
        link.add(arrow);
        var tool = new CustomLinkingTool_1.CustomLinkingTool();
        tool.portGravity = 15;
        tool.temporaryLink = link;
        tool.isUnconnectedLinkValid = true;
        myDiagram.toolManager.linkingTool = tool;
        // Custom Dragging tool
        var customDraggingTool = new CustomDraggingTool_1.CustomDraggingTool();
        customDraggingTool.dragsLink = true;
        myDiagram.toolManager.draggingTool = customDraggingTool;
        myDiagram.focus = function () {
            go.Diagram.prototype.focus.call(this);
        };
    };
    DiagramComponent.prototype.makePort = function (name, spot, output, input) {
        var GO = go.GraphObject.make;
        return GO(go.Shape, "Square", {
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
    };
    DiagramComponent.prototype.showSmallPorts = function (node, show) {
        node.ports.each(function (port) {
            if (port.portId !== "") {
                port.fill = show ? "white" : null;
                port.stroke = show ? "black" : null;
            }
        });
    };
    DiagramComponent.prototype.shapeStyle = function () {
        //  console.log("called");
        return [
            { stroke: "rgb(63,63,63)", strokeWidth: 2 },
            new go.Binding("stroke", "isHighlighted", function (h) { return h ? "chartreuse" : "rgb(63,63,63)"; }).ofObject(),
            new go.Binding("strokeWidth", "isHighlighted", function (h) { return h ? 4 : 2; }).ofObject()
        ];
    };
    DiagramComponent.prototype.geoFunc = function (geoname) {
        return icons_1.IconsComponent.icons[geoname];
    };
    __decorate([
        core_1.ViewChild("myDiagramDiv"), 
        __metadata('design:type', Object)
    ], DiagramComponent.prototype, "div", void 0);
    DiagramComponent = __decorate([
        core_1.Component({
            selector: "diagram",
            templateUrl: 'app/diagram/diagram.component.html',
            styleUrls: ["/inputElementStyle.css"]
        }), 
        __metadata('design:paramtypes', [diagramService_1.DiagramService, notesService_1.NotesService, searchService_1.SearchService, areaService_1.AreaService, AspectRatioService_1.AspectRatioService, Authenticator_1.Authenticator, errorService_1.ErrorService, TimeMachineService_1.TimeMachineService, chat_service_1.ChatService])
    ], DiagramComponent);
    return DiagramComponent;
}());
exports.DiagramComponent = DiagramComponent;
//# sourceMappingURL=diagram.component.js.map