import { ComponentFixture, TestBed } from '@angular/core/testing';
import CalculatorView from './calculator-view';
import { Component } from '@angular/core';

//Create a mocked Calculator component for testing purposes
@Component({
  selector: 'calculator',
  template: '<div>Calculator Component Mock</div>',
})
class MockCalculatorComponent { }

describe('CalculatorView', () => {
  let view: CalculatorView;
  let fixture: ComponentFixture<CalculatorView>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CalculatorView],
    })
      //override the Calculator component with the mock
      .overrideComponent(CalculatorView, {
        set: {
          imports: [MockCalculatorComponent],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(CalculatorView);
    view = fixture.componentInstance;
    fixture.detectChanges(); //Important to trigger ngOnInit and other lifecycle hooks
  });

  it('should create the calculator view', () => {
    expect(view).toBeTruthy();
  });

  it('should render the calculator component', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('calculator')).toBeTruthy();
    expect(compiled.querySelector('calculator')?.textContent).toContain('Calculator Component Mock');
  });

  it('should contain the specific CSS class in parent div', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const parentDiv = compiled.querySelector('div');
    // Check for multiple classes
    const expectedClass = 'w-full mx-auto rounded-xl bg-gray-100 shadow-xl text-gray-800 relative overflow-hidden'.split(' ');
    expect(parentDiv).toBeTruthy();

    // Check each class individually
    expectedClass.forEach(cls => {
      expect(parentDiv?.classList).toContain(cls);
    });
  });
});
