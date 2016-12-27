"use strict";
var LocationData = (function () {
    function LocationData(LocationId, TenantId, TenantName, DiagramId, DiagramName, NodeType, UWI, CreatedBy, ModifiedBy, CreatedDateTime, ModifiedDataTime, XCoordinate, YCoordinate, IsMissingField) {
        this.LocationId = LocationId;
        this.TenantId = TenantId;
        this.TenantName = TenantName;
        this.DiagramId = DiagramId;
        this.DiagramName = DiagramName;
        this.NodeType = NodeType;
        this.UWI = UWI;
        this.CreatedBy = CreatedBy;
        this.ModifiedBy = ModifiedBy;
        this.CreatedDateTime = CreatedDateTime;
        this.ModifiedDataTime = ModifiedDataTime;
        this.XCoordinate = XCoordinate;
        this.YCoordinate = YCoordinate;
        this.IsMissingField = IsMissingField;
    }
    LocationData.prototype.LocationData = function () { };
    return LocationData;
}());
exports.LocationData = LocationData;
//# sourceMappingURL=LocationData.js.map