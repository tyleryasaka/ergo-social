System.register(['angular2/core', 'angular2/router', '../../api/api.service'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, router_1, api_service_1;
    var ArgumentListComponent;
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
            }],
        execute: function() {
            ArgumentListComponent = (function () {
                function ArgumentListComponent(api) {
                    this.api = api;
                    this.title = 'My arguments';
                }
                ArgumentListComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this.api.getArguments().then(function (res) { return _this.arguments = res.data; });
                };
                ArgumentListComponent = __decorate([
                    core_1.Component({
                        selector: 'argument-list',
                        template: "\n\t\t\t<h1>{{title}}</h1>\n\t\t\t<div class=\"ui big middle aligned selection very relaxed celled list\">\n\t\t\t\t<div class=\"item\" *ngFor=\"#argument of arguments\">\n\t\t\t\t\t{{argument.title}}\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t",
                        directives: [router_1.RouterOutlet],
                        providers: []
                    }), 
                    __metadata('design:paramtypes', [api_service_1.APIService])
                ], ArgumentListComponent);
                return ArgumentListComponent;
            })();
            exports_1("ArgumentListComponent", ArgumentListComponent);
        }
    }
});
//# sourceMappingURL=argument.list.component.js.map