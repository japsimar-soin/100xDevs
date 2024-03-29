//todo server using file

const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const PORT = 3000;
const app = express();

app.use(bodyParser.json());
app.use(cors());

//todos.json file contains all the entries for stored objects. While reading from file, we simply res.json([data form file])
app.get("/todos", (req, res) => {
	fs.readFile("todos.json", "utf8", (err, data) => {
		if (err) throw err;
		res.json(JSON.parse(data)); //data is what is read from the file --> parse it to JS notation
	});
});

function findIndex(arr, id) {
	for (let i = 0; i < arr.length; i++) {
		if (arr[i].id === id) {
			return i;
		}
	}
	return -1;
}

app.get("/todos/:id", (req, res) => {
	fs.readFile("todos.json", "utf8", (err, data) => {
		let arr = JSON.parse(data); //JSON format mein sabki list aagyi
		let idx = findIndex(arr, parseInt(req.params.id));
		if (idx == -1) {
			return res.status(404).send();
		} else {
			res.status(200).json(arr[idx]);
		}
	});
});

app.post("/todos", (req, res) => {
	const newTodo = {
		id: Math.floor(Math.random() * 1000000),
		title: req.body.title,
		description: req.body.description,
	};
	fs.readFile("todos.json", "utf8", (err, data) => {
		if (err) throw err;
		let arr = JSON.parse(data);
		arr.push(newTodo);
		//write the new array back to the file
		fs.writeFile("todos.json", JSON.stringify(arr), (err) => {
			if (err) throw err;
			res.status(200).json(newTodo);
		});
	});
	// const newTodos = req.body;
	// fs.readFile("todos.json", "utf8", (err, data) => {
	// 	if (err) throw err;
	// 	let arr = JSON.parse(data);
	// 	newTodos.forEach((element) => {
	// 		const newTodo = {
	// 			id: Math.floor(Math.random() * 1000000),
	// 			title: element.title,
	// 			description: element.description,
	// 		};
	// 		arr.push(newTodo);
	// 	});
	// 	//write the new array back to the file
	// 	fs.writeFile("todos.json", JSON.stringify(arr), (err) => {
	// 		if (err) throw err;
	// 		res.status(200).json(newTodos);
	// 	});
	// });
});

app.put("/todos/:id", (req, res) => {
	//agar "id" exist hi nhi krti, then directly 404, else create updated todo and add to file
	fs.readFile("todos.json", "utf8", (err, data) => {
		let arr = JSON.parse(data);
		const idx = findIndex(arr, parseInt(req.params.id));
		if (idx == -1) {
			res.status(404).send();
		}
		const updatedTodo = {
			id: arr[idx].id,
			title: req.body.title,
			description: req.body.description,
		};
		arr[idx] = updatedTodo;
		fs.writeFile("todos.json", JSON.stringify(arr), (err) => {
			if (err) throw err;
			res.status(200).send(updatedTodo);
		});
	});
});

function removeAtIndex(arr, id) {
	let newArr = [];
	for (let i = 0; i < arr.length; i++) {
		if (i != id) {
			newArr.push(arr[i]);
		}
	}
	return newArr;
}

app.delete("/todos/:id", (req, res) => {
	fs.readFile("todos.json", "utf8", (err, data) => {
		if (err) throw err;
		let arr = JSON.parse(data);
		const idx = findIndex(arr, parseInt(req.params.id));
		if (idx == -1) {
			res.status(400).send("Invalid id");
		} else {
			arr = removeAtIndex(arr, idx);
			fs.writeFile("todos.json", JSON.stringify(arr), (err) => {
				if (err) throw err;
				res.status(200).json();
			});
		}
	});
});

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "index.html"));
});

// app.use((req, res, next) => {
// 	res.status(404).send();
// });

app.listen(PORT, () => {
	console.log("listening at port 3000");
});

// module.exports = app;
