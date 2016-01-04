System.register(['angular2/core', 'angular2/router', './home/home.component', './argument-list/argument.list.component', './argument-detail/argument.detail.component', '../services/lib/lib.service', '../services/api/api.service', '../classes/classes'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, router_1, home_component_1, argument_list_component_1, argument_detail_component_1, lib_service_1, api_service_1, classes_1;
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
            },
            function (lib_service_1_1) {
                lib_service_1 = lib_service_1_1;
            },
            function (api_service_1_1) {
                api_service_1 = api_service_1_1;
            },
            function (classes_1_1) {
                classes_1 = classes_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent(api, lib, router) {
                    var _this = this;
                    this.api = api;
                    this.lib = lib;
                    this.router = router;
                    this.isLoggedIn = false;
                    this.credentials = new classes_1.Credentials();
                    this.loginErrors = [];
                    this.loginModal = function () {
                        _this.loginErrors = [];
                        _this.credentials = new classes_1.Credentials();
                        $('.ui.modal#login-modal').modal('show');
                    };
                    this.login = function () {
                        _this.api.login(_this.credentials).then(function (res) {
                            _this.loginErrors = [];
                            if (res.status == "success") {
                                _this.isLoggedIn = true;
                                _this.router.navigate(['ArgumentList']).then(function () {
                                    $('.ui.modal#login-modal').modal('hide');
                                });
                            }
                            else {
                                _this.loginErrors.push('Invalid credentials');
                                setTimeout(function () { return $('#loginErrors').transition('pulse'); }, 100);
                            }
                            _this.credentials.password = ''; // don't let this data hang around
                        });
                    };
                    this.logout = function () {
                        _this.api.logout().then(function (res) {
                            _this.router.navigate(['Home']).then(function (res) {
                                _this.isLoggedIn = false;
                            });
                        });
                    };
                }
                AppComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this.api.isLoggedIn().then(function (res) { return _this.isLoggedIn = res.data; });
                };
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'app',
                        template: "\n\t\t\t\t<div class=\"ui menu\">\n\t\t\t\t\t<div class=\"ui container\">\n\t\t\t\t\t\t<a [routerLink]=\"['Home']\" class=\"header item\">\n\t\t\t\t\t\t\tergo\n\t\t\t\t\t\t</a>\n\t\t\t\t\t\t<a class=\"item\" (click)=\"registerModal()\" *ngIf=\"!isLoggedIn\">\n\t\t\t\t\t\t\tRegister\n\t\t\t\t\t\t</a>\n\t\t\t\t\t\t<div class=\"right menu\">\n\t\t\t\t\t\t\t<a class=\"item\" [routerLink]=\"['ArgumentList']\" *ngIf=\"isLoggedIn\">\n\t\t\t\t\t\t\t\tMy arguments\n\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t<a class=\"item\" (click)=\"logout()\" *ngIf=\"isLoggedIn\">\n\t\t\t\t\t\t\t\tLogout\n\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t<a class=\"item\" (click)=\"loginModal()\" *ngIf=\"!isLoggedIn\">\n\t\t\t\t\t\t\t\tLogin\n\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\n\t\t\t\t<div class=\"ui grid container\">\n\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t<div class=\"column\">\n\t\t\t\t\t\t\t<div class=\"content\">\n\t\t\t\t\t\t\t\t<router-outlet></router-outlet>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t\n\t\t\t\t<div class=\"ui small modal\" id=\"login-modal\">\n\t\t\t\t\t<i class=\"close icon\"></i>\n\t\t\t\t\t\t<div class=\"header\">\n\t\t\t\t\t\t\tLogin\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"content\">\n\t\t\t\t\t\t\t<form class=\"ui form\" (keypress)=\"lib.onEnter($event, login)\">\n\t\t\t\t\t\t\t\t<div class=\"ui negative message\" id=\"loginErrors\" *ngIf=\"loginErrors.length\">\n\t\t\t\t\t\t\t\t\t<div class=\"header\">Try again</div>\n\t\t\t\t\t\t\t\t\t<ul class=\"list\">\n\t\t\t\t\t\t\t\t\t\t<li *ngFor=\"#loginError of loginErrors\">{{loginError}}</li>\n\t\t\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\"field\">\n\t\t\t\t\t\t\t\t\t<label>Username</label>\n\t\t\t\t\t\t\t\t\t<input type=\"text\" placeholder=\"Username\" [(ngModel)]=\"credentials.username\">\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\"field\">\n\t\t\t\t\t\t\t\t\t<label>Password</label>\n\t\t\t\t\t\t\t\t\t<input type=\"password\" placeholder=\"Password\" [(ngModel)]=\"credentials.password\">\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</form>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"actions\">\n\t\t\t\t\t\t\t<button class=\"ui black button\" (click)=\"login()\">Submit</button>\n\t\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t",
                        styles: ["\n\t\t\t.ui.menu .container {\n\t\t\t\tborder-right: 1px solid rgba(34,36,38,.1);\n\t\t\t}\n\t\t"],
                        directives: [router_1.ROUTER_DIRECTIVES],
                        providers: []
                    }),
                    router_1.RouteConfig([
                        { path: '/', name: 'Home', component: home_component_1.HomeComponent, useAsDefault: true },
                        { path: '/arguments', name: 'ArgumentList', component: argument_list_component_1.ArgumentListComponent },
                        { path: '/arguments/:key', name: 'ArgumentDetail', component: argument_detail_component_1.ArgumentDetailComponent }
                    ]), 
                    __metadata('design:paramtypes', [api_service_1.APIService, lib_service_1.LibService, router_1.Router])
                ], AppComponent);
                return AppComponent;
            })();
            exports_1("AppComponent", AppComponent);
        }
    }
});
//# sourceMappingURL=app.component.js.map