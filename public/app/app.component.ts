import {Component, OnInit} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {ArgumentListComponent} from './argument/argument.list.component';

@Component({
    selector: 'app',
		template: `
			<h1>{{title}}</h1>
			`,
		directives: [],
		providers: []
})

@RouteConfig([
  {path:'/argument', name: 'Argument', component: ArgumentListComponent}
])

export class AppComponent {
  public title = 'Tour of Heroes';
	
  ngOnInit() {
    //
  }
}
