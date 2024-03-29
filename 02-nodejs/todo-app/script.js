function onPress() {
	function parseResponse(data) {
		console.log(data);
	}
	fetch("http://localhost:3000/todos", { method: "GET" }).then((resp) => {
		resp.json().then(parseResponse);
	});
}
