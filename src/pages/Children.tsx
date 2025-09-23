import React, { useState, useEffect } from 'react';
import { supabase, Devotional, ModeratorCard } from '../lib/supabase';
import ChildrenModeratorCard from '../components/ChildrenModeratorCard';
import DevotionalDisplay from '../components/DevotionalDisplay';
import { format } from 'date-fns';

export default function Children() {
  const [showModeratorCard, setShowModeratorCard] = useState(true);
  const [moderatorCard, setModeratorCard] = useState<ModeratorCard | null>(null);
  const [devotional, setDevotional] = useState<Devotional | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch moderator card
      const { data: moderatorData } = await supabase
        .from('moderator_cards')
        .select('*')
        .eq('section', 'children')
        .order('created_at', { ascending: false })
        .limit(1);

      if (moderatorData && moderatorData.length > 0) {
        setModeratorCard(moderatorData[0]);
      }

      // Fetch today's devotional
      const today = format(new Date(), 'yyyy-MM-dd');
      const { data: devotionalData } = await supabase
        .from('devotionals')
        .select('*')
        .eq('section', 'children')
        .eq('date', today)
        .single();

      if (devotionalData) {
        setDevotional(devotionalData);
      } else {
        // Fallback to most recent devotional
        const { data: recentData } = await supabase
          .from('devotionals')
          .select('*')
          .eq('section', 'children')
          .order('date', { ascending: false })
          .limit(1);

        if (recentData && recentData.length > 0) {
          setDevotional(recentData[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-green-200 to-blue-200 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🌟</div>
          <div className="text-2xl font-bold text-gray-800">Loading your devotional...</div>
        </div>
      </div>
    );
  }

  if (showModeratorCard) {
    return (
      <ChildrenModeratorCard
        moderatorCard={moderatorCard}
        onContinue={() => setShowModeratorCard(false)}
      />
    );
  }

  return <DevotionalDisplay devotional={devotional} section="children" />;
}