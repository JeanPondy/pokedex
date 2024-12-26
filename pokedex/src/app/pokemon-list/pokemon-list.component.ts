import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { PokemonService } from '../services/pokemon.service';
import { Pokemon } from '../models/pokemon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss'],
})
export class PokemonListComponent implements OnInit, OnChanges {
  @Input() searchQuery: string = ''; // Suchbegriff als Input

  pokemons: Pokemon[] = [];
  selectedPokemon: Pokemon | null = null;
  isLoading: boolean = false;
  isSearching: boolean = false; // Status für Suchmodus

  errorMessage: string = '';

  pokemonStats: { name: string; value: number; color: string }[] = [];

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.loadPokemons();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchQuery'] && changes['searchQuery'].currentValue !== changes['searchQuery'].previousValue) {
      const query = changes['searchQuery'].currentValue.trim().toLowerCase();

      if (!query) {
        // Suchfeld ist leer: Ursprüngliche Pokémon-Liste laden
        this.isSearching = false; // Suchmodus deaktivieren
        this.pokemons = []; // Liste leeren, um doppelte Einträge zu vermeiden
        this.pokemonService.resetOffset(); // Offset zurücksetzen
        this.loadPokemons(); // Erste Pokémon laden
      } else if (query.length >= 3) {
        // Suchmodus aktivieren
        this.isSearching = true;
        this.searchPokemon(query); // Suche starten
      } else {
        alert('Bitte mindestens 3 Buchstaben eingeben!');
      }
    }
  }

  // Aufgerufen, wenn der Benutzer auf "Mehr laden" klickt
  onLoadMore() {
    if (this.isSearching) return; // Keine neuen Pokémon laden, wenn im Suchmodus

    this.isLoading = true; // Ladezustand aktivieren
    this.pokemonService.updateOffset(); // Offset erhöhen
    this.loadPokemons(); // Neue Pokémon laden
  }

  // Ursprüngliche Pokémon-Liste laden
/*   loadPokemons() {
    this.isLoading = true;
    this.errorMessage = ''; // Fehler zurücksetzen

    this.pokemonService.getPokemons().subscribe({
      next: (data: Pokemon[]) => {
        if (data.length === 0) {
          alert('Keine weiteren Pokémon verfügbar!');
          this.isLoading = false;
          return;
        }

        // Hinzufügen ohne Duplikate und Sortieren nach ID
        this.pokemons = [
          ...this.pokemons,
          ...data.filter((newPokemon) =>
            !this.pokemons.some((existing) => existing.id === newPokemon.id)
          ),
        ].sort((a, b) => a.id - b.id);

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Fehler beim Laden der Pokémon:', error);
        this.errorMessage = 'Es gab ein Problem beim Laden der Pokémon. Bitte versuche es später erneut.';
        this.isLoading = false;
      },
    });
  } */

// Ursprüngliche Pokémon-Liste laden
loadPokemons() {
  this.isLoading = true;
  this.errorMessage = ''; // Fehler zurücksetzen

  this.fetchPokemons();
}

// API-Abfrage für Pokémon
private fetchPokemons() {
  this.pokemonService.getPokemons().subscribe({
    next: (data: Pokemon[]) => {
      this.processPokemonData(data); // Daten verarbeiten
    },
    error: (error) => {
      console.error('Fehler beim Laden der Pokémon:', error);
      this.errorMessage = 'Es gab ein Problem beim Laden der Pokémon. Bitte versuche es später erneut.';
      this.isLoading = false;
    },
  });
}

// Verarbeitung der empfangenen Pokémon-Daten
private processPokemonData(data: Pokemon[]) {
  if (data.length === 0) {
    alert('Keine weiteren Pokémon verfügbar!');
    this.isLoading = false;
    return;
  }

  // Hinzufügen ohne Duplikate und Sortieren nach ID
  this.pokemons = [
    ...this.pokemons,
    ...data.filter((newPokemon) =>
      !this.pokemons.some((existing) => existing.id === newPokemon.id)
    ),
  ].sort((a, b) => a.id - b.id);

  this.isLoading = false;
}




/* ----------------------------------------------------------- */
  // Suche durchführen
  searchPokemon(searchQuery: string) {
    this.pokemonService.searchPokemons(searchQuery).subscribe({
      next: (pokemons: Pokemon[]) => {
        if (pokemons.length > 0) {
          this.pokemons = pokemons; // Suchergebnisse anzeigen
        } else {
          alert('Kein Pokémon gefunden!');
        }
      },
      error: (error) => {
        console.error('Fehler bei der Pokémon-Suche:', error);
        alert('Es gab ein Problem bei der Suche. Bitte versuchen Sie es später erneut.');
      },
    });
  }

  // Öffnen der Detailansicht
  showDetails(pokemon: Pokemon) {
    this.selectedPokemon = pokemon;
    this.setPokemonStats(pokemon);
  }

  // Schließen der Detailansicht
  closeDetails(event: any) {
    event.stopPropagation();
    this.selectedPokemon = null;
  }

  // Setzen der Pokémon-Statistiken
  setPokemonStats(pokemon: Pokemon) {
    this.pokemonStats = [
      { name: 'HP', value: pokemon.hp, color: '#ff6666' },
      { name: 'Attack', value: pokemon.attack, color: '#ffcc00' },
      { name: 'Defense', value: pokemon.defense, color: '#6699ff' },
      { name: 'Sp. Atk', value: pokemon.spAtk, color: '#ff80ff' },
      { name: 'Sp. Def', value: pokemon.spDef, color: '#99ff99' },
      { name: 'Speed', value: pokemon.speed, color: '#ff6600' },
    ];
  }

  // Navigieren zum vorherigen Pokémon
  prevPokemon(event: Event) {
    event.stopPropagation();
    if (!this.selectedPokemon) return;

    const currentIndex = this.pokemons.indexOf(this.selectedPokemon);
    const prevIndex = (currentIndex - 1 + this.pokemons.length) % this.pokemons.length;
    this.selectedPokemon = this.pokemons[prevIndex];
    this.setPokemonStats(this.selectedPokemon);
  }

  // Navigieren zum nächsten Pokémon
  nextPokemon(event: Event) {
    event.stopPropagation();
    if (!this.selectedPokemon) return;

    const currentIndex = this.pokemons.indexOf(this.selectedPokemon);
    const nextIndex = (currentIndex + 1) % this.pokemons.length;
    this.selectedPokemon = this.pokemons[nextIndex];
    this.setPokemonStats(this.selectedPokemon);
  }
}
