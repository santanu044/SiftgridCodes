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
var diagramService_1 = require('../diagram/diagramService');
var errorService_1 = require('../errorpane/errorService');
var AspectRatioService_1 = require('../aspectratiocalculation/AspectRatioService');
var Authenticator_1 = require('../auth/Authenticator');
var InfoPropertyUpdateModel_1 = require("./InfoPropertyUpdateModel");
var InfoPerspectivesPaneComponent = (function () {
    function InfoPerspectivesPaneComponent(inspector, http, errorService, aspectRatio, _authenticator) {
        var _this = this;
        this.inspector = inspector;
        this.http = http;
        this.errorService = errorService;
        this.aspectRatio = aspectRatio;
        this._authenticator = _authenticator;
        this.myEvent = new core_1.EventEmitter();
        this.fieldColor = {};
        this.pros = new Array();
        this.inspector = inspector;
        console.log("diagramId in info component :" + this.diagramId);
        inspector.infoPaneFormSchema$.subscribe(function (schemaObject) {
            _this.arrayType = new Array();
            var formFields = schemaObject.required;
            _this.pros = schemaObject["properties"];
            _this.arrayLabelKeys = new Array();
            _this.infoPaneFormSchema = schemaObject;
            for (var key in formFields) {
                console.log(formFields[key]);
                var searchType = _this.pros[formFields[key]];
                var typeInSchema = searchType["type"];
                // For only NJsonschema api json shema 
                // In that schema for multiple option list field it will refer using 'oneOf'
                var oneOf = searchType["oneOf"];
                if (oneOf) {
                    for (var i in oneOf) {
                        var ref = oneOf[i]["schemaReferencePath"];
                        var splitRef = ref.split("/");
                        var getFieldNamefromRef = splitRef[splitRef.length - 1];
                        _this.arrayLabelKeys.push(getFieldNamefromRef);
                        _this.arrayType.push("nJsonSchema");
                    }
                }
                else {
                    if (typeInSchema === 'string' || typeInSchema === 'text') {
                        _this.arrayLabelKeys.push(formFields[key]);
                        _this.arrayType.push(typeInSchema);
                    }
                    else if (typeInSchema === 'boolean') {
                        _this.arrayLabelKeys.push(formFields[key]);
                        _this.arrayType.push(typeInSchema);
                    }
                    else if (typeInSchema === 'array') {
                        _this.arrayLabelKeys.push(formFields[key]);
                        _this.arrayType.push(typeInSchema);
                    }
                    else if (typeInSchema === 'number' || typeInSchema === 'integer') {
                        _this.arrayLabelKeys.push(formFields[key]);
                        _this.arrayType.push(typeInSchema);
                    }
                }
            }
        });
        inspector.updateInfoPaneObservable.subscribe(function (response) {
            if (_this.infoProperties != undefined && _this.fieldColor != undefined)
                if ([_this.infoProperties['LocationId']] !== {})
                    _this.fieldColor[_this.infoProperties['LocationId']] = {};
            _this.myEvent.emit(null);
            _this.inspector.getErrors(_this.inspector.diagramGuid);
            _this.array = new Array();
            console.log(response);
            for (var js in response)
                _this.array.push(js);
            _this.infoProperties = response;
            var flag = _this.infoProperties["IsMissingField"];
            var key = response["LocationId"];
            var nodetype = response["NodeType"];
            console.log(key, nodetype);
            if (nodetype != "Pipeline") {
                var nodeJson = _this.inspector._diagram.findNodeForKey(key);
                _this.inspector._diagram.startTransaction("Changing color");
                if (flag == "true") {
                }
                else {
                    _this.inspector._diagram.model.setDataProperty(nodeJson.data, "color", "black");
                }
                _this.inspector._diagram.commitTransaction("Changed color");
            }
        });
        inspector.showDiagramInfoObservable.subscribe(function (response) {
            console.log(response);
            _this.array = new Array();
            for (var js in response)
                _this.array.push(js);
            _this.infoProperties = response;
        });
        errorService.fieldColorEmitter$.subscribe(function (res) {
            console.log(res);
            _this.UpdateColor(res);
        });
    }
    /**
     * this function is used to get device width
     */
    InfoPerspectivesPaneComponent.prototype.ngOnInit = function () {
        this.getCSSJSONData();
        //this.createDynamicCSS();
    };
    InfoPerspectivesPaneComponent.prototype.onResize = function () {
        this.getCSSJSONData();
    };
    InfoPerspectivesPaneComponent.prototype.getCSSJSONData = function () {
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
    InfoPerspectivesPaneComponent.prototype.extractData = function (res) {
        var body = res.json();
        return body.data || {};
    };
    InfoPerspectivesPaneComponent.prototype.handleError = function (error) {
    };
    InfoPerspectivesPaneComponent.prototype.createDynamicCSS = function () {
        var deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        var UIBackgroundWidthJSON = (this.json["UIBackground"])["width"];
        var currentWidthRatio = this.aspectRatio.WidthRatio((this.json["UIBackground"])["width"], deviceWidth);
        var currentComponentWidth = this.aspectRatio.ComponentWidth(currentWidthRatio, (this.json["InfoPerspectivesPane"])["width"]);
        var currentComponentHeight = this.aspectRatio.ComponentHeight(currentComponentWidth, (this.json["InfoPerspectivesPane"])["height"] / (this.json["InfoPerspectivesPane"])["width"]);
        var currentComponentLeft = this.aspectRatio.ComponentLeft(currentWidthRatio, (this.json["InfoPerspectivesPane"])["left"]);
        var currentComponentTop = this.aspectRatio.ComponentTop(currentComponentLeft, (this.json["InfoPerspectivesPane"])["top"] / (this.json["InfoPerspectivesPane"])["left"]);
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
    };
    InfoPerspectivesPaneComponent.prototype.updateMultiSelect = function () {
        this.updateValue("", "");
    };
    InfoPerspectivesPaneComponent.prototype.updateValue = function (val, key) {
        //   this.infoProperties[key] = val;
        this.infoProperties["ModifiedBy"] = this._authenticator.username;
        this.infoProperties["ModifiedDataTime"] = new Date().toDateString();
        var locationId = this.infoProperties["LocationId"];
        if (locationId != undefined) {
            var infoJson = this.infoProperties;
            var updatedInfoModel = new InfoPropertyUpdateModel_1.InfoModel();
            updatedInfoModel.LocationId = infoJson["LocationId"];
            updatedInfoModel.DiagramId = infoJson["DiagramId"];
            updatedInfoModel.DiagramName = infoJson["DiagramName"];
            updatedInfoModel.TenantId = infoJson["TenantID"];
            updatedInfoModel.TenantName = infoJson["TenantName"];
            updatedInfoModel.NodeType = infoJson["NodeType"];
            updatedInfoModel.ModifiedBy = this.infoProperties["ModifiedBy"];
            updatedInfoModel.ModifiedDataTime = this.infoProperties["ModifiedDataTime"];
            updatedInfoModel.InfoJson = JSON.stringify(this.infoProperties);
            console.log(updatedInfoModel);
            console.log(JSON.stringify(updatedInfoModel));
            //    var body = { "data": this.infoProperties, "tenantName": this._authenticator.TenantName, "tenantId": this.inspector.tenantId };
            //    this.inspector.updateObjectProperties.next(JSON.stringify(body));
            this.inspector.updateObjectProperties.next(JSON.stringify(updatedInfoModel));
        }
    };
    InfoPerspectivesPaneComponent.prototype.ChangeColor = function (val) {
        var json = this.infoProperties;
        console.log(val);
        if (val == json['Name'] || val == json['Status'] || val == json['CreatedBy']) {
            return true;
        }
        else
            return false;
    };
    InfoPerspectivesPaneComponent.prototype.UpdateColor = function (val) {
        console.log(val);
        console.log(this.fieldColor);
        for (var locationId in val) {
            var fieldWithColor = val[locationId];
            for (var field in fieldWithColor) {
                if (this.fieldColor[locationId] == undefined) {
                    this.fieldColor[locationId] = {};
                    this.fieldColor[locationId][field] = fieldWithColor[field];
                }
                else {
                    this.fieldColor[locationId][field] = fieldWithColor[field];
                }
            }
        }
    };
    InfoPerspectivesPaneComponent.prototype.coloringLabel = function (key) {
        var color;
        if (this.infoProperties['LocationId']) {
            if (this.fieldColor[this.infoProperties['LocationId']]) {
                if (this.fieldColor[this.infoProperties['LocationId']][key]) {
                    color = this.fieldColor[this.infoProperties['LocationId']][key];
                }
                else {
                    color = "white";
                }
            }
        }
        //console.log(key + "->" + color)
        return color;
    };
    InfoPerspectivesPaneComponent.prototype.logRadio = function (key, val) {
        this.infoProperties[key] = val;
    };
    __decorate([
        core_1.HostListener('window:resize'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], InfoPerspectivesPaneComponent.prototype, "onResize", null);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], InfoPerspectivesPaneComponent.prototype, "myEvent", void 0);
    InfoPerspectivesPaneComponent = __decorate([
        core_1.Component({
            selector: 'infoperspectivespane',
            templateUrl: 'app/infoperspectivespane/infoperspectivespane.template.html',
            styleUrls: ['app/infoperspectivespane/info.styles.css']
        }), 
        __metadata('design:paramtypes', [diagramService_1.DiagramService, http_1.Http, errorService_1.ErrorService, AspectRatioService_1.AspectRatioService, Authenticator_1.Authenticator])
    ], InfoPerspectivesPaneComponent);
    return InfoPerspectivesPaneComponent;
}());
exports.InfoPerspectivesPaneComponent = InfoPerspectivesPaneComponent;
//# sourceMappingURL=infoperspectivespane.component.js.map