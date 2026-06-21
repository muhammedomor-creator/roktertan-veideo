'use client';
import { useEffect, useState } from 'react';
import { db } from '@/firebase/config';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const loadVideos = async () => {
    try {
      const q = query(collection(db, "videos"), orderBy("addedAt", "desc"));
      const querySnapshot = await getDocs(q);
      const videoList = [];
      querySnapshot.forEach((doc) => {
        videoList.push(doc.data());
      });
      setVideos(videoList);
    } catch (error) {
      console.error("ভিডিও লোড করতে সমস্যা হয়েছে: ", error);
    } finally {
      setLoading(false);
    }
  };

  const syncNewVideos = async () => {
    setUpdating(true);
    try {
      const res = await fetch('/api/fetch-videos');
      const data = await res.json();
      if (data.success) {
        alert('নতুন ভিডিও সফলভাবে যুক্ত হয়েছে!');
        loadVideos();
      } else {
        alert('ভিডিও আপডেট করা যায়নি।');
      }
    } catch (error) {
      alert('সার্ভার ত্রুটি!');
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* হেডার সেকশন */}
      <header className="bg-red-600 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-wide">🩸 রক্তের টান (ভিডিও পোর্টাল)</span>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={syncNewVideos}
              disabled={updating}
              className="bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded-lg font-medium shadow transition text-sm disabled:opacity-50"
            >
              {updating ? 'ভিডিও খোঁজা হচ্ছে...' : '🔄 নতুন ভিডিও আপডেট করুন'}
            </button>
            
            <a 
              href="https://emergencyroktolagbe.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white text-red-600 hover:bg-gray-100 px-5 py-2 rounded-lg font-bold shadow transition text-sm flex items-center"
            >
              🔍 রক্ত খুঁজুন
            </a>
          </div>
        </div>
      </header>

      {/* মূল কন্টেন্ট */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">রক্তদান ও স্বাস্থ্য সচেতনতা ভিডিও গ্যালারি</h1>
          <p className="text-gray-600">ইউটিউবের সেরা সব তথ্যবহুল ভিডিও এখন এক জায়গায়।</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-xl font-medium text-gray-500">ভিডিও লোড হচ্ছে, দয়া করে অপেক্ষা করুন...</div>
        ) : videos.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow">
            <p className="text-gray-500 text-lg mb-4">ডেটাবেজে কোনো ভিডিও নেই।</p>
            <button onClick={syncNewVideos} className="bg-red-600 text-white px-6 py-2 rounded-md font-medium">প্রথমবার ভিডিও লোড করুন</button>
          </div>
        ) : (
          /* ভিডিও গ্রিড */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video) => (
              <div key={video.videoId} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <div className="relative aspect-video w-full">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${video.videoId}`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                
                <div className="p-5 flex flex-col flex-grow">
                  <h2 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2" dangerouslySetInnerHTML={{__html: video.title}} />
                  <p className="text-sm text-red-500 font-semibold mb-2">চ্যানেল: {video.channelTitle}</p>
                  <p className="text-sm text-gray-500 line-clamp-3 flex-grow">{video.description || 'কোনো বিবরণ নেই।'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-gray-900 text-gray-400 py-6 mt-12 text-center text-sm border-t border-gray-800">
        <p>© ২০২৬ রক্তের টান। সর্বস্বত্ব সংরক্ষিত।</p>
      </footer>
    </div>
  );
}