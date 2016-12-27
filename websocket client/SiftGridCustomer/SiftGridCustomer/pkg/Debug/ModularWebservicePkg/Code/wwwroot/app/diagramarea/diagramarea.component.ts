import {Component, HostListener} from '@angular/core';
import {Http, Response} from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {UIBackgroundComponent} from '../UIBackground/UIBackground.component';
import { AreaService} from "../area/areaService";
import {AspectRatioService} from '../aspectratiocalculation/AspectRatioService'
import {DiagramService}  from "../diagram/diagramService";

declare var $: any;
@Component({
    selector: 'diagramarea',
    templateUrl: 'app/diagramarea/diagramarea.template.html',
    styleUrls: ['app/diagramarea/inputElementStyle.css']
})
export class DiagramAreaComponent {

    showAreaDiagram: boolean = false;
     showDiagram: boolean = true;
     showPeopleDiagram: boolean = true;
    json: Object;
    constructor(public http: Http, public uiBackground: UIBackgroundComponent,
        public areaService: AreaService, public aspectRatio: AspectRatioService,public diagramService: DiagramService) {
        console.log(".inside DiagramAreaComponent cons" );
        areaService.displayAreaPaletteDiagram$
            .subscribe(res => this.displayAreaPaletteDiagram());
        areaService.displayDiagram$
            .subscribe(res => this.displayDiagram());
        areaService.displayPeopleDiagram$
            .subscribe(res => this.displayPeopleDiagram());

    }

