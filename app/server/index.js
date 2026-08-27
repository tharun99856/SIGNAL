import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import casesRouter from './routes/cases.js';
import policiesRouter from './routes/policies.js';
import metricsRouter from './routes/metrics.js';
import simulateRouter from './routes/simulate.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/cases', casesRouter);
app.use('/api/policies', policiesRouter);
app.use('/api/metrics', metricsRouter);
app.use('/api/simulate', simulateRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: 'Signal Agent API'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Signal Agent API running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
