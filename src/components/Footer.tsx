import LogoImage from './LogoImage';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black py-10">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <LogoImage src="/image.png" className="w-8 h-8 object-contain" />
          <div className="flex flex-col">
            <span className="text-xl font-display font-extrabold tracking-tight text-white">SKYLINKS</span>
            <span className="text-[9px] text-muted font-mono tracking-[0.15em] -mt-0.5 uppercase">Telecomunicaciones · Voz &amp; Datos</span>
          </div>
        </div>
        <p className="font-mono text-xs text-zinc-500 text-center">© 2024 - {new Date().getFullYear()} SKYLINKS Telecomunicaciones Voz &amp; Datos. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
