from flask import Blueprint, request, jsonify
from models import Trade, db

trade_bp = Blueprint('trade', __name__)

@trade_bp.route('/trades', methods=['GET'])
def get_trades():
    trades = Trade.query.all()
    return jsonify([trade.to_dict() for trade in trades])

@trade_bp.route('/trade/<int:id>', methods=['GET'])
def get_trade(id):
    trade = Trade.query.get_or_404(id)
    return jsonify(trade.to_dict())

@trade_bp.route('/trade', methods=['POST'])
def create_trade():
    data = request.get_json()
    new_trade = Trade(**data)
    db.session.add(new_trade)
    db.session.commit()
    return jsonify({'message': 'Trade created successfully!'}), 201

@trade_bp.route('/trade/<int:id>', methods=['PUT'])
def update_trade(id):
    trade = Trade.query.get_or_404(id)
    data = request.get_json()
    trade.update(data)
    db.session.commit()
    return jsonify({'message': 'Trade updated successfully!'})

@trade_bp.route('/trade/<int:id>', methods=['DELETE'])
def delete_trade(id):
    trade = Trade.query.get_or_404(id)
    db.session.delete(trade)
    db.session.commit()
    return jsonify({'message': 'Trade deleted successfully!'})
