
const express = require('express');
const path = require('path');
const fs = require('fs');
const esbuild = require('esbuild');
const app = express();
const port = process.env.PORT || 8080;

// Middleware to transpile .tsx and .ts files on-the-fly
app.get(/\.(tsx|ts)$/, async (req, res, next) => {
  const filePath = path.join(__dirname, req.path);
  
  if (!fs.existsSync(filePath)) {
    return next();
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const result = await esbuild.transform(content, {
      loader: req.path.endsWith('.tsx') ? 'tsx' : 'ts',
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

// Handle Single Page Application (SPA) routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`AegisFlow AI server running on port ${port}`);
});
