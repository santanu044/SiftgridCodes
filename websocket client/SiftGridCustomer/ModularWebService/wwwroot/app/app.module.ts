import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }   from './app.component';
import {CompanyComponent} from './company/company.component'
import {AuthenticatedHttpService} from './auth/AuthenticatedHttpService';
import { AuthHelperBase} from './auth/AuthHelperBase';
import {AzureADAuthHelper} from './auth/AzureADAuthHelper';
import {Authenticator} from './auth/Authenticator';
import {ServiceConstants} from './auth/ServiceConstants';
import {PasswordResetComponent} from './passwordreset/password-reset.component';
import {FindCompanyComponent} from './findcompany/find-company.component';
import {SignInComponent} from './signin/signin.component';
import {Reminder} from './reminder/reminder.component';
import { ReactiveFormsModule} from '@angular/forms';
import { RouterModule, Routes}   from '@angular/router';
import {HttpModule, JsonpModule} from '@angular/http';

import { UIBackgroundComponent } from './UIBackground/UIBackground.component';
import { HeaderComponent } from './Header/header.component';
import {EnterprisePaneComponent} from './EnteprisePane/enterprise.component';
import {LeftSidebarComponent} from './leftsidebar/leftsidebar.component';
import {RightSidebarComponent} from './rightsidebar/rightsidebar.component';
import {FooterComponent} from './footer/footer.component';
import {SiftGridButtonComponent} from './siftgridbutton/siftgridbutton.component';
import {EnterpriseButtonComponent} from './enterprisebutton/enterprisebutton.component';
import {DrawingButtonComponent} from './drawingbutton/drawingbutton.component';
import {EntepriseHeaderComponent} from './enterpriseheader/enterpriseheader.component';
import {AreaButtonComponent} from './areabutton/areabutton.component';
import {LocationsButtonComponent} from './locationbutton/locationbutton.component';
import {GroupsButtonComponent} from './groupbutton/groupbutton.component';
import {PeopleButtonComponent} from './peoplebutton/peoplebutton.component';
import {VolumetricsButtonComponent} from './volumetricbutton/volumetricbutton.component';
import {InfoButtonComponent} from './infobutton/infobutton.component';
import {PerspectivesButtonComponent} from './perspectivesbutton/perspectivesbutton.component';
import {NotesButtonComponent} from './notesbutton/notesbutton.component';
import {ChatButtonComponent} from './chatbutton/chatbutton.component';
import {DocumentsButtonComponent} from './documentationbutton/documentationbutton.component';
import {ErrorsButtonComponent} from './errorbutton/errorbutton.component';
import {FuelConsumersButtonComponent} from './fuelconsumersbutton/fuelconsumersbutton.component';
import {InfoPerspectivesPaneComponent} from './infoperspectivespane/infoperspectivespane.component';
import {DocumentationPaneComponent} from './documentationpane/documentationpane.component';
import {HeaderSeachboxComponent} from './headersearchbox/headersearchbox.component';
import {DiagramAreaComponent} from './diagramarea/diagramarea.component';
import {ErrorPaneComponent} from './errorpane/errorpane.component';
import {FuelConsumersPaneComponent} from './fuelconsumerspane/fuelconsumerspane.component';
import {MapButtonComponent} from './mapbutton/mapbutton.component';
import {DashboardButtonComponent} from './dashboardbutton/dashboardbutton.component';
import {AreaComponent} from './area/area.component';
import {AreaService} from './area/areaService';
import {SearchService} from './search/searchService';
import {DiagramComponent} from './diagram/diagram.component';
import {DiagramService} from './diagram/diagramService';
import {PeopleComponent} from './people/people.component';
import {PeopleService} from './people/peopleService'
import {NotesService} from './notes/notesService'
import {NotesComponent} from './notes/notes.component'
import {ErrorService} from './errorpane/errorService'
import {PaletteComponent} from './palette/palette.component'
import {SearchComponent} from './search/search.component'
import {AreaPaletteComponent} from './areapalette/areapalette.component'
import {PaletteButtonComponent} from './palettebutton/palettebutton.component';
import {ProfileNotificationIconComponent} from './profilenotification/profilenotificationicon.component'
import {ProfileNameComponent} from './profilename/profilename.component'
import {ProfileAvatarComponent} from './profileavatar/profileavatar.component'
import {UserProfileComponent} from './userprofile/userprofile.component'
import { FormsModule } from "@angular/forms";
import {LocationTree} from './locationtree/locationtree.component';
import {DateComponent} from './datepicker/date.component';
import {TimeMachineService} from './datepicker/TimeMachineService';
import {AspectRatioService} from './aspectratiocalculation/AspectRatioService'
import {NewAreaPaletteComponent} from './NewAreaPallet/newareapalette.component';
import {AreaPalletCategoryComponent} from './AreapalletHeaders/areapalletcategory.component';
import {AreaCrossButtonComponent} from './AreapalletHeaders/areapalletcrossbutton.component';
import {AreaPalletHeaderComponent} from './AreapalletHeaders/areapalletheader.component';
import {AreaPalletHeaderSubTextComponent} from './AreapalletHeaders/areapalletheadersubtext.component';
import {AreaPalletHeaderTextComponent} from './AreapalletHeaders/areapalletheadertext.component';
import {PeoplePaletteComponent} from './peoplepallete/peoplepalette.component';
import {PeopleCrossButtonComponent} from './peoplepallete/crossbutton.component';
import {PeopleHeaderComponent} from './peoplepallete/header.component';
import {PeopleHeaderSubTextComponent} from './peoplepallete/headersubtext.component';
import {PeopleHeaderTextComponent} from './peoplepallete/headertext.component';
import {PeopleCategoryComponent} from './peoplepallete/peoplecategory.component';
import { ChatService} from './websocket/chat.service';
import {WebSocketService } from './websocket/websocket.service';
var azureADAuthHelper = new AzureADAuthHelper(new ServiceConstants("ba1c6ed5-9779-46a7-ac42-7ddcc5c878d2", "bsift.siftgrid.com", "http://dev3.centralus.cloudapp.azure.com:8080/"));

