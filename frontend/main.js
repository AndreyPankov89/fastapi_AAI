
function generateTableRows(data) {
  const tableBody = document.querySelector('.table tbody');
  tableBody.innerHTML = ''; // Очищаем существующие строки
  total = 0;
  data.forEach((item, i) => {
    const row = document.createElement('tr');
    row.id = item.id; // Добавляем атрибут data-id к строке
    row.innerHTML = `
      <td>${i+1}</td>
      <td>${item.name}</td>
      <td>${item.goods_group}</td>
      <td>${item.price}</td>
      <td>${item.count}</td>
      <td>${item.unit}</td>
      <td>${item.summ}</td>
    `;
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = `<i class="bi bi-trash-fill"></i>`;
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.addEventListener('click', () => {
      deleteRow(item.id);
    });
    row.appendChild(deleteButton);
    const editButton = document.createElement('button');
    editButton.innerHTML = `<i class="bi bi-pen-fill"></i>`;
    editButton.classList.add('btn', 'btn-primary');
    editButton.addEventListener('click', () => {
        editRow(item);
    });
    row.appendChild(editButton);
    tableBody.appendChild(row);
    total += item.summ;
  });
  const totalRow = document.createElement('tr');
  totalRow.innerHTML = `
    <td></td>
    <td><strong>Итого:</strong></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td>${total}</td>
  `;
  tableBody.appendChild(totalRow);
}
function editRow(item) {
    const modal = document.getElementById('editGoodsModal');
    const form = document.getElementById('edit-goods-form');
    document.getElementById('eprice').value = item.price;
    document.getElementById('ecount').value = item.count;
    modal.querySelector('.modal-title').textContent = 'Изменение товара: ' + item.name;
    
    modal.style.display = 'block';
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Предотвращаем стандартную отправку формы
    
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        try {
        const response = await fetch('./api/goods/' + id, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
    
        if (response.ok) {
            // Обработка успешной отправки (например, обновление таблицы)
            console.log('Товар успешно изменен!');
            formTable('./api/goods');
            form.reset(); 
            show_alert('Товар успешно изменен!', 'success');
            modal.style.display = 'none';
        } else {
            console.error('Ошибка при изменении товара:', response.status);
            show_alert('Ошибка при изменении товара!', 'danger');
            // Обработка ошибки (например, вывод сообщения пользователю)
        }
        } catch (error) {
        console.error('Ошибка:', error);
        // Обработка ошибки (например, вывод сообщения пользователю)
        }
    });
    }
function show_alert(msg, type) {
    const alert = document.getElementById(type+'-alert')
    alert.innerHTML = msg;
    alert.classList.remove('d-none');
    setTimeout(() => {
      alert.classList.add('d-none');
    }, 3000);
}
function deleteRow(id) {
  fetch('./api/goods/' + id, {
    method: 'DELETE',
  })
    .then((response) => {
      if (response.ok) {
        // Обработка успешного удаления
        console.log('Товар успешно удален!');
        formTable();
        show_alert('Товар успешно удален!', 'success');
      } else {
        console.error('Ошибка при удалении товара:', response.status);
        // Обработка ошибки (например, вывод сообщения пользователю)
        show_alert('Ошибка при удалении товара!', 'danger');
      }
    })
    .catch((error) => {
      console.error('Ошибка:', error);
    });
}


// Пример запроса к серверу (используйте fetch или XMLHttpRequest)
function formTable(){
    url = localStorage.getItem('api_url')
    fetch(url) 
    .then(response => {
        if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => generateTableRows(data))
    .catch(error => console.error('Ошибка:', error));
}
 function addGoods() {
 
    const form = document.getElementById('add-goods-form');
    form.addEventListener('submit', async (event) => {
      event.preventDefault(); // Предотвращаем стандартную отправку формы
  
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
  
      try {
        const response = await fetch('./api/goods', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
  
        if (response.ok) {
          // Обработка успешной отправки (например, обновление таблицы)
          console.log('Товар успешно добавлен!');
          formTable('');
          form.reset(); 
          show_alert('Товар успешно добавлен!', 'success');
          
        } else {
          console.error('Ошибка при добавлении товара:', response.status);
          show_alert('Ошибка при добавлении товара!', 'danger');
          // Обработка ошибки (например, вывод сообщения пользователю)
        }
      } catch (error) {
        console.error('Ошибка:', error);
        // Обработка ошибки (например, вывод сообщения пользователю)
      }
    });
}
function close_modal(){
  const modal = document.getElementById('editGoodsModal');
  const close_modal = document.getElementById('close-modal');
  close_modal.addEventListener('click', () => {
    modal.style.display = 'none';
  });
}
function filterTable() {
    document.getElementById('category-filter').addEventListener('change', function() {
      const selectedCategory = this.value;
      if (!selectedCategory){
        localStorage.setItem('api_url', './api/goods');
        formTable();
      }
      else {
        localStorage.setItem('api_url', './api/goods/group/' + selectedCategory);
        formTable();
      }
    });
}
document.addEventListener('DOMContentLoaded', () => {
  localStorage.setItem('api_url', './api/goods');
  formTable();
  addGoods();
  filterTable();
  close_modal();
});
