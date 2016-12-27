/// <reference path="../../libs/gojs.d.ts" />
import {Component, Input, OnInit, ViewChild, AfterViewInit, ContentChildren, Output, EventEmitter} from '@angular/core';
import {Inspector} from '../diagram/InspectorService';
import {Areas} from "../diagram/Areas";
import {DiagramComponent} from '../diagram/diagram.component';

@Component({
    selector: 'tree',
    templateUrl: 'app/treeview/tree.component.html'
})
export class TreeComponent  {

    constructor(private inspectorService: Inspector) {
    
    }

load() {
//    myDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);

    // share all of the data with the tree view
 //   myTreeView.model.nodeDataArray = myDiagram.model.nodeDataArray;

    // share the UndoManager too!
 //   myTreeView.model.undoManager = myDiagram.model.undoManager;
}
}