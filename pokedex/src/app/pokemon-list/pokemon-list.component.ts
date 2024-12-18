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
  isLoading: boolean = false;
  errorMessage: string = ''; // Neue Fehlermeldungsvariable

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.loadPokemons();
  }

  loadPokemons() {
    this.isLoading = true;
    this.errorMessage = ''; // Fehler zurücksetzen
  
    this.pokemonService.getPokemons().subscribe({
      next: (data: Pokemon[]) => {
        this.pokemons = [...this.pokemons, ...data];
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
  
}


