# Projeto_MB

Prova Desenvolvimento Drogaria - Docker Python React Mysql

## Objetivos

● Desenvolver uma rotina de orçamentos e relatório de orçamentos, levando em consideração as regras de negócios e os critérios necessários para a conclusão de um orçamento.

● Utilizar Delphi 7 ou Delphi XE, ou alguma linguagem Web de sua preferência.

*Foram utilizadas as linguagens Python - Backend, React - frontend e MySQL - banco de dados.

## Requisitos:

● Desenvolver aplicação com CRUD de Produto, Cliente e Vendedor:
    
* Estão disponíveis na tela inicial da aplicação os links para as telas de Produtos, Clientes e Vendedores, onde o usuário pode ver os registros armazenados, inserir novos registros, editar ou excluir registros da lista apresentada.

● Desenvolver cadastro de Oferta do tipo "LEVE X PAGUE Y", onde a quantidade a levar deve ser maior que a quantidade a pagar:

* No menu da aplicação, é possível entrar na tela Ofertas, onde é possível realizar as operações sobre os registros de ofertas, seguindo a regra definida.

● Desenvolver rotina de orçamento, com as informações de Vendedor, Cliente e Produto, respeitando as regras de ofertas inseridas:

* No menu da aplicação, é possível entrar nas telas Orçamento e Item Orçamentos, onde é possível realizar as operações sobre os registros de orçamentos e itens, seguindo as regras definidas. Essas telas podem ser utilizas para manipular os registros individualmente, mas a rotina completa é feita na tela Nova Venda.

* Para realizar uma venda, o usuário deve entrar na tela Nova Venda, onde deve indicar os códigos de Vendedor e Cliente, respeitando a regra de que um vendedor não pode vender para si mesmo.


    Também é possível adicionar itens ao orçamento, indicando o código do produto. 
Os itens são exibidos na tela, informando seu preço final, de acordo com as ofertas cadastradas e permitindo suaa exclusão.

    O valor total do orçamento é apresentado ao fim da tela.

● Desenvolver um relatório de produtos orçados, com filtros de período e produto, com a totalização de vendas por orçamento, com seus itens, e um total geral dos orçamentos.

* No menu da aplicação, é possível entrar na tela Relatório de Produtos, onde são apresentados os filtros para a escolha do usuário e, após Gerar Relatório, são apresentados os produtos orçados no período indicado, segmentados por seus respectivos orçamentos. Também é apresentado um total geral ao fim do relatório, somando os valores de todos os itens apresentados. 


## Configurações do ambiente

● Python 3.9

● Banco de dados Mysql 8.0

● React 19.1.0

## Utilização

● Para simplificar o uso do sistema, foi utilizado o Docker durante a implementação, sendo necessário que o Docker esteja instalado no ambiente.

● Foi utilizado o Docker na versão 4.34.3. A versão mais recente pode ser obtido através do site:

    https://www.docker.com/products/docker-desktop/

● Após clonar o repositório e certificar de que o docker esteja em execução, basta executar os comando abaixo para inicializar o sistema:

    docker-compose up -d --build

* O sistema pode ser acessado pelo link

        localhost:3000/

* Para parar a execução do Docker:
    
        docker-compose down

* Caso deseje parar a execução e excluir os contêineres, redes, volumes e imagens associadas ao docker deste projeto, utilize o comando:

        docker-compose down --volumes --rmi all