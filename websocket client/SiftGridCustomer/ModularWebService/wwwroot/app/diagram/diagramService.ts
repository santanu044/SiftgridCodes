﻿import {Component,Output,EventEmitter, AfterViewInit, OnInit, ViewChild } from "@angular/core"
import { Injectable } from "@angular/core";
declare var jQuery: any;
import { Http, Headers, RequestOptions, Response } from "@angular/http";

 import { Observable }       from "rxjs/Observable";
// import {DiagramData} from '../../Model/DiagramData';
 import {DiagramData} from "./DiagramData"

import "rxjs/add/operator/map"
import "rxjs/add/operator/buffer"
import {BehaviorSubject} from "rxjs/Rx";
import {Subject} from "rxjs/Rx";
import {Authenticator} from '../auth/Authenticator';

import {ReplaySubject} from "rxjs/Rx"
/// <summary>
/// Injecting Inspector to all components.
/// </sumary>
@Injectable()
export class DiagramService {

    createObjectInfoObservable = new Subject();
    createDiagramInfoObservable = new Subject();
    getInfoPaneObservable = new Subject();
    DiagramJson = new Subject();
    infoApiCache = new ReplaySubject();
    updateDiagramInfoObservable = new Subject();
    updateInfoPaneObservable = new Subject();
    updateObjectProperties = new Subject();
    updateAreaInfoObservable = new Subject();
    createAreaInfoObservable = new Subject();
    errorObjectObservable = new Subject();
    getDiagramObservable = new Subject();
    showDiagramInfoObservable = new Subject();
    infoPaneFormSchema$ = new Subject();
    diagramTypeObservable = new ReplaySubject();
    zoomControlObservable = new Subject();
    isDiagramEdittableObservable=new Subject();
    _diagram: go.Diagram;
    diagramGuid;
    locationId;
    createDiagramEvent$ = new Subject();
    tenantId;
    private cachedData = new Map<String,String>();

    constructor(private http: Http, private _authenticator:Authenticator) {
        this.IntializeObservables();       
    }

    
      event: go.DiagramEvent;

      IntializeObservables() {



          this.createObjectInfoObservable.subscribe(val => {
              let url = "/Home/CreateLocationObject"
         //     let body = JSON.stringify(val)
              let body = val;
              console.log(val);
              let headers = new Headers({ 'Content-Type': 'application/json' });

              let options = new RequestOptions({ headers: headers });

              var result = null;
              this.http.post(url, body, options).map(res => res.json()).
                  subscribe((response) => {
                      console.log(response);
                      //this.updateInfoPaneObservable.next(response)
                  },
                  (error) => { console.log(error); },
                  () => { console.log("completed."); });
          });

          this.getInfoPaneObservable.subscribe(val => {
              let url = "/Home/GetLocationObject?nodeInfo=" + val;

              this.http.get(url).map(res => res.json()).
                  subscribe((response) => { console.log(response); this.updateInfoPaneObservable.next(response) },
                  (error) => { console.log(error); },
                  () => { console.log("completed."); });
          });


          this.createDiagramInfoObservable.subscribe(val => {
              console.log("val is diagramId :" + val);
              let url = "/Home/GetDiagramInfo?diagramId=" + val;

              this.http.get(url).map(res => res.json()).cache().
                  subscribe((response) => {
                      console.log("Response for diagram info :" + response);
                      this.showDiagramInfoObservable.next(response)
                  },
                  (error) => { console.log(error); },
                  () => { console.log("completed."); });
          });


          this.getDiagramObservable.subscribe(val => {

              let url = "/Home/GetInfo?nodeInfo=" + val;

              this.http.get(url).map(res => res.json()).cache().
                  subscribe((response) => { console.log(response); this.updateInfoPaneObservable.next(response) },
                  (error) => { console.log(error); },
                  () => { console.log("completed."); });
          });

          this.updateDiagramInfoObservable.subscribe(val => {
              let body = JSON.stringify(val);

              let url = "/Home/Put";
              let headers = new Headers({ 'Content-Type': 'application/json' });
              let options = new RequestOptions({ headers: headers });

              this.http.put(url, body, options).map(res => res.json()).cache().
                  subscribe((response) => { console.log(response) },
                  (error) => { console.log(error); },
                  () => { console.log("completed."); });
          });
       
          this.updateObjectProperties.subscribe(res => {
              // 
     //         let body = JSON.stringify(res);

              let body = res;
         console.log("request to UpdateProps");
              console.log(res);
              console.log(body);
              let url = "/Home/UpdateObjectProperties";
              let headers = new Headers({ 'Content-Type': 'application/json' });
              let options = new RequestOptions({ headers: headers });
              this.http.put(url, body, options).map(res => res.json()).
                  subscribe((response) =>
                  {
                      console.log("Response from UpdateProps");
                      this.updateInfoPaneObservable.next(response);
                      console.log(response);
                  },
                  (error) => { console.log(error); },
                  () => { console.log("completed."); });
             
          }
              


          );



          this.updateAreaInfoObservable.subscribe(val => {
              let body = JSON.stringify(val);

              let url = "/Home/PutArea";
              let headers = new Headers({ 'Content-Type': 'application/json' });
              let options = new RequestOptions({ headers: headers });

              this.http.put(url, body, options).map(res => res.json()).cache().
                  subscribe((response) => { console.log(response) },
                  (error) => { console.log(error); },
                  () => { console.log("completed."); });
          });

      }

