import { Component, OnInit } from '@angular/core';
import { Currency } from '../../model/currency.model';
import { CurrencyService } from '../../service/currency.service';
import { CommonModule, NgFor } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  imports: [
    NgFor,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    CommonModule,
  ],
  standalone: true,
})
export class ConverterComponent implements OnInit {
  currencies1: Currency[] = [];
  currencyControl = new FormControl('');
  filteredCurrencies!: Observable<string[]>;

  constructor(private currencyService: CurrencyService) {}

  ngOnInit(): void {
    this.currencyService.getCurrencies().subscribe(
      (data) => {
        this.currencies1 = data;
        console.log(this.currencies1);

        this.filteredCurrencies = this.currencyControl.valueChanges.pipe(
          startWith(''),
          map((value) => this._filter(value || ''))
        );
      },
      (error) => {
        console.error('Ошибка при получении валют:', error);
      }
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.currencies1
      .map((currency) => currency.code) // Извлекаем только коды валют
      .filter((code) => code.toLowerCase().includes(filterValue));
  }
}
