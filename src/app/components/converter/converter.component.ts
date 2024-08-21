import { Component, OnInit } from '@angular/core';
import { Currencies } from '../../model/currencies.model';
import { CurrencyService } from '../../service/currency.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  imports: [NgFor],
  standalone: true,
})
export class ConverterComponent implements OnInit {
  currencies: Currencies[] = [];
  constructor(private currencyService: CurrencyService) {}

  ngOnInit(): void {
    this.currencyService.getCurrencies().subscribe(
      (data) => {
        this.currencies = data;
      },
      (error) => {
        console.error('Ошибка при получении валют:', error);
      }
    );
  }
}
