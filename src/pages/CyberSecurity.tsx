import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import {
  Shield,
  Cloud,
  FileText,
  MagnifyingGlass,
  Users,
  Fingerprint,
  ArrowRight,
  ArrowUpRight,
  Phone,
  Envelope,
  Buildings,
  Lock,
  Eye,
  Plus,
  X,
  CheckCircle,
  ShieldCheck,
} from '@phosphor-icons/react';
import { submitContactForm } from '../lib/supabase';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/* ---------- Design tokens ---------- */
const INK = '#050505';
const SURFACE = '#0A0A0C';
const CYAN = '#06B6D4';
const LIME = '#D9F854';
const AMBER = '#FFB800';
const PAPER = '#F4F4F5';
const MUTED = '#A1A1AA';
const LINE = 'rgba(255,255,255,0.1)';

/* ---------- Bilingual dictionary ---------- */
type Lang = 'ES' | 'EN';

const T = {
  ES: {
    nav: { services: 'Servicios', twoFA: 'Acceso 2FA', process: 'Proceso', faq: 'Preguntas', cta: 'Evaluación Gratuita' },
    hero: {
      tag: 'Ciberseguridad para PyMEs · Guaymas & San Carlos, Sonora',
      titleA: 'Ciberseguridad Empresarial:',
      titleB: 'Protege, Migra y Crece',
      titleC: 'con Confianza',
      sub: 'Ayudamos a PyMEs a blindar sus operaciones digitales con soluciones de seguridad escalables, sin complejidad técnica y a precio justo.',
      urgency: 'Tu negocio no puede esperar.',
      btn1: 'Solicita tu Diagnóstico',
      btn2: 'Ver Servicios',
      s1: 'Cifrado de grado militar',
      s2: 'Tiempo de respuesta',
      s3: 'Arquitectura por defecto',
    },
    services: {
      tag: '// LO QUE HACEMOS',
      title: 'Implementación de Seguridad',
      intro: 'Diseñamos e implementamos arquitecturas de seguridad robustas adaptadas al tamaño y riesgo de tu empresa. Firewalls, EDR, SIEM y más.',
      cards: [
        { title: 'Arquitecturas de Seguridad Robustas', desc: 'Firewall de nueva generación, protección de endpoints y segmentación de red para reducir tu superficie de ataque.', bullets: ['Firewall de nueva generación', 'Protección de endpoints', 'Segmentación de red'] },
        { title: 'Migración Segura a la Nube', desc: 'Traslado de cargas sin exponer datos ni interrumpir la operación, con controles desde el primer día.', bullets: ['Evaluación pre-migración', 'Cifrado en tránsito', 'Configuración IAM'] },
        { title: 'Gestión Documental y Cumplimiento', desc: 'Control del ciclo de vida de documentos y normativas de protección de datos.', bullets: ['Políticas y procedimientos', 'Gestión de riesgos', 'Auditoría de cumplimiento'] },
        { title: 'Auditorías de Ciberseguridad', desc: 'Identificar vulnerabilidades antes que los atacantes con evaluaciones periódicas.', bullets: ['Pruebas de penetración', 'Análisis de brechas', 'Reporte ejecutivo'] },
        { title: 'Capacitación a Empleados', desc: 'Formar al equipo para detectar phishing e ingeniería social.', bullets: ['Simulacros de phishing', 'Taller de contraseñas', 'Cultura de seguridad'] },
      ],
    },
    twofa: {
      tag: '// ACCESO Y VERIFICACIÓN',
      title: 'Autenticación de Dos Factores (2FA) y Controles de Acceso',
      sub: 'Token TOTP y FIDO2 — Llaves de hardware y apps autenticadoras como Google Authenticator o Microsoft Authenticator.',
      zt: { title: 'Zero Trust & Least Privilege', desc: 'Cada usuario accede únicamente a lo que necesita. Revisión periódica de permisos.' },
      mon: { title: 'Monitoreo de Accesos', desc: 'Detección de inicios de sesión anómalos, geolocalización sospechosa y alertas en tiempo real.' },
      verify: { title: 'Verificación 2FA', prompt: 'Ingresa el código de tu app autenticadora', btn: 'Verificar acceso', hw: 'YubiKey 5 NFC', hwTag: 'Hardware Token · FIDO2 · TOTP', hwStatus: 'Conectado', footer: 'Acceso protegido con cifrado AES-256' },
    },
    process: {
      tag: '// CÓMO TRABAJAMOS',
      title: 'Nuestro Proceso de Trabajo',
      intro: 'Un enfoque claro, predecible y orientado a resultados tangibles desde el primer día.',
      steps: [
        { n: '01', title: 'Diagnóstico', desc: 'Evaluamos superficie de ataque, activos críticos y exposición actual.' },
        { n: '02', title: 'Diseño', desc: 'Arquitectura de seguridad a la medida de tu riesgo y presupuesto.' },
        { n: '03', title: 'Implementación', desc: 'Despliegue de controles con mínima interrupción y máxima cobertura.' },
        { n: '04', title: 'Monitoreo & Mejora', desc: 'Vigilancia continua, reportes claros y ajustes proactivos.' },
      ],
    },
    tips: {
      tag: '// 5 CONSEJOS ESENCIALES',
      title: 'Consejos Esenciales de Seguridad',
      items: [
        'Activa la autenticación de dos factores (2FA) en todas tus cuentas críticas.',
        'Mantén tus sistemas y aplicaciones siempre actualizados.',
        'Realiza copias de seguridad automáticas y cifradas con regularidad.',
        'Capacita a tu equipo para reconocer correos de phishing.',
        'Aplica el principio de mínimo privilegio en todos los accesos.',
      ],
    },
    faq: {
      tag: '// PREGUNTAS FRECUENTES',
      title: 'Preguntas Frecuentes',
      items: [
        { q: '¿La ciberseguridad es solo para grandes empresas?', a: 'No. Las PyMEs son un objetivo frecuente; nuestras soluciones son escalables y a precio justo.' },
        { q: '¿Interrumpirán mi operación durante la implementación?', a: 'Trabajamos con mínima interrupción, en ventanas acordadas.' },
        { q: '¿Qué es Zero Trust y por qué lo necesito?', a: 'Ninguna conexión es confiable por defecto; se verifica continuamente, reduciendo el impacto de una brecha.' },
        { q: '¿Ofrecen soporte después de la implementación?', a: 'Sí: monitoreo continuo, reportes periódicos y ajustes proactivos.' },
        { q: '¿Cuánto tarda una evaluación inicial?', a: 'Te contactan en menos de 24 h y el diagnóstico inicial no tiene costo.' },
      ],
    },
    contact: {
      tag: '// CONTACTO',
      title: 'Solicita tu Evaluación Gratuita',
      sub: 'Completa el formulario y uno de nuestros especialistas te contactará en menos de 24 horas para agendar tu diagnóstico sin costo.',
      phone: 'Teléfono directo',
      email: 'Correo',
      coverage: 'Cobertura',
      coverageVal: 'Guaymas y San Carlos, Sonora',
      form: { name: 'Nombre', emailL: 'Correo', phone: 'Teléfono', company: 'Empresa', service: 'Servicio de interés', message: 'Mensaje', btn: 'Solicitar diagnóstico gratuito' },
      footer: 'AES-256 · FIDO2 · Zero Trust',
      sent: 'Solicitud Recibida',
      sentDesc: 'Un especialista se pondrá en contacto contigo en las próximas 24 horas.',
      again: 'Enviar otra solicitud',
      err: 'Por favor complete los campos requeridos',
    },
    footer: { tagline: 'Ciberseguridad empresarial para PyMEs. Protege, migra y crece con confianza.' },
  },
  EN: {
    nav: { services: 'Services', twoFA: '2FA Access', process: 'Process', faq: 'FAQ', cta: 'Free Assessment' },
    hero: {
      tag: 'Cybersecurity for SMBs · Guaymas & San Carlos, Sonora',
      titleA: 'Enterprise Cybersecurity:',
      titleB: 'Protect, Migrate & Grow',
      titleC: 'with Confidence',
      sub: 'We help SMBs harden their digital operations with scalable security solutions, no technical complexity, at a fair price.',
      urgency: 'Your business cannot wait.',
      btn1: 'Request Your Diagnosis',
      btn2: 'View Services',
      s1: 'Military-grade encryption',
      s2: 'Response time',
      s3: 'Architecture by default',
    },
    services: {
      tag: '// WHAT WE DO',
      title: 'Security Implementation',
      intro: 'We design and implement robust security architectures tailored to your company size and risk. Firewalls, EDR, SIEM and more.',
      cards: [
        { title: 'Robust Security Architectures', desc: 'Next-gen firewall, endpoint protection and network segmentation to reduce your attack surface.', bullets: ['Next-gen firewall', 'Endpoint protection', 'Network segmentation'] },
        { title: 'Secure Cloud Migration', desc: 'Move workloads without exposing data or disrupting operations, with controls from day one.', bullets: ['Pre-migration assessment', 'Encryption in transit', 'IAM configuration'] },
        { title: 'Document Management & Compliance', desc: 'Control of the document lifecycle and data protection regulations.', bullets: ['Policies & procedures', 'Risk management', 'Compliance audit'] },
        { title: 'Cybersecurity Audits', desc: 'Identify vulnerabilities before attackers do with periodic assessments.', bullets: ['Penetration testing', 'Gap analysis', 'Executive report'] },
        { title: 'Employee Training', desc: 'Train your team to detect phishing and social engineering.', bullets: ['Phishing simulations', 'Password workshop', 'Security culture'] },
      ],
    },
    twofa: {
      tag: '// ACCESS & VERIFICATION',
      title: 'Two-Factor Authentication (2FA) & Access Controls',
      sub: 'TOTP and FIDO2 tokens — Hardware keys and authenticator apps like Google Authenticator or Microsoft Authenticator.',
      zt: { title: 'Zero Trust & Least Privilege', desc: 'Each user accesses only what they need. Periodic permission reviews.' },
      mon: { title: 'Access Monitoring', desc: 'Detection of anomalous logins, suspicious geolocation and real-time alerts.' },
      verify: { title: '2FA Verification', prompt: 'Enter the code from your authenticator app', btn: 'Verify access', hw: 'YubiKey 5 NFC', hwTag: 'Hardware Token · FIDO2 · TOTP', hwStatus: 'Connected', footer: 'Access protected with AES-256 encryption' },
    },
    process: {
      tag: '// HOW WE WORK',
      title: 'Our Working Process',
      intro: 'A clear, predictable approach oriented to tangible results from day one.',
      steps: [
        { n: '01', title: 'Diagnosis', desc: 'We assess attack surface, critical assets and current exposure.' },
        { n: '02', title: 'Design', desc: 'Security architecture tailored to your risk and budget.' },
        { n: '03', title: 'Implementation', desc: 'Deploy controls with minimal disruption and maximum coverage.' },
        { n: '04', title: 'Monitoring & Improvement', desc: 'Continuous vigilance, clear reports and proactive adjustments.' },
      ],
    },
    tips: {
      tag: '// 5 ESSENTIAL TIPS',
      title: 'Essential Security Tips',
      items: [
        'Enable two-factor authentication (2FA) on all your critical accounts.',
        'Keep your systems and applications always up to date.',
        'Perform automatic and encrypted backups regularly.',
        'Train your team to recognize phishing emails.',
        'Apply the principle of least privilege to all accesses.',
      ],
    },
    faq: {
      tag: '// FAQ',
      title: 'Frequently Asked Questions',
      items: [
        { q: 'Is cybersecurity only for large companies?', a: 'No. SMBs are a frequent target; our solutions are scalable and fairly priced.' },
        { q: 'Will you disrupt my operations during implementation?', a: 'We work with minimal disruption, in agreed windows.' },
        { q: 'What is Zero Trust and why do I need it?', a: 'No connection is trusted by default; it is continuously verified, reducing breach impact.' },
        { q: 'Do you offer support after implementation?', a: 'Yes: continuous monitoring, periodic reports and proactive adjustments.' },
        { q: 'How long does an initial assessment take?', a: 'You are contacted within 24 hours and the initial diagnosis is free.' },
      ],
    },
    contact: {
      tag: '// CONTACT',
      title: 'Request Your Free Assessment',
      sub: 'Complete the form and one of our specialists will contact you within 24 hours to schedule your free diagnosis.',
      phone: 'Direct phone',
      email: 'Email',
      coverage: 'Coverage',
      coverageVal: 'Guaymas and San Carlos, Sonora',
      form: { name: 'Name', emailL: 'Email', phone: 'Phone', company: 'Company', service: 'Service of interest', message: 'Message', btn: 'Request free diagnosis' },
      footer: 'AES-256 · FIDO2 · Zero Trust',
      sent: 'Request Received',
      sentDesc: 'A specialist will contact you within the next 24 hours.',
      again: 'Send another request',
      err: 'Please complete the required fields',
    },
    footer: { tagline: 'Enterprise cybersecurity for SMBs. Protect, migrate and grow with confidence.' },
  },
};

