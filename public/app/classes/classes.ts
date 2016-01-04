export class Argument {
	_id: string;
	_key: string[];
	author: string;
	title: string;
	
	constructor() {
		this._id = '';
		this._key = '';
		this.author = '';
		this.title = '';
	}
}


export class Statement {
	_id: string;
	_key: string;
	author: string;
	content: string;
	
	constructor() {
		this._id = '';
		this._key = '';
		this.author = '';
		this.content = '';
	}
}

export class Conclusion {
	statement: Statement;
	comments: string[];
	
	constructor() {
		this.statement = new Statement;
		this.comments = [];
	}
}

export class Premise {
	statement: Statement;
	comments: string[];
	subarguments: string[];
	
	constructor() {
		this.statement = new Statement;
		this.comments = [];
		this.subarguments = [];
	}
}

export class Comment {
	statement: Statement;
	comments: string[];
	subarguments: string[];
	
	constructor() {
		this.statement = new Statement;
		this.comments = [];
		this.subarguments = [];
	}
}

export class Credentials {
	constructor() {
		this.username = '';
		this.password = '';
	}
	username: string;
	password: string;
}
