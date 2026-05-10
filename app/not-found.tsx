export default function NotFound() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-[clamp(4rem,12vw,12rem)] font-black tracking-tighter leading-none">
        404
      </h1>
      <p className="mt-4 text-lg md:text-xl text-white/70 tracking-widest">
        PÁGINA NÃO ENCONTRADA
      </p>
      <a
        href="/"
        className="mt-10 inline-block px-8 py-4 border-2 border-white text-white font-bold tracking-widest hover:bg-white hover:text-black transition-colors"
      >
        VOLTAR
      </a>
    </main>
  );
}
