import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'priorityColor',
    standalone: true
})
export class PriorityColorPipe implements PipeTransform {

    transform(priority: string | undefined): string {
        if (!priority) return '#94a3b8'; // Default slate-400

        switch (priority.toUpperCase()) {
            case 'URGENT':
            case 'HAUTE':
            case 'CRITIQUE':
                return '#ef4444'; // Red-500
            case 'NORMAL':
            case 'MOYENNE':
                return '#3b82f6'; // Blue-500
            case 'BASIQUE':
            case 'FAIBLE':
                return '#22d3ee'; // Cyan-400
            default:
                return '#94a3b8';
        }
    }
}
