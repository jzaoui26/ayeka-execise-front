import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './_component/login/login.component';
import { APP_BASE_HREF } from '@angular/common';
import { MapComponent } from './_component/map/map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

@NgModule({
  declarations: [AppComponent, LoginComponent, MapComponent],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    LeafletModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: [''],
        disallowedRoutes: ['']
      }
    })
  ],
  bootstrap: [AppComponent],
  providers: [ { provide: APP_BASE_HREF, useValue: '' }] ,

})
export class AppModule {}
