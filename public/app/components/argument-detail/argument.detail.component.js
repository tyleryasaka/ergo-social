System.register(['angular2/core', 'angular2/router', '../../services/api/api.service', '../../classes/classes'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, router_1, api_service_1, classes_1;
    var ArgumentDetailComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (api_service_1_1) {
                api_service_1 = api_service_1_1;
            },
            function (classes_1_1) {
                classes_1 = classes_1_1;
            }],
        execute: function() {
            ArgumentDetailComponent = (function () {
                function ArgumentDetailComponent(router, api, params) {
                    var _this = this;
                    this.router = router;
                    this.api = api;
                    this.params = params;
                    this.argument = new classes_1.Argument;
                    this.premises = [];
                    this.conclusion = new classes_1.Conclusion;
                    this.comments = [];
                    this.goTo = function (item) {
                        _this.trail.push(item.split('/')[1]);
                        _this.load(function () { return _this.updateUrl(); });
                    };
                    this.goBackTo = function (index) {
                        _this.trail.splice(index + 1, _this.trail.length - (index + 1));
                        var lastItem = _this.trail.length - 1;
                        _this.trail[lastItem] = _this.trail[lastItem]._key;
                        _this.load(function () { return _this.updateUrl(); });
                    };
                    this.load = function (callback) {
                        _this.api.argumentDetail(_this.trail[_this.trail.length - 1]).then(function (res) {
                            _this.argument = res.data.argument;
                            _this.premises = res.data.premises;
                            _this.conclusion = res.data.conclusion;
                            _this.comments = res.data.comments;
                            _this.trail[_this.trail.length - 1] = _this.argument;
                            if (callback) {
                                callback();
                            }
                        });
                    };
                    this.updateUrl = function () {
                        var stringTrail = [];
                        for (var t in _this.trail) {
                            stringTrail.push(_this.trail[t]._key);
                        }
                        var url = stringTrail.join('.');
                        _this.router.navigate(['ArgumentDetail', { key: url }]);
                    };
                    this.trail = this.params.get('key').split('.');
                }
                ArgumentDetailComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this.load(function () {
                        for (var t = 0; t < _this.trail.length - 1; t++) {
                            var tCopy = t;
                            _this.api.argumentDetail(_this.trail[tCopy]).then(function (res) {
                                _this.trail[tCopy] = res.data.argument;
                            });
                        }
                    });
                };
                ArgumentDetailComponent = __decorate([
                    core_1.Component({
                        selector: 'argument-detail',
                        template: "\n\t\t\t<div class=\"ui large breadcrumb\">\n\t\t\t\t<span *ngFor=\"#argument of trail; #i = index; #last = last\">\n\t\t\t\t\t<a class=\"section\" (click)=\"goBackTo(i)\" *ngIf=\"!last\">{{argument.title}}</a>\n\t\t\t\t\t<i *ngIf=\"!last\" class=\"right angle icon divider\"></i>\n\t\t\t\t\t<span *ngIf=\"last\">{{argument.title}}</span>\n\t\t\t\t</span>\n\t\t\t\t\n\t\t\t</div>\n\t\t\t<h1 class=\"ui center aligned header\">{{argument.title}}</h1>\n\t\t\t<div class=\"ui stackable mobile reversed divided grid\">\n\t\t\t\t<div class=\"six wide column\">\n\t\t\t\t\t<h3 class=\"ui blue centered header\">Comments</h3>\n\t\t\t\t\t<div class=\"ui raised clearing segment\" *ngFor=\"#comment of comments\">\n\t\t\t\t\t\t<div class=\"ergo-comments-header\">\n\t\t\t\t\t\t\t<a>\n\t\t\t\t\t\t\t\t<i class=\"user icon\"></i>\n\t\t\t\t\t\t\t\t{{comment.statement.author}}\n\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t<a class=\"ergo-comments-expand\">\n\t\t\t\t\t\t\t\t<i class=\"expand icon\"></i>\n\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t{{comment.statement.content}}\n\t\t\t\t\t\t<div class=\"ergo-comments-footer\" *ngIf=\"comment.subarguments.length || comment.comments.length\">\n\t\t\t\t\t\t\t<a class=\"ui small violet label ergo-comments-label\" *ngIf=\"comment.subarguments.length\" (click)=\"goTo(comment.subarguments[0])\">\n\t\t\t\t\t\t\t\t<i class=\"level down icon\"></i>\n\t\t\t\t\t\t\t\t{{comment.subarguments.length}}\n\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t<a class=\"ui small blue label ergo-comments-label\" *ngIf=\"comment.comments.length\">\n\t\t\t\t\t\t\t\t<i class=\"comment icon\"></i>\n\t\t\t\t\t\t\t\t{{comment.comments.length}}\n\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t\n\t\t\t\t<div class=\"ten wide column\">\n\t\t\t\t\t<div class=\"ui fluid grey card\">\n\t\t\t\t\t\t<div class=\"content\">\n\t\t\t\t\t\t\t<h3 class=\"ui grey header\">\n\t\t\t\t\t\t\t\tConclusion\n\t\t\t\t\t\t\t\t<a class=\"ergo-comments-expand\">\n\t\t\t\t\t\t\t\t\t<i class=\"expand grey icon\"></i>\n\t\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t</h3>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"content\">\n\t\t\t\t\t\t\t{{conclusion.statement.content}}\n\t\t\t\t\t\t\t<div class=\"ergo-comments-footer\" *ngIf=\"conclusion.comments.length\">\n\t\t\t\t\t\t\t\t<a class=\"ui small blue label ergo-comments-label\">\n\t\t\t\t\t\t\t\t\t<i class=\"comment icon\"></i>\n\t\t\t\t\t\t\t\t\t{{conclusion.comments.length}}\n\t\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t\n\t\t\t\t\t<h6 class=\"ui center aligned icon header\" *ngIf=\"premises.length\">\n\t\t\t\t\t\t<i class=\"level down violet icon\"></i>\n\t\t\t\t\t</h6>\n\t\t\t\t\t\n\t\t\t\t\t<div class=\"ui fluid violet card premise\" *ngFor=\"#premise of premises\">\n\t\t\t\t\t\t<div class=\"content\">\n\t\t\t\t\t\t\t<h3 class=\"ui violet header\">\n\t\t\t\t\t\t\t\tPremise\n\t\t\t\t\t\t\t\t<a class=\"ergo-comments-expand\">\n\t\t\t\t\t\t\t\t\t<i class=\"expand violet icon\"></i>\n\t\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t</h3>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"content\">\n\t\t\t\t\t\t\t{{premise.statement.content}}\n\t\t\t\t\t\t\t<div class=\"ergo-comments-footer\" *ngIf=\"premise.subarguments.length || premise.comments.length\">\n\t\t\t\t\t\t\t\t<a class=\"ui small violet label ergo-comments-label\" *ngIf=\"premise.subarguments.length\" (click)=\"goTo(premise.subarguments[0])\">\n\t\t\t\t\t\t\t\t\t<i class=\"level down icon\"></i>\n\t\t\t\t\t\t\t\t\t{{premise.subarguments.length}}\n\t\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t\t<a class=\"ui small blue label ergo-comments-label\" *ngIf=\"premise.comments.length\">\n\t\t\t\t\t\t\t\t\t<i class=\"comment icon\"></i>\n\t\t\t\t\t\t\t\t\t{{premise.comments.length}}\n\t\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t",
                        styles: ["\n\t\t\t.ergo-comments-header {\n\t\t\t\tmargin-bottom: 20px;\n\t\t\t}\n\t\t\t.ergo-comments-footer {\n\t\t\t\tmargin-top: 20px;\n\t\t\t}\n\t\t\t.ergo-comments-expand {\n\t\t\t\tfloat: right;\n\t\t\t}\n\t\t\t.ergo-comments-footer .ergo-comments-label {\n\t\t\t\tfloat: right;\n\t\t\t\tmargin-left: 5px;\n\t\t\t}\n\t\t\t.premise {\n\t\t\t\tmargin: 25px 0 25px 0;\n\t\t\t}\n\t\t"],
                        directives: [router_1.RouterOutlet],
                        providers: []
                    }), 
                    __metadata('design:paramtypes', [router_1.Router, api_service_1.APIService, router_1.RouteParams])
                ], ArgumentDetailComponent);
                return ArgumentDetailComponent;
            })();
            exports_1("ArgumentDetailComponent", ArgumentDetailComponent);
        }
    }
});
//# sourceMappingURL=argument.detail.component.js.map