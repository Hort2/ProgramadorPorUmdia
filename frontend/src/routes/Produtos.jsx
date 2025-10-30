import { useState, useEffect } from "react";
import axios from "axios";

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [form, setForm] = useState({ nome: "", preco: "", categoria: "" });
  const [editId, setEditId] = useState(null);

  const API = "http://localhost:5001/products";

  useEffect(() => {
    axios.get(API).then((res) => setProdutos(res.data));
  }, []);

  const salvar = async () => {
    if (editId) {
      await axios.put(`${API}/${editId}`, form);
    } else {
      await axios.post(API, form);
    }
    setForm({ nome: "", preco: "", categoria: "" });
    setEditId(null);
    axios.get(API).then((res) => setProdutos(res.data));
  };

  const editar = (p) => {
    setForm(p);
    setEditId(p.id);
  };

  const excluir = async (id) => {
    await axios.delete(`${API}/${id}`);
    setProdutos(produtos.filter((p) => p.id !== id));
  };

  return (
    <div className="flex flex-col items-center py-14 px-6 text-white">
      <h2 className="text-4xl font-bold mb-8 text-indigo-400">Gerenciar Produtos</h2>

      <div className="w-full max-w-lg bg-gray-800 p-6 rounded-xl border border-gray-700 mb-10">
        <input
          type="text"
          placeholder="Nome"
          className="w-full mb-3 px-4 py-2 rounded bg-gray-900 border border-gray-700"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
        />
        <input
          type="number"
          placeholder="Preço"
          className="w-full mb-3 px-4 py-2 rounded bg-gray-900 border border-gray-700"
          value={form.preco}
          onChange={(e) => setForm({ ...form, preco: e.target.value })}
        />
        <input
          type="text"
          placeholder="Categoria"
          className="w-full mb-4 px-4 py-2 rounded bg-gray-900 border border-gray-700"
          value={form.categoria}
          onChange={(e) => setForm({ ...form, categoria: e.target.value })}
        />

        <button
          onClick={salvar}
          className="bg-indigo-500 hover:bg-indigo-600 w-full py-2 rounded font-semibold">
          {editId ? "Atualizar Produto" : "Adicionar Produto"}
        </button>
      </div>

      <table className="w-full max-w-3xl text-left border-collapse">
        <thead className="text-gray-300 border-b border-gray-700">
          <tr>
            <th>Nome</th>
            <th>Preço (R$)</th>
            <th>Categoria</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {produtos.map((p) => (
            <tr key={p.id} className="border-b border-gray-700">
              <td className="py-3">{p.nome}</td>
              <td>R$ {p.preco}</td>
              <td>{p.categoria}</td>
              <td className="flex gap-3 py-3">
                <button className="text-yellow-400" onClick={() => editar(p)}>Editar</button>
                <button className="text-red-500" onClick={() => excluir(p.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
