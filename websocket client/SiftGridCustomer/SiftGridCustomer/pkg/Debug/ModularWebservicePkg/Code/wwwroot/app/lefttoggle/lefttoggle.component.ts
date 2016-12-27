import {Component, OnInit, OnChanges, Input, ViewChild, AfterViewInit, ContentChildren, Output, EventEmitter} from '@angular/core';
import {Inspector} from '../diagram/InspectorService';
import {Areas} from "../diagram/Areas";
import {DiagramComponent} from '../diagram/diagram.component';

@Component({
    selector: 'lefttoggle',
    templateUrl: 'app/lefttoggle/lefttoggle.template.html',
    styleUrls: ['app/lefttoggle/lefttoggle.styles.css']
})

export class LeftToggleComponent implements OnInit {

    @Output() createAreaDiagramEvent = new EventEmitter();
    @Output() createPeopleDiagramEvent = new EventEmitter();

    GenerateAreaDiagram(diagramID) {
        this.createAreaDiagramEvent.emit(diagramID);
    }

    GeneratePeopleDiagram(diagramID) {
        console.log("GeneratePeopleDiagram diagramID :" + diagramID);
        this.createPeopleDiagramEvent.emit("biz-123");
    }

    ngOnInit() {
        console.log("leftoggle oniNIT CALLED")
        var self = this;
        $(document).ready(function () {
            $("#documents a").click(function () {

                self.addTab($(this));
                $('#tabs a.tab').on('click', function () {
                    // Get the tab name
                    var contentname = $(this).attr("id") + "_content";

                    var tabGuid = $(this).attr("id");
                    console.log("Clicked tab name :" + tabGuid);

                    if (tabGuid == "areas") {
                        self.createAreaDiagramEvent.emit("areas");
                    }
                    else {
                        self.createPeopleDiagramEvent.emit("biz-123");
                    }
                    //self.createAreaDiagramEvent.emit("areas");

                    // hide all other tabs
                    $("#myDiagramDiv p").hide();
                    $("#tabs li").removeClass("current");

                    // show current tab
                    $("#" + contentname).show();
                    $(this).parent().addClass("current");
                });

                $('#tabs a.remove').on('click', function () {
                    console.log("OnCLick");
                    console.log("remove");
                    // Get the tab name
                    var tabid = $(this).parent().find(".tab").attr("id");

                    // remove tab and related content
                    //                  var contentname = tabid + "_content";
                    //                  $("#" + contentname).remove();
                    $(this).parent().remove();

                    // if there is no current tab and if there are still tabs left, show the first one
                    if ($("#tabs li.current").length == 0 && $("#tabs li").length > 0) {

                        // find the first tab
                        var firsttab = $("#tabs li:first-child");
                        firsttab.addClass("current");

                        // get its link name and show related content
                        var firsttabid = $(firsttab).find("a.tab").attr("id");
                        $("#" + firsttabid + "_content").show().siblings('div').hide();
                    }
                });
            });

        });
        console.log("leftoggle oniNIT ENDED")

    }


    addTab(link) {
        var self = this;
        console.log("Add Tab");
        // If tab already exist in the list, return
        if ($("#" + $(link).attr("rel")).length != 0)
            return;
        // hide other tabs
        $("#tabs li").removeClass("current");
        //      $("#myDiagramDiv p").hide();

        // add new tab and related content
        $("#tabs").append("<li class='current'><a class='tab' id='" +
            $(link).attr("rel") + "' >" + $(link).html() +
            "</a><a  class='remove'>x</a></li>");

        // set the newly added tab as current
        //    $("#" + $(link).attr("rel") + "_content").show();
    }
}