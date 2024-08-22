import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Currency } from '../../model/currency.model';
import { CurrencyService } from '../../service/currency.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [RouterLink, RouterLinkActive, NgIf],
  standalone: true,
})
export class HeaderComponent implements OnInit {
  uahToEur: string | null = null;
  uahToUsd: string | null = null;
  a = 1;
  b = 2;
  c = 3;

  constructor(private currencyService: CurrencyService) {}

  ngOnInit(): void {
    this.currencyService.getCurrencies().subscribe(
      (data: Currency[]) => {
        const usdRate = data.find((currency) => currency.code === 'usd')?.rate;
        const eurRate = data.find((currency) => currency.code === 'eur')?.rate;
        if (usdRate) {
          this.uahToUsd = `1 USD = ${(1 / usdRate).toFixed(2)} UAH`;
        } else {
          this.uahToUsd = 'Exchange rates not available';
        }

        if (eurRate) {
          this.uahToEur = `1 EUR = ${(1 / eurRate).toFixed(2)} UAH`;
        } else {
          this.uahToEur = 'Exchange rates not available';
        }
      },
      (error) => {
        console.error('Error when receiving currencies:', error);
        this.uahToEur = 'Error loading data';
        this.uahToUsd = 'Error loading data';
      }
    );
  }
}
