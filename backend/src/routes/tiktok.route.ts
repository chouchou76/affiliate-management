import { Router } from 'express';
import { crawlTikTok } from '../services/tiktok.service.js';

const router = Router();

router.post('/crawl', async (req, res) => {
  try {
    const { videoLink } = req.body;
    if (!videoLink) {
      return res.status(400).json({ error: 'Missing videoLink' });
    }

    const data = await crawlTikTok(videoLink);
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
