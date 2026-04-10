import { Component, OnInit } from '@angular/core';
import { DomService } from './services/dom.service';
import { SecurityService } from "./services/security.service";
import { AuthGuard } from './guards/auth.guard';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit {
  isSession: string;

  constructor(public domService: DomService, private securityService: SecurityService, public authGuard: AuthGuard) { }

  hideSideBar() {
    this.domService.HideSideBar();
  }

  ngOnInit() {
    this.isSession = this.securityService.leeridPerfil()
  }

}
