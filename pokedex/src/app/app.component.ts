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
  title = 'pokedex'; 
  searchQuery: string = ''; 

  /**
   * Handles the search event emitted by the `HeaderComponent`.
   * Updates the `searchQuery` property to pass it to the `PokemonListComponent`.
   * 
   * @param searchQuery - The search term entered by the user.
   */
  onSearchPokemon(searchQuery: string) {
    this.searchQuery = searchQuery; 
  }
}
