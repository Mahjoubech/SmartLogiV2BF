import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
// import { initFlowbite } from 'flowbite';
import { CommonModule } from '@angular/common';
import { LoadingScreenComponent } from './Shared/components/loading-screen/loading-screen.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, LoadingScreenComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'SmartlogiV2_FrontEnd';
  isLoading = false;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.isLoading = true;
      }
      if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        // Keep loader visible for 3 seconds as requested
        setTimeout(() => {
          this.isLoading = false;
        }, 2000);
      }
    });
  }

  ngOnInit(): void {
    // initFlowbite();
    console.log('Flowbite loaded globally');
  }
}
