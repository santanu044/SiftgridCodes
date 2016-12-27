"use strict";
var PortHelpers_1 = require('./PortHelpers');
var LollipopRoute = (function () {
    function LollipopRoute() {
    }
    LollipopRoute.prototype.LollipopRoute = function () {
    };
    LollipopRoute.SnapRouteToStraight = function (selectLink) {
        var points = new Array();
        if (selectLink.toNode != null) {
            var portLocation = PortHelpers_1.PortHelpers.GetPortLocation(selectLink.fromNode, selectLink.fromPort);
            var point = PortHelpers_1.PortHelpers.GetPortLocation(selectLink.toNode, selectLink.toPort);
            var portDirection = PortHelpers_1.PortHelpers.GetPortDirection(selectLink.toPort, selectLink.toNode.angle);
            var num = portLocation.x;
            var y = portLocation.y;
            if (portDirection == "L") {
                num = point.x - this.LollipopLength;
                y = point.y;
            }
            else if (portDirection == "R") {
                num = point.x + this.LollipopLength;
                y = point.y;
            }
            else if (!(portDirection == "T")) {
                num = point.x;
                y = point.y + this.LollipopLength;
            }
            else {
                num = point.x;
                y = point.y - this.LollipopLength;
            }
            var point1 = new go.Point(num, y);
            var num1 = portLocation.x;
            var location = selectLink.fromNode.location;
            var actualWidth = num1 - location.x;
            var y1 = portLocation.y;
            location = selectLink.fromNode.location;
            var actualHeight = y1 - location.y;
            if (selectLink.fromNode.locationSpot == go.Spot.Center) {
                actualWidth = actualWidth + selectLink.fromNode.width / 2;
                actualHeight = actualHeight + selectLink.fromNode.width / 2;
            }
            selectLink.fromNode.move(new go.Point(num - actualWidth, y - actualHeight));
        }
    };
    LollipopRoute.LollipopLength = 10;
    return LollipopRoute;
}());
exports.LollipopRoute = LollipopRoute;
//# sourceMappingURL=LollipopLink.js.map