import { Component, OnInit, HostListener } from '@angular/core';
import {Http, Response} from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {AreaService} from '../area/areaService'
import {AspectRatioService} from '../aspectratiocalculation/AspectRatioService'
declare var $: any;
@Component({
    selector: 'UIBackground',
    templateUrl: 'app/UIBackground/uibackground.template.html'
})
export class UIBackgroundComponent implements OnInit {

    json: Object;
    showEnterprisePane: boolean = false;
    showInfoPane: boolean = true;
    showDocumentPane: boolean = true;
    showErrorPane: boolean = true;
    showFuelConsumersPane: boolean = true;
    showNotesPane: boolean = true;

    constructor(public aspectRatio: AspectRatioService,public areaService: AreaService) {
        
    }

    /**
     * this function is used to get device width
     */
    ngOnInit() {
        this.getCSSJSONData();
    }

    @HostListener('window:resize')
    onResize() {
        this.getCSSJSONData();
    }

    getCSSJSONData() {
        this.aspectRatio.GetCSSJSONData().subscribe(json => {
            this.json = json;
            this.createDynamicCSS();
            this.showEnterprisePane1();
        })
    }

    createDynamicCSS() {

        let deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        let UIBackgroundWidthJSON = (this.json["UIBackground"])["width"];
        let currentWidthRatio = this.aspectRatio.WidthRatio((this.json["UIBackground"])["width"], deviceWidth);
        let currentComponentWidth = this.aspectRatio.ComponentWidth(currentWidthRatio, (this.json["EnteprisePane"])["width"]);
        let currentComponentHeight = this.aspectRatio.ComponentHeight(currentComponentWidth, (this.json["EnteprisePane"])["height"] / (this.json["EnteprisePane"])["width"]);
        let currentComponentLeft = this.aspectRatio.ComponentLeft(currentWidthRatio, (this.json["EnteprisePane"])["left"]);
        let currentComponentTop = this.aspectRatio.ComponentTop(currentComponentLeft, (this.json["EnteprisePane"])["top"] / (this.json["EnteprisePane"])["left"]);

        /**
         * this is used to create dynamic CSS
         */
        $.injectCSS({
            "#UIBackground": {
                height: 1024,
                width: deviceWidth,
                left: 0,
                top: 0,
                position: "absolute"
            },
            "#container": {
                height: 1024,
                width: deviceWidth,
                left: 0,
                top: 0,
                position: "absolute"
            }
        }); // end of dynamic css

    }

    showEnterprisePane1() {
        //console.log("..inside UIBackgroundComponent showEnterprisePane1().");

        //console.log("===> showEnterprisePane is true");
        //this.ui.showEnterprisePane = false;
        //this.ui.showDocumentPane = true;
        //this.ui.showErrorPane = true;
        //this.ui.showFuelConsumersPane = true;    
        let deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        let UIBackgroundWidthJSON = (this.json["UIBackground"])["width"];
        let currentWidthRatio = this.aspectRatio.WidthRatio((this.json["UIBackground"])["width"], deviceWidth);
        let currentComponentWidth = this.aspectRatio.ComponentWidth(currentWidthRatio, (this.json["SmallDiagramArea"])["width"]);
        let currentComponentHeight = this.aspectRatio.ComponentHeight(currentComponentWidth, (this.json["SmallDiagramArea"])["height"] / (this.json["SmallDiagramArea"])["width"]);
        let currentComponentLeft = this.aspectRatio.ComponentLeft(currentWidthRatio, (this.json["SmallDiagramArea"])["left"]);
        let currentComponentTop = this.aspectRatio.ComponentTop(currentComponentLeft, (this.json["SmallDiagramArea"])["top"] / (this.json["SmallDiagramArea"])["left"]);

        $.injectCSS({
            ".DiagramArea": {
                "height": currentComponentHeight,
                "width": currentComponentWidth,
                "margin-left": currentComponentLeft,
                "margin-top": currentComponentTop,
                "position": "absolute",
                "z-index": 0,
            }
        });

        let areaPalletcurrentWidthRatio = this.aspectRatio.WidthRatio((this.json["UIBackground"])["width"], deviceWidth);
        let areaPalletcurrentComponentWidth = this.aspectRatio.ComponentWidth(currentWidthRatio, (this.json["AreaPaneSmall"])["width"]);
        let areaPalletcurrentComponentHeight = this.aspectRatio.ComponentHeight(currentComponentWidth, (this.json["AreaPaneSmall"])["height"] / (this.json["AreaPaneSmall"])["width"]);
        let areaPalletcurrentComponentLeft = this.aspectRatio.ComponentLeft(currentWidthRatio, (this.json["AreaPaneSmall"])["left"]);
        let areaPalletcurrentComponentTop = this.aspectRatio.ComponentTop(currentComponentLeft, (this.json["AreaPaneSmall"])["top"] / (this.json["AreaPaneSmall"])["left"]);

        /**
         * this is used to create dynamic CSS
         */
        $.injectCSS({
            ".AreaPaneSmall": {
                "height": areaPalletcurrentComponentHeight,
                "width": areaPalletcurrentComponentWidth,
                "margin-left": areaPalletcurrentComponentLeft,
                "margin-top": areaPalletcurrentComponentTop,
                "position": "absolute"

            }
        }); // end of dynamic css

        let areaDiagramcurrentWidthRatio = this.aspectRatio.WidthRatio((this.json["UIBackground"])["width"], deviceWidth);
        let areaDiagramcurrentComponentWidth = this.aspectRatio.ComponentWidth(currentWidthRatio, (this.json["AreaDiagramSmall"])["width"]);
        let areaDiagramcurrentComponentHeight = this.aspectRatio.ComponentHeight(currentComponentWidth, (this.json["AreaDiagramSmall"])["height"] / (this.json["AreaDiagramSmall"])["width"]);
        let areaDiagramcurrentComponentLeft = this.aspectRatio.ComponentLeft(currentWidthRatio, (this.json["AreaDiagramSmall"])["left"]);
        let areaDiagramcurrentComponentTop = this.aspectRatio.ComponentTop(currentComponentLeft, (this.json["AreaDiagramSmall"])["top"] / (this.json["AreaDiagramSmall"])["left"]);

        /**
         * this is used to create dynamic CSS
         */
        $.injectCSS({
            ".AreaDiagram": {
                "height": areaDiagramcurrentComponentHeight,
                "width": areaDiagramcurrentComponentWidth,
                "margin-left": areaDiagramcurrentComponentLeft,
                "margin-top": areaPalletcurrentComponentHeight,
                "position": "absolute",

            }
        });
    }


}
