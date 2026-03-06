// start creating server here
import http from "http";
import { URL } from "url";
import fs from "fs";
let todos = [];
let todoIds = 1;
const server = http.createServer(async (req, res) => {
  const { url, method } = req;

  if (method === "POST" && url === "/create/todo") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      //   const newTodo = JSON.parse(body);
      //   newTodo.id = todoIds++;
      fs.readFile("./data.txt", "utf-8", (err, data) => {
        if (err) return console.log(`Erorrr in reading file ${err}`);
        if (data) {
          todos = JSON.parse(data);
        }
        const newTodo = JSON.parse(body);
        newTodo.id = todoIds++;
        todos.push(newTodo);
        fs.writeFile("./data.txt", JSON.stringify(todos), (err) => {
          if (err) console.log(`Error reading in the file ${err}`);
          console.log(todos);
          res.setHeader("Content-Type", "application/json"); // sets the heaer so we can send the data in JSON
          res.end(JSON.stringify(todos));
        });
      });
    });
  }

  if (method === "GET" && url === "/todos") {
    fs.readFile("./data.txt", "utf-8", (err, data) => {
      if (err) return console.log(`Error on reading file ${err}`);

      todos = JSON.parse(data);
      //   console.log(todos);
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(todos));
    });
  }

  if (method === "GET" && url.startsWith("/todo?")) {
    const id = url.split("?")[1].split("=")[1];

    fs.readFile("./data.txt", "utf-8", (err, data) => {
      if (err) console.log(`Erorr ${err}`);

      todos = JSON.parse(data);
      const todo = todos.find((e) => e.id === Number(id));
      console.log(id, todos, todo);
      if (!todo) {
        res.writeHead(404, { "content-type": "application/json" });
        return res.end(`{"error":"Todo not found"}`);
      }

      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify(todo));
    });
  }

  if (method === "DELETE" && url.startsWith("/todo?")) {
    const id = url.split("?")[1].split("=")[1];

    fs.readFile("./data.txt", "utf-8", (err, data) => {
      if (err) console.log(`Error in reading file ${err}`);

      todos = JSON.parse(data);

      let todo = todos.find((e) => e.id === Number(id));
      if (!todo) {
        res.writeHead(404, { "content-type": "application/json" });
        return res.end(`"error":"Todo not found"`);
      }
      todos = todos.filter((e) => e.id !== Number(id));
      fs.writeFile("./data.txt", JSON.stringify(todos), (err) => {
        if (err) console.log(`Error on writing file`);
        res.end("Deleteion Succeess");
      });
    });
  }

  if (method === "GET" && (url==="/" || url.startsWith("/?"))){
    // console.log("hello");
    res.writeHead(200, { "content-type": "application/ son" });
    res.end("Hello World");
  }
  //   console.log(url, method);
});

server.listen(3000, () => {
  console.log("sERVER ON LISTENING PORT 3000");
});
