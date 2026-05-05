import React, { useState } from 'react';
import { ShoppingCart, ArrowLeft, Send, Trash2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { translations } from './i18n';

// --- Data ---
type Equipment = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
};

const EQUIPMENT_LIST: Equipment[] = [
  { id: '1', name: 'Pioneer CDJ-3000 Professional Player', category: 'cat_players', price: 799, image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=600' },
  { id: '2', name: 'Pioneer DJM-900NXS2 Mixer', category: 'cat_mixers', price: 599, image: 'https://images.unsplash.com/photo-1520690214124-2405c5217036?auto=format&fit=crop&q=80&w=600' },
  { id: '3', name: 'Pioneer XDJ-RX3 All-in-One System', category: 'cat_controllers', price: 999, image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=600' },
  { id: '4', name: 'QSC K12.2 Active Loudspeaker', category: 'cat_sound', price: 349, image: 'https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&q=80&w=600' },
  { id: '5', name: 'Shure BLX288/SM58 Wireless Mic System', category: 'cat_mics', price: 249, image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=600' },
  { id: '6', name: 'Chauvet DJ GigBAR Move Lighting', category: 'cat_light', price: 449, image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=600' },
];

const SERVICES_LIST: Equipment[] = [
  { id: 's1', name: 'item_foodtruck', category: 'cat_catering', price: 299, image: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Austin_Texas_food_truck_3.jpg' },
  { id: 's2', name: 'item_waiters', category: 'cat_staff', price: 199, image: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Event_catering.jpg' },
];

type CartItem = Equipment & { quantity: number; cartId: string; hours?: number; isDynamicName?: boolean };
type Language = 'ua' | 'de';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'cart'>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [djDuration, setDjDuration] = useState<number>(2);
  const [lang, setLang] = useState<Language>('ua');

  const t = translations[lang];

  // Note: the user attached an image, we'll use a placeholder for the DJ image but you can replace it in the UI if needed
  const djImage = "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800"; // DJ playing image placeholder
  const heroImage = "https://images.unsplash.com/photo-1516873240891-4bf014598ab4?auto=format&fit=crop&q=80&w=1920"; // Party set placeholder

  const addToCart = (item: Equipment, hours?: number, isDynamicName?: boolean) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing && !isDynamicName) {
        return prev.map((c) => (c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
      }
      return [...prev, { ...item, quantity: 1, cartId: Math.random().toString(), hours, isDynamicName }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const getTranslatedName = (item: CartItem) => {
    if (item.isDynamicName) {
      const baseName = t[item.name as keyof typeof t] || item.name;
      return `${baseName} (${item.hours || 0} ${t.hours})`;
    }
    return t[item.name as keyof typeof t] || item.name;
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const isWeddingSelected = cart.some(c => c.id === 'dj-wedding');
  const isPartySelected = cart.some(c => c.id === 'dj-party');
  const isTransportCity = cart.some(c => c.id === 'transport-city');
  const isTransportRegion = cart.some(c => c.id === 'transport-region');

  const cartSummaryText = cart.length > 0 
    ? cart.map(item => `- ${getTranslatedName(item)} (x${item.quantity}) - ${item.price * item.quantity} €`).join('\n') + `\n\n${t.totalItems}: ${cartTotal} €`
    : t.emptyOrder;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setCart([]);
    setTimeout(() => {
      setIsSubmitted(false);
      setCurrentPage('home');
    }, 4000);
  };

  const LanguageSwitcher = () => (
    <div className="flex items-center gap-1 sm:gap-2 mr-2 border border-zinc-800 rounded-lg p-1 bg-zinc-900/50">
      <button 
        onClick={() => setLang('ua')}
        className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded transition-all text-sm sm:text-base ${lang === 'ua' ? 'bg-zinc-800 opacity-100 shadow' : 'opacity-50 hover:opacity-100 hover:bg-zinc-800/50'}`}
        title="Українська"
      >
        🇺🇦
      </button>
      <button 
        onClick={() => setLang('de')}
        className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded transition-all text-sm sm:text-base ${lang === 'de' ? 'bg-zinc-800 opacity-100 shadow' : 'opacity-50 hover:opacity-100 hover:bg-zinc-800/50'}`}
        title="Deutsch"
      >
        🇩🇪
      </button>
    </div>
  );

  if (currentPage === 'cart') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <header className="h-16 flex items-center justify-between px-4 sm:px-8 bg-zinc-900 border-b border-zinc-800 z-50 shadow-xl sticky top-0">
          <button 
            onClick={() => setCurrentPage('home')}
            className="flex items-center text-zinc-400 hover:text-red-500 transition-colors uppercase tracking-widest text-xs font-bold"
          >
            <ArrowLeft className="w-5 h-5 mr-3" />
            <span className="hidden sm:inline">{t.backToCatalog}</span>
          </button>
          
          <div className="flex items-center gap-3 absolute left-1/2 -translate-x-1/2">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center font-bold italic text-white text-lg">V</div>
            <span className="text-xl font-black tracking-tighter uppercase whitespace-nowrap hidden sm:block">DJ_Vasily</span>
          </div>

          <div className="flex items-center">
            <LanguageSwitcher />
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-bold italic uppercase tracking-tighter mb-8">{t.cartTitle}</h2>
          
          {isSubmitted ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#161616] border border-green-900/50 rounded-xl p-12 text-center shadow-2xl"
            >
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
              <h3 className="text-3xl font-black tracking-tight uppercase text-white mb-3">{t.successMsg}</h3>
              <p className="text-zinc-400 uppercase tracking-widest text-sm">{t.successSub}</p>
            </motion.div>
          ) : cart.length === 0 ? (
            <div className="text-center py-24 bg-[#161616] rounded-xl border border-zinc-800 shadow-xl">
              <ShoppingCart className="w-16 h-16 text-zinc-700 mx-auto mb-6" />
              <h3 className="text-2xl font-bold italic text-zinc-300 uppercase tracking-tighter mb-4">{t.cartEmpty}</h3>
              <p className="text-zinc-500 mb-8 uppercase tracking-widest text-xs">{t.cartEmptySub}</p>
              <button 
                onClick={() => setCurrentPage('home')}
                className="btn-primary py-3 px-8 rounded-lg font-black tracking-widest uppercase text-sm shadow-lg shadow-red-900/20"
              >
                {t.goToCatalog}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-12 sm:gap-16">
              <div className="flex flex-col gap-4">
                <AnimatePresence>
                  {cart.map((item) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={item.id} 
                      className="bg-zinc-900 p-4 sm:p-6 rounded-xl border border-zinc-800 flex flex-col sm:flex-row items-center gap-6 group hover:border-red-900/50 transition-colors"
                    >
                      <div className="w-full sm:w-48 aspect-video bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h4 className="font-bold text-xl leading-tight mb-2">{getTranslatedName(item)}</h4>
                        <p className="text-xs text-zinc-300 uppercase tracking-widest mb-4">
                          {t[item.category as keyof typeof t] || item.category}
                        </p>
                        <div className="flex items-center justify-center sm:justify-start gap-6">
                          <span className="font-mono text-red-500 font-bold text-xl">{item.price} € {item.category !== 'cat_performance' && item.category !== 'cat_catering' && item.category !== 'cat_staff' && item.category !== 'cat_logistics' && <span className="text-sm text-zinc-500 font-sans font-normal">{t.perDay}</span>}</span>
                          <span className="text-white text-sm font-bold bg-zinc-800 px-4 py-1.5 rounded-full border border-zinc-700">x{item.quantity}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="p-4 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors self-center border border-transparent hover:border-red-500/30"
                      >
                        <Trash2 className="w-6 h-6" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 flex flex-col sm:flex-row justify-between items-center mt-4">
                    <span className="uppercase tracking-widest text-sm font-bold text-zinc-300 mb-2 sm:mb-0">{t.totalItems} ({cartItemCount}):</span>
                    <span className="text-4xl font-mono font-black text-white tracking-tighter">{cartTotal} €</span>
                </div>
              </div>

              <div className="bg-zinc-900 p-8 sm:p-12 rounded-2xl border border-zinc-800 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-red-600/5 rounded-full blur-3xl pointer-events-none"></div>
                <h3 className="text-3xl font-black uppercase tracking-tighter mb-2 relative z-10">
                  <span className="text-red-500">{t.contactInfoMain}</span> {t.contactInfoSec}
                </h3>
                <p className="text-zinc-400 text-sm mb-10 uppercase tracking-widest z-10 relative">{t.contactSub}</p>
                
                <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-6 relative z-10">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-300 mb-2">{t.nameLabel}</label>
                    <input required type="text" className="w-full px-5 py-4 bg-[#0a0a0a] border border-zinc-800 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none text-white text-base transition-all" />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-300 mb-2">{t.emailLabel}</label>
                    <input required type="email" className="w-full px-5 py-4 bg-[#0a0a0a] border border-zinc-800 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none text-white text-base transition-all" />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-300 mb-2">{t.phoneLabel}</label>
                    <input required type="tel" className="w-full px-5 py-4 bg-[#0a0a0a] border border-zinc-800 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none text-white text-base transition-all" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-300 mb-2">{t.addressLabel}</label>
                    <input required type="text" className="w-full px-5 py-4 bg-[#0a0a0a] border border-zinc-800 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none text-white text-base transition-all" />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-300 mb-2">{t.dateLabel}</label>
                    <input required type="date" className="w-full px-5 py-4 bg-[#0a0a0a] border border-zinc-800 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none text-white text-base transition-all [color-scheme:dark]" />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-300 mb-2">{t.durationLabel}</label>
                    <div className="relative">
                      <select required defaultValue="" className="w-full px-5 py-4 bg-[#0a0a0a] border border-zinc-800 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none text-white text-base transition-all appearance-none cursor-pointer">
                        <option value="" disabled>{t.chooseOption}</option>
                        {[2, 3, 4, 5, 6, 7, 8].map(h => (
                          <option key={h} value={h}>{h} {t.hours}</option>
                        ))}
                        <option value="all">{t.allDay}</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">▼</div>
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-300 mb-2">{t.yourOrder}</label>
                    <textarea 
                      readOnly
                      value={cartSummaryText}
                      rows={cart.length + 2} 
                      className="w-full px-5 py-4 bg-[#161616] border border-zinc-800 rounded-lg outline-none text-red-50 font-mono text-sm transition-all focus:border-zinc-700 resize-none opacity-80"
                    ></textarea>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-300 mb-2">{t.extraInfo}</label>
                    <textarea 
                      rows={3} 
                      placeholder={t.extraInfoPlaceholder} 
                      className="w-full px-5 py-4 bg-[#0a0a0a] border border-zinc-800 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none text-white text-base transition-all placeholder:text-zinc-600 resize-y"
                    ></textarea>
                  </div>
                  
                  <div className="sm:col-span-2 mt-4 pt-8 border-t border-zinc-800">
                      <button 
                        type="submit"
                        className="w-full py-5 btn-primary text-white rounded-lg font-black uppercase text-lg tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-red-900/40"
                      >
                        <Send className="w-6 h-6" />
                        {t.sendOrder}
                      </button>
                      <p className="text-[10px] text-zinc-500 text-center uppercase tracking-widest mt-6">{t.priceNote}</p>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-red-900/50">
      <header className="h-16 flex items-center justify-between px-4 sm:px-8 bg-zinc-900 border-b border-zinc-800 z-50 shadow-xl sticky top-0">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center font-bold italic text-white text-lg shadow-inner">V</div>
          <span className="text-xl font-black tracking-tighter uppercase whitespace-nowrap">DJ_Vasily</span>
        </div>
        
        <nav className="hidden md:flex gap-8 text-xs font-bold tracking-widest uppercase">
          <a href="#equipment" className="text-zinc-300 hover:text-white transition-colors">{t.navEq}</a>
          <a href="#book-dj" className="text-zinc-300 hover:text-white transition-colors">{t.navBook}</a>
          <a href="#services" className="text-zinc-300 hover:text-white transition-colors">{t.navServ}</a>
          <span className="text-white cursor-default">{t.navImp}</span>
          <span className="text-white cursor-default">{t.navPriv}</span>
        </nav>

        <div className="flex items-center">
          <LanguageSwitcher />

          <button 
            onClick={() => setCurrentPage('cart')}
            className="relative cursor-pointer hover:text-red-500 transition-colors bg-zinc-800 hover:bg-zinc-700 p-2 sm:p-3 rounded-full sm:rounded-lg flex gap-2 items-center border border-zinc-700"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="hidden sm:block text-xs font-bold uppercase tracking-widest">{t.cart}</span>
            {cartItemCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-red-600 text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-lg"
              >
                {cartItemCount}
              </motion.span>
            )}
          </button>
        </div>
      </header>

      <main>
        <section className="relative min-h-screen py-32 flex items-center justify-center bg-[#0a0a0a] border-b border-zinc-800">
          <div className="absolute inset-0">
            <img 
              src={heroImage} 
              alt="DJ Equipment" 
              className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
          </div>
          
          <div className="relative z-10 text-center px-4 max-w-7xl mx-auto mt-6 sm:mt-12">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tighter leading-none uppercase italic"
            >
              {t.heroTitle1} <br/><span className="text-red-600">{t.heroTitle2}</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm md:text-base text-zinc-200 font-bold uppercase tracking-widest mb-10 max-w-3xl mx-auto"
            >
              {t.heroSub}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-6 justify-center mt-12"
            >
              <a href="#equipment" className="btn-primary text-white rounded-lg font-black text-xs tracking-widest uppercase px-10 py-5 shadow-lg shadow-red-900/30">
                {t.btnRent}
              </a>
              <a href="#book-dj" className="btn-primary text-white hover:text-white rounded-lg font-black text-xs tracking-widest uppercase px-10 py-5 shadow-lg shadow-red-900/30">
                {t.btnBook}
              </a>
            </motion.div>
          </div>
        </section>

        <section id="book-dj" className="py-24 bg-[#0a0a0a]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <div className="lg:w-1/2">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-red-900/20 rounded-3xl transform -rotate-3 transition-transform group-hover:-rotate-1"></div>
                  <img 
                    src={djImage} 
                    alt="DJ Vasily" 
                    className="relative rounded-2xl shadow-2xl object-cover w-full h-[500px] border border-zinc-800 transition-all duration-700"
                  />
                  <div className="absolute bottom-6 -left-6 sm:left-6 flex items-center gap-4 bg-[#161616]/90 backdrop-blur-md p-5 rounded-xl shadow-xl border border-zinc-800">
                    <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center border-2 border-red-600 text-2xl">
                      👤
                    </div>
                    <div>
                      <h4 className="font-bold text-white uppercase tracking-tighter">DJ Vasily</h4>
                      <p className="text-[10px] text-red-500 uppercase tracking-widest font-bold">Premium Artist</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:w-1/2 space-y-8">
                <div>
                  <h2 className="text-4xl sm:text-5xl font-black mb-6 uppercase tracking-tighter italic">{t.bookTitle1} <br/><span className="text-red-500">{t.bookTitle2}</span></h2>
                  <p className="text-sm text-zinc-200 leading-relaxed font-medium">
                    {t.bookDesc}
                  </p>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-[10px] font-bold uppercase text-zinc-300 tracking-widest mb-4">
                    {t.videos}
                  </h3>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="video-placeholder aspect-video rounded-xl shadow-inner cursor-pointer hover:border-red-500/50 transition-colors"></div>
                    <div className="video-placeholder aspect-video rounded-xl shadow-inner cursor-pointer hover:border-red-500/50 transition-colors"></div>
                  </div>
                </div>

                <div className="pt-6">
                  <div className="mb-6 border-l-2 border-red-500 pl-4 py-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest block mb-1">{t.pricePerHour}</span>
                      <span className="text-white font-mono text-xl font-bold">40 € <span className="text-zinc-500 text-xs font-sans font-normal">{t.withoutTransport}</span></span>
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">{t.dureation}</label>
                      <div className="relative w-32">
                        <select 
                          value={djDuration}
                          onChange={(e) => setDjDuration(Number(e.target.value))}
                          disabled={isWeddingSelected || isPartySelected}
                          className="w-full px-3 py-2 bg-[#161616] border border-zinc-800 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none text-white text-sm transition-all appearance-none cursor-pointer disabled:opacity-50"
                        >
                          {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map(h => (
                            <option key={h} value={h}>{h} {t.hours}</option>
                          ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 text-xs">▼</div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button 
                      onClick={() => {
                          if (isWeddingSelected) {
                              removeFromCart('dj-wedding');
                          } else {
                              addToCart({ id: 'dj-wedding', name: 'item_dj_wedding', category: 'cat_performance', price: djDuration * 40, image: djImage }, djDuration, true);
                          }
                      }}
                      className={isWeddingSelected 
                        ? "bg-green-900 border border-green-600 text-green-50 w-full py-5 rounded-lg flex justify-center items-center font-black text-xs uppercase tracking-widest shadow-lg shadow-green-900/40 transition-all hover:bg-green-800 hover:border-green-500"
                        : "btn-primary w-full py-5 rounded-lg flex justify-center items-center font-black text-xs uppercase tracking-widest shadow-lg shadow-red-900/30"
                      }
                    >
                      {isWeddingSelected ? t.weddingBtnSel : t.weddingBtn}
                    </button>
                    <button 
                      onClick={() => {
                          if (isPartySelected) {
                              removeFromCart('dj-party');
                          } else {
                              addToCart({ id: 'dj-party', name: 'item_dj_party', category: 'cat_performance', price: djDuration * 40, image: djImage }, djDuration, true);
                          }
                      }}
                      className={isPartySelected
                        ? "bg-green-900 border border-green-600 text-green-50 w-full py-5 rounded-lg flex justify-center items-center font-black text-xs uppercase tracking-widest shadow-lg shadow-green-900/40 transition-all hover:bg-green-800 hover:border-green-500"
                        : "btn-primary w-full py-5 rounded-lg flex justify-center items-center font-black text-xs uppercase tracking-widest shadow-lg shadow-red-900/30"
                      }
                    >
                      {isPartySelected ? t.partyBtnSel : t.partyBtn}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="disclaimer" className="py-24 bg-[#0a0a0a] border-t border-zinc-900 flex justify-center items-center">
          <div className="px-4 max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block bg-red-900/20 border border-red-500/30 backdrop-blur-md rounded-3xl p-8 sm:p-12 shadow-2xl shadow-red-900/20"
            >
              <h2 className="text-5xl md:text-8xl font-black text-zinc-300 mb-6 tracking-tighter leading-none uppercase italic">
                {t.disclaimerTitle}
              </h2>
              <p className="text-lg md:text-2xl text-red-500 font-bold uppercase tracking-widest">
                {t.disclaimerSub}
              </p>
            </motion.div>
          </div>
        </section>

        <section id="equipment" className="py-24 bg-[#0a0a0a] border-t border-zinc-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-end mb-12 border-b border-zinc-800 pb-6 gap-4">
              <h2 className="text-4xl font-black italic uppercase tracking-tighter">{t.eqTitle1} <span className="text-red-600">{t.eqTitle2}</span></h2>
              <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest bg-zinc-900 py-2 px-4 rounded-full border border-zinc-800">{t.availableToday}</span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {EQUIPMENT_LIST.map((item) => (
                <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col gap-4 group hover:border-red-500/50 transition-all duration-300 shadow-lg">
                  <div className="aspect-[4/3] bg-zinc-800 rounded-lg overflow-hidden relative border border-zinc-700/50">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-3 left-3 bg-[#0a0a0a]/90 backdrop-blur text-[10px] uppercase font-bold text-zinc-300 py-1.5 px-3 rounded-full border border-zinc-700">
                      {t[item.category as keyof typeof t] || item.category}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2 leading-tight">{item.name}</h3>
                    <p className="text-[11px] text-zinc-300 uppercase tracking-widest line-clamp-1">{t[item.category as keyof typeof t] || item.category}</p>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
                    <span className="text-2xl font-mono text-red-500 font-bold">{item.price} €</span>
                    <button 
                      onClick={() => addToCart(item)}
                      className="btn-primary text-[10px] uppercase font-bold py-2.5 px-6 rounded-lg text-white tracking-widest shadow-lg shadow-red-900/20"
                    >
                      {t.addBtn}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="services" className="py-24 bg-[#0a0a0a] border-t border-zinc-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-end mb-12 border-b border-zinc-800 pb-6 gap-4">
              <h2 className="text-4xl font-black italic uppercase tracking-tighter">{t.servTitle1} <span className="text-red-600">{t.servTitle2}</span></h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {SERVICES_LIST.map((item) => {
                const isSelected = cart.some(c => c.id === item.id);
                return (
                  <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col gap-4 group hover:border-red-500/50 transition-all duration-300 shadow-lg">
                    <div className="aspect-[4/3] bg-zinc-800 rounded-lg overflow-hidden relative border border-zinc-700/50">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-3 left-3 bg-[#0a0a0a]/90 backdrop-blur text-[10px] uppercase font-bold text-zinc-300 py-1.5 px-3 rounded-full border border-zinc-700">
                        {t[item.category as keyof typeof t] || item.category}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-2 leading-tight">{t[item.name as keyof typeof t] || item.name}</h3>
                      <p className="text-[11px] text-zinc-300 uppercase tracking-widest line-clamp-1">{t[item.category as keyof typeof t] || item.category}</p>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
                      <span className="text-2xl font-mono text-red-500 font-bold">{item.price} €</span>
                      <button 
                        onClick={() => {
                          if (isSelected) {
                              removeFromCart(item.id);
                          } else {
                              addToCart(item);
                          }
                        }}
                        className={isSelected 
                          ? "bg-green-900 border border-green-600 text-green-50 text-[10px] uppercase font-bold py-2.5 px-6 rounded-lg tracking-widest shadow-lg shadow-green-900/40 transition-all hover:bg-green-800"
                          : "btn-primary text-[10px] uppercase font-bold py-2.5 px-6 rounded-lg text-white tracking-widest shadow-lg shadow-red-900/20"
                        }
                      >
                        {isSelected ? t.selectedBtn : t.addBtn}
                      </button>
                    </div>
                  </div>
                );
              })}
              
              {/* Transport Custom Card */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col gap-4 shadow-lg sm:col-span-2 lg:col-span-1">
                <div className="aspect-[4/3] bg-zinc-800 rounded-lg overflow-hidden relative border border-zinc-700/50">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/2018_Ford_Transit_Custom_300_Base_2.0_facelift.jpg/960px-2018_Ford_Transit_Custom_300_Base_2.0_facelift.jpg" 
                    alt="Транспорт" 
                    className="w-full h-full object-cover transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 bg-[#0a0a0a]/90 backdrop-blur text-[10px] uppercase font-bold text-zinc-300 py-1.5 px-3 rounded-full border border-zinc-700">
                    {t.cat_logistics}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2 leading-tight">{t.transportTitle}</h3>
                  <p className="text-[11px] text-zinc-300 uppercase tracking-widest line-clamp-1">{t.transportDesc}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800 mt-2">
                  <button 
                    onClick={() => {
                      if (isTransportCity) removeFromCart('transport-city');
                      else {
                        removeFromCart('transport-region');
                        addToCart({ id: 'transport-city', name: 'item_trans_city', category: 'cat_logistics', price: 49, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/2018_Ford_Transit_Custom_300_Base_2.0_facelift.jpg/960px-2018_Ford_Transit_Custom_300_Base_2.0_facelift.jpg' });
                      }
                    }}
                    className={isTransportCity
                      ? "bg-green-900 border border-green-600 text-green-50 text-[10px] uppercase font-bold py-2 sm:py-3 px-2 rounded-lg tracking-widest shadow-lg shadow-green-900/40 transition-all text-center leading-tight hover:bg-green-800"
                      : "btn-primary text-[10px] uppercase font-bold py-2 sm:py-3 px-2 rounded-lg text-white tracking-widest shadow-lg shadow-red-900/20 text-center leading-tight"
                    }
                  >
                    {t.cityBtn}<br/><span className="font-mono text-sm block mt-1">49 €</span>
                  </button>
                  <button 
                    onClick={() => {
                      if (isTransportRegion) removeFromCart('transport-region');
                      else {
                        removeFromCart('transport-city');
                        addToCart({ id: 'transport-region', name: 'item_trans_region', category: 'cat_logistics', price: 99, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/2018_Ford_Transit_Custom_300_Base_2.0_facelift.jpg/960px-2018_Ford_Transit_Custom_300_Base_2.0_facelift.jpg' });
                      }
                    }}
                    className={isTransportRegion
                      ? "bg-green-900 border border-green-600 text-green-50 text-[10px] uppercase font-bold py-2 sm:py-3 px-2 rounded-lg tracking-widest shadow-lg shadow-green-900/40 transition-all text-center leading-tight hover:bg-green-800"
                      : "btn-primary text-[10px] uppercase font-bold py-2 sm:py-3 px-2 rounded-lg text-white tracking-widest shadow-lg shadow-red-900/20 text-center leading-tight"
                    }
                  >
                    {t.regionBtn}<br/><span className="font-mono text-sm block mt-1">99 €</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <footer className="bg-[#0a0a0a] text-zinc-500 py-12 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center font-bold italic text-white text-xs">V</div>
            <span className="text-sm font-black tracking-tighter uppercase whitespace-nowrap text-white">DJ_Vasily</span>
          </div>
          <p className="text-[10px] uppercase tracking-widest">© {new Date().getFullYear()} {t.copyright}</p>
        </div>
      </footer>
    </div>
  );
}
