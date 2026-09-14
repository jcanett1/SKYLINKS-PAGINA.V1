import { useState } from 'react';
import {
  Bot,
  MessageCircle,
  Clock,
  Zap,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Phone,
  Mail,
  Building2,
  Calendar,
  Brain,
  Database,
  Bell,
  BarChart3,
  Search,
  Filter,
  FileText,
  AlertTriangle,
  Sparkles,
  Send,
  Wifi,
  Headphones,
  DollarSign,
  Globe,
  Cog,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { submitContactForm } from '../lib/supabase';
import toast, { Toaster } from 'react-hot-toast';

const NAVY = '#0A1628';
const NAVY_LIGHT = '#111D2E';
const GOLD = '#D4A853';
const BORDER = '#E2E8F0';
const BG_LIGHT = '#F8FAFC';

interface FormState {
  name: string;
  email: string;
  phone: string;
  company: string;
  employees: string;
  service: string;
  message: string;
}

const initialForm: FormState = {
  name: '', email: '', phone: '', company: '', employees: '', service: '', message: '',
};

export default function AutomatizacionesIA() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      toast.error('Por favor complete los campos requeridos');
      return;
    }
    setSubmitting(true);
    try {
      await submitContactForm({
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: `Empresa: ${form.company}. Empleados: ${form.employees}. Servicio: ${form.service}. Mensaje: ${form.message}`,
        service_type: form.service || 'Automatizaciones IA WhatsApp',
        address: form.company,
        preferred_contact_method: 'email',
      });
      setSubmitted(true);
      setForm(initialForm);
    } catch {
      toast.error('Error al enviar. Por favor intente nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const pains = [
    {
      stat: '78%',
      icon: Clock,
      title: 'Respondes tarde y pierdes leads',
      desc: 'La mayoría de clientes compra al que responde primero. Si tu equipo no está disponible 24/7, los leads se enfrían y migran a la competencia.',
    },
    {
      stat: '80%',
      icon: AlertTriangle,
      title: 'Tu equipo repite lo mismo',
      desc: 'Ocho de cada diez consultas son preguntas frecuentes: precios, horarios, disponibilidad. Tu personal debería cerrar ventas, no repetir respuestas.',
    },
    {
      stat: '3x',
      icon: DollarSign,
      title: 'Costos crecen sin escalar',
      desc: 'Cada vez que necesitas atender más clientes, contratas más personal. El crecimiento de tu negocio no debería depender linealmente de tu nómina.',
    },
  ];

  const advantages = [
    { icon: Globe, title: 'Disponibilidad 24/7', desc: 'Atiende de madrugada, fines de semana y festivos. Ningún lead se enfría por falta de respuesta.' },
    { icon: Brain, title: 'Contexto y empatía', desc: 'Entiende el tono de la conversación, recuerda el hilo y responde con lenguaje natural, no con menús rígidos.' },
    { icon: Zap, title: 'Reducción de costos', desc: 'Absorbe hasta el 80% de consultas repetitivas. Tu equipo se enfoca en ventas complejas y relaciones clave.' },
    { icon: TrendingUp, title: 'Escalabilidad instantánea', desc: 'Atiende a miles de clientes en paralelo sin aumentar la nómina. Cada usuario recibe respuesta en segundos.' },
  ];

  const chatSolutions = [
    { icon: Filter, title: 'Calificación de leads', desc: 'La IA conversa, hace las preguntas correctas y pasa solo contactos calientes al equipo de ventas.' },
    { icon: Calendar, title: 'Agendamiento automático', desc: 'Integrado con Google Calendar o Calendly. El cliente pide cita y la IA la agenda sin intervención humana.' },
    { icon: Headphones, title: 'FAQ dinámica', desc: 'Entrenada con tu catálogo, precios y políticas. Responde cualquier duda técnica o comercial al momento.' },
    { icon: MessageCircle, title: 'Cierre de ventas asistido', desc: 'Guía al cliente desde la primera pregunta hasta el pago. Recomienda, responde objeciones y confirma.' },
  ];

  const backofficeSolutions = [
    { icon: Database, title: 'Sincronización CRM', desc: 'Cada dato capturado en WhatsApp se registra automáticamente en HubSpot, Salesforce, Notion o Sheets.' },
    { icon: Bell, title: 'Alertas de envío', desc: 'Envía confirmaciones de compra, códigos de rastreo y recordatorios de pago directamente por WhatsApp.' },
    { icon: BarChart3, title: 'Reportes por mensaje', desc: 'El gerente pregunta "¿Cuántas ventas hoy?" y la IA consulta la base de datos y responde con el resumen.' },
    { icon: FileText, title: 'Tickets automáticos', desc: 'Cuando un cliente reporta un problema, la IA crea el ticket en tu sistema de soporte y lo asigna.' },
  ];

  const steps = [
    { n: '01', title: 'Diagnóstico', icon: Search, desc: 'Analizamos tus flujos de atención, volumen de mensajes y procesos actuales. Identificamos automatizaciones de alto impacto.' },
    { n: '02', title: 'Integración', icon: Wifi, desc: 'Configuramos la IA con tu WhatsApp Business, conectamos CRM, calendario e inventario, y entrenamos con tu información.' },
    { n: '03', title: 'Optimización', icon: Sparkles, desc: 'Monitoreamos conversaciones reales, ajustamos respuestas y escalamos funcionalidades. Mejora semana a semana.' },
  ];

  const metrics = [
    { value: '<3s', label: 'Tiempo de respuesta' },
    { value: '80%', label: 'Consultas automatizadas' },
    { value: '24/7', label: 'Atención continua' },
    { value: '3x', label: 'Más leads atendidos' },
  ];

  const clients = ['Retail', 'Salud', 'Inmobiliaria', 'Educación', 'Logística', 'Financiero'];

  return (
    <>
      <Toaster position="top-center" />
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden" style={{ background: NAVY }}>
        <div className="absolute inset-0 opacity-[0.04]">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="geo" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M40 0L80 40L40 80L0 40Z" fill="none" stroke="#fff" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#geo)" />
          </svg>
        </div>
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />

        <div className="relative container mx-auto px-6 py-28 lg:py-36 grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs font-semibold tracking-wide uppercase mb-8 border"
              style={{ borderColor: `${GOLD}30`, color: GOLD }}>
              <Bot className="w-3.5 h-3.5" />
              Solución Enterprise para WhatsApp
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-[3.4rem] font-bold text-white leading-[1.15] tracking-tight mb-6">
              Automatización inteligente <br />
              <span style={{ color: GOLD }}>para atención al cliente</span>
            </h1>
            <p className="text-base text-slate-400 mb-10 max-w-lg leading-relaxed">
              Asistentes de IA que conversan, califican leads, agendan citas y conectan con tus sistemas
              empresariales — operando 24/7 dentro de WhatsApp con lenguaje natural y contexto real.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="#contacto" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-sm font-semibold text-sm transition-all hover:opacity-90"
                style={{ background: GOLD, color: NAVY }}>
                Agendar Demo Estratégica
                <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#como-funciona" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-sm font-semibold text-sm text-white border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all">
                Ver Proceso
              </a>
            </div>
            <div className="mt-12 flex flex-wrap items-center gap-6">
              {['WhatsApp Business API', 'Lenguaje natural', 'Integración CRM'].map((b) => (
                <span key={b} className="inline-flex items-center gap-2 text-xs text-slate-500">
                  <CheckCircle className="w-3.5 h-3.5" style={{ color: GOLD }} />
                  {b}
                </span>
              ))}
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="relative rounded-sm overflow-hidden aspect-[4/3] border border-white/10">
              <img
                src="https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Asistente de inteligencia artificial automatizando atención al cliente"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 60%, rgba(10,22,40,0.8))' }} />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="grid grid-cols-2 gap-px" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  {metrics.map((m) => (
                    <div key={m.label} className="p-5" style={{ background: NAVY_LIGHT }}>
                      <span className="text-2xl font-bold block mb-1" style={{ color: GOLD }}>{m.value}</span>
                      <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{m.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-600 mt-3 text-right tracking-wide">
              Métricas promedio basadas en implementaciones B2B
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24" style={{ background: 'linear-gradient(to top, #F8FAFC, transparent)' }} />
      </section>

      {/* TRUST STRIP */}
      <section className="py-8 border-b" style={{ background: BG_LIGHT, borderColor: BORDER }}>
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-14">
            {clients.map((c) => (
              <span key={c} className="text-xs font-semibold text-slate-400 tracking-widest uppercase">
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEMAS */}
      <section className="py-24" style={{ background: BG_LIGHT }}>
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-16">
            <div className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
              <span className="text-xs font-semibold tracking-widest uppercase mb-4 block" style={{ color: GOLD }}>Diagnóstico</span>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: NAVY }}>
                Problemas que paralizan el crecimiento
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                Identificamos estos tres cuellos de botella en el 90% de las empresas que evaluamos.
              </p>
              <div className="mt-8 rounded-sm overflow-hidden aspect-[4/3] border" style={{ borderColor: BORDER }}>
                <img
                  src="https://images.pexels.com/photos/8386437/pexels-photo-8386437.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Equipo de trabajo abrumado con consultas repetitivas"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-8 grid md:grid-cols-3 gap-6">
              {pains.map((p, i) => {
                const Icon = p.icon;
                return (
                  <div key={i} className="bg-white p-8 border hover:border-slate-300 transition-colors"
                    style={{ borderColor: BORDER }}>
                    <div className="text-3xl font-bold mb-6" style={{ color: GOLD }}>{p.stat}</div>
                    <div className="w-10 h-10 flex items-center justify-center mb-4" style={{ background: `${GOLD}10` }}>
                      <Icon className="w-5 h-5" style={{ color: GOLD }} />
                    </div>
                    <h3 className="text-base font-bold mb-3" style={{ color: NAVY }}>{p.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{p.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* VENTAJAS */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold tracking-widest uppercase mb-4 block" style={{ color: GOLD }}>Ventajas</span>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: NAVY }}>
              Por qué las empresas eligen esta tecnología
            </h2>
            <p className="text-sm text-slate-500 max-w-xl mx-auto">
              No es un chatbot tradicional. Es un sistema de inteligencia artificial que entiende, aprende y resuelve en tiempo real.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map((a, i) => {
              const Icon = a.icon;
              return (
                <div key={i} className="group p-8 border hover:border-slate-300 transition-colors"
                  style={{ borderColor: BORDER, background: i % 2 === 0 ? BG_LIGHT : 'white' }}>
                  <div className="w-10 h-10 flex items-center justify-center mb-5" style={{ background: `${GOLD}10` }}>
                    <Icon className="w-5 h-5" style={{ color: GOLD }} />
                  </div>
                  <h4 className="text-base font-bold mb-2" style={{ color: NAVY }}>{a.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{a.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SOLUCIONES — PILAR 1 */}
      <section className="py-24" style={{ background: NAVY }}>
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 flex items-center justify-center" style={{ background: `${GOLD}15` }}>
              <MessageCircle className="w-4 h-4" style={{ color: GOLD }} />
            </div>
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: GOLD }}>Pilar I</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Automatización de chats y atención comercial
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mb-14">
            IA que conversa, califica, agenda y cierra — todo dentro de WhatsApp, con el tono y contexto de tu marca.
          </p>

          <div className="grid lg:grid-cols-5 gap-8 mb-16">
            <div className="lg:col-span-3 grid md:grid-cols-2 gap-4">
              {chatSolutions.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className="p-8 border border-white/10 hover:border-white/20 transition-colors"
                    style={{ background: NAVY_LIGHT }}>
                    <div className="w-10 h-10 flex items-center justify-center mb-5" style={{ background: `${GOLD}10` }}>
                      <Icon className="w-5 h-5" style={{ color: GOLD }} />
                    </div>
                    <h4 className="text-sm font-bold text-white mb-2">{s.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                  </div>
                );
              })}
            </div>
            <div className="lg:col-span-2 rounded-sm overflow-hidden border border-white/10 aspect-[4/3] lg:aspect-auto">
              <img
                src="https://images.pexels.com/photos/16380905/pexels-photo-16380905.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Interfaz de chatbot de IA en pantalla de smartphone"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SOLUCIONES — PILAR 2 */}
      <section className="py-24" style={{ background: BG_LIGHT }}>
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 flex items-center justify-center" style={{ background: `${GOLD}10` }}>
              <Cog className="w-4 h-4" style={{ color: GOLD }} />
            </div>
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: GOLD }}>Pilar II</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: NAVY }}>
            Automatización de tareas internas
          </h2>
          <p className="text-sm text-slate-500 max-w-2xl mb-14">
            Conecta WhatsApp con tus sistemas operativos y elimina el trabajo manual de transcripción y seguimiento.
          </p>

          <div className="grid lg:grid-cols-5 gap-8 mb-16">
            <div className="lg:col-span-2 rounded-sm overflow-hidden border aspect-[4/3] lg:aspect-auto" style={{ borderColor: BORDER }}>
              <img
                src="https://images.pexels.com/photos/8566526/pexels-photo-8566526.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Automatización robótica en entorno empresarial"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="lg:col-span-3 grid md:grid-cols-2 gap-4">
              {backofficeSolutions.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className="p-8 border hover:border-slate-300 transition-colors bg-white"
                    style={{ borderColor: BORDER }}>
                    <div className="w-10 h-10 flex items-center justify-center mb-5" style={{ background: `${GOLD}10` }}>
                      <Icon className="w-5 h-5" style={{ color: GOLD }} />
                    </div>
                    <h4 className="text-sm font-bold mb-2" style={{ color: NAVY }}>{s.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* PROCESO */}
      <section id="como-funciona" className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold tracking-widest uppercase mb-4 block" style={{ color: GOLD }}>Metodología</span>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: NAVY }}>
              Implementación en tres fases
            </h2>
            <p className="text-sm text-slate-500 max-w-lg mx-auto">
              Proceso estructurado, sin fricción, orientado a resultados medibles desde la primera semana.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 grid md:grid-cols-3 gap-px" style={{ background: BORDER }}>
              {steps.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className="bg-white p-10 group">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 flex items-center justify-center" style={{ background: NAVY }}>
                        <Icon className="w-5 h-5" style={{ color: GOLD }} />
                      </div>
                      <span className="text-2xl font-bold" style={{ color: GOLD }}>{s.n}</span>
                    </div>
                    <h4 className="text-lg font-bold mb-3" style={{ color: NAVY }}>{s.title}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                  </div>
                );
              })}
            </div>
            <div className="rounded-sm overflow-hidden border aspect-[4/3] lg:aspect-auto" style={{ borderColor: BORDER }}>
              <img
                src="https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Equipo de negocios colaborando con tecnología"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA DARK */}
      <section className="py-24" style={{ background: NAVY }}>
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-xs font-semibold tracking-widest uppercase mb-6 block" style={{ color: GOLD }}>Evaluación sin costo</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6 leading-tight">
              Tu negocio no puede esperar. <br />
              <span style={{ color: GOLD }}>Los leads tampoco.</span>
            </h2>
            <p className="text-sm text-slate-400 mb-10 leading-relaxed max-w-xl mx-auto">
              Agendemos una reunión estratégica de 20 minutos. Te mostraremos cómo funciona la IA con tu propio catálogo, precios y procesos operativos.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <a href="https://wa.me/526221225103" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-sm font-semibold text-sm transition-all hover:opacity-90"
                style={{ background: GOLD, color: NAVY }}>
                <Send className="w-4 h-4" />
                Contactar por WhatsApp
              </a>
              <a href="#contacto"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-sm font-semibold text-sm text-white border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all">
                Agendar Reunión
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FORMULARIO */}
      <section id="contacto" className="py-24" style={{ background: BG_LIGHT }}>
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-5 gap-16 items-start">
              <div className="lg:col-span-2">
                <span className="text-xs font-semibold tracking-widest uppercase mb-4 block" style={{ color: GOLD }}>Contacto</span>
                <h2 className="text-2xl font-bold mb-4" style={{ color: NAVY }}>
                  Solicita tu evaluación estratégica
                </h2>
                <p className="text-sm text-slate-500 mb-10 leading-relaxed">
                  Un especialista en automatización empresarial te contactará en menos de 24 horas para agendar tu demostración.
                </p>

                <div className="space-y-6">
                  {[
                    { icon: Phone, label: 'Teléfono directo', value: '+52 622 122 5103' },
                    { icon: Mail, label: 'Correo electrónico', value: 'skylinksonora@gmail.com' },
                    { icon: Building2, label: 'Cobertura', value: 'Guaymas y San Carlos, Sonora' },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex items-center gap-4">
                        <div className="w-9 h-9 flex items-center justify-center" style={{ background: `${GOLD}10` }}>
                          <Icon className="w-4 h-4" style={{ color: GOLD }} />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider">{item.label}</p>
                          <p className="text-sm font-semibold" style={{ color: NAVY }}>{item.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 rounded-sm overflow-hidden aspect-[4/3] border" style={{ borderColor: BORDER }}>
                  <img
                    src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Reunión profesional de automatización empresarial"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="mt-6 p-5 border" style={{ borderColor: `${GOLD}30`, background: `${GOLD}06` }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: GOLD }}>Sin compromiso</p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    La evaluación inicial es gratuita. Sin contratos forzosos ni presiones de venta.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-3">
                <div className="bg-white p-8 border" style={{ borderColor: BORDER }}>
                  {submitted ? (
                    <div className="text-center py-12">
                      <div className="w-14 h-14 flex items-center justify-center mx-auto mb-5" style={{ background: `${GOLD}10` }}>
                        <CheckCircle className="w-7 h-7" style={{ color: GOLD }} />
                      </div>
                      <h3 className="text-xl font-bold mb-3" style={{ color: NAVY }}>Solicitud Recibida</h3>
                      <p className="text-sm text-slate-500 max-w-sm mx-auto">
                        Un especialista se pondrá en contacto contigo en las próximas 24 horas.
                      </p>
                      <button onClick={() => setSubmitted(false)} className="mt-6 text-xs font-semibold underline" style={{ color: NAVY }}>
                        Enviar otra solicitud
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Nombre completo <span className="text-red-500">*</span></label>
                          <input name="name" value={form.name} onChange={handleChange} required placeholder="Juan García"
                            className="w-full px-4 py-3 text-sm border border-slate-200 focus:outline-none focus:border-slate-400 transition-colors"
                            style={{ background: BG_LIGHT }} />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Correo electrónico <span className="text-red-500">*</span></label>
                          <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="juan@empresa.com"
                            className="w-full px-4 py-3 text-sm border border-slate-200 focus:outline-none focus:border-slate-400 transition-colors"
                            style={{ background: BG_LIGHT }} />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Teléfono <span className="text-red-500">*</span></label>
                          <input name="phone" type="tel" value={form.phone} onChange={handleChange} required placeholder="10 dígitos"
                            className="w-full px-4 py-3 text-sm border border-slate-200 focus:outline-none focus:border-slate-400 transition-colors"
                            style={{ background: BG_LIGHT }} />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Empresa</label>
                          <input name="company" value={form.company} onChange={handleChange} placeholder="Nombre de tu empresa"
                            className="w-full px-4 py-3 text-sm border border-slate-200 focus:outline-none focus:border-slate-400 transition-colors"
                            style={{ background: BG_LIGHT }} />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Empleados</label>
                          <select name="employees" value={form.employees} onChange={handleChange}
                            className="w-full px-4 py-3 text-sm border border-slate-200 focus:outline-none focus:border-slate-400 transition-colors bg-white"
                            style={{ background: BG_LIGHT }}>
                            <option value="">Selecciona</option>
                            <option value="1-10">1 - 10</option>
                            <option value="11-50">11 - 50</option>
                            <option value="51-200">51 - 200</option>
                            <option value="201+">201 o más</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Servicio de interés</label>
                          <select name="service" value={form.service} onChange={handleChange}
                            className="w-full px-4 py-3 text-sm border border-slate-200 focus:outline-none focus:border-slate-400 transition-colors bg-white"
                            style={{ background: BG_LIGHT }}>
                            <option value="">Selecciona</option>
                            <option value="Calificacion de Leads">Calificación de Leads</option>
                            <option value="Agendamiento de Citas">Agendamiento de Citas</option>
                            <option value="FAQ Dinamicas">FAQ Dinámica</option>
                            <option value="Cierre de Ventas">Cierre de Ventas</option>
                            <option value="Sincronizacion CRM">Sincronización CRM</option>
                            <option value="Alertas de Envios">Alertas de Envío</option>
                            <option value="Reportes Automatizados">Reportes Automatizados</option>
                            <option value="No lo se aun">No lo sé aún</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Mensaje</label>
                        <textarea name="message" value={form.message} onChange={handleChange} rows={3}
                          placeholder="¿Cuántos mensajes recibes al día? ¿Qué procesos te gustaría automatizar?"
                          className="w-full px-4 py-3 text-sm border border-slate-200 focus:outline-none focus:border-slate-400 transition-colors resize-none"
                          style={{ background: BG_LIGHT }} />
                      </div>

                      <button type="submit" disabled={submitting}
                        className="w-full py-3.5 font-semibold text-sm text-white transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                        style={{ background: NAVY }}>
                        {submitting ? (
                          <span className="inline-flex items-center gap-2">
                            <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Enviando...
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2">
                            Solicitar evaluación
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        )}
                      </button>

                      <p className="text-[10px] text-slate-400 text-center tracking-wide">
                        Al enviar, aceptas que nos comuniquemos contigo. Sin spam.
                      </p>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </>
  );
}
