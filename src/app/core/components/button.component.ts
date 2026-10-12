import { CommonModule } from "@angular/common";
import { Component, input, output } from "@angular/core";

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'success' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
    standalone: true,
    selector: 'app-button',
    imports: [CommonModule],
    template: `
    <button
        [type]="type()"
        [ngClass]="classes"
        [disabled]="disabled() || loading()"
        (click)="onClick($event)"
        >
        @if (loading()) {
            <span class="fx-spinner"></span>
        } @else {
            <ng-content select="[icon-left]"></ng-content>
        }
        
        <ng-content></ng-content>
        
        @if (!loading()) {
            <ng-content select="[icon-right]"></ng-content>
        }
    </button>
    `,
    styles:[`
       :host {
            display: contents;
        }
       `
    ]
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly type = input<'button' | 'submit' | 'reset'>('button');
 
  readonly block = input(false);
  readonly iconOnly = input(false);
  readonly loading = input(false);
  readonly disabled = input(false);
 
  readonly clicked = output<MouseEvent>();
 
  get classes(): Record<string, boolean> {
    return {
      'fx-btn': true,
      [`fx-btn--${this.variant()}`]: true,
      'fx-btn--sm': this.size() === 'sm',
      'fx-btn--lg': this.size() === 'lg',
      'fx-btn--block': this.block(),
      'fx-btn--icon': this.iconOnly(),
      'fx-btn--loading': this.loading()
    };
  }
 
  onClick(event: MouseEvent): void {
    if (this.disabled() || this.loading()) return;
    this.clicked.emit(event);
  }
}