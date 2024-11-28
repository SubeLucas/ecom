import { Component, signal, inject } from '@angular/core';
import SharedModule from 'app/shared/shared.module';
import { Router, RouterModule } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { LoginService } from 'app/login/login.service';
import HasAnyAuthorityDirective from 'app/shared/auth/has-any-authority.directive';
import { ProfileService } from 'app/layouts/profiles/profile.service';

@Component({
  selector: 'jhi-navbar',
  standalone: true,
  imports: [SharedModule, RouterModule, HasAnyAuthorityDirective],
  templateUrl: './my-navbar.component.html',
  styleUrl: './my-navbar.component.scss',
})
export default class MyNavbarComponent {
  isNavbarCollapsed = signal(true);
  account = inject(AccountService).trackCurrentAccount();
  inProduction?: boolean;
  openAPIEnabled?: boolean;

  private router = inject(Router);
  private loginService = inject(LoginService);
  private profileService = inject(ProfileService);

  ngOnInit(): void {
    this.profileService.getProfileInfo().subscribe(profileInfo => {
      this.inProduction = profileInfo.inProduction;
      this.openAPIEnabled = profileInfo.openAPIEnabled;
    });
  }

  logout(): void {
    this.collapseNavbar();
    this.loginService.logout();
    this.router.navigate(['']);
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  cart(): void {
    this.router.navigate(['/cart']);
  }

  collapseNavbar(): void {
    this.isNavbarCollapsed.set(true);
  }

  toggleNavbar(): void {
    this.isNavbarCollapsed.update(isNavbarCollapsed => !isNavbarCollapsed);
  }
}
