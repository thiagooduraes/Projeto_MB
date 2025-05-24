from flask import Flask
from flask_cors import CORS
from models import db

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://user:password@db:3306/database'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

from routes import produtos_bp, clientes_bp, vendedores_bp, ofertas_bp , orcamentos_bp, itemOrcamentos_bp
app.register_blueprint(produtos_bp, url_prefix='/')
app.register_blueprint(clientes_bp, url_prefix='/')
app.register_blueprint(vendedores_bp, url_prefix='/')
app.register_blueprint(ofertas_bp, url_prefix='/')
app.register_blueprint(orcamentos_bp, url_prefix='/')
app.register_blueprint(itemOrcamentos_bp, url_prefix='/')

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)