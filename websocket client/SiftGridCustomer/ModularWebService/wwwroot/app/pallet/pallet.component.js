/// <reference path="../../libs/gojs.d.ts" />
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require('@angular/core');
var icons_component_1 = require('./icons.component');
var PalletComponent = (function () {
    function PalletComponent(elementRef) {
        this.elementRef = elementRef;
    }
    PalletComponent.prototype.ngOnInit = function () {
        jQuery(this.elementRef.nativeElement).find('.draggable').draggable({ containment: '#draggable-parent' });
        var GO = go.GraphObject.make;
        //    const paletteDiv1 = this.div1.nativeElement;
        var wellsPalette = GO(go.Palette, "myWellsPaletteDiv");
        wellsPalette.nodeTemplate =
            GO(go.Node, "Vertical", GO(go.Shape, { name: "WSHAPE", width: 40, height: 40, stroke: "black", strokeWidth: 1.5, fill: "black" }, new go.Binding("geometryString", "name", this.geoFunc), new go.Binding("fill", "pColor")), {
                toolTip: GO(go.Adornment, "Auto", GO(go.Shape, { fill: "#f1efee" }), GO(go.TextBlock, { margin: 4 }, new go.Binding("text", "name")))
            });
        wellsPalette.model.nodeDataArray = [
            { key: 1, name: "gas", nodeType: "well", pColor: '#808080', dColor: 'white', color: 'black', width: 50, height: 50 },
            { key: 2, name: "gasLift", nodeType: "well", pColor: '#808080', dColor: 'white', color: 'black', width: 40, height: 40 },
            { key: 3, name: "gasInjection", nodeType: "well", pColor: '#808080', dColor: 'white', color: 'black', width: 40, height: 40 },
            { key: 4, name: "waterSource", nodeType: "well", pColor: '#808080', dColor: 'white', color: 'black', width: 40, height: 40 },
            { key: 5, name: "waterInjection", nodeType: "well", pColor: '#808080', dColor: 'white', color: 'black', width: 40, height: 40 },
            { key: 6, name: "oil", nodeType: "well", pColor: 'black', dColor: 'black', color: 'black', width: 30, height: 30 },
            { key: 7, name: "sagd", nodeType: "well", pColor: 'black', dColor: 'black', color: 'black', width: 50, height: 50 },
            { key: 8, name: "plungerLift", nodeType: "well", pColor: '#808080', dColor: 'white', color: 'black', width: 20, height: 65 },
            { key: 9, name: "pumpJack", nodeType: "well", pColor: '#808080', dColor: 'white', color: 'black', width: 50, height: 50 },
            { key: 10, name: "screwPump", nodeType: "well", pColor: '#808080', dColor: 'white', color: 'black', width: 50, height: 50 }
        ];
        // Major Equipments
        //       const paletteDiv2 = this.div2.nativeElement;
        var majorEquipmentsPalette = GO(go.Palette, "myMEPaletteDiv");
        majorEquipmentsPalette.nodeTemplate = wellsPalette.nodeTemplate;
        majorEquipmentsPalette.model.nodeDataArray = [
            { key: 1, name: "ohexchanger", nodeType: "majorEquipment", pColor: '#808080', dColor: 'white', color: 'black', width: 50, height: 50 },
            { key: 2, name: "pump", nodeType: "majorEquipment", pColor: '#808080', dColor: 'white', color: 'black', width: 60, height: 60 },
            { key: 3, name: "lineheater", nodeType: "majorEquipment", pColor: '#808080', dColor: 'white', color: 'black', width: 50, height: 50 },
            { key: 4, name: "compressor", nodeType: "majorEquipment", pColor: '#808080', dColor: 'white', color: 'black', width: 90, height: 75 },
            { key: 5, name: "coalescer", nodeType: "majorEquipment", pColor: '#808080', dColor: 'white', color: 'black', width: 50, height: 50 },
            { key: 6, name: "exchanger", nodeType: "majorEquipment", pColor: '#808080', dColor: 'white', color: 'black', width: 50, height: 50 }
        ];
        // Meters
        //     const paletteDiv3 = this.div3.nativeElement;
        var metersPalette = GO(go.Palette, "myMeterPaletteDiv");
        metersPalette.nodeTemplate = wellsPalette.nodeTemplate;
        metersPalette.model.nodeDataArray = [
            { key: 1, name: "thermalmass", nodeType: "meter", pColor: '#808080', dColor: 'white', color: 'black', width: 50, height: 50 },
            { key: 2, name: "turbine", nodeType: "meter", pColor: '#808080', dColor: 'white', color: 'black', width: 50, height: 50 },
            { key: 3, name: "orifice", nodeType: "meter", pColor: '#808080', dColor: 'white', color: 'black', width: 30, height: 40 },
            { key: 4, name: "rotameter", nodeType: "meter", pColor: '#808080', dColor: 'white', color: 'black', width: 50, height: 50 },
            { key: 5, name: "vortex", nodeType: "meter", pColor: '#808080', dColor: 'white', color: 'black', width: 50, height: 50 },
            { key: 6, name: "ultrasonic", nodeType: "meter", pColor: '#808080', dColor: 'white', color: 'black', width: 50, height: 50 },
            { key: 7, name: "vcone", nodeType: "meter", pColor: '#808080', dColor: 'white', color: 'black', width: 50, height: 50 },
            { key: 8, name: "flowNozzle", nodeType: "meter", pColor: '#808080', dColor: 'white', color: 'black', width: 50, height: 50 },
            { key: 9, name: "mag", nodeType: "meter", pColor: '#808080', dColor: 'white', color: 'black', width: 50, height: 50 },
            { key: 10, name: "coriolis", nodeType: "meter", pColor: '#808080', dColor: 'white', color: 'black', width: 50, height: 50 },
            { key: 11, name: "pd", nodeType: "meter", pColor: '#808080', dColor: 'white', color: 'black', width: 50, height: 50 },
            { key: 12, name: "localMounted", nodeType: "meter", pColor: '#808080', dColor: 'white', color: 'black', width: 50, height: 50 },
            { key: 13, name: "netoil", nodeType: "meter", pColor: '#808080', dColor: 'white', color: 'black', width: 50, height: 50 },
            { key: 14, name: "optical", nodeType: "meter", pColor: '#808080', dColor: 'white', color: 'black', width: 50, height: 50 },
            { key: 15, name: "samplePoint", nodeType: "meter", pColor: '#808080', dColor: 'white', color: 'black', width: 50, height: 50 }
        ];
        // Tanks and Vessel
        //    const paletteDiv4 = this.div4.nativeElement;
        var tanksPalette = GO(go.Palette, "myTVPaletteDiv");
        tanksPalette.nodeTemplate = wellsPalette.nodeTemplate;
        tanksPalette.model.nodeDataArray = [
            { key: 1, name: "vesselUnderground", nodeType: "tank", pColor: '#808080', dColor: 'white', color: 'black', width: 85, height: 55 },
            { key: 2, name: "tankUnderground", nodeType: "tank", pColor: '#808080', dColor: 'white', color: 'black', width: 85, height: 55 },
            { key: 3, name: "pond", nodeType: "tank", pColor: 'black', dColor: 'black', color: 'black', width: 80, height: 40 },
            { key: 4, name: "tank", nodeType: "tank", pColor: '#808080', dColor: 'white', color: 'black', width: 85, height: 65 },
            { key: 5, name: "separator", nodeType: "tank", pColor: '#808080', dColor: 'white', color: 'black', width: 40, height: 100 },
            { key: 6, name: "vesselwboot", nodeType: "tank", pColor: '#808080', dColor: 'white', color: 'black', width: 75, height: 55 },
            { key: 7, name: "fuelScrubber", nodeType: "tank", pColor: '#808080', dColor: 'white', color: 'black', width: 40, height: 40 }
        ];
        // Minor Equipment
        //   const paletteDiv5 = this.div5.nativeElement;
        var minorEquipmentsPalette = GO(go.Palette, "myMIEPaletteDiv");
        minorEquipmentsPalette.nodeTemplate = wellsPalette.nodeTemplate;
        minorEquipmentsPalette.model.nodeDataArray = [
            { key: 1, name: "heaterother", nodeType: "minorEquipment", pColor: '#808080', dColor: 'white', color: 'black', width: 25, height: 60 },
            { key: 2, name: "tanker", nodeType: "minorEquipment", pColor: '#808080', dColor: 'white', color: 'black', width: 105, height: 70 },
            { key: 3, name: "testconnection", nodeType: "minorEquipment", pColor: '#808080', dColor: 'white', color: 'black', width: 40, height: 40 },
            { key: 4, name: "fuelgas", nodeType: "minorEquipment", pColor: '#808080', dColor: 'white', color: 'black', width: 40, height: 40 },
            { key: 5, name: "valve", nodeType: "minorEquipment", pColor: '#808080', dColor: 'white', color: 'black', width: 30, height: 30 },
            { key: 6, name: "flarestack", nodeType: "minorEquipment", pColor: '#808080', dColor: 'white', color: 'black', width: 30, height: 60 },
            { key: 8, name: "pressurecontrolvalve", nodeType: "minorEquipment", pColor: '#808080', dColor: 'white', color: 'black', width: 40, height: 40 }
        ];
        // Link Connector
        //     const paletteDiv6 = this.div6.nativeElement;
        var linkConnectorsPalette = GO(go.Palette, "myLCPaletteDiv");
        linkConnectorsPalette.nodeTemplate = wellsPalette.nodeTemplate;
        linkConnectorsPalette.model.nodeDataArray = [
            { key: 1, name: "lconnector2", nodeType: "Connector", pColor: 'black', dColor: 'black', color: 'black', width: 16, height: 20 },
            { key: 2, name: "tconnector1", nodeType: "Connector", pColor: 'black', dColor: 'black', color: 'black', width: 20, height: 15 },
            { key: 3, name: "lconnector3", nodeType: "Connector", pColor: 'black', dColor: 'black', color: 'black', width: 16, height: 20 },
            { key: 4, name: "tconnector4", nodeType: "Connector", pColor: 'black', dColor: 'black', color: 'black', width: 15, height: 20 },
            { key: 5, name: "xconnector", nodeType: "Connector", pColor: 'black', dColor: 'black', color: 'black', width: 20, height: 20 },
            { key: 6, name: "tconnector2", nodeType: "Connector", pColor: 'black', dColor: 'black', color: 'black', width: 16, height: 20 },
            { key: 7, name: "lconnector1", nodeType: "Connector", pColor: 'black', dColor: 'black', color: 'black', width: 16, height: 20 },
            { key: 8, name: "tconnector3", nodeType: "Connector", pColor: 'black', dColor: 'black', color: 'black', width: 20, height: 15 },
            { key: 9, name: "lconnector4", nodeType: "Connector", pColor: 'black', dColor: 'black', color: 'black', width: 16, height: 20 }
        ];
        // Shapes
        //      const paletteDiv7 = this.div7.nativeElement;
        var shapesPalette = GO(go.Palette, "mySPaletteDiv");
        shapesPalette.nodeTemplate = wellsPalette.nodeTemplate;
        shapesPalette.model.nodeDataArray = [
            { key: 1, name: "circle", nodeType: "shape", pColor: '#808080', dColor: 'white', color: 'black', width: 40, height: 40 },
            { key: 2, name: "rectangle", nodeType: "shape", pColor: '#808080', dColor: 'white', color: 'black', width: 40, height: 40 },
            { key: 3, name: "rectangletriangle", nodeType: "shape", pColor: '#808080', dColor: 'white', color: 'black', width: 55, height: 35 },
            { key: 4, name: "triangle", nodeType: "shape", pColor: '#808080', dColor: 'white', color: 'black', width: 40, height: 40 }
        ];
        this.accordin();
    };
    PalletComponent.prototype.geoFunc = function (geoname) {
        if (icons_component_1.IconsComponent.icons[geoname])
            return icons_component_1.IconsComponent.icons[geoname];
        else
            return icons_component_1.IconsComponent.icons["Screw Pump"];
    };
    PalletComponent.prototype.accordin = function () {
        var acc = document.getElementsByClassName("accordion");
        var i;
        for (i = 0; i < acc.length; i++) {
            acc[i].nextElementSibling.classList.toggle("hide");
            acc[i].onclick = function () {
                this.classList.toggle("active");
                this.nextElementSibling.classList.toggle("hide");
            };
        }
    };
    __decorate([
        core_1.ViewChild("myWellsPaletteDiv"), 
        __metadata('design:type', Object)
    ], PalletComponent.prototype, "div1", void 0);
    __decorate([
        core_1.ViewChild("myMEPaletteDiv"), 
        __metadata('design:type', Object)
    ], PalletComponent.prototype, "div2", void 0);
    __decorate([
        core_1.ViewChild("myMeterPaletteDiv"), 
        __metadata('design:type', Object)
    ], PalletComponent.prototype, "div3", void 0);
    __decorate([
        core_1.ViewChild("myTVPaletteDiv"), 
        __metadata('design:type', Object)
    ], PalletComponent.prototype, "div4", void 0);
    __decorate([
        core_1.ViewChild("myMIEPaletteDiv"), 
        __metadata('design:type', Object)
    ], PalletComponent.prototype, "div5", void 0);
    __decorate([
        core_1.ViewChild("myLCPaletteDiv"), 
        __metadata('design:type', Object)
    ], PalletComponent.prototype, "div6", void 0);
    __decorate([
        core_1.ViewChild("mySPaletteDiv"), 
        __metadata('design:type', Object)
    ], PalletComponent.prototype, "div7", void 0);
    PalletComponent = __decorate([
        core_1.Component({
            selector: 'pallet',
            templateUrl: 'app/pallet/pallet.template.html',
            styleUrls: ['app/pallet/pallet.styles.css', 'app/pallet/palletscroll.css']
        }),
        __param(0, core_1.Inject(core_1.ElementRef)), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], PalletComponent);
    return PalletComponent;
}());
exports.PalletComponent = PalletComponent;
//# sourceMappingURL=pallet.component.js.map