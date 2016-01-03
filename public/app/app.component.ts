import {Component, OnInit} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {HomeComponent} from './home/home.component';
import {ArgumentListComponent} from './argument/list/argument.list.component';
import {ArgumentDetailComponent} from './argument/detail/argument.detail.component';

@Component({
    selector: 'app',
		template: `
				<div class="ui menu">
					<div class="ui container">
						<a [routerLink]="['Home']" class="header item">
							ergo
						</a>
						<div class="right menu">
							<a class="item" [routerLink]="['ArgumentList']">
								My arguments
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
			`,
		directives: [ROUTER_DIRECTIVES],
		providers: []
})

@RouteConfig([
	{path:'/', name: 'Home', component: HomeComponent},
  {path:'/arguments', name: 'ArgumentList', component: ArgumentListComponent},
  {path:'/arguments/:key', name: 'ArgumentDetail', component: ArgumentDetailComponent}
])

export class AppComponent {
  public title = 'Tour of Heroes..';
	
  ngOnInit() {
    //
  }
}
