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
  @Input() searchQuery: string = ''; // Search query input

  pokemons: Pokemon[] = [];
  selectedPokemon: Pokemon | null = null;
  isLoading: boolean = false;
  isSearching: boolean = false; // Status for searching mode

  errorMessage: string = '';

  pokemonStats: { name: string; value: number; color: string }[] = [];

 
  constructor(private pokemonService: PokemonService) {}

  /**
   * Lifecycle hook that is called when the component is initialized.
   */
  ngOnInit(): void {
    this.loadPokemons();
  }

  /**
   * Lifecycle hook that is called when input properties change.
   * @param changes The changes detected in the input properties.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchQuery'] && changes['searchQuery'].currentValue !== changes['searchQuery'].previousValue) {
      const query = changes['searchQuery'].currentValue.trim().toLowerCase();

      if (!query) {
        this.isSearching = false;
        this.pokemons = [];
        this.pokemonService.resetOffset();
        this.loadPokemons();
      } else if (query.length >= 3) {
        this.isSearching = true;
        this.searchPokemon(query);
      } else {
        alert('Please enter at least 3 characters!');
      }
    }
  }

  /**
   * Called when the user clicks "Load More" button.
   * Loads more Pokémon if not in search mode.
   */
  onLoadMore() {
    if (this.isSearching) return;

    this.isLoading = true;
    this.pokemonService.updateOffset();
    this.loadPokemons();
  }

  /**
   * Loads the initial list of Pokémon.
   */
  loadPokemons() {
    this.isLoading = true;
    this.errorMessage = '';

    this.fetchPokemons();
  }

  /**
   * Fetches Pokémon data from the service.
   */
  private fetchPokemons() {
    this.pokemonService.getPokemons().subscribe({
      next: (data: Pokemon[]) => {
        this.processPokemonData(data);
      },
      error: (error) => {
        console.error('Error loading Pokémon:', error);
        this.errorMessage = 'There was an issue loading the Pokémon. Please try again later.';
        this.isLoading = false;
      },
    });
  }

  /**
   * Processes the received Pokémon data.
   * @param data The Pokémon data to be processed.
   */
  private processPokemonData(data: Pokemon[]) {
    if (data.length === 0) {
      alert('No more Pokémon available!');
      this.isLoading = false;
      return;
    }

    this.pokemons = [
      ...this.pokemons,
      ...data.filter((newPokemon) =>
        !this.pokemons.some((existing) => existing.id === newPokemon.id)
      ),
    ].sort((a, b) => a.id - b.id);

    this.isLoading = false;
  }

  /**
   * Performs a search for Pokémon based on the query.
   * @param searchQuery The search query to filter Pokémon by.
   */
  searchPokemon(searchQuery: string) {
    this.pokemonService.searchPokemons(searchQuery).subscribe({
      next: (pokemons: Pokemon[]) => {
        if (pokemons.length > 0) {
          this.pokemons = pokemons;
        } else {
          alert('No Pokémon found!');
        }
      },
      error: (error) => {
        console.error('Error searching for Pokémon:', error);
        alert('There was an issue with the search. Please try again later.');
      },
    });
  }

  /**
   * Shows the details of the selected Pokémon.
   * @param pokemon The Pokémon whose details to show.
   */
  showDetails(pokemon: Pokemon) {
    this.selectedPokemon = pokemon;
    this.setPokemonStats(pokemon);
  }

  /**
   * Closes the details view.
   * @param event The event object triggered by closing the details view.
   */
  closeDetails(event: any) {
    event.stopPropagation();
    this.selectedPokemon = null;
  }

  /**
   * Sets the stats for the selected Pokémon.
   * @param pokemon The Pokémon whose stats to set.
   */
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

  /**
   * Navigates to the previous Pokémon.
   * @param event The event object triggered by the action.
   */
  prevPokemon(event: Event) {
    event.stopPropagation();
    if (!this.selectedPokemon) return;

    const currentIndex = this.pokemons.indexOf(this.selectedPokemon);
    const prevIndex = (currentIndex - 1 + this.pokemons.length) % this.pokemons.length;
    this.selectedPokemon = this.pokemons[prevIndex];
    this.setPokemonStats(this.selectedPokemon);
  }

  /**
   * Navigates to the next Pokémon.
   * @param event The event object triggered by the action.
   */
  nextPokemon(event: Event) {
    event.stopPropagation();
    if (!this.selectedPokemon) return;

    const currentIndex = this.pokemons.indexOf(this.selectedPokemon);
    const nextIndex = (currentIndex + 1) % this.pokemons.length;
    this.selectedPokemon = this.pokemons[nextIndex];
    this.setPokemonStats(this.selectedPokemon);
  }
}
