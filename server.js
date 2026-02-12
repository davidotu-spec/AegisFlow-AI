const express = require('express');
const path = require('path');
const fs = require('fs');
const esbuild = require('esbuild');
const app = express();

// Cloud Run provides the PORT environment variable
const port = process.env.PORT || 8080;

// Log all requests for debugging in Cloud Run logs
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
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
// Also handles extensionless imports from the browser
app.get('*', async (req, res, next) => {
  // Skip if it's clearly not a source file request or if it's the root
  if (req.path === '/' || req.path.includes('.')) {
    // If it has an extension, only handle ts/tsx
    if (!req.path.endsWith('.tsx') && !req.path.endsWith('.ts')) {
      return next();
    }
  }

  let filePath = path.join(__dirname, req.path);
  let loader = 'tsx';

  // Check if file exists as-is
  if (!fs.existsSync(filePath)) {
    // Try finding it with extensions (for extensionless ESM imports)
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

// Listen on all network interfaces (0.0.0.0)
app.listen(port, '0.0.0.0', () => {
  console.log(`=========================================`);
  console.log(`Mixxd FinOps AI server is starting up...`);
  console.log(`Port: ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Time: ${new Date().toISOString()}`);
  console.log(`=========================================`);
});