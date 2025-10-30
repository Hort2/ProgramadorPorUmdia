import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
 
const Register = () => {
  // HOOKS
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
 
  // Função de cadastro
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5001/register", {
        email,
        senha,
      });
      setMessage(response.data.message);
      setTimeout(() => navigate("/"), 2000);
    } catch (erro) {
      setMessage(erro.response?.data?.message || "Erro ao registrar usuário");
    }
  };
 
  return (
<div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
<div className="bg-gray-900 border border-gray-700 p-10 rounded-3xl shadow-2xl w-full max-w-md text-center">
        {/* Título */}
<h2 className="text-3xl font-extrabold text-indigo-400 mb-8">
          Crie sua conta
</h2>
<p className="text-gray-400 mb-8">
          Junte-se à <span className="text-indigo-400 font-semibold">AcademiaSmart</span> e tenha acesso
          a treinos personalizados, tecnologia de ponta e acompanhamento em tempo real!
</p>
 
        {/* Formulário */}
<form onSubmit={handleRegister} className="space-y-5">
<div className="text-left">
<label className="block text-sm font-semibold text-gray-300 mb-2">
              Email
</label>
<input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu email"
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
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Crie uma senha segura"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-indigo-500 text-white placeholder-gray-500 transition"
              required
            />
</div>
 
          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white text-lg py-3 rounded-xl font-semibold transition-all duration-300 shadow-md"
>
            Cadastrar
</button>
</form>
 
        {/* Mensagem */}
        {message && (
<p
            className={`mt-5 text-center ${
              message.toLowerCase().includes("sucesso")
                ? "text-green-400"
                : "text-red-400"
            }`}
>
            {message}
</p>
        )}
 
        {/* Link para login */}
<p className="mt-6 text-gray-400">
          Já tem uma conta?{" "}
<a
            href="/"
            className="text-indigo-400 hover:underline font-medium"
>
            Faça login
</a>
</p>
</div>
</div>
  );
};
 
export default Register;