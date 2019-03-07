import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
        MatSnackBarModule } from '@angular/material';

import { AppComponent } from './app.component';
import { ApiDetailsComponent } from './api-details/api-details.component';
import { HttpClientModule } from '@angular/common/http';
import { HighlightDirective } from './highlight.directive';
import { MenuComponent } from './menu/menu.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MenuContentComponent } from './menu/menu-content/menu-content.component';
import { SearchComponent } from './menu/search/search.component';
import { TestComponent } from './test/test.component';
import { HeadersFavComponent } from '../app/api-details/headers-fav/headers-fav.component';


@NgModule({
  declarations: [
    AppComponent,
    ApiDetailsComponent,
    HighlightDirective,
    MenuComponent,
    MenuContentComponent,
    SearchComponent,
    TestComponent,
    HeadersFavComponent
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
    ReactiveFormsModule,
    FormsModule,
    LayoutModule
  ],
  providers: [],
  entryComponents: [HeadersFavComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
