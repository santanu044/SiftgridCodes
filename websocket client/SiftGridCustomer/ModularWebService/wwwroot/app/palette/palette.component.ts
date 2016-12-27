/// <reference path="../../libs/gojs.d.ts" />

import {Component, AfterViewInit, OnInit, ViewChild, ElementRef, Inject} from '@angular/core';
import {IconsComponent} from './icons.component';
declare var jQuery: any;

@Component({
    selector: 'palette',
    templateUrl: 'app/palette/palette.template.html',
    styleUrls: ['app/palette/palette.styles.css', 'app/palette/palettescroll.css']
})

export class PaletteComponent implements OnInit {

    @ViewChild("myWellsPaletteDiv") div1;
    @ViewChild("myMEPaletteDiv") div2;
    @ViewChild("myMeterPaletteDiv") div3;
    @ViewChild("myTVPaletteDiv") div4;
    @ViewChild("myMIEPaletteDiv") div5;
    @ViewChild("myLCPaletteDiv") div6;
    @ViewChild("mySPaletteDiv") div7;
   

    elementRef: ElementRef;

    constructor( @Inject(ElementRef) elementRef: ElementRef) {
        this.elementRef = elementRef;
    }

    toggleClick: boolean;
    changePalletView() {
        console.log("=> changePalletView");
        console.log("=>this.toggleClick :" + this.toggleClick);
        if (this.toggleClick == true) {
            this.toggleClick = false;
        } else {
            this.toggleClick = true;
        }
        this.accordin();
        this.ngOnInit();
    }

    //textVisibility(text) {
    //    if (this.toggleClick == false) {
    //        //this.toggleClick = true;
    //        return true;
    //    }
    //    else {
    //        return false;
    //    }
    //}

    isLoadTime: boolean = true;
    wellsPalette;
    majorEquipmentsPalette
    metersPalette
    tanksPalette
    minorEquipmentsPalette
    linkConnectorsPalette
    shapesPalette

