import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { tap, catchError, map } from 'rxjs/operators'
import { User } from './providers';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';


@Injectable()
export class GenericHttpProvider {
    headers: HttpHeaders;
    contentType: string;
   
    constructor(
        private http: Http,
        private httpClient: HttpClient,
        private user: User) {
    }

    /*private setHeaders(isAuthRequest: boolean): boolean {
        if(isAuthRequest) {
            if(!this.user.authenticated()) 
            {
                return false;       
            }
            this.headers = new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + this.user._user.result.accessToken
            });
            return true;
        }
    }   

    genericPostRequest(url: string, postData?: any, isAuthRequest: boolean = true): Observable<any> {
        if(!this.setHeaders(isAuthRequest)){
            return new ErrorObservable('Invalid requerst');
        }

        const _options: any = {
            method: 'post',
            headers: this.headers
        }; 
        return this.httpClient.post(url, JSON.stringify(postData), _options)
            .pipe(
                tap((response: any) => {
                    return response;
                }),
                catchError(this.handleError)
            );
    }

    genericGetRequest(url: string, isAuthRequest: boolean = true): Observable<any> {
        if(!this.setHeaders(isAuthRequest)){
            return new ErrorObservable('Invalid requerst Get');
        } 
        const _options: any = {
            method: 'get',
            headers: this.headers
        };
        return this.httpClient.get(url, _options)
            .pipe(
                tap((response: any) => {
                    return response;
                }),
                catchError(this.handleError)
            );
    }

    private handleError(err: HttpErrorResponse): ErrorObservable {
        let errorMessage: string; 
        const error = err.error;
        if (err.error instanceof ErrorEvent) {
            errorMessage = `An error occurred: ${err.error.message}`;
        } else {
            errorMessage =  `${error["error"].message}`;
        }
        console.error(err);
        return new ErrorObservable(errorMessage);
    }*/
}