System.register(['angular2/platform/browser', 'angular2/router', 'angular2/http', './components/app.component', './services/lib/lib.service', './services/api/api.service'], function(exports_1) {
    var browser_1, router_1, http_1, app_component_1, lib_service_1, api_service_1;
    return {
        setters:[
            function (browser_1_1) {
                browser_1 = browser_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (app_component_1_1) {
                app_component_1 = app_component_1_1;
            },
            function (lib_service_1_1) {
                lib_service_1 = lib_service_1_1;
            },
            function (api_service_1_1) {
                api_service_1 = api_service_1_1;
            }],
        execute: function() {
            browser_1.bootstrap(app_component_1.AppComponent, [
                router_1.ROUTER_PROVIDERS,
                http_1.HTTP_PROVIDERS,
                api_service_1.APIService,
                lib_service_1.LibService
            ]);
        }
    }
});
//# sourceMappingURL=boot.js.map