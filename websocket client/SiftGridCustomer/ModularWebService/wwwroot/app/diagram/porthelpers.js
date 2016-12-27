"use strict";
var PortHelpers = (function () {
    function PortHelpers() {
    }
    PortHelpers.GetPortLocation = function (node, port) {
        console.log(node);
        return node.getDocumentPoint(port.fromSpot);
    };
    PortHelpers.GetPortDirection = function (port, rotation) {
        var str;
        var name = port.portId;
        if ((name == null ? true : name == "")) {
        }
        console.log(name);
        if (name == "L") {
            if (rotation == 90) {
                str = "T";
            }
            else if (rotation != 180) {
                str = (rotation != 270 ? "L" : "B");
            }
            else {
                str = "R";
            }
        }
        else if (name == "R") {
            if (rotation == 90) {
                str = "B";
            }
            else if (rotation != 180) {
                str = (rotation != 270 ? "R" : "T");
            }
            else {
                str = "L";
            }
        }
        else if (name == "T") {
            if (rotation == 90) {
                str = "R";
            }
            else if (rotation != 180) {
                str = (rotation != 270 ? "T" : "L");
            }
            else {
                str = "B";
            }
        }
        else if (!(name == "B")) {
            str = name.toString();
        }
        else if (rotation == 90) {
            str = "L";
        }
        else if (rotation != 180) {
            str = (rotation != 270 ? "B" : "R");
        }
        else {
            str = "T";
        }
        return str;
    };
    return PortHelpers;
}());
exports.PortHelpers = PortHelpers;
//# sourceMappingURL=porthelpers.js.map