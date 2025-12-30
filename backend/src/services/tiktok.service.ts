// import fetch from 'node-fetch';

// export async function crawlTikTok(videoLink: string) {
//   // 1️⃣ Resolve short link
//   const res = await fetch(videoLink, { redirect: 'follow' });
//   const finalUrl = res.url;

//   // 2️⃣ Extract video ID
//   const match = finalUrl.match(/\/video\/(\d+)/);
//   if (!match) {
//     throw new Error('Không lấy được video ID');
//   }
//   const videoId = match[1];

//   // 3️⃣ Call RapidAPI (FIX PARAM)
//   const apiRes = await fetch(
//     `https://tiktok-api23.p.rapidapi.com/api/post/detail?videoId=${videoId}`,
//     {
//       headers: {
//         'X-RapidAPI-Key': process.env.RAPID_API_KEY as string,
//         'X-RapidAPI-Host': 'tiktok-api23.p.rapidapi.com'
//       }
//     }
//   );

//   const json: any = await apiRes.json();

//   // 🔎 DEBUG RẤT QUAN TRỌNG
//   console.log('TikTok API response:', JSON.stringify(json, null, 2));

//   const item = json?.data;

//   if (!item) {
//     throw new Error('Không lấy được data TikTok');
//   }

//   return {
//     videoId,
//     videoLink: finalUrl,
//     title: item.desc ?? '',
//     views: item.statistics?.playCount ?? 0,
//     likes: item.statistics?.diggCount ?? 0,
//     comments: item.statistics?.commentCount ?? 0,
//     shares: item.statistics?.shareCount ?? 0,
//     actualAirDate: new Date(item.createTime * 1000)
//       .toISOString()
//       .slice(0, 10)
//   };
// }

export async function crawlTikTok(videoLink: string) {
  // 1️⃣ Resolve short link
  const res = await fetch(videoLink, { redirect: 'follow' });
  const finalUrl = res.url;

  // 2️⃣ Extract video ID
  const match = finalUrl.match(/\/video\/(\d+)/);
  if (!match) {
    throw new Error('Không lấy được video ID');
  }
  const videoId = match[1];

  // 3️⃣ Call RapidAPI
  const apiRes = await fetch(
    `https://tiktok-api23.p.rapidapi.com/api/post/detail?videoId=${videoId}`,
    {
      headers: {
        'X-RapidAPI-Key': process.env.RAPID_API_KEY as string,
        'X-RapidAPI-Host': 'tiktok-api23.p.rapidapi.com'
      }
    }
  );

  const json: any = await apiRes.json();

  // 4️⃣ LẤY ĐÚNG STRUCTURE
  const item = json?.itemInfo?.itemStruct;

  if (!item) {
    throw new Error('Không lấy được data TikTok');
  }

  // 5️⃣ MAP DATA CHUẨN
  return {
    videoId: item.id,
    videoLink: finalUrl,
    title: item.desc ?? '',
    views: Number(item.stats?.playCount ?? 0),
    likes: Number(item.stats?.diggCount ?? 0),
    comments: Number(item.stats?.commentCount ?? 0),
    shares: Number(item.stats?.shareCount ?? 0),
    actualAirDate: new Date(
      Number(item.createTime) * 1000
    ).toISOString().slice(0, 10),

    author: {
      id: item.author?.id,
      username: item.author?.uniqueId,
      nickname: item.author?.nickname,
      followers: Number(item.authorStats?.followerCount ?? 0)
    }
  };
}
