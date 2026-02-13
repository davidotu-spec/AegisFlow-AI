const express = require('express');
const path = require('path');
const fs = require('fs');
const esbuild = require('esbuild');
const app = express();

// Cloud Run provides the PORT environment variable. 
// It is critical to listen on 0.0.0.0 to be reachable within the container.
const port = process.env.PORT || 8080;

// Log all requests for debugging in Cloud Run logs
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint for Cloud Run startup/liveness probes
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

// Helper to find a file with potential extensions
function findFile(basePath) {
  const extensions = ['.tsx', '.ts', '.js', '.jsx'];
  for (const ext of extensions) {
    const fullPath = basePath + ext;
    if (fs.existsSync(fullPath)) {
      return { path: fullPath, ext };
    }
  }
  return null;
}

// Middleware to transpile .tsx and .ts files on-the-fly
app.get('*', async (req, res, next) => {
  if (req.path === '/' || req.path.includes('.')) {
    if (!req.path.endsWith('.tsx') && !req.path.endsWith('.ts')) {
      return next();
    }
  }

  let filePath = path.join(__dirname, req.path);
  let loader = 'tsx';

  if (!fs.existsSync(filePath)) {
    const found = findFile(filePath);
    if (found) {
      filePath = found.path;
      loader = found.ext.substring(1).includes('ts') ? 'tsx' : 'jsx';
    } else {
      return next();
    }
  } else {
    loader = filePath.endsWith('.tsx') ? 'tsx' : 'ts';
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const result = await esbuild.transform(content, {
      loader: loader,
      format: 'esm',
      target: 'es2020',
      sourcemap: 'inline'
    });

    res.set('Content-Type', 'application/javascript');
    res.send(result.code);
  } catch (err) {
    console.error(`Error transpiling ${req.path}:`, err);
    res.status(500).send(`Error transpiling ${req.path}`);
  }
});

// Serve static files from the root directory
app.use(express.static(__dirname));

// Inject environment variables into index.html on request
app.get('/', (req, res) => {
  const htmlPath = path.join(__dirname, 'index.html');
  if (!fs.existsSync(htmlPath)) {
    return res.status(404).send('index.html not found');
  }
  
  let html = fs.readFileSync(htmlPath, 'utf8');
  // Inject the API key from the server environment into the client-side shim
  const apiKey = process.env.API_KEY || "";
  html = html.replace('API_KEY: ""', `API_KEY: "${apiKey}"`);
  res.send(html);
});

// Handle Single Page Application (SPA) routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Listen on all network interfaces (0.0.0.0) as required for Cloud Run
app.listen(port, '0.0.0.0', () => {
  console.log(`=========================================`);
  console.log(`Mixxd FinOps AI server is LIVE`);
  console.log(`Target Port: ${port}`);
  console.log(`Binding Address: 0.0.0.0:${port}`);
  console.log(`Health Check: http://0.0.0.0:${port}/healthz`);
  console.log(`Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`Time: ${new Date().toISOString()}`);
  console.log(`=========================================`);
});
