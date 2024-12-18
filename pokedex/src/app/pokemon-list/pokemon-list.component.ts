import { Component, OnInit } from '@angular/core';
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
export class PokemonListComponent implements OnInit {
  pokemons: Pokemon[] = [];
  selectedPokemon: Pokemon | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';

  pokemonStats: { name: string, value: number, color: string }[] = [];

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.loadPokemons();
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
}
