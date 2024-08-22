import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  catchError,
  combineLatest,
  map,
  of,
} from 'rxjs';
import { Currency } from '../model/currency.model';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private apiUrl =
    'https://latest.currency-api.pages.dev/v1/currencies/uah.json';
  private currencies: Currency[] = [];

  constructor(private http: HttpClient) {}

  getCurrencies(): Observable<Currency[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((response) => {
        const data = response.uah;
        if (data) {
          return Object.keys(data).map((key) => ({
            code: key,
            rate: data[key],
          }));
        } else {
          return [];
        }
      }),
      catchError((error) => {
        console.error('Ошибка при получении валют:', error);
        return of([]);
      })
    );
  }
}
