import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, Sun, Star, LayoutGrid, Sparkles } from 'lucide-react';
import TarotSection from './components/TarotSection';
import DiceSection from './components/DiceSection';
import AstrologySection from './components/AstrologySection';
import { cn } from './lib/utils';

type Tab = 'tarot' | 'dice' | 'astrology';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('tarot');

  const tabs = [
    { id: 'tarot', label: '塔罗牌', icon: LayoutGrid },
    { id: 'dice', label: '灵力骰子', icon: Sparkles },
    { id: 'astrology', label: '星盘解析', icon: Star },
  ];

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="pt-12 pb-8 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium tracking-widest uppercase mb-4"
        >
          <Moon className="w-3 h-3" />
          Mystic Oracle
          <Sun className="w-3 h-3" />
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-serif gold-text tracking-tighter mb-4">
          灵境占卜
        </h1>
        <p className="text-stone-500 max-w-md mx-auto text-sm md:text-base">
          连接古老智慧与现代 AI，在迷雾中为你指引方向
        </p>
      </header>

      {/* Navigation */}
      <nav className="sticky top-4 z-50 flex justify-center px-6 mb-12">
        <div className="glass-panel p-1.5 flex gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={cn(
                  "relative px-6 py-2.5 rounded-2xl text-sm font-medium transition-all flex items-center gap-2",
                  isActive ? "text-amber-200" : "text-stone-500 hover:text-stone-300"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white/10 rounded-2xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className={cn("w-4 h-4", isActive ? "text-amber-400" : "text-stone-600")} />
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Content */}
      <main className="px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'tarot' && <TarotSection />}
            {activeTab === 'dice' && <DiceSection />}
            {activeTab === 'astrology' && <AstrologySection />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Decoration */}
      <footer className="mt-20 py-12 border-t border-white/5 text-center">
        <div className="flex justify-center gap-8 opacity-20 grayscale mb-6">
          <Moon className="w-6 h-6" />
          <Star className="w-6 h-6" />
          <Sun className="w-6 h-6" />
        </div>
        <p className="text-stone-600 text-xs tracking-widest uppercase">
          © 2026 Mystic Oracle. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
