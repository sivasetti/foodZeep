const token = localStorage.getItem('token');

if(!token){
    window.location.href = 'index.html';

}
const foodForm = document.getElementById('foodForm');
const message = document.getElementById('message');
const loadFood = document.getElementById('loadFood');
const logout = document.getElementById('logoutBtn');
const deleteFood = document.getElementById('deleteFood');
const deleteMessage = document.getElementById('deleteMessage');


logout.addEventListener('click', ()=>{
    localStorage.removeItem('token');
    window.location.href = 'index.html'
});


foodForm.addEventListener('submit', async (e) =>{
    e.preventDefault();


    const name = document.getElementById('name').value;
    const quantity = document.getElementById('quantity').value;
    const price = document.getElementById('price').value;

    const expiry_time = document.getElementById('expiry_time').value;
    const veg = document.getElementById('veg').value === 'true';

    try{
        const response = await fetch('http://localhost:5000/food/add',
            {
                method : 'POST',
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
            message.innerText = 'Food added successfully';
        }
        else{
            message.innerText = result.message
        }

    }
    catch(error){
        console.log(error.message);
        message.innerText = `Server Error`
    }
});



loadFood.addEventListener('click',async ()=>{
    window.location.href = 'getMyFood.html'
});

deleteFood.addEventListener('submit', async(e)=>{
    e.preventDefault();

    const id = document.getElementById('foodId').value;

    try{
        const response = await fetch(
            `http://localhost:5000/food/delete/${id}`,
            {
                method : 'DELETE',
                headers : {
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${token}`
                }
            }            
        );

        const result = await response.json();

        console.log(result);
        if(response.ok){
            deleteMessage.innerHTML = result.message || `Food Item ${id} delete successfully`;
        }
        else{
            deleteMessage.innerHTML = result.message || `Unable to delete food item successfully`;
        }
    }
    catch(error){
        deleteMessage.innerHTML = `Server Error`
        console.log(error.message);
    }
});