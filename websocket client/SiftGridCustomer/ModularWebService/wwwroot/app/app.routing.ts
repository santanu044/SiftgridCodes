import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AreaComponent} from './area/area.component';
import {LocationComponent} from './location/location.component';
import {GroupsComponent} from './groups/groups.component';
import {PeopleComponent} from './people/people.component';
import {LeftToggleComponent} from './lefttoggle/lefttoggle.component';
import {DefaultComponent} from '../app/default.component';
import {DiagramComponent} from '../app/diagram/diagram.component';
const appRoutes: Routes = [
            { path: 'areas', component: AreaComponent },
            { path: 'locations', component: LocationComponent },
            { path: 'groups', component: GroupsComponent },
            { path: 'people', component: PeopleComponent },
            { path: '', component: DefaultComponent },
            { path: 'diagram', component: DiagramComponent },
];
export const appRoutingProviders: any[] = [

];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);