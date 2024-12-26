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
  private limit = 24; // Anzahl der Pokémon pro Anfrage

  constructor(private http: HttpClient) {}

  // Hilfsfunktion zum Abrufen und Mappen von Pokémon-Details
  private fetchPokemonDetails(url: string): Observable<Pokemon> {
    return this.http.get<any>(url).pipe(
      map((details) => ({
        id: details.id,
        name: details.name,
        image: details.sprites.other['official-artwork'].front_default,
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

  getPokemons(): Observable<Pokemon[]> {
    const url = `${this.apiUrl}?offset=${this.offset}&limit=${this.limit}`;

    return this.http.get<any>(url).pipe(
        map((response) => response.results),
        concatMap((results) => {
            return new Observable<Pokemon[]>((observer) => {
                const pokemons: Pokemon[] = [];
                let completedRequests = 0;

                results.forEach((pokemon: any) => {
                    this.fetchPokemonDetails(pokemon.url).subscribe({
                        next: (pokemonDetails) => {
                            pokemons.push(pokemonDetails);
                            completedRequests++;
                            if (completedRequests === results.length) {
                                // Sortiere Pokémon nach ID, bevor sie zurückgegeben werden
                                observer.next(pokemons.sort((a, b) => a.id - b.id));
                                observer.complete();
                            }
                        },
                        error: (error) => observer.error(error),
                    });
                });
            });
        })
    );
}

  // Methode, um ein einzelnes Pokémon per Namen zu laden
  getPokemonByName(name: string): Observable<Pokemon> {
    const url = `${this.apiUrl}/${name.toLowerCase()}`;

    return this.fetchPokemonDetails(url);
  }


  updateOffset() {
    this.offset += this.limit;
  }


  resetOffset() {
    this.offset = 0; // Offset zurücksetzen
}

  searchPokemons(query: string): Observable<Pokemon[]> {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=1000`; // Alle Pokémon laden

    return this.http.get<any>(url).pipe(
      map((response) => response.results),
      map((results: any[]) =>
        results.filter((pokemon) => pokemon.name.startsWith(query)) // Filter in der API-Antwort
      ),
      concatMap((filteredPokemons) => {
        return new Observable<Pokemon[]>((observer) => {
          const pokemons: Pokemon[] = [];
          let completedRequests = 0;

          filteredPokemons.forEach((pokemon: any) => {
            this.fetchPokemonDetails(pokemon.url).subscribe({
              next: (pokemonDetails) => {
                pokemons.push(pokemonDetails);
                completedRequests++;
                if (completedRequests === filteredPokemons.length) {
                  observer.next(pokemons);
                  observer.complete();
                }
              },
              error: (error) => observer.error(error),
            });
          });
        });
      })
    );
  }
}
