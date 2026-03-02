import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Dices, RotateCcw } from 'lucide-react';
import { getDiceInterpretation } from '../services/gemini';
import Markdown from 'react-markdown';

export default function DiceSection() {
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [rolling, setRolling] = useState(false);
  const [question, setQuestion] = useState('');
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const rollDice = () => {
    setInterpretation(null);
    setRolling(true);
    setTimeout(() => {
      const val = Math.floor(Math.random() * 6) + 1;
      setDiceValue(val);
      setRolling(false);
    }, 1000);
  };

  const handleInterpret = async () => {
    if (!question) return alert('请输入你的困惑');
    if (!diceValue) return;
    setLoading(true);
    try {
      const result = await getDiceInterpretation(diceValue, question);
      setInterpretation(result || '');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif gold-text mb-4">灵力骰子</h2>
        <p className="text-stone-400">随机的律动，藏着宇宙的暗示</p>
      </div>

      <div className="flex flex-col items-center gap-8">
        <div className="relative w-32 h-32">
          <motion.div
            animate={rolling ? {
              rotateX: [0, 360, 720],
              rotateY: [0, 360, 720],
              scale: [1, 1.2, 1]
            } : {}}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="w-full h-full glass-panel flex items-center justify-center text-5xl font-serif text-amber-400 border-2 border-amber-500/30 shadow-2xl shadow-amber-500/10"
          >
            {diceValue || '?'}
          </motion.div>
        </div>

        {!interpretation ? (
          <div className="w-full space-y-6">
            <button
              onClick={rollDice}
              disabled={rolling}
              className="w-full py-4 glass-panel hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-amber-200"
            >
              <Dices className="w-5 h-5" />
              {rolling ? '骰子旋转中...' : '掷出骰子'}
            </button>

            {diceValue && !rolling && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <input
                  type="text"
                  placeholder="你想问什么？"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500/50 transition-colors"
                />
                <button
                  onClick={handleInterpret}
                  disabled={loading}
                  className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-medium transition-all"
                >
                  {loading ? '正在解析天意...' : '获取骰子启示'}
                </button>
              </motion.div>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-panel p-8 w-full space-y-4"
          >
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <span className="text-amber-200 font-serif">骰子点数: {diceValue}</span>
              <button onClick={() => { setInterpretation(null); setDiceValue(null); }} className="text-stone-400 hover:text-white flex items-center gap-1 text-sm">
                <RotateCcw className="w-4 h-4" /> 重新掷骰
              </button>
            </div>
            <div className="markdown-body">
              <Markdown>{interpretation}</Markdown>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
