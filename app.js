const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = 3000;

// Configurar body-parser para ler dados do formulário
app.use(bodyParser.urlencoded({ extended: true }));

// Servir arquivos estáticos (css, html, etc)
app.use("/static", express.static(path.join(__dirname, "static")));

// Conexão com o banco MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",      // seu usuário do mysql
  password: "root", // sua senha
  database: "dbalmoxarifado_ctxrb" // seu banco
});

db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco:", err);
    return;
  }
  console.log("Conectado ao banco MySQL!");
});

// Rota para exibir o login
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

// Rota para processar o login
app.post("/", (req, res) => {
  const { usuario, senha } = req.body;

  const query = "SELECT * FROM usuarios WHERE usuario = ? AND senha = ?";
  db.query(query, [usuario, senha], (err, results) => {
    if (err) {
      console.error("Erro na consulta:", err);
      return res.send("Erro no servidor!");
    }

    if (results.length > 0) {
      res.send("Login realizado com sucesso! ✅");
    } else {
      res.send("Usuário ou senha inválidos ❌");
    }
  });
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});