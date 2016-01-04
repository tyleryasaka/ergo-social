import {Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';

@Injectable()

export class APIService {
	
	private http: Http;
	private apiUrl = '/api/0.0';
	
	constructor(http: Http) {
		this.http = http;
	}
	
	isLoggedIn() {
		return this.httpGet('/login/');
	}
	
	login(credentials) {
		return this.httpPost('/login/', credentials);
	}
	
	logout() {
		return this.httpGet('/logout/');
	}
	
	argumentList(router) {
		var promise = this.httpGet('/argument/');
		this.ensureLoggedIn(promise, router);
		return promise;
	}
	
	argumentDetail(argKey) {
		return this.httpGet('/argument/' + argKey);
	}
	
	private httpGet = function(url) {
		url = this.apiUrl + url;
		var promise = new Promise( (resolve, reject) => {
			this.http.get(url).subscribe( res => { resolve(res.json()) });
		});
		return promise;
	}
	
	private httpPost = function(url, params) {
		var headers = new Headers();
		url = this.apiUrl + url;
		headers.append('Content-Type', 'application/json');
		var params: any = JSON.stringify(params);
		var promise = new Promise( (resolve, reject) => {
			this.http.post(url, params, {headers: headers})
			.subscribe( res => { resolve(res.json()) });
		});
		return promise;
	}
	
	private ensureLoggedIn(promise, router) {
		promise.then( res => {
			if(res.status == "error" && res.message == "unauthorized") {
				router.navigate(['Home']);
			}
		});
	}
}
