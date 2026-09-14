import { useEffect, useState } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function PagoExitoso() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const sessionId = new URLSearchParams(window.location.search).get('session_id');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (sessionId) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-ink text-paper flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-20">
      <div className="max-w-md w-full text-center">
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 animate-spin text-cyan mb-4" />
            <p className="text-zinc-400">Confirmando tu pago...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-lime/15 flex items-center justify-center mb-6">
              <CheckCircle className="w-10 h-10 text-lime" />
            </div>
            <h1 className="font-display text-3xl font-bold text-white mb-3">¡Pago completado!</h1>
            <p className="text-zinc-400 mb-2">
              Tu pedido ha sido procesado correctamente. Recibirás un correo de confirmación pronto.
            </p>
            {sessionId && (
              <p className="font-mono text-xs text-zinc-600 mb-8">ID: {sessionId}</p>
            )}
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-cyan text-black font-semibold rounded-full px-6 py-3 hover:bg-lime transition-colors"
            >
              Volver al inicio
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <h1 className="font-display text-3xl font-bold text-white mb-3">Algo salió mal</h1>
            <p className="text-zinc-400 mb-8">No pudimos confirmar tu pago. Contáctanos para asistencia.</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 border border-white/20 text-white font-medium rounded-full px-6 py-3 hover:border-cyan hover:text-cyan transition-colors"
            >
              Volver al inicio
            </Link>
          </div>
        )}
      </div>
      </div>
      <Footer />
    </div>
  );
}
