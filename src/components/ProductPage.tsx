import Navbar from './Navbar';
import Footer from './Footer';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductGrid from './ProductGrid';

interface ProductPageProps {
  badge: string;
  title: string;
  subtitle: string;
  heroImage: string;
  categoryId: string;
  searchQuery?: string;
  catalogTitle?: string;
}

export default function ProductPage({ badge, title, subtitle, heroImage, categoryId, searchQuery, catalogTitle }: ProductPageProps) {
  return (
    <div className="min-h-screen bg-ink text-paper overflow-x-hidden">
      <div className="noise-overlay" />
      <Navbar />

      <header className="relative min-h-[70vh] flex items-center overflow-hidden pt-28 pb-16">
        <div className="absolute inset-0 z-0">
          <img src={heroImage} alt={title} className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/85 via-black/70 to-ink" />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/90 via-transparent to-black/40" />
        <div className="absolute inset-0 z-10 grid-line opacity-60" />

        <div className="relative z-20 container mx-auto px-4">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
            className="font-mono text-[11px] md:text-xs uppercase tracking-[0.25em] text-cyan mb-6 flex items-center gap-3">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan animate-pulse" />
            {badge}
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
            className="font-display font-black tracking-tighter text-white leading-[1.0] text-4xl sm:text-5xl lg:text-6xl max-w-4xl">
            {title}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.6 }}
            className="mt-6 max-w-2xl text-base md:text-lg text-zinc-300 leading-relaxed">
            {subtitle}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}>
            <Link to="/#contacto" className="group mt-8 inline-flex items-center gap-2 bg-cyan text-black font-semibold rounded-full pl-6 pr-2 py-2 hover:bg-lime transition-colors duration-200">
              Solicitar asesoría
              <span className="grid place-items-center w-9 h-9 rounded-full bg-black text-cyan group-hover:rotate-45 transition-transform duration-300">
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </motion.div>
        </div>
      </header>

      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-cyan mb-3">// Catálogo</p>
          <h2 className="font-display font-bold tracking-tight text-3xl md:text-4xl text-white mb-3">{catalogTitle || title}</h2>
          <p className="text-zinc-400 max-w-2xl mb-12">
            Productos con precios directos de distribuidor, actualizados en tiempo real. Agrégalos al carrito y cotiza al instante.
          </p>
          <ProductGrid categoryId={categoryId} searchQuery={searchQuery} />
        </div>
      </section>

      <Footer />
    </div>
  );
}
