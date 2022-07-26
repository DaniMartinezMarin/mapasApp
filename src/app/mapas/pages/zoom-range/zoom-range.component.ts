import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [
    `
      .mapa-container {
        height: 100%;
        width: 100%;
      }

      .row {
        background-color: white;
        border-radius: 5px;
        position: fixed;
        bottom: 50px;
        left: 50px;
        padding: 10px;
        w-index: 999;
        width: 400px;
      }
    `
  ]
})
export class ZoomRangeComponent implements AfterViewInit, OnDestroy {

  @ViewChild('mapaZoom') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomMapa: number = 10;
  center: [number, number] = [-0.399907, 39.491633];

  constructor() { }

  ngAfterViewInit(): void {

    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomMapa
    });

    this.mapa.setMaxZoom(environment.MAX_ZOOM);

    //Zoom del mapa listener
    this.mapa.on('zoom', () => {
      this.zoomMapa = this.mapa.getZoom();
    });

    //Longitud y latitud del mapa listener
    this.mapa.on('move', () => {
      const {lng, lat} = this.mapa.getCenter();
      this.center = [ lng, lat ];
    });
  }

  ngOnDestroy(): void {
    this.mapa.off('zoom', () => {}); //Destruimos listener con el off
    this.mapa.off('move', () => {});
  }

  zoomOut() {
    this.mapa.zoomOut();
  }

  zoomIn() {
    this.mapa.zoomIn();
  }

  valueChanged( valor: string) {
    this.mapa.zoomTo(Number(valor));
  }

}
