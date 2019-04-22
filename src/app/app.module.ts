import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatSidenavModule,
  MatListModule,
  MatIconModule,
  MatToolbarModule,
  MatSelectModule,
  MatMenuModule,
  MatTabsModule,
  MatGridListModule,
  MatDividerModule,
  MatTooltipModule,
  MatAutocompleteModule,
  MatDialogModule,
  MatSnackBarModule,
  MatCheckboxModule,
  MatTableModule,
  MatRippleModule,
  MatRadioModule} from '@angular/material';

import { AppComponent } from './app.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ServersListComponent } from './servers-list/servers-list.component';
import { SearchComponent } from './search/search.component';
import { NotifierComponent } from './notifier/notifier.component';
import { MenuComponent } from './menu/menu.component';
import { MenuContentComponent } from './menu/menu-content/menu-content.component';
import { GlobalHeadersComponent } from './global-headers/global-headers.component';
import { ApiDetailsComponent } from './api-details/api-details.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SaveServiceComponent } from './save-service/save-service.component';

import { StoreModule } from '@ngrx/store';
import { appReducer } from './store/app.reducer';
import { EditServicesComponent } from './edit-services/edit-services.component';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    ServersListComponent,
    SearchComponent,
    NotifierComponent,
    MenuComponent,
    MenuContentComponent,
    GlobalHeadersComponent,
    ApiDetailsComponent,
    SaveServiceComponent,
    EditServicesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatSelectModule,
    MatMenuModule,
    MatTabsModule,
    MatDividerModule,
    MatGridListModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatDialogModule,
    MatCheckboxModule,
    MatTableModule,
    MatRadioModule,
    MatRippleModule,
    MatMenuModule,
    StoreModule.forRoot({appStore: appReducer})
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    GlobalHeadersComponent,
    ServersListComponent,
    NotifierComponent,
    SaveServiceComponent,
    EditServicesComponent
  ]
})
export class AppModule { }
