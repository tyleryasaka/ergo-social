import {Component, OnInit} from 'angular2/core';

@Component({
    selector: 'argument-list',
		template: `
			<h1>{{title}}</h1>
			`,
		directives: [],
		providers: []
})

export class ArgumentListComponent {
  public title = 'Tour of Heroes';
	
  ngOnInit() {
    //
  }
}
