const http = require('http');
const fs = require('fs');

// Function fn to perform the add.wasm addition
function fn(a, b) {
  const wasmBuffer = fs.readFileSync('add.wasm');
  return WebAssembly.instantiate(wasmBuffer).then(wasmModule => {
    const { add } = wasmModule.instance.exports;
    const sum = add(a, b);
    console.log(sum);
    return `The sum of ${a} and ${b} is ${sum}`;
  });
}

const server = http.createServer((req, res) => {
  // Added CORS headers to allow requests from any origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');


  res.write("This is the response from the server: ");

  // Extract the query parameters a and b from the URL
  const urlParams = new URL(req.url, `http://${req.headers.host}`);
  const a = parseInt(urlParams.searchParams.get('a'));
  const b = parseInt(urlParams.searchParams.get('b'));

  //Check that both numbers have been inputted, will return result if both numbers given
  if (!isNaN(a) && !isNaN(b)) {
    fn(a, b)
      .then(result => {
        res.end(result);
      })
      .catch(error => {
        console.error('Error:', error);
        res.end('An error occurred.');
      });
  } else {
    res.end('\nUsage: Provide valid numbers as query parameters in the URL: /?a=5&b=6');
  }
});

// Server listening to port 3000
server.listen(3000, () => {
  console.log("Server is Running on port 3000");
});
