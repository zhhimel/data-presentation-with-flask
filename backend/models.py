from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Trade(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    trade_code = db.Column(db.String(255), nullable=False)
    high = db.Column(db.Float, nullable=False)
    low = db.Column(db.Float, nullable=False)
    open = db.Column(db.Float, nullable=False)
    close = db.Column(db.Float, nullable=False)
    volume = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f'<Trade {self.trade_code} - {self.date}>'

    def to_dict(self):
        return {
            'id': self.id,
            'date': self.date.strftime('%Y-%m-%d'),
            'trade_code': self.trade_code,
            'high': self.high,
            'low': self.low,
            'open': self.open,
            'close': self.close,
            'volume': self.volume
        }
