import {  Component, Input, OnChanges, SimpleChanges, OnInit  } from '@angular/core';
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
export class PokemonListComponent implements OnInit,  OnChanges  {
  @Input() searchQuery: string = ''; // Suchbegriff als Input

  pokemons: Pokemon[] = [];
  selectedPokemon: Pokemon | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';

  pokemonStats: { name: string, value: number, color: string }[] = [];

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.loadPokemons();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchQuery'] && changes['searchQuery'].currentValue) {
      this.searchPokemon(changes['searchQuery'].currentValue);
    }
  }

  loadPokemons() {
    this.isLoading = true;
    this.errorMessage = ''; // Fehler zurücksetzen
  
    this.pokemonService.getPokemons().subscribe({
      next: (data: Pokemon[]) => {
        const shuffledData = this.shufflePokemons(data); // Liste mischen
        this.pokemons = [...this.pokemons, ...shuffledData];
        this.isLoading = false;
        this.pokemonService.updateOffset();
      },
      error: (error) => {
        console.error('Fehler beim Laden der Pokémon:', error);
        this.errorMessage = 'Es gab ein Problem beim Laden der Pokémon. Bitte versuche es später erneut.';
        this.isLoading = false;
      },
    });
  }
  searchPokemon(searchQuery: string) {
    const foundPokemon = this.pokemons.find(
      (pokemon) => pokemon.name.toLowerCase() === searchQuery.trim().toLowerCase()
    );

    if (foundPokemon) {
      this.showDetails(foundPokemon);
    } else {
      alert('Kein Pokémon mit diesem Namen gefunden!');
    }
  }
  

  shufflePokemons(pokemons: Pokemon[]): Pokemon[] {
    return pokemons
      .map((pokemon) => ({ pokemon, sort: Math.random() })) // Füge zufällige Sortierwerte hinzu
      .sort((a, b) => a.sort - b.sort) // Sortiere nach dem Zufallswert
      .map(({ pokemon }) => pokemon); // Entferne die Hilfsdaten
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
      { name: 'Speed', value: pokemon.speed, color: '#ff6600' }
    ];
  }
  prevPokemon(event: Event) {
    event.stopPropagation();
    if (!this.selectedPokemon) return;
  
    const currentIndex = this.pokemons.indexOf(this.selectedPokemon);
    const prevIndex = (currentIndex - 1 + this.pokemons.length) % this.pokemons.length;
    this.selectedPokemon = this.pokemons[prevIndex];
    this.setPokemonStats(this.selectedPokemon);
  }
  
  nextPokemon(event: Event) {
    event.stopPropagation();
    if (!this.selectedPokemon) return;
  
    const currentIndex = this.pokemons.indexOf(this.selectedPokemon);
    const nextIndex = (currentIndex + 1) % this.pokemons.length;
    this.selectedPokemon = this.pokemons[nextIndex];
    this.setPokemonStats(this.selectedPokemon);
  }
  
  
}
