const express = require("express");
const app = express();
const port = 3000;

// serve react app html
app.use(express.static("dist"));

app.listen(port, () => {
  console.log(`React app listening on port ${port}`);
});

const net = require("net");

// client.on("data", (data) => {
//   console.log(`Data received: ${data.toString("utf-8")}$`);
// });

// act as intermediate for react app and tcp server on get request
app.get("/device", (req, res) => {
  const client = net.connect({ port: 33337, host: "10.0.0.1" }, () => {
    console.log("Connected to tcp config!");
  });

  const command = req.query.command;

  // send command to tcp server
  client.write(command + "\n");

  // Listen for the response from the TCP server
  client.on("data", (data) => {
    console.log(`Received response from MHA: \n\n ${data}`);
    // Convert the response from the TCP server to an HTTP response
    res.status(200).send(data);
    // Close the TCP connection
    client.end();
  });

  // Handle TCP errors
  client.on("error", (err) => {
    console.error("TCP error:", err);
    res
      .status(500)
      .json({
        error: "An error occurred while communicating with the TCP server",
      });
  });
});