const marqueeItems = ['ISO 27001', 'Firewalls de nueva generación', 'EDR', 'SIEM', 'Zero Trust', 'AES-256', 'FIDO2', 'TOTP', 'Migración a la Nube', 'Segmentación de red'];

const serviceIcons = [ShieldCheck, Cloud, FileText, MagnifyingGlass, Users];

interface FormState { name: string; email: string; phone: string; company: string; service: string; message: string; }
const initialForm: FormState = { name: '', email: '', phone: '', company: '', service: '', message: '' };

/* ---------- Reusable motion variants ---------- */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

export default function CyberSecurity() {
  const [lang, setLang] = useState<Lang>('ES');
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const t = T[lang];

  /* Lenis smooth scroll */
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    let raf = 0;
    const loop = (time: number) => { lenis.raf(time); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); };
  }, []);

  /* Sticky header state */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Parallax hero bg */
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) { toast.error(t.contact.err); return; }
    setSubmitting(true);
    try {
      await submitContactForm({
        name: form.name, email: form.email, phone: form.phone,
        message: `Empresa: ${form.company}. Servicio: ${form.service}. Mensaje: ${form.message}`,
        service_type: form.service || 'Ciberseguridad', address: form.company, preferred_contact_method: 'email',
      });
      setSubmitted(true); setForm(initialForm);
    } catch { toast.error(t.contact.err); } finally { setSubmitting(false); }
  };

  return (
    <div className="relative min-h-screen bg-ink text-paper font-body overflow-x-hidden" data-testid="cyber-page">
      <Toaster position="top-center" />

      {/* Global noise overlay */}
      <div className="fixed inset-0 noise-overlay pointer-events-none z-[1]" data-testid="noise" />

      <Navbar />

      {/* ═══════════════ SECTION NAV ═══════════════ */}
      <header
        className={`fixed top-16 left-0 right-0 z-40 transition-all duration-500 ${scrolled ? 'backdrop-blur-xl bg-ink/70 border-b' : 'bg-transparent'}`}
        style={{ borderColor: scrolled ? LINE : 'transparent' }}
        data-testid="header"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted">
            <a href="#servicios" className="hover:text-paper transition-colors">{t.nav.services}</a>
            <a href="#twofa" className="hover:text-paper transition-colors">{t.nav.twoFA}</a>
            <a href="#proceso" className="hover:text-paper transition-colors">{t.nav.process}</a>
            <a href="#faq" className="hover:text-paper transition-colors">{t.nav.faq}</a>
          </nav>
          <div className="flex items-center gap-3 ml-auto">
            <div className="flex items-center text-xs font-mono border rounded-full overflow-hidden" style={{ borderColor: LINE }} data-testid="lang-toggle">
              {(['ES', 'EN'] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-3 py-1.5 font-medium transition-colors ${lang === l ? 'text-ink' : 'text-muted hover:text-paper'}`}
                  style={lang === l ? { background: CYAN } : {}}
                  data-testid={`lang-${l}`}
                >{l}</button>
              ))}
            </div>
            <a
              href="#contacto"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-ink transition-all hover:scale-[1.03]"
              style={{ background: LIME }}
              data-testid="header-cta"
            >
              {t.nav.cta}
              <ArrowUpRight size={16} weight="bold" />
            </a>
          </div>
        </div>
      </header>

      {/* ═══════════════ HERO ═══════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden" data-testid="hero">
        {/* Background image with parallax */}
        <motion.div className="absolute inset-0 z-0" style={{ y: heroY, scale: heroScale }}>
          <img
            src="https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Security operations center"
            className="w-full h-full object-cover"
            data-testid="hero-bg"
          />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${INK}cc 0%, ${INK}99 60%, ${INK} 100%)` }} />
        </motion.div>

        {/* Grid overlay */}
        <div className="absolute inset-0 z-[2] opacity-[0.07] pointer-events-none">
          <svg width="100%" height="100%"><defs>
            <pattern id="hgrid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M80 0H0V80" fill="none" stroke="#fff" strokeWidth="0.5" />
            </pattern>
          </defs><rect width="100%" height="100%" fill="url(#hgrid)" /></svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-24 pb-16 w-full">
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.span variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-widest mb-8 border" style={{ borderColor: `${CYAN}40`, color: CYAN }} data-testid="hero-tag">
              <ShieldCheck size={14} weight="duotone" /> {t.hero.tag}
            </motion.span>

            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-8xl leading-[1.05] tracking-tight max-w-5xl mb-8">
              <motion.span variants={fadeUp} className="block">{t.hero.titleA}</motion.span>
              <motion.span variants={fadeUp} className="block" style={{ color: LIME }}>{t.hero.titleB}</motion.span>
              <motion.span variants={fadeUp} className="block">{t.hero.titleC}</motion.span>
            </h1>

            <motion.p variants={fadeUp} className="text-base lg:text-lg text-muted max-w-2xl leading-relaxed mb-4">{t.hero.sub}</motion.p>
            <motion.p variants={fadeUp} className="text-base lg:text-lg font-display font-extrabold mb-10" style={{ color: AMBER }}>{t.hero.urgency}</motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 mb-16">
              <a href="#contacto" className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm text-ink transition-all hover:scale-[1.03]" style={{ background: CYAN }} data-testid="hero-btn1">
                {t.hero.btn1}
                <ArrowRight size={16} weight="bold" className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#servicios" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm text-paper border transition-all hover:bg-white/5" style={{ borderColor: LINE }} data-testid="hero-btn2">
                {t.hero.btn2}
              </a>
            </motion.div>

            <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-px max-w-3xl" style={{ background: LINE }} data-testid="hero-stats">
              {[
                { v: 'AES-256', l: t.hero.s1 },
                { v: '24 h', l: t.hero.s2 },
                { v: 'Zero Trust', l: t.hero.s3 },
              ].map((s) => (
                <div key={s.l} className="p-6 bg-ink/60 backdrop-blur-sm">
                  <div className="text-2xl font-display font-extrabold" style={{ color: CYAN }}>{s.v}</div>
                  <div className="text-xs text-muted font-mono uppercase tracking-wider mt-1">{s.l}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ MARQUEE ═══════════════ */}
      <section className="relative py-8 border-y overflow-hidden" style={{ borderColor: LINE, background: SURFACE }} data-testid="marquee">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-3 px-8 text-sm font-mono uppercase tracking-widest text-muted">
              <span style={{ color: CYAN }}>◆</span> {item}
            </span>
          ))}
        </div>
      </section>

      {/* ═══════════════ SERVICIOS ═══════════════ */}
      <section id="servicios" className="relative py-24 lg:py-32 scroll-mt-20" style={{ background: INK }} data-testid="services">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }} variants={stagger} className="mb-16">
            <motion.span variants={fadeUp} className="block text-xs font-mono uppercase tracking-widest mb-4" style={{ color: CYAN }}>{t.services.tag}</motion.span>
            <motion.h2 variants={fadeUp} className="font-display font-extrabold text-3xl lg:text-5xl mb-6 max-w-3xl">{t.services.title}</motion.h2>
            <motion.p variants={fadeUp} className="text-base text-muted max-w-2xl leading-relaxed">{t.services.intro}</motion.p>
          </motion.div>

          {/* Bento grid */}
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} variants={stagger} className="grid grid-cols-12 gap-4">
            {/* Featured large card */}
            <motion.div variants={fadeUp} className="col-span-12 lg:col-span-7 row-span-2 p-8 lg:p-10 rounded-2xl border group transition-all hover:-translate-y-1 relative overflow-hidden" style={{ borderColor: LINE, background: SURFACE }} data-testid="svc-0">
              <div className="absolute -right-20 -top-20 w-60 h-60 rounded-full opacity-0 group-hover:opacity-100 blur-3xl transition-opacity" style={{ background: `${CYAN}20` }} />
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ background: `${CYAN}15` }}>
                  <ShieldCheck size={28} weight="duotone" style={{ color: CYAN }} />
                </div>
                <h3 className="font-display font-extrabold text-2xl mb-3">{t.services.cards[0].title}</h3>
                <p className="text-sm text-muted leading-relaxed mb-6">{t.services.cards[0].desc}</p>
                <ul className="space-y-2">
                  {t.services.cards[0].bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-sm">
                      <CheckCircle size={16} weight="duotone" style={{ color: LIME }} /> {b}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Image card */}
            <motion.div variants={fadeUp} className="col-span-12 lg:col-span-5 rounded-2xl border overflow-hidden group transition-all hover:-translate-y-1 relative" style={{ borderColor: LINE }} data-testid="svc-1">
              <div className="aspect-[16/10] overflow-hidden relative">
                <img src="https://images.pexels.com/photos/159304/network-cable-ethernet-computer-159304.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Cloud migration data center" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${INK}, transparent 70%)` }} />
              </div>
              <div className="p-6" style={{ background: SURFACE }}>
                <div className="flex items-center gap-3 mb-2">
                  <Cloud size={20} weight="duotone" style={{ color: CYAN }} />
                  <h3 className="font-display font-extrabold text-lg">{t.services.cards[1].title}</h3>
                </div>
                <p className="text-sm text-muted leading-relaxed">{t.services.cards[1].desc}</p>
              </div>
            </motion.div>

            {/* Three smaller cards */}
            {t.services.cards.slice(2).map((card, i) => {
              const Icon = serviceIcons[i + 2];
              return (
                <motion.div key={i} variants={fadeUp} className="col-span-12 sm:col-span-6 lg:col-span-4 p-8 rounded-2xl border group transition-all hover:-translate-y-1 relative overflow-hidden" style={{ borderColor: LINE, background: SURFACE }} data-testid={`svc-${i + 2}`}>
                  <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 blur-3xl transition-opacity" style={{ background: `${CYAN}15` }} />
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: `${CYAN}10` }}>
                      <Icon size={24} weight="duotone" style={{ color: CYAN }} />
                    </div>
                    <h3 className="font-display font-extrabold text-lg mb-2">{card.title}</h3>
                    <p className="text-sm text-muted leading-relaxed mb-4">{card.desc}</p>
                    <ul className="space-y-1.5">
                      {card.bullets.map((b) => (
                        <li key={b} className="flex items-center gap-2 text-xs text-muted">
                          <CheckCircle size={14} weight="duotone" style={{ color: LIME }} /> {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ 2FA ═══════════════ */}
      <section id="twofa" className="relative py-24 lg:py-32 overflow-hidden scroll-mt-20" style={{ background: SURFACE }} data-testid="twofa">
        {/* Grid bg */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
          <svg width="100%" height="100%"><defs>
            <pattern id="g2fa" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M60 0H0V60" fill="none" stroke="#06B6D4" strokeWidth="0.5" />
            </pattern>
          </defs><rect width="100%" height="100%" fill="url(#g2fa)" /></svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="mb-16">
            <motion.span variants={fadeUp} className="block text-xs font-mono uppercase tracking-widest mb-4" style={{ color: CYAN }}>{t.twofa.tag}</motion.span>
            <motion.h2 variants={fadeUp} className="font-display font-extrabold text-3xl lg:text-5xl mb-4 max-w-4xl">{t.twofa.title}</motion.h2>
            <motion.p variants={fadeUp} className="text-base text-muted max-w-2xl leading-relaxed">{t.twofa.sub}</motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="grid grid-cols-12 gap-4">
            {/* Zero Trust card */}
            <motion.div variants={fadeUp} className="col-span-12 lg:col-span-5 p-8 rounded-2xl border transition-all hover:-translate-y-1" style={{ borderColor: LINE, background: INK }} data-testid="zt-card">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: `${LIME}15` }}>
                <Lock size={24} weight="duotone" style={{ color: LIME }} />
              </div>
              <h3 className="font-display font-extrabold text-xl mb-3">{t.twofa.zt.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{t.twofa.zt.desc}</p>
            </motion.div>

            {/* Monitoring card */}
            <motion.div variants={fadeUp} className="col-span-12 lg:col-span-7 p-8 rounded-2xl border transition-all hover:-translate-y-1" style={{ borderColor: LINE, background: INK }} data-testid="mon-card">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: `${CYAN}15` }}>
                <Eye size={24} weight="duotone" style={{ color: CYAN }} />
              </div>
              <h3 className="font-display font-extrabold text-xl mb-3">{t.twofa.mon.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{t.twofa.mon.desc}</p>
            </motion.div>

            {/* Featured 2FA card with gradient border */}
            <motion.div variants={fadeUp} className="col-span-12 lg:col-span-7 gradient-border" data-testid="2fa-verify">
              <div className="rounded-[19px] p-8 lg:p-10 h-full" style={{ background: INK }}>
                <div className="flex items-center gap-3 mb-2">
                  <Fingerprint size={28} weight="duotone" style={{ color: CYAN }} />
                  <h3 className="font-display font-extrabold text-2xl">{t.twofa.verify.title}</h3>
                </div>
                <p className="text-sm text-muted mb-8">{t.twofa.verify.prompt}</p>

                {/* 6 code boxes */}
                <div className="flex gap-2 sm:gap-3 mb-8" data-testid="code-boxes">
                  {['5', '8', '3', '•', '•', '•'].map((c, i) => (
                    <div key={i} className="w-12 h-14 sm:w-14 sm:h-16 rounded-xl flex items-center justify-center font-mono font-bold text-2xl border" style={{ borderColor: c === '•' ? LINE : `${CYAN}50`, background: SURFACE, color: c === '•' ? MUTED : CYAN }}>
                      {c}
                    </div>
                  ))}
                </div>

                <button className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-ink transition-all hover:scale-[1.03] w-full sm:w-auto" style={{ background: LIME }} data-testid="verify-btn">
                  <Fingerprint size={18} weight="fill" />
                  {t.twofa.verify.btn}
                </button>

                <p className="text-xs text-muted font-mono mt-6 pt-6 border-t" style={{ borderColor: LINE }}>{t.twofa.verify.footer}</p>
              </div>
            </motion.div>

            {/* Hardware token sub-card */}
            <motion.div variants={fadeUp} className="col-span-12 lg:col-span-5 p-6 rounded-2xl border flex flex-col" style={{ borderColor: LINE, background: INK }} data-testid="hw-token">
              <div className="rounded-xl overflow-hidden border mb-4" style={{ borderColor: LINE }}>
                <img src="https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800" alt="YubiKey hardware key" className="w-full h-40 object-cover" />
              </div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-display font-extrabold text-lg">{t.twofa.verify.hw}</h4>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono" style={{ background: `${LIME}15`, color: LIME }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: LIME }} /> {t.twofa.verify.hwStatus}
                </span>
              </div>
              <p className="text-xs text-muted font-mono uppercase tracking-wider">{t.twofa.verify.hwTag}</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ PROCESO ═══════════════ */}
      <section id="proceso" className="relative py-24 lg:py-32 scroll-mt-20" style={{ background: INK }} data-testid="process">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-16 mb-16">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="lg:col-span-6">
              <motion.span variants={fadeUp} className="block text-xs font-mono uppercase tracking-widest mb-4" style={{ color: CYAN }}>{t.process.tag}</motion.span>
              <motion.h2 variants={fadeUp} className="font-display font-extrabold text-3xl lg:text-5xl mb-6">{t.process.title}</motion.h2>
              <motion.p variants={fadeUp} className="text-base text-muted max-w-lg leading-relaxed">{t.process.intro}</motion.p>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="lg:col-span-6 rounded-2xl overflow-hidden border" style={{ borderColor: LINE }} data-testid="process-img">
              <img src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Team collaboration" className="w-full h-72 object-cover" />
            </motion.div>
          </div>

          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {t.process.steps.map((s, i) => (
              <motion.div key={i} variants={fadeUp} className="p-8 rounded-2xl border group transition-all hover:-translate-y-1 relative overflow-hidden" style={{ borderColor: LINE, background: SURFACE }} data-testid={`step-${i}`}>
                <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 blur-3xl transition-opacity" style={{ background: `${CYAN}15` }} />
                <div className="relative">
                  <div className="text-5xl font-display font-extrabold mb-6" style={{ color: CYAN }}>{s.n}</div>
                  <h3 className="font-display font-extrabold text-lg mb-3">{s.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ TIPS ═══════════════ */}
      <section className="relative py-24 lg:py-32" style={{ background: SURFACE }} data-testid="tips">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="mb-16">
            <motion.span variants={fadeUp} className="block text-xs font-mono uppercase tracking-widest mb-4" style={{ color: LIME }}>{t.tips.tag}</motion.span>
            <motion.h2 variants={fadeUp} className="font-display font-extrabold text-3xl lg:text-5xl">{t.tips.title}</motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="grid md:grid-cols-2 gap-4">
            {t.tips.items.map((tip, i) => (
              <motion.div key={i} variants={fadeUp} className="flex items-start gap-5 p-6 rounded-2xl border transition-all hover:-translate-y-1 group" style={{ borderColor: LINE, background: INK }} data-testid={`tip-${i}`}>
                <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold" style={{ background: `${LIME}15`, color: LIME }}>{i + 1}</div>
                <p className="text-sm text-paper leading-relaxed pt-2">{tip}</p>
              </motion.div>
            ))}
            {/* Filler card for grid balance */}
            <motion.div variants={fadeUp} className="hidden md:flex items-center justify-center p-6 rounded-2xl border" style={{ borderColor: LINE, background: `${CYAN}08` }} data-testid="tip-cta">
              <a href="#contacto" className="inline-flex items-center gap-2 font-display font-extrabold text-lg group">
                {t.nav.cta}
                <ArrowRight size={20} weight="bold" className="group-hover:translate-x-1 transition-transform" style={{ color: CYAN }} />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ FAQ ═══════════════ */}
      <section id="faq" className="relative py-24 lg:py-32 scroll-mt-20" style={{ background: INK }} data-testid="faq">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="mb-12 text-center">
            <motion.span variants={fadeUp} className="block text-xs font-mono uppercase tracking-widest mb-4" style={{ color: CYAN }}>{t.faq.tag}</motion.span>
            <motion.h2 variants={fadeUp} className="font-display font-extrabold text-3xl lg:text-5xl">{t.faq.title}</motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="space-y-3">
            {t.faq.items.map((item, i) => (
              <motion.div key={i} variants={fadeUp} className="rounded-2xl border overflow-hidden" style={{ borderColor: LINE, background: SURFACE }} data-testid={`faq-${i}`}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-6 text-left"
                >
                  <span className="font-display font-extrabold text-base lg:text-lg">{item.q}</span>
                  <span className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors" style={{ background: openFaq === i ? `${CYAN}20` : `${LINE}` }}>
                    {openFaq === i ? <X size={16} weight="bold" style={{ color: CYAN }} /> : <Plus size={16} weight="bold" className="text-paper" />}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                      <p className="px-6 pb-6 text-sm text-muted leading-relaxed">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ CONTACTO ═══════════════ */}
      <section id="contacto" className="relative py-24 lg:py-32 scroll-mt-20" style={{ background: SURFACE }} data-testid="contact">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="mb-16 max-w-2xl">
            <motion.span variants={fadeUp} className="block text-xs font-mono uppercase tracking-widest mb-4" style={{ color: CYAN }}>{t.contact.tag}</motion.span>
            <motion.h2 variants={fadeUp} className="font-display font-extrabold text-3xl lg:text-5xl mb-4">{t.contact.title}</motion.h2>
            <motion.p variants={fadeUp} className="text-base text-muted leading-relaxed">{t.contact.sub}</motion.p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Contact info */}
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="lg:col-span-2 space-y-4" data-testid="contact-info">
              {[
                { icon: Phone, label: t.contact.phone, value: '+52 622 122 5103' },
                { icon: Envelope, label: t.contact.email, value: 'skylinksonora@gmail.com' },
                { icon: Buildings, label: t.contact.coverage, value: t.contact.coverageVal },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div key={i} variants={fadeUp} className="flex items-center gap-4 p-6 rounded-2xl border" style={{ borderColor: LINE, background: INK }} data-testid={`contact-card-${i}`}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${CYAN}10` }}>
                      <Icon size={24} weight="duotone" style={{ color: CYAN }} />
                    </div>
                    <div>
                      <p className="text-xs text-muted font-mono uppercase tracking-wider mb-1">{item.label}</p>
                      <p className="text-sm font-semibold">{item.value}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Form */}
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="lg:col-span-3 p-8 rounded-2xl border" style={{ borderColor: LINE, background: INK }} data-testid="contact-form-wrap">
              {submitted ? (
                <div className="text-center py-16" data-testid="form-success">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: `${LIME}15` }}>
                    <CheckCircle size={32} weight="duotone" style={{ color: LIME }} />
                  </div>
                  <h3 className="font-display font-extrabold text-xl mb-3">{t.contact.sent}</h3>
                  <p className="text-sm text-muted max-w-sm mx-auto mb-6">{t.contact.sentDesc}</p>
                  <button onClick={() => setSubmitted(false)} className="text-xs font-mono uppercase tracking-wider underline" style={{ color: CYAN }}>{t.contact.again}</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" data-testid="contact-form">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label={t.contact.form.name} name="name" value={form.name} onChange={handleChange} required />
                    <Field label={t.contact.form.emailL} name="email" type="email" value={form.email} onChange={handleChange} required />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label={t.contact.form.phone} name="phone" type="tel" value={form.phone} onChange={handleChange} required />
                    <Field label={t.contact.form.company} name="company" value={form.company} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">{t.contact.form.service}</label>
                    <select name="service" value={form.service} onChange={handleChange} className="w-full px-4 py-3 rounded-xl text-sm border bg-surface focus:outline-none focus:border-cyan transition-colors" style={{ borderColor: LINE }}>
                      <option value="">—</option>
                      <option value="Implementacion de Seguridad">{t.services.cards[0].title}</option>
                      <option value="Migracion a la Nube">{t.services.cards[1].title}</option>
                      <option value="Gestion Documental">{t.services.cards[2].title}</option>
                      <option value="Auditorias">{t.services.cards[3].title}</option>
                      <option value="Capacitacion">{t.services.cards[4].title}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">{t.contact.form.message}</label>
                    <textarea name="message" value={form.message} onChange={handleChange} rows={4} className="w-full px-4 py-3 rounded-xl text-sm border bg-surface focus:outline-none focus:border-cyan transition-colors resize-none" style={{ borderColor: LINE }} />
                  </div>
                  <button type="submit" disabled={submitting} className="w-full py-3.5 rounded-full font-semibold text-sm text-ink transition-all hover:scale-[1.01] disabled:opacity-60" style={{ background: LIME }} data-testid="submit-btn">
                    {submitting ? '...' : t.contact.form.btn}
                  </button>
                  <p className="text-center text-xs font-mono text-muted">{t.contact.footer}</p>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <Footer />
    </div>
  );
}

/* ---------- Reusable field component ---------- */
function Field({ label, name, type = 'text', value, onChange, required }: {
  label: string; name: string; type?: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">{label}{required && <span style={{ color: AMBER }}> *</span>}</label>
      <input type={type} name={name} value={value} onChange={onChange} required={required}
        className="w-full px-4 py-3 rounded-xl text-sm border bg-surface focus:outline-none focus:border-cyan transition-colors"
        style={{ borderColor: LINE }} />
    </div>
  );
}
