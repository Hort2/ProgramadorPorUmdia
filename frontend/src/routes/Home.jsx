import { useEffect } from "react";
 
export default function Home() {
  useEffect(() => {
    document.title = "Academia Inteligente";
  }, []);
 
  return (
<div className="flex flex-col items-center justify-center text-center px-6 py-16">
<h2 className="text-5xl font-extrabold mb-4 text-indigo-400 drop-shadow-md">
        Treine de forma <span className="text-white">inteligente</span>
</h2>
<p className="text-gray-300 max-w-2xl mb-10 text-lg leading-relaxed">
        A AcademiaSmart combina tecnologia, personalização e acompanhamento para garantir
        o máximo resultado em cada treino. Treine no seu ritmo e alcance seu melhor desempenho.
</p>
 
      <a
        href="/planos"
        className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold transition shadow-md"
>
        Comece Agora !!
</a>
 
      <section className="grid grid-cols-1 md:grid-cols-3 gap-10 px-10 py-16 mt-16 bg-gray-800 border-t border-gray-700 rounded-xl w-full max-w-6xl shadow-lg">
<div className="flex flex-col items-center text-center">
<div className="text-6xl mb-4">🏋️‍♂️</div>
<h3 className="text-xl font-semibold mb-3 text-indigo-400">
            Treinos Personalizados
</h3>
<p className="text-gray-400">
            Acompanhe sua evolução com treinos moldados para seus objetivos e nível de experiência.
</p>
</div>
 
        <div className="flex flex-col items-center text-center">
<div className="text-6xl mb-4">📱</div>
<h3 className="text-xl font-semibold mb-3 text-indigo-400">Tecnologia Integrada</h3>
<p className="text-gray-400">
            Tenha acesso a relatórios, gráficos e acompanhamento via aplicativo inteligente.
</p>
</div>
 
        <div className="flex flex-col items-center text-center">
<div className="text-6xl mb-4">💡</div>
<h3 className="text-xl font-semibold mb-3 text-indigo-400">
            Resultados Reais
</h3>
<p className="text-gray-400">
            Monitore seu desempenho e veja resultados visíveis com o suporte da nossa equipe técnica.
</p>
</div>
</section>
</div>
  );
}