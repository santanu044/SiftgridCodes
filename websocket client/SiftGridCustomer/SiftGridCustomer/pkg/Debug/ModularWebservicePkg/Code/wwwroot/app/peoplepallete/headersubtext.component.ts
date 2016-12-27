/// <reference path="../../libs/gojs.d.ts" />
import {Component, AfterViewInit, OnInit, ViewChild, Directive, HostListener, Inject, ElementRef} from '@angular/core';
import {Http, Response} from '@angular/http';
import {AspectRatioService} from '../aspectratiocalculation/AspectRatioService'
import { AreaService} from "../area/areaService";
declare var jQuery: any;
declare var $: any;

@Component({
    selector: 'peoplesubtitle',
    templateUrl: 'app/peoplepallete/peopleheadersubtitle-template.html'
})
export class PeopleHeaderSubTextComponent implements OnInit {
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
        let currentComponentWidth = this.aspectRatio.ComponentWidth(currentWidthRatio, (this.json["PeoplePaletteHeaderSubtext"])["width"]);
        let currentComponentHeight = this.aspectRatio.ComponentHeight(currentComponentWidth, (this.json["PeoplePaletteHeaderSubtext"])["height"] / (this.json["PeoplePaletteHeaderSubtext"])["width"]);
        let currentComponentLeft = this.aspectRatio.ComponentLeft(currentWidthRatio, (this.json["PeoplePaletteHeaderSubtext"])["left"]);
        let currentComponentTop = this.aspectRatio.ComponentTop(currentComponentLeft, (this.json["PeoplePaletteHeaderSubtext"])["top"] / (this.json["PeoplePaletteHeaderSubtext"])["left"]);
        let top = this.json["PeoplePaletteHeaderSubtext"]["top"];
        /**
         * this is used to create dynamic CSS
         */
        $.injectCSS({
            "#PeoplePaletteHeaderSubtext": {
                "height": currentComponentHeight,
                "width": currentComponentWidth,
                "margin-left": currentComponentLeft,
                "margin-top": currentComponentTop,
                "font-family": "Roboto-Regular",
                "font-size": "12px",
                "color": "#9E9E9E",
                "position": "absolute"

            }
        }); // end of dynamic css

    }
}