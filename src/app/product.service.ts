import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpClient : HttpClient) { }

  getAllBundles() {
    return this.httpClient.get('/apigateway/bundles')
  }
}
