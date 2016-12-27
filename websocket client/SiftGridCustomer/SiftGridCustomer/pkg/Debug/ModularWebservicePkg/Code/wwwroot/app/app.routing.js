"use strict";
var router_1 = require('@angular/router');
var area_component_1 = require('./area/area.component');
var location_component_1 = require('./location/location.component');
var groups_component_1 = require('./groups/groups.component');
var people_component_1 = require('./people/people.component');
var default_component_1 = require('../app/default.component');
var diagram_component_1 = require('../app/diagram/diagram.component');
var appRoutes = [
    { path: 'areas', component: area_component_1.AreaComponent },
    { path: 'locations', component: location_component_1.LocationComponent },
    { path: 'groups', component: groups_component_1.GroupsComponent },
    { path: 'people', component: people_component_1.PeopleComponent },
    { path: '', component: default_component_1.DefaultComponent },
    { path: 'diagram', component: diagram_component_1.DiagramComponent },
];
exports.appRoutingProviders = [];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
//# sourceMappingURL=app.routing.js.map