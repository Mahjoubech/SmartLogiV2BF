import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'priorityColor',
    standalone: true
})
export class PriorityColorPipe implements PipeTransform {

    transform(priority: string | undefined): string {
        if (!priority) return '#94a3b8'; 

        switch (priority.toUpperCase()) {
            case 'URGENT':
            case 'HAUTE':
            case 'CRITIQUE':
                return '#ef4444'; 
            case 'NORMAL':
            case 'MOYENNE':
                return '#3b82f6'; 
            case 'BASIQUE':
            case 'FAIBLE':
                return '#22d3ee'; 
            default:
                return '#94a3b8';
        }
    }
}
