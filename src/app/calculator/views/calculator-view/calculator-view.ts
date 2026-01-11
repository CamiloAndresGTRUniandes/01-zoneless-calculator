import { Calculator } from '@/calculator/components/calculator/calculator';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'calculator-view',
  imports: [Calculator],
  templateUrl: './calculator-view.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CalculatorView { }
