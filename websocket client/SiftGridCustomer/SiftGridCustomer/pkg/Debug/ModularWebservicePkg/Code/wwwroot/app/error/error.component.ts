import {Component, OnInit, Input} from '@angular/core';
import {Inspector} from '../diagram/InspectorService';
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import {DiagramComponent} from "../diagram/diagram.component"

@Component({
    selector: 'error',
    templateUrl: 'app/error/error.template.html',
    styleUrls: ['app/error/error.styles.css']
})
export class ErrorsComponent {

    @Input() diagram: go.Diagram;

    public JsonId;

    constructor(public inspectorService: Inspector) {
        var self = this;
        console.log(self.diagram);
        inspectorService.errorObjectObservable.map(res => res)
            .subscribe(res => {
                console.log("errorObjectObservable subscribing");
                self.JsonId = res;            
                for (var _i = 0; _i < self.JsonId.length; _i++) {
                    if (self.JsonId[_i]["ValidationType"] === "Application") {
                        var num = self.JsonId[_i]["LocationId"] + "," + self.JsonId[_i]["Type"] + "," + self.JsonId[_i]["ValidationType"];
                        console.log("Application", num);
                        var nodetype = self.JsonId[_i]["Type"];
                        var node = self.diagram.findNodeForKey(self.JsonId[_i]["LocationId"]);
                        var mode = self.diagram.model.setDataProperty(node.data, "color", "pink");
                    }
                    if (self.JsonId[_i]["ValidationType"] === "Business") {
                        var num = self.JsonId[_i]["LocationId"] + "," + self.JsonId[_i]["Type"] + "," + self.JsonId[_i]["ValidationType"];
                        console.log("Business", num);
                        var nodetype = self.JsonId[_i]["Type"];
                        var node = self.diagram.findNodeForKey(self.JsonId[_i]["LocationId"]);
                        var mode = self.diagram.model.setDataProperty(node.data, "color", "blue");
                    }
                    if (self.JsonId[_i]["ValidationType"] === "Compliance") {
                        var num = self.JsonId[_i]["LocationId"] + "," + self.JsonId[_i]["Type"] + "," + self.JsonId[_i]["ValidationType"];
                        console.log("Compliance", num);
                        var nodetype = self.JsonId[_i]["Type"];
                        var node = self.diagram.findNodeForKey(self.JsonId[_i]["LocationId"]);
                        var mode = self.diagram.model.setDataProperty(node.data, "color", "red");
                    }

                }
                console.log("node lenght", self.diagram.model.nodeDataArray.length);
            },
            err => console.log(err),
            () => console.log("completed error comp"));
    }

    GetErrorsBy(guid) {
        console.log("Diagram id for error :" + guid);
        this.inspectorService.getErrors(guid);
    }

}