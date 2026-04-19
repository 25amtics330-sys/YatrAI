const fs = require('fs');

const backend = JSON.parse(fs.readFileSync('c:/Users/Manish10/Downloads/waste/frontend/backend/package.json'));
const frontend = JSON.parse(fs.readFileSync('c:/Users/Manish10/Downloads/waste/frontend/frontend/frontend/package.json'));

backend.dependencies = { ...frontend.dependencies, ...backend.dependencies };
backend.devDependencies = { ...frontend.devDependencies, ...backend.devDependencies };

backend.scripts = {
  "start": "node server.js",
  "dev:backend": "node server.js",
  "dev:frontend": "vite",
  "dev": "concurrently --kill-others-on-fail --names \"BACKEND,FRONTEND\" --prefix-colors \"cyan,magenta\" \"npm run dev:backend\" \"npm run dev:frontend\"",
  "build": "vite build"
};

fs.writeFileSync('c:/Users/Manish10/Downloads/waste/frontend/backend/package.json', JSON.stringify(backend, null, 2));
console.log('Merged successfully');
