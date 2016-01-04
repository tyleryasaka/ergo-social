System.register([], function(exports_1) {
    var Argument, Statement, Conclusion, Premise, Comment, Credentials;
    return {
        setters:[],
        execute: function() {
            Argument = (function () {
                function Argument() {
                    this._id = '';
                    this._key = '';
                    this.author = '';
                    this.title = '';
                }
                return Argument;
            })();
            exports_1("Argument", Argument);
            Statement = (function () {
                function Statement() {
                    this._id = '';
                    this._key = '';
                    this.author = '';
                    this.content = '';
                }
                return Statement;
            })();
            exports_1("Statement", Statement);
            Conclusion = (function () {
                function Conclusion() {
                    this.statement = new Statement;
                    this.comments = [];
                }
                return Conclusion;
            })();
            exports_1("Conclusion", Conclusion);
            Premise = (function () {
                function Premise() {
                    this.statement = new Statement;
                    this.comments = [];
                    this.subarguments = [];
                }
                return Premise;
            })();
            exports_1("Premise", Premise);
            Comment = (function () {
                function Comment() {
                    this.statement = new Statement;
                    this.comments = [];
                    this.subarguments = [];
                }
                return Comment;
            })();
            exports_1("Comment", Comment);
            Credentials = (function () {
                function Credentials() {
                    this.username = '';
                    this.password = '';
                }
                return Credentials;
            })();
            exports_1("Credentials", Credentials);
        }
    }
});
//# sourceMappingURL=classes.js.map