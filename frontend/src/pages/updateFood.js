const token = localStorage.getItem('token');

if(!token){
    window.location.href = 'index.html';
}

const updateFood = document.getElementById('updatefood');
const message = document.getElementById('message');

updateFood.addEventListener('submit', async(e) =>{
    e.preventDefault();

    const foodId = document.getElementById('foodId').value;
    const name = document.getElementById('name').value;
    const quantity = document.getElementById('quantity').value;
    const price = document.getElementById('price').value;
    const expiry_time = document.getElementById('expiry').value;
    const veg = document.getElementById('veg').value === true;

    try{
        const response = await fetch(
            `http://localhost:5000/food/update/${foodId}`,
            {
                method : 'PUT',
                headers : {
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${token}`
                },
                body : JSON.stringify({
                    name,
                    quantity,
                    price,
                    expiry_time,
                    veg
                })
            }
        );

        const result = await response.json();

        console.log(result);

        if(response.ok){
            message.innerText = `Food Updated Successfully`;
        }
        else{
            message.innerText = result.message || `Update Failed`;
        }
    }
    catch(error){
        console.log(error.message);
        message.innerText = `Server Error`
    }
});