const express = require("express");
const fs = require("fs");

const app = express();
const port = 3000;

const PATH = "/home/mha/self-fitting-backend/"

// serve react app html
app.use(express.static(PATH + "dist"));

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
    // console.log("Connected to tcp config!");
  });

  const command = req.query.command;

  // send command to tcp server
  client.write(command + "\n");

  // Listen for the response from the TCP server
  client.on("data", (data) => {
    // console.log(`Received response from MHA: \n\n ${data}`);
    // Convert the response from the TCP server to an HTTP response
    res.status(200).send(data);
    // Close the TCP connection
    client.end();
  });

  // Handle TCP errors
  client.on("error", (err) => {
    console.error("TCP error:", err);
    res.status(500).json({
      error: "An error occurred while communicating with the TCP server",
    });
  });
});

// store all requests from /store in a csv
app.get("/store", (req, res) => {
  const time = req.query.time;
  const name = req.query.name;
  const a = req.query.a;
  const coordinate = req.query.coordinate;
  const gainDelta = req.query.gainDelta;
  const g = req.query.g;
  const glast = req.query.glast;
  const step = req.query.step;

  const data = `${time}\t${name}\t${a}\t${coordinate}\t${gainDelta}\t${g}\t${glast}\t${step}\n`;

  const filename = PATH + `logs/${name.replace(/\s/g, '_')}.tsv`;

  fs.appendFile(filename, data, (err) => {
    if (err) {
      console.log(err);
    }
  });

  res.status(200).send("Data stored");
});

app.get("/storestep", (req, res) => {
  const g = req.query.g;
  const name = req.query.name;
  const step = req.query.step;

  const filename = PATH + `logs/${name.replace(/\s/g, '_')}_g.tsv`;

  const data = `${name}\t${step}\t${g}\n`

  fs.appendFile(filename, data, (err) => {
    if (err) {
      console.log(err);
    }
  });

  res.status(200).send("Data stored");
})


const finalNameExtensions = ["-indoor-button_g.tsv", "-indoor-grid_g.tsv", "-outdoor-button_g.tsv", "-outdoor-grid_g.tsv"];

app.get("/admin", (req, res) => {
  const name = req.query.name;

  // for each file extension append to name and check if file exists
  // if exists get the last column of the tsv
  // concatenate all and send it back in a json format

  let finalData = [];

  finalNameExtensions.forEach((extension) => {
    const filename = PATH + "logs/" + name + extension;

    // Check if the file exists
    if (!fs.existsSync(filename)) {
      finalData.push("null");
    } else {
      // Read the file
      // Read the TSV file and get the last column
      const fileContent = fs.readFileSync(filename, 'utf-8');

      const rows = fileContent.trim().split('\n');

      const lastColumn = rows.map(row => row.split('\t').pop());

      const finalG = lastColumn[lastColumn.length - 1];
      finalData.push(finalG);
    }
  });

  // convert to json with extension title
  const finalJson = {
    indoorButton: finalData[0],
    indoorGrid: finalData[1],
    outdoorButton: finalData[2],
    outdoorButton: finalData[3],
  }

  res.status(200).send(finalJson);
});
