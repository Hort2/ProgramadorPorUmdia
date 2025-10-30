import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5001";

export default function Planos() {
  const [planos, setPlanos] = useState([]);
  const [form, setForm] = useState({ id: null, nome: "", preco: "", descricao: "" });

  const token = localStorage.getItem("token");
  const isAdmin = !!token;

  const carregar = async () => {
    const { data } = await axios.get(`${API}/planos`);
    setPlanos(data);
  };

  useEffect(() => {
    carregar();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const salvar = async (e) => {
    e.preventDefault();
    const headers = isAdmin ? { Authorization: `Bearer ${token}` } : {};
    const payload = { nome: form.nome, preco: form.preco, descricao: form.descricao };

    if (form.id) {
      await axios.put(`${API}/planos/${form.id}`, payload, { headers });
    } else {
      await axios.post(`${API}/planos`, payload, { headers });
    }
    setForm({ id: null, nome: "", preco: "", descricao: "" });
    carregar();
  };

  const editar = (p) => {
    setForm({ id: p.id, nome: p.nome, preco: p.preco, descricao: p.descricao || "" });
  };

  const excluir = async (id) => {
    const headers = isAdmin ? { Authorization: `Bearer ${token}` } : {};
    await axios.delete(`${API}/planos/${id}`, { headers });
    carregar();
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-6">
      <h2 className="text-4xl font-bold mb-6 text-indigo-400">Nossos Planos</h2>
      <p className="text-gray-300 mb-12 max-w-2xl text-lg leading-relaxed">
        Escolha o plano ideal para o seu estilo de treino e aproveite todos os benefícios
        da AcademiaSmart. Flexibilidade, suporte e tecnologia para você evoluir sempre.
      </p>

      {/* Lista de planos (dinâmica) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl w-full">
        {planos.map((plano) => (
          <div key={plano.id} className="bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-indigo-500 shadow-lg transition transform hover:-translate-y-2">
            <h3 className="text-2xl font-bold text-indigo-400 mb-4">{plano.nome}</h3>
            <p className="text-gray-400 mb-6">{plano.descricao}</p>
            <span className="text-4xl font-extrabold text-white mb-6 block">R${plano.preco}/mês</span>
            <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold transition">
              Assinar
            </button>

            {isAdmin && (
              <div className="flex justify-between mt-4 text-sm">
                <button onClick={() => editar(plano)} className="px-3 py-1 rounded-md bg-gray-700 hover:bg-gray-600">Editar</button>
                <button onClick={() => excluir(plano.id)} className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-500">Excluir</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Formulário de cadastro/edição (só quando logado) */}
      {isAdmin && (
        <form onSubmit={salvar} className="mt-12 bg-gray-900 border border-gray-700 rounded-2xl p-8 w-full max-w-xl text-left">
          <h3 className="text-indigo-400 text-xl font-semibold mb-4">{form.id ? "Editar plano" : "Cadastrar novo plano"}</h3>
          <div className="space-y-3">
            <input
              name="nome"
              value={form.nome}
              onChange={onChange}
              placeholder="Nome"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white"
            />
            <input
              name="preco"
              value={form.preco}
              onChange={onChange}
              placeholder="Preço (ex: 89.90)"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white"
            />
            <textarea
              name="descricao"
              value={form.descricao}
              onChange={onChange}
              placeholder="Descrição do plano"
              rows="3"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white"
            />
          </div>
          <div className="mt-4 flex gap-3">
            <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold transition">
              {form.id ? "Salvar alterações" : "Criar plano"}
            </button>
            {form.id && (
              <button
                type="button"
                onClick={() => setForm({ id: null, nome: "", preco: "", descricao: "" })}
                className="px-6 py-3 rounded-xl border border-gray-600 hover:bg-gray-800"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
