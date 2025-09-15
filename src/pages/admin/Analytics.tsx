import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Users, 
  Eye, 
  Clock, 
  TrendingUp, 
  Globe, 
  Smartphone, 
  Download,
  Calendar,
  Activity,
  Target
} from 'lucide-react';

interface DailyStats {
  date: string;
  unique_visitors: number;
  total_page_views: number;
  avg_session_duration: number;
  bounce_rate: number;
  top_pages: any[];
  top_devices: any[];
  top_countries: any[];
  devotional_views: any[];
  game_plays: any[];
}

interface AnalyticsData {
  dailyStats: DailyStats[];
  totalVisitors: number;
  totalPageViews: number;
  avgSessionDuration: number;
  avgBounceRate: number;
  topDevotionals: any[];
  topGames: any[];
  deviceBreakdown: any[];
  countryBreakdown: any[];
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];

export default function Analytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(30);
  const [selectedMetric, setSelectedMetric] = useState<'visitors' | 'pageviews'>('visitors');

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const endDate = new Date();
      const startDate = subDays(endDate, dateRange);

      // Fetch daily stats
      const { data: dailyStats, error: dailyError } = await supabase
        .from('analytics_daily_stats')
        .select('*')
        .gte('date', format(startDate, 'yyyy-MM-dd'))
        .lte('date', format(endDate, 'yyyy-MM-dd'))
        .order('date', { ascending: true });

      if (dailyError) throw dailyError;

      // Calculate totals
      const totalVisitors = dailyStats?.reduce((sum, day) => sum + day.unique_visitors, 0) || 0;
      const totalPageViews = dailyStats?.reduce((sum, day) => sum + day.total_page_views, 0) || 0;
      const avgSessionDuration = dailyStats?.length 
        ? Math.round(dailyStats.reduce((sum, day) => sum + day.avg_session_duration, 0) / dailyStats.length)
        : 0;
      const avgBounceRate = dailyStats?.length
        ? Math.round(dailyStats.reduce((sum, day) => sum + day.bounce_rate, 0) / dailyStats.length * 100) / 100
        : 0;

      // Aggregate top devotionals and games
      const devotionalViews = new Map();
      const gamePlayCounts = new Map();
      const deviceCounts = new Map();
      const countryCounts = new Map();

      dailyStats?.forEach(day => {
        // Aggregate devotional views
        day.devotional_views?.forEach((dv: any) => {
          const current = devotionalViews.get(dv.devotional_id) || 0;
          devotionalViews.set(dv.devotional_id, current + dv.views);
        });

        // Aggregate game plays
        day.game_plays?.forEach((gp: any) => {
          const current = gamePlayCounts.get(gp.game) || 0;
          gamePlayCounts.set(gp.game, current + gp.plays);
        });

        // Aggregate device types
        day.top_devices?.forEach((device: any) => {
          const current = deviceCounts.get(device.device) || 0;
          deviceCounts.set(device.device, current + device.count);
        });

        // Aggregate countries
        day.top_countries?.forEach((country: any) => {
          const current = countryCounts.get(country.country) || 0;
          countryCounts.set(country.country, current + country.count);
        });
      });

      const topDevotionals = Array.from(devotionalViews.entries())
        .map(([id, views]) => ({ devotional_id: id, views }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10);

      const topGames = Array.from(gamePlayCounts.entries())
        .map(([game, plays]) => ({ game, plays }))
        .sort((a, b) => b.plays - a.plays);

      const deviceBreakdown = Array.from(deviceCounts.entries())
        .map(([device, count]) => ({ name: device, value: count }));

      const countryBreakdown = Array.from(countryCounts.entries())
        .map(([country, count]) => ({ name: country, value: count }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);

      setAnalyticsData({
        dailyStats: dailyStats || [],
        totalVisitors,
        totalPageViews,
        avgSessionDuration,
        avgBounceRate,
        topDevotionals,
        topGames,
        deviceBreakdown,
        countryBreakdown,
      });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportAnalytics = async () => {
    if (!analyticsData) return;

    try {
      // Create CSV content
      const csvContent = [
        ['Date', 'Unique Visitors', 'Page Views', 'Avg Session Duration', 'Bounce Rate'],
        ...analyticsData.dailyStats.map(day => [
          day.date,
          day.unique_visitors,
          day.total_page_views,
          day.avg_session_duration,
          day.bounce_rate
        ])
      ].map(row => row.join(',')).join('\n');

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting analytics:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading analytics...</div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">No analytics data available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <div className="flex items-center space-x-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(Number(e.target.value))}
              className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
            <button
              onClick={exportAnalytics}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Visitors"
            value={analyticsData.totalVisitors.toLocaleString()}
            icon={<Users className="h-8 w-8" />}
            color="bg-blue-600"
          />
          <MetricCard
            title="Page Views"
            value={analyticsData.totalPageViews.toLocaleString()}
            icon={<Eye className="h-8 w-8" />}
            color="bg-green-600"
          />
          <MetricCard
            title="Avg Session Duration"
            value={`${Math.floor(analyticsData.avgSessionDuration / 60)}m ${analyticsData.avgSessionDuration % 60}s`}
            icon={<Clock className="h-8 w-8" />}
            color="bg-purple-600"
          />
          <MetricCard
            title="Bounce Rate"
            value={`${analyticsData.avgBounceRate}%`}
            icon={<TrendingUp className="h-8 w-8" />}
            color="bg-orange-600"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Daily Visitors/Page Views Chart */}
          <div className="bg-gray-800 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Daily Traffic</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedMetric('visitors')}
                  className={`px-3 py-1 rounded ${
                    selectedMetric === 'visitors' ? 'bg-blue-600' : 'bg-gray-700'
                  }`}
                >
                  Visitors
                </button>
                <button
                  onClick={() => setSelectedMetric('pageviews')}
                  className={`px-3 py-1 rounded ${
                    selectedMetric === 'pageviews' ? 'bg-blue-600' : 'bg-gray-700'
                  }`}
                >
                  Page Views
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.dailyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  tickFormatter={(value) => format(new Date(value), 'MM/dd')}
                />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                  labelFormatter={(value) => format(new Date(value), 'MMM dd, yyyy')}
                />
                <Line 
                  type="monotone" 
                  dataKey={selectedMetric === 'visitors' ? 'unique_visitors' : 'total_page_views'}
                  stroke="#3B82F6" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Device Breakdown */}
          <div className="bg-gray-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4">Device Types</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.deviceBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analyticsData.deviceBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Games */}
          <div className="bg-gray-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4">Popular Games</h3>
            <div className="space-y-3">
              {analyticsData.topGames.slice(0, 5).map((game, index) => (
                <div key={game.game} className="flex justify-between items-center">
                  <span className="text-gray-300">{game.game}</span>
                  <span className="text-blue-400 font-semibold">{game.plays} plays</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Countries */}
          <div className="bg-gray-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4">Top Countries</h3>
            <div className="space-y-3">
              {analyticsData.countryBreakdown.slice(0, 5).map((country, index) => (
                <div key={country.name} className="flex justify-between items-center">
                  <span className="text-gray-300">{country.name}</span>
                  <span className="text-green-400 font-semibold">{country.value} visitors</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

function MetricCard({ title, value, icon, color }: MetricCardProps) {
  return (
    <div className="bg-gray-800 rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
        <div className={`${color} p-3 rounded-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
}