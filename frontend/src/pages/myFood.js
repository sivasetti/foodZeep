const token = localStorage.getItem('token');
if(!token){
    window.location.href = 'index.html';
}

const loadFood = document.getElementById('loadFood');
const foodList = document.getElementById('foodList');

loadFood.addEventListener('click',async ()=>{
    try{
        const response = await fetch('http://localhost:5000/food/my-food?veg=true&sort=price&order=ASC&page=3&limit=2',{
            method : 'GET',
            headers : {
                'Authorization' : `Bearer ${token}`
            }
        });

        const result = await response.json();
        console.log(result);
        console.log(result.data);
        

        if(response.ok){
            let html = '';
            result.data.data.forEach((food) => {
                html += `
                <div>
                    <h3>${food.name}</h3>
                    <p>Food Id : ${food.id} </p>
                    <p>Quantity : ${food.quantity}</p>
                    <p>Price : ${food.price}</p>
                    <p>Veg : ${food.veg ? 'Yes' : 'No'}</p>
                    <p> Expiry Time : ${food.expiry_time}</p>
                    <hr>
                </div>
                `;
            });
            foodList.innerHTML = html;
        }
        else{
            foodList.innerHTML = `<p>${result.message}</p>`;
        }
    }
    catch(error){
        console.log(error.message);
        foodList.innerHTML = `<p>Server Error</p>`
    }
});