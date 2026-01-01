import fetch, { HeadersInit } from 'node-fetch';
import { extractVideoDataFromTikTok } from './extract-video-data.js';

export async function crawlTikTok(videoLink: string) {
  const data = await extractVideoDataFromTikTok(videoLink);

  return {
    videoId: data.awemeId,
    videoLink,
    title: data.title,
    views: data.views,
    likes: data.likes,
    comments: data.comments,
    shares: data.shares,
    saves: data.saves,
    isAd: data.isAd,
    actualAirDate: data.createTime,
    dataRetrievalTime: getDataRetrievalTime()
  };
}

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const TIKTOK_COOKIE = process.env.TIKTOK_COOKIE;
if (!TIKTOK_COOKIE) {
  throw new Error('Missing TIKTOK_COOKIE in env');
}

const COOKIE = TIKTOK_COOKIE as string;

type TikTokAnchorResponse = {
  anchors?: any[];
};

export async function fetchProductAnchors(videoId: string) {
  const url = `https://www.tiktok.com/api/commerce/item/anchor/?aweme_id=${videoId}`;

  const headers: HeadersInit = {
    'user-agent': UA,
    'accept-language': 'vi-VN,vi;q=0.9',
    cookie: COOKIE
  };

  const res = await fetch(url, { headers });

  if (!res.ok) {
    throw new Error(`Failed to fetch product anchors: ${res.status}`);
  }

  const json = (await res.json()) as TikTokAnchorResponse;

  return json.anchors ?? [];
}

function getDataRetrievalTime(): string {
  const now = new Date();

  // UTC +7
  const utc7 = new Date(now.getTime() + 7 * 60 * 60 * 1000);

  const pad = (n: number) => n.toString().padStart(2, '0');

  const day = pad(utc7.getUTCDate());
  const month = pad(utc7.getUTCMonth() + 1);
  const year = utc7.getUTCFullYear();

  const hours = pad(utc7.getUTCHours());
  const minutes = pad(utc7.getUTCMinutes());
  const seconds = pad(utc7.getUTCSeconds());

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds} UTC+7`;
}
