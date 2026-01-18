import { ChangeDetectionStrategy, Component, ElementRef, HostBinding, input, OnInit, output, signal, viewChild } from '@angular/core';

@Component({
  selector: 'calculator-button',
  imports: [],
  templateUrl: './calculator-button.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './calculator-button.css',
  host: {
    '[class]': 'this.getButtonClassList()',
    // '[class.w2/4]': 'isDoubleSize()',
    // '[class.w1/4]': '!isDoubleSize()',
    //class: 'w-1/4 border-r border-b border-indigo-400',
    // attribute: 'hola',
    // 'data-size': 'XL',
  },
})
export class CalculatorButton {
  public isPressed = signal(false);
  public onClick = output<string>();
  public contentValue = viewChild<ElementRef<HTMLButtonElement>>(`button`);

  // Emit click event with button value
  handleClick() {
    if (!this.contentValue()?.nativeElement) return;
    const value = this.contentValue()!.nativeElement.innerText.trim();
    this.onClick.emit(value);
  }
  // Command style for operation buttons
  public isCommand = input(false, {
    transform: (value: boolean | string) =>
      typeof value === 'string' ? value === '' : value,
  });
  // Double size for equal button
  public isDoubleSize = input(false, {
    transform: (value: boolean | string) =>
      typeof value === 'string' ? value === '' : value,
  });

  // Handle keyboard press style
  public keyboardPressedStyle(key: string) {
    if (!this.contentValue()) return;
    const value = this.contentValue()!.nativeElement.innerText?.trim();
    if (value !== key) return;

    this.isPressed.set(true);
    setTimeout(() => {
      this.isPressed.set(false);
    }, 100);
  }

  // Generate class list based on inputs
  public getButtonClassList() {
    const classes = [
      'h-16',
      'outline-none',
      'border-r',
      'border-b',
      'border-indigo-400',
      'focus:outline-none',
      'hover:bg-indigo-500',
      'hover:bg-opacity-20',
      'text-white',
      'text-xl',
      'font-light'];
    if (this.isCommand()) {
      classes.push('bg-indigo-500', 'bg-opacity-20');
    }
    if (this.isDoubleSize()) {
      classes.push('w-2/4');
    } else {
      classes.push('w-1/4');
    }
    return classes.join(' ');
  };
}
