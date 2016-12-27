﻿
import {LollipopRoute} from "./LollipopLink"
export class CustomDraggingTool extends go.DraggingTool {
    constructor() {
        super();
        this.name = "CustomDraggingTool";
    }


    public doDeactivate() {
        super.doDeactivate();
    }

    public compatiblePorts(p1: any, p2: any) {
        console.log("compatiblePorts");

        // already connected?
        var part1 = p1.part;
        var id1 = p1.portId;
        // console.log("--------------------------------------------------:" + id1);
        if (id1 === null || id1 === "") return false;
        if (part1.findLinksConnected(id1).count > 0) return false;
        var part2 = p2.part;
        var id2 = p2.portId;
        //console.log("--------------------------------------------------------:" + id2);
        if (id2 === null || id2 === "") return false;
        if (part2.findLinksConnected(id2).count > 0) return false;

        if (id1 == 'B' && id2 == 'T')
            return true;

        return false;
    }
    _snapOffset: any = null;

    public moveParts(parts: any, offset: any, check: any) {
        console.log("moveParts");

        // when moving an actually copied collection of Parts, use the offset that was calculated during the drag
        if (this._snapOffset && this.isActive && this.diagram.lastInput.up && parts === this.copiedParts) {
            go.DraggingTool.prototype.moveParts.call(this, parts, this._snapOffset, check);
            this._snapOffset = undefined;
            return;
        }

        var commonOffset = offset;

        // find out if any snapping is desired for any Node being dragged
        var sit = parts.iterator;
        while (sit.next()) {
            var node = sit.key;
            console.log("Current node :" + node);
            if (!(node instanceof go.Node)) continue;

            //---------------------------------------------------------------------
            var info = sit.value;
            var newloc = info.point.copy().add(offset);

            // now calculate snap point for this Node
            var snapoffset = newloc.copy().subtract(node.location);

            var nearbyports: any = null;
            var closestDistance = 20 * 20;  // don't bother taking sqrt
            var closestPort: any = null;
            var closestPortPt: any = null;
            var nodePort: any = null;
            var tonode: any = null;
            //--------------------------------------------------------------------
            if (node.data.name == 'screwPump' || node.data.name == 'plungerLift' || node.data.name == 'pumpJack') {
                var mit = node.ports;
                while (mit.next()) {
                    var port: any = mit.value;
                    if (port.portId == 'B') {
                        console.log("Curent nodeport :" + port);
                        var portPt = port.getDocumentPoint(go.Spot.Center);
                        var nearbyparts = this.diagram.findObjectsNear(portPt, 50,
                            function (x) {
                                console.log("===> X :" + x);
                                return x;
                            },
                            function (p) {
                                //return !parts.contains(p);
                                return true;
                            },
                            true);


                        nearbyports = new go.Set<go.GraphObject>();
                        nearbyparts.each(function (n) {
                            if (n instanceof go.Node) {

                                nearbyports.addAll(n.ports);
                                if (n.data.name == 'oil' || n.data.name == 'gas')
                                    tonode = n;

                            }
                        });

                        var pit = nearbyports.iterator;

                        while (pit.next()) {
                            var p = pit.value;
                            if (!this.compatiblePorts(port, p)) continue;
                            var ppt = p.getDocumentPoint(go.Spot.Center);
                            var d = ppt.distanceSquaredPoint(portPt);
                            console.log("d :" + d);
                            console.log("closestDistance :" + closestDistance);
                            if (d < closestDistance) {
                                closestDistance = d;
                                closestPort = p;
                                closestPortPt = ppt;
                                nodePort = port;
                                console.log("* :" + port.portId);


                                if (!this.compatiblePorts(port, closestPort)) continue;
                                if (closestPort.part.data.name == 'oil' || closestPort.part.data.name == 'gas') {
                                    if ((port.part.data.name == 'screwPump' || port.part.data.name == 'plungerLift' || port.part.data.name == 'pumpJack')
                                        && closestPort.part.data.name != 'screwPump' && closestPort.part.data.name != 'plungerLift' && closestPort.part.data.name != 'pumpJack') {

                                        console.log("=>going to pink");
                                        console.log(port.part.data.name);
                                        console.log(closestPort.part.data.name);
                                        //var psh1 = port.findObject("PSHAPE");
                                        port.stroke = "rgba(255, 0, 255, 1)";
                                        port.strokeWidth = 2;
                                    }
                                }

                                if (closestPort.part.data.name == 'oil' || closestPort.part.data.name == 'gas') {
                                    //var psh2 = closestPort.findObject("PSHAPE");
                                    closestPort.stroke = "rgba(255, 0, 255, 1)";
                                    closestPort.strokeWidth = 2;
                                }
                            }
                            else {
                                closestDistance = d;
                                closestPort = p;
                                closestPortPt = ppt;
                                nodePort = port;
                                console.log("* :" + port.portId);
                                //var psh1 = port.findObject("PSHAPE");
                                port.stroke = null;

                                //var psh2 = closestPort.findObject("PSHAPE");
                                closestPort.stroke = null;

                            }
                        }
                    }
                }//end of while of ports

                if (closestPort !== null) {

                    break;
                }//end of cloest port

            }//end of screw pump
        }//end of while of nodes

        // now do the standard movement with the single (perhaps snapped) offset
        this._snapOffset = commonOffset.copy();  // remember for mouse-up when copying
        go.DraggingTool.prototype.moveParts.call(this, parts, commonOffset, check);
    };

