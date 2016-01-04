import {Component, OnInit} from 'angular2/core';

@Component({
    selector: 'home',
		template: `
			<h1>{{title}}</h1>
			`,
		directives: [],
		providers: []
})

export class HomeComponent {
  public title = 'Home';
	
  ngOnInit() {
    //
  }
}
