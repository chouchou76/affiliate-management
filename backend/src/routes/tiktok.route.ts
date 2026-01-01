// import { Router } from 'express';
// import { crawlTikTok } from '../services/tiktok.service.js';

// const router = Router();

// router.post('/crawl', async (req, res) => {
//   try {
//     const { videoLink } = req.body;
//     if (!videoLink) {
//       return res.status(400).json({ error: 'Missing videoLink' });
//     }

//     const data = await crawlTikTok(videoLink);
//     res.json(data);
//   } catch (e: any) {
//     res.status(500).json({ error: e.message });
//   }
// });

// export default router;

import { Router } from 'express';
import { crawlTikTok } from '../services/tiktok.service.js';

const router = Router();

/**
 * ✅ Crawl 1 video (dùng cho Add KOC)
 */
router.post('/crawl', async (req, res) => {
  try {
    const { videoLink } = req.body;

    if (!videoLink) {
      return res.status(400).json({ error: 'Missing videoLink' });
    }

    const data = await crawlTikTok(videoLink);
    res.json(data);
  } catch (e: any) {
    console.error('Crawl error:', e);
    res.status(500).json({ error: e.message });
  }
});

/**
 * ✅ BULK CRAWL (dùng cho KOC list)
 */
router.post('/bulk-crawl', async (req, res) => {
  try {
    const { videoLinks } = req.body;

    if (!Array.isArray(videoLinks) || !videoLinks.length) {
      return res.status(400).json({ error: 'videoLinks must be an array' });
    }

    const results = await Promise.allSettled(
      videoLinks.map(link => crawlTikTok(link))
    );

    const success = results
      .filter(r => r.status === 'fulfilled')
      .map(r => (r as PromiseFulfilledResult<any>).value);

    const failed = results
      .filter(r => r.status === 'rejected')
      .map(r => (r as PromiseRejectedResult).reason?.message);

    res.json({
      total: videoLinks.length,
      successCount: success.length,
      failCount: failed.length,
      success,
      failed
    });
  } catch (e: any) {
    console.error('Bulk crawl error:', e);
    res.status(500).json({ error: e.message });
  }
});

export default router;
