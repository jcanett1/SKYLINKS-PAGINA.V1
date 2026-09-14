import { XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function PagoCancelado() {
  return (
    <div className="min-h-screen bg-ink text-paper flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-amber/15 flex items-center justify-center mb-6 mx-auto">
            <XCircle className="w-10 h-10 text-amber" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white mb-3">Pago cancelado</h1>
          <p className="text-zinc-400 mb-8">
            Tu pago fue cancelado. No se realizó ningún cargo. Puedes volver a intentarlo cuando quieras.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 border border-white/20 text-white font-medium rounded-full px-6 py-3 hover:border-cyan hover:text-cyan transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
