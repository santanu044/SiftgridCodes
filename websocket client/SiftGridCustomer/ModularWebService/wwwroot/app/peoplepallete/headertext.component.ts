/// <reference path="../../libs/gojs.d.ts" />
import {Component, AfterViewInit, OnInit, ViewChild, Directive, HostListener, Inject, ElementRef} from '@angular/core';
import {Http, Response} from '@angular/http';
import {AspectRatioService} from '../aspectratiocalculation/AspectRatioService'
import { AreaService} from "../area/areaService";
declare var jQuery: any;
declare var $: any;

@Component({
    selector: 'peopletitle',
    templateUrl: 'app/peoplepallete/peopleheadertitle-template.html'
})
export class PeopleHeaderTextComponent implements OnInit {
    json: Object;

    constructor(public aspectRatio: AspectRatioService,
        private areaService: AreaService, public http: Http) {
    }
    ngOnInit() {
        this.getCSSJSONData();
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

    createDynamicCSS() {

        let deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        let UIBackgroundWidthJSON = (this.json["UIBackground"])["width"];
        let currentWidthRatio = this.aspectRatio.WidthRatio((this.json["UIBackground"])["width"], deviceWidth);
        let currentComponentWidth = this.aspectRatio.ComponentWidth(currentWidthRatio, (this.json["PeoplePaletteHeaderTitle"])["width"]);
        let currentComponentHeight = this.aspectRatio.ComponentHeight(currentComponentWidth, (this.json["PeoplePaletteHeaderTitle"])["height"] / (this.json["PeoplePaletteHeaderTitle"])["width"]);
        let currentComponentLeft = this.aspectRatio.ComponentLeft(currentWidthRatio, (this.json["PeoplePaletteHeaderTitle"])["left"]);
        let currentComponentTop = this.aspectRatio.ComponentTop(currentComponentLeft, (this.json["PeoplePaletteHeaderTitle"])["top"] / (this.json["PeoplePaletteHeaderTitle"])["left"]);

        /**
         * this is used to create dynamic CSS
         */
        $.injectCSS({
            "#PeoplePaletteHeaderTitle": {
                "height": currentComponentHeight,
                "width": currentComponentWidth,
                "margin-left": currentComponentLeft,
                "margin-top": currentComponentTop,
                "font-family": "Roboto-Regular",
                "font-size": "16px",
                "color": "#FFFFFF",
            }
        }); // end of dynamic css

    }
}