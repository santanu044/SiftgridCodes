/// <reference path="../area/areaservice.ts" />
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
var peopleService_1 = require('./peopleService');
var http_1 = require('@angular/http');
var areaService_1 = require("../area/areaService");
var searchService_1 = require("../search/searchService");
var guid_1 = require("../area/guid");
var Observable_1 = require('rxjs/Observable');
var AspectRatioService_1 = require('../aspectratiocalculation/AspectRatioService');
var Authenticator_1 = require('../auth/Authenticator');
var diagramService_1 = require('../diagram/diagramService');
var TimeMachineService_1 = require('../datepicker/TimeMachineService');
var PeopleComponent = (function () {
    function PeopleComponent(http, peopleService, searchService, areaService, aspectRatio, _authenticator, diagramService, timeservice) {
        var _this = this;
        this.http = http;
        this.peopleService = peopleService;
        this.searchService = searchService;
        this.areaService = areaService;
        this.aspectRatio = aspectRatio;
        this._authenticator = _authenticator;
        this.diagramService = diagramService;
        this.timeservice = timeservice;
        this.Guid = "people";
        diagramService.diagramTypeObservable.next("peoplediagram");
        peopleService.CreatePeopleDiagram$.subscribe(function (res) {
            _this.Guid = res;
            console.log("Res : " + res);
            _this.DisplayPeopleDiagram(res);
        });
        areaService.GetTenantId(this._authenticator.TenantName)
            .subscribe(function (res) {
            console.log(res);
            _this.tenantId = res;
            console.log(_this.tenantId);
        });
        searchService.createpeopleDiagramWithLocation$
            .subscribe(function (res) {
            areaService.displayPeopleDiagram$.next(10);
            areaService.displayPeopleDiagramTree$.next(10);
            var guid = res[0]["DiagramId"];
            var Name = res[0]["DiagramName"];
            var locationId = res[0]["LocationId"];
            //this.TabCreateForArea(guid, Name);
            _this.CreatePeopleDiagram();
            Observable_1.Observable.of(10).delay(2000).subscribe(function (res) {
                var groupNode = _this.peopleDiagram.findNodeForKey(locationId);
                //    this.peopleDiagram.position = groupNode.part.actualBounds.position
                _this.peopleDiagram.centerRect(groupNode.part.actualBounds);
            });
        }, function (err) { return console.log(err); }, function () { return console.log("Created diagram obserable completed"); });
        // Create People Diagram For TimeMachine
        timeservice.GetPeopleForTimeMachine.subscribe(function (res) {
            console.log(res);
            _this.diagramData = res;
            timeservice.selectedDate == "false";
            console.log("Inside People Component Observable : ");
            _this.CreatePeopleDiagram();
        });
    }
    PeopleComponent.prototype.ngOnInit = function () {
        this.getCSSJSONData();
        //this.createDynamicCSS();
    };
    PeopleComponent.prototype.onResize = function () {
        this.getCSSJSONData();
    };
    PeopleComponent.prototype.getCSSJSONData = function () {
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
    PeopleComponent.prototype.handleError = function (error) {
    };
    PeopleComponent.prototype.createDynamicCSS = function () {
        var deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        var UIBackgroundWidthJSON = (this.json["UIBackground"])["width"];
        var currentWidthRatio = this.aspectRatio.WidthRatio((this.json["UIBackground"])["width"], deviceWidth);
        var currentComponentWidth = this.aspectRatio.ComponentWidth(currentWidthRatio, (this.json["PeopleTree"])["width"]);
        var currentComponentHeight = this.aspectRatio.ComponentHeight(currentComponentWidth, (this.json["PeopleTree"])["height"] / (this.json["PeopleTree"])["width"]);
        var currentComponentLeft = this.aspectRatio.ComponentLeft(currentWidthRatio, (this.json["PeopleTree"])["left"]);
        var currentComponentTop = this.aspectRatio.ComponentTop(currentComponentLeft, (this.json["PeopleTree"])["top"] / (this.json["PeopleTree"])["left"]);
        /**
         * this is used to create dynamic CSS
         */
        $.injectCSS({
            "#PeopleTree": {
                "height": currentComponentHeight,
                "width": currentComponentWidth,
                "margin-left": currentComponentLeft,
                "margin-top": currentComponentTop,
                "margin-right": 0,
                "padding": 0,
                "background-color": "#1c1a1a",
                "color": "white",
                "position": "absolute"
            }
        }); // end of dynamic css
    };
    PeopleComponent.prototype.getPeopleDiagramJson = function (val) {
        console.log(val);
        this.CreatePeopleDiagram();
    };
    PeopleComponent.prototype.DisplayPeopleDiagram = function (guid) {
        this.timeservice.selectedDate = "false";
        console.log("INSIDE DisplayPeopleDiagram ( ) " + guid);
        this.timeservice.getDiagramGuidObservable.next(guid);
        this.CreatePeopleDiagram();
    };
    PeopleComponent.prototype.CreatePeopleDiagram = function () {
        var _this = this;
        var self = this;
        self.diagramService.diagramTypeObservable.next("peoplediagram");
        var GO = go.GraphObject.make; // for conciseness in defining templates
        //       this.TerminateObjectReferencesFromDiv();
        if (this.timeservice.selectedDate == "false") {
            console.log("Inside People Diagram === false");
            this.GetPeopleJson();
        }
        else {
            console.log("Inside People Diagram === TRUE");
            this.GetPeopleJsonForTimeMachine();
        }
        if (this.peopleDiagram != undefined)
            return;
        var myDiagram = GO(go.Diagram, "peopleDiagram", // must be the ID or reference to div
        {
            allowDrop: true,
            mouseDrop: function (e) { finishDrop(e, null); },
            allowMove: true,
            allowCopy: true,
            allowDelete: true,
            allowHorizontalScroll: true,
            initialContentAlignment: go.Spot.Center,
            maxSelectionCount: 1,
            validCycle: go.Diagram.CycleDestinationTree,
            //"clickCreatingTool.archetypeNodeData": {}, // allow double-click in background to create a new node
            //"clickCreatingTool.insertPart": function (loc) {  // customize the data for the new node
            //    this.archetypeNodeData = {
            //        key: Guid.generateGuid(), // assign the key based on the number of nodes
            //        name: "(new person)",
            //        title: "(title)"
            //    };
            //    var selnode = myDiagram.selection.first();
            //    var locationName = this.archetypeNodeData['name'];
            //    console.log("Person Name : " + locationName);
            //    var locationId = this.archetypeNodeData['key']
            //    console.log("Person ID : " + locationId);
            //    var title = this.archetypeNodeData['title']
            //    console.log("Title Name : " + title);
            //    var tenantId = self.tenantId
            //    self.searchService.InsertPeopleDocObservable.next({
            //        DiagramId: self.Guid,
            //        DiagramName: "People",
            //        LocationId: locationId,
            //        TenantId: self._authenticator.TenantName + "-" + tenantId,
            //        Name: locationName,
            //        X: "",
            //        Y: "",
            //        Type: "People"
            //    });
            //    self.searchService.InsertPeoplewithTitleDocObservable.next({
            //        DiagramId: self.Guid,
            //        DiagramName: "People",
            //        LocationId: locationId,
            //        TenantId: self._authenticator.TenantName + "-" + tenantId,
            //        Name: title,
            //        X: "",
            //        Y: "",
            //        Type: "People"
            //    });
            //    return go.ClickCreatingTool.prototype.insertPart.call(this, loc);
            //},
            layout: GO(go.TreeLayout, {
                treeStyle: go.TreeLayout.StyleLastParents,
                arrangement: go.TreeLayout.ArrangementHorizontal,
                // properties for most of the tree:
                angle: 90,
                layerSpacing: 35,
                // properties for the "last parents":
                alternateAngle: 90,
                alternateLayerSpacing: 35,
                alternateAlignment: go.TreeLayout.AlignmentBus,
                alternateNodeSpacing: 20
            }),
            "undoManager.isEnabled": true,
            "ChangedSelection": function (e) {
                if (myChangingSelection)
                    return;
                myChangingSelection = true;
                var diagnodes = new go.Set();
                myDiagram.selection.each(function (n) {
                    diagnodes.add(myTree.findNodeForData(n.data));
                });
                myTree.clearSelection();
                myTree.selectCollection(diagnodes);
                myChangingSelection = false;
            }
        });
        this.peopleDiagram = myDiagram;
        // Getting tenant Id
        function finishDrop(e, grp) {
            var ok = (grp !== null
                ? grp.addMembers(grp.diagram.selection, true)
                : e.diagram.commandHandler.addTopLevelParts(e.diagram.selection, true));
            if (!ok)
                e.diagram.currentTool.doCancel();
        }
        var myChangingSelection = false;
        myDiagram.addDiagramListener("TextEdited", function (e) {
            var diagramGUID = self.Guid;
            var diagramjson = myDiagram.model.toJson();
            var tenantName = self._authenticator.TenantName;
            if (myDiagram.isModified) {
                self.peopleService.updateUserObservable.next({
                    Guid: diagramGUID,
                    jsonData: diagramjson,
                    tenantName: tenantName,
                    tenantId: tenantId
                });
                var selnode = myDiagram.selection.first();
                var locationId = selnode.data.key;
                var name = e.diagram.selection.first().data["name"];
                var locationName = selnode.data.name;
                console.log("person Name  " + name);
                console.log("Edit Person Name : " + locationName);
                console.log(" Edit Person ID : " + locationId);
                var title = selnode.data.title;
                console.log("Title Name : " + title);
                self.searchService.EditPeopleDocObservable.next({
                    DiagramId: self.Guid,
                    DiagramName: "People",
                    LocationId: locationId,
                    TenantId: self._authenticator.TenantName + "-" + tenantId,
                    Name: locationName,
                    X: "",
                    Y: "",
                    Type: "People"
                });
                self.searchService.EditPeoplewithTitleDocObservable.next({
                    DiagramId: self.Guid,
                    DiagramName: "People",
                    LocationId: locationId,
                    TenantId: self._authenticator.TenantName + "-" + tenantId,
                    Name: title,
                    X: "",
                    Y: "",
                    Type: "People"
                });
            }
        });
        myDiagram.addDiagramListener("SelectionDeleting", function (e) {
            var part = e.subject.first(); // e.subject is the myDiagram.selection collection,
            // so we'll get the first since we know we only have one selection
            var selnode = myDiagram.selection.first();
            var locationId = selnode.data.key;
            myDiagram.startTransaction("clear boss");
            if (part instanceof go.Node) {
                var it = part.findTreeChildrenNodes(); // find all child nodes
                while (it.next()) {
                    var child = it.value;
                    var bossText = child.findObject("boss"); // since the boss TextBlock is named, we can access it by name
                    if (bossText === null)
                        return;
                    bossText.text = undefined;
                }
            }
            else if (part instanceof go.Link) {
                var child = part.toNode;
                var bossText = child.findObject("boss"); // since the boss TextBlock is named, we can access it by name
                if (bossText === null)
                    return;
                bossText.text = undefined;
            }
            myDiagram.commitTransaction("clear boss");
            console.log(" deleteing person ID " + locationId);
            self.searchService.deletePeopleDocObservable.next(locationId);
        });
        var levelColors = ["#AC193D/#BF1E4B", "#2672EC/#2E8DEF", "#8C0095/#A700AE", "#5133AB/#643EBF",
            "#008299/#00A0B1", "#D24726/#DC572E", "#008A00/#00A600", "#094AB2/#0A5BC4"];
        // override TreeLayout.commitNodes to also modify the background brush based on the tree depth level
        myDiagram.layout.commitNodes = function () {
            go.TreeLayout.prototype.commitNodes.call(myDiagram.layout); // do the standard behavior
            // then go through all of the vertexes and set their corresponding node's Shape.fill
            // to a brush dependent on the TreeVertex.level value
            //myDiagram.layout.network.vertexes.each(function (v: any) {
            //    if (v.node) {
            //        var level = v.level % (levelColors.length);
            //        var colors = levelColors[level].split("/");
            //        var shape = v.node.findObject("SHAPE");
            //        if (shape) shape.fill = GO(go.Brush, "Linear", { 0: colors[0], 1: colors[1], start: go.Spot.Left, end: go.Spot.Right });
            //    }
            //});
        };
        myDiagram.addModelChangedListener(function (e) {
            // myTree.startTransaction("add Tree");
            if (e.model.skipsUndoManager)
                return;
            // don't need to start/commit a transaction because the UndoManager is shared with myTreeView
            if (e.modelChange === "nodeGroupKey" || e.modelChange === "nodeParentKey") {
                // handle structural change: group memberships
                var treenode = myTree.findNodeForData(e.object);
                if (treenode !== null)
                    treenode.updateRelationshipsFromData();
            }
            else if (e.change === go.ChangedEvent.Property) {
                var treenode = myTree.findNodeForData(e.object);
                if (treenode !== null)
                    treenode.updateTargetBindings();
            }
            else if (e.change === go.ChangedEvent.Insert && e.propertyName === "nodeDataArray") {
                // pretend the new data isn't already in the nodeDataArray for myTreeView
                myTree.model.nodeDataArray.splice(e.newParam, 1);
                // now add to the myTreeView model using the normal mechanisms
                myTree.model.addNodeData(e.newValue);
            }
            else if (e.change === go.ChangedEvent.Remove && e.propertyName === "nodeDataArray") {
                // remove the corresponding node from myTreeView
                var treenode = myTree.findNodeForData(e.oldValue);
                if (treenode !== null)
                    myTree.remove(treenode);
            }
            // myTree.commitTransaction("add Tree");
        });
        // This function is used to find a suitable ID when modifying/creating nodes.
        // We used the counter combined with findNodeDataForKey to ensure uniqueness.
        var nodeIdCounter = -1;
        function getNextKey() {
            console.log("getNextKey");
            var key = nodeIdCounter;
            while (myDiagram.model.findNodeDataForKey(key.toString()) !== null) {
                key = nodeIdCounter -= 1;
            }
            return key.toString();
        }
        var tenantId = this.tenantId;
        console.log(tenantId);
        // when a node is double-clicked, add a child to it
        //function nodeDoubleClick(e, obj) {
        //    var clicked = obj.part;
        //    if (clicked !== null) {
        //        var thisemp = clicked.data;
        //        myDiagram.model.startTransaction("add employee");
        //        var nextkey = Guid.generateGuid();
        //        var newemp = { key: nextkey, name: "(new person)", title: "(title)", parent: thisemp.key };
        //        console.log(newemp);
        //        myDiagram.model.addNodeData(newemp);
        //        console.log("===>" + myDiagram.model.toJson());
        //        myDiagram.model.commitTransaction("add employee");
        //        var selnode = newemp
        //        var locationName = selnode['name'];
        //        console.log("Person Name : " + locationName);
        //        var locationId = selnode['key']
        //        console.log("Person ID : " + locationId);
        //        self.searchService.InsertPeopleDocObservable.next({
        //            DiagramId: self.Guid,
        //            DiagramName: "People",
        //            LocationId: locationId,
        //            TenantId: self._authenticator.TenantName + "-" + tenantId,
        //            Name: locationName,
        //            X: "",
        //            Y: "",
        //            Type: "People"
        //        });
        //        var title = selnode['title']
        //        self.searchService.InsertPeoplewithTitleDocObservable.next({
        //            DiagramId: self.Guid,
        //            DiagramName: "People",
        //            LocationId: locationId,
        //            TenantId: self._authenticator.TenantName + "-" + tenantId,
        //            Name: title,
        //            X: "",
        //            Y: "",
        //            Type: "People"
        //        });
        //    }
        //}
        myDiagram.addDiagramListener("BackgroundSingleClicked", function (e) {
            console.log("Background click :" + myDiagram.model.toJson());
            var diagramGUID = self.Guid;
            var diagramjson = myDiagram.model.toJson();
            var tenantName = self._authenticator.TenantName;
            console.log(myDiagram.model.toJson());
            self.peopleService.updateUserObservable.next({
                Guid: diagramGUID,
                jsonData: diagramjson,
                tenantName: tenantName,
                tenantId: tenantId
            });
        });
        function mayWorkFor(node1, node2) {
            if (!(node1 instanceof go.Node))
                return false; // must be a Node
            if (node1 === node2)
                return false; // cannot work for yourself
            if (node2.isInTreeOf(node1))
                return false; // cannot work for someone who works for you
            return true;
        }
        function textStyle() {
            return { font: "9pt  Segoe UI,sans-serif", stroke: "white" };
        }
        // This converter is used by the Picture.
        function findHeadShot(key) {
            return "../../images/PersonAvatarIcon.svg";
        }
        myDiagram.nodeTemplate = GO(go.Node, "Auto", {
            mouseDragEnter: function (e, node, prev) {
                var diagram = node.diagram;
                var selnode = diagram.selection.first();
                if (!mayWorkFor(selnode, node))
                    return;
                var shape = node.findObject("SHAPE");
                if (shape) {
                    shape._prevFill = shape.fill; // remember the original brush
                    shape.fill = "darkred";
                }
            },
            mouseDragLeave: function (e, node, next) {
                var shape = node.findObject("SHAPE");
                if (shape && shape._prevFill) {
                    shape.fill = shape._prevFill; // restore the original brush
                }
            },
            mouseDrop: function (e, node) {
                var diagram = node.diagram;
                var selnode = diagram.selection.first(); // assume just one Node in selection
                if (mayWorkFor(selnode, node)) {
                    // find any existing link into the selected node
                    var link = selnode.findTreeParentLink();
                    if (link !== null) {
                        link.fromNode = node;
                    }
                    else {
                        diagram.toolManager.linkingTool.insertLink(node, node.port, selnode, selnode.port);
                    }
                }
            }
        }, new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), new go.Binding("text", "name"), 
        // bind the Part.layerName to control the Node's layer depending on whether it isSelected
        new go.Binding("layerName", "isSelected", function (sel) { return sel ? "Foreground" : ""; }).ofObject(), 
        // define the node's outer shape
        GO(go.Shape, "Rectangle", {
            name: "SHAPE", fill: "#424242", stroke: "grey", height: 64, width: 205,
            // set the port properties:
            portId: "", fromLinkable: true, toLinkable: true, cursor: "pointer"
        }), GO(go.Panel, "Horizontal", GO(go.Picture, {
            name: 'Picture',
            desiredSize: new go.Size(33, 33),
            margin: new go.Margin(6, 8, 6, 10),
        }, new go.Binding("source", "key", findHeadShot)), 
        // define the panel where the text will appear
        GO(go.Panel, "Table", {
            maxSize: new go.Size(150, 999),
            margin: new go.Margin(6, 10, 0, 3),
            defaultAlignment: go.Spot.Left
        }, GO(go.RowColumnDefinition, { column: 2, width: 4 }), GO(go.TextBlock, "Person:", { row: 0, column: 0, height: 13, width: 45, stroke: "white" }), GO(go.TextBlock, // the name
        {
            text: "(person)",
            row: 0, column: 1, columnSpan: 9,
            font: "10pt Segoe UI,Roboto-Medium",
            stroke: "white",
            editable: true, isMultiline: false
        }, new go.Binding("text", "name").makeTwoWay()), GO(go.TextBlock, "Title:", {
            row: 1, column: 0, opacity: 0.64, columnSpan: 9,
            height: 13, width: 30, stroke: "white"
        }), GO(go.TextBlock, {
            text: "(title)",
            row: 1, column: 1, columnSpan: 8,
            isMultiline: false,
            editable: true,
            font: "10pt Segoe UI,Roboto-Regular",
            stroke: "white",
        }, new go.Binding("text", "title").makeTwoWay()), GO(go.TextBlock, textStyle(), { name: "boss", row: 2, column: 3, }, new go.Binding("text", "parent", function (v) { return "Boss: " + v; })))));
        myDiagram.linkTemplate =
            GO(go.Link, go.Link.Orthogonal, { corner: 5, relinkableFrom: true, relinkableTo: true }, GO(go.Shape, { strokeWidth: 4, stroke: "#00a4a4" }));
        //myDiagram.nodeTemplate =
        //    GO(go.Node, "Auto",
        //        //{ doubleClick: nodeDoubleClick },
        //        { // handle dragging a Node onto a Node to (maybe) change the reporting relationship
        //            mouseDragEnter: function (e, node, prev) {
        //                var diagram = node.diagram;
        //                var selnode = diagram.selection.first();
        //                if (!mayWorkFor(selnode, node)) return;
        //                var shape = node.findObject("SHAPE");
        //                if (shape) {
        //                    shape._prevFill = shape.fill;  // remember the original brush
        //                    shape.fill = "darkred";
        //                }
        //            },
        //            mouseDragLeave: function (e, node, next) {
        //                var shape = node.findObject("SHAPE");
        //                if (shape && shape._prevFill) {
        //                    shape.fill = shape._prevFill;  // restore the original brush
        //                }
        //            },
        //            mouseDrop: function (e, node) {
        //                var diagram = node.diagram;
        //                var selnode = diagram.selection.first();  // assume just one Node in selection
        //                if (mayWorkFor(selnode, node)) {
        //                    // find any existing link into the selected node
        //                    var link = selnode.findTreeParentLink();
        //                    if (link !== null) {  // reconnect any existing link
        //                        link.fromNode = node;
        //                    } else {  // else create a new link
        //                        diagram.toolManager.linkingTool.insertLink(node, node.port, selnode, selnode.port);
        //                    }
        //                }
        //            }
        //        },
        //        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        //        // for sorting, have the Node.text be the data.name
        //        new go.Binding("text", "name"),
        //        // bind the Part.layerName to control the Node's layer depending on whether it isSelected
        //        new go.Binding("layerName", "isSelected", function (sel) { return sel ? "Foreground" : ""; }).ofObject(),
        //        // define the node's outer shape
        //        GO(go.Shape, "Rectangle",
        //            {
        //                name: "SHAPE", fill: "#424242", stroke: null,height: 54, width: 175,
        //                // set the port properties:
        //                portId: "", fromLinkable: true, toLinkable: true, cursor: "pointer"
        //            }),
        //        GO(go.Panel, "Horizontal",
        //            GO(go.Picture,
        //                {
        //                    name: 'Picture',
        //                    desiredSize: new go.Size(33, 33),
        //                    margin: new go.Margin(4, 6, 4, 8),
        //                }
        //            //    new go.Binding("source", "key", findHeadShot)
        //            ),
        //            // define the panel where the text will appear
        //            GO(go.Panel, "Table",
        //                {
        //                    maxSize: new go.Size(150, 999),
        //                    margin: new go.Margin(6, 10, 0, 3),
        //                    defaultAlignment: go.Spot.Left
        //                },
        //                GO(go.RowColumnDefinition, { column: 2, width: 4 }),
        //                GO(go.TextBlock, textStyle(),  // the name
        //                    {
        //                        row: 0, column: 0, columnSpan: 5,
        //                        font: "12pt Segoe UI,sans-serif",
        //                        editable: true, isMultiline: false,
        //                        minSize: new go.Size(10, 16)
        //                    },
        //                    new go.Binding("text", "name").makeTwoWay()),
        //                GO(go.TextBlock, "Title: ", textStyle(),
        //                    { row: 1, column: 0 }),
        //                GO(go.TextBlock, textStyle(),
        //                    {
        //                        row: 1, column: 1, columnSpan: 4,
        //                        editable: true, isMultiline: false,
        //                        minSize: new go.Size(8, 12),
        //                        margin: new go.Margin(0, 0, 0, 3)
        //                    },
        //                    new go.Binding("text", "title").makeTwoWay()),
        //                //GO(go.TextBlock, textStyle(),
        //                //    { row: 2, column: 0 },
        //                //    new go.Binding("text", "key", function (v) { return "ID: " + v; })),
        //                //GO(go.TextBlock, textStyle(),
        //                //    { name: "boss", row: 2, column: 3, }, // we include a name so we can access this TextBlock when deleting Nodes/Links
        //                //    new go.Binding("text", "parent", function (v) { return "Boss: " + v; })),
        //                GO(go.TextBlock, textStyle(),  // the comments
        //                    {
        //                        row: 3, column: 0, columnSpan: 5,
        //                        font: "italic 9pt sans-serif",
        //                        wrap: go.TextBlock.WrapFit,
        //                        editable: true, 
        //                        minSize: new go.Size(8, 12)
        //                    },
        //                    new go.Binding("text", "comments").makeTwoWay())
        //            )  // end Table Panel
        //        ) // end Horizontal Panel
        //    );  // end Node
        /*------------------------------------------------------*/
        myDiagram.addDiagramListener("ExternalObjectsDropped", function (e) {
            var selected = e.diagram.selection.iterator;
            myDiagram.model.startTransaction("add employee");
            var nextkey = guid_1.Guid.generateGuid();
            console.log("===>" + myDiagram.model.toJson());
            myDiagram.model.commitTransaction("add employee");
            while (selected.next()) {
                var selectedNode = e.diagram.selection.first();
                selectedNode.data.key = nextkey;
                selectedNode.data["name"] = "(new Person)";
                var locationName = selectedNode.data["name"];
                var title = selectedNode.data["title"];
                console.log("Location Name : " + locationName);
                console.log("Title : " + locationName);
                console.log("Person GUID : " + selectedNode.data.key);
                var data = selected.value.data;
                var diagramGUID = self.Guid;
                var diagramjson = myDiagram.model.toJson();
                console.log(diagramjson);
                var tenantName = self._authenticator.TenantName;
                var selnode = myDiagram.selection.first();
                self.peopleService.updateUserObservable.next({
                    Guid: diagramGUID,
                    jsonData: diagramjson,
                    tenantName: tenantName,
                    tenantId: tenantId
                });
                self.searchService.InsertPeopleDocObservable.next({
                    DiagramId: self.Guid,
                    DiagramName: "People",
                    LocationId: nextkey,
                    TenantId: self._authenticator.TenantName + "-" + tenantId,
                    Name: locationName,
                    X: "",
                    Y: "",
                    Type: "People"
                });
                self.searchService.InsertPeoplewithTitleDocObservable.next({
                    DiagramId: self.Guid,
                    DiagramName: "People",
                    LocationId: nextkey,
                    TenantId: self._authenticator.TenantName + "-" + tenantId,
                    Name: title,
                    X: "",
                    Y: "",
                    Type: "People"
                });
            }
        });
        /*------------------------------------------------------*/
        //TREE VIEW
        var myTree = GO(go.Diagram, "PeopleTree", {
            allowMove: true,
            allowCopy: true,
            allowDelete: true,
            allowDrop: true,
            // what to do when a drag-drop occurs in the Diagram's background
            mouseDrop: function (e) { finishDrop(e, null); },
            allowHorizontalScroll: false,
            "commandHandler.copiesTree": true,
            "commandHandler.copiesParentKey": true,
            maxSelectionCount: 1,
            validCycle: go.Diagram.CycleDestinationTree,
            //  "clickCreatingTool.archetypeNodeData": {},
            layout: GO(go.TreeLayout, {
                alignment: go.TreeLayout.AlignmentStart,
                angle: 0,
                compaction: go.TreeLayout.CompactionNone,
                layerSpacing: 16,
                layerSpacingParentOverlap: 1,
                nodeIndent: 2,
                nodeIndentPastParent: 0.88,
                nodeSpacing: 0,
                setsPortSpot: true,
                setsChildPortSpot: true,
                arrangementSpacing: new go.Size(0, 0)
            }), "undoManager.isEnabled": true,
            "ChangedSelection": function (e) {
                if (myChangingSelection)
                    return;
                myChangingSelection = true;
                var diagnodes = new go.Set();
                myTree.selection.each(function (n) {
                    diagnodes.add(myDiagram.findNodeForData(n.data));
                });
                myDiagram.clearSelection();
                myDiagram.selectCollection(diagnodes);
                myChangingSelection = false;
            }
        });
        this.peopleTreeDiagram = myTree;
        var myChangingSelection = false;
        myTree.model = GO(go.TreeModel, { nodeParentKeyProperty: "parent" });
        myTree.addModelChangedListener(function (e) {
            // myTree.startTransaction("add Tree");
            if (e.model.skipsUndoManager)
                return;
            // don't need to start/commit a transaction because the UndoManager is shared with myTreeView
            if (e.modelChange === "nodeGroupKey" || e.modelChange === "nodeParentKey") {
                // handle structural change: group memberships
                var treenode = myDiagram.findNodeForData(e.object);
                if (treenode !== null)
                    treenode.updateRelationshipsFromData();
            }
            else if (e.change === go.ChangedEvent.Property) {
                var treenode = myDiagram.findNodeForData(e.object);
                if (treenode !== null)
                    treenode.updateTargetBindings();
            }
            else if (e.change === go.ChangedEvent.Remove && e.propertyName === "nodeDataArray") {
                // remove the corresponding node from myTreeView
                var treenode = myDiagram.findNodeForData(e.oldValue);
                if (treenode !== null)
                    myDiagram.remove(treenode);
            }
            // myTree.commitTransaction("add Tree");
        });
        myTree.addDiagramListener("TextEdited", function (e) {
            var diagramGUID = self.Guid;
            var diagramjson = myTree.model.toJson();
            console.log(myTree.model.toJson());
            var tenantName = self._authenticator.TenantName;
            if (myTree.isModified) {
                self.peopleService.updateUserObservable.next({
                    Guid: diagramGUID,
                    jsonData: diagramjson,
                    tenantName: tenantName,
                    tenantId: tenantId
                });
            }
        });
        myTree.addDiagramListener("PartCreated", function (e) {
            console.log(e.selection.first().data);
        });
        myTree.addDiagramListener("SelectionDeleting", function (e) {
            var part = e.subject.first(); // e.subject is the myDiagram.selection collection,
            // so we'll get the first since we know we only have one selection
            myTree.startTransaction("clear boss");
            if (part instanceof go.Node) {
                var it = part.findTreeChildrenNodes(); // find all child nodes
                while (it.next()) {
                    var child = it.value;
                    var bossText = child.findObject("boss"); // since the boss TextBlock is named, we can access it by name
                    if (bossText === null)
                        return;
                    bossText.text = undefined;
                }
            }
            else if (part instanceof go.Link) {
                var child = part.toNode;
                var bossText = child.findObject("boss"); // since the boss TextBlock is named, we can access it by name
                if (bossText === null)
                    return;
                bossText.text = undefined;
            }
            myTree.commitTransaction("clear boss");
        });
        myTree.nodeTemplate =
            GO(go.Node, {
                selectionAdorned: true,
                // a custom function to allow expanding/collapsing on double-click
                // this uses similar logic to a TreeExpanderButton
                doubleClick: function (e, node) {
                    var cmd = myTree.commandHandler;
                    if (node.isTreeExpanded) {
                        if (!cmd.canCollapseTree(node))
                            return;
                    }
                    else {
                        if (!cmd.canExpandTree(node))
                            return;
                    }
                    e.handled = true;
                    if (node.isTreeExpanded) {
                        cmd.collapseTree(node);
                    }
                    else {
                        cmd.expandTree(node);
                    }
                }, mouseDragEnter: function (e, node, prev) {
                    var diagram = node.diagram;
                    var selnode = diagram.selection.first();
                    if (!mayWorkFor(selnode, node))
                        return;
                    var shape = node.findObject("SHAPE");
                    if (shape) {
                        shape._prevFill = shape.fill; // remember the original brush
                        shape.fill = "darkred";
                    }
                },
                mouseDragLeave: function (e, node, next) {
                    var shape = node.findObject("SHAPE");
                    if (shape && shape._prevFill) {
                        shape.fill = shape._prevFill; // restore the original brush
                    }
                },
                mouseDrop: function (e, node) {
                    var diagram = node.diagram;
                    var selnode = diagram.selection.first(); // assume just one Node in selection
                    if (mayWorkFor(selnode, node)) {
                        // find any existing link into the selected node
                        var link = selnode.findTreeParentLink();
                        if (link !== null) {
                            link.fromNode = node;
                        }
                        else {
                            diagram.toolManager.linkingTool.insertLink(node, node.port, selnode, selnode.port);
                        }
                    }
                }
            }, GO("TreeExpanderButton", {
                width: 14,
                "ButtonBorder.fill": "whitesmoke",
                "ButtonBorder.stroke": null,
                "_buttonFillOver": "rgba(255,255,0,0.8)",
                "_buttonStrokeOver": null
            }), GO(go.Panel, "Horizontal", { position: new go.Point(16, 0) }, new go.Binding("background", "isSelected", function (s) { return (s ? "#696969" : null); }).ofObject(), GO(go.Picture, {
                width: 0, height: 18,
                margin: new go.Margin(0, 4, 0, 0),
                imageStretch: go.GraphObject.Uniform
            }), GO(go.TextBlock, {
                font: '9pt Verdana, sans-serif',
                stroke: "white",
                wrap: go.TextBlock.WrapFit
            }, new go.Binding("text", "name").makeTwoWay()))); // end Node
        // without lines
        myTree.linkTemplate = GO(go.Link);
        this.GetPeopleJson();
        myTree.addDiagramListener("ObjectSingleClicked", function (e) {
            console.log("Inside NewDiagram ObjectSingleClicked");
            var selectedparts = e.diagram.selection.iterator;
            var selnode = myDiagram.selection.first();
            var diagramGUID = self.Guid;
            while (selectedparts.next()) {
                var data = selectedparts.value.data;
                var locationId = data["key"];
                console.log("Selected Node Id : " + locationId);
                self.searchDiagram(myDiagram, locationId);
            }
        });
        // share all of the data with the tree view
        myTree.model.nodeDataArray = myDiagram.model.nodeDataArray;
        // share the UndoManager too!
        myTree.model.undoManager = myDiagram.model.undoManager;
        this.diagramService.isDiagramEdittableObservable.subscribe(function (res) {
            console.log("Inside isDiagramEdittableObservable People Diagram ");
            if (res == "visible") {
                _this.peopleDiagram.isReadOnly = false;
            }
            else {
                _this.peopleDiagram.isReadOnly = true;
            }
        });
        this.diagramService.isDiagramEdittableObservable.next("hidden");
        var myOverview = GO(go.Overview, "myOverviewDiv2", // the HTML DIV element for the Overview
        { observed: myDiagram, contentAlignment: go.Spot.Center });
        this.diagramService.zoomControlObservable.subscribe(function (res) {
            if (res == "zoomIn") {
                var zoomin = myDiagram.commandHandler.increaseZoom();
            }
            else {
                var zoomout = myDiagram.commandHandler.decreaseZoom();
            }
        });
    };
    PeopleComponent.prototype.searchDiagram = function (myDiagram, locationId) {
        myDiagram.clearHighlighteds();
        if (locationId) {
            var results = myDiagram.findNodeForKey(locationId);
            myDiagram.centerRect(results.actualBounds);
        }
        myDiagram.commitTransaction("highlight search");
    };
    PeopleComponent.prototype.GetPeopleJson = function () {
        var JsonData;
        var self = this;
        document.getElementById("peopleDiagram").style.backgroundColor = "white";
        this.peopleService
            .getUserById(this.Guid, this._authenticator.TenantName)
            .subscribe(function (data) {
            console.log(data);
            JsonData = data["jsonData"];
            //     this.tenantId = data["tenantId"]
            self.peopleDiagram.model = go.Model.fromJson(JsonData);
            self.peopleTreeDiagram.model.nodeDataArray = self.peopleDiagram.model.nodeDataArray;
            self.peopleDiagram.isReadOnly = true;
            self.peopleDiagram.isEnabled = true;
            self.peopleTreeDiagram.isEnabled = true;
        });
        this.JsonData = JsonData;
        return JsonData;
    };
    PeopleComponent.prototype.GetPeopleJsonForTimeMachine = function () {
        console.log("INSIDE GetPeopleJsonForTimeMachine ");
        var JsonData;
        JsonData = this.diagramData;
        this.peopleDiagram.model = go.Model.fromJson(JsonData);
        this.peopleTreeDiagram.model.nodeDataArray = this.peopleDiagram.model.nodeDataArray;
        this.peopleDiagram.isReadOnly = true;
        this.peopleDiagram.isEnabled = false;
        this.peopleTreeDiagram.isEnabled = false;
        document.getElementById("peopleDiagram").style.backgroundColor = "gray";
        return JsonData;
    };
    __decorate([
        core_1.HostListener('window:resize'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], PeopleComponent.prototype, "onResize", null);
    PeopleComponent = __decorate([
        core_1.Component({
            selector: 'people',
            templateUrl: 'app/people/people.template.html'
        }), 
        __metadata('design:paramtypes', [http_1.Http, peopleService_1.PeopleService, searchService_1.SearchService, areaService_1.AreaService, AspectRatioService_1.AspectRatioService, Authenticator_1.Authenticator, diagramService_1.DiagramService, TimeMachineService_1.TimeMachineService])
    ], PeopleComponent);
    return PeopleComponent;
}());
exports.PeopleComponent = PeopleComponent;
//# sourceMappingURL=people.component.js.map