import { HttpClient, HttpParams } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { RESOURCE_CACHE_PROVIDER } from '@angular/platform-browser-dynamic';
import { Gifs, GifsResponse } from '../interface/gifs.interface';

@Injectable({
  // Con esto ya no necesita agregar en la sección providers en un módulo, y vuelve de forma globar al servicio
  providedIn: 'root'    
})
export class GifsService {
  private apiKey: string = 'zA9gwfQXD8snmwZCVtJPlvfp60oa8TLM';
  private servicioUrl: string = 'https://api.giphy.com/v1/gifs';
  private _historial: string[] = [];
  public resultados: Gifs[] = [];
  get historial() {
    return [...this._historial];
  }

  constructor( private http: HttpClient) {
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    this.resultados = JSON.parse(localStorage.getItem('resultados')!) || [];

  }

  buscarGifs( query: string) {
    query = query.trim().toLocaleLowerCase();
    // si no incluye el elemento, inserta el elemento
    if (! this._historial.includes( query )) {
      
      // unshift -> agrega el elemento al inicio del arreglo
      this._historial.unshift( query );
      // recorta el array considerando los elementos del 0 al 10
      this._historial = this._historial.splice(0,10);

      localStorage.setItem('historial', JSON.stringify(this._historial) );
    }
    
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', query);

    this.http.get<GifsResponse>(`${ this.servicioUrl }/search`, { params })
    .subscribe( (resp) => {
      this.resultados = resp.data;
      localStorage.setItem('resultados', JSON.stringify(this.resultados) );
    });
    
  }
}
