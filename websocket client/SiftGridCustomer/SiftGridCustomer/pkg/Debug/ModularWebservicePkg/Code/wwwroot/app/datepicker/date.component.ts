// <reference path="../wwwroot/libs/jquery.d.ts" />

import { Component, HostListener } from '@angular/core';
import {DiagramService} from '../diagram/diagramService';
import {TimeMachineService} from '../datepicker/TimeMachineService';
import {Http, Response} from '@angular/http';
import { UIBackgroundComponent } from '../UIBackground/UIBackground.component';
import {Authenticator} from '../auth/Authenticator';
import {AspectRatioService} from '../aspectratiocalculation/AspectRatioService'

declare var $: any;

@Component({
    selector: 'date',
    templateUrl: 'app/datepicker/date.template.html',
    styleUrls: ['app/datepicker/bootstrap-combined.min.css', 'app/datepicker/bootstrap-datetimepicker.min.css' ]
})
export class DateComponent {

    diagramGuid: any;
    selectedDate: any;
    date: any;

    constructor(public http: Http, public uiBackground: UIBackgroundComponent,
        public digramService: DiagramService, private _authenticator: Authenticator, public timeservice: TimeMachineService,
        public aspectRatio: AspectRatioService) {
        console.log("Inside Date Component Constructor");
        this.timeservice.getDiagramGuidObservable.subscribe(res => {
            console.log("Guid : " + res);
            this.diagramGuid = res;
            console.log("Diagram Guid Date : " + this.diagramGuid);
        });  
    }

    //CSS

    json: Object;
    showDocumentFooterPane: boolean = true;
  

    /**
     * this function is used to get device width
     */
    //ngOnInit() {
    //    this.getCSSJSONData();
    //}
    ngOnInit() {
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
        alert("dfdf");
        let body = res.json();
        return body.data || {};
    }

    private handleError(error: Response) {

    }

    createDynamicCSS() {

        let deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        let UIBackgroundWidthJSON = (this.json["UIBackground"])["width"];
        let currentWidthRatio = this.widthRatio((this.json["UIBackground"])["width"], deviceWidth);
        let currentComponentWidth = this.componentWidth(currentWidthRatio, (this.json["TimeMachineButton"])["width"]);
        let currentComponentHeight = this.componentHeight(currentComponentWidth, (this.json["TimeMachineButton"])["height"] / (this.json["TimeMachineButton"])["width"]);
        let currentComponentLeft = this.componentLeft(currentWidthRatio, (this.json["TimeMachineButton"])["left"]);
        let currentComponentTop = this.componentTop(currentComponentLeft, (this.json["TimeMachineButton"])["top"] / (this.json["TimeMachineButton"])["left"]);

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

    }

    widthRatio(referenceWidth: number, deviceWidth: number): number {
        return deviceWidth / referenceWidth;
    }

    componentWidth(ratioWidth: number, referenceWidth: number): number {
        return referenceWidth * ratioWidth;
    }

    componentLeft(componentWidthRatio: number, componentJsonRefLeft: number): number {
        return componentWidthRatio * componentJsonRefLeft;
    }

    componentHeight(currentComponentWidth: number, componentJsonRefHeightRatio: number): number {
        return currentComponentWidth * componentJsonRefHeightRatio;
    }

    componentTop(componentLeft: number, componentJsonRefTopRatio: number): number {
        return componentLeft * componentJsonRefTopRatio;
    }


    

    getDateAndTime() {
        this.selectedDate = (<HTMLInputElement>document.getElementById("datePicker")).value;
        console.log("Selected  DateAndTime" + this.selectedDate);

        this.timeservice.SendDateTimeObservable.next(this.selectedDate);

        if (this.diagramGuid == 'areas') {
            console.log("IF ");
            this.digramService.GetAreaDiagramJsonUsingTime(this.diagramGuid, this._authenticator.TenantName, this.selectedDate).subscribe(res => {
                if (res == "NOT") {
                    alert("No Diagram Available On This Date And Time ");
                    this.selectedDate = "false";
                    this.timeservice.SendDateTimeObservable.next(this.selectedDate);

                } else {
                    console.log("Inside Diagram Service    " + res);
                    this.timeservice.CreateAreaDiagramForTimeMachine.next(res);                }
            });

        } else if (this.diagramGuid == 'people') {

            console.log("Inside People History Diagram ********");
            this.timeservice.GetPeopleJsonForTimeMachineObservable.next(JSON.stringify({
                GUID: this.diagramGuid,
                TenantName: this._authenticator.TenantName,
                DateAndTime: this.selectedDate
            }));
         }else {
            console.log("ELSE ");
            this.digramService.GetDiagramJsonUsingTime(this.diagramGuid, this._authenticator.TenantName, this.selectedDate).subscribe(res => {
                console.log("Inside Diagram Service    " + res);

                if (res == "NOT") {
                    alert("No Diagram Available On This Date And Time ");
                    this.selectedDate = "false";

                    this.timeservice.SendDateTimeObservable.next(this.selectedDate);

                } else {
                    this.timeservice.CreateDiagramForTimeMachine.next(res);
                }
            });
            
        }
        console.log("After =========");

    }
    //show() {
    //    $('#datetimepicker').datetimepicker({
    //        format: 'dd/MM/yyyy hh:mm:ss',
    //        language: 'pt-BR'
    //    });


    //}
  
}