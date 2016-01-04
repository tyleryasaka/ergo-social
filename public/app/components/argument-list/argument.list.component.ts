import {Component, OnInit} from 'angular2/core';
import {RouteConfig, RouterOutlet, ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {APIService} from '../../services/api/api.service';

@Component({
    selector: 'argument-list',
		template: `
			<h1>{{title}}</h1>
			<div class="ui big middle aligned selection very relaxed celled list">
				<a class="item" *ngFor="#argument of arguments" [routerLink]="['ArgumentDetail', {key: argument._key}]">
					{{argument.title}}
				</a>
			</div>
			`,
		directives: [RouterOutlet, ROUTER_DIRECTIVES],
		providers: []
})

export class ArgumentListComponent {
  public title = 'My arguments';
  public arguments: any;
	
	constructor(
		private router: Router,
		private api: APIService
	) { }
	
  ngOnInit() {
    this.api.argumentList(this.router).then(res => {
			this.arguments = res.data 
		});
  }
}