var authenticator = new Authenticator(azureADAuthHelper);
function authenticatorFactory() {
    return authenticator;
}
@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        JsonpModule
      ]
        ,
  declarations: [
      AppComponent,
      CompanyComponent,
      FindCompanyComponent,
      SignInComponent,
      PasswordResetComponent,
      Reminder,
    UIBackgroundComponent,
    HeaderComponent,
    LeftSidebarComponent,
    EnterprisePaneComponent,
    RightSidebarComponent,
    FooterComponent,
    SiftGridButtonComponent,
    EnterpriseButtonComponent,
    DrawingButtonComponent,
    EntepriseHeaderComponent,
    AreaButtonComponent,
    LocationsButtonComponent,
    GroupsButtonComponent,
    PeopleButtonComponent,
    VolumetricsButtonComponent,
    InfoButtonComponent,
    PerspectivesButtonComponent,
    NotesButtonComponent,
    ChatButtonComponent,
    DocumentsButtonComponent,
    ErrorsButtonComponent,
    FuelConsumersButtonComponent,
    InfoPerspectivesPaneComponent,
    DocumentationPaneComponent,
    HeaderSeachboxComponent,
    DiagramAreaComponent,
    ErrorPaneComponent,
    FuelConsumersPaneComponent,
    MapButtonComponent,
      DashboardButtonComponent,
      AreaComponent,
      DiagramComponent,
      PeopleComponent,
      PaletteComponent,
      AreaPaletteComponent, NotesComponent,
      PaletteButtonComponent,
      ProfileNotificationIconComponent,
      ProfileNameComponent,
      ProfileAvatarComponent,
      UserProfileComponent,
      LocationTree,
      DateComponent,
      NewAreaPaletteComponent,
      PeoplePaletteComponent
    ],
    bootstrap: [AppComponent],
  providers: [
      AspectRatioService,
      AreaService,
      SearchService,
      DiagramService,
      PeopleService,
      NotesService,
      ErrorService,
      ChatService,
      WebSocketService,
      AuthenticatedHttpService, TimeMachineService,
      { provide: Authenticator, useFactory: authenticatorFactory }
  ]
})
export class AppModule { }