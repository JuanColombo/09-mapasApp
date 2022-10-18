import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface MarcadorColor{
  color:string;
  marker?:mapboxgl.Marker;
  centro?:[number,number]
}
@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [
    `
    .mapa-container{
      height : 100%;
      width:100%;
    }
    .list-group{
      position: fixed;
      top : 20px;
      right:20px;
      z-index:99;
    }
    li{
      cursor:pointer;
    }
    `
  ]
})
export class MarcadoresComponent implements AfterViewInit {
  mapa! : mapboxgl.Map;
  @ViewChild('mapa') divMapa! : ElementRef;
  zoomLevel : number = 15;
  center:[number,number]=[ -60.607397984943454,-30.79229446231602];

  //Arreglo de marcadores
  marcadores : MarcadorColor[] = [];

  constructor() { }
  ngAfterViewInit(): void {
  
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: this.center,
      zoom: this.zoomLevel
  });
  this.leerLS();

  //CODIGO PARA PERSONALIZAR MARCADORES
  // const markerHtml : HTMLElement = document.createElement('div');
  // markerHtml.innerHTML = 'Hola Mundo'

// new mapboxgl.Marker({
//   //element : markerHtml
// }).setLngLat(this.center)
//   .addTo(this.mapa);

  }

  irMarcador(marker:mapboxgl.Marker){
    this.mapa.flyTo({
      center : marker.getLngLat(),
      zoom : 15
    })
  }

  agregarMarcador(){
    const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));
    const nuevoMarcador = new mapboxgl.Marker({
      draggable : true,
      color
    })
    .setLngLat(this.center)
    .addTo(this.mapa);

    this.marcadores.push({
      color,
      marker:nuevoMarcador
    });
    this.guardarMarcadoresLS();
    nuevoMarcador.on('dragend',()=>{
      this.guardarMarcadoresLS();
    })
  }

  guardarMarcadoresLS(){
    const lngLatArr: MarcadorColor[] = []

    this.marcadores.forEach(m =>{
      const color = m.color;
      const { lng , lat } = m.marker!.getLngLat();

      lngLatArr.push({
        color:m.color,
        centro: [lng,lat]
      })
    })
    localStorage.setItem('marcadores', JSON.stringify(lngLatArr) )
  }

  leerLS(){
    if(!localStorage.getItem('marcadores')){
      return;
  }
    const lngLatArr : MarcadorColor[]= JSON.parse(localStorage.getItem('marcadores')!);
    lngLatArr.forEach(m=>{
      const newMarker = new mapboxgl.Marker({
        color: m.color,
        draggable:true
      })
      .setLngLat(m.centro!)
      .addTo(this.mapa)
      this.marcadores.push({
        marker : newMarker,
        color:m.color
      });

      newMarker.on('dragend',()=>{
        this.guardarMarcadoresLS();
      })
    })

  }
  borrarMarcador(i : number){
    this.marcadores[i].marker?.remove();
    this.marcadores.splice(i,1);
    this.guardarMarcadoresLS();
  }
}
