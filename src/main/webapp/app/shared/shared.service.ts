import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private searchTrigger = new Subject<string>();
  searchTriggered$ = this.searchTrigger.asObservable();

  triggerSearch(keyword: string) {
    this.searchTrigger.next(keyword);
  }
}
