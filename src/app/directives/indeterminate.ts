import { Directive, ElementRef, Input } from '@angular/core';

@Directive({ 
    selector: '[indeterminate]',
    host: {
        '[attr.aria-selected]': 'indeterminate ? "mixed" : null'
    }
})
export class IndeterminateDirective {
    private indeterminateState = false;

    @Input()
    set indeterminate(value: boolean) {
        this.elementRef.nativeElement.indeterminate = value;
        this.indeterminateState = value;
    }

    get indeterminate(): boolean {
        return this.indeterminateState;
    }

    constructor(private elementRef: ElementRef) { }
}