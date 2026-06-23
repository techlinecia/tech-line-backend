const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
const multer = require('multer')
const db = require('./database/db')

const app = express()

const upload = multer({
  dest: path.resolve(__dirname, 'uploads')
})
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Backend da Assistência Técnica funcionando!')
})

// CLIENTES

app.get('/clientes', (req, res) => {
  db.all('SELECT * FROM clientes', [], (err, rows) => {
    if (err) return res.status(500).json(err)
    res.json(rows)
  })
})

app.post('/clientes', (req, res) => {
  const { nome, telefone, cpf, endereco } = req.body

  if (!nome) return res.status(400).json({ erro: 'Nome é obrigatório' })

  db.run(
    'INSERT INTO clientes (nome, telefone, cpf, endereco) VALUES (?, ?, ?, ?)',
    [nome, telefone, cpf, endereco],
    function (err) {
      if (err) return res.status(500).json(err)
      res.json({ id: this.lastID, nome, telefone, cpf, endereco })
    }
  )
})

app.put('/clientes/:id', (req, res) => {
  const { id } = req.params
  const { nome, telefone, cpf, endereco } = req.body

  db.run(
    'UPDATE clientes SET nome = ?, telefone = ?, cpf = ?, endereco = ? WHERE id = ?',
    [nome, telefone, cpf, endereco, id],
    function (err) {
      if (err) return res.status(500).json(err)
      res.json({ id, nome, telefone, cpf, endereco })
    }
  )
})

app.delete('/clientes/:id', (req, res) => {
  const { id } = req.params

  db.run('DELETE FROM clientes WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json(err)
    res.json({ mensagem: 'Cliente excluído com sucesso' })
  })
})

// ORDENS DE SERVIÇO

app.get('/ordens', (req, res) => {
  db.all('SELECT * FROM ordens_servico ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json(err)
    res.json(rows)
  })
})

app.post('/ordens', (req, res) => {
  const {
    numero,
    data_abertura,
    data_prevista,
    data_conclusao,
    cliente,
    equipamento,
    marca,
    modelo,
    defeito,
    servico,
    acessorios,
    valor,
    status
  } = req.body

  if (!cliente || !equipamento || !defeito) {
    return res.status(400).json({
      erro: 'Cliente, equipamento e defeito são obrigatórios'
    })
  }

  db.run(
    `INSERT INTO ordens_servico 
    (numero, data_abertura, data_prevista, data_conclusao, cliente, equipamento, marca, modelo, defeito, servico, acessorios, valor, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      numero,
      data_abertura,
      data_prevista,
      data_conclusao,
      cliente,
      equipamento,
      marca,
      modelo,
      defeito,
      servico,
      acessorios,
      valor,
      status
    ],
    function (err) {
      if (err) return res.status(500).json(err)

      res.json({
        id: this.lastID,
        numero,
        data_abertura,
        data_prevista,
        data_conclusao,
        cliente,
        equipamento,
        marca,
        modelo,
        defeito,
        servico,
        acessorios,
        valor,
        status
      })
    }
  )
})

app.put('/ordens/:id', (req, res) => {
  const { id } = req.params

  const {
    numero,
    data_abertura,
    data_prevista,
    data_conclusao,
    cliente,
    equipamento,
    marca,
    modelo,
    defeito,
    servico,
    acessorios,
    valor,
    status
  } = req.body

  db.run(
    `UPDATE ordens_servico SET
      numero = ?,
      data_abertura = ?,
      data_prevista = ?,
      data_conclusao = ?,
      cliente = ?,
      equipamento = ?,
      marca = ?,
      modelo = ?,
      defeito = ?,
      servico = ?,
      acessorios = ?,
      valor = ?,
      status = ?
    WHERE id = ?`,
    [
      numero,
      data_abertura,
      data_prevista,
      data_conclusao,
      cliente,
      equipamento,
      marca,
      modelo,
      defeito,
      servico,
      acessorios,
      valor,
      status,
      id
    ],
    function (err) {
      if (err) return res.status(500).json(err)

      res.json({
        id,
        numero,
        data_abertura,
        data_prevista,
        data_conclusao,
        cliente,
        equipamento,
        marca,
        modelo,
        defeito,
        servico,
        acessorios,
        valor,
        status
      })
    }
  )
})

app.delete('/ordens/:id', (req, res) => {
  const { id } = req.params

  db.run('DELETE FROM ordens_servico WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json(err)
    res.json({ mensagem: 'OS excluída com sucesso' })
  })
})

// ESTOQUE

app.get('/estoque', (req, res) => {
  db.all('SELECT * FROM estoque ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json(err)
    res.json(rows)
  })
})

app.post('/estoque', (req, res) => {
  const {
    codigo,
    produto,
    categoria,
    fornecedor,
    quantidade,
    custo,
    venda,
    estoque_minimo
  } = req.body

  if (!produto) return res.status(400).json({ erro: 'Produto é obrigatório' })

  db.run(
    `INSERT INTO estoque 
    (codigo, produto, categoria, fornecedor, quantidade, custo, venda, estoque_minimo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      codigo,
      produto,
      categoria,
      fornecedor,
      quantidade || 0,
      custo,
      venda,
      estoque_minimo || 0
    ],
    function (err) {
      if (err) return res.status(500).json(err)

      res.json({
        id: this.lastID,
        codigo,
        produto,
        categoria,
        fornecedor,
        quantidade,
        custo,
        venda,
        estoque_minimo
      })
    }
  )
})

