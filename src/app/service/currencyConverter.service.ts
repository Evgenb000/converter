import { Injectable } from '@angular/core';
import { Currency } from '../model/currency.model';

@Injectable({
  providedIn: 'root',
})
export class CurrencyConverterService {
  convertAmount(
    amount: number,
    fromCurrency: Currency,
    toCurrency: Currency
  ): number {
    if (fromCurrency.code === 'UAH') {
      return amount / (toCurrency?.rate || 1);
    } else if (toCurrency.code === 'UAH') {
      return amount * (fromCurrency?.rate || 1);
    } else {
      return (amount * toCurrency.rate) / fromCurrency.rate;
    }
  }
}
