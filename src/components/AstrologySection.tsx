import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Compass, Send } from 'lucide-react';
import { getAstrologyReading } from '../services/gemini';
import Markdown from 'react-markdown';

export default function AstrologySection() {
  const [birthData, setBirthData] = useState({
    date: '',
    time: '',
    location: ''
  });
  const [question, setQuestion] = useState('');
  const [reading, setReading] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthData.date || !question) return alert('请完善出生信息和问题');
    setLoading(true);
    try {
      const result = await getAstrologyReading(birthData, question);
      setReading(result || '');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif gold-text mb-4">星盘解析</h2>
        <p className="text-stone-400">星辰的排列，预示着命运的轨迹</p>
      </div>

      {!reading ? (
        <form onSubmit={handleSubmit} className="glass-panel p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-stone-500 font-semibold">出生日期</label>
              <input
                type="date"
                required
                value={birthData.date}
                onChange={(e) => setBirthData({ ...birthData, date: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-stone-500 font-semibold">出生时间</label>
              <input
                type="time"
                value={birthData.time}
                onChange={(e) => setBirthData({ ...birthData, time: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-stone-500 font-semibold">出生地点</label>
              <input
                type="text"
                placeholder="城市名称"
                value={birthData.location}
                onChange={(e) => setBirthData({ ...birthData, location: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-stone-500 font-semibold">你的困惑</label>
            <textarea
              rows={4}
              required
              placeholder="例如：我近期的事业运势如何？"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500/50 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Compass className="w-5 h-5 animate-spin" />
                正在观测星象...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                开启星盘解析
              </>
            )}
          </button>
        </form>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-panel p-8 space-y-6"
        >
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <h3 className="text-2xl font-serif text-amber-200">星盘启示</h3>
            <button onClick={() => setReading(null)} className="text-stone-400 hover:text-white flex items-center gap-1 text-sm">
              重新输入
            </button>
          </div>
          <div className="markdown-body">
            <Markdown>{reading}</Markdown>
          </div>
        </motion.div>
      )}
    </div>
  );
}
