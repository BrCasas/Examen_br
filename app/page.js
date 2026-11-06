'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [usuarios, setUsuarios] = useState([]);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    fetch('/api/usuarios')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setUsuarios(data);
      })
      .catch((err) => console.error("Error cargando usuarios:", err));
  }, []);

  const agregarUsuario = async (e) => {
    e.preventDefault();
    if (!nombre || !email) return;

    setCargando(true);
    try {
      const res = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email }),
      });

      if (res.ok) {
        const nuevo = await res.json();
        setUsuarios([...usuarios, nuevo]);
        setNombre('');
        setEmail('');
      }
    } catch (error) {
      console.error("Error al guardar:", error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-lg bg-slate-900/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-slate-800">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            Proyecto Fullstack
          </h1>
          <p className="text-slate-400 text-sm">
            Conectado a Neon Database y listo para Vercel
          </p>
        </div>

        <form onSubmit={agregarUsuario} className="space-y-4 mb-8">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Nombre</label>
            <input 
              type="text" 
              placeholder="Ej. Brandon Casasola" 
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-white placeholder-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Correo Electrónico</label>
            <input 
              type="email" 
              placeholder="ejemplo@correo.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-white placeholder-slate-500"
            />
          </div>

          <button 
            type="submit" 
            disabled={cargando}
            className="w-full mt-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-900/30 transition-all duration-200 transform active:scale-[0.98] disabled:opacity-50">
            {cargando ? 'Guardando...' : 'Guardar Registro'}
          </button>
        </form>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 pb-2 border-b border-slate-800 flex justify-between items-center">
            <span>Registros en Neon DB</span>
            <span className="bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full text-xs">
              {usuarios.length} total
            </span>
          </h2>

          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            {usuarios.length === 0 ? (
              <div className="text-center py-8 text-slate-500 bg-slate-950/30 rounded-xl border border-dashed border-slate-800">
                <p className="text-sm">No hay registros todavía.</p>
                <p className="text-xs text-slate-600 mt-1">Agrega uno arriba para verlo aquí.</p>
              </div>
            ) : (
              usuarios.map((u) => (
                <div key={u.id} className="bg-slate-950/50 hover:bg-slate-950 p-4 rounded-xl border border-slate-800/80 transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <span className="font-semibold text-slate-200">{u.nombre}</span>
                  <span className="text-slate-400 text-xs sm:text-sm bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800 w-fit">
                    {u.email}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </main>
  );
} 