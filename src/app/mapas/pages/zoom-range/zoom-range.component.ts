import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from "mapbox-gl";

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [
    `
    .mapa-container{
      height : 100%;
      width:100%;
    }
    .row{
      background-color:white;
      position:fixed;
      bottom:50px;
      left:50px;
      padding:10px;
      border-radius:5px;
      z-index:999;
      width:400px
    }
    `
  ]
})
export class ZoomRangeComponent implements AfterViewInit, OnDestroy {

  mapa! : mapboxgl.Map;
  @ViewChild('mapa') divMapa! : ElementRef;
  zoomLevel : number = 12;
  center:[number,number]=[ -60.607397984943454,-30.79229446231602];

  constructor() { }

  ngOnDestroy(): void {
    this.mapa.off('zoom', ()=>{});
    this.mapa.off('zoomend', ()=>{});
    this.mapa.off('move', ()=>{});
  }
  
  ngAfterViewInit(): void {

    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: this.center,
      zoom: this.zoomLevel
  });

    this.mapa.on('zoom',()=>{
      this.zoomLevel= this.mapa.getZoom();
    })
    
    
    this.mapa.on('zoomend',()=>{
      if(this.mapa.getZoom() > 18){
        this.mapa.zoomTo(18);
      }
    });

    //Movimiento del mapa
    this.mapa.on('move', (event) =>{
      const target = event.target;
      const {lng, lat} = target.getCenter();
      this.center  = [lng,lat]
    })

  }

  zoomIn(){
    this.mapa.zoomIn();

  }
  zoomOut(){
    this.mapa.zoomOut();

    
  }
  zoomCambio(valor: string){
    this.mapa.zoomTo(Number (valor))
  }

}
