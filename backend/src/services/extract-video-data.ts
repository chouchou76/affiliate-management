import fetch from 'node-fetch';
import { fetchProductAnchors } from './tiktok.service.js';

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36';

export interface TikTokVideoData {
  awemeId: string;
  title: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  isAd: boolean;
  hasProduct?: boolean;
  createTime: string | null;
}

export async function extractVideoDataFromTikTok(
  videoLink: string
): Promise<TikTokVideoData> {
  if (!videoLink) {
    throw new Error('Thiếu videoLink');
  }

  const ua =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36';

  /* ===============================
   1️⃣ RESOLVE LINK
  =============================== */
  const res = await fetch(videoLink, {
    redirect: 'follow',
    headers: { 'User-Agent': ua }
  });

  const finalUrl = res.url;

  /* ===============================
   2️⃣ FETCH HTML
  =============================== */
  const htmlRes = await fetch(finalUrl, {
    headers: { 'User-Agent': ua }
  });

  const html = await htmlRes.text();

  /* ===============================
   3️⃣ PARSE JSON TIKTOK
  =============================== */
  const jsonMatch = html.match(
    /<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>(.*?)<\/script>/
  );

  if (!jsonMatch) {
    throw new Error('Không tìm thấy JSON TikTok (có thể bị chặn)');
  }

  const data = JSON.parse(jsonMatch[1]);

  const item =
    data?.__DEFAULT_SCOPE__?.['webapp.video-detail']?.itemInfo?.itemStruct;

  if (!item) {
    throw new Error('Không lấy được dữ liệu video từ TikTok');
  }

  return {
    awemeId: item.id,
    title: item.desc ?? '',
    views: Number(item.stats?.playCount ?? 0),
    likes: Number(item.stats?.diggCount ?? 0),
    comments: Number(item.stats?.commentCount ?? 0),
    shares: Number(item.stats?.shareCount ?? 0),
    saves: Number(item.stats?.collectCount ?? 0),
    isAd: Boolean(item.isAd),
    createTime: item.createTime
      ? new Date(item.createTime * 1000).toISOString().slice(0, 10)
      : null
  };
}
