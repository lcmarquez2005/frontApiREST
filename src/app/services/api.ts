import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ApiObject {
  id?: string;
  name: string;
  data?: {
    age: number;
    email: string;
  };
}

@Injectable({ providedIn: 'root' })
export class ApiService {

  private baseUrl = '/api/collections';
  private collectionName = 'useas'; // Replace with your collection name
  private apiKey = '37c17213-5e4d-445e-bf90-a86ea400dd70'; // Replace with your API key

  constructor(private http: HttpClient) {}


  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'x-api-key': this.apiKey
    });
  }

  getAll(): Observable<ApiObject[]> {
    return this.http.get<ApiObject[]>(
      `${this.baseUrl}/${this.collectionName}/objects`,
      { headers: this.getHeaders() }
    )
  }

  getById(id: string): Observable<ApiObject> {
    return this.http.get<ApiObject>(
      `${this.baseUrl}/${this.collectionName}/objects/${id}`,
      { headers: this.getHeaders() }
    )

  }

  create(body: ApiObject): Observable<ApiObject> {
    return this.http.post<ApiObject>(
      `${this.baseUrl}/${this.collectionName}/objects`,
      body,
      { headers: this.getHeaders() }
    )

  }

  update(id: string, body: ApiObject): Observable<ApiObject> {
    return this.http.put<ApiObject>(
      `${this.baseUrl}/${this.collectionName}/objects/${id}`,
      body,
      { headers: this.getHeaders() }
    )

  }

  partialUpdate(id: string, body: Partial<ApiObject>): Observable<ApiObject> {
    return this.http.patch<ApiObject>(
      `${this.baseUrl}/${this.collectionName}/objects/${id}`,
      body,
      { headers: this.getHeaders() }
    )

  }

  delete(id: string): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}/${this.collectionName}/objects/${id}`,
      { headers: this.getHeaders() }
    )

  }
}