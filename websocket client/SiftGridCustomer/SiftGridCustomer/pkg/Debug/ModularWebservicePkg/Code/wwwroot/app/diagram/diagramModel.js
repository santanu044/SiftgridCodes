"use strict";
var DiagramData = (function () {
    function DiagramData() {
        this.JobID = '';
        this.Title = '';
        this.DrawingNo = '';
        this.DrawnBy = '';
        this.Date = '';
        this.Company = { 'type': 'select', 'value': ['Siftgrid', 'Bizruntime'] };
        this.Owner = '';
        this.LSD = '';
        this.Field = '';
        this.Facility = '';
        this.Subtype = '';
        this.Comment = '';
    }
    return DiagramData;
}());
exports.DiagramData = DiagramData;
//# sourceMappingURL=diagramModel.js.map