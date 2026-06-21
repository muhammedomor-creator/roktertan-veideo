import { NextResponse } from 'next/server';
import axios from 'axios';
import { db } from '@/firebase/config';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export async function GET() {
  try {
    const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
    
    // ইউটিউব থেকে রক্তদান ও স্বাস্থ্য সচেতনতার ভিডিও সার্চ করার জন্য এপিআই কল
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        key: API_KEY,
        q: 'রক্তদান সচেতনতা রক্ত দেওয়ার উপকারিতা Health Tips Bangla',
        part: 'snippet',
        maxResults: 20,
        type: 'video',
        videoEmbeddable: 'true',
        regionCode: 'BD'
      }
    });

    const videos = response.data.items;

    for (const video of videos) {
      const videoId = video.id.videoId;
      const docRef = doc(db, "videos", videoId);

      await setDoc(docRef, {
        videoId: videoId,
        title: video.snippet.title,
        description: video.snippet.description,
        thumbnail: video.snippet.thumbnails.high.url,
        channelTitle: video.snippet.channelTitle,
        publishedAt: video.snippet.publishedAt,
        addedAt: serverTimestamp()
      }, { merge: true });
    }

    return NextResponse.json({ success: true, message: 'ভিডিও সফলভাবে আপডেট হয়েছে!' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}