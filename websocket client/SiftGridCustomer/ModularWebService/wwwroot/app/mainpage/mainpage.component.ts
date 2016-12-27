import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import {Inspector} from '../diagram/InspectorService';
import {DiagramComponent} from '../diagram/diagram.component';
import {LeftToggleComponent} from '../lefttoggle/lefttoggle.component';
import { SearchService} from "../search/searchservice";

@Component({
    selector: 'mainpage',
    templateUrl: 'app/mainpage/mainpage.template.html',
    providers: [Inspector, SearchService]

})
export class MainPageComponent {

    constructor(public inspectorService: Inspector) {

    }

    documentVisibility = true;
    showDocument() {
        if (this.documentVisibility == true) {
            document.getElementById("document").style.visibility = "visible";
            this.documentVisibility = false;
        }
        else {
            document.getElementById("document").style.visibility = "hidden";
            this.documentVisibility = true;
        }
    }

    consumerVisibility = true;
    showFuelConsumer() {
        if (this.consumerVisibility == true) {
            document.getElementById("fuel").style.visibility = "visible";
            this.consumerVisibility = false;
        }
        else {
            document.getElementById("fuel").style.visibility = "hidden";
            this.consumerVisibility = true;
        }
    }

    @Output() diagramID;
    @Output() myEvent = new EventEmitter();


    errorVisisbility = true;
    showError() {

        if (this.errorVisisbility == true) {
            document.getElementById("error").style.visibility = "visible";
            this.errorVisisbility = false;
        }
        else {
            document.getElementById("error").style.visibility = "hidden";
            this.errorVisisbility = true;
        }
    }

    palletVisibility = true;
    showPallet() {
        if (this.palletVisibility == true) {
            document.getElementById("pallet").style.visibility = "visible";
            this.palletVisibility = false;
        }
        else {
            document.getElementById("pallet").style.visibility = "hidden";
            this.palletVisibility = true;
        }
    }

    infoVisibility = true;
    showInfo() {
        if (this.infoVisibility == true) {
            document.getElementById("info").style.visibility = "visible";
            document.getElementById("notes").style.visibility = "visible";
            this.infoVisibility = false;
        }
        else {
            document.getElementById("info").style.visibility = "hidden";
            document.getElementById("notes").style.visibility = "hidden";
            this.infoVisibility = true;
        }
    }
}