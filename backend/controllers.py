from flask import request, jsonify
from models import db, Trade
from datetime import datetime

def get_all_trades():
    trades = Trade.query.all()
    return jsonify([trade.to_dict() for trade in trades])

def get_trade(trade_id):
    trade = Trade.query.get(trade_id)
    if trade:
        return jsonify(trade.to_dict())
    return jsonify({'error': 'Trade not found'}), 404

def create_trade():
    data = request.json
    trade = Trade(
        date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
        trade_code=data['trade_code'],
        high=float(data['high']),
        low=float(data['low']),
        open=float(data['open']),
        close=float(data['close']),
        volume=int(data['volume'])
    )
    db.session.add(trade)
    db.session.commit()
    return jsonify({'message': 'Trade created successfully'})

def update_trade(trade_id):
    trade = Trade.query.get(trade_id)
    if not trade:
        return jsonify({'error': 'Trade not found'}), 404
    
    data = request.json
    trade.date = datetime.strptime(data['date'], '%Y-%m-%d').date()
    trade.trade_code = data['trade_code']
    trade.high = float(data['high'])
    trade.low = float(data['low'])
    trade.open = float(data['open'])
    trade.close = float(data['close'])
    trade.volume = int(data['volume'])
    
    db.session.commit()
    return jsonify({'message': 'Trade updated successfully'})

def delete_trade(trade_id):
    trade = Trade.query.get(trade_id)
    if not trade:
        return jsonify({'error': 'Trade not found'}), 404
    
    db.session.delete(trade)
    db.session.commit()
    return jsonify({'message': 'Trade deleted successfully'})
