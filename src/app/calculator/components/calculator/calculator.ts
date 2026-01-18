import { ChangeDetectionStrategy, Component, computed, inject, viewChildren } from '@angular/core';
import { CalculatorButton } from '../calculator-button/calculator-button';
import { Calculator as CalculatorService } from '../../services/calculator';
@Component({
  selector: 'calculator',
  imports: [CalculatorButton],
  templateUrl: './calculator.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keyup)': 'handleKeyboardEvent($event)',
  },
})
export class Calculator {
  private calculatorService = inject(CalculatorService);
  public calculatorButtons = viewChildren(CalculatorButton);

  // Accessor for result text signal
  // get resultText() {
  //   return this.calculatorService.resultText;
  // }
  public resultText = computed(() => this.calculatorService.resultText());
  public subResultText = computed(() => this.calculatorService.subResultText());
  public lastOperator = computed(() => this.calculatorService.lastOperator());

  handleClick(value: string) {
    this.calculatorService.buildNumber(value);
  }

  // @HostListener('document:keyup', ['$event'])

  // Handle keyboard events to trigger button clicks
  handleKeyboardEvent(event: KeyboardEvent) {
    //this.handleClick(event.key);
    const KeyEquivalents: Record<string, string> = {
      Enter: '=',
      Clear: 'C',
      Escape: 'C',
      '/': '÷',
      '*': '×'
    };
    const mappedKey = KeyEquivalents[event.key] ?? event.key;
    this.handleClick(mappedKey.toUpperCase());
    this.calculatorButtons().forEach((button) => {
      button.keyboardPressedStyle(mappedKey);
    });
  }
}
