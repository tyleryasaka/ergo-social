app.controller('ArgumentController', [
	'$scope',
	function($scope) {
		$scope.arguments = [
			{
				"isDeductive": true,
				"isAtomic": false,
				"author": "tyler",
				"title": "An argument",
				"_id": "argument/26905279475",
				"_rev": "26905279475",
				"_key": "26905279475"
			},
			{
				"isDeductive": true,
				"isAtomic": false,
				"author": "tyler",
				"title": "Another argument",
				"_id": "argument/26896038899",
				"_rev": "26896038899",
				"_key": "26896038899"
			},
			{
				"isDeductive": false,
				"isAtomic": false,
				"author": "tyler",
				"title": "I feel so... argumentative...",
				"_id": "argument/26896038899",
				"_rev": "26896038899",
				"_key": "26896038899"
			}
		];
	}
]);
