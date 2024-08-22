import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
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
    if (this.currencies.length > 0) {
      return of(this.currencies);
    }

    return this.http.get<any>(this.apiUrl).pipe(
      map((response) => this.transformCurrencyData(response)),
      catchError((error) => {
        console.error('Error when receiving currency:', error);
        return of([]);
      })
    );
  }

  private transformCurrencyData(response: any): Currency[] {
    const data = response.uah;
    if (data) {
      this.currencies = Object.keys(data).map((key) => ({
        code: key.toUpperCase(),
        rate: data[key],
      }));
      return this.currencies;
    }
    return [];
  }
}
