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
        MatAutocompleteModule,
        MatSnackBarModule} from '@angular/material';

import { AppComponent } from './app.component';
import { ApiDetailsComponent } from './api-details/api-details.component';
import { HttpClientModule } from '@angular/common/http';
import { HighlightDirective } from './highlight.directive';
import { MenuComponent } from './menu/menu.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MenuContentComponent } from './menu/menu-content/menu-content.component';
import { SearchComponent } from './menu/search/search.component';
import { TestComponent } from './test/test.component';


@NgModule({
  declarations: [
    AppComponent,
    ApiDetailsComponent,
    HighlightDirective,
    MenuComponent,
    MenuContentComponent,
    SearchComponent,
    TestComponent
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
    ReactiveFormsModule,
    FormsModule,
    LayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
