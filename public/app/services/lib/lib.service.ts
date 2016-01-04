import {Injectable} from 'angular2/core';

@Injectable()

export class LibService {
	onEnter(event, action) {
		if(event.keyCode == 13) action();
	}
}
