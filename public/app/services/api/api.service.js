System.register(['angular2/core', 'angular2/http'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, http_1;
    var APIService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            }],
        execute: function() {
            APIService = (function () {
                function APIService(http) {
                    this.apiUrl = '/api/0.0';
                    this.httpGet = function (url) {
                        var _this = this;
                        url = this.apiUrl + url;
                        var promise = new Promise(function (resolve, reject) {
                            _this.http.get(url).subscribe(function (res) { resolve(res.json()); });
                        });
                        return promise;
                    };
                    this.httpPost = function (url, params) {
                        var _this = this;
                        var headers = new http_1.Headers();
                        url = this.apiUrl + url;
                        headers.append('Content-Type', 'application/json');
                        var params = JSON.stringify(params);
                        var promise = new Promise(function (resolve, reject) {
                            _this.http.post(url, params, { headers: headers })
                                .subscribe(function (res) { resolve(res.json()); });
                        });
                        return promise;
                    };
                    this.http = http;
                }
                APIService.prototype.isLoggedIn = function () {
                    return this.httpGet('/login/');
                };
                APIService.prototype.login = function (credentials) {
                    return this.httpPost('/login/', credentials);
                };
                APIService.prototype.logout = function () {
                    return this.httpGet('/logout/');
                };
                APIService.prototype.argumentList = function (router) {
                    var promise = this.httpGet('/argument/');
                    this.ensureLoggedIn(promise, router);
                    return promise;
                };
                APIService.prototype.argumentDetail = function (argKey) {
                    return this.httpGet('/argument/' + argKey);
                };
                APIService.prototype.ensureLoggedIn = function (promise, router) {
                    promise.then(function (res) {
                        if (res.status == "error" && res.message == "unauthorized") {
                            router.navigate(['Home']);
                        }
                    });
                };
                APIService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], APIService);
                return APIService;
            })();
            exports_1("APIService", APIService);
        }
    }
});
//# sourceMappingURL=api.service.js.map