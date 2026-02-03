import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-loading-screen',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './loading-screen.component.html',
    styleUrl: "./loading-screen.component.css"
})
export class LoadingScreenComponent {
    @Input() visible: boolean = false;
    @Input() text: string = 'Initializing Mission Control...';
}
