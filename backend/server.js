const express = require("express");
const fs = require("fs"); // file system
const path = require("path"); // caminho do arquivo do banco de dados
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());

// =============================================
// CONFIGURAÇÕES DE SEGURANÇA
// =============================================
const SECRET_KEY = "12345678910"; // chave JWT

// =============================================
// USUÁRIOS - LOGIN E REGISTRO
// =============================================

// Local do banco de usuários
const localDados = path.join(__dirname, "data/usuarios.json");

// Função para ler usuários
const consultarUsuarios = () => {
  const data = fs.readFileSync(localDados, "utf-8");
  return JSON.parse(data);
};

// Função para salvar usuários
const salvarUsuarios = (users) => {
  fs.writeFileSync(localDados, JSON.stringify(users, null, 2));
};

// === REGISTRO ===
app.post("/register", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ message: "Campos obrigatórios" });
  }

  const users = consultarUsuarios();
  if (users.find((user) => user.email === email)) {
    return res
      .status(400)
      .json({ message: "Email já cadastrado no banco de dados" });
  }

  const hashSenha = await bcrypt.hash(senha, 10);
  const novoUsuario = { id: Date.now(), email, senha: hashSenha };
  users.push(novoUsuario);
  salvarUsuarios(users);

  res.status(200).json({ message: "Usuário registrado com sucesso" });
});

// === LOGIN ===
app.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  const users = consultarUsuarios();
  const user = users.find((user) => user.email === email);

  if (!user) {
    return res.status(400).json({ message: "Usuário/senha inválidos" });
  }

  const senhaValida = await bcrypt.compare(senha, user.senha);
  if (!senhaValida) {
    return res.status(400).json({ message: "Senha inválida" });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    SECRET_KEY,
    { expiresIn: "10m" }
  );

  res.json({ message: "Login realizado com sucesso", token });
});

// =============================================
// MIDDLEWARE DE AUTENTICAÇÃO
// =============================================
const autenticaToken = (req, res, next) => {
  const auth = req.headers["authorization"];
  const token = auth && auth.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (erro, user) => {
    if (erro) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// =============================================
// ROTA DE TESTE
// =============================================
app.get("/dashboard", autenticaToken, (req, res) => {
  res.json({ message: "Acesso autorizado, Bem-vindo", user: req.user });
});

// =============================================
// BANCO DE PLANOS E TREINOS (JSON LOCAL)
// =============================================

// Caminhos dos bancos de dados
const localPlanos = path.join(__dirname, "data/planos.json");
const localTreinos = path.join(__dirname, "data/treinos.json");

// Funções de leitura e escrita
const consultarPlanos = () => {
  if (!fs.existsSync(localPlanos)) return [];
  const data = fs.readFileSync(localPlanos, "utf-8");
  return JSON.parse(data || "[]");
};
const salvarPlanos = (planos) => {
  fs.writeFileSync(localPlanos, JSON.stringify(planos, null, 2));
};

const consultarTreinos = () => {
  if (!fs.existsSync(localTreinos)) return [];
  const data = fs.readFileSync(localTreinos, "utf-8");
  return JSON.parse(data || "[]");
};
const salvarTreinos = (treinos) => {
  fs.writeFileSync(localTreinos, JSON.stringify(treinos, null, 2));
};

// =============================================
// ROTAS CRUD DE PLANOS
// =============================================

// Listar planos (público)
app.get("/planos", (req, res) => {
  const planos = consultarPlanos();
  res.json(planos);
});

// Criar novo plano (proteção JWT)
app.post("/planos", autenticaToken, (req, res) => {
  const { nome, preco, descricao } = req.body;

  if (!nome || !preco) {
    return res.status(400).json({ message: "Nome e preço são obrigatórios" });
  }

  const planos = consultarPlanos();
  const novoPlano = {
    id: Date.now(),
    nome,
    preco,
    descricao: descricao || "",
  };

  planos.push(novoPlano);
  salvarPlanos(planos);

  res.status(201).json({ message: "Plano criado com sucesso", plano: novoPlano });
});

// Atualizar plano
app.put("/planos/:id", autenticaToken, (req, res) => {
  const planos = consultarPlanos();
  const index = planos.findIndex((p) => p.id == req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: "Plano não encontrado" });
  }

  planos[index] = { ...planos[index], ...req.body };
  salvarPlanos(planos);
  res.json({ message: "Plano atualizado com sucesso", plano: planos[index] });
});

// Excluir plano
app.delete("/planos/:id", autenticaToken, (req, res) => {
  const planos = consultarPlanos();
  const novos = planos.filter((p) => p.id != req.params.id);

  if (novos.length === planos.length) {
    return res.status(404).json({ message: "Plano não encontrado" });
  }

  salvarPlanos(novos);
  res.json({ message: "Plano excluído com sucesso" });
});

// =============================================
// ROTAS CRUD DE TREINOS
// =============================================

// Listar treinos (público)
app.get("/treinos", (req, res) => {
  const treinos = consultarTreinos();
  res.json(treinos);
});

// Criar treino (proteção JWT)
app.post("/treinos", autenticaToken, (req, res) => {
  const { nome, descricao, exercicios } = req.body;
  if (!nome) {
    return res.status(400).json({ message: "Nome do treino é obrigatório" });
  }

  const treinos = consultarTreinos();
  const novoTreino = {
    id: Date.now(),
    nome,
    descricao: descricao || "",
    exercicios: exercicios || [],
  };

  treinos.push(novoTreino);
  salvarTreinos(treinos);
  res.status(201).json({ message: "Treino criado com sucesso", treino: novoTreino });
});

// Atualizar treino
app.put("/treinos/:id", autenticaToken, (req, res) => {
  const treinos = consultarTreinos();
  const index = treinos.findIndex((t) => t.id == req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: "Treino não encontrado" });
  }

  let body = { ...req.body };
  if (typeof body.exercicios === "string") {
    body.exercicios = body.exercicios.split(",").map((s) => s.trim());
  }

  treinos[index] = { ...treinos[index], ...body };
  salvarTreinos(treinos);
  res.json({ message: "Treino atualizado com sucesso", treino: treinos[index] });
});

// Excluir treino
app.delete("/treinos/:id", autenticaToken, (req, res) => {
  const treinos = consultarTreinos();
  const novos = treinos.filter((t) => t.id != req.params.id);

  if (novos.length === treinos.length) {
    return res.status(404).json({ message: "Treino não encontrado" });
  }

  salvarTreinos(novos);
  res.json({ message: "Treino excluído com sucesso" });
});

// =============================================
// INICIALIZAÇÃO DO SERVIDOR
// =============================================
app.listen(port, () => {
  console.log(`✅ Servidor rodando http://localhost:${port}`);
});
