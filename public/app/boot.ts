import {bootstrap}    from 'angular2/platform/browser';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';

import {AppComponent} from './components/app.component';
import {LibService} from './services/lib/lib.service';
import {APIService} from './services/api/api.service';

bootstrap( AppComponent, [
	ROUTER_PROVIDERS,
	HTTP_PROVIDERS,
	APIService,
	LibService
]);