    ngOnInit() {

        jQuery(this.elementRef.nativeElement).find('.draggable').draggable({ containment: '#draggable-parent' });

        const GO = go.GraphObject.make;

        //    const paletteDiv1 = this.div1.nativeElement;
        
        console.log("=> wellsPalette :"+this.wellsPalette);

        if (this.isLoadTime == true) {
            this.wellsPalette = GO(go.Palette, "myWellsPaletteDiv");
            this.majorEquipmentsPalette = GO(go.Palette, "myMEPaletteDiv");
            this.metersPalette = GO(go.Palette, "myMeterPaletteDiv");
            this.tanksPalette = GO(go.Palette, "myTVPaletteDiv");
            this.minorEquipmentsPalette = GO(go.Palette, "myMIEPaletteDiv");
            this.linkConnectorsPalette = GO(go.Palette, "myLCPaletteDiv");
            this.shapesPalette = GO(go.Palette, "mySPaletteDiv");
            this.isLoadTime = false;
        }

        if (this.toggleClick == true) {
            //this.toggleClick = false;
            this.wellsPalette.nodeTemplate =
                GO(go.Node, "Vertical",
                    GO(go.Shape, { name: "WSHAPE", width: 40, height: 40, stroke: "white", strokeWidth: 1.5, fill: "black" },
                        new go.Binding("geometryString", "name", this.geoFunc),
                        new go.Binding("fill", "pColor"),
                        new go.Binding("height", "dheight"),
                        new go.Binding("width", "dwidth")),
                    //GO(go.TextBlock, { stroke: "white", font: "8pt Roboto-Regular" }, new go.Binding("text", "text"), new go.Binding("visible", "", this.textVisibility)),
                    {
                        toolTip:
                        GO(go.Adornment, "Auto",
                            GO(go.Shape, { fill: "#f1efee" }),
                            GO(go.TextBlock, { margin: 4 },
                                new go.Binding("text", "name"))
                        )
                    }
                );
        }
        else {
            this.wellsPalette.nodeTemplate =
                GO(go.Node, "Vertical",
                    GO(go.Shape, { name: "WSHAPE", width: 40, height: 40, stroke: "white", strokeWidth: 1.5, fill: "black" },
                        new go.Binding("geometryString", "name", this.geoFunc),
                        new go.Binding("fill", "pColor"),
                        new go.Binding("height", "dheight"),
                        new go.Binding("width", "dwidth")),
                    GO(go.TextBlock, { stroke: "white", font: "8pt Roboto-Regular" }, new go.Binding("text", "text")),
                    {
                        toolTip:
                        GO(go.Adornment, "Auto",
                            GO(go.Shape, { fill: "#f1efee" }),
                            GO(go.TextBlock, { margin: 4 },
                                new go.Binding("text", "name"))
                        )
                    });
        }
       

        this.wellsPalette.model.nodeDataArray = [
            {
                name: "gas", text: "Gas", nodeType: "well", pColor: 'rgba(51,51,51,0.25)', dColor: 'white', color: 'black', dwidth: 32, dheight: 32, width: 32, height: 32, ports: [
                    { id: "T", spot: "0.5 0 0 0.5" },
                    { id: "L", spot: "0 0.5 0 0" },
                    { id: "R", spot: "1 0.5 0 0" },
                    { id: "B", spot: "0.5 1 0 -0.5" }
                ] },
            {
                name: "gasLift", text: "GasLift", nodeType: "well", pColor: 'rgba(51,51,51,0.25)', dColor: 'white', color: 'black', dwidth: 32, dheight: 32, width: 32, height: 32, ports: [
                    { id: "T", spot: "0.5 0 0 0.5" },
                    { id: "L", spot: "0 0.5 0 0" },
                    { id: "R", spot: "1 0.5 0 0" },
                    { id: "B", spot: "0.5 1 0 -0.5" }
                ]},
            {
                name: "gasInjection", text: "GasInjection", nodeType: "well", pColor: 'rgba(51,51,51,0.25)', dColor: 'white', color: 'black', dwidth: 32, dheight: 32, width: 32, height: 32, ports: [
                    { id: "T", spot: "0.5 0 0 0.5" },
                    { id: "L", spot: "0 0.5 0 0" },
                    { id: "R", spot: "1 0.5 0 0" },
                    { id: "B", spot: "0.5 1 0 -0.5" }
                ] },
            {
                name: "waterSource", text: "Water Source", nodeType: "well", pColor: 'rgba(51,51,51,0.25)', dColor: 'white', color: 'black', dwidth: 31, dheight: 31, width: 31, height: 31, ports: [
                    { id: "T", spot: "0.5 0 0 0.5" },
                    { id: "L", spot: "0 0.5 0 0" },
                    { id: "R", spot: "1 0.5 0 0" },
                    { id: "B", spot: "0.5 1 0 -0.5" }
                ]},
            {
                name: "waterInjection", text: "Water Injection", nodeType: "well", pColor: 'rgba(51,51,51,0.25)', dColor: 'white', color: 'black', dwidth: 31, dheight: 31, width: 31, height: 31,ports: [
                    { id: "T", spot: "0.5 0 0 0.5" },
                    { id: "L", spot: "0 0.5 0 0" },
                    { id: "R", spot: "1 0.5 0 0" },
                    { id: "B", spot: "0.5 1 0 -0.5" }
                ] },
            {
                name: "oil", text: "Oil", nodeType: "well", pColor: 'white', dColor: 'black', color: 'black', dwidth: 26, dheight: 26, width: 26, height: 26, ports: [
                    { id: "T", spot: "0.5 0 0 0.5" },
                    { id: "L", spot: "0 0.5 0 0" },
                    { id: "R", spot: "1 0.5 0 0" },
                    { id: "B", spot: "0.5 1 0 -0.5" }
                ] },
            {
                name: "sagd", text: "Sag D", nodeType: "well", pColor: 'black', dColor: 'black', color: 'black', dwidth: 32, dheight: 33, width: 32, height: 33, ports: [
                    { id: "T", spot: "0.5 0 0 0.5" },
                    { id: "L1", spot: "0.4 0.45 0 0" },
                    { id: "L2", spot: "0.4 0.7 0 0" },
                    { id: "L3", spot: "0.45 0.225" },
                    { id: "R1", spot: "0.6 0.45 0 0" },
                    { id: "R2", spot: "0.6 0.7 0 0" }
                ] },
            {
                name: "plungerLift", text: "Plunger Lift", nodeType: "well", pColor: 'rgba(51,51,51,0.25)', dColor: 'white', color: 'black', dwidth: 11, dheight: 34, width: 11, height: 34, ports: [
                    { id: "T", spot: "0.5 0 0 0.5" },
                    { id: "B", spot: "0.5 1 0 -0.5" }
                ]},
            {
                name: "pumpJack", text: "Pump Jack", nodeType: "well", pColor: 'rgba(51,51,51,0.25)', dColor: 'white', color: 'black', dwidth: 29, dheight: 29, width: 29, height: 29, ports: [
                    { id: "T", spot: "0.5 0 0 0.5" },
                    { id: "L", spot: "0 0.5 0 0" },
                    { id: "R", spot: "1 0.5 0 0" },
                    { id: "B", spot: "0.5 1 0 -0.5" }
                ] },
            {
                name: "screwPump", text: "Screw Pump", nodeType: "well", pColor: 'rgba(51,51,51,0.25)', dColor: 'white', color: 'black', dwidth: 30, dheight: 34, width: 30, height: 34, ports: [
                    { id: "T", spot: "0.5 0 0 0.5" },
                    { id: "L", spot: "0 0.5 0 0" },
                    { id: "R", spot: "1 0.5 0 0" },
                    { id: "B", spot: "0.5 1 0 -0.5" }
                ] }
        ];

        // Major Equipments
        //       const paletteDiv2 = this.div2.nativeElement;
        //var majorEquipmentsPalette = GO(go.Palette, "myMEPaletteDiv");
        this.majorEquipmentsPalette.nodeTemplate = this.wellsPalette.nodeTemplate

        this.majorEquipmentsPalette.model.nodeDataArray = [
            {
                key: 1, name: "ohexchanger", text: "OH Exchanger", nodeType: "majorEquipment", pColor: 'rgba(51,51,51,0.25)', dColor: 'white', color: 'black', dwidth: 28, dheight: 28, width: 28, height: 28, ports: [
                    { id: "T", spot: "0.5 0 0 0.5" },
                    { id: "L", spot: "0 0.5 0 0" },
                    { id: "R", spot: "1 0.5 0 0" },
                    { id: "B", spot: "0.5 1 0 -0.5" }
                ]},
            {
                key: 2, name: "pump", text: "Pump", nodeType: "majorEquipment", pColor: 'rgba(51,51,51,0.25)', dColor: 'white', color: 'black', dwidth: 26, dheight: 26, width: 26, height: 26, ports: [
                    { id: "L", spot: "0.375 0.5 0 0" },
                    { id: "R", spot: "1 0.1667 0 0" }
                ]},
            {
                key: 3, name: "lineheater", text: "Line Heater", nodeType: "majorEquipment", pColor: 'rgba(51,51,51,0.25)', dColor: 'white', color: 'black', dwidth: 30, dheight: 30, width: 30, height: 30, ports: [
                    { id: "L", spot: "0 0.6667 0 0" },
                    { id: "T1", spot: "0.2 0.45 0 0" },
                    { id: "T2", spot: "0.6 0.45 0 0" },
                    { id: "R", spot: "1 0.1667 0 0" },
                    { id: "B1", spot: "0.2 1 0 0" },
                    { id: "B2", spot: "0.6 1 0 0" }
                ]},
            {
                key: 4, name: "compressor", text: "Compressor", nodeType: "majorEquipment", pColor: 'rgba(51,51,51,0.25)', dColor: 'white', color: 'black', dwidth: 39, dheight: 27, width: 39, height: 27, ports: [
                    { id: "T", spot: "0.25 0.08 0 0" },
                    { id: "L1", spot: "0 0.2857 0 0" },
                    { id: "L2", spot: "0 0.7143 0 0" },
                    { id: "R", spot: "0.95 0.2857 0 0" },
                    { id: "B", spot: "0.25 1 0 0" },
                    { id: "T2", spot: "0.775 0 0 0" },
                    { id: "B2", spot: "0.775 1 0 0" }
                ] },
            {
                key: 5, name: "coalescer", text: "Coalescer", nodeType: "majorEquipment", pColor: 'rgba(51,51,51,0.25)', dColor: 'white', color: 'black', dwidth: 26, dheight: 27, width: 26, height: 27, ports: [
                    { id: "T", spot: "0.5 0 0 0" },
                    { id: "L1", spot: "0.09 0.25 0 0" },
                    { id: "L2", spot: "0.1 0.75 0 0" },
                    { id: "R1", spot: "0.91 0.25 0 0" },
                    { id: "R2", spot: "0.9 0.75 0 0" },
                    { id: "B", spot: "0.5 1 0 0" }
                ]},
            {
                key: 6, name: "exchanger", text: "Exchanger", nodeType: "majorEquipment", pColor: 'rgba(51,51,51,0.25)', dColor: 'white', color: 'black', dwidth: 28, dheight: 28, width: 28, height: 28, ports: [
                    { id: "T", spot: "0.5 0 0 0" },
                    { id: "L1", spot: "0 0.25 0 0" },
                    { id: "L2", spot: "0 0.75 0 0" },
                    { id: "R1", spot: "1 0.25 0 0" },
                    { id: "R2", spot: "1 0.75 0 0" },
                    { id: "B", spot: "0.5 1 0 0" }
                ] }

        ];

        // Meters
        //     const paletteDiv3 = this.div3.nativeElement;
        //var metersPalette = GO(go.Palette, "myMeterPaletteDiv");
        this.metersPalette.nodeTemplate = this.wellsPalette.nodeTemplate

        this.metersPalette.model.nodeDataArray = [
            {
                key: 1, name: "thermalmass", text: "Thermalmass", nodeType: "meter", pColor: 'rgba(51,51,51,0.25)', dColor: 'white', color: 'black', dwidth: 35, dheight: 35, width: 35, height: 35, ports: [
                    { id: "T", spot: "0.5 0 0 0.5" },
                    { id: "L", spot: "0 0.5 0 0" },
                    { id: "R", spot: "1 0.5 0 0" },
                    { id: "B", spot: "0.5 1 0 -0.5" }
                ] },
            { key: 2, name: "turbine", text: "Turbine", nodeType: "meter", pColor: 'rgba(51,51,51,0.25)', dColor: 'white', color: 'black', dwidth: 35, dheight: 35, width: 35, height: 35, ports: [
                { id: "T", spot: "0.5 0 0 0.5" },
                { id: "L", spot: "0 0.5 0 0" },
                { id: "R", spot: "1 0.5 0 0" },
                { id: "B", spot: "0.5 1 0 -0.5" }
            ] },
            {
                key: 3, name: "orifice", text: "Orifice", nodeType: "meter", pColor: 'rgba(51,51,51,0.25)', dColor: 'white', color: 'black', dwidth: 35, dheight: 35, width: 35, height: 35, ports: [
                    { id: "T", spot: "0.5 0 0 0.5" },
                    { id: "L", spot: "0 0.5 0 0" },
                    { id: "R", spot: "1 0.5 0 0" },
                    { id: "B", spot: "0.5 1 0 -0.5" }
                ]},
            {
                key: 4, name: "rotameter", text: "Rotameter", nodeType: "meter", pColor: 'rgba(51,51,51,0.25)', dColor: 'white', color: 'black', dwidth: 35, dheight: 35, width: 35, height: 35, ports: [
                    { id: "T", spot: "0.5 0 0 0.5" },
                    { id: "L", spot: "0 0.5 0 0" },
                    { id: "R", spot: "1 0.5 0 0" },
                    { id: "B", spot: "0.5 1 0 -0.5" }
                ] },
            {
                key: 5, name: "vortex", text: "Vortex", nodeType: "meter", pColor: 'rgba(51,51,51,0.25)', dColor: 'white', color: 'black', dwidth: 35, dheight: 35, width: 35, height: 35, ports: [
                    { id: "T", spot: "0.5 0 0 0.5" },
                    { id: "L", spot: "0 0.5 0 0" },
                    { id: "R", spot: "1 0.5 0 0" },
                    { id: "B", spot: "0.5 1 0 -0.5" }
                ] },
            {
                key: 6, name: "ultrasonic", text: "Ultrasonic", nodeType: "meter", pColor: 'rgba(51,51,51,0.25)', dColor: 'white', color: 'black', dwidth: 35, dheight: 35, width: 35, height: 35, ports: [
                    { id: "T", spot: "0.5 0 0 0.5" },
                    { id: "L", spot: "0 0.5 0 0" },
                    { id: "R", spot: "1 0.5 0 0" },
                    { id: "B", spot: "0.5 1 0 -0.5" }
                ] },
            {
                key: 7, name: "vcone", text: "Vcone", nodeType: "meter", pColor: 'rgba(51,51,51,0.25)', dColor: 'white', color: 'black', dwidth: 35, dheight: 35, width: 35, height: 35, ports: [
                    { id: "T", spot: "0.5 0 0 0.5" },
                    { id: "L", spot: "0 0.5 0 0" },
                    { id: "R", spot: "1 0.5 0 0" },
                    { id: "B", spot: "0.5 1 0 -0.5" }
                ] },
            {
                key: 8, name: "flowNozzle", text: "Flow Nozzle", nodeType: "meter", pColor: 'rgba(51,51,51,0.25)', dColor: 'white', color: 'black', dwidth: 35, dheight: 35, width: 35, height: 35, ports: [
                    { id: "T", spot: "0.5 0 0 0.5" },
                    { id: "L", spot: "0 0.5 0 0" },
                    { id: "R", spot: "1 0.5 0 0" },
                    { id: "B", spot: "0.5 1 0 -0.5" }
                ] },
            {
                key: 9, name: "mag", text: "Mag", nodeType: "meter", pColor: 'rgba(51,51,51,0.25)', dColor: 'white', color: 'black', dwidth: 35, dheight: 35, width: 35, height: 35, ports: [
                    { id: "T", spot: "0.5 0 0 0.5" },
                    { id: "L", spot: "0 0.5 0 0" },
                    { id: "R", spot: "1 0.5 0 0" },
                    { id: "B", spot: "0.5 1 0 -0.5" }
                ] },
            {
                key: 10, name: "coriolis", text: "Coriolis", nodeType: "meter", pColor: 'rgba(51,51,51,0.25)', dColor: 'white', color: 'black', dwidth: 35, dheight: 35, width: 35, height: 35, ports: [
                    { id: "T", spot: "0.5 0 0 0.5" },
                    { id: "L", spot: "0 0.5 0 0" },
                    { id: "R", spot: "1 0.5 0 0" },
                    { id: "B", spot: "0.5 1 0 -0.5" }
                ] },
            {
                key: 11, name: "pd", text: "PD", nodeType: "meter", pColor: 'rgba(51,51,51,0.25)', dColor: 'white', color: 'black', dwidth: 35, dheight: 35, width: 35, height: 35, ports: [
                    { id: "T", spot: "0.5 0 0 0.5" },
                    { id: "L", spot: "0 0.5 0 0" },
                    { id: "R", spot: "1 0.5 0 0" },
                    { id: "B", spot: "0.5 1 0 -0.5" }
                ] },
            {
                key: 12, name: "localMounted", text: "LocalMounted", nodeType: "meter", pColor: 'rgba(51,51,51,0.25)', dColor: 'white', color: 'black', dwidth: 35, dheight: 35, width: 35, height: 35, ports: [
                    { id: "T", spot: "0.5 0 0 0.5" },
                    { id: "L", spot: "0 0.5 0 0" },
                    { id: "R", spot: "1 0.5 0 0" },
                    { id: "B", spot: "0.5 1 0 -0.5" }
                ]},
            {
                key: 13, name: "netoil", text: "Netoil", nodeType: "meter", pColor: 'rgba(51,51,51,0.25)', dColor: 'white', color: 'black', dwidth: 35, dheight: 35, width: 35, height: 35, ports: [
                    { id: "T", spot: "0.5 0 0 0.5" },
                    { id: "L", spot: "0 0.5 0 0" },
                    { id: "R", spot: "1 0.5 0 0" },
                    { id: "B", spot: "0.5 1 0 -0.5" }
                ] },
            {
                key: 14, name: "optical", text: "Optical", nodeType: "meter", pColor: 'rgba(51,51,51,0.25)', dColor: 'white', color: 'black', dwidth: 35, dheight: 35, width: 35, height: 35, ports: [
                    { id: "T", spot: "0.5 0 0 0.5" },
                    { id: "L", spot: "0 0.5 0 0" },
                    { id: "R", spot: "1 0.5 0 0" },
                    { id: "B", spot: "0.5 1 0 -0.5" }
                ]},
            {
                key: 15, name: "samplePoint", text: "SamplePoint", nodeType: "meter", pColor: 'rgba(51,51,51,0.25)', dColor: 'white', color: 'black', dwidth: 35, dheight: 35, width: 35, height: 35, ports: [
                    { id: "T", spot: "0.5 0 0 0.5" },
                    { id: "L", spot: "0 0.5 0 0" },
                    { id: "R", spot: "1 0.5 0 0" },
                    { id: "B", spot: "0.5 1 0 -0.5" }
                ] }

        ];

        // Tanks and Vessel
        //    const paletteDiv4 = this.div4.nativeElement;
        //var tanksPalette = GO(go.Palette, "myTVPaletteDiv");
        this.tanksPalette.nodeTemplate = this.wellsPalette.nodeTemplate


        this.tanksPalette.model.nodeDataArray = [
            {
                key: 1, name: "vesselUnderground", text: "Vessel Underground", nodeType: "tank", pColor: 'rgba(51,51,51,0.25)', dColor: 'white', color: 'black', dwidth: 65, dheight: 45, width: 65, height: 45, ports: [
                    { id: "T1", spot: "0.25 0.38 0 0" },
                    { id: "T2", spot: "0.75 0.38 0 0" },
                    { id: "L", spot: "0 0.7143 0 0" },
                    { id: "R", spot: "1 0.7143 0 0" }
                ]},
            {
                key: 2, name: "tankUnderground", text: "Tank Underground", nodeType: "tank", pColor: 'rgba(51,51,51,0.25)', dColor: 'white', color: 'black', dwidth: 65, dheight: 45, width: 65, height: 45, ports: [
                    { id: "T1", spot: "0.4167 0.4285 0 0" },
                    { id: "T2", spot: "0.7667 0.4285 0 0" },
                    { id: "L", spot: "0.27 0.7 0 0" },
                    { id: "R", spot: "0.945 0.7 0 0" }
                ]},
            {
                key: 3, name: "pond", text: "Pond", nodeType: "tank", pColor: 'black', dColor: 'black', color: 'black', dwidth: 60, dheight: 40, width: 60, height: 40, ports: [
                    { id: "T1", spot: "0.35 0 0 0" },
                    { id: "T2", spot: "0.65 0 0 0" }
                ] },
            {
                key: 4, name: "tank", text: "Tank", nodeType: "tank", pColor: 'rgba(51,51,51,0.25)', dColor: 'white', color: 'black', dwidth: 65, dheight: 45, width: 65, height: 45, ports: [
                    { id: "T", spot: "0.5 0.255 0 0" },
                    { id: "L1", spot: "0 0.3025 0 0" },
                    { id: "L2", spot: "0 0.765 0 0" },
                    { id: "R1", spot: "1 0.3025 0 0" },
                    { id: "R2", spot: "1 0.765 0 0" },
                    { id: "B1", spot: "0.25 1 0 0" },
                    { id: "B2", spot: "0.755 1 0 0" }
                ] },
            {
                key: 5, name: "separator", text: "Separator", nodeType: "tank", pColor: 'rgba(51,51,51,0.25)', dColor: 'white', color: 'black', width: 40, height: 100, ports: [
                    { id: "T", spot: "0.5 0 0 0.5" },
                    { id: "L1", spot: "0 0.1667 0 0" },
                    { id: "L2", spot: "0 0.5 0 0" },
                    { id: "L3", spot: "0 0.8333 0 0" },
                    { id: "R1", spot: "1 0.1667 0 0" },
                    { id: "R2", spot: "1 0.5 0 0" },
                    { id: "R3", spot: "1 0.8333 0 0" },
                    { id: "B", spot: "0.5 1 0 -0.5" }
                ]},
            {
                key: 6, name: "vesselwboot", text: "Vesselwboot", nodeType: "tank", pColor: 'rgba(51,51,51,0.25)', dColor: 'white', color: 'black', dwidth: 65, dheight: 45, width: 65, height: 45, ports: [
                    { id: "T1", spot: "0.2777 0 0 0" },
                    { id: "T2", spot: "0.7223 0 0 0" },
                    { id: "L", spot: "0 0.2727 0 0" },
                    { id: "R1", spot: "1 0.2727 0 0" },
                    { id: "B1", spot: "0.2777 0.62 0 0" },
                    { id: "B2", spot: "0.6666 1 0 0" },
                    { id: "B3", spot: "0.5 0.62 0 0" }
                ] },
            {
                key: 7, name: "fuelScrubber", text: "FuelScrubber", nodeType: "tank", pColor: 'rgba(51,51,51,0.25)', dColor: 'white', color: 'black', dwidth: 32, dheight: 32, width: 32, height: 32, ports: [
                    { id: "T", spot: "0.5 0 0 0.5" },
                    { id: "L", spot: "0 0.5 0 0" },
                    { id: "R", spot: "1 0.5 0 0" },
                    { id: "B", spot: "0.5 1 0 -0.5" }
                ]}
        ];

        // Minor Equipment
        //   const paletteDiv5 = this.div5.nativeElement;
        //var minorEquipmentsPalette = GO(go.Palette, "myMIEPaletteDiv");
        this.minorEquipmentsPalette.nodeTemplate = this.wellsPalette.nodeTemplate


        this.minorEquipmentsPalette.model.nodeDataArray = [
            {
                key: 1, name: "heaterother", text: "Heaterother", nodeType: "minorEquipment", pColor: 'rgba(51,51,51,0.25)', dColor: 'white', color: 'black', width: 25, height: 60, ports: [
                    { id: "T", spot: "0.5 0 0 0" },
                    { id: "L1", spot: "0.09 0.3 0 0" },
                    { id: "L2", spot: "0 0.8 0 0" },
                    { id: "R1", spot: "0.89 0.3 0 0" },
                    { id: "R2", spot: "1 0.8 0 0" }
                ]},
            {
                key: 2, name: "tanker", text: "Tanker", nodeType: "minorEquipment", pColor: 'rgba(51,51,51,0.25)', dColor: 'white', color: 'black', width: 105, height: 70, ports: [
                    { id: "T", spot: "0.1 0.03 0 0" },
                    { id: "L", spot: "0.0333 0.5 0 0" },
                    { id: "R", spot: "1 0.65 0 0" }
                ] },
            {
                key: 3, name: "testconnection", text: "TestConnection", nodeType: "minorEquipment", pColor: 'rgba(51,51,51,0.25)', dColor: 'white', color: 'black', dwidth: 32, dheight: 32, width: 32, height: 32, ports: [
                    { id: "L", spot: "0.3075 0.1667 0 0" },
                    { id: "R", spot: "0.6925 0.1667 0 0" }
                ]},
            {
                key: 4, name: "fuelgas", text: "Fuelgas", nodeType: "minorEquipment", pColor: 'rgba(51,51,51,0.25)', dColor: 'white', color: 'black', width: 40, height: 40, ports: [
                    { id: "T", spot: "0.5 0 0 0.5" },
                    { id: "L", spot: "0 0.5 0 0" },
                    { id: "R", spot: "1 0.5 0 0" },
                    { id: "B", spot: "0.5 1 0 -0.5" }
                ] },
            {
                key: 5, name: "valve", text: "Valve", nodeType: "minorEquipment", pColor: 'rgba(51,51,51,0.25)', dColor: 'white', color: 'black', dwidth: 26, dheight: 26, width: 26, height: 26, ports: [
                    { id: "L", spot: "0 0.5 0 0" },
                    { id: "R", spot: "1 0.5 0 0" }
                ]},
            {
                key: 6, name: "flarestack", text: "Flarestack", nodeType: "minorEquipment", pColor: 'rgba(51,51,51,0.25)', dColor: 'white', color: 'black', dwidth: 25, dheight: 50, width: 25, height: 50, ports: [
                    { id: "T", spot: "0.5 0 0 0.5" },
                    { id: "L", spot: "0.15 0.885 0 0" },
                    { id: "L2", spot: "0.2 0.475 0 0" },
                    { id: "R", spot: "0.85 0.885 0 0" },
                    { id: "R2", spot: "0.8 0.475 0 0" }
                ]},
            {
                key: 8, name: "pressurecontrolvalve", text: "Pressurecontrolvalve", nodeType: "minorEquipment", pColor: 'rgba(51,51,51,0.25)', dColor: 'white', color: 'black', dwidth: 32, dheight: 32, width: 32, height: 32, ports: [
                    { id: "L", spot: "0 0.725" },
                    { id: "R", spot: "1 0.725" }
                ] }
        ];

        // Link Connector
        //     const paletteDiv6 = this.div6.nativeElement;
        //var linkConnectorsPalette = GO(go.Palette, "myLCPaletteDiv");
        this.linkConnectorsPalette.nodeTemplate = this.wellsPalette.nodeTemplate


        this.linkConnectorsPalette.model.nodeDataArray = [
            {
                key: 1, name: "lconnector2", nodeType: "Connector", pColor: 'black', dColor: 'black', color: 'black', width: 16, height: 20, ports: [
                    { id: "R", spot: "1 0.25 0 0" },
                    { id: "B", spot: "0.25 1 0 0" }
                ] },
            {
                key: 2, name: "tconnector1", nodeType: "Connector", pColor: 'black', dColor: 'black', color: 'black', width: 20, height: 15, ports: [
                    { id: "L", spot: "0 0.25 0 0" },
                    { id: "R", spot: "1 0.25 0 0" },
                    { id: "B", spot: "0.5 1 0 0" }
                ] },
            {
                key: 3, name: "lconnector3", nodeType: "Connector", pColor: 'black', dColor: 'black', color: 'black', width: 16, height: 20, ports: [
                    { id: "R", spot: "0 0.25 0 0" },
                    { id: "B", spot: "0.75 1 0 0" }
                ]},
            {
                key: 4, name: "tconnector4", nodeType: "Connector", pColor: 'black', dColor: 'black', color: 'black', width: 15, height: 20, ports: [
                    { id: "T", spot: "0.25 0 0 0" },
                    { id: "R", spot: "1 0.5 0 0" },
                    { id: "B", spot: "0.25 1 0 0" }
                ]},
            {
                key: 5, name: "xconnector", nodeType: "Connector", pColor: 'black', dColor: 'black', color: 'black', width: 20, height: 20, ports: [
                    { id: "T", spot: "0.5 0 0 0.5" },
                    { id: "L", spot: "0 0.5 0 0" },
                    { id: "R", spot: "1 0.5 0 0" },
                    { id: "B", spot: "0.5 1 0 -0.5" }
                ] },
            {
                key: 6, name: "tconnector2", nodeType: "Connector", pColor: 'black', dColor: 'black', color: 'black', width: 16, height: 20, ports: [
                    { id: "T", spot: "0.5 0 0 0.5" },
                    { id: "L", spot: "0 0.5 0 0" },
                    { id: "R", spot: "1 0.5 0 0" },
                    { id: "B", spot: "0.5 1 0 -0.5" }
                ] },
            {
                key: 7, name: "lconnector1", nodeType: "Connector", pColor: 'black', dColor: 'black', color: 'black', width: 16, height: 20, ports: [
                    { id: "T", spot: "0.25 0 0 0" },
                    { id: "R", spot: "1 0.75 0 0" }
                ] },
            {
                key: 8, name: "tconnector3", nodeType: "Connector", pColor: 'black', dColor: 'black', color: 'black', width: 20, height: 15, ports: [
                    { id: "T", spot: "0.5 0 0 0" },
                    { id: "L", spot: "0 0.75 0 0" },
                    { id: "R", spot: "1 0.75 0 0" }
                ]},
            {
                key: 9, name: "lconnector4", nodeType: "Connector", pColor: 'black', dColor: 'black', color: 'black', width: 16, height: 20, ports: [
                    { id: "T", spot: "0.75 0 0 0" },
                    { id: "L", spot: "0 0.75 0 0" }
                ]}
        ];

        // Shapes
        //      const paletteDiv7 = this.div7.nativeElement;
        //var shapesPalette = GO(go.Palette, "mySPaletteDiv");
        this.shapesPalette.nodeTemplate = this.wellsPalette.nodeTemplate


        this.shapesPalette.model.nodeDataArray = [
            {
                key: 1, name: "circle", text: "Circle", nodeType: "shape", pColor: 'rgba(51,51,51,0.25)', dColor: 'white', color: 'black', dwidth: 32, dheight: 32, width: 32, height: 32, ports: [
                    { id: "T", spot: "0.5 0 0 0.5" },
                    { id: "L", spot: "0 0.5 0 0" },
                    { id: "R", spot: "1 0.5 0 0" },
                    { id: "B", spot: "0.5 1 0 -0.5" }
                ] },
            {
                key: 2, name: "rectangle", text: "Rectangle", nodeType: "shape", pColor: 'rgba(51,51,51,0.25)', dColor: 'white', color: 'black', dwidth: 32, dheight: 32, width: 32, height: 32, ports: [
                    { id: "T", spot: "0.5 0 0 0.5" },
                    { id: "L", spot: "0 0.5 0 0" },
                    { id: "R", spot: "1 0.5 0 0" },
                    { id: "B", spot: "0.5 1 0 -0.5" }
                ] },
            {
                key: 3, name: "rectangletriangle", text: "Rectangletriangle", nodeType: "shape", pColor: 'rgba(51,51,51,0.25)', dColor: 'white', color: 'black', dwidth: 32, dheight: 32, width: 32, height: 32, ports: [
                    { id: "T", spot: "0.5 0 0 0.5" },
                    { id: "L", spot: "0 0.5 0 0" },
                    { id: "R", spot: "1 0.5 0 0" },
                    { id: "B", spot: "0.5 1 0 -0.5" }
                ]},
            {
                key: 4, name: "triangle", text: "Triangle", nodeType: "shape", pColor: 'rgba(51,51,51,0.25)', dColor: 'white', color: 'black', dwidth: 32, dheight: 32, width: 32, height: 32, ports: [
                    { id: "T", spot: "0.5 0 0 0" },
                    { id: "L", spot: "0.25 0.5 0 0" },
                    { id: "R", spot: "0.75 0.5 0 0" },
                    { id: "B", spot: "0.5 1 0 0" }
                ]}
        ];

        this.accordin();
    }



    geoFunc(geoname) {
        if (IconsComponent.icons[geoname]) return IconsComponent.icons[geoname];
        else return IconsComponent.icons["Screw Pump"];
    }


    accordin() {
        var acc: any = document.getElementsByClassName("accordion");
        var i;
        for (i = 0; i < acc.length; i++) {
            acc[i].nextElementSibling.classList.toggle("hide");
            acc[i].onclick = function () {
                this.classList.toggle("active");
                this.nextElementSibling.classList.toggle("hide");
            }
        }
    }

    closepallete() {
        document.getElementById("pallet").style.visibility = "hidden";
        //this.palletVisibility = true;
    }
}