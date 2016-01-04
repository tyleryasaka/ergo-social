import {Component, OnInit} from 'angular2/core';
import {RouteConfig, RouterOutlet} from 'angular2/router';

@Component({
    selector: 'argument-detail',
		template: `
			<h1>{{title}}</h1>
			`,
		directives: [RouterOutlet],
		providers: []
})

export class ArgumentDetailComponent {
  public title = 'Argument';
	
  ngOnInit() {
    //
  }
}
