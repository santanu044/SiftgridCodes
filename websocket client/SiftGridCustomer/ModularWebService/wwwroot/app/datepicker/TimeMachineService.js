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
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
require("rxjs/add/operator/map");
require("rxjs/add/operator/buffer");
var Rx_1 = require("rxjs/Rx");
var notesService_1 = require("../notes/notesService");
var Authenticator_1 = require('../auth/Authenticator');
var TimeMachineService = (function () {
    function TimeMachineService(http, noteService, _authenticator) {
        this.http = http;
        this.noteService = noteService;
        this._authenticator = _authenticator;
        this.getDiagramGuidObservable = new Rx_1.Subject();
        this.GetAreaDiagramForTimeMachineDate = new Rx_1.Subject();
        this.GetDiagramForTimeMachineDate = new Rx_1.Subject();
        this.CreateAreaDiagramForTimeMachine = new Rx_1.Subject();
        this.CreateDiagramForTimeMachine = new Rx_1.Subject();
        this.SendDateTimeObservable = new Rx_1.Subject();
        this.GetNotesForTimeMachineObservable = new Rx_1.Subject();
        this.selectedDate = "false";
        this.GetPeopleJsonForTimeMachineObservable = new Rx_1.Subject();
        this.GetPeopleForTimeMachine = new Rx_1.Subject();
        this.getInfoPaneObservableForTimeMachine = new Rx_1.Subject();
        this.updateInfoPaneForTMObservable = new Rx_1.Subject();
        this.IntializeObservables();
    }
    TimeMachineService.prototype.IntializeObservables = function () {
        var _this = this;
        this.GetAreaDiagramForTimeMachineDate.subscribe(function (val) {
            console.log("Inside GetAreaDiagramForTimeMachineDate : ");
            console.log(val);
            var url = "/Home/GetDiagramForTimeMachine?timeInfo=" + val + "&tenantName=" + _this._authenticator.TenantName;
            _this.http.get(url).map(function (res) { return res.json(); }).subscribe(function (res) {
                console.log("Inside Diagram Service    " + res);
                if (res == "NOT") {
                    alert("Diagram Not Available On This Date And Time ");
                    _this.selectedDate = "false";
                    _this.SendDateTimeObservable.next(_this.selectedDate);
                }
                else {
                    _this.CreateAreaDiagramForTimeMachine.next(res);
                }
                console.log(res);
            });
        });
        this.GetDiagramForTimeMachineDate.subscribe(function (val) {
            console.log("Inside GetDiagramForTimeMachineDate : ");
            console.log(val);
            var url = "/Home/GetDiagramForTimeMachine?timeInfo=" + val + "&tenantName=" + _this._authenticator.TenantName;
            _this.http.get(url).map(function (res) { return res.json(); }).subscribe(function (res) {
                console.log("Inside Diagram Service    " + res);
                if (res == "NOT") {
                    alert("Diagram Not Available On This Date And Time ");
                    _this.selectedDate = "false";
                    _this.SendDateTimeObservable.next(_this.selectedDate);
                }
                else {
                    _this.CreateDiagramForTimeMachine.next(res);
                }
                console.log(res);
            });
        });
        this.GetNotesForTimeMachineObservable.subscribe(function (val) {
            console.log("Inside GetNotesForTimeMachineObservable : ");
            console.log(val);
            var url = "/Home/GetNotesForTimeMachine?timeInfo=" + val;
            _this.http.get(url).map(function (res) { return res.json(); }).
                subscribe(function (response) {
                console.log("Inside GetNotesForTimeMachineObservable Get  Service    " + response);
                console.log("Response from GetNotes");
                console.log(response);
                if (response == "NOT") {
                    alert("No Notes Available On This Date And Time ");
                    _this.selectedDate = "false";
                    _this.SendDateTimeObservable.next(_this.selectedDate);
                }
                else {
                    _this.noteService.showNotesObservable.next(response);
                }
            }, function (error) { console.log(error); }, function () { console.log("completed."); });
        });
        this.GetPeopleJsonForTimeMachineObservable.subscribe(function (val) {
            console.log(val);
            var url = "/Home/GetPeopleForTimeMachine?peopleInfo=" + val;
            _this.http.get(url).map(function (res) { return res.json(); }).
                subscribe(function (response) {
                console.log("Inside GetNotesForTimeMachineObservable Get  Service    " + response);
                console.log("Response from GetNotes");
                console.log(response);
                if (response == "NOT") {
                    alert("No Diagram Available On This Date And Time ");
                    _this.selectedDate = "false";
                    _this.SendDateTimeObservable.next(_this.selectedDate);
                }
                else {
                    _this.GetPeopleForTimeMachine.next(response);
                }
            }, function (error) { console.log(error); }, function () { console.log("completed."); });
        });
        this.getInfoPaneObservableForTimeMachine.subscribe(function (val) {
            var url = "/Home/GetInfoForTMObjects?objectInfo=" + val;
            _this.http.get(url).map(function (res) { return res.json(); }).
                subscribe(function (response) {
                console.log(response);
                console.log(response);
                if (response == "NOT") {
                    alert("No Info Available On This Date And Time ");
                    _this.selectedDate = "false";
                    _this.SendDateTimeObservable.next(_this.selectedDate);
                }
                else {
                    _this.updateInfoPaneForTMObservable.next(response);
                }
            }, function (error) { console.log(error); }, function () { console.log("completed."); });
        });
    };
    TimeMachineService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, notesService_1.NotesService, Authenticator_1.Authenticator])
    ], TimeMachineService);
    return TimeMachineService;
}());
exports.TimeMachineService = TimeMachineService;
//# sourceMappingURL=TimeMachineService.js.map