"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var LeftToggleComponent = (function () {
    function LeftToggleComponent() {
        this.createAreaDiagramEvent = new core_1.EventEmitter();
        this.createPeopleDiagramEvent = new core_1.EventEmitter();
    }
    LeftToggleComponent.prototype.GenerateAreaDiagram = function (diagramID) {
        this.createAreaDiagramEvent.emit(diagramID);
    };
    LeftToggleComponent.prototype.GeneratePeopleDiagram = function (diagramID) {
        console.log("GeneratePeopleDiagram diagramID :" + diagramID);
        this.createPeopleDiagramEvent.emit("biz-123");
    };
    LeftToggleComponent.prototype.ngOnInit = function () {
        console.log("leftoggle oniNIT CALLED");
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
        console.log("leftoggle oniNIT ENDED");
    };
    LeftToggleComponent.prototype.addTab = function (link) {
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
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], LeftToggleComponent.prototype, "createAreaDiagramEvent", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], LeftToggleComponent.prototype, "createPeopleDiagramEvent", void 0);
    LeftToggleComponent = __decorate([
        core_1.Component({
            selector: 'lefttoggle',
            templateUrl: 'app/lefttoggle/lefttoggle.template.html',
            styleUrls: ['app/lefttoggle/lefttoggle.styles.css']
        }), 
        __metadata('design:paramtypes', [])
    ], LeftToggleComponent);
    return LeftToggleComponent;
}());
exports.LeftToggleComponent = LeftToggleComponent;
//# sourceMappingURL=lefttoggle.component.js.map