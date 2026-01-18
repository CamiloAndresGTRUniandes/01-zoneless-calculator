import { TestBed } from '@angular/core/testing';
import { Calculator as CalculatorService } from './calculator';
import { vi } from 'vitest';

describe('CalculatorService', () => {
  let service: CalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalculatorService);

    vi.resetAllMocks();
  });

  it('should create the calculator service', () => {
    expect(service).toBeTruthy();
  });

  it('should be created with default values', () => {
    expect(service.resultText()).toBe('0');
    expect(service.subResultText()).toBe('0');
    expect(service.lastOperator()).toBe('+');
  });

  it('should set resultText, subResultText to "0" when C is pressed', () => {
    service.buildNumber('C');
    expect(service.resultText()).toBe('0');
    expect(service.subResultText()).toBe('0');
  });

  it('should update resultText with number input', () => {
    service.buildNumber('5');
    expect(service.resultText()).toBe('5');
    service.buildNumber('3');
    expect(service.resultText()).toBe('53');
  });

  it('should handle operators correctly', () => {
    service.buildNumber('2');
    service.buildNumber('+');
    service.buildNumber('3');
    service.buildNumber('=');
    expect(service.resultText()).toBe('5');
    expect(service.subResultText()).toBe('0');
    expect(service.lastOperator()).toBe('+');
  });

  it('should calculate result correctly for addition', () => {
    service.buildNumber('7');
    service.buildNumber('+');
    service.buildNumber('8');
    service.buildNumber('=');
    expect(service.resultText()).toBe('15');
    expect(service.subResultText()).toBe('0');
    expect(service.lastOperator()).toBe('+');
  });

  it('should calculate result correctly for subtraction', () => {
    service.buildNumber('9');
    service.buildNumber('-');
    service.buildNumber('4');
    service.buildNumber('=');
    expect(service.resultText()).toBe('5');
    expect(service.subResultText()).toBe('0');
    expect(service.lastOperator()).toBe('-');
  });

  it('should calculate result correctly for multiplication', () => {
    service.buildNumber('6');
    service.buildNumber('×');
    service.buildNumber('7');
    service.buildNumber('=');
    expect(service.resultText()).toBe('42');
    expect(service.subResultText()).toBe('0');
    expect(service.lastOperator()).toBe('×');
  });

  it('should calculate result correctly for division', () => {
    service.buildNumber('8');
    service.buildNumber('÷');
    service.buildNumber('2');
    service.buildNumber('=');
    expect(service.resultText()).toBe('4');
    expect(service.subResultText()).toBe('0');
    expect(service.lastOperator()).toBe('÷');
  });

  it('should handle decimal point correctly', () => {
    service.buildNumber('3');
    service.buildNumber('.');
    service.buildNumber('1');
    service.buildNumber('4');
    expect(service.resultText()).toBe('3.14');
  });

  it('should handle decimal point starting with 0', () => {
    service.buildNumber('.');
    service.buildNumber('7');
    expect(service.resultText()).toBe('0.7');
  });

  it('should handle sign change +/-', () => {
    service.buildNumber('5');
    service.buildNumber('+/-');
    expect(service.resultText()).toBe('-5');
    service.buildNumber('+/-');
    expect(service.resultText()).toBe('5');
  });

  it('should handle backspace', () => {
    service.buildNumber('1');
    service.buildNumber('2');
    service.buildNumber('3');
    expect(service.resultText()).toBe('123');
    service.buildNumber('Backspace');
    expect(service.resultText()).toBe('12');
    service.buildNumber('Backspace');
    expect(service.resultText()).toBe('1');
    service.buildNumber('Backspace');
    expect(service.resultText()).toBe('0');
  });

  it('should handle backspace with negative numbers', () => {
    service.buildNumber('1');
    service.buildNumber('2');
    service.buildNumber('+/-');
    expect(service.resultText()).toBe('-12');
    service.buildNumber('Backspace');
    expect(service.resultText()).toBe('-1');
    service.buildNumber('Backspace');
    expect(service.resultText()).toBe('0');
  });

  it('should handle max length', () => {
    //spy on console.log
    const consoleSpy = vi.spyOn(console, 'log');
    //mock implementation to avoid actual logging
    consoleSpy.mockImplementation(() => { });

    for (let i = 0; i < 12; i++) {
      service.buildNumber('9');
    }
    expect(service.resultText()).toBe('9999999999');
    expect(service.resultText().length).toBe(10);
    expect(consoleSpy).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledTimes(0);
  });

  it('should handle invalid input', () => {
    //spy on console.log
    const consoleSpy = vi.spyOn(console, 'log');
    service.buildNumber('A');
    expect(service.resultText()).toBe('0');
    expect(consoleSpy).toHaveBeenCalledWith('Invalid input:', 'A');
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });

  it('should handle negative zero input correctly', () => {
    service.buildNumber('0');
    service.buildNumber('+/-');
    expect(service.resultText()).toBe('0');
  });

  it('should not allow multiple decimal points', () => {
    service.buildNumber('4');
    service.buildNumber('.');
    service.buildNumber('5');
    service.buildNumber('.');
    expect(service.resultText()).toBe('4.5');
  });

  it('should handle sequential operations', () => {
    service.buildNumber('2');
    service.buildNumber('+');
    service.buildNumber('3');
    service.buildNumber('×');
    service.buildNumber('4');
    service.buildNumber('=');
    expect(service.resultText()).toBe('20');
    expect(service.subResultText()).toBe('0');
    expect(service.lastOperator()).toBe('×');
  });

  it('should handle division by zero', () => {
    service.buildNumber('8');
    service.buildNumber('÷');
    service.buildNumber('0');
    service.buildNumber('=');
    expect(service.resultText()).toBe('Infinity');
    expect(service.subResultText()).toBe('0');
    expect(service.lastOperator()).toBe('÷');
  });

  it('should handle percentage operator', () => {
    service.buildNumber('2');
    service.buildNumber('0');
    service.buildNumber('0');
    service.buildNumber('%');
    service.buildNumber('5');
    service.buildNumber('=');
    expect(service.resultText()).toBe('10');
  });

  // it('should handle if current value is -0 and new value is entered', () => {
  //   service.buildNumber('1');
  //   service.buildNumber('+/-');
  //   expect(service.resultText()).toBe('-1');
  //   service.buildNumber('Backspace');
  //   service.buildNumber('3');
  //   expect(service.resultText()).toBe('-3');
  // });
});
