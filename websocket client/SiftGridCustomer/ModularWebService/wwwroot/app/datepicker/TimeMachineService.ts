import {Component, Output, EventEmitter, AfterViewInit, OnInit, ViewChild } from "@angular/core"
import { Injectable } from "@angular/core";
declare var jQuery: any;
import { Http, Headers, RequestOptions, Response } from "@angular/http";

import { Observable }       from "rxjs/Observable";

import "rxjs/add/operator/map"
import "rxjs/add/operator/buffer"
import {BehaviorSubject} from "rxjs/Rx";
import {Subject} from "rxjs/Rx";

import {ReplaySubject} from "rxjs/Rx"
import {NotesService} from "../notes/notesService";
import {Authenticator} from '../auth/Authenticator';

@Injectable()
export class TimeMachineService {

    getDiagramGuidObservable = new Subject();
    GetAreaDiagramForTimeMachineDate = new Subject();
    GetDiagramForTimeMachineDate = new Subject();

    CreateAreaDiagramForTimeMachine = new Subject();
    CreateDiagramForTimeMachine = new Subject();
    SendDateTimeObservable = new Subject();
    GetNotesForTimeMachineObservable = new Subject();
    selectedDate: any = "false";
    GetPeopleJsonForTimeMachineObservable = new Subject();
    GetPeopleForTimeMachine = new Subject();

    getInfoPaneObservableForTimeMachine = new Subject();
    updateInfoPaneForTMObservable = new Subject();


    constructor(private http: Http, private noteService: NotesService, private _authenticator: Authenticator) {
        this.IntializeObservables();
    }

    IntializeObservables() {

        this.GetAreaDiagramForTimeMachineDate.subscribe(val => {
            console.log("Inside GetAreaDiagramForTimeMachineDate : ");
            console.log(val);
            let url = "/Home/GetDiagramForTimeMachine?timeInfo=" + val+ "&tenantName=" + this._authenticator.TenantName ;
            this.http.get(url).map(res => res.json()).subscribe(res => {
                console.log("Inside Diagram Service    " + res);

                if (res == "NOT") {
                    alert("Diagram Not Available On This Date And Time ");
                    this.selectedDate = "false";
                    this.SendDateTimeObservable.next(this.selectedDate);

                } else {
                    this.CreateAreaDiagramForTimeMachine.next(res);
                }
                           
                console.log(res)
            });
        });

        this.GetDiagramForTimeMachineDate.subscribe(val => {
            console.log("Inside GetDiagramForTimeMachineDate : ");
            console.log(val);
            let url = "/Home/GetDiagramForTimeMachine?timeInfo=" + val + "&tenantName=" + this._authenticator.TenantName;
            this.http.get(url).map(res => res.json()).subscribe(res => {
                console.log("Inside Diagram Service    " + res);

                if (res == "NOT") {
                    alert("Diagram Not Available On This Date And Time ");
                    this.selectedDate = "false";
                    this.SendDateTimeObservable.next(this.selectedDate);

                } else {
                    this.CreateDiagramForTimeMachine.next(res);
                }

                console.log(res)
            });
        });

        this.GetNotesForTimeMachineObservable.subscribe(val => {

            console.log("Inside GetNotesForTimeMachineObservable : ");
            console.log(val);
            let url = "/Home/GetNotesForTimeMachine?timeInfo=" + val;

            this.http.get(url).map(res => res.json()).
                subscribe((response) => {
                    console.log("Inside GetNotesForTimeMachineObservable Get  Service    " + response);
                    console.log("Response from GetNotes");
                    console.log(response);

                    if (response == "NOT") {
                        alert("No Notes Available On This Date And Time ");
                        this.selectedDate = "false";
                        this.SendDateTimeObservable.next(this.selectedDate);

                    } else {
                        this.noteService.showNotesObservable.next(response)
                    }

                },
                (error) => { console.log(error); },
                () => { console.log("completed."); });
        });

        this.GetPeopleJsonForTimeMachineObservable.subscribe(val => {

            console.log(val);
            let url = "/Home/GetPeopleForTimeMachine?peopleInfo=" + val;

            this.http.get(url).map(res => res.json()).
                subscribe((response) => {
                    console.log("Inside GetNotesForTimeMachineObservable Get  Service    " + response);
                    console.log("Response from GetNotes");
                    console.log(response);
                    if (response == "NOT") {
                        alert("No Diagram Available On This Date And Time ");
                        this.selectedDate = "false";
                        this.SendDateTimeObservable.next(this.selectedDate);
                    } else {
                        this.GetPeopleForTimeMachine.next(response);
                    }
                },
                (error) => { console.log(error); },
                () => { console.log("completed."); });
        });
        
        this.getInfoPaneObservableForTimeMachine.subscribe(val => {
            let url = "/Home/GetInfoForTMObjects?objectInfo=" + val;
            this.http.get(url).map(res => res.json()).
                subscribe((response) => {
                    console.log(response);
                    console.log(response);
                    if (response == "NOT") {
                        alert("No Info Available On This Date And Time ");
                        this.selectedDate = "false";
                        this.SendDateTimeObservable.next(this.selectedDate);

                    } else {
                        this.updateInfoPaneForTMObservable.next(response)
                    }
                                      
                },
                (error) => { console.log(error); },
                () => { console.log("completed."); });
        });
            }
    }