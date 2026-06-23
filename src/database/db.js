const sqlite3 = require('sqlite3').verbose()
const path = require('path')

const dbPath = path.resolve(__dirname, 'assistencia.db')

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco:', err.message)
  } else {
    console.log('Banco SQLite conectado!')
  }
})

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS clientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      telefone TEXT,
      cpf TEXT,
      endereco TEXT
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS ordens_servico (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      numero TEXT,
      cliente TEXT,
      equipamento TEXT,
      marca TEXT,
      modelo TEXT,
      defeito TEXT,
      servico TEXT,
      acessorios TEXT,
      valor TEXT,
      status TEXT,
      data_abertura DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  db.run(`ALTER TABLE ordens_servico ADD COLUMN data_prevista TEXT`, () => {})
  db.run(`ALTER TABLE ordens_servico ADD COLUMN data_conclusao TEXT`, () => {})

  db.run(`
    CREATE TABLE IF NOT EXISTS estoque (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      codigo TEXT,
      produto TEXT NOT NULL,
      categoria TEXT,
      fornecedor TEXT,
      quantidade INTEGER DEFAULT 0,
      custo TEXT,
      venda TEXT,
      estoque_minimo INTEGER DEFAULT 0,
      data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS financeiro (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tipo TEXT NOT NULL,
      descricao TEXT NOT NULL,
      categoria TEXT,
      valor TEXT NOT NULL,
      forma_pagamento TEXT,
      data_movimento DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS vendas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente TEXT,
      item TEXT NOT NULL,
      tipo TEXT,
      quantidade INTEGER DEFAULT 1,
      valor_unitario TEXT NOT NULL,
      valor_total TEXT NOT NULL,
      forma_pagamento TEXT,
      origem TEXT,
      data_venda TEXT,
      data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  db.run(`ALTER TABLE vendas ADD COLUMN origem TEXT`, () => {})

  db.run(`
    CREATE TABLE IF NOT EXISTS configuracoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome_empresa TEXT,
      cpf TEXT,
      telefone TEXT,
      whatsapp TEXT,
      email TEXT,
      endereco TEXT,
      mensagem_os TEXT,
      mensagem_recibo TEXT,
      impressora TEXT
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS contas_fixas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao TEXT NOT NULL,
      categoria TEXT,
      valor TEXT NOT NULL,
      vencimento INTEGER,
      ativo INTEGER DEFAULT 1
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      senha TEXT NOT NULL,
      perfil TEXT DEFAULT 'Administrador'
    )
  `)
})

module.exports = db