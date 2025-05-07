# импортируем FastAPI
from fastapi import FastAPI, status, Query, Path
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from goods import Goods,  UpdateGoods, save_goods, load_goods


# Создаем экземпляр класса FastAPI
app = FastAPI(
    title = "Учет покупок",
    description = "Демо приложение для учета покупок. Создано в рамках курса Академии нейросетей",
    version = "1.0.0"
)

# Объявляем функцию get_goods() и декоратор для метода GET
@app.get("/goods", 
         tags=["goods"], 
         summary='Получение списка покупок с итоговой ценой',
         response_description='Список покупок',
         status_code=status.HTTP_200_OK,
         responses={
             200: {
                 "description": "Список покупок с итоговой ценой",
                 "content": {
                     "application/json": {
                         "example": [
                             {
                                 "id": 1,
                                 "name": "Молоко",
                                 "goods_group": "Продукты",
                                 "price": 50.0,
                                 "unit": "л",
                                 "count": 2.0,
                                 "summ": 100.0
                             }
                         ]
                     }
                 }
             }
         }

)
def get_goods():
    gl = []
    goods_list = load_goods()
    
    for i, goods in enumerate(goods_list):
        goods['id'] = i+1
        goods['summ'] = goods['price'] * goods['count']
        gl.append(goods)
   

    return gl

# Объявляем функцию create_good() и декоратор для метода POST

@app.post('/goods',
         tags=["goods"], 
         summary='Добавление покупки в список',
         response_description='Список покупок',
         status_code=status.HTTP_201_CREATED,
         responses={
             201: {
                 "description": "Покупка добавлена в список",
                 "content": {
                     "application/json": {
                         "example": {
                             "id": 1,
                             "name": "Молоко",
                             "goods_group": "Продукты",
                             "price": 50.0,
                             "unit": "л",
                             "count": 2.0,
                             "summ": 100.0
                         }
                     }
                 }
             },
             400: {
                 "description": "Ошибка валидации данных"
             }
         }
)
async def create_good(goods: Goods):
    """
    Добавление покупки в список. Все поля обязательны.
    
    - **name**: Название товара
    - **goods_group**: Группа товара
    - **prise**: Цена товара
    - **unit**: Единица измерения
    - **count**: Количество
    """
    goods_list = load_goods()
    goods_list.append(dict(goods))
    print(goods_list)
    save_goods(goods_list)
    return goods

# Объявляем функцию get_goods_by_group() и декоратор для метода GET
@app.get('/goods/group/{group_name}',
         tags=["goods"], 
         summary='Получение списка покупок определенной категории',
         response_description='Список покупок определенной группы',
         status_code=status.HTTP_200_OK,
         responses={
             200: {
                 "description": "Список покупок определенной группы",
                 "content": {
                     "application/json": {
                         "example": [
                             {
                                 "id": 1,
                                 "name": "Молоко",
                                 "goods_group": "Продукты",
                                 "price": 50.0,
                                 "unit": "л",
                                 "count": 2.0,
                                 "summ": 100.0
                             }
                         ]
                     }
                 }
             },
             404: {
                 "description": "Группа товара не найдена"
             }
         }
)
async def get_goods_by_group(group_name: str = Path(..., description="Группа товара")):
    result = []
    goods_list = load_goods()
    for i, goods in enumerate(goods_list):
        if goods['goods_group'] == group_name:
            goods['id'] = i+1
            goods['summ'] = goods['price'] * goods['count']
            result.append(goods)
    return result

# Объявляем функцию update_goods() и декоратор для метода PUT
@app.put('/goods/{id}',
         tags=["goods"], 
         summary='Обновление цены и/или количества товара',
         response_description='Обновленная запись о покупки',
         status_code=status.HTTP_200_OK, 
)
async def update_goods(id: int, goods: UpdateGoods):
    goods_list = load_goods()
    if id > len(goods_list):
        
        return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content={"message": "Goods not found"})


    if goods.price:
        goods_list[id-1]['price'] = goods.price
    
    if goods.count:
        goods_list[id-1]['count'] = goods.count
    save_goods(goods_list)
    return goods_list[id-1]

# Объявляем функцию delete_goods() и декоратор для метода DELETE
@app.delete('/goods/{id}',
         tags=["goods"], 
         summary='Удаление товара из списка',
         response_description='Список покупок',
         status_code=status.HTTP_200_OK,
)
async def delete_goods(id: int = Path(..., description="Номер товара")):
    goods_list = load_goods()
    if id > len(goods_list):
        return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content={"message": "Goods not found"})
    del goods_list[id-1]
    save_goods(goods_list)
    return {"message": "Goods deleted successfully"}
    
    

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        # "http://localhost:5173",
        # "http://31.129.43.117",
        "https://site-test-deploy1.ru",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)