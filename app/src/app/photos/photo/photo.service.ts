import { HttpClient, HttpParams } from '@angular/common/http';
import { Photo } from './photo';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PhotoService {

    private API: string = 'http://localhost:3000';

    constructor(private http: HttpClient) { }

    listFromUser(userName: string) {
        return this.http
            .get<Photo[]>(this.API + `/${userName}/photos`)
    }

    listFromUserPaginated(userName: string, page: number) {
        const params = new HttpParams()
            .append('page', page.toString());

        return this.http
            .get<Photo[]>(this.API + '/' + userName + '/photos', { params: params });
    }
    
}