import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { evaluateWebsite } from './server/evaluator';
import { generatePlainLanguageExplanation } from './server/geminiService';
import { BENCHMARK_SITES } from './src/data/portalPresets';
import { ScanResult } from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors({
  origin: [
    'https://project-cwbqu9f0o-srivatsavambati07-web.vercel.app',
    'https://project-pi-seven-77.vercel.app',
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// In-memory scan history
const scanHistory: ScanResult[] = [];

// Seed initial scan history with EPFO portal so the dashboard matches the design exactly
(async () => {
  try {
    const initialScan = await evaluateWebsite('epfindia.gov.in');
    scanHistory.unshift(initialScan);
  } catch (err) {
    console.warn('Initial scan seed failed:', err);
  }
})();

// API Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    platform: 'AccessGov',
    version: '1.0.0-hackathon-mvp',
    frameworks: ['WCAG 2.2 AA', 'GIGW 3.0'],
    aiService: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
  });
});

app.post('/api/scan', async (req: Request, res: Response) => {
  try {
    const { url, mode = 'deep_journey', customHtml } = req.body;
    if (!url && !customHtml) {
      return res.status(400).json({ error: 'Please provide a valid Indian government URL (.gov.in / .nic.in) or custom HTML.' });
    }

    const scanResult = await evaluateWebsite(url || 'custom-portal.gov.in', customHtml, mode);
    scanHistory.unshift(scanResult);
    if (scanHistory.length > 20) {
      scanHistory.pop();
    }

    return res.json(scanResult);
  } catch (error: any) {
    console.error('Scan error:', error);
    return res.status(500).json({ error: error.message || 'Failed to scan portal' });
  }
});

app.post('/api/explain', async (req: Request, res: Response) => {
  try {
    const { violation } = req.body;
    if (!violation) {
      return res.status(400).json({ error: 'Violation object required' });
    }

    const explanation = await generatePlainLanguageExplanation(violation);
    return res.json(explanation);
  } catch (error: any) {
    console.error('Explanation error:', error);
    return res.status(500).json({ error: 'Failed to generate explanation' });
  }
});

app.get('/api/history', (req: Request, res: Response) => {
  return res.json(scanHistory.slice(0, 10));
});

app.get('/api/benchmarks', (req: Request, res: Response) => {
  return res.json(BENCHMARK_SITES);
});

app.post('/api/remediate-simulate', (req: Request, res: Response) => {
  try {
    const { scanId, violationId } = req.body;
    const scan = scanHistory.find((s) => s.id === scanId) || scanHistory[0];
    if (!scan) {
      return res.status(404).json({ error: 'Scan not found' });
    }

    // Clone and apply remediation
    const updatedIssues = scan.issues.map((issue) => {
      if (issue.id === violationId) {
        return { ...issue, isRemediated: true };
      }
      return issue;
    });

    const activeIssues = updatedIssues.filter((i) => !i.isRemediated);
    const criticalCount = activeIssues.filter((i) => i.priority === 'critical').length;
    const highCount = activeIssues.filter((i) => i.priority === 'high').length;
    const mediumCount = activeIssues.filter((i) => i.priority === 'medium').length;
    const lowCount = activeIssues.filter((i) => i.priority === 'low').length;

    const penalty = (criticalCount * 18) + (highCount * 9) + (mediumCount * 4) + (lowCount * 1.5);
    const newScore = Math.min(100, Math.max(15, Math.round(100 - penalty)));
    const newGigwScore = Math.min(100, Math.round(((20 - (criticalCount + highCount)) / 20) * 100));

    // Update journey stages
    const updatedStages = scan.journeyStages.map((stage) => {
      const remainingStageIssues = activeIssues.filter((i) => i.citizenJourney.stage === stage.stage);
      const remainingCrit = remainingStageIssues.filter((i) => i.priority === 'critical').length;
      return {
        ...stage,
        issueCount: remainingStageIssues.length,
        criticalBlockers: remainingCrit,
        status: (remainingCrit > 0 ? 'blocked' : remainingStageIssues.length > 0 ? 'friction' : 'smooth') as any,
        stageScore: Math.min(100, Math.max(25, 100 - (remainingCrit * 35 + remainingStageIssues.length * 10))),
      };
    });

    const updatedResult: ScanResult = {
      ...scan,
      stats: {
        ...scan.stats,
        totalIssues: activeIssues.length,
        critical: criticalCount,
        high: highCount,
        medium: mediumCount,
        low: lowCount,
        accessGovScore: newScore,
        gigwCompliancePercentage: newGigwScore,
        journeyBlockersCount: criticalCount + highCount,
      },
      journeyStages: updatedStages,
      issues: updatedIssues,
    };

    return res.json(updatedResult);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Vite middleware for development & static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AccessGov Platform running on http://localhost:${PORT}`);
  });
}

startServer();
