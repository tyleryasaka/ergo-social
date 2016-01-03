import {Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';

@Injectable()

export class APIService {
	
	private http: Http;
	
	constructor(http: Http) {
		this.http = http;
	}
	
	login(credentials) {
		return this.httpPost('/api/0.0/login/', credentials);
	}
	
	getArguments() {
		return this.httpGet('/api/0.0/argument/');
	}
	
	private httpGet = function(url) {
		var promise = new Promise( (resolve, reject) => {
			this.http.get(url).subscribe( res => { resolve(res.json()) });
		});
		return promise;
	}
	
	private httpPost = function(url, params) {
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');
		var params: any = JSON.stringify(params);
		var promise = new Promise( (resolve, reject) => {
			this.http.post(url, params, {headers: headers})
			.subscribe( res => { resolve(res.json()) });
		});
		return promise;
	}
}
