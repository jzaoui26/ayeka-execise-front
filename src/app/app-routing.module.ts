// app-routing.module.ts
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './_guards/auth.guard';
import { LoginComponent } from './_component/login/login.component';
import { MapComponent } from './_component/map/map.component';

const routes: Routes = [
  {
    path: 'map',
    canActivate: [AuthGuard],
    component: MapComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
