import { Injectable, signal } from '@angular/core';

const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const operators = ['+', '-', '×', '÷'];
const specialOperators = ['C', '=', '.', '+/-', '%', 'Backspace'];
// Calculator service to perform calculations - global singleton
@Injectable({
  providedIn: 'root'
})
export class Calculator {

  public resultText = signal('1234');
  public subResultText = signal('0');
  public lastOperator = signal('+');

  public buildNumber(value: string): void {
    //input validation
    if (![...numbers, ...operators, ...specialOperators].includes(value)) return;

    // Clear all
    if (value === 'C') {
      this.clearAll();
      return;
    }

    // Delete last entry
    if (value === 'Backspace') {
      this.deleteLastEntry(value);
      return;
    }


    if (value === '=') {
      //this.calculateResult();
      return;
    }
    //Apply operator
    if (operators.includes(value)) {
      //validate if last character is .
      if (this.resultText().endsWith('.')) return;
      this.lastOperator.set(value);
      this.subResultText.set(this.resultText());
      this.resultText.set('0');
      return;
    }

    //Limit input lenght
    if (this.resultText().length >= 10) return;

    //validate decimal point
    if (value === '.' && !this.resultText().includes('.')){
      this.resultText.update(current => current + '.');
      return;
    }
  }

  private clearAll(): void {
    this.resultText.set('0');
    this.subResultText.set('0');
    this.lastOperator.set('+');
  }

  private deleteLastEntry(value: string): void {
    const current = this.resultText();
    if (current === '0') return;
    if (current.length === 1) {
      this.resultText.set('0');
      return;
    } else {
      this.resultText.update(current =>
        current.slice(0, -1)
      );
      return;
    }

  }
}
