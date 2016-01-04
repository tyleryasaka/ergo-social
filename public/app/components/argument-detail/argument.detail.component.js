System.register(['angular2/core', 'angular2/router'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, router_1;
    var ArgumentDetailComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            }],
        execute: function() {
            ArgumentDetailComponent = (function () {
                function ArgumentDetailComponent() {
                    this.title = 'Argument';
                }
                ArgumentDetailComponent.prototype.ngOnInit = function () {
                    //
                };
                ArgumentDetailComponent = __decorate([
                    core_1.Component({
                        selector: 'argument-detail',
                        template: "\n\t\t\t<h1>{{title}}</h1>\n\t\t\t",
                        directives: [router_1.RouterOutlet],
                        providers: []
                    }), 
                    __metadata('design:paramtypes', [])
                ], ArgumentDetailComponent);
                return ArgumentDetailComponent;
            })();
            exports_1("ArgumentDetailComponent", ArgumentDetailComponent);
        }
    }
});
//# sourceMappingURL=argument.detail.component.js.map