app.put('/estoque/:id', (req, res) => {
  const { id } = req.params

  const {
    codigo,
    produto,
    categoria,
    fornecedor,
    quantidade,
    custo,
    venda,
    estoque_minimo
  } = req.body

  db.run(
    `UPDATE estoque SET
      codigo = ?,
      produto = ?,
      categoria = ?,
      fornecedor = ?,
      quantidade = ?,
      custo = ?,
      venda = ?,
      estoque_minimo = ?
    WHERE id = ?`,
    [
      codigo,
      produto,
      categoria,
      fornecedor,
      quantidade || 0,
      custo,
      venda,
      estoque_minimo || 0,
      id
    ],
    function (err) {
      if (err) return res.status(500).json(err)

      res.json({
        id,
        codigo,
        produto,
        categoria,
        fornecedor,
        quantidade,
        custo,
        venda,
        estoque_minimo
      })
    }
  )
})

app.delete('/estoque/:id', (req, res) => {
  const { id } = req.params

  db.run('DELETE FROM estoque WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json(err)
    res.json({ mensagem: 'Produto excluído com sucesso' })
  })
})

// FINANCEIRO

app.get('/financeiro', (req, res) => {
  db.all('SELECT * FROM financeiro ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json(err)
    res.json(rows)
  })
})

app.post('/financeiro', (req, res) => {
  const {
    tipo,
    descricao,
    categoria,
    valor,
    forma_pagamento,
    data_movimento
  } = req.body

  if (!tipo || !descricao || !valor || !data_movimento) {
    return res.status(400).json({
      erro: 'Tipo, descrição, valor e data são obrigatórios'
    })
  }

  db.run(
    `INSERT INTO financeiro
    (tipo, descricao, categoria, valor, forma_pagamento, data_movimento)
    VALUES (?, ?, ?, ?, ?, ?)`,
    [tipo, descricao, categoria, valor, forma_pagamento, data_movimento],
    function (err) {
      if (err) return res.status(500).json(err)

      res.json({
        id: this.lastID,
        tipo,
        descricao,
        categoria,
        valor,
        forma_pagamento,
        data_movimento
      })
    }
  )
})

