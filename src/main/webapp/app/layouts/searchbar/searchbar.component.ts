import { Component } from '@angular/core';
import { SharedService } from '../../shared/shared.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'jhi-searchbar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.scss',
})
export class SearchbarComponent {
  searchKeyword = '';

  constructor(private sharedService: SharedService) {}

  onSearch() {
    this.sharedService.triggerSearch(this.searchKeyword);
  }
}
