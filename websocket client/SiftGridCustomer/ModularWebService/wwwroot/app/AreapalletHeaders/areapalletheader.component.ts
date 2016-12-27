/// <reference path="../../libs/gojs.d.ts" />
import {Component, AfterViewInit, OnInit, ViewChild, Directive, HostListener, Inject, ElementRef} from '@angular/core';
import {Http, Response} from '@angular/http';
import {AspectRatioService} from '../aspectratiocalculation/AspectRatioService'
import { AreaService} from "../area/areaService";
declare var jQuery: any;
declare var $: any;

@Component({
    selector: 'areapalletheader',
    templateUrl: 'app/AreaPalletHeaders/areapalletheader-template.html'
})
export class AreaPalletHeaderComponent implements OnInit {
    json: Object;


    constructor(public aspectRatio: AspectRatioService,
        private areaService: AreaService,public http: Http) {
    
    }
    ngOnInit() {
        this.getCSSJSONData();
    }

    @HostListener('window:resize')
    onResize() {
        this.getCSSJSONData();
    }

    getCSSJSONData() {
        this.http.get("app/css.json")
            //.map(this.extractData)
            .subscribe(json => {
                this.json = json.json();
                this.createDynamicCSS();
            });
    }

    createDynamicCSS() {

        let deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        let UIBackgroundWidthJSON = (this.json["UIBackground"])["width"];
        let currentWidthRatio = this.aspectRatio.WidthRatio((this.json["UIBackground"])["width"], deviceWidth);
        let currentComponentWidth = this.aspectRatio.ComponentWidth(currentWidthRatio, (this.json["AreasPaletteHeader"])["width"]);
        let currentComponentHeight = this.aspectRatio.ComponentHeight(currentComponentWidth, (this.json["AreasPaletteHeader"])["height"] / (this.json["AreasPaletteHeader"])["width"]);
        let currentComponentLeft = this.aspectRatio.ComponentLeft(currentWidthRatio, (this.json["AreasPaletteHeader"])["left"]);
        let currentComponentTop = this.aspectRatio.ComponentTop(currentComponentLeft, (this.json["AreasPaletteHeader"])["top"] / (this.json["AreasPaletteHeader"])["left"]);

        /**
         * this is used to create dynamic CSS
         */
        $.injectCSS({
            "#AreasPaletteHeader": {
                "height": currentComponentHeight,
                "width": currentComponentWidth,
                "margin-left": currentComponentLeft,
                "margin-top": currentComponentTop,
                "background": "rgba(32, 32, 32, 0.50)",
                "box-shadow": "0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0,0,0,0.24)",
                "border-radius": "6px 0 0 6px",
                "position": "absolute"
            }
        }); // end of dynamic css
    }
    }