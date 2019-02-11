const fs = require('fs');

const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;
    if (url === '/') { 
        res.write('<html>');
        res.write('<header><title>Enter Message</title></header>');
        res.write(
            `<body>
                <form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form>
            </body>`);
        res.write('</html>');
        return res.end(); // uses return b/c we want to exit out of the function
    }
    if (url === '/message' && method === 'POST') {
        const body = [];
        // chunks are the pieces that are processed one at a time (like in the case that a giant file is being uploaded)
        req.on('data', chunk => { // req.on() allows us to listen to events. "data" is built in and fires upon every "chunk" passed in
          console.log(chunk);
          body.push(chunk);
        });
        return req.on('end', () => { // req.on('end') fires once node is done with the stream of "chunks"
            // a Buffer is the "bus" that Max described that handles multiple "chunks" and allows us to work with them when apporpriate
          const parsedBody = Buffer.concat(body).toString();
          const message = parsedBody.split('=')[1]; // accessed this way b/c result is: "message=users message"
          fs.writeFile('message.txt', message, err => {
            res.statusCode = 302;
            res.setHeader('Location', '/');
            return res.end();
          });
        });
      }
      res.setHeader('Content-Type', 'text/html');
      res.write('<html>');
      res.write('<head><title>My First Page</title><head>');
      res.write('<body><h1>Hello from my Node.js Server!</h1></body>');
      res.write('</html>');
      res.end();
};

module.exports = requestHandler;