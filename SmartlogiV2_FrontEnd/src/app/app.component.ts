import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

import { CommonModule } from '@angular/common';
import { LoadingScreenComponent } from './Shared/components/loading-screen/loading-screen.component';
import { AuthService } from './Core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, LoadingScreenComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'SmartlogiV2_FrontEnd';
  isLoading = false;

  constructor(private router: Router, private authService: AuthService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.isLoading = true;
      }
      if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        
        setTimeout(() => {
          this.isLoading = false;
        }, 2000);
      }
    });
  }

  ngOnInit(): void {
    if (this.authService.getToken()) {
      this.authService.syncUser().subscribe({
        error: () => console.warn('Session sync failed on startup')
      });
    }
  }
}
