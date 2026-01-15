import { Injectable, signal } from '@angular/core';

const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const operators = ['+', '-', '×', '÷', '%'];
const specialOperators = ['C', '=', '.', '+/-', 'Backspace'];
// Calculator service to perform calculations - global singleton
@Injectable({
  providedIn: 'root',
})
export class Calculator {
  public resultText = signal('0');
  public subResultText = signal('0');
  public lastOperator = signal('+');

  public buildNumber(value: string): void {
    //input validation
    if (![...numbers, ...operators, ...specialOperators].includes(value)) return;

    // Clear all
    if (value.toUpperCase() === 'C') {
      this.clearAll();
      return;
    }

    // Delete last entry
    if (value === 'Backspace') {
      this.deleteLastEntry(value);
      return;
    }
    // Calculate result
    if (value === '=') {
      this.calculateResult();
      return;
    }

    //Apply operator
    if (operators.includes(value)) {
      this.calculateResult();
      this.applyOperator(value);
      return;
    }

    //Limit input lenght
    if (this.resultText().length >= 10) return;

    //validate decimal point
    if (value === '.' && !this.resultText().includes('.')) {
      this.resultText.update((current) => current + '.');
      return;
    }

    // handle initial zero
    if (value === '0' && (this.resultText() === '0' || this.resultText() === '-0')) {
      return;
    }

    //toggle positive/negative
    if (value === '+/-') {
      this.toogleSign();
      return;
    }

    //Build number
    if (numbers.includes(value)) {
      this.buildFinalNumber(value);
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
    if (this.resultText().includes('-') && current.length === 2) {
      this.resultText.set('0');
      return;
    }
    if (current.length === 1) {
      this.resultText.set('0');
      return;
    } else {
      this.resultText.update((current) => current.slice(0, -1));
      return;
    }
  }

  private calculateResult(): void {
    const subResult = parseFloat(this.subResultText());
    const currentResult = parseFloat(this.resultText());
    let finalResult = 0;
    switch (this.lastOperator()) {
      case '+':
        finalResult = subResult + currentResult;
        break;
      case '-':
        finalResult = subResult - currentResult;
        break;
      case '×':
        finalResult = subResult * currentResult;
        break;
      case '÷':
        finalResult = subResult / currentResult;
        break;
      case '%':
        finalResult = (subResult * currentResult) / 100;
        break;
    }
    this.resultText.set(finalResult.toString().slice(0, 10));
    this.subResultText.set('0');
  }

  private applyOperator(value: string): void {
    //validate if last character is .
    if (this.resultText().endsWith('.')) return;
    this.lastOperator.set(value);
    this.subResultText.set(this.resultText());
    this.resultText.set('0');
  }

  private toogleSign(): void {
    const current = this.resultText();
    if (current === '0') return;
    if (current.startsWith('-')) {
      this.resultText.set(current.slice(1));
    } else {
      this.resultText.set('-' + current);
    }
    return;
  }
  private buildFinalNumber(value: string): void {
    const current = this.resultText();
    if (current === '0' || current === '-0') {
      if (current.startsWith('-')) {
        this.resultText.set('-' + value);
      } else {
        this.resultText.set(value);
      }
    } else {
      this.resultText.update((current) => current + value);
    }
  }
}
