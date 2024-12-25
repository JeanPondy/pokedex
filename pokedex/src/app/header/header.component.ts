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
    const query = this.searchQuery.trim();
    if (query.length >= 3) {
      this.searchPokemonEvent.emit(query); // Nur auslösen, wenn mindestens 3 Zeichen
    } else if (query.length === 0) {
      this.searchPokemonEvent.emit(''); // Liste zurücksetzen, wenn Eingabe gelöscht wird
    }
  }
}
