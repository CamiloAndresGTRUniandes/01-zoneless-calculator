import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalculatorButton } from './calculator-button';
import { Component } from '@angular/core';

@Component({
  imports: [CalculatorButton],
  template: `<calculator-button>AC</calculator-button>`,
  standalone: true,
})
class TestHostComponent {}

describe('CalculatorButton', () => {
  let component: CalculatorButton;
  let fixture: ComponentFixture<CalculatorButton>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CalculatorButton],
    });
    fixture = TestBed.createComponent(CalculatorButton);
    component = fixture.componentInstance;
    fixture.detectChanges(); //Important to trigger ngOnInit and other lifecycle hooks
  });

  it('should create the calculator view', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    console.log(compiled.innerHTML);
    expect(component).toBeTruthy();
  });

  it('should apply w-1/4 double size is false', () => {
    const hostElement = fixture.nativeElement as HTMLElement;
    const hostCss = hostElement.classList.value;
    expect(hostCss).toContain('w-1/4');
  });

  it('should apply w-2/4 double size is true', () => {
    fixture.componentRef.setInput('isDoubleSize', true);
    fixture.detectChanges();
    const hostElement = fixture.nativeElement as HTMLElement;
    const hostCss = hostElement.classList.value;
    expect(hostCss).toContain('w-2/4');
  });

  it('should apply is-command class when isCommand is true', () => {
    fixture.componentRef.setInput('isCommand', true);
    fixture.detectChanges();
    const hostElement = fixture.nativeElement as HTMLElement;
    const hostCss = hostElement.classList.value;
    const expectedIsCommandClass = 'bg-indigo-500 bg-opacity-20'.split(' ');
    let testCounter = 0;
    hostCss.split(' ').forEach(cls => {
      expectedIsCommandClass.forEach(expectedCls => {
        if (cls.includes(expectedCls)) {
          testCounter++;
        }
      });
    });
    expect(testCounter).toBe(4);
  });

  it('should not apply is-command class when isCommand is false', () => {
    fixture.componentRef.setInput('isCommand', false);
    fixture.detectChanges();
    const hostElement = fixture.nativeElement as HTMLElement;
    const hostCss = hostElement.classList.value;
    const expectedIsCommandClass = 'bg-indigo-500 bg-opacity-20'.split(' ');
    let testCounter = 0;
    hostCss.split(' ').forEach(cls => {
      expectedIsCommandClass.forEach(expectedCls => {
        if (cls.includes(expectedCls)) {
          testCounter++;
        }
      });
    });
    expect(testCounter).toBe(2);
  });

  it('should emit onClick when handleClick is called', () => {
    const clickSpy = vi.spyOn(component.onClick, 'emit');
    const compiled = fixture.nativeElement as HTMLElement;
    const buttonElement = compiled.querySelector('button');
    expect(buttonElement).toBeTruthy();
    buttonElement!.innerText = '5 ';
    buttonElement?.click();
    expect(clickSpy).toHaveBeenCalledWith('5');
  });


  it('should set isPressed to true and then false when keyboardPressedStyle is called with matching key', (done) => {
    const compiled = fixture.nativeElement as HTMLElement;
    const buttonElement = compiled.querySelector('button');
    expect(buttonElement).toBeTruthy();
    buttonElement!.innerText = '8 ';
    component.keyboardPressedStyle('8');
    expect(component.isPressed()).toBe(true);
    expect(component.isPressed()).toBeTruthy();
    setTimeout(() => {
      expect(component.isPressed()).toBeFalsy();
    }, 101);
  });

  it('should NOT set isPressed if key does not match', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const buttonElement = compiled.querySelector('button');
    expect(buttonElement).toBeTruthy();
    buttonElement!.innerText = '3 ';
    component.keyboardPressedStyle('5');
    expect(component.isPressed()).toBeFalsy();
  });

  it('should display projected content', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const buttonElement = compiled.querySelector('button');
    expect(buttonElement).toBeTruthy();
    buttonElement!.innerText = 'AC';
    fixture.detectChanges();
    expect(buttonElement!.innerText).toBe('AC');
  });

    it('should display projected content 2', () => {
      const fixture = TestBed.createComponent(TestHostComponent);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const buttonElement = compiled.querySelector('button');
      expect(buttonElement).toBeTruthy();
      expect(buttonElement!.textContent).toBe('AC');
  });
});
