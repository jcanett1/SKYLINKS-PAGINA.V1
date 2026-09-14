import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TbDeviceCctv } from 'react-icons/tb';
import { FaBell, FaServer, FaNetworkWired, FaWifi, FaHome } from 'react-icons/fa';
import { Bot, Shield, ShoppingBag, TrendingUp, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import LogoImage from './LogoImage';
import { getExchangeRate } from '../lib/syscomApi';

const links = [
  { to: '/para-tu-hogar', icon: <FaHome />, label: 'Para tu hogar' },
  { to: '/camaras-seguridad', icon: <TbDeviceCctv />, label: 'Cámaras' },
  { to: '/alarmas-seguridad', icon: <FaBell />, label: 'Alarmas' },
  { to: '/gestion-idf', icon: <FaServer />, label: 'IDF' },
  { to: '/configuracion-red', icon: <FaNetworkWired />, label: 'Redes' },
  { to: '/redes-wifi', icon: <FaWifi />, label: 'WiFi' },
  { to: '/cyber-security', icon: <Shield className="w-4 h-4" />, label: 'Ciberseguridad' },
  { to: '/automatizaciones-ia', icon: <Bot className="w-4 h-4" />, label: 'IA' },
];

export default function Navbar() {
  const { toggleCart, totalItems } = useCart();
  const [exchangeRate, setExchangeRate] = useState<string>('0.00');
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const rate = await getExchangeRate();
        setExchangeRate(rate.normal || '0.00');
      } catch (err) {
        console.error('Error fetching exchange rate:', err);
      }
    };
    fetchRate();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 border-b ${scrolled ? 'glass border-white/10' : 'bg-transparent border-transparent'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <LogoImage src="/image.png" className="w-8 h-8 object-contain" />
            <div className="flex flex-col">
              <span className="text-xl font-display font-extrabold tracking-tight text-white">SKYLINKS</span>
              <span className="text-[9px] text-muted font-mono tracking-[0.15em] -mt-0.5 uppercase">Telecomunicaciones · Voz &amp; Datos</span>
            </div>
          </Link>

          <div className="hidden lg:flex space-x-6 items-center">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className={`group flex flex-col items-center transition-colors duration-200 ${isActive(l.to) ? 'text-cyan' : 'text-muted hover:text-cyan'}`}>
                <span className={`text-lg transition-transform duration-200 ${isActive(l.to) ? '-translate-y-0.5' : 'group-hover:-translate-y-0.5'}`}>{l.icon}</span>
                <span className="text-[10px] font-mono uppercase tracking-wider mt-1">{l.label}</span>
                <span className={`h-0.5 w-full rounded-full mt-1.5 transition-all duration-200 ${isActive(l.to) ? 'bg-cyan opacity-100' : 'bg-transparent opacity-0 group-hover:opacity-40 group-hover:bg-cyan'}`} />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5">
              <TrendingUp className="w-3.5 h-3.5 text-lime" />
              <span className="text-[11px] text-zinc-300 font-mono font-semibold">USD/MXN ${exchangeRate}</span>
            </div>

            <button onClick={toggleCart} className="relative p-2 rounded-full hover:bg-white/10 transition-colors duration-200" aria-label="carrito">
              <ShoppingBag className="w-5 h-5 text-zinc-200" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold text-black bg-lime flex items-center justify-center">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>

            <button onClick={() => setOpen((o) => !o)} className="lg:hidden p-2 text-zinc-200" aria-label="menu">
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="lg:hidden glass border-t border-white/10">
          <div className="px-4 py-4 grid grid-cols-2 gap-3">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors duration-200 ${isActive(l.to) ? 'border-cyan/60 bg-cyan/10 text-cyan' : 'border-white/10 bg-white/5 text-zinc-200 hover:text-cyan hover:border-cyan/40'}`}>
                <span className="text-lg">{l.icon}</span>
                <span className="text-xs font-medium">{l.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
