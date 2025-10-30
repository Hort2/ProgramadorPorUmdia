const express = require("express");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());

// =============================================
// CONFIGURAÇÕES
// =============================================
const SECRET_KEY = "12345678910";

// =============================================
// USUÁRIOS - LOGIN & REGISTRO
// =============================================

const localUsuarios = path.join(__dirname, "data/usuarios.json");

const consultarUsuarios = () => {
  const data = fs.readFileSync(localUsuarios, "utf8");
  return JSON.parse(data);
};

const salvarUsuarios = (users) => {
  fs.writeFileSync(localUsuarios, JSON.stringify(users, null, 2));
};

// Registrar usuário
app.post("/register", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ message: "Preencha todos os campos." });
  }

  const users = consultarUsuarios();
  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ message: "Email já cadastrado." });
  }

  const hash = await bcrypt.hash(senha, 10);
  const novo = { id: Date.now(), email, senha: hash };
  users.push(novo);
  salvarUsuarios(users);

  res.status(201).json({ message: "Usuário registrado com sucesso." });
});

// Login
app.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  const users = consultarUsuarios();
  const user = users.find((u) => u.email === email);

  if (!user) return res.status(400).json({ message: "Usuário não encontrado." });

  const senhaValida = await bcrypt.compare(senha, user.senha);
  if (!senhaValida) return res.status(400).json({ message: "Senha incorreta." });

  const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
    expiresIn: "2h",
  });

  res.json({ message: "Login realizado", token });
});

// =============================================
// CRUD DE PRODUTOS
// =============================================

const localProducts = path.join(__dirname, "data/Produtos.json");

const consultarProdutos = () => {
  const data = fs.readFileSync(localProducts, "utf8");
  return JSON.parse(data);
};

const salvarProdutos = (produtos) => {
  fs.writeFileSync(localProducts, JSON.stringify(produtos, null, 2));
};

// Listar produtos
app.get("/products", (req, res) => {
  const produtos = consultarProdutos();
  res.json(produtos);
});

// Criar produto
app.post("/products", (req, res) => {
  const { nome, preco, categoria } = req.body;

  if (!nome || !preco || !categoria) {
    return res.status(400).json({ message: "Campos obrigatórios não preenchidos." });
  }

  const produtos = consultarProdutos();
  const novo = { id: Date.now(), nome, preco, categoria };
  produtos.push(novo);
  salvarProdutos(produtos);

  res.status(201).json(novo);
});

// Atualizar produto
app.put("/products/:id", (req, res) => {
  const produtos = consultarProdutos();
  const index = produtos.findIndex((p) => p.id == req.params.id);

  if (index === -1) return res.status(404).json({ message: "Produto não encontrado." });

  produtos[index] = { ...produtos[index], ...req.body };
  salvarProdutos(produtos);

  res.json(produtos[index]);
});

// Excluir produto
app.delete("/products/:id", (req, res) => {
  const produtos = consultarProdutos();
  const novos = produtos.filter((p) => p.id != req.params.id);
  salvarProdutos(novos);

  res.json({ message: "Produto removido com sucesso!" });
});

// =============================================
// INICIAR SERVIDOR
// =============================================
app.listen(port, () => {
  console.log(`✅ Servidor rodando: http://localhost:${port}`);
});
