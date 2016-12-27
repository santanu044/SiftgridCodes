// <reference path="../wwwroot/libs/jquery.d.ts" />
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
var diagramService_1 = require('../diagram/diagramService');
var TimeMachineService_1 = require('../datepicker/TimeMachineService');
var http_1 = require('@angular/http');
var UIBackground_component_1 = require('../UIBackground/UIBackground.component');
var Authenticator_1 = require('../auth/Authenticator');
var AspectRatioService_1 = require('../aspectratiocalculation/AspectRatioService');
var DateComponent = (function () {
    function DateComponent(http, uiBackground, digramService, _authenticator, timeservice, aspectRatio) {
        var _this = this;
        this.http = http;
        this.uiBackground = uiBackground;
        this.digramService = digramService;
        this._authenticator = _authenticator;
        this.timeservice = timeservice;
        this.aspectRatio = aspectRatio;
        this.showDocumentFooterPane = true;
        console.log("Inside Date Component Constructor");
        this.timeservice.getDiagramGuidObservable.subscribe(function (res) {
            console.log("Guid : " + res);
            _this.diagramGuid = res;
            console.log("Diagram Guid Date : " + _this.diagramGuid);
        });
    }
    /**
     * this function is used to get device width
     */
    //ngOnInit() {
    //    this.getCSSJSONData();
    //}
    DateComponent.prototype.ngOnInit = function () {
        $(".datepicker").datetimepicker({
            format: 'DD/MM/YYYY hh:mm:ss',
            sideBySide: true,
            widgetPositioning: {
                horizontal: 'left',
                vertical: 'top'
            }
        });
        this.getCSSJSONData();
        console.log("CSS JSON: ");
        console.log(JSON.stringify(this.json));
        //this.createDynamicCSS();
    };
    DateComponent.prototype.onResize = function () {
        this.getCSSJSONData();
    };
    DateComponent.prototype.getCSSJSONData = function () {
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
    DateComponent.prototype.extractData = function (res) {
        alert("dfdf");
        var body = res.json();
        return body.data || {};
    };
    DateComponent.prototype.handleError = function (error) {
    };
    DateComponent.prototype.createDynamicCSS = function () {
        var deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        var UIBackgroundWidthJSON = (this.json["UIBackground"])["width"];
        var currentWidthRatio = this.widthRatio((this.json["UIBackground"])["width"], deviceWidth);
        var currentComponentWidth = this.componentWidth(currentWidthRatio, (this.json["TimeMachineButton"])["width"]);
        var currentComponentHeight = this.componentHeight(currentComponentWidth, (this.json["TimeMachineButton"])["height"] / (this.json["TimeMachineButton"])["width"]);
        var currentComponentLeft = this.componentLeft(currentWidthRatio, (this.json["TimeMachineButton"])["left"]);
        var currentComponentTop = this.componentTop(currentComponentLeft, (this.json["TimeMachineButton"])["top"] / (this.json["TimeMachineButton"])["left"]);
        /**
         * this is used to create dynamic CSS
         */
        $.injectCSS({
            ".TimeMachineButton": {
                "height": currentComponentHeight,
                "width": currentComponentWidth,
                "margin-left": currentComponentLeft,
                "margin-top": currentComponentTop,
                "margin-right": 0,
                "padding": 0
            }
        }); // end of dynamic css
    };
    DateComponent.prototype.widthRatio = function (referenceWidth, deviceWidth) {
        return deviceWidth / referenceWidth;
    };
    DateComponent.prototype.componentWidth = function (ratioWidth, referenceWidth) {
        return referenceWidth * ratioWidth;
    };
    DateComponent.prototype.componentLeft = function (componentWidthRatio, componentJsonRefLeft) {
        return componentWidthRatio * componentJsonRefLeft;
    };
    DateComponent.prototype.componentHeight = function (currentComponentWidth, componentJsonRefHeightRatio) {
        return currentComponentWidth * componentJsonRefHeightRatio;
    };
    DateComponent.prototype.componentTop = function (componentLeft, componentJsonRefTopRatio) {
        return componentLeft * componentJsonRefTopRatio;
    };
    DateComponent.prototype.getDateAndTime = function () {
        var _this = this;
        this.selectedDate = document.getElementById("datePicker").value;
        console.log("Selected  DateAndTime" + this.selectedDate);
        this.timeservice.SendDateTimeObservable.next(this.selectedDate);
        if (this.diagramGuid == 'areas') {
            console.log("IF ");
            this.digramService.GetAreaDiagramJsonUsingTime(this.diagramGuid, this._authenticator.TenantName, this.selectedDate).subscribe(function (res) {
                if (res == "NOT") {
                    alert("No Diagram Available On This Date And Time ");
                    _this.selectedDate = "false";
                    _this.timeservice.SendDateTimeObservable.next(_this.selectedDate);
                }
                else {
                    console.log("Inside Diagram Service    " + res);
                    _this.timeservice.CreateAreaDiagramForTimeMachine.next(res);
                }
            });
        }
        else if (this.diagramGuid == 'people') {
            console.log("Inside People History Diagram ********");
            this.timeservice.GetPeopleJsonForTimeMachineObservable.next(JSON.stringify({
                GUID: this.diagramGuid,
                TenantName: this._authenticator.TenantName,
                DateAndTime: this.selectedDate
            }));
        }
        else {
            console.log("ELSE ");
            this.digramService.GetDiagramJsonUsingTime(this.diagramGuid, this._authenticator.TenantName, this.selectedDate).subscribe(function (res) {
                console.log("Inside Diagram Service    " + res);
                if (res == "NOT") {
                    alert("No Diagram Available On This Date And Time ");
                    _this.selectedDate = "false";
                    _this.timeservice.SendDateTimeObservable.next(_this.selectedDate);
                }
                else {
                    _this.timeservice.CreateDiagramForTimeMachine.next(res);
                }
            });
        }
        console.log("After =========");
    };
    __decorate([
        core_1.HostListener('window:resize'), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], DateComponent.prototype, "onResize", null);
    DateComponent = __decorate([
        core_1.Component({
            selector: 'date',
            templateUrl: 'app/datepicker/date.template.html',
            styleUrls: ['app/datepicker/bootstrap-combined.min.css', 'app/datepicker/bootstrap-datetimepicker.min.css']
        }), 
        __metadata('design:paramtypes', [http_1.Http, UIBackground_component_1.UIBackgroundComponent, diagramService_1.DiagramService, Authenticator_1.Authenticator, TimeMachineService_1.TimeMachineService, AspectRatioService_1.AspectRatioService])
    ], DateComponent);
    return DateComponent;
}());
exports.DateComponent = DateComponent;
//# sourceMappingURL=date.component.js.map