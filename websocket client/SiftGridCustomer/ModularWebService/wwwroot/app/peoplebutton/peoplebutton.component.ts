import {Component, HostListener} from '@angular/core';
import {Http, Response} from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {PeopleService} from '../people/peopleService'
import {UIBackgroundComponent}  from '../UIBackground/UIBackground.component'
import {EnterprisePaneComponent}  from '../EnteprisePane/enterprise.component'
import {DiagramAreaComponent}  from '../diagramarea/diagramarea.component'
import {AreaService} from '../area/areaService'
import {AspectRatioService} from '../aspectratiocalculation/AspectRatioService'

declare var $: any;
@Component({
    selector: 'peoplebutton',
    templateUrl: 'app/peoplebutton/peoplebutton.template.html'
})
export class PeopleButtonComponent {

    json: Object;
    constructor(public http: Http, public peopleService: PeopleService,
        public areaService: AreaService, public uiBackground: EnterprisePaneComponent,
        public aspectRatio: AspectRatioService) {

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
        let currentComponentWidth = this.aspectRatio.ComponentWidth(currentWidthRatio, (this.json["PeopleButton"])["width"]);
        let currentComponentHeight = this.aspectRatio.ComponentHeight(currentComponentWidth, (this.json["PeopleButton"])["height"] / (this.json["PeopleButton"])["width"]);
        let currentComponentLeft = this.aspectRatio.ComponentLeft(currentWidthRatio, (this.json["PeopleButton"])["left"]);
        let currentComponentTop = this.aspectRatio.ComponentTop(currentComponentLeft, (this.json["PeopleButton"])["top"] / (this.json["PeopleButton"])["left"]);
        
        /**
         * this is used to create dynamic CSS
         */
        $.injectCSS({
            "#PeopleButton": {
                "height": currentComponentHeight,
                "width": currentComponentWidth,
                "margin-left": currentComponentLeft,
                "margin-top": currentComponentTop,
                "margin-right": 0,
                "padding": 0,
                "color": "white",
                "position": "absolute"
            }
        }); // end of dynamic css

    }




    GeneratePeopleDiagram(diagramID) {
        this.FirstTabCreateForPeople(diagramID);
        this.uiBackground.showArea = true;
        this.uiBackground.showLocation = true;
        this.uiBackground.showPeople = false;
        this.areaService.displayPeopleDiagram$.next(10);

        this.peopleService.CreatePeopleDiagram$.next(diagramID);
        

    }

    FirstTabCreateForPeople(GUID) {
        console.log("=> inside FirstTabCreateForArea");
        var self = this;
        self.addTabForArea(GUID);
        // self.DisplayDiagram(GUID);
        console.log("GUID : " + GUID);

        $('#tabs a.' + GUID).on('click', function () {
            console.log("=> clicking on area tab");
            self.uiBackground.showArea = true;
            self.uiBackground.showLocation = true;
            self.uiBackground.showPeople = false;
            self.areaService.displayPeopleDiagram$.next(10);
            self.peopleService.CreatePeopleDiagram$.next(GUID);
            // hide all other tabs
            $("#tabs li").removeClass("current");
            // show current tab
            $(this).parent().addClass("current");

            //$("#active1").prop("disabled", false);
            //$("#active2").prop("disabled", false);

        });

        $('#tabs a.remove').on('click', { 'class': GUID }, function (e) {

            $(this).parent().remove();
            var guid = e.data.class;
            //if (self.diagramService.diagramGuid == guid) {
            //    self.diagramService._diagram.div = null;
            //}
            //self.inspector.displayAreaPaletteDiagram$.next(10);
            // if there is no current tab and if there are still tabs left, show the first one
            if ($("#tabs li.current").length == 0 && $("#tabs li").length > 0) {

                // find the first tab
                var firsttab = $("#tabs li:first-child");
                firsttab.addClass("current");

                // get its link name and show related content
                var firsttabid = $(firsttab).find("a.tab").attr("id");
                console.log("firsttabid :" + firsttabid);
                // self.CreateAreasDiagram(firsttabid);

            }
        });

    }

    addTabForArea(GUID) {
        console.log("=> addTabForPeople()...guid : " + GUID);

        var self = this;
        console.log("-showing tab");
        //$('#tabs a.' + GUID).show();

        if ($("#" + GUID).length != 0) {
            //alert("Diagram already opened.");
            //$("#" + GUID).show();
            //return;
            $("#" + GUID).parent().remove();
        }

        //self.createDiagramEvent.emit(GUID);
        $("#tabs li").removeClass("current");
        // GO("#myDiagramDiv p").hide();

        $("#tabs").append("<li class='current' style='cursor: pointer;'><a class='" + GUID + "' id='" + GUID + "' >" + GUID + "</a><a  class='remove'>x</a></li>");

    }

    

}