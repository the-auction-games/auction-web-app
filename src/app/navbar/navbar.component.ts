import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  // Default the user to not signed in
  isLoggedIn: boolean = false;

  constructor() { 
  }

  ngOnInit(): void {
  }

}
