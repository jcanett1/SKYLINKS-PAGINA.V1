import { useState, useEffect } from 'react';
import { Camera, Shield, Wifi, Server, Settings, Phone, Mail, MapPin, Clock, Lock, Bot, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LogoImage from './components/LogoImage';
import { submitContactForm } from './lib/supabase';
import toast, { Toaster } from 'react-hot-toast';

const slides = [
  { url: 'https://i.pinimg.com/736x/da/26/2f/da262f0192d7d7a4e95bead0f81bcee0.jpg', title: 'Sistemas de Vigilancia Profesional' },
  { url: 'https://mfs.ezvizlife.com/013321387e6e75043dcf7490f741f0cb.jpg?ver=3391999712', title: 'Instalación Profesional' },
  { url: 'https://i.pinimg.com/736x/cd/df/e7/cddfe74d5a278fdc8c21e8ba9951577a.jpg', title: 'Tecnología de Punta' },
];

const services = [
  { to: '/camaras-seguridad', icon: Camera, title: 'Cámaras de Seguridad', desc: 'Sistemas NVR, DVR y cámaras WiFi de marcas líderes: Dahua, Hikvision, IMOU y EZVIZ.' },
  { to: '/alarmas-seguridad', icon: Shield, title: 'Alarmas de Seguridad', desc: 'Sistemas de alarma profesionales para hogares y empresas con monitoreo 24/7.' },
  { to: '/cyber-security', icon: Lock, title: 'Ciberseguridad', desc: 'Consultoría empresarial, auditorías, implementación de seguridad y capacitación.' },
  { to: '/gestion-idf', icon: Server, title: 'Gestión de IDF', desc: 'Gabinetes de red, cableado estructurado y equipamiento profesional.' },
  { to: '/configuracion-red', icon: Settings, title: 'Configuración de Red', desc: 'Configuración profesional de switches, routers y equipos de networking.' },
  { to: '/redes-wifi', icon: Wifi, title: 'Redes WiFi', desc: 'Diseño e implementación de redes inalámbricas empresariales y residenciales.' },
  { to: '/automatizaciones-ia', icon: Bot, title: 'Automatizaciones IA', desc: 'Asistentes de IA para WhatsApp que califican leads, agendan citas y automatizan tareas.' },
];

const marqueeItems = ['DAHUA', 'HIKVISION', 'IMOU', 'EZVIZ', 'UBIQUITI', 'TP-LINK', 'GRANDSTREAM', 'RUIJIE', 'CCTV', 'REDES WIFI', 'CIBERSEGURIDAD'];
const heroLines = ['Seguridad y', 'Redes que', 'protegen tu', 'negocio'];

const lineVariant = {
  hidden: { y: '110%' },
  visible: (i: number) => ({ y: 0, transition: { duration: 0.7, delay: 0.1 + i * 0.08, ease: [0.25, 1, 0.5, 1] } }),
};

function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get('name');
    const email = formData.get('email');
    const service = formData.get('service');
    const message = formData.get('message');
    if (!name || !email || !message) { toast.error('Por favor complete todos los campos requeridos'); return; }
    setIsSubmitting(true);
    try {
      await submitContactForm({
        name: name.toString(),
        email: email.toString(),
        phone: formData.get('phone')?.toString() || '',
        message: message.toString(),
        service_type: service?.toString() || 'Consulta general',
      });
      toast.success('¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.');
      form.reset();
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.error('Hubo un error al enviar el formulario. Por favor intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls = 'w-full bg-black border border-white/15 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 outline-none focus:border-cyan transition-colors duration-200';

  return (
    <div className="min-h-screen bg-ink text-paper overflow-x-hidden">
      <div className="noise-overlay" />
      <Toaster position="top-center" toastOptions={{ style: { background: '#0A0A0C', color: '#F4F4F5', border: '1px solid rgba(255,255,255,0.1)' } }} />
      <Navbar />

      <header className="relative min-h-screen flex items-center overflow-hidden pb-16 pt-28">
        <div className="absolute inset-0 z-0">
          {slides.map((slide, index) => (
            <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${currentSlide === index ? 'opacity-100' : 'opacity-0'}`}>
              <img src={slide.url} alt={slide.title} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/85 via-black/70 to-ink" />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/90 via-transparent to-black/40" />
        <div className="absolute inset-0 z-10 grid-line opacity-60" />

        <div className="relative z-20 container mx-auto px-4 w-full">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1, duration: 0.6 }}
            className="font-mono text-[11px] md:text-xs uppercase tracking-[0.25em] text-cyan mb-6 flex items-center gap-3">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan animate-pulse" />
            SKYLINKS · Telecomunicaciones Voz &amp; Datos · Guaymas y San Carlos
          </motion.p>

          <h1 className="font-display font-black tracking-tighter text-white leading-[0.98] text-5xl sm:text-6xl lg:text-7xl max-w-4xl">
            {heroLines.map((line, i) => (
              <span key={i} className="block overflow-hidden">
                <motion.span className="block" custom={i} variants={lineVariant} initial="hidden" animate="visible">{line}</motion.span>
              </span>
            ))}
          </h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-8 max-w-2xl text-base md:text-lg text-zinc-300 leading-relaxed">
            Instalación de cámaras y videovigilancia, alarmas, redes WiFi, ciberseguridad y automatización con IA para tu hogar y negocio.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.6 }}
            className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <a href="#contacto" className="group inline-flex items-center gap-2 bg-cyan text-black font-semibold rounded-full pl-6 pr-2 py-2 hover:bg-lime transition-colors duration-200">
              Contáctanos
              <span className="grid place-items-center w-9 h-9 rounded-full bg-black text-cyan group-hover:rotate-45 transition-transform duration-300"><ArrowRight className="w-4 h-4" /></span>
            </a>
            <Link to="/cyber-security" className="inline-flex items-center gap-2 border border-white/20 text-white font-medium rounded-full px-6 py-3 hover:border-cyan hover:text-cyan transition-colors duration-200">Ver Ciberseguridad</Link>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.6 }}
            className="mt-14 grid grid-cols-3 gap-4 md:gap-8 max-w-2xl border-t border-white/10 pt-8">
            {[['24/7', 'Monitoreo y soporte'], ['8+', 'Marcas líderes'], ['100%', 'Instalación profesional']].map(([v, l], i) => (
              <div key={i}>
                <div className="font-display font-black text-2xl md:text-3xl text-white">{v}</div>
                <div className="font-mono text-[10px] md:text-xs text-zinc-500 uppercase tracking-wider mt-1">{l}</div>
              </div>
            ))}
          </motion.div>

          <div className="mt-10 flex gap-2">
            {slides.map((_, index) => (
              <button key={index} onClick={() => setCurrentSlide(index)} className={`h-1 rounded-full transition-all duration-300 ${currentSlide === index ? 'w-10 bg-cyan' : 'w-5 bg-white/30'}`} aria-label={`slide ${index + 1}`} />
            ))}
          </div>
        </div>
      </header>

      <div className="border-y border-white/10 bg-surface py-5 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="flex items-center font-mono text-sm uppercase tracking-[0.2em] text-zinc-400 px-8">{item} <span className="text-cyan ml-8">✦</span></span>
          ))}
        </div>
      </div>

      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.7 }}>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-cyan mb-4">// Lo que hacemos</p>
            <h2 className="font-display font-bold tracking-tight text-3xl md:text-5xl text-white mb-14">Nuestros Servicios</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {services.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div key={s.to} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.6, delay: (i % 3) * 0.05 }}>
                  <Link to={s.to} className="group block h-full rounded-2xl border border-white/10 bg-surface p-8 hover:bg-zinc-900 hover:-translate-y-1 hover:border-cyan/40 transition-all duration-300">
                    <div className="flex items-start justify-between mb-6">
                      <span className="grid place-items-center w-12 h-12 rounded-xl bg-cyan/15 text-cyan group-hover:bg-lime/15 group-hover:text-lime transition-colors duration-300"><Icon className="w-6 h-6" /></span>
                      <ArrowUpRight className="w-5 h-5 text-zinc-600 group-hover:text-cyan group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                    </div>
                    <h3 className="font-display font-bold text-xl text-white mb-2 group-hover:text-cyan transition-colors duration-300">{s.title}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">{s.desc}</p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 border-y border-white/10 bg-surface">
        <div className="container mx-auto px-4">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-cyan mb-3 text-center">// Trabajamos con</p>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white text-center mb-14">Marcas de Confianza</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              ['Dahua', 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Dahua_Technology_logo.svg'],
              ['Hikvision', 'https://ftp3.syscom.mx/usuarios/fotos/logotipos/hikvision.png'],
              ['IMOU', 'https://static-website.imou.com/2e28bfa8429aa649f84f3ef8bed7028f.png'],
              ['EZVIZ', 'https://imgs.search.brave.com/kwHdzGGGU28brszwA9d5j1B4qNqRt_s0kvrDIvyRr_o/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9saDMu/Z29vZ2xldXNlcmNv/bnRlbnQuY29tL1RC/NmExNFNqNkg3ZTZ2/MTVwSVd2bWFjeTVw/cTRNVHh2bVRfZW9E/azhLdlNUR2VfajN0/M09RVUtndmJJaTVo/Tk1DMEw0c2hkdzRW/aTR5bW5IS003aW1R/TlM4c09hTS1admJn/PXMw'],
              ['Ubiquiti', 'https://u-networks.com.mx/wp-content/uploads/2022/10/logo-ubiquiti-300x100.png'],
              ['TP-Link', 'https://assets.mmsrg.com/isr/166325/c1/-/pixelboxx-mss-76852110/mobilecms_x_72_png'],
              ['Grandstream', 'https://www.grandstream.com/hs-fs/hubfs/raw_assets/public/Grandstream_Feb_2021/images/logo-grandstream-low-web.png?width=300&height=102&name=logo-grandstream-low-web.png'],
              ['Ruijie', 'https://www.wdcmayorista.com/almacenamiento/img/logo-ruijie.png'],
            ].map(([name, url]) => (
              <div key={name} className="group h-28 rounded-xl border border-white/10 bg-black flex items-center justify-center p-6 hover:border-cyan/40 transition-colors duration-300">
                <img src={url} alt={name} className="max-h-12 max-w-full object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-300" style={{ filter: 'brightness(0) invert(1)' }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contacto" className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] rounded-full bg-cyan/10 blur-[120px]" />
        <div className="relative container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-cyan mb-4">// Empecemos</p>
              <h2 className="font-display font-bold tracking-tight text-4xl md:text-5xl text-white leading-[1.05] mb-8">Contáctanos</h2>
              <div className="space-y-3">
                {[
                  [<Phone className="w-5 h-5" />, 'Teléfono', '+52 622 122 5103'],
                  [<Mail className="w-5 h-5" />, 'Email', 'skylinksonora@gmail.com'],
                  [<MapPin className="w-5 h-5" />, 'Dirección', 'Guaymas y San Carlos, Sonora'],
                  [<Clock className="w-5 h-5" />, 'Horario', 'Lun a Sáb: 9:00 - 17:00'],
                ].map(([icon, title, info], i) => (
                  <div key={i} className="flex items-center gap-4 rounded-xl border border-white/10 bg-surface p-5 hover:border-cyan/40 transition-colors duration-300">
                    <span className="grid place-items-center w-11 h-11 rounded-xl bg-cyan/15 text-cyan shrink-0">{icon}</span>
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">{title}</div>
                      <div className="font-display font-semibold text-white">{info}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <form className="rounded-2xl border border-white/10 bg-surface p-6 md:p-8 space-y-4" onSubmit={handleContactSubmit}>
              <input type="text" name="name" placeholder="Nombre" required className={inputCls} />
              <input type="email" name="email" placeholder="Email" required className={inputCls} />
              <input type="tel" name="phone" placeholder="Teléfono (opcional)" className={inputCls} />
              <select name="service" defaultValue="" className={`${inputCls} cursor-pointer`}>
                <option value="" disabled>Selecciona un servicio</option>
                <option value="instalacion-camaras">Instalación de Cámaras</option>
                <option value="instalacion-configuracion-idf">Instalación y Configuración de IDF</option>
                <option value="venta-equipos">Venta de Equipos</option>
                <option value="soporte-tecnico">Soporte Técnico</option>
              </select>
              <textarea name="message" placeholder="Mensaje" required rows={4} className={`${inputCls} resize-none`} />
              <button type="submit" disabled={isSubmitting}
                className={`group w-full inline-flex items-center justify-center gap-2 bg-lime text-black py-4 rounded-xl font-semibold hover:bg-cyan transition-colors duration-200 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}>
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Enviando...
                  </span>
                ) : (
                  <>Enviar Mensaje <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" /></>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default App;
