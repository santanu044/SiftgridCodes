"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var ServiceConstants = (function () {
    function ServiceConstants(clientID, tenantID, redirectURL, 
        // public graphResource = "https://graph.microsoft.com"
        graphResource) {
        if (graphResource === void 0) { graphResource = "https://graph.windows.net"; }
        this.clientID = clientID;
        this.tenantID = tenantID;
        this.redirectURL = redirectURL;
        this.graphResource = graphResource;
    }
    ServiceConstants = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [String, String, String, Object])
    ], ServiceConstants);
    return ServiceConstants;
}());
exports.ServiceConstants = ServiceConstants;
//# sourceMappingURL=ServiceConstants.js.map