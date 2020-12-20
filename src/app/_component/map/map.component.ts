import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {AuthService} from '../../_services/auth.service';
import * as L from 'leaflet';
import { icon, latLng, marker, tileLayer, Map } from 'leaflet';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  mapLeaflet: Map;

  // Define our base layers so we can reference them multiple times
  streetMaps = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    detectRetina: true,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });
  wMaps = L.tileLayer('http://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {
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

  public optionsMap: any = {};

  public deviceArr: any = [];

  public interval;

  constructor(private authService: AuthService,  private http: HttpClient) {}

  onMapReady(map: L.Map): void {
    this.mapLeaflet = map;
  }

  ngOnInit() {



    this.optionsMap = {
      layers: [ this.streetMaps ],
      zoom: 10,
      center: L.latLng([ 31.911, 35.0519 ])
    };

    this.http.get<any>('api/sites.php').subscribe(data => {
         let i, objMarker, latitude, longitude, dataFinal, identifier;

         dataFinal = data.data;

         for (i = 0; i < dataFinal.length; i++)
         {
           identifier = dataFinal[i].id
           latitude = +dataFinal[i].latitude;
           longitude = +dataFinal[i].longitude;

           // obj marker
           objMarker =  marker([ latitude, longitude ], this.iconBase).bindPopup('text', {className: 'popupCl'});

           // push
           this.deviceArr.push(objMarker);

           this.deviceArr[i]._leaflet_id = identifier;
         }
      }
    );

    this.interval = setInterval(() =>
    {
      this.lastSample(); // api call
    }, 10000);


  }

  lastSample() {
    this.http.get<any>('api/last_sample.php').subscribe(data => {

         this.mapLeaflet.panTo([ 32, 355])
         this.deviceArr[1]._popup._content = 'djdjdj';
         this.deviceArr[1].openPopup();
      }
    );
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
