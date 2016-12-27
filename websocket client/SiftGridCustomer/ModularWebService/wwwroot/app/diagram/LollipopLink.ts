import {PortHelpers} from './PortHelpers';

export class LollipopRoute {
    private static LollipopLength = 10;

    public LollipopRoute() {
    }



    public static SnapRouteToStraight(selectLink: go.Link) {
        var points = new Array<go.Point>();
        if (selectLink.toNode != null) {

            var portLocation = PortHelpers.GetPortLocation(selectLink.fromNode, selectLink.fromPort);
            var point = PortHelpers.GetPortLocation(selectLink.toNode, selectLink.toPort);
            var portDirection = PortHelpers.GetPortDirection(selectLink.toPort, selectLink.toNode.angle);

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

        }
    }