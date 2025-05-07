
from pydantic import BaseModel
import json
class Goods(BaseModel):
    name: str
    goods_group: str
    price: float
    unit: str
    count: float

class UpdateGoods(BaseModel):
#    name: str | None = None
#    goods_group: str | None = None
    price: float | None = None
#    unit: str | None = None
    count: float | None = None

goods_list = []

def save_goods(goods):
    json.dump(goods, open('goods.json', 'w'))

def load_goods():
    try:
        return json.load(open('goods.json'))
    except:
        return [] 