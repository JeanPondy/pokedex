import { Component } from '@angular/core';
import { PokemonListComponent } from './pokemon-list/pokemon-list.component';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PokemonListComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  searchQuery: string = ''; // Suchbegriff wird hier gespeichert

  // Event-Handler für die Suche
  onSearchPokemon(searchQuery: string) {
    this.searchQuery = searchQuery; // Suchbegriff an die Pokémon-Liste weitergeben
  }
}