app.put('/financeiro/:id', (req, res) => {
  const { id } = req.params

  const {
    tipo,
    descricao,
    categoria,
    valor,
    forma_pagamento,
    data_movimento
  } = req.body

  db.run(
    `UPDATE financeiro SET
      tipo = ?,
      descricao = ?,
      categoria = ?,
      valor = ?,
      forma_pagamento = ?,
      data_movimento = ?
    WHERE id = ?`,
    [
      tipo,
      descricao,
      categoria,
      valor,
      forma_pagamento,
      data_movimento,
      id
    ],
    function (err) {
      if (err) return res.status(500).json(err)

      res.json({
        id,
        tipo,
        descricao,
        categoria,
        valor,
        forma_pagamento,
        data_movimento
      })
    }
  )
})

app.delete('/financeiro/:id', (req, res) => {
  const { id } = req.params

  db.run('DELETE FROM financeiro WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json(err)
    res.json({ mensagem: 'Movimento financeiro excluído com sucesso' })
  })
})

// VENDAS

app.get('/vendas', (req, res) => {
  db.all('SELECT * FROM vendas ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json(err)
    res.json(rows)
  })
})

app.post('/vendas', (req, res) => {
  const {
    cliente,
    item,
    tipo,
    quantidade,
    valor_unitario,
    valor_total,
    forma_pagamento,
    origem,
    data_venda
  } = req.body

  if (!item || !valor_unitario || !valor_total) {
    return res.status(400).json({
      erro: 'Item, valor unitário e valor total são obrigatórios'
    })
  }

  const qtdVendida = Number(quantidade || 1)

  db.run(
    `INSERT INTO vendas
    (cliente, item, tipo, quantidade, valor_unitario, valor_total, forma_pagamento, origem, data_venda)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      cliente,
      item,
      tipo,
      qtdVendida,
      valor_unitario,
      valor_total,
      forma_pagamento,
      origem,
      data_venda
    ],
    function (err) {
      if (err) return res.status(500).json(err)

      const vendaId = this.lastID

      db.run(
        `INSERT INTO financeiro
        (tipo, descricao, categoria, valor, forma_pagamento, data_movimento)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
          'Entrada',
          `Venda - ${item}`,
          tipo || 'Venda',
          valor_total,
          forma_pagamento,
          data_venda
        ],
        function (erroFinanceiro) {
          if (erroFinanceiro) return res.status(500).json(erroFinanceiro)

          if (tipo === 'Produto') {
            db.run(
              `UPDATE estoque
               SET quantidade = quantidade - ?
               WHERE LOWER(TRIM(produto)) = LOWER(TRIM(?))`,
              [qtdVendida, item],
              function (erroEstoque) {
                if (erroEstoque) return res.status(500).json(erroEstoque)

                return res.json({
                  id: vendaId,
                  cliente,
                  item,
                  tipo,
                  quantidade: qtdVendida,
                  valor_unitario,
                  valor_total,
                  forma_pagamento,
                  origem,
                  data_venda,
                  financeiro: 'Entrada criada automaticamente',
                  estoque: 'Baixa realizada automaticamente'
                })
              }
            )
          } else {
            return res.json({
              id: vendaId,
              cliente,
              item,
              tipo,
              quantidade: qtdVendida,
              valor_unitario,
              valor_total,
              forma_pagamento,
              origem,
              data_venda,
              financeiro: 'Entrada criada automaticamente'
            })
          }
        }
      )
    }
  )
})

app.put('/vendas/:id', (req, res) => {
  const { id } = req.params

  const {
    cliente,
    item,
    tipo,
    quantidade,
    valor_unitario,
    valor_total,
    forma_pagamento,
    origem,
    data_venda
  } = req.body

  db.run(
    `UPDATE vendas SET
      cliente = ?,
      item = ?,
      tipo = ?,
      quantidade = ?,
      valor_unitario = ?,
      valor_total = ?,
      forma_pagamento = ?,
      origem = ?,
      data_venda = ?
    WHERE id = ?`,
    [
      cliente,
      item,
      tipo,
      quantidade || 1,
      valor_unitario,
      valor_total,
      forma_pagamento,
      origem,
      data_venda,
      id
    ],
    function (err) {
      if (err) return res.status(500).json(err)

      res.json({
        id,
        cliente,
        item,
        tipo,
        quantidade,
        valor_unitario,
        valor_total,
        forma_pagamento,
        origem,
        data_venda
      })
    }
  )
})

