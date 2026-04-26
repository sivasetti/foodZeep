const loginForm = document.getElementById('loginForm');
let message = document.getElementById('message');

loginForm.addEventListener('submit', async (e) =>{
    e.preventDefault();

    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    try{
        const response = await fetch(
            'http://localhost:5000/auth/login',
            {
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const result = await response.json();

        console.log(result);

        if(response.ok){
            const token = result.data.token;

            localStorage.setItem(
                'token',
                token
            );

            message.innerText = `Hi ${result.data.user.name}, Login successful`;

            setTimeout(() => {
                window.location.href = 'add-food.html';
            }, 1000);
        }
        else{
            message.innerText = result.message || 'Login Failed';
        }
    }
    catch(error){
        console.log(error.message);
        message.innerText =  `Server Error`;
    }
})