import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
 
const API_URL = "http://localhost:5001";
 
const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();
 
  const handleLogin = async (e) => {
    e.preventDefault();
    setMensagem("");
 
    try {
      const response = await axios.post(`${API_URL}/login`, { email, senha });
      const token = response.data.token;
 
      if (token) {
        localStorage.setItem("token", token);
        setMensagem("✅ Login realizado com sucesso!");
        setTimeout(() => navigate("/home"), 1000);
      } else {
        setMensagem("❌ Erro ao autenticar token");
      }
    } catch (erro) {
      console.error("Erro ao logar", erro);
      setMensagem("❌ Email ou senha incorretos.");
    }
  };
 
  return (
<div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
<div className="bg-gray-900 border border-gray-700 p-10 rounded-3xl shadow-2xl w-full max-w-md text-center">
        {/* Título */}
<h2 className="text-3xl font-extrabold text-indigo-400 mb-8">
          Academia<span className="text-white">Smart</span>
</h2>
<p className="text-gray-400 mb-8">Entre para continuar seu treino inteligente!</p>
 
        {/* Formulário */}
<form onSubmit={handleLogin} className="space-y-5">
<div className="text-left">
<label className="block text-sm font-semibold text-gray-300 mb-2">
              Email
</label>
<input
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-indigo-500 text-white placeholder-gray-500 transition"
              required
            />
</div>
 
          <div className="text-left">
<label className="block text-sm font-semibold text-gray-300 mb-2">
              Senha
</label>
<input
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-indigo-500 text-white placeholder-gray-500 transition"
              required
            />
</div>
 
          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white text-lg py-3 rounded-xl font-semibold transition-all duration-300 shadow-md"
>
            Entrar
</button>
</form>
 
        {/* Mensagem */}
        {mensagem && (
<p
            className={`mt-5 text-center ${
              mensagem.includes("sucesso")
                ? "text-green-400"
                : "text-red-400"
            }`}
>
            {mensagem}
</p>
        )}
 
        {/* Link para registro */}
<p className="mt-6 text-gray-400">
          Não tem conta?{" "}
<a
            href="/register"
            className="text-indigo-400 hover:underline font-medium"
>
            Criar Conta
</a>
</p>
</div>
</div>
  );
};
 
export default Login;