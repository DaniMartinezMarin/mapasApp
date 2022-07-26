import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface MarcadorPersonalizado {
  color: string;
  marker: mapboxgl.Marker;
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [
    `
      .mapa-container {
        height: 100%;
        width: 100%;
      }

      .list-group {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 99;
      }

      li {
        cursor: pointer;
      }
    `
  ]
})
export class MarcadoresComponent implements  AfterViewInit {

  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomMapa: number = 10;
  center: [number, number] = [-0.399907, 39.491633];

  markerList: MarcadorPersonalizado[] = [];

  constructor() { }

  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomMapa
    });

  }

  createMarker( ): void {

    const randomColor = this.generateRandomColor();
    const newMarker = new mapboxgl.Marker({
      draggable: true,
      color: randomColor
    })
      .setLngLat(this.center)
      .addTo(this.mapa);

    this.markerList.push({
      color: randomColor,
      marker: newMarker
    });
  }

  goToMarker(markerIndex: number) {

    const coordinates = this.markerList[markerIndex].marker.getLngLat();
    this.mapa.panTo(coordinates);
  }

  generateRandomColor(): string {
    return "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));
  }



}
