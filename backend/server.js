const server = require('http').createServer((req, res) => { // Create server
res.end('Hello from your node.js backend!\n');
});

server.listen(3000,() => {// Start server locally on specified port 
console.log(`Your Node.Js BE Server accessible via http://localhost:3000/`) 
});