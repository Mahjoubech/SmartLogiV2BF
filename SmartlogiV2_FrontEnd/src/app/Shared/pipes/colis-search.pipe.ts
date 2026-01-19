import { Pipe, PipeTransform } from '@angular/core';
import { ColisResponse } from '../../Core/api/models/colis-response';

@Pipe({
    name: 'colisSearch',
    standalone: true
})
export class ColisSearchPipe implements PipeTransform {
    transform(colis: ColisResponse[] | null, searchText: string): ColisResponse[] {
        if (!colis) return [];
        if (!searchText) return colis;

        searchText = searchText.toLowerCase();

        return colis.filter(c => {
            const destinataireName = `${c.destinataire?.nom || ''} ${c.destinataire?.prenom || ''}`.toLowerCase();
            const codeEnvoi = (c.id || '').toLowerCase();
            const ville = (c.villeDestination || '').toLowerCase();

            return destinataireName.includes(searchText) ||
                codeEnvoi.includes(searchText) ||
                ville.includes(searchText);
        });
    }
}