      getDiagramJson(diagramId) {
          return this.http.get("/Home/GetDiagramJson?diagramId=" + diagramId)
              .map(res => res.json()).cache();
      }


      //  Time machine
      GetDiagramJsonUsingTime(GUID, tenantName, time) {

          var val = JSON.stringify({
              DiagramGUID: GUID,
              TenantName: tenantName,
              DateAndTime: time
          });
          let url = "/Home/GetDiagramForTimeMachine?timeInfo=" + val;
          return this.http.get(url).map(res => res.json()).cache();

      }

      GetAreaDiagramJsonUsingTime(guid, tenantName, time) {

          var val = JSON.stringify({
              DiagramGUID: guid,
              TenantName: tenantName,
              DateAndTime: time
          });
          let url = "/Home/GetDiagramForTimeMachine?timeInfo=" + val;
          return this.http.get(url).map(res => res.json()).cache();

      }
      DeleteLocationObject(locationId, tenantName, tenantId) {
          let url = "/Home/DeleteLocationObject?locationId=" + locationId + "&tenantName=" + tenantName + "&tenantId=" + tenantId;
          console.log(url)
          this.http.delete(url)
              .subscribe(res => console.log(res),
              err => console.log(err),
              () => console.log("completed")
              );
      }

      GetDiagramJsonByTenantId(guid, tenantId) {
//          var json = JSON.stringify(diagramData);
          return this.http.get("/Home/GetDiagramJsonByTenantId?guid=" + guid + "&tenantId=" + tenantId)
              .map(res => res.json()).cache();
      }

      CreateOrInsertDiagramJson(diagramData: DiagramData, tenantName) {

          console.log(diagramData)
          let url = "/Home/CreateOrInsertDiagramJson"
          let body = { "data": JSON.stringify(diagramData), "tenantName": tenantName }
          console.log(body);
          let headers = new Headers({ 'Content-Type': 'application/json' });

          let options = new RequestOptions({ headers: headers });

          var result = null;
          return this.http.post(url, body, options).map(res =>  res.json())
      }

    getErrors(id) {
        console.log("Inside getErrors, guid :"+ id);
        this.http.get('/Home/GetDocument?diagramId=' + id + "&tenantName=" + this._authenticator.TenantName + "&tenantId=" + this.tenantId)
            .map(res => res.json()).subscribe(
            (res) => {
                console.log(res);
                this.errorObjectObservable.next(res);
            },
            (error) => { console.log(error); },
            () => { console.log("Get Error list completed") });

      }

    GetLocationObjectFromSchema(nodetype, tenantName, tenantId) {
        console.log(nodetype + "" + tenantName + "" + tenantId);
        this.http.get('/Home/GetLocationObjectFromSchema?nodetype=' + nodetype + "&tenantName=" + tenantName + "&tenantId=" + tenantId)
            .subscribe(res => {
                console.log(res);
                this.infoPaneFormSchema$.next(res.json());
            },
            err => console.log(err),
            () => console.log("completed")
            );
    }

    GetDiagramInfo(diagramName, diagramId, tenantname, tenantId) {
        console.debug(diagramName + "" + diagramId + "" + tenantname + "" + tenantId);

        let url = "/Home/GetDiagramInfo?diagramName=" + diagramName + "&diagramId=" + diagramId + "&tenantName=" + tenantname + "&tenantId=" + tenantId;

        this.http.get(url).map(res => res.json()).cache().
            subscribe((response) => {
                console.log("Response for diagram info :" + response);
                this.showDiagramInfoObservable.next(response)
            },
            (error) => { console.log(error); },
            () => { console.log("completed."); });
    }

}

