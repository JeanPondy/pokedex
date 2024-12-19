import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  searchQuery: string = '';

  @Output() searchPokemonEvent = new EventEmitter<string>();

  searchPokemon() {
    if (this.searchQuery.trim()) {
      this.searchPokemonEvent.emit(this.searchQuery.trim());
      this.searchQuery = ''; // Suchfeld leeren
    }
  }
}
