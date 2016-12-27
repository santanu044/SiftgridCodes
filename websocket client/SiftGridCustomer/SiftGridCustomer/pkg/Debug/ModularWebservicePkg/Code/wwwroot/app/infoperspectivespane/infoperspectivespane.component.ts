import {Component, HostListener, Output, EventEmitter} from '@angular/core';
import {Http, Response} from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {DiagramService} from '../diagram/diagramService'
import {ErrorService} from '../errorpane/errorService'
import {AspectRatioService} from '../aspectratiocalculation/AspectRatioService'
import {Authenticator} from '../auth/Authenticator';
import {InfoModel} from "./InfoPropertyUpdateModel"

declare var $: any;
@Component({
    selector: 'infoperspectivespane',
    templateUrl: 'app/infoperspectivespane/infoperspectivespane.template.html',
    styleUrls: ['app/infoperspectivespane/info.styles.css']
})
export class InfoPerspectivesPaneComponent {

    json: Object;

    /**
     * this function is used to get device width
     */
    ngOnInit() {

        this.getCSSJSONData();
        //this.createDynamicCSS();

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

    private extractData(res: Response) {
        let body = res.json();
        return body.data || {};
    }

    private handleError(error: Response) {

    }

    createDynamicCSS() {

        let deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        let UIBackgroundWidthJSON = (this.json["UIBackground"])["width"];
        let currentWidthRatio = this.aspectRatio.WidthRatio((this.json["UIBackground"])["width"], deviceWidth);
        let currentComponentWidth = this.aspectRatio.ComponentWidth(currentWidthRatio, (this.json["InfoPerspectivesPane"])["width"]);
        let currentComponentHeight = this.aspectRatio.ComponentHeight(currentComponentWidth, (this.json["InfoPerspectivesPane"])["height"] / (this.json["InfoPerspectivesPane"])["width"]);
        let currentComponentLeft = this.aspectRatio.ComponentLeft(currentWidthRatio, (this.json["InfoPerspectivesPane"])["left"]);
        let currentComponentTop = this.aspectRatio.ComponentTop(currentComponentLeft, (this.json["InfoPerspectivesPane"])["top"] / (this.json["InfoPerspectivesPane"])["left"]);

        /**
         * this is used to create dynamic CSS
         */
        $.injectCSS({
            "#InfoPerspectivesPane": {
                "height": currentComponentHeight,
                "width": currentComponentWidth,
                "margin-left": currentComponentLeft,
                "margin-top": currentComponentTop,
                "margin-right": 0,
                "padding": 0,
                "background-color": "#333333",
                "position": "absolute"
            }
        }); // end of dynamic css

    }

    diagramId: String;
    modelData;
    @Output() myEvent = new EventEmitter();
    infoProperties;
    infoPaneFormSchema;
    array: Array<string>;
    formFields: Array<string>;
    fieldColor = {}
    arrayType: Array<string>;
    arrayLabelKeys: Array<string>;
    pros = new Array<string>();

    constructor(public inspector: DiagramService, public http: Http,
        public errorService: ErrorService, public aspectRatio: AspectRatioService,
        private _authenticator: Authenticator) {
        this.inspector = inspector
        console.log("diagramId in info component :" + this.diagramId);

        inspector.infoPaneFormSchema$.subscribe((schemaObject: any) => {
            this.arrayType = new Array();
            var formFields = schemaObject.required
            this.pros = schemaObject["properties"];
            this.arrayLabelKeys = new Array();

            this.infoPaneFormSchema = schemaObject;

            for (var key in formFields) {
                console.log(formFields[key]);

                let searchType = this.pros[formFields[key]];
                let typeInSchema = searchType["type"];

                // For only NJsonschema api json shema 
                // In that schema for multiple option list field it will refer using 'oneOf'
                var oneOf = searchType["oneOf"];

                if (oneOf) {
                    for (var i in oneOf) {
                        var ref: string = oneOf[i]["schemaReferencePath"]
                        var splitRef: Array<string> = ref.split("/");
                        var getFieldNamefromRef = splitRef[splitRef.length - 1];
                        this.arrayLabelKeys.push(getFieldNamefromRef);
                        this.arrayType.push("nJsonSchema");
                    }
                }
                //Apart from Multiselect
                else {
                    if (typeInSchema === 'string' || typeInSchema === 'text') {
                        this.arrayLabelKeys.push(formFields[key]);
                        this.arrayType.push(typeInSchema);
                    } else if (typeInSchema === 'boolean') {
                        this.arrayLabelKeys.push(formFields[key]);
                        this.arrayType.push(typeInSchema);
                    } else if (typeInSchema === 'array') {
                        this.arrayLabelKeys.push(formFields[key]);
                        this.arrayType.push(typeInSchema);
                    } else if (typeInSchema === 'number' || typeInSchema === 'integer') {
                        this.arrayLabelKeys.push(formFields[key]);
                        this.arrayType.push(typeInSchema);

                    }
                }
            }
        });


        inspector.updateInfoPaneObservable.subscribe((response) => {

            if (this.infoProperties != undefined && this.fieldColor != undefined)
                if ([this.infoProperties['LocationId']] !== {})
                    this.fieldColor[this.infoProperties['LocationId']] = {};

            this.myEvent.emit(null);
            this.inspector.getErrors(this.inspector.diagramGuid);
            this.array = new Array<string>();
            console.log(response);
            for (var js in response)
                this.array.push(js)
            this.infoProperties = response;
            var flag = this.infoProperties["IsMissingField"];
            var key = response["LocationId"];
            var nodetype = response["NodeType"];
            console.log(key, nodetype);
            if (nodetype != "Pipeline") {
                var nodeJson = this.inspector._diagram.findNodeForKey(key);
                this.inspector._diagram.startTransaction("Changing color");

                if (flag == "true") {

                } else {
                    this.inspector._diagram.model.setDataProperty(nodeJson.data, "color", "black");
                }
                this.inspector._diagram.commitTransaction("Changed color");
            }
        });
        inspector.showDiagramInfoObservable.subscribe((response) => {
            console.log(response)
            this.array = new Array<string>();
            for (var js in response)
                this.array.push(js)
            this.infoProperties = response;

        });

        errorService.fieldColorEmitter$.subscribe(res => {
            console.log(res)
            this.UpdateColor(res);
        });

    }
    updateMultiSelect() {
        this.updateValue("", "");
    }
    updateValue(val: string, key: string) {
        //   this.infoProperties[key] = val;
        this.infoProperties["ModifiedBy"] = this._authenticator.username
        this.infoProperties["ModifiedDataTime"] = new Date().toDateString()

        var locationId = this.infoProperties["LocationId"];
        if (locationId != undefined) {
            var infoJson = this.infoProperties
            var updatedInfoModel = new InfoModel();
            updatedInfoModel.LocationId = infoJson["LocationId"]
            updatedInfoModel.DiagramId = infoJson["DiagramId"]

            updatedInfoModel.DiagramName = infoJson["DiagramName"]
            updatedInfoModel.TenantId = infoJson["TenantID"]
            updatedInfoModel.TenantName = infoJson["TenantName"]
            updatedInfoModel.NodeType = infoJson["NodeType"]
            updatedInfoModel.ModifiedBy = this.infoProperties["ModifiedBy"]
            updatedInfoModel.ModifiedDataTime = this.infoProperties["ModifiedDataTime"]
            updatedInfoModel.InfoJson = JSON.stringify(this.infoProperties);

            console.log(updatedInfoModel)
            console.log(JSON.stringify(updatedInfoModel))

            //    var body = { "data": this.infoProperties, "tenantName": this._authenticator.TenantName, "tenantId": this.inspector.tenantId };

            //    this.inspector.updateObjectProperties.next(JSON.stringify(body));

            this.inspector.updateObjectProperties.next(JSON.stringify(updatedInfoModel));
        }
    }

    ChangeColor(val) {
        var json = this.infoProperties
        console.log(val)
        if (val == json['Name'] || val == json['Status'] || val == json['CreatedBy']) {
            return true;
        } else
            return false;
    }
    UpdateColor(val) {
        console.log(val)
        console.log(this.fieldColor)
        for (var locationId in val) {
            var fieldWithColor = val[locationId]
            for (var field in fieldWithColor) {
                if (this.fieldColor[locationId] == undefined) {
                    this.fieldColor[locationId] = {}
                    this.fieldColor[locationId][field] = fieldWithColor[field]
                } else {
                    this.fieldColor[locationId][field] = fieldWithColor[field];
                }
            }
        }
    }


    coloringLabel(key) {
        var color;
        if (this.infoProperties['LocationId']) {
            if (this.fieldColor[this.infoProperties['LocationId']]) {
                if (this.fieldColor[this.infoProperties['LocationId']][key]) {
                    color = this.fieldColor[this.infoProperties['LocationId']][key];
                } else {
                    color = "white"
                }
            }
        }
        //console.log(key + "->" + color)
        return color;

    }
    logRadio(key, val) {
        this.infoProperties[key] = val;
    }

}