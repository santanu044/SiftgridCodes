"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CustomLinkingTool = (function (_super) {
    __extends(CustomLinkingTool, _super);
    function CustomLinkingTool() {
        _super.call(this);
        this._isDragging = true;
        this.FromNode = null;
        this.IsDragging = this._isDragging;
        this.name = "CustomLinkingTool";
    }
    CustomLinkingTool.prototype.copyPortProperties = function (realnode, realport, tempnode, tempport, toend) {
        //    console.log(realport.portId)
        //  console.log(tempnode.portId)
        if (!this.isActive) {
            this.FromNode = this.originalFromNode;
        }
        this.toend = toend;
        _super.prototype.copyPortProperties.call(this, realnode, realport, tempnode, tempport, toend);
        if (realnode != null) {
            //	tempnode.set_RotationAngle(realnode.get_RotationAngle());
            //		Node.SetFromSpot(tempport, Node.GetFromSpot(realport));
            //		Node.SetToSpot(tempport, Node.GetToSpot(realport));
            tempnode.angle = realnode.angle;
            //	console.log(tempnode.fromSpot)
            //	console.log(realport.fromSpot)
            tempport.fromSpot = realport.fromSpot;
            tempport.toSpot = realport.toSpot;
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
                    this.ToPortPoint = this.temporaryLink.points.first();
                }
            }
            if ((realport.name == "L") ? false : !(realport.name == ("R"))) {
                this.PortAxis = "Y";
            }
            else {
                this.PortAxis = "X";
            }
        }
    };
    CustomLinkingTool.prototype.doActivate = function () {
        if (this.diagram.selection.first() instanceof go.Link) {
            this.diagram.selection.first().isSelected = false;
        }
        _super.prototype.doActivate.call(this);
        if (this.originalFromNode == null) {
            this.doCancel();
        }
    };
    CustomLinkingTool.prototype.doDeactivate = function () {
        _super.prototype.doDeactivate.call(this);
        this.FromNode = null;
        this.ToNode = null;
        //		super.temporaryLink = null;
        this.ToPortPoint = new go.Point();
    };
    CustomLinkingTool.prototype.doMouseDown = function () {
        this._isDragging = true;
        _super.prototype.doMouseDown.call(this);
    };
    CustomLinkingTool.prototype.isValidTo = function (tonode, toport) {
        var flag;
        if (tonode == null) {
            flag = _super.prototype.isValidTo.call(this, tonode, toport);
            return flag;
        }
        else if (!(this.originalFromNode == null ? false : this.originalFromNode != tonode)) {
            flag = false;
        }
        //	console.log(flag)
        return true;
    };
    CustomLinkingTool.prototype.SnapMouseToGrid = function () {
        var lastMousePointInModel = this.diagram.position;
        var x = lastMousePointInModel.x;
        if (this.diagram.position.x % 2 == 1) {
            lastMousePointInModel = this.diagram.position;
            x = lastMousePointInModel.x - 1;
        }
        lastMousePointInModel = this.diagram.position;
        ;
        var y = lastMousePointInModel.y;
        if (this.diagram.position.y % 2 == 1) {
            lastMousePointInModel = this.diagram.position;
            y = lastMousePointInModel.y - 1;
        }
        this.diagram.position = new go.Point(x, y);
    };
    CustomLinkingTool.prototype.doMouseMove = function () {
        this.SnapMouseToGrid();
        var toPortPoint = this.ToPortPoint;
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
        _super.prototype.doMouseMove.call(this);
        //	base.get_Diagram().get_Panel().DoAutoScroll(base.get_Diagram().get_LastMousePointInModel());
    };
    CustomLinkingTool.prototype.doStop = function () {
        //			base.get_Diagram().get_Panel().StopAutoScroll();
        _super.prototype.doStop.call(this);
    };
    CustomLinkingTool.prototype.IsValidFrom = function (fromnode, fromport) {
        var flag;
        if (fromnode == null) {
            flag = this.isValidFrom(fromnode, fromport);
            return flag;
        }
        return flag;
    };
    return CustomLinkingTool;
}(go.LinkingTool));
exports.CustomLinkingTool = CustomLinkingTool;
var PointHelpers = (function () {
    function PointHelpers() {
    }
    PointHelpers.GetDistanceBetweenPoints = function (pointA, pointB) {
        var num = Math.abs(pointA.x - pointB.x);
        var num1 = Math.abs(pointA.y - pointB.y);
        var num2 = Math.sqrt(num * num + num1 * num1);
        return num2;
    };
    return PointHelpers;
}());
//# sourceMappingURL=CustomLinkingTool.js.map