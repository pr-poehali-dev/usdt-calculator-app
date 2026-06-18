import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';

const COIN_IMG =
  'https://cdn.poehali.dev/projects/d52cf564-08ab-4ac7-8e39-800a3cb80733/files/227e8c66-6176-4d92-9103-7ea7773d4f11.jpg';

const STORAGE_KEY = 'usdt_balance_v1';

interface Spark {
  id: number;
  x: number;
  y: number;
  color: string;
}

const COLORS = ['#26A17B', '#FFD93B', '#FF8A3D', '#3DB6FF', '#FF5C8A', '#9D7BFF'];

const Index = () => {
  const [balance, setBalance] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? parseFloat(saved) : 0;
  });
  const [input, setInput] = useState('');
  const [spinning, setSpinning] = useState(false);
  const [popping, setPopping] = useState(false);
  const [sparks, setSparks] = useState<Spark[]>([]);
  const sparkId = useRef(0);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(balance));
  }, [balance]);

  const fireSalute = () => {
    const newSparks: Spark[] = [];
    for (let i = 0; i < 18; i++) {
      const angle = (Math.PI * 2 * i) / 18 + Math.random() * 0.3;
      const dist = 90 + Math.random() * 90;
      newSparks.push({
        id: sparkId.current++,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }
    setSparks(newSparks);
    setTimeout(() => setSparks([]), 900);
  };

  const handleAdd = () => {
    const value = parseFloat(input.replace(',', '.'));
    if (isNaN(value) || value === 0) return;
    setBalance((prev) => Math.round((prev + value) * 10000) / 10000);
    setInput('');
    setSpinning(true);
    setPopping(true);
    fireSalute();
    setTimeout(() => setSpinning(false), 1000);
    setTimeout(() => setPopping(false), 600);
  };

  const handleReset = () => {
    setBalance(0);
    setInput('');
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <div className="min-h-screen w-full bg-[#0B0F14] text-white font-body flex flex-col items-center justify-center px-6 overflow-hidden relative">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            'radial-gradient(circle at 50% 38%, rgba(38,161,123,0.18), transparent 55%)',
        }}
      />

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
        {/* Монета + салют */}
        <div className="relative flex items-center justify-center mb-8" style={{ perspective: '900px' }}>
          {sparks.map((s) => (
            <span
              key={s.id}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: s.color,
                boxShadow: `0 0 8px ${s.color}`,
                animation: 'salute 0.85s ease-out forwards',
                ['--sx' as string]: `${s.x}px`,
                ['--sy' as string]: `${s.y}px`,
              }}
            />
          ))}
          <div
            className={`w-36 h-36 rounded-full ${spinning ? 'animate-coin-spin' : 'animate-float-glow'}`}
            style={{
              transformStyle: 'preserve-3d',
              boxShadow:
                '0 12px 40px rgba(38,161,123,0.35), 0 0 0 1px rgba(255,255,255,0.06)',
            }}
          >
            <img
              src={COIN_IMG}
              alt="USDT"
              className="w-full h-full rounded-full object-cover select-none"
              draggable={false}
            />
          </div>
        </div>

        {/* Верхнее число — баланс */}
        <div
          className={`font-display text-5xl font-bold tracking-tight tabular-nums ${
            popping ? 'animate-value-pop' : ''
          }`}
        >
          {balance.toFixed(4)}
        </div>
        <div className="mt-1 mb-10 text-xs uppercase tracking-[0.3em] text-[#26A17B] font-medium">
          USDT
        </div>

        {/* Нижняя строка ввода */}
        <div className="w-full flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3 backdrop-blur">
          <Icon name="Plus" size={20} className="text-white/40 shrink-0" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            inputMode="decimal"
            placeholder="Сколько добавить"
            className="flex-1 bg-transparent outline-none text-xl font-display tabular-nums placeholder:text-white/25"
          />
          <button
            onClick={handleAdd}
            className="shrink-0 w-11 h-11 rounded-xl bg-[#26A17B] hover:bg-[#2bb98c] active:scale-95 transition flex items-center justify-center"
            aria-label="Добавить"
          >
            <Icon name="ArrowUp" size={20} className="text-white" />
          </button>
        </div>

        {/* Сброс */}
        <button
          onClick={handleReset}
          className="mt-6 flex items-center gap-2 text-sm text-white/35 hover:text-white/70 transition"
        >
          <Icon name="RotateCcw" size={15} />
          Сбросить всё
        </button>
      </div>

      <style>{`
        @keyframes salute {
          0% { transform: translate(0,0) scale(1); opacity: 1; }
          100% { transform: translate(var(--sx), var(--sy)) scale(0.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default Index;