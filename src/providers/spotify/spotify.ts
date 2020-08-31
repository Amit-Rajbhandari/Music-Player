import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs";

@Injectable()
export class Spotify {
  static baseUrl: string = 'https://api.spotify.com/v1';

  constructor(public http: Http) {
    localStorage.setItem('limit', '50');
  }

  query(URL: string, params?: Array<string>): Observable<any[]> {
    let queryUrl = `${Spotify.baseUrl}${URL}`;
    let headers = new Headers();
    headers.append('Authorization', `Bearer BQCTBjUwwmJSFSswJCeuSQ2a3_4eq8AsegOX0WgU71ktyzno4JE4xsoNydUPnq7ziFQXTOWcjE462OgWvW1IN7BaynUsL7E6Tvihqr7yZvfDxEXR2-0QGXbvP1xvM7nHP1ydQONlJ2Hx1kj5byPYDOB_kRaVc9E`);
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');

    let options = new RequestOptions({ headers: headers });

    if (params) {
      queryUrl = `${queryUrl}?${params.join('&')}`;
    } else {
      queryUrl = `${queryUrl}`;
    }
    return this.http.get(queryUrl, options)
      .map(res => res.json());
  }

  //Search for an Item
  search(query: string, type: string, limit: string): Observable<any[]> {
    return this.query('/search', [
      `q=${query}`,
      `type=${type}`,
      `limit=${limit}`
    ]);
  }

  searchTracks(query: string, limit: string): Observable<any[]> {
    return this.search(query, 'track', limit);
  }

  //Get an Album
  getAlbum(id: string): Observable<any[]> {
    return this.query(`/albums/${id}`);
  }

  //Get List Of New Releases
  getLatestReleases() {
    return this.query(`/browse/new-releases`);
  }

  //Get List Of Featured Playlists
  getFeaturedPlaylists() {
    return this.query(`/browse/featured-playlists`);
  }

  //Get List Of Browse Categories
  getBrowseCategories() {
    return this.query(`/browse/categories`);
  }

  //Get a Single Browse Category
  getSingleBrowseCategories(id: string): Observable<any[]> {
    return this.query(`/browse/categories/${id}`);
  }

  //Get a Category's playlists
  getCategoriesPlaylists(id: string): Observable<any[]> {
    return this.query(`/browse/categories/${id}/playlists`);
  }

  //Get Available Genre Seeds
  getAvailableGenreSeeds() {
    return this.query(`/recommendations/available-genre-seeds`);
  }
}