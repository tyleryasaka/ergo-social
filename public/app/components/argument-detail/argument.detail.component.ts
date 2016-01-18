import {Component, OnInit} from 'angular2/core';
import {RouteConfig, RouterOutlet, Router, RouteParams} from 'angular2/router';
import {APIService} from '../../services/api/api.service';
import {Argument, Statement, Conclusion, Premise, Comment} from '../../classes/classes';

@Component({
    selector: 'argument-detail',
		template: `
			<div class="ui large breadcrumb">
				<span *ngFor="#argument of trail; #i = index; #last = last">
					<a class="section" (click)="goBackTo(i)" *ngIf="!last">{{argument.title}}</a>
					<i *ngIf="!last" class="right angle icon divider"></i>
					<span *ngIf="last">{{argument.title}}</span>
				</span>
				
			</div>
			<h1 class="ui center aligned header">{{argument.title}}</h1>
			<div class="ui stackable mobile reversed divided grid">
				<div class="six wide column">
					<h3 class="ui blue centered header">Comments</h3>
					<div class="ui raised clearing segment" *ngFor="#comment of comments">
						<div class="ergo-comments-header">
							<a>
								<i class="user icon"></i>
								{{comment.statement.author}}
							</a>
							<a class="ergo-comments-expand">
								<i class="expand icon"></i>
							</a>
						</div>
						{{comment.statement.content}}
						<div class="ergo-comments-footer" *ngIf="comment.subarguments.length || comment.comments.length">
							<a class="ui small violet label ergo-comments-label" *ngIf="comment.subarguments.length" (click)="goTo(comment.subarguments[0])">
								<i class="level down icon"></i>
								{{comment.subarguments.length}}
							</a>
							<a class="ui small blue label ergo-comments-label" *ngIf="comment.comments.length">
								<i class="comment icon"></i>
								{{comment.comments.length}}
							</a>
						</div>
					</div>
				</div>
				
				<div class="ten wide column">
					<div class="ui fluid grey card">
						<div class="content">
							<h3 class="ui grey header">
								Conclusion
								<a class="ergo-comments-expand">
									<i class="expand grey icon"></i>
								</a>
							</h3>
						</div>
						<div class="content">
							{{conclusion.statement.content}}
							<div class="ergo-comments-footer" *ngIf="conclusion.comments.length">
								<a class="ui small blue label ergo-comments-label">
									<i class="comment icon"></i>
									{{conclusion.comments.length}}
								</a>
							</div>
						</div>
					</div>
					
					<h6 class="ui center aligned icon header" *ngIf="premises.length">
						<i class="level down violet icon"></i>
					</h6>
					
					<div class="ui fluid violet card premise" *ngFor="#premise of premises">
						<div class="content">
							<h3 class="ui violet header">
								Premise
								<a class="ergo-comments-expand">
									<i class="expand violet icon"></i>
								</a>
							</h3>
						</div>
						<div class="content">
							{{premise.statement.content}}
							<div class="ergo-comments-footer" *ngIf="premise.subarguments.length || premise.comments.length">
								<a class="ui small violet label ergo-comments-label" *ngIf="premise.subarguments.length" (click)="goTo(premise.subarguments[0])">
									<i class="level down icon"></i>
									{{premise.subarguments.length}}
								</a>
								<a class="ui small blue label ergo-comments-label" *ngIf="premise.comments.length">
									<i class="comment icon"></i>
									{{premise.comments.length}}
								</a>
							</div>
						</div>
						
					</div>
				</div>
			</div>
		`,
		styles: [`
			.ergo-comments-header {
				margin-bottom: 20px;
			}
			.ergo-comments-footer {
				margin-top: 20px;
			}
			.ergo-comments-expand {
				float: right;
			}
			.ergo-comments-footer .ergo-comments-label {
				float: right;
				margin-left: 5px;
			}
			.premise {
				margin: 25px 0 25px 0;
			}
		`],
		directives: [RouterOutlet],
		providers: []
})

export class ArgumentDetailComponent {
	public argument: Argument = new Argument;
	public premises: Premise[] = [];
	public conclusion: Conclusion = new Conclusion;
	public comments: Comment[] = [];
	public trail;
	
	constructor(
		private router: Router,
		private api: APIService,
		private params: RouteParams
	) {
		this.trail = this.params.get('key').split('.');
	}
	
	goTo = item => {
		this.trail.push(item.split('/')[1]);
		this.load( () => this.updateUrl() );
	}
	
	goBackTo = index => {
		this.trail.splice( index + 1, this.trail.length - (index + 1) );
		var lastItem = this.trail.length - 1;
		this.trail[lastItem] = this.trail[lastItem]._key;
		this.load( () => this.updateUrl() );
	}
	
	load = callback => {
    this.api.argumentDetail(this.trail[this.trail.length -1]).then(res => {
			this.argument = res.data.argument;
			this.premises = res.data.premises;
			this.conclusion = res.data.conclusion;
			this.comments = res.data.comments;
			this.trail[this.trail.length - 1] = this.argument;
			if(callback) {
				callback();
			}
		});
	}
	
	updateUrl = () => {
		var stringTrail = [];
		for(var t in this.trail) {
			stringTrail.push(this.trail[t]._key);
		}
		var url = stringTrail.join('.');
		this.router.navigate(['ArgumentDetail', {key: url}]);
	}
	
  ngOnInit() {
		this.load( () => {
			for(var t = 0; t < this.trail.length - 1; t++) {
				var tCopy = t;
				this.api.argumentDetail(this.trail[tCopy]).then(res => {
					this.trail[tCopy] = res.data.argument;
				});
			}
		});
  }
}
