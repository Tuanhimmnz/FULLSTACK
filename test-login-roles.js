const http = require('http');

const roles = [
  { email: 'admin@projecthub.com', password: 'admin123', label: 'Admin' },
  { email: 'pm@projecthub.com', password: '123456', label: 'Project Manager' },
  { email: 'dev@projecthub.com', password: '123456', label: 'Developer' }
];

function testLogin(role) {
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      email: role.email,
      password: role.password
    });

    const options = {
      hostname: '26.251.111.241',
      port: 5003,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log(`[${role.label}] Status: ${res.statusCode}`);
        console.log(`Response: ${data}\n`);
        resolve();
      });
    });

    req.on('error', (e) => {
      console.error(`[${role.label}] Error: ${e.message}\n`);
      resolve();
    });

    req.write(postData);
    req.end();
  });
}

async function run() {
  for (const role of roles) {
    await testLogin(role);
  }
}

run();