    /**
     * this function is used to get device width
     */
    ngOnInit() {
        console.log(".inside DiagramAreaComponent ngoninit");
        this.getCSSJSONData();
        this.FirstTabCreateForArea('areas');
        this.areaService.CreateAreasDiagram$.next('areas');
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

    displayAreaPaletteDiagram() {
        this.showAreaDiagram = false;
        this.showPeopleDiagram = true;
        this.showDiagram = true;
    }

    displayDiagram() {
        this.showDiagram = false;
        this.showAreaDiagram = true;
        this.showPeopleDiagram = true;
    }

    displayPeopleDiagram() {
        this.showPeopleDiagram = false;
        this.showAreaDiagram = true;
        this.showDiagram = true;
    }

   zoomIn() {
        this.diagramService.zoomControlObservable.next("zoomIn");
    }
    zoomOut() {
        this.diagramService.zoomControlObservable.next("zoomOut");
    }

   
    @HostListener('window:resize')
    onResize() {
        if (!this.uiBackground.showEnterprisePane) {
            let deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
            let UIBackgroundWidthJSON = (this.json["UIBackground"])["width"];
            let currentWidthRatio = this.aspectRatio.WidthRatio((this.json["UIBackground"])["width"], deviceWidth);
            let currentComponentWidth = this.aspectRatio.ComponentWidth(currentWidthRatio, (this.json["SmallDiagramArea"])["width"]);
            let currentComponentHeight = this.aspectRatio.ComponentHeight(currentComponentWidth, (this.json["SmallDiagramArea"])["height"] / (this.json["SmallDiagramArea"])["width"]);
            let currentComponentLeft = this.aspectRatio.ComponentLeft(currentWidthRatio, (this.json["SmallDiagramArea"])["left"]);
            let currentComponentTop = this.aspectRatio.ComponentTop(currentComponentLeft, (this.json["SmallDiagramArea"])["top"] / (this.json["SmallDiagramArea"])["left"]);

            /**
             * this is used to create dynamic CSS
             */
            //$.injectCSS({
            //    ".DiagramArea": {
            //        "height": currentComponentHeight,
            //        "width": currentComponentWidth,
            //        "margin-left": currentComponentLeft,
            //        "margin-top": currentComponentTop,
            //        "position": "absolute",
            //        "z-index": 0
            //    }
            //}); // end of dynamic css


        } else {
            this.getCSSJSONData();
        }
    }

    createDynamicCSS() {

        let deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
      
        let UIBackgroundWidthJSON = (this.json["UIBackground"])["width"];
        let currentWidthRatio = this.aspectRatio.WidthRatio((this.json["UIBackground"])["width"], deviceWidth);
        let currentComponentWidth = this.aspectRatio.ComponentWidth(currentWidthRatio, (this.json["DiagramArea"])["width"]);
        let currentComponentHeight = this.aspectRatio.ComponentHeight(currentComponentWidth, (this.json["DiagramArea"])["height"] / (this.json["DiagramArea"])["width"]);
        let currentComponentLeft = this.aspectRatio.ComponentLeft(currentWidthRatio, (this.json["DiagramArea"])["left"]);
        let currentComponentTop = this.aspectRatio.ComponentTop(currentComponentLeft, (this.json["DiagramArea"])["top"] / (this.json["DiagramArea"])["left"]);
 
 if (this.uiBackground.showEnterprisePane) {

        /**
         * this is used to create dynamic CSS
         */
        $.injectCSS({
           ".DiagramArea": {
                "height": currentComponentHeight,
                "width": currentComponentWidth,
                "margin-left": currentComponentLeft,
                "margin-top": currentComponentTop,
                "position": "absolute"
            }
        }); // end of dynamic css



        let areaPalletcurrentWidthRatio = this.aspectRatio.WidthRatio((this.json["UIBackground"])["width"], deviceWidth);
        let areaPalletcurrentComponentWidth = this.aspectRatio.ComponentWidth(currentWidthRatio, (this.json["AreaPaneBig"])["width"]);
        let areaPalletcurrentComponentHeight = this.aspectRatio.ComponentHeight(currentComponentWidth, (this.json["AreaPaneBig"])["height"] / (this.json["AreaPaneBig"])["width"]);
        let areaPalletcurrentComponentLeft = this.aspectRatio.ComponentLeft(currentWidthRatio, (this.json["AreaPaneBig"])["left"]);
        let areaPalletcurrentComponentTop = this.aspectRatio.ComponentTop(currentComponentLeft, (this.json["AreaPaneBig"])["top"] / (this.json["AreaPaneBig"])["left"]);

        /**
         * this is used to create dynamic CSS
         */
        $.injectCSS({
            ".AreaPaneSmall": {
                "height": areaPalletcurrentComponentHeight,
                "width": areaPalletcurrentComponentWidth,
                "margin-left": areaPalletcurrentComponentLeft,
                "margin-top": areaPalletcurrentComponentTop,
                "position": "absolute",

            }
        }); // end of dynamic css
}
}
    FirstTabCreateForArea(GUID) {
        console.log("=> inside FirstTabCreateForArea");
        var self = this;
        self.addTabForArea(GUID);
     
        $('#tabs a.' + GUID).on('click', function () {
            self.displayAreaPaletteDiagram();
            self.areaService.displayAreaTree$.next(10);
            self.areaService.CreateAreasDiagram$.next('areas');

            // hide all other tabs
            $("#tabs li").removeClass("current");

            // show current tab
            $(this).parent().addClass("current");
        });

        $('#tabs a.remove').on('click', { 'class': GUID }, function (e) {

            $(this).parent().remove();
            var guid = e.data.class;
           
            // if there is no current tab and if there are still tabs left, show the first one
            if ($("#tabs li.current").length == 0 && $("#tabs li").length > 0) {
                // find the first tab
                var firsttab = $("#tabs li:first-child");
                firsttab.addClass("current");

                // get its link name and show related content
                var firsttabid = $(firsttab).find("a.tab").attr("id");
            }
        });

    }

    addTabForArea(GUID) {
    
        var self = this;
        if ($("#" + GUID).length != 0) {
            $("#" + GUID).parent().remove();
        }

        $("#tabs li").removeClass("current");
        $("#tabs").append("<li class='current' style='cursor: pointer;'><a class='" + GUID + "' id='" + GUID + "' >" + "Areas" + "</a><a  class='remove'>x</a></li>");
    }

}