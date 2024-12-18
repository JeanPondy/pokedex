import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, concatMap, map } from 'rxjs';
import { Pokemon } from '../models/pokemon';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';
  private offset = 0; // Startpunkt für Pagination
  private limit = 20; // Anzahl der Pokémon pro Anfrage

  constructor(private http: HttpClient) {}

  // Pokémon-Daten abrufen
  getPokemons(): Observable<Pokemon[]> {
    const url = `${this.apiUrl}?offset=${this.offset}&limit=${this.limit}`;

    return this.http.get<any>(url).pipe(
      map((response) => response.results),
      concatMap((results) => {
        // Für jedes Pokémon in der Liste eine separate Anfrage ausführen
        return new Observable<Pokemon[]>((observer) => {
          const pokemons: Pokemon[] = [];
          let completedRequests = 0;

          results.forEach((pokemon: any) => {
            this.http.get<any>(pokemon.url).subscribe({
              next: (details) => {
                pokemons.push({
                  name: details.name,
                  image: details.sprites.front_default,
                  type: details.types[0]?.type.name || 'Unknown',
                });

                completedRequests++;
                if (completedRequests === results.length) {
                  observer.next(pokemons);
                  observer.complete();
                }
              },
              error: (error) => {
                observer.error(error);
              },
            });
          });
        });
      })
    );
  }

  // Offset aktualisieren
  updateOffset() {
    this.offset += this.limit;
  }
}
