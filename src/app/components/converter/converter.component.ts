import { Component, OnInit } from '@angular/core';
import { Currency } from '../../model/currency.model';
import { CurrencyService } from '../../service/currency.service';
import { CommonModule, NgFor } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { UppercaseDirective } from '../../directives/upperCase.directive';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',

  imports: [
    NgFor,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    CommonModule,
    UppercaseDirective,
  ],
  standalone: true,
})
export class ConverterComponent implements OnInit {
  currencies: Currency[] = [];
  amountControl1 = new FormControl(1);
  currencyControl1 = new FormControl('');
  amountControl2 = new FormControl({ value: '', disabled: true });
  currencyControl2 = new FormControl('');
  filteredCurrencies1!: Observable<string[]>;
  filteredCurrencies2!: Observable<string[]>;

  constructor(private currencyService: CurrencyService) {}

  ngOnInit(): void {
    this.currencyService.getCurrencies().subscribe(
      (data) => {
        this.currencies = data;

        this.currencyControl1.setValue('USD');
        this.currencyControl2.setValue('UAH');

        this.filteredCurrencies1 = this.currencyControl1.valueChanges.pipe(
          startWith(''),
          map((value) => this._filter(value || ''))
        );

        this.filteredCurrencies2 = this.currencyControl2.valueChanges.pipe(
          startWith(''),
          map((value) => this._filter(value || ''))
        );

        this.updateAmount2();
      },
      (error) => {
        console.error('Error when receiving currency:', error);
      }
    );

    this.amountControl1.valueChanges.subscribe(() => this.updateAmount2());
    this.currencyControl1.valueChanges.subscribe(() => this.updateAmount2());
    this.currencyControl2.valueChanges.subscribe(() => this.updateAmount2());
  }

  private _filter(value: string): string[] {
    const filterValue = value.toUpperCase(); // Преобразование значения фильтра в верхний регистр
    return this.currencies
      .map((currency) => currency.code.toUpperCase()) // Преобразование всех кодов валют в верхний регистр
      .filter((code) => code.includes(filterValue));
  }

  private updateAmount2(): void {
    const amount1 = this.amountControl1.value;
    const currencyUpperCase1 = this.currencyControl1.value?.toUpperCase();
    const currencyUpperCase2 = this.currencyControl2.value?.toUpperCase();
    const currency1 = this.currencies.find(
      (currency) => currency.code === currencyUpperCase1
    );
    const currency2 = this.currencies.find(
      (currency) => currency.code === currencyUpperCase2
    );

    if (currency1 && currency2 && amount1) {
      if (currency1.code === 'UAH') {
        const count = this.currencies.find(
          (currency) =>
            currency.code === this.currencyControl2.value?.toUpperCase()
        )?.rate;
        this.amountControl2.setValue((count! * amount1).toFixed(2));
      } else if (currency2.code === 'UAH') {
        const count = this.currencies.find(
          (currency) =>
            currency.code === this.currencyControl1.value?.toUpperCase()
        )?.rate;
        this.amountControl2.setValue(((1 / count!) * amount1).toFixed(2));
      } else {
        const convertedAmount = (amount1 * currency2.rate) / currency1.rate;
        this.amountControl2.setValue(convertedAmount.toFixed(2));
      }
    } else {
      this.amountControl2.setValue('');
    }
  }

  swapCurrencies(): void {
    const currentCurrency1 = this.currencyControl1.value;
    const currentCurrency2 = this.currencyControl2.value;

    this.currencyControl1.setValue(currentCurrency2, { emitEvent: false });
    this.currencyControl2.setValue(currentCurrency1, { emitEvent: false });

    this.updateAmount2();
  }
}
