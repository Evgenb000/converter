import { Component, OnInit } from '@angular/core';
import { Currency } from '../../model/currency.model';
import { CurrencyService } from '../../service/currency.service';
import { CommonModule, NgFor } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { debounceTime, map, startWith, switchMap } from 'rxjs/operators';
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
  currencyControl1 = new FormControl('USD');
  amountControl2 = new FormControl(1);
  currencyControl2 = new FormControl('UAH');
  filteredCurrencies1!: Observable<string[]>;
  filteredCurrencies2!: Observable<string[]>;

  private isInternalUpdate = false;

  constructor(private currencyService: CurrencyService) {}

  ngOnInit(): void {
    this.currencyService.getCurrencies().subscribe(
      (data) => {
        this.currencies = data;

        this.filteredCurrencies1 = this.currencyControl1.valueChanges.pipe(
          startWith(''),
          map((value) => this._filter(value || ''))
        );

        this.filteredCurrencies2 = this.currencyControl2.valueChanges.pipe(
          startWith(''),
          map((value) => this._filter(value || ''))
        );

        this.amountControl1.valueChanges.subscribe(() =>
          this.handleAmount1Change()
        );
        this.amountControl2.valueChanges.subscribe(() =>
          this.handleAmount2Change()
        );
        this.currencyControl1.valueChanges.subscribe(() =>
          this.handleCurrency1Change()
        );
        this.currencyControl2.valueChanges.subscribe(() =>
          this.handleCurrency2Change()
        );

        this.updateAmount2();
      },
      (error) => console.error('Error when receiving currency:', error)
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toUpperCase();
    return this.currencies
      .map((currency) => currency.code.toUpperCase())
      .filter((code) => code.includes(filterValue));
  }

  private handleAmount1Change(): void {
    if (this.isInternalUpdate) return;

    this.isInternalUpdate = true;
    this.updateAmount2();
    this.isInternalUpdate = false;
  }

  private handleAmount2Change(): void {
    if (this.isInternalUpdate) return;

    this.isInternalUpdate = true;
    this.updateAmount1();
    this.isInternalUpdate = false;
  }

  private handleCurrency1Change(): void {
    if (this.isInternalUpdate) return;

    this.isInternalUpdate = true;
    this.updateAmount2();
    this.isInternalUpdate = false;
  }

  private handleCurrency2Change(): void {
    if (this.isInternalUpdate) return;

    this.isInternalUpdate = true;
    this.updateAmount1();
    this.isInternalUpdate = false;
  }

  private updateAmount1(): void {
    const amount = this.amountControl2.value;
    const currencyCode1 = this.currencyControl1.value ?? '';
    const currencyCode2 = this.currencyControl2.value ?? '';
    const currency1 = this.getCurrency(currencyCode1);
    const currency2 = this.getCurrency(currencyCode2);

    if (currency1 && currency2 && amount) {
      let convertedAmount: number;

      if (currency1.code === 'UAH') {
        convertedAmount = amount / (currency2?.rate || 1);
      } else if (currency2.code === 'UAH') {
        convertedAmount = amount * (currency1?.rate || 1);
      } else {
        convertedAmount = (amount * currency2.rate) / currency1.rate;
      }

      this.amountControl1.setValue(Number(convertedAmount.toFixed(2)), {
        emitEvent: false,
      });
    } else {
      this.amountControl1.setValue(0, { emitEvent: false });
    }
  }

  private updateAmount2(): void {
    const amount = this.amountControl1.value;
    const currencyCode1 = this.currencyControl1.value ?? '';
    const currencyCode2 = this.currencyControl2.value ?? '';
    const currency1 = this.getCurrency(currencyCode1);
    const currency2 = this.getCurrency(currencyCode2);

    if (currency1 && currency2 && amount) {
      let convertedAmount: number;

      if (currency1.code === 'UAH') {
        convertedAmount = amount * (currency2?.rate || 1);
      } else if (currency2.code === 'UAH') {
        convertedAmount = amount / (currency1?.rate || 1);
      } else {
        convertedAmount = (amount * currency2.rate) / currency1.rate;
      }

      this.amountControl2.setValue(Number(convertedAmount.toFixed(2)), {
        emitEvent: false,
      });
    } else {
      this.amountControl2.setValue(0, { emitEvent: false });
    }
  }

  private getCurrency(code: string): Currency | undefined {
    return this.currencies.find(
      (currency) => currency.code.toUpperCase() === code.toUpperCase()
    );
  }

  swapCurrencies(): void {
    const currentCurrency1 = this.currencyControl1.value;
    const currentCurrency2 = this.currencyControl2.value;

    this.currencyControl1.setValue(currentCurrency2, { emitEvent: false });
    this.currencyControl2.setValue(currentCurrency1, { emitEvent: false });

    this.updateAmount2();
  }
}
