from flask import Flask, render_template
from config import Config
from models import db, Trade
from controllers import get_all_trades, get_trade, create_trade, update_trade, delete_trade
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
app.config.from_object(Config)

db.init_app(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/trades', methods=['GET'])
def all_trades():
    return get_all_trades()

@app.route('/trades/<int:trade_id>', methods=['GET'])
def trade_detail(trade_id):
    return get_trade(trade_id)

@app.route('/trades', methods=['POST'])
def add_trade():
    return create_trade()

@app.route('/trades/<int:trade_id>', methods=['PUT'])
def modify_trade(trade_id):
    return update_trade(trade_id)

@app.route('/trades/<int:trade_id>', methods=['DELETE'])
def remove_trade(trade_id):
    return delete_trade(trade_id)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
