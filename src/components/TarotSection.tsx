import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, RotateCcw } from 'lucide-react';
import { TAROT_DECK, TarotCard } from '../constants';
import { getTarotReading } from '../services/gemini';
import Markdown from 'react-markdown';

export default function TarotSection() {
  const [selectedCards, setSelectedCards] = useState<TarotCard[]>([]);
  const [question, setQuestion] = useState('');
  const [reading, setReading] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDraw = () => {
    if (selectedCards.length >= 3) return;
    const available = TAROT_DECK.filter(c => !selectedCards.find(sc => sc.name === c.name));
    const random = available[Math.floor(Math.random() * available.length)];
    setSelectedCards([...selectedCards, random]);
  };

  const handleInterpret = async () => {
    if (!question) return alert('请输入你的困惑');
    setLoading(true);
    try {
      const cardNames = selectedCards.map(c => c.name);
      const result = await getTarotReading(cardNames, question);
      setReading(result || '无法获取解析，请重试');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSelectedCards([]);
    setReading(null);
    setQuestion('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif gold-text mb-4">神秘塔罗</h2>
        <p className="text-stone-400">静心冥想你的问题，抽取三张牌开启启示</p>
      </div>

      {!reading ? (
        <div className="space-y-8">
          <div className="flex justify-center gap-6 flex-wrap min-h-[280px]">
            {selectedCards.map((card) => (
              <motion.div
                key={card.name}
                initial={{ rotateY: 180, opacity: 0, scale: 0.8 }}
                animate={{ rotateY: 0, opacity: 1, scale: 1 }}
                className="w-40 h-64 glass-panel overflow-hidden flex flex-col items-center border-2 border-amber-200/25 shadow-xl shadow-purple-950/25"
              >
                <div className="w-full h-13/14 relative">
                  <img 
                    src={card.image} 
                    alt={card.name} 
                    className="w-full h-full object-cover"
                    style={{ width:'100%', height:'auto'}}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="w-full h-1/14 flex items-center justify-center bg-black/40">
                  <span className="text-amber-200 font-serif text-sm tracking-widest">{card.name}</span>
                </div>
              </motion.div>
            ))}
            {selectedCards.length < 3 && (
              <button
                onClick={handleDraw}
                className="w-40 h-64 glass-panel flex flex-col items-center justify-center gap-2 transition-colors group border-dashed border-2 border-violet-200/20 hover:border-amber-200/25 hover:bg-white/12"
              >
                <div className="w-12 h-12 rounded-full bg-violet-300/16 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-purple-950/15">
                  <Sparkles className="w-6 h-6 text-amber-200" />
                </div>
                <span className="text-violet-100/80 text-sm">抽取第 {selectedCards.length + 1} 张</span>
              </button>
            )}
          </div>

          {selectedCards.length === 3 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 max-w-md mx-auto"
            >
              <input
                type="text"
                placeholder="在此输入你的问题..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500/50 transition-colors text-center"
              />
              <button
                onClick={handleInterpret}
                disabled={loading}
                className="w-full py-4 bg-purple-600 hover:bg-purple-500 disabled:bg-stone-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2"
              >
                {loading ? '正在通灵中...' : '开启 AI 深度解析'}
              </button>
            </motion.div>
          )}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-panel p-8 space-y-6"
        >
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <h3 className="text-2xl font-serif text-amber-200">占卜结果</h3>
            <button onClick={reset} className="text-stone-400 hover:text-white flex items-center gap-1 text-sm">
              <RotateCcw className="w-4 h-4" /> 重新占卜
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
