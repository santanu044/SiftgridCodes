import {Component, Input,Output,EventEmitter} from '@angular/core';
import {Inspector} from '../diagram/inspectorservice'
@Component({
    selector: 'info',
    templateUrl: 'app/info/info.template.html',
    styleUrls: ['app/info/info.styles.css']
})
export class InfoComponent {

    @Input() diagramId: String;
    modelData;
    @Output() myEvent = new EventEmitter();
    infoProperties;
    constructor(private inspector: Inspector) {
        console.log("diagramId in info component :" + this.diagramId);
        inspector.updateInfoPaneObservable.subscribe((response) => {
            this.myEvent.emit(null);
            console.log(response);
            this.infoProperties = response;
            var flag = this.infoProperties["IsMissingField"];
            var key = response["LocationId"];
            var nodetype = response["Type"];
            console.log(key, nodetype);
            var nodeJson = this.inspector._diagram.findNodeForKey(key);
            this.inspector._diagram.startTransaction("Changing color");
            if (flag) {

            } else {
                this.inspector._diagram.model.setDataProperty(nodeJson.data, "color", "black");
            }
            this.inspector._diagram.commitTransaction("Changed color");
        });
        inspector.showDiagramInfoObservable.subscribe((response) => {
            this.infoProperties = response;
        });

    }

    updateValue(val, key) {
        var locationId = this.infoProperties["LocationId"];
        this.infoProperties[key] = val;
        this.inspector.updateObjectProperties.next(JSON.stringify(this.infoProperties));
    }

}