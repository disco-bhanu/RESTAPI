import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {A11yModule} from '@angular/cdk/a11y';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
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
        MatRadioModule} from '@angular/material';

import { AppComponent } from './app.component';
import { ApiDetailsComponent } from './api-details/api-details.component';
import { HttpClientModule } from '@angular/common/http';
import { MenuComponent } from './menu/menu.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MenuContentComponent } from './menu/menu-content/menu-content.component';
import { SearchComponent } from './menu/search/search.component';
import { HeadersFavComponent } from '../app/api-details/headers-fav/headers-fav.component';
import { ToolbarComponent } from '../app/toolbar/toolbar.component';
import { ServersListComponent } from '../app/servers-list/servers-list.component';
import { StoreModule } from '@ngrx/store';
import { appReducer } from './store/app.reducer';


@NgModule({
  declarations: [
    AppComponent,
    ApiDetailsComponent,
    MenuComponent,
    MenuContentComponent,
    SearchComponent,
    HeadersFavComponent,
    ToolbarComponent,
    ServersListComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'restapi'}),
    BrowserAnimationsModule,
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
    ReactiveFormsModule,
    FormsModule,
    LayoutModule,
    A11yModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    StoreModule.forRoot({appr: appReducer})
  ],
  providers: [],
  entryComponents: [HeadersFavComponent, ServersListComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