app.delete('/vendas/:id', (req, res) => {
  const { id } = req.params

  db.run('DELETE FROM vendas WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json(err)
    res.json({ mensagem: 'Venda excluída com sucesso' })
  })
})

// CONFIGURAÇÕES

app.get('/configuracoes', (req, res) => {
  db.get(
    'SELECT * FROM configuracoes ORDER BY id DESC LIMIT 1',
    [],
    (err, row) => {
      if (err) return res.status(500).json(err)
      res.json(row || {})
    }
  )
})

app.post('/configuracoes', (req, res) => {
  const {
    nome_empresa,
    cpf,
    telefone,
    whatsapp,
    email,
    endereco,
    mensagem_os,
    mensagem_recibo,
    impressora
  } = req.body

  db.run(
    `INSERT INTO configuracoes
    (nome_empresa, cpf, telefone, whatsapp, email, endereco, mensagem_os, mensagem_recibo, impressora)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      nome_empresa,
      cpf,
      telefone,
      whatsapp,
      email,
      endereco,
      mensagem_os,
      mensagem_recibo,
      impressora
    ],
    function (err) {
      if (err) return res.status(500).json(err)

      res.json({
        id: this.lastID,
        mensagem: 'Configurações salvas com sucesso'
      })
    }
  )
})

app.put('/configuracoes/:id', (req, res) => {
  const { id } = req.params

  const {
    nome_empresa,
    cpf,
    telefone,
    whatsapp,
    email,
    endereco,
    mensagem_os,
    mensagem_recibo,
    impressora
  } = req.body

  db.run(
    `UPDATE configuracoes SET
      nome_empresa = ?,
      cpf = ?,
      telefone = ?,
      whatsapp = ?,
      email = ?,
      endereco = ?,
      mensagem_os = ?,
      mensagem_recibo = ?,
      impressora = ?
    WHERE id = ?`,
    [
      nome_empresa,
      cpf,
      telefone,
      whatsapp,
      email,
      endereco,
      mensagem_os,
      mensagem_recibo,
      impressora,
      id
    ],
    function (err) {
      if (err) return res.status(500).json(err)

      res.json({
        mensagem: 'Configurações atualizadas com sucesso'
      })
    }
  )
})

// CONTAS FIXAS

app.get('/contas-fixas', (req, res) => {
  db.all(
    'SELECT * FROM contas_fixas ORDER BY descricao ASC',
    [],
    (err, rows) => {
      if (err) return res.status(500).json(err)
      res.json(rows)
    }
  )
})

app.post('/contas-fixas', (req, res) => {
  const {
    descricao,
    categoria,
    valor,
    vencimento,
    ativo
  } = req.body

  if (!descricao || !valor) {
    return res.status(400).json({
      erro: 'Descrição e valor são obrigatórios'
    })
  }

  db.run(
    `INSERT INTO contas_fixas
    (descricao, categoria, valor, vencimento, ativo)
    VALUES (?, ?, ?, ?, ?)`,
    [
      descricao,
      categoria,
      valor,
      vencimento,
      ativo ?? 1
    ],
    function (err) {
      if (err) return res.status(500).json(err)

      res.json({
        id: this.lastID,
        descricao,
        categoria,
        valor,
        vencimento,
        ativo
      })
    }
  )
})

app.put('/contas-fixas/:id', (req, res) => {
  const { id } = req.params

  const {
    descricao,
    categoria,
    valor,
    vencimento,
    ativo
  } = req.body

  db.run(
    `UPDATE contas_fixas SET
      descricao = ?,
      categoria = ?,
      valor = ?,
      vencimento = ?,
      ativo = ?
    WHERE id = ?`,
    [
      descricao,
      categoria,
      valor,
      vencimento,
      ativo,
      id
    ],
    function (err) {
      if (err) return res.status(500).json(err)

      res.json({
        mensagem: 'Conta fixa atualizada com sucesso'
      })
    }
  )
})

app.delete('/contas-fixas/:id', (req, res) => {
  const { id } = req.params

  db.run(
    'DELETE FROM contas_fixas WHERE id = ?',
    [id],
    function (err) {
      if (err) return res.status(500).json(err)

      res.json({
        mensagem: 'Conta fixa excluída com sucesso'
      })
    }
  )
})

// USUÁRIOS

app.get('/usuarios', (req, res) => {
  db.all(
    'SELECT id, nome, email, perfil FROM usuarios ORDER BY nome',
    [],
    (err, rows) => {
      if (err) return res.status(500).json(err)
      res.json(rows)
    }
  )
})

app.post('/usuarios', (req, res) => {
  const { nome, email, senha, perfil } = req.body

  if (!nome || !email || !senha) {
    return res.status(400).json({
      erro: 'Nome, email e senha são obrigatórios'
    })
  }

  db.run(
    `INSERT INTO usuarios
    (nome, email, senha, perfil)
    VALUES (?, ?, ?, ?)`,
    [
      nome,
      email,
      senha,
      perfil || 'Administrador'
    ],
    function (err) {
      if (err) return res.status(500).json(err)

      res.json({
        id: this.lastID,
        nome,
        email,
        perfil: perfil || 'Administrador'
      })
    }
  )
})

app.post('/login', (req, res) => {
  const { email, senha } = req.body

  db.get(
    'SELECT * FROM usuarios WHERE email = ? AND senha = ?',
    [email, senha],
    (err, usuario) => {
      if (err) return res.status(500).json(err)

      if (!usuario) {
        return res.status(401).json({
          erro: 'Usuário ou senha inválidos'
        })
      }

      res.json({
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil
      })
    }
  )
})

app.delete('/usuarios/:id', (req, res) => {
  const { id } = req.params

  db.run(
    'DELETE FROM usuarios WHERE id = ?',
    [id],
    function (err) {
      if (err) return res.status(500).json(err)

      res.json({
        mensagem: 'Usuário removido com sucesso'
      })
    }
  )
})

// ======================================
// BACKUP DO BANCO SQLITE
// ======================================

app.get('/backup', (req, res) => {
  const possiveisCaminhos = [
    path.resolve(__dirname, 'assistencia.db'),
    path.resolve(__dirname, 'database', 'assistencia.db'),
    path.resolve(__dirname, 'src', 'database', 'assistencia.db')
  ]

  const banco = possiveisCaminhos.find(caminho =>
    fs.existsSync(caminho)
  )

  if (!banco) {
    return res.status(404).json({
      erro: 'Arquivo assistencia.db não encontrado'
    })
  }

  const nomeArquivo = `backup-assistencia-${Date.now()}.db`

  res.download(banco, nomeArquivo)
})
// ======================================
// RESTAURAR BACKUP DO BANCO SQLITE
// ======================================

app.post('/restaurar-backup', upload.single('backup'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      erro: 'Nenhum arquivo enviado'
    })
  }

  const bancoAtual = [
    path.resolve(__dirname, 'assistencia.db'),
    path.resolve(__dirname, 'database', 'assistencia.db'),
    path.resolve(__dirname, 'src', 'database', 'assistencia.db')
  ].find(caminho => fs.existsSync(caminho))

  if (!bancoAtual) {
    fs.unlinkSync(req.file.path)

    return res.status(404).json({
      erro: 'Banco atual não encontrado'
    })
  }

  const backupAntesDeRestaurar =
    `${bancoAtual}.antes-da-restauracao-${Date.now()}`

  fs.copyFileSync(bancoAtual, backupAntesDeRestaurar)
  fs.copyFileSync(req.file.path, bancoAtual)
  fs.unlinkSync(req.file.path)

  res.json({
    mensagem: 'Backup restaurado com sucesso. Reinicie o backend para carregar o banco restaurado.',
    backup_segurança: backupAntesDeRestaurar
  })
})
app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000')
})