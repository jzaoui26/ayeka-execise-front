import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../_services/auth.service';
import { icon, latLng, marker, tileLayer } from 'leaflet';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  // Define our base layers so we can reference them multiple times
  streetMaps = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    detectRetina: true,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });
  wMaps = tileLayer('http://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {
    detectRetina: true,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  iconBase = {
    icon: icon({
      iconSize: [ 25, 41 ],
      iconAnchor: [ 13, 41 ],
      iconUrl: 'leaflet/marker-icon.png',
      shadowUrl: 'leaflet/marker-shadow.png'
    })
  };


  // Layers control object with our two base layers and the three overlay layers
  layersControl = {
    baseLayers: {
      'Street Maps': this.streetMaps,
      'Wikimedia Maps': this.wMaps
    }
  };

  optionsMap: any = {};

  deviceArr: any = [];

  constructor(private authService: AuthService,  private http: HttpClient) {}

  ngOnInit() {

    this.optionsMap = {
      layers: [ this.streetMaps ],
      zoom: 10,
      center: latLng([ 31.911, 35.0519 ])
    };

    this.http.get<any>('api/sites.php').subscribe(data => {
         let i, objMarker, latitude, longitude, dataFinal;

         dataFinal = data.data;

         for (i = 0; i < dataFinal.length; i++)
         {
           latitude = +dataFinal[i].latitude;
           longitude = +dataFinal[i].longitude;

           // obj marker
           objMarker =  marker([ latitude, longitude ], this.iconBase);

           // push
           this.deviceArr.push(objMarker);
         }
      }
    );
  }



  logout() {
    this.authService.logout();
  }

}
