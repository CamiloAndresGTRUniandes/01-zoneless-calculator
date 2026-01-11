import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { CalculatorButton } from '../calculator-button/calculator-button';

@Component({
  selector: 'calculator',
  imports: [CalculatorButton],
  templateUrl: './calculator.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keyup)' : 'handleKeyboardEvent($event)',
  },
})
export class Calculator {
  handleClick(value: string) {
    console.log(`Button clicked: ${value}`);
  }

  // @HostListener('document:keyup', ['$event'])

  // Handle keyboard events to trigger button clicks
  handleKeyboardEvent(event: KeyboardEvent) {
    this.handleClick(event.key);
  }

}
