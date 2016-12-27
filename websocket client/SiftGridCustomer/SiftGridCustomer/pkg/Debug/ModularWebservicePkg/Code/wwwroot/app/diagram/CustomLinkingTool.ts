

export class CustomLinkingTool extends go.LinkingTool {
    constructor() {
        super();
        this.name = "CustomLinkingTool";

    }


    private _isDragging = true;

    public FromNode: go.Node = null;

    public IsDragging = this._isDragging

    private PortAxis: string

    private toend: boolean

    public ToNode: go.Node

    private ToPortPoint: go.Point


    public copyPortProperties(realnode: go.Node, realport: go.GraphObject, tempnode: go.Node, tempport: go.Node, toend: boolean) {
        //    console.log(realport.portId)
        //  console.log(tempnode.portId)

        if (!this.isActive) {
            this.FromNode = this.originalFromNode;
        }
        this.toend = toend;
        super.copyPortProperties(realnode, realport, tempnode, tempport, toend);
        if (realnode != null) {
            //	tempnode.set_RotationAngle(realnode.get_RotationAngle());
            //		Node.SetFromSpot(tempport, Node.GetFromSpot(realport));
            //		Node.SetToSpot(tempport, Node.GetToSpot(realport));
            tempnode.angle = realnode.angle
            //	console.log(tempnode.fromSpot)
            //	console.log(realport.fromSpot)

            tempport.fromSpot = realport.fromSpot
            tempport.toSpot = realport.toSpot
            //			console.log(tempnode.fromSpot)
            //	console.log(realport.fromSpot)
            tempport.name = realport.name;
            if (!toend) {
                this.FromNode = realnode;
            }
            else if (realnode != this.FromNode) {
                this.ToNode = realnode;
            }
            if (this.temporaryLink == null ? false : this.temporaryLink.points != null) {


                if (!toend ? false : this.ToNode != null) {
                    this.ToPortPoint = this.temporaryLink.points.first()
                }
            }
            if ((realport.name == "L") ? false : !(realport.name == ("R"))) {

                this.PortAxis = "Y";
            }
            else {
                this.PortAxis = "X";
            }
        }
    }

    public doActivate() {
        if (this.diagram.selection.first() instanceof go.Link) {
            this.diagram.selection.first().isSelected = false;
            //		this.diagram.selection = null;
        }
        super.doActivate();
        if (this.originalFromNode == null) {
            this.doCancel();
        }
    }

    public doDeactivate() {
        super.doDeactivate();
        this.FromNode = null;
        this.ToNode = null;
        //		super.temporaryLink = null;
        this.ToPortPoint = new go.Point();
    }

    public doMouseDown() {
        this._isDragging = true;
        super.doMouseDown();

    }


    public isValidTo(tonode: go.Node, toport: go.GraphObject) {
        var flag: boolean;
        if (tonode == null) {
            flag = super.isValidTo(tonode, toport);
            return flag;
        }
        else if (!(this.originalFromNode == null ? false : this.originalFromNode != tonode)) {
            flag = false;
        }

        //	console.log(flag)

        return true;
    }

    private SnapMouseToGrid() {
        var lastMousePointInModel: go.Point = this.diagram.position;
        var x: number = lastMousePointInModel.x;
        if (this.diagram.position.x % 2 == 1) {
            lastMousePointInModel = this.diagram.position;
            x = lastMousePointInModel.x - 1;
        }
        lastMousePointInModel = this.diagram.position;;
        var y = lastMousePointInModel.y;
        if (this.diagram.position.y % 2 == 1) {
            lastMousePointInModel = this.diagram.position;
            y = lastMousePointInModel.y - 1;
        }
        this.diagram.position = new go.Point(x, y);
    }

    public doMouseMove() {
        this.SnapMouseToGrid();

        var toPortPoint: go.Point = this.ToPortPoint;
        if (toPortPoint != null) {
            if (!toPortPoint.equals(new go.Point())) {
                if (PointHelpers.GetDistanceBetweenPoints(this.ToPortPoint, this.diagram.position) > this.portGravity) {
                    this.temporaryToPort.name = "";
                    this.ToNode = null;
                    toPortPoint = new go.Point();
                    this.ToPortPoint = toPortPoint;
                    ///this.diagram.panel.doc .DoAutoScroll(base.get_Diagram().get_LastMousePointInModel());
                    this.doMouseMove();
                    //			base.get_Diagram().get_Panel().DoAutoScroll(base.get_Diagram().get_LastMousePointInModel());
                    return;
                }
                return;
            }
        }
        //		base.get_Diagram().get_Panel().DoAutoScroll(base.get_Diagram().get_LastMousePointInModel());
        super.doMouseMove();
        //	base.get_Diagram().get_Panel().DoAutoScroll(base.get_Diagram().get_LastMousePointInModel());
    }



    public doStop() {
        //			base.get_Diagram().get_Panel().StopAutoScroll();
        super.doStop();
    }

    public IsValidFrom(fromnode: go.Node, fromport: go.GraphObject) {
        var flag: boolean;
        if (fromnode == null) {
            flag = this.isValidFrom(fromnode, fromport);
            return flag;
        }

        return flag;
    }






}


class PointHelpers {
    public static GetDistanceBetweenPoints(pointA: go.Point, pointB: go.Point) {
        var num = Math.abs(pointA.x - pointB.x);
        var num1 = Math.abs(pointA.y - pointB.y);
        var num2 = Math.sqrt(num * num + num1 * num1);
        return num2;
    }

}
