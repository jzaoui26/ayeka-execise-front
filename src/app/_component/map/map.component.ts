import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {AuthService} from '../../_services/auth.service';
import * as L from 'leaflet';
import { icon, latLng, marker, tileLayer, Map } from 'leaflet';
import { HttpClient } from '@angular/common/http';
import {LatLngExpression} from 'leaflet';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  public mapLeaflet: Map;

  public deviceArr: any = [];
  public deviceDataArr: any = [];

  public intervalLastSample;
  public waitTimeLastSampleMs: number = 10000;

  // map config
  public optionsMap: any = {};
  public zoomBase: number = 8;
  public centerLatLng:LatLngExpression = [ 31, 35.0519 ];

  public deviceInProgress: any;

  // Define our base layers
  streetMaps = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
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
      'Street Maps': this.streetMaps
    }
  };


  constructor(private authService: AuthService,  private http: HttpClient) {}

  onMapReady(map: L.Map): void {
    this.mapLeaflet = map;
  }

  ngOnInit() {

    this.optionsMap = {
      layers: [ this.streetMaps ],
      zoom: this.zoomBase,
      center: L.latLng(this.centerLatLng)
    };

    this.http.get<any>('api/sites').subscribe(data => {
         let i, objMarker, latitude, longitude, dataFinal, identifier, titlePopup;

         dataFinal = data.data;

         // loop
         for (i = 0; i < dataFinal.length; i++)
         {
           // values
           identifier = dataFinal[i].id
           titlePopup = dataFinal[i].displayName

           latitude   = +dataFinal[i].latitude;
           longitude  = +dataFinal[i].longitude;

           // obj marker
           objMarker =  marker([ latitude, longitude ], this.iconBase).bindPopup(titlePopup, {className: 'popupCl'});

           // push
           this.deviceArr.push(objMarker);
           this.deviceDataArr.push(dataFinal[i]);

           this.deviceArr[i]._leaflet_id = identifier;
         }
      }
    );

    // last sample
    this.intervalLastSample = setInterval(() =>
    {
      this.lastSample(); // api call
    }, this.waitTimeLastSampleMs);

  }


  lastSample() {
    this.http.get<any>('api/last_sample').subscribe(data => {
         let i, dataFinal, latitude, longitude, titlePopup, s, sampleArr;
         let sampleHtml = ''

         dataFinal = data.data;

         // loop
         for (i = 0; i < this.deviceArr.length; i++)
         {
           // find the good device
           if (dataFinal.deviceId == this.deviceArr[i]._leaflet_id)
           {
             this.deviceInProgress = this.deviceArr[i]

             // invalide refresh
             this.mapLeaflet.invalidateSize(true);

             // center base
             this.mapLeaflet.setView(this.centerLatLng, this.zoomBase)

             // view with wait for effect
             setInterval(() =>
             {
                 // invalide refresh
                 this.mapLeaflet.invalidateSize(true);

                 this.mapLeaflet.setView(this.deviceInProgress._latlng, this.zoomBase + 1)
             }, 500);

             // title
             titlePopup = this.deviceDataArr[i].displayName

             // sample
             sampleArr = dataFinal.sample

             // sample
             for (s = 0; s < sampleArr.length; s++)
             {

               sampleHtml += '<div class="row">\n' +
                     '            <div class="col-6">' +
                     '            ' +sampleArr[s].displayName +
                     '            </div>' +
                     '            <div class="col-4">' +
                     '            ' +sampleArr[s].value + sampleArr[s].units +
                     '            </div>' +
                               '</div>' ;
             }

             this.deviceInProgress._popup._content =
               '<div class="row">\n' +
               '            <div class="col-12 titlePopup">' +
               '            ' +titlePopup+
               '            </div>' +
               '</div>' +
               sampleHtml

             this.deviceInProgress.openPopup();

             return true;
           }

         }
      }
    );
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    if (this.intervalLastSample) {
      clearInterval(this.intervalLastSample);
    }
  }
}
