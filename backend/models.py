from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Produto(db.Model):
    __tablename__ = 'produtos'
    codigo = db.Column(db.Integer, nullable=False, unique=True, primary_key=True, autoincrement=True)
    descricao = db.Column(db.String(50), nullable=False)
    preco = db.Column(db.Float, nullable=False)

    def __repr__(self):
        return f'<Produto {self.codigo}>'

    def to_dict(self):
        return {
            'codigo': self.codigo,
            'descricao': self.descricao,
            'preco': self.preco
        }

class Cliente(db.Model):
    __tablename__ = 'clientes'
    codigo = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nome = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return f'<Cliente {self.codigo}>'

    def to_dict(self):
        return {
            'codigo': self.codigo,
            'nome': self.nome,
        }

class Vendedor(db.Model):
    __tablename__ = 'vendedores'
    codigo = db.Column(db.Integer, primary_key=True, nullable=False)
    nome = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return f'<Vendedor {self.codigo}>'

    def to_dict(self):
        return {
            'codigo': self.codigo,
            'nome': self.nome,
        }

class Oferta(db.Model):
    __tablename__ = 'ofertas'
    codigo = db.Column(db.Integer, primary_key=True, autoincrement=True)
    produto = db.Column(db.Integer, db.ForeignKey('produtos.codigo'), nullable=False)
    produto_relacao = db.relationship('Produto', backref='ofertas', lazy=True)
    leve = db.Column(db.Integer,nullable=False)
    pague = db.Column(db.Integer,nullable=False)

    def __repr__(self):
        return f'<Oferta {self.codigo} - Produto {self.produto_codigo}>'

    def to_dict(self):
        oferta_dict = {
            'codigo': self.codigo,
            'produto': self.produto,
            'leve': self.leve,
            'pague': self.pague,
        }
        return oferta_dict

class Orcamento(db.Model):
    __tablename__ = 'orcamentos'
    codigo = db.Column(db.Integer, primary_key=True, autoincrement=True)
    vendedor = db.Column(db.Integer, db.ForeignKey('vendedores.codigo'), nullable=False)
    vendedor_relacao = db.relationship('Vendedor', backref='orcamentos', lazy=True)
    cliente = db.Column(db.Integer, db.ForeignKey('clientes.codigo'), nullable=False)
    cliente_relacao = db.relationship('Cliente', backref='orcamentos', lazy=True)
    data = db.Column(db.DateTime, nullable=False, default=datetime.now)
    preco_total = db.Column(db.Float, nullable=False, default=0.0)

    def __repr__(self):
        return f'<Orcamento {self.codigo} - Produto {self.produto_codigo}>'

    def to_dict(self):
        orcamento_dict = {
            'codigo': self.codigo,
            'vendedor': self.vendedor,
            'cliente': self.cliente,
            'data': self.data,
            'preco_total': self.preco_total,
        }
        return orcamento_dict

class ItemOrcamento(db.Model):
    __tablename__ = 'itemOrcamentos'
    codigo = db.Column(db.Integer, primary_key=True, autoincrement=True)
    orcamento = db.Column(db.Integer, db.ForeignKey('orcamentos.codigo'), nullable=False)
    orcamento_relacao = db.relationship('Orcamento', backref='itemOrcamentos', lazy=True)
    ordem = db.Column(db.Integer, nullable=False)
    produto = db.Column(db.Integer, db.ForeignKey('produtos.codigo'), nullable=False)
    produto_relacao = db.relationship('Produto', backref='itemOrcamentos', lazy=True)
    preco = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f'<ItemOrcamento {self.codigo} - Produto {self.produto}>'

    def to_dict(self):
        itemOrcamento_dict = {
            'codigo': self.codigo,
            'orcamento': self.orcamento,
            'ordem': self.ordem,
            'produto': self.produto,
            'preco': self.preco,
        }
        return itemOrcamento_dict