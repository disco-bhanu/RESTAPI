import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TabsModule,
          ModalModule,
          TypeaheadModule,
          TooltipModule,
          BsDropdownModule,
          AlertModule } from 'ngx-bootstrap';
import { StoreModule } from '@ngrx/store';
import { appReducer } from './store/app.reducer';

import { AppComponent } from './app.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { SearchComponent } from './search/search.component';
import { MenuComponent } from './menu/menu.component';
import { ContentComponent } from './content/content.component';
import { ApiDetailsComponent } from './api-details/api-details.component';
import { ServerNamesComponent } from './server-names/server-names.component';
import { GlobalHeadersComponent } from './global-headers/global-headers.component';
import { EditServicesComponent } from './edit-services/edit-services.component';
import { NotifierComponent } from './notifier/notifier.component';
import { SaveServiceComponent } from './save-service/save-service.component';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    SearchComponent,
    MenuComponent,
    ContentComponent,
    ApiDetailsComponent,
    ServerNamesComponent,
    GlobalHeadersComponent,
    EditServicesComponent,
    NotifierComponent,
    SaveServiceComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    HttpClientModule,
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    TypeaheadModule.forRoot(),
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot(),
    AlertModule.forRoot(),
    StoreModule.forRoot({appStore: appReducer})
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [ServerNamesComponent, GlobalHeadersComponent, EditServicesComponent, NotifierComponent, SaveServiceComponent]
})
export class AppModule { }
