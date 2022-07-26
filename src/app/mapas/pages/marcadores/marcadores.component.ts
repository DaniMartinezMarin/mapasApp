import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface MarcadorPersonalizado {
  color: string;
  marker: mapboxgl.Marker;
}

interface MarcadorLocalStorage {
  color: string;
  latitud: number;
  longitud: number;
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
export class MarcadoresComponent implements AfterViewInit {

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

    this.getMarkersFromLocalStorage();
  }

  createMarker(marcador?: MarcadorLocalStorage): void {
    const esMarcadorNuevo = marcador === undefined;
    const colorMarcador : string = esMarcadorNuevo ? this.generateRandomColor() : marcador!.color;
    const centroMarcador: [number, number] = esMarcadorNuevo ? this.center: [marcador!.longitud, marcador!.latitud];

    const newMarker = new mapboxgl.Marker({
      draggable: true,
      color: colorMarcador
    })
      .setLngLat(centroMarcador)
      .addTo(this.mapa)

    this.markerList.push({
      color: colorMarcador,
      marker: newMarker
    });

    newMarker.on('dragend', () => {
      this.guardarMarcadoresLocalStorage();
    })

    if(esMarcadorNuevo)
      this.guardarMarcadoresLocalStorage();
  }

  goToMarker(marker: mapboxgl.Marker) {
    const coordinates = marker.getLngLat();
    this.mapa.flyTo({
      center: coordinates,
      zoom: 15
    });
  }

  guardarMarcadoresLocalStorage() {

    const marcadorLocalStorage: MarcadorLocalStorage[] = this.markerList
      .map( (marcadorPersonalizado) => {
        return {
          color: marcadorPersonalizado.color,
          latitud: marcadorPersonalizado.marker.getLngLat().lat,
          longitud: marcadorPersonalizado.marker.getLngLat().lng
        }
      } );

    localStorage.setItem('marcadores',  JSON.stringify(marcadorLocalStorage));
  }

  getMarkersFromLocalStorage() {

    const marcadoresItem = localStorage.getItem('marcadores');
    if(marcadoresItem !== null)
    {
      const marcadoresLocalStorage: MarcadorLocalStorage[] = JSON.parse(marcadoresItem);

      marcadoresLocalStorage.forEach( marcador => this.createMarker(marcador) );
    }
  }

  borrarMarcador( indice: number ) {
    this.markerList[indice].marker.remove();
    this.markerList.splice(indice, 1);
    this.guardarMarcadoresLocalStorage();
  }

  generateRandomColor(): string {
    return "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));
  }

}
