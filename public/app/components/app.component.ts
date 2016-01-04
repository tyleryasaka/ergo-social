import {Component, OnInit} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, Router} from 'angular2/router';

import {HomeComponent} from './home/home.component';
import {ArgumentListComponent} from './argument-list/argument.list.component';
import {ArgumentDetailComponent} from './argument-detail/argument.detail.component';
import {LibService} from '../services/lib/lib.service';
import {APIService} from '../services/api/api.service';
import {Credentials} from '../classes/classes';

@Component({
    selector: 'app',
		template: `
				<div class="ui menu">
					<div class="ui container">
						<a [routerLink]="['Home']" class="header item">
							ergo
						</a>
						<a class="item" (click)="registerModal()" *ngIf="!isLoggedIn">
							Register
						</a>
						<div class="right menu">
							<a class="item" [routerLink]="['ArgumentList']" *ngIf="isLoggedIn">
								My arguments
							</a>
							<a class="item" (click)="logout()" *ngIf="isLoggedIn">
								Logout
							</a>
							<a class="item" (click)="loginModal()" *ngIf="!isLoggedIn">
								Login
							</a>
						</div>
					</div>
				</div>

				<div class="ui grid container">
					<div class="row">
						<div class="column">
							<div class="content">
								<router-outlet></router-outlet>
							</div>
						</div>
					</div>
				</div>
				
				<div class="ui small modal" id="login-modal">
					<i class="close icon"></i>
						<div class="header">
							Login
						</div>
						<div class="content">
							<form class="ui form" (keypress)="lib.onEnter($event, login)">
								<div class="ui negative message" id="loginErrors" *ngIf="loginErrors.length">
									<div class="header">Try again</div>
									<ul class="list">
										<li *ngFor="#loginError of loginErrors">{{loginError}}</li>
									</ul>
								</div>
								<div class="field">
									<label>Username</label>
									<input type="text" placeholder="Username" [(ngModel)]="credentials.username">
								</div>
								<div class="field">
									<label>Password</label>
									<input type="password" placeholder="Password" [(ngModel)]="credentials.password">
								</div>
							</form>
						</div>
						<div class="actions">
							<button class="ui black button" (click)="login()">Submit</button>
						</div>
				</div>
			`,
		styles: [`
			.ui.menu .container {
				border-right: 1px solid rgba(34,36,38,.1);
			}
		`],
		directives: [ROUTER_DIRECTIVES],
		providers: []
})

@RouteConfig([
	{path:'/', name: 'Home', component: HomeComponent, useAsDefault: true},
  {path:'/arguments', name: 'ArgumentList', component: ArgumentListComponent},
  {path:'/arguments/:key', name: 'ArgumentDetail', component: ArgumentDetailComponent}
])

export class AppComponent {
  public isLoggedIn = false;
  public credentials: Credentials = new Credentials();
	public loginErrors = [];
  
  constructor(
		private api: APIService,
		private lib: LibService,
		private router: Router
	) {}
  
  loginModal = () => {
		this.loginErrors = [];
		this.credentials = new Credentials();
		$('.ui.modal#login-modal').modal('show');
	}
	
	login = () => {
		this.api.login(this.credentials).then(res => {
			this.loginErrors = [];
			if(res.status == "success") {
				this.isLoggedIn = true;
				this.router.navigate(['ArgumentList']).then( () => {
					$('.ui.modal#login-modal').modal('hide');
				});
			} else {
				this.loginErrors.push('Invalid credentials');
				setTimeout( () => $('#loginErrors').transition('pulse'), 100);
			}
			this.credentials.password = ''; // don't let this data hang around
		});
	}
	
	logout = () => {
		this.api.logout().then(res => {
			this.router.navigate(['Home']).then(res => {
				this.isLoggedIn = false;
			});
		});
	}
	
  ngOnInit() {
    this.api.isLoggedIn().then(res => this.isLoggedIn = res.data );
  }
}
