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

  getPokemons(): Observable<Pokemon[]> {
    const url = `${this.apiUrl}?offset=${this.offset}&limit=${this.limit}`;

    return this.http.get<any>(url).pipe(
      map((response) => response.results),
      concatMap((results) => {
        return new Observable<Pokemon[]>((observer) => {
          const pokemons: Pokemon[] = [];
          let completedRequests = 0;

          results.forEach((pokemon: any) => {
            this.http.get<any>(pokemon.url).subscribe({
              next: (details) => {
                pokemons.push({
                  name: details.name,
                  image: details.sprites.other['official-artwork'].front_default, // Hochauflösende URL
                  type: details.types[0]?.type.name || 'Unknown',
                  hp: details.stats[0]?.base_stat || 0,
                  attack: details.stats[1]?.base_stat || 0,
                  defense: details.stats[2]?.base_stat || 0,
                  spAtk: details.stats[3]?.base_stat || 0,
                  spDef: details.stats[4]?.base_stat || 0,
                  speed: details.stats[5]?.base_stat || 0,
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

   // Methode, um ein einzelnes Pokémon per Namen zu laden
   getPokemonByName(name: string): Observable<Pokemon> {
    const url = `${this.apiUrl}/${name.toLowerCase()}`; // API-Endpoint für das Pokémon

    return this.http.get<any>(url).pipe(
      map((details) => ({
        name: details.name,
        image: details.sprites.other['official-artwork'].front_default, // Hochauflösende URL
        type: details.types[0]?.type.name || 'Unknown',
        hp: details.stats[0]?.base_stat || 0,
        attack: details.stats[1]?.base_stat || 0,
        defense: details.stats[2]?.base_stat || 0,
        spAtk: details.stats[3]?.base_stat || 0,
        spDef: details.stats[4]?.base_stat || 0,
        speed: details.stats[5]?.base_stat || 0,
      }))
    );
  }

  updateOffset() {
    this.offset += this.limit;
  }
}