    public computeEffectiveCollection(parts: any) {
        console.log("computeEffectiveCollection");
        if (this.diagram.lastInput.shift) {
            var links = new go.Set(go.Link);
            var coll = go.DraggingTool.prototype.computeEffectiveCollection.call(this, parts);
            coll.iteratorKeys.each(function (node: any) {
                // disconnect all links of this node that connect with stationary node
                if (!(node instanceof go.Node)) return;
                node.findLinksConnected().each(function (link) {
                    // see if this link connects with a node that is being dragged
                    var othernode = link.getOtherNode(node);
                    if (othernode !== null && !coll.contains(othernode)) {
                        links.add(link);  // remember for later deletion
                    }
                });
            });
            // outside of nested loops we can actually delete the links
            links.each(function (l: any) { l.diagram.remove(l); });
            return coll;
        } else {
            var map = new go.Map(go.Part, Object);
            if (parts === null) return map;
            var tool = this;
            parts.iterator.each(function (n: any) {
                tool.gatherConnecteds(map, n);
            });
            return map;
        }
    };
    public gatherConnecteds(map: any, node: any) {
        console.log("gatherConnecteds");
        if (!(node instanceof go.Node)) return;
        if (map.contains(node)) return;
        // record the original Node location, for relative positioning and for cancellation
        map.add(node, { point: node.location });
        // now recursively collect all connected Nodes and the Links to them
        var tool = this;


        if (node.data.name == "oil" || node.data.name == "gas") {
            node.findLinksConnected().each(function (link) {
                console.log("= link :" + link);
                if (link.toPortId == 'T' && link.fromPortId == 'B') {
                    map.add(link, { point: new go.Point() });
                    tool.gatherConnecteds(map, link.getOtherNode(node));
                }
            });
        }
        if (node.data.nodeType == "meter" || node.data.name == "localMounted") {
            node.findLinksConnected().each(function (link) {
                console.log("= link :" + link);
                if (link.toPortId == 'T' && link.fromPortId == 'B') {
                    map.add(link, { point: new go.Point() });
                    tool.gatherConnecteds(map, link.getOtherNode(node));
                }
            });
        }
    };
    public doDropOnto(pt: go.Point, obj: go.GraphObject) {
        super.doDropOnto(pt, obj);

        this.diagram.selection.each(node => {
            var nodeData = node.data

            if (node != null && (nodeData.nodeType == "meter" || nodeData.nodeType == "tank")) {
                console.log(node.data)
                var portpt1 = node.actualBounds
                //  var nodeData = node.data

                var overlaps = this.diagram.findObjectsIn(portpt1,
                    function (x: any) {
                        var part = x.part;
                        if (part instanceof go.Link) return part;
                        return null;
                    },
                    null, true);
                console.log(overlaps.count);
                overlaps.each(function (l: any) { console.log(l.data); });

                var link = overlaps.first();

                //if (link != null)

                //    ConnectLink.dropOntoLink(this.diagram, <go.Link>link.part)

                var flag = false;
                if (link != null) {
                    var linkData = link.part.data;

                    // validating node. Dragging the node uuid and link from and to id must not be same to avoid link with itself.
                    this.diagram.selection.each(node => {
                        var uuid = node.data.uuid
                        console.log(uuid)
                        console.log(linkData)
                        if (linkData.from == uuid || linkData.to == uuid)
                            flag = true;
                    });

                    if (!flag) {
                        console.log(linkData)
                        ConnectLink.dropOntoLink(this.diagram, <go.Link>link.part)
                        if (nodeData.nodeType == "meter") {
                            (<go.Node>node).findLinksConnected().each(e => {
                                //          console.log(e.data)
                                this.diagram.startTransaction("removing arrow ");
                                var link = e;
                                this.diagram.model.setDataProperty(link.data, "fromArrow", "");
                                this.diagram.model.setDataProperty(link.data, "toArrow", "");
                                this.diagram.commitTransaction("removing arrow ");

                            });
                        }

                    }

                    //////

                }
            }
        });


        var tool = this;
        // Need to iterate over all of the dropped nodes to see which ports happen to be snapped to stationary ports
        var coll = this.copiedParts || this.draggedParts;
        var it = coll.iterator;
        while (it.next()) {
            var node1 = it.key;
            console.log("----------- > snapped node :" + node1);
            if (!(node1 instanceof go.Node)) continue;
            // connect all snapped ports of this NODE (yes, there might be more than one) with links
            var toport: any = null;

            var pit = node1.ports;
            while (pit.next()) {
                var port: any = pit.value;
                if (port.portId == 'B') {
                    console.log("----------- > snapped port :" + port.portId);
                    // maybe add a link -- see if the port is at another port that is compatible
                    var portPt = port.getDocumentPoint(go.Spot.Center);
                    console.log("portPt :" + portPt);

                    if (!portPt.isReal()) continue;
                    var nearbyports =
                        this.diagram.findObjectsNear(portPt, 50,
                            function (x) {  // some GraphObject at portPt
                                var o = x;
                                // walk up the chain of panels
                                while (o !== null && o.portId === null) o = o.panel;
                                return o;
                            },
                            function (p) {
                                // return true;
                                return tool.compatiblePorts(port, p);
                            });
                    console.log("----->");
                    console.log(nearbyports.count);
                    var toNode: any;
                    nearbyports.each(function (n) {
                        console.log(" fnode name :" + node1.data.name);
                        console.log(" tnode name :" + n.part.data.name);
                        console.log(" from port id :" + n.portId);
                        if ((node1.data.name == 'screwPump' || node1.data.name == 'plungerLift' || node1.data.name == 'pumpJack') && (n.part.data.name == 'oil' || n.part.data.name == 'gas') && n.portId == 'T') {
                            console.log(" r :" + n);
                            toport = n;
                            toNode = n.part;
                        }
                    });

                    if (toport != null) {
                        console.log(" r1 :" + node1);
                        console.log(" r2 :" + port.portId);
                        console.log(" r3 :" + toport.portId);
                        console.log(" r4 :" + toport.part);

                        if (toport.stroke == 'rgba(255, 0, 255, 1)' && port.stroke == 'rgba(255, 0, 255, 1)') {
                            this.diagram.toolManager.linkingTool.insertLink(node1, port, toport.part, toport);
                        }

                        toport.stroke = null;
                        port.stroke = null;

                        this.diagram.toolManager.linkingTool.insertLink(node1, port, toport.part, toport);
                        node1.findLinksConnected(port.portId).each(e => {
                            e.diagram.startTransaction("Changing lolipop");
                            e.diagram.model.setDataProperty(e.data, "category", "lollipop");
                            e.diagram.commitTransaction("Changing lolipop");
                        });

                        node1.findLinksTo(toNode).each(e => {
                            LollipopRoute.SnapRouteToStraight(e);
                        });
                    }
                }

            }
        }
    }
}


class ConnectLink {

    static dropOntoLink(diagram: go.Diagram, link: go.Link) {

        var tool = diagram.toolManager.linkingTool;
        var newnode = <go.Node>diagram.selection.first();
        var fromnode = link.fromNode;
        var fromport = link.fromPort;
        var tonode = link.toNode;
        var toport = link.toPort;
        console.log(newnode.category)

        // Add a new link to the new node
        diagram.remove(link);

        // data.toArrow = ""

        diagram.selection.first().data.fromArrow = ""

        console.log(diagram.selection.first().data)

        tool.insertLink(fromnode, fromport, newnode, newnode.port);
        tool.insertLink(newnode, newnode.port, tonode, toport);
        console.log(diagram.selection.first().data);


        //  Changing link arrows

        (<go.Node>diagram.selection.first().part).findLinksConnected().each(e => {
            console.log(e.data)
            diagram.startTransaction("caad");
            var link = e;
            diagram.model.setDataProperty(link.data, "fromArrow", "");
            diagram.model.setDataProperty(link.data, "toArrow", "");
            diagram.commitTransaction("caad");

        });
        //  diagram.rebuildParts();

        console.log("---------------")
    }

}