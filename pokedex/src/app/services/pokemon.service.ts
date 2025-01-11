import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, concatMap, map } from 'rxjs';
import { Pokemon } from '../models/pokemon';




@Injectable({
  providedIn: 'root',
})

export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';
  private offset = 0; 
  private limit = 24; 

  constructor(private http: HttpClient) {}

   /**
   * Fetches details of a Pokémon using its URL.
   * @param url The URL of the Pokémon details.
   * @returns An observable with the Pokémon details.
   */
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


  /**
   * Fetches a list of Pokémon.
   * @returns An observable with a list of Pokémon.
   */

getPokemons(): Observable<Pokemon[]> {
  const url = `${this.apiUrl}?offset=${this.offset}&limit=${this.limit}`;

  return this.http.get<any>(url).pipe(
    map((response) => response.results),
    concatMap((results) => this.fetchPokemonDetailsList(results)) // Details abrufen und verarbeiten
  );
}

 /**
   * Fetches the details of a list of Pokémon.
   * @param results The list of Pokémon URLs to fetch.
   * @returns An observable with a list of Pokémon details.
   */
private fetchPokemonDetailsList(results: any[]): Observable<Pokemon[]> {
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
}



/* ----------------------------------------------------- */

/**
 * Fetches a single Pokémon by name.
 * @param {string} name - The name of the Pokémon to fetch
 * @returns {Observable<Pokemon>} An observable with the Pokémon details
 */
  getPokemonByName(name: string): Observable<Pokemon> {
    const url = `${this.apiUrl}/${name.toLowerCase()}`;

    return this.fetchPokemonDetails(url);
  }

/**
 * Updates the offset for pagination.
 */
  updateOffset() {
    this.offset += this.limit;
  }


/**
 * Resets the offset for pagination.
 */
  resetOffset() {
    this.offset = 0; // Offset zurücksetzen
}

/*   searchPokemons(query: string): Observable<Pokemon[]> {
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
  } */


    /**
 * Searches for Pokémon based on a query string.
 * @param {string} query - The search query
 * @returns {Observable<Pokemon[]>} An observable with a list of matching Pokémon
 */
    searchPokemons(query: string): Observable<Pokemon[]> {
      const url = `https://pokeapi.co/api/v2/pokemon?limit=1000`; // Alle Pokémon laden
    
      return this.http.get<any>(url).pipe(
        map((response) => response.results),
        map((results: any[]) => 
          results.filter((pokemon) => pokemon.name.startsWith(query)) // Filter in der API-Antwort
        ),
        concatMap((filteredPokemons) => this.fetchFilteredPokemonDetails(filteredPokemons)) // Hilfsmethode aufrufen
      );
    }
   /**
 * Helper method for fetching details of filtered Pokémon.
 * @param {any[]} filteredPokemons - The list of filtered Pokémon
 * @returns {Observable<Pokemon[]>} An observable with a list of Pokémon details
 * @private
 */
    private fetchFilteredPokemonDetails(filteredPokemons: any[]): Observable<Pokemon[]> {
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
    }
    
}
