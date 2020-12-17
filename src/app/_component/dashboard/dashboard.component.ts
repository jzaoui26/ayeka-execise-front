// dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  model: any = {};

  dataFromServer: any = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.getSomePrivateStuff();
  }

  getSomePrivateStuff() {
    this.model.action = 'stuff';
    this.authService.getData(this.model).subscribe(
      response => {
        if (response.status === 'success') {
          this.dataFromServer = response['data']['Coords'];
        }
      },
      error => {
        this.authService.logout();
      }
    );
  }

  logout() {
    this.authService.logout();
  }
}
