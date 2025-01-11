import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  /**
   * The search query entered by the user.
   */
  searchQuery: string = '';

  /**
   * Event emitter to notify the parent component about the search query.
   */
  @Output() searchPokemonEvent = new EventEmitter<string>();

  /**
   * Emits the search query if it is valid.
   * - Emits the query if it contains at least 3 characters.
   * - Emits an empty string if the input is cleared.
   */
  searchPokemon() {
    const query = this.searchQuery.trim();
    if (query.length >= 3) {
      this.searchPokemonEvent.emit(query); // Emit the search query to the parent
    } else if (query.length === 0) {
      this.searchPokemonEvent.emit(''); // Emit an empty query to reset search
    }
  }
}
