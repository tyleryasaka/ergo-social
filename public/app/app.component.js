System.register(['angular2/core', 'angular2/router', './home/home.component', './argument/list/argument.list.component', './argument/detail/argument.detail.component'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, router_1, home_component_1, argument_list_component_1, argument_detail_component_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (home_component_1_1) {
                home_component_1 = home_component_1_1;
            },
            function (argument_list_component_1_1) {
                argument_list_component_1 = argument_list_component_1_1;
            },
            function (argument_detail_component_1_1) {
                argument_detail_component_1 = argument_detail_component_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent() {
                    this.title = 'Tour of Heroes..';
                }
                AppComponent.prototype.ngOnInit = function () {
                    //
                };
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'app',
                        template: "\n\t\t\t\t<div class=\"ui menu\">\n\t\t\t\t\t<div class=\"ui container\">\n\t\t\t\t\t\t<a [routerLink]=\"['Home']\" class=\"header item\">\n\t\t\t\t\t\t\tergo\n\t\t\t\t\t\t</a>\n\t\t\t\t\t\t<div class=\"right menu\">\n\t\t\t\t\t\t\t<a class=\"item\" [routerLink]=\"['ArgumentList']\">\n\t\t\t\t\t\t\t\tMy arguments\n\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\n\t\t\t\t<div class=\"ui grid container\">\n\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t<div class=\"column\">\n\t\t\t\t\t\t\t<div class=\"content\">\n\t\t\t\t\t\t\t\t<router-outlet></router-outlet>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t",
                        directives: [router_1.ROUTER_DIRECTIVES],
                        providers: []
                    }),
                    router_1.RouteConfig([
                        { path: '/', name: 'Home', component: home_component_1.HomeComponent },
                        { path: '/arguments', name: 'ArgumentList', component: argument_list_component_1.ArgumentListComponent },
                        { path: '/arguments/:key', name: 'ArgumentDetail', component: argument_detail_component_1.ArgumentDetailComponent }
                    ]), 
                    __metadata('design:paramtypes', [])
                ], AppComponent);
                return AppComponent;
            })();
            exports_1("AppComponent", AppComponent);
        }
    }
});
//# sourceMappingURL=app.component.js.map