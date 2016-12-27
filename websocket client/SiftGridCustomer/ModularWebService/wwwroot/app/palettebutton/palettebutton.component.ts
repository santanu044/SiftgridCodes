import {Component, HostListener} from '@angular/core';
import {Http, Response} from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {AspectRatioService} from '../aspectratiocalculation/AspectRatioService'
import {DiagramService}  from "../diagram/diagramService";

declare var $: any;
@Component({
    selector: 'palettebutton',
    templateUrl: 'app/palettebutton/palettebutton.template.html'
})
export class PaletteButtonComponent {

    json: Object;
    diagramType;
    constructor(public http: Http, public aspectRatio: AspectRatioService, public diagramService: DiagramService) {
        this.diagramService.diagramTypeObservable.subscribe(res => {
            this.diagramType = res;

        });
    }

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
        alert("dfdf");
        let body = res.json();
        return body.data || {};
    }

    private handleError(error: Response) {

    }

    createDynamicCSS() {
        let deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        let UIBackgroundWidthJSON = (this.json["UIBackground"])["width"];
        let currentWidthRatio = this.aspectRatio.WidthRatio((this.json["UIBackground"])["width"], deviceWidth);
        let currentComponentWidth = this.aspectRatio.ComponentWidth(currentWidthRatio, (this.json["ChatButton"])["width"]);
        let currentComponentHeight = this.aspectRatio.ComponentHeight(currentComponentWidth, (this.json["ChatButton"])["height"] / (this.json["ChatButton"])["width"]);
        let currentComponentLeft = this.aspectRatio.ComponentLeft(currentWidthRatio, (this.json["ChatButton"])["left"]);
        let currentComponentTop = this.aspectRatio.ComponentTop(currentComponentLeft, (this.json["ChatButton"])["top"] / (this.json["ChatButton"])["left"]);

        /**
         * this is used to create dynamic CSS
         */
        $.injectCSS({
            "#ChatButton": {
                "height": currentComponentHeight,
                "width": currentComponentWidth,
                "margin-left": currentComponentLeft,
                "margin-top": currentComponentTop,
                "margin-right": 0,
                "padding": 0
            }
        }); // end of dynamic css

    }


    palletVisibility = true;
    areapalletVisibility = true;
    peoplepalletVisibility = true;
    showPallet() {
        console.log("Diagram Type: " + this.diagramType);
        if (this.diagramType == 'areaDiagram') {
            if (this.areapalletVisibility == true) {
                document.getElementById("newPalette").style.visibility = "visible";
                this.areapalletVisibility = false;
              this.diagramService.isDiagramEdittableObservable.next("visible");
            }
            else {
                document.getElementById("newPalette").style.visibility = "hidden";
                this.areapalletVisibility = true;
                this.diagramService.isDiagramEdittableObservable.next("hidden");
            }
        } else if (this.diagramType == 'peoplediagram') {
            if (this.peoplepalletVisibility == true) {
                document.getElementById("peoplePalette").style.visibility = "visible";
                this.peoplepalletVisibility = false;
              this.diagramService.isDiagramEdittableObservable.next("visible");

            }
            else {

                document.getElementById("peoplePalette").style.visibility = "hidden";
                this.peoplepalletVisibility = true;
                this.diagramService.isDiagramEdittableObservable.next("hidden");

            }
        }
        else {
            if (this.palletVisibility == true) {
                document.getElementById("pallet").style.visibility = "visible";
                this.palletVisibility = false;
              this.diagramService.isDiagramEdittableObservable.next("visible");

            }
            else {
                document.getElementById("pallet").style.visibility = "hidden";
                this.palletVisibility = true;
                this.diagramService.isDiagramEdittableObservable.next("hidden");

            }
        }
    }
}