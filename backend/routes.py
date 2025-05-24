from flask import Blueprint, request, jsonify
from models import db, Produto, Cliente, Vendedor, Oferta, Orcamento, ItemOrcamento
from datetime import datetime

produtos_bp = Blueprint('produtos', __name__)
clientes_bp = Blueprint('clientes', __name__)
vendedores_bp = Blueprint('vendedores', __name__)
ofertas_bp = Blueprint('ofertas', __name__)
orcamentos_bp = Blueprint('orcamentos', __name__)
itemOrcamentos_bp = Blueprint('itemOrcamentos', __name__)

####################### Rotas para Produto #####################################################################
@produtos_bp.route('/produtos', methods=['GET'])
def listar_produtos():
    produtos = Produto.query.all()
    return jsonify([p.to_dict() for p in produtos])

@produtos_bp.route('/produtos/<int:produto_id>', methods=['GET'])
def get_produto_por_id(produto_id):
    produto = Produto.query.get(produto_id)
    if produto:
        return jsonify(produto.to_dict())
    else:
        return jsonify({'mensagem': 'Produto não encontrado'}), 404

@produtos_bp.route('/produtos', methods=['POST'])
def criar_produto():
    data = request.get_json()

    if not data or 'descricao' not in data or 'preco' not in data:
        return jsonify({'erro': 'Descrição e preço são obrigatórios'}), 400
    
    preco_float = float(data['preco'])
    novo_produto = Produto(
                           descricao=data.get('descricao'),
                           preco=preco_float)
    
    try:
        db.session.add(novo_produto)
        db.session.commit()
        return jsonify(novo_produto.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        print(f"Erro ao criar produto: {e}")
        return jsonify({'erro': f'Erro interno ao criar produto: {str(e)}'}), 500

@produtos_bp.route('/produtos/<int:produto_id>', methods=['PUT'])
def update_produto(produto_id):
    produto = Produto.query.get(produto_id)
    if produto:
        data = request.get_json()
        produto.descricao = data.get('descricao', produto.descricao)
        produto.preco = data.get('preco', produto.preco)
        db.session.commit()
        return jsonify(produto.to_dict())
    else:
        return jsonify({'mensagem': 'Produto não encontrado'}), 404

@produtos_bp.route('/produtos/<int:produto_id>', methods=['DELETE'])
def delete_produto(produto_id):
    produto = Produto.query.get(produto_id)
    if produto:
        db.session.delete(produto)
        db.session.commit()
        return jsonify({'mensagem': 'Produto excluído com sucesso!'}), 204
    else:
        return jsonify({'mensagem': 'Produto não encontrado'}), 404
    
####################### Rotas para Cliente #####################################################################
@clientes_bp.route('/clientes', methods=['GET'])
def listar_clientes():
    clientes = Cliente.query.all()
    return jsonify([c.to_dict() for c in clientes])

@clientes_bp.route('/clientes/<int:cliente_id>', methods=['GET'])
def get_cliente_por_id(cliente_id):
    cliente = Cliente.query.get(cliente_id)
    if cliente:
        return jsonify(cliente.to_dict())
    else:
        return jsonify({'mensagem': 'Cliente não encontrado'}), 404

@clientes_bp.route('/clientes', methods=['POST'])
def criar_cliente():
    data = request.get_json()
    
    if not data or 'nome' not in data:
        return jsonify({'erro': 'Nome é obrigatório'}), 400
    novo_cliente = Cliente(
                           nome=data.get('nome'))
    
    try:
        db.session.add(novo_cliente)
        db.session.commit()
        return jsonify(novo_cliente.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        print(f"Erro ao criar cliente: {e}")
        return jsonify({'erro': f'Erro interno ao criar cliente: {str(e)}'}), 500

@clientes_bp.route('/clientes/<int:cliente_id>', methods=['PUT'])
def update_cliente(cliente_id):
    cliente = Cliente.query.get(cliente_id)
    if cliente:
        data = request.get_json()
        cliente.nome = data.get('nome', cliente.nome)
        db.session.commit()
        return jsonify(cliente.to_dict())
    else:
        return jsonify({'mensagem': 'Cliente não encontrado'}), 404

@clientes_bp.route('/clientes/<int:cliente_id>', methods=['DELETE'])
def delete_cliente(cliente_id):
    cliente = Cliente.query.get(cliente_id)
    if cliente:
        db.session.delete(cliente)
        db.session.commit()
        return jsonify({'mensagem': 'Cliente excluído com sucesso!'}), 204
    else:
        return jsonify({'mensagem': 'Cliente não encontrado'}), 404
    
####################### Rotas para Vendedor #####################################################################
@vendedores_bp.route('/vendedores', methods=['GET'])
def listar_vendedores():
    vendedores = Vendedor.query.all()
    return jsonify([v.to_dict() for v in vendedores])

@vendedores_bp.route('/vendedores/<int:vendedor_id>', methods=['GET'])
def get_vendedor_por_id(vendedor_id):
    vendedor = Vendedor.query.get(vendedor_id)
    if vendedor:
        return jsonify(vendedor.to_dict())
    else:
        return jsonify({'mensagem': 'Vendedor não encontrado'}), 404

@vendedores_bp.route('/vendedores', methods=['POST'])
def criar_vendedor():
    data = request.get_json()
    
    if not data or 'nome' not in data:
        return jsonify({'erro': 'Nome é obrigatório'}), 400
    
    nome_vendedor = data.get('nome')
    try:
        novo_cliente = Cliente(nome=nome_vendedor)
        db.session.add(novo_cliente)
        db.session.commit()

        codigo_cliente = novo_cliente.codigo
        novo_vendedor = Vendedor(codigo=codigo_cliente, 
                                 nome=nome_vendedor)
        
        db.session.add(novo_vendedor)
        db.session.commit()
        return jsonify(novo_vendedor.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        print(f"Erro ao criar vendedor: {e}")
        return jsonify({'erro': f'Erro interno ao criar vendedor: {str(e)}'}), 500

@vendedores_bp.route('/vendedores/<int:vendedor_id>', methods=['PUT'])
def update_vendedor(vendedor_id):
    vendedor = Vendedor.query.get(vendedor_id)
    if vendedor:
        data = request.get_json()
        vendedor.nome = data.get('nome', vendedor.nome)
        db.session.commit()
        return jsonify(vendedor.to_dict())
    else:
        return jsonify({'mensagem': 'Vendedor não encontrado'}), 404

@vendedores_bp.route('/vendedores/<int:vendedor_id>', methods=['DELETE'])
def delete_vendedor(vendedor_id):
    vendedor = Vendedor.query.get(vendedor_id)
    if vendedor:
        db.session.delete(vendedor)
        db.session.commit()
        return jsonify({'mensagem': 'Vendedor excluído com sucesso!'}), 204
    else:
        return jsonify({'mensagem': 'Vendedor não encontrado'}), 404

####################### Rotas para Oferta #####################################################################
@ofertas_bp.route('/ofertas', methods=['GET'])
def listar_ofertas():
    ofertas = Oferta.query.all()
    return jsonify([o.to_dict() for o in ofertas])

@ofertas_bp.route('/ofertas/<int:oferta_id>', methods=['GET'])
def get_oferta_por_id(oferta_id):
    oferta = Oferta.query.get(oferta_id)
    if oferta:
        return jsonify(oferta.to_dict())
    else:
        return jsonify({'mensagem': 'Oferta não encontrada'}), 404

@ofertas_bp.route('/ofertas', methods=['POST'])
def criar_oferta():
    data = request.get_json()

    if not data or 'produto' not in data or 'leve' not in data or 'pague' not in data:
        return jsonify({'erro': 'Produto, Leve e Pague são obrigatórios'}), 400
    
    codigo_produto = data.get('produto')
    qtd_leve = data.get('leve')
    qtd_pague = data.get('pague')

    produto_existente = Produto.query.get(codigo_produto)
    if not produto_existente:
        return jsonify({'erro': f'Produto com código {codigo_produto} não encontrado.'}), 404
    
    if qtd_leve <= qtd_pague:
        return jsonify({'erro': 'Quantidade de Leve deve ser maior que a quantidade de Pague.'}), 400
    
    novo_oferta = Oferta(produto=codigo_produto,
                           leve=qtd_leve,
                           pague=qtd_pague)
    
    try:
        db.session.add(novo_oferta)
        db.session.commit()
        return jsonify(novo_oferta.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        print(f"Erro ao criar oferta: {e}")
        return jsonify({'erro': f'Erro interno ao criar oferta: {str(e)}'}), 500

@ofertas_bp.route('/ofertas/<int:oferta_id>', methods=['PUT'])
def update_oferta(oferta_id):
    oferta = Oferta.query.get(oferta_id)
    if oferta:
        data = request.get_json()

        if 'produto' in data:
            codigo_produto = data['produto']
            produto_existente = Produto.query.get(codigo_produto)
            if not produto_existente:
                return jsonify({'erro': f'Produto com código {codigo_produto} não encontrado.'}), 404

        oferta.produto = data.get('produto', oferta.produto)
        oferta.leve = data.get('leve', oferta.leve)
        oferta.pague = data.get('pague', oferta.pague)
        db.session.commit()
        return jsonify(oferta.to_dict())
    else:
        return jsonify({'mensagem': 'Oferta não encontrada'}), 404

@ofertas_bp.route('/ofertas/<int:oferta_id>', methods=['DELETE'])
def delete_oferta(oferta_id):
    oferta = Oferta.query.get(oferta_id)
    if oferta:
        db.session.delete(oferta)
        db.session.commit()
        return jsonify({'mensagem': 'Oferta excluída com sucesso!'}), 204
    else:
        return jsonify({'mensagem': 'Oferta não encontrada'}), 404
    
####################### Rotas para Orcamento #####################################################################
@orcamentos_bp.route('/orcamentos', methods=['GET'])
def listar_Orcamentos():
    orcamentos = Orcamento.query.all()
    return jsonify([o.to_dict() for o in orcamentos])

@orcamentos_bp.route('/orcamentos/<int:orcamento_id>', methods=['GET'])
def get_Orcamento_por_id(orcamento_id):
    orcamento = Orcamento.query.get(orcamento_id)
    if orcamento:
        return jsonify(orcamento.to_dict())
    else:
        return jsonify({'mensagem': 'Orçamento não encontrado'}), 404

@orcamentos_bp.route('/orcamentos', methods=['POST'])
def criar_Orcamento():
    data = request.get_json()

    if not data or 'vendedor' not in data or 'cliente' not in data:
        return jsonify({'erro': 'Vendedor e Cliente são obrigatórios'}), 400
    
    vendedor = data.get('vendedor')
    cliente = data.get('cliente')
    preco_total = float(data.get('preco_total',0.0))
    hoje = datetime.now()

    vendedor_existente = Vendedor.query.get(vendedor)
    if not vendedor_existente:
        return jsonify({'erro': f'Vendedor com código {vendedor} não encontrado.'}), 404
    cliente_existente = Cliente.query.get(cliente)
    if not cliente_existente:
        return jsonify({'erro': f'Cliente com código {cliente} não encontrado.'}), 404
    
    if vendedor == cliente:
        return jsonify({'erro': 'Vendedor e Cliente não podem ser a mesma pessoa'}), 400
    
    novo_Orcamento = Orcamento(vendedor=vendedor,
                           cliente=cliente,
                           preco_total=preco_total,
                           data=hoje)
    
    try:
        db.session.add(novo_Orcamento)
        db.session.commit()
        return jsonify(novo_Orcamento.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        print(f"Erro ao criar Orçamento: {e}")
        return jsonify({'erro': f'Erro interno ao criar Orçamento: {str(e)}'}), 500

@orcamentos_bp.route('/orcamentos/<int:orcamento_id>', methods=['PUT'])
def update_Orcamento(orcamento_id):
    orcamento = Orcamento.query.get(orcamento_id)
    if orcamento:
        data = request.get_json()

        if 'vendedor' in data:
            codigo_vendedor = data['vendedor']
            vendedor_existente = Vendedor.query.get(codigo_vendedor)
            if not vendedor_existente:
                return jsonify({'erro': f'Vendedor com código {codigo_vendedor} não encontrado.'}), 404
        if 'cliente' in data:
            codigo_cliente = data['cliente']
            cliente_existente = Cliente.query.get(codigo_cliente)
            if not cliente_existente:
                return jsonify({'erro': f'Cliente com código {codigo_cliente} não encontrado.'}), 404
        if 'data' in data:
            nova_data = datetime.now()
        if 'preco_total' in data:
            preco_total = data['preco_total']
            if preco_total < 0:
                return jsonify({'erro': f'Preço total inválido.'}), 404

        orcamento.vendedor = data.get('vendedor', orcamento.vendedor)
        orcamento.cliente = data.get('cliente', orcamento.cliente)
        orcamento.data = data.get(nova_data, orcamento.data)
        orcamento.preco_total = data.get('preco_total', orcamento.preco_total)
        db.session.commit()
        return jsonify(orcamento.to_dict())
    else:
        return jsonify({'mensagem': 'Orçamento não encontrado'}), 404

@orcamentos_bp.route('/orcamentos/<int:orcamento_id>', methods=['DELETE'])
def delete_Orcamento(orcamento_id):
    orcamento = Orcamento.query.get(orcamento_id)
    if orcamento:
        db.session.delete(orcamento)
        db.session.commit()
        return jsonify({'mensagem': 'Orçamento excluído com sucesso!'}), 204
    else:
        return jsonify({'mensagem': 'Orçamento não encontrado'}), 404
    
####################### Rotas para ItemOrcamento #####################################################################
@itemOrcamentos_bp.route('/itemOrcamentos', methods=['GET'])
def listar_ItemOrcamentos():
    itemOrcamentos = ItemOrcamento.query.all()
    return jsonify([i.to_dict() for i in itemOrcamentos])

@itemOrcamentos_bp.route('/itemOrcamentos/<int:itemOrcamento_id>', methods=['GET'])
def get_ItemOrcamento_por_id(itemOrcamento_id):
    itemOrcamento = ItemOrcamento.query.get(itemOrcamento_id)
    if itemOrcamento:
        return jsonify(itemOrcamento.to_dict())
    else:
        return jsonify({'mensagem': 'Item de Orçamento não encontrado'}), 404

@itemOrcamentos_bp.route('/itemOrcamentos', methods=['POST'])
def criar_ItemOrcamento():
    data = request.get_json()

    if not data or 'orcamento' not in data or 'ordem' not in data or 'produto' not in data or 'preco' not in data:
        return jsonify({'erro': 'Orcamento e Produto são obrigatórios'}), 400
    
    orcamento = data.get('orcamento')
    produto = data.get('produto')

    orcamento_existente = Orcamento.query.get(orcamento)
    if not orcamento_existente:
        return jsonify({'erro': f'Orcamento com código {orcamento} não encontrado.'}), 404
    produto_existente = Produto.query.get(produto)
    if not produto_existente:
        return jsonify({'erro': f'Produto com código {produto} não encontrado.'}), 404
    
    novo_ItemOrcamento = ItemOrcamento(orcamento=orcamento,
                           ordem=data.get('ordem'),
                           produto=produto,
                           preco=data.get('preco'))
    
    try:
        db.session.add(novo_ItemOrcamento)
        db.session.commit()
        return jsonify(novo_ItemOrcamento.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        print(f"Erro ao criar Item de Orçamento: {e}")
        return jsonify({'erro': f'Erro interno ao criar Item de Orçamento: {str(e)}'}), 500

@itemOrcamentos_bp.route('/itemOrcamentos/<int:itemOrcamento_id>', methods=['PUT'])
def update_ItemOrcamento(itemOrcamento_id):
    itemOrcamento = ItemOrcamento.query.get(itemOrcamento_id)
    if itemOrcamento:
        data = request.get_json()

        if 'orcamento' in data:
            codigo_orcamento = data['orcamento']
            orcamento_existente = Orcamento.query.get(codigo_orcamento)
            if not orcamento_existente:
                return jsonify({'erro': f'Orcamento com código {codigo_orcamento} não encontrado.'}), 404
        if 'produto' in data:
            codigo_produto = data['produto']
            produto_existente = Produto.query.get(codigo_produto)
            if not produto_existente:
                return jsonify({'erro': f'Produto com código {codigo_produto} não encontrado.'}), 404

        itemOrcamento.orcamento = data.get('orcamento', itemOrcamento.orcamento)
        itemOrcamento.produto = data.get('produto', itemOrcamento.produto)
        itemOrcamento.ordem = data.get('ordem', itemOrcamento.ordem)
        itemOrcamento.preco = data.get('preco', itemOrcamento.preco)
        db.session.commit()
        return jsonify(itemOrcamento.to_dict())
    else:
        return jsonify({'mensagem': 'Item de Orçamento não encontrado'}), 404

@itemOrcamentos_bp.route('/itemOrcamentos/<int:itemOrcamento_id>', methods=['DELETE'])
def delete_ItemOrcamento(itemOrcamento_id):
    itemOrcamento = ItemOrcamento.query.get(itemOrcamento_id)
    if itemOrcamento:
        db.session.delete(itemOrcamento)
        db.session.commit()
        return jsonify({'mensagem': 'Item de Orçamento excluído com sucesso!'}), 204
    else:
        return jsonify({'mensagem': 'Item de Orçamento não encontrado'}), 404

####################### Relatorio Itens #####################################################################
@itemOrcamentos_bp.route('/itemOrcamentos/relatorio', methods=['GET'])
def get_relatorio_itens_orcamento():
    produto_codigo = request.args.get('produtoCodigo', type=int)
    data_inicial_str = request.args.get('dataInicial')
    data_final_str = request.args.get('dataFinal')

    query = db.session.query( ItemOrcamento, Orcamento, Produto\
        ).join(Orcamento, ItemOrcamento.orcamento == Orcamento.codigo)\
        .join(Produto, ItemOrcamento.produto == Produto.codigo)

    if produto_codigo:
        query = query.filter(Orcamento.codigo, ItemOrcamento.ordem)

    if data_inicial_str:
        try:
            data_inicial = datetime.strptime(data_inicial_str, '%Y-%m-%d')
            query = query.filter(Orcamento.data >= data_inicial)
        except ValueError:
            return jsonify({'erro': 'Formato de data inicial inválido. Use YYYY-MM-DD.'}), 400

    if data_final_str:
        try:
            data_final = datetime.strptime(data_final_str, '%Y-%m-%d')
            query = query.filter(Orcamento.data <= data_final.replace(hour=23, minute=59, second=59, microsecond=999999))
        except ValueError:
            return jsonify({'erro': 'Formato de data final inválido. Use YYYY-MM-DD.'}), 400

    itens_relatorio = query.order_by(ItemOrcamento.orcamento, ItemOrcamento.ordem).all()

    orcamentos_agrupados = {}
    for item_orcamento, orcamento, produto in itens_relatorio:
        orcamento_id = orcamento.codigo
        
        if orcamento_id not in orcamentos_agrupados:
            orcamentos_agrupados[orcamento_id] = {
                'codigo': orcamento.codigo,
                'data': orcamento.data.strftime('%Y-%m-%d'),
                'itens': [],
                'total_orcamento': 0.0
            }

        item_data = {
            'id': item_orcamento.codigo,
            'ordem': item_orcamento.ordem,
            'produto_codigo': produto.codigo,
            'produto_nome': produto.descricao,
            'preco': float(item_orcamento.preco)
        }
        orcamentos_agrupados[orcamento_id]['itens'].append(item_data)
        orcamentos_agrupados[orcamento_id]['total_orcamento'] += item_orcamento.preco

    relatorio_final = list(orcamentos_agrupados.values())

    return jsonify(relatorio_final)