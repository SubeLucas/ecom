import { Component } from '@angular/core';
import { SharedService } from '../../shared/shared.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-searchbar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.scss',
})
export class SearchbarComponent {
  searchKeyword = '';

  constructor(
    private sharedService: SharedService,
    private router: Router,
  ) {}

  onSearch() {
    this.router.navigate(['/']);

    setTimeout(() => {
      this.sharedService.triggerSearch(this.searchKeyword);
    }, 100);

    // if (this.router.url === '/') {
    //   this.sharedService.triggerSearch(this.searchKeyword);
    // } else {
    //   this.router.navigate(['/']).then(() => {
    //     this.sharedService.triggerSearch(this.searchKeyword);
    //   });
    // }
  }
}
