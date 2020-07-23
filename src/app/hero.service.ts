import { Injectable } from '@angular/core';
import {Hero} from './heroes/hero';
import {HEROES} from "./heroes/mock-heroes";
import {Observable, of} from "rxjs";
import {MessageService} from "./message.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, tap} from "rxjs/operators";

/**
 * Service to get hero data
 */
@Injectable({
  providedIn: 'root'
})
export class HeroService {
  //injecting message service in this service which injects it into the hero component
  constructor(
    private messageService: MessageService,
    private http: HttpClient
  ) { }

  // private heroesUrl = 'api/heroes';
    private heroesUrl = 'http://localhost:3000/heroes';

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  getHero(id: number): Observable<Hero> {


    return of(HEROES.find(hero => hero.id === id))
      .pipe(
        tap(_=> this.log(`fetched hero ${id}`)),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  /**
   * Uses
   * @param hero to update
   */
  updateHero(hero: Hero): Observable<any> {
    const url = `${this.heroesUrl}/${hero.id}`;
    return this.http.put(url, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  //http post
  // addHero(hero:Hero):Observable<Hero>{
  //   return this.http.post<Hero>(`${this.heroesUrl}${hero.id}`,hero,this.httpOptions)
  //     .pipe(tap((newHero:Hero) => this.log(`added hero w/ id=:${hero.id}`)),
  //       catchError(this.handleError<Hero>('addHero')))
  // }

  addHero(hero:Hero):Observable<Hero>{
    return this.http.post<Hero>(`${this.heroesUrl}`,hero,this.httpOptions)
      .pipe(tap((newHero:Hero) => this.log(`added hero w/ id=:${hero.id}`)),
        catchError(this.handleError<Hero>('addHero')))
  }

  /** DELETE: delete the hero from the server */
  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

}
