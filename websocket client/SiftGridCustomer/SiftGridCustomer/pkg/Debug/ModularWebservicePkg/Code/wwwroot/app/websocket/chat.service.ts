import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import {WebSocketService } from './websocket.service';

export const CHAT_URL = 'ws://dev3.centralus.cloudapp.azure.com:5050/websocketserver/data/';

export interface Message {
    deviceid: string,
    pipelineid: string,
    meter_value: string
}

@Injectable()
export class ChatService {
    public messages: Subject<Message>;

    constructor(wsService: WebSocketService) {
        console.log("CALEED");
        this.messages = <Subject<Message>>wsService
            .connect(CHAT_URL)
            .map((response: MessageEvent): Message => {
                console.log(response);
                console.log("Hello");
                let data = response.data;
                console.log(data);
                let j = JSON.parse(data);

                //console.log(data["deviceid"]);
                console.log(j["deviceid"]);
                //return j.deviceid;
                return {
                    deviceid: j.deviceid,
                    pipelineid: j.pipelineid,
                    meter_value: j.meter_value
                }
            });
    }
} // end class ChatService