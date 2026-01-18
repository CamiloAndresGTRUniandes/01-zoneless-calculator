import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Calculator } from './calculator';
import { signal } from '@angular/core';
import { Calculator as CalculatorService } from '../../services/calculator';
import { vi } from 'vitest';
import { CalculatorButton } from '../calculator-button/calculator-button';
import { By } from '@angular/platform-browser';

class CalulatorServiceMock {
  // Mock methods and properties as needed for testing
  resultText = signal(100);
  subResultText = signal(50);
  lastOperator = signal('/');
  buildNumber = vi.fn();
}

describe('Calculator', () => {
  let component: Calculator;
  let fixture: ComponentFixture<Calculator>;
  let calculatorServiceMock: CalulatorServiceMock;

  beforeEach(() => {
    calculatorServiceMock = new CalulatorServiceMock();
    TestBed.configureTestingModule({
      imports: [Calculator],
      providers: [
        {
          provide: CalculatorService,
          useValue: calculatorServiceMock,
        }
      ]
    });
    fixture = TestBed.createComponent(Calculator);
    component = fixture.componentInstance;
    fixture.detectChanges(); //Important to trigger ngOnInit and other lifecycle hooks
  });

  it('should create the calculator component', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial values from service', () => {
    expect(component.resultText()).toBe(100);
    expect(component.subResultText()).toBe(50);
    expect(component.lastOperator()).toBe('/');
  });

  it('should display values in the template', () => {
    calculatorServiceMock.resultText.set(200);
    calculatorServiceMock.subResultText.set(75);
    calculatorServiceMock.lastOperator.set('+');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('[test-id="result-text"]')?.textContent).toContain('200');
    expect(compiled.querySelector('[test-id="sub-result-text"]')?.textContent).toContain('75 +');
  });

  it('should call constructNumber when handleClick is called', () => {
    const buttonValue = '5';
    component.handleClick(buttonValue);
    expect(calculatorServiceMock.buildNumber).toHaveBeenCalledWith(buttonValue);
  });

  it('should handle keyboard events correctly', () => {
    const event = new KeyboardEvent('keyup', { key: '1' });
    document.dispatchEvent(event);

    expect(calculatorServiceMock.buildNumber).toHaveBeenCalledWith('1');
  });

  it('should handle special keyboard events (Enter -> =)', () => {
    const event = new KeyboardEvent('keyup', { key: 'Enter' });
    document.dispatchEvent(event);

    expect(calculatorServiceMock.buildNumber).toHaveBeenCalledWith('=');
  });

  it('should handle special keyboard events (Escape -> C)', () => {
    const event = new KeyboardEvent('keyup', { key: 'Escape' });
    document.dispatchEvent(event);

    expect(calculatorServiceMock.buildNumber).toHaveBeenCalledWith('C');
  });

  it('should call buildNumber on all buttons when button is clicked', () => {
    const buttons = fixture.debugElement.queryAll(By.directive(CalculatorButton));
    buttons.forEach((btn) => {
      btn.triggerEventHandler('onClick', 'C');
      expect(calculatorServiceMock.buildNumber).toHaveBeenCalledWith('C');
    });
    expect(calculatorServiceMock.buildNumber).toHaveBeenCalledTimes(buttons.length);
  });

  it('should update resultText signal when service updates', () => {
    calculatorServiceMock.resultText.set(300);
    fixture.detectChanges();
    expect(component.resultText()).toBe(300);
  });

  it('should have 19 calculator-button components with content projected', () => {
    const buttons = fixture.debugElement.queryAll(By.directive(CalculatorButton));
    expect(buttons.length).toBe(19);
    const buttonValues = buttons.map(btn => btn.nativeElement.textContent.trim());
    const expectedValues = [
      'C', '+/-', '%', '÷',
      '7', '8', '9', 'x',
      '4', '5', '6', '-',
      '1', '2', '3', '+',
      '0', '.', '='
    ];
    expect(buttonValues).toEqual(expectedValues);

    //Additional approach to check projected content
    const buttonElements = fixture.nativeElement.querySelectorAll('calculator-button');
    expect(buttonElements.length).toBe(19);
    const buttonTexts = Array.from(buttonElements).map((el: any) => el.textContent.trim());
    expect(buttonTexts).toEqual(expectedValues);
  });
});
