const express = require('express');
const path = require('path');
const fs = require('fs');
const esbuild = require('esbuild');
const nodemailer = require('nodemailer');
const app = express();

// Cloud Run provides the PORT environment variable. 
// It is critical to listen on 0.0.0.0 to be reachable within the container.
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Log all requests for debugging in Cloud Run logs
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint for Cloud Run startup/liveness probes
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

// API endpoint for contact form
app.post('/api/contact', async (req, res) => {
  const { name, email, category, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const mailOptions = {
      from: process.env.SMTP_USER ? `"Mixxd Contact Form" <${process.env.SMTP_USER}>` : `"Mixxd Contact Form" <noreply@mixxd.org>`,
      to: process.env.CONTACT_EMAIL_RECIPIENT || 'info@mixxd.org',
      subject: `New Contact Request: ${category} from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        Category: ${category}
        
        Message:
        ${message}
      `,
      html: `
        <h3>New Contact Request</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Category:</strong> ${category}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
      replyTo: email
    };

    // Check for required environment variables
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('Missing SMTP_USER or SMTP_PASS. Logging contact form to console instead.');
      console.log('=========================================');
      console.log('CONTACT FORM SUBMISSION (NO SMTP CONFIG)');
      console.log('To:', mailOptions.to);
      console.log('From:', email);
      console.log('Subject:', mailOptions.subject);
      console.log('Content:', mailOptions.text);
      console.log('=========================================');
      
      return res.status(200).json({ 
        success: true, 
        info: 'Contact request received. (Note: SMTP is not configured, so this was logged to the server console only.)' 
      });
    }

    // Configure transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        // Do not fail on invalid certs (common for some SMTP providers)
        rejectUnauthorized: false
      }
    });

    // Verify connection configuration
    try {
      await transporter.verify();
      console.log('SMTP connection verified successfully');
      await transporter.sendMail(mailOptions);
      console.log(`Email sent successfully for ${email}`);
      return res.status(200).json({ success: true });
    } catch (smtpError) {
      console.error('SMTP Error (falling back to console log):', smtpError);
      
      // LOG TO CONSOLE AS FALLBACK (helpful for preview/dev)
      console.log('=========================================');
      console.log('CONTACT FORM SUBMISSION (SMTP FAILED)');
      console.log('To:', mailOptions.to);
      console.log('From:', email);
      console.log('Subject:', mailOptions.subject);
      console.log('Content:', mailOptions.text);
      console.log('=========================================');

      // If we are in a preview environment, we might want to return success 
      // so the user can see the "Success" UI, but with a warning.
      return res.status(200).json({ 
        success: true, 
        warning: 'Email was logged to server console but could not be sent via SMTP. Please check SMTP configuration in Settings.' 
      });
    }
  } catch (error) {
    console.error('Unexpected error in contact API:', error);
    res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
  }
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
  const isTsFile = req.path.endsWith('.tsx') || req.path.endsWith('.ts');
  
  if (!isTsFile) {
    return next();
  }

  console.log(`[Transpiler] Request for: ${req.path}`);

  let filePath = path.join(__dirname, req.path);
  let loader = req.path.endsWith('.tsx') ? 'tsx' : 'ts';

  if (!fs.existsSync(filePath)) {
    console.log(`[Transpiler] File not found at ${filePath}, searching with extensions...`);
    const found = findFile(filePath.replace(/\.(tsx|ts)$/, ''));
    if (found) {
      filePath = found.path;
      loader = found.ext.substring(1).includes('ts') ? 'tsx' : 'jsx';
      console.log(`[Transpiler] Found file at ${filePath} with loader ${loader}`);
    } else {
      console.log(`[Transpiler] No file found for ${req.path}, passing to next middleware`);
      return next();
    }
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const result = await esbuild.transform(content, {
      loader: loader,
      format: 'esm',
      target: 'es2020',
      sourcemap: 'inline'
    });

    console.log(`[Transpiler] Successfully transpiled ${req.path}`);
    res.set('Content-Type', 'application/javascript');
    res.send(result.code);
  } catch (err) {
    console.error(`[Transpiler] Error transpiling ${req.path}:`, err);
    res.status(500).send(`Error transpiling ${req.path}: ${err.message}`);
  }
});

// Helper to serve index.html with injected environment variables
async function serveIndex(req, res) {
  const htmlPath = path.join(__dirname, 'index.html');
  if (!fs.existsSync(htmlPath)) {
    return res.status(404).send('index.html not found');
  }
  
  let html = fs.readFileSync(htmlPath, 'utf8');
  
  // Robust injection of environment variables into the client-side shim
  const env = {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || process.env.API_KEY || "",
    API_KEY: process.env.API_KEY || process.env.GEMINI_API_KEY || "",
    NODE_ENV: process.env.NODE_ENV || "production"
  };
  
  console.log(`[Server] Injecting environment into ${req.path}. API Key: ${env.GEMINI_API_KEY ? 'Present' : 'Missing'}`);
  
  // Replace the entire window.process block for reliability
  // We use a more flexible regex to catch variations in whitespace/formatting
  const shimRegex = /window\.process\s*=\s*\{[\s\S]*?\};/;
  const newShim = `window.process = { env: ${JSON.stringify(env)} };`;
  
  if (shimRegex.test(html)) {
    html = html.replace(shimRegex, newShim);
  } else {
    // Fallback: inject before </head> if regex fails
    console.warn('[Server] Could not find window.process shim in index.html, using fallback injection');
    const scriptTag = `<script>${newShim}</script>`;
    html = html.replace('</head>', `${scriptTag}\n</head>`);
  }
  
  res.send(html);
}

// Inject environment variables into index.html on request
app.get('/', serveIndex);

// Serve static files from the root directory, but DON'T serve index.html automatically
// This ensures our custom serveIndex logic handles the root and SPA routes
app.use(express.static(__dirname, { index: false }));

// Handle Single Page Application (SPA) routing
app.get('*', (req, res, next) => {
  // If it's a request for a file (has an extension), it would have been caught by express.static
  // If we're here, it's likely a route that should serve index.html
  if (path.extname(req.path)) {
    return next();
  }
  serveIndex(req, res);
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
