localStorage.removeItem('token')

setTimeout(() => {
    window.location.href = 'http://localhost:3000/login'
}, 10000);