function purcharse(){
    const idCarrito = document.getElementById("idCarrito").value
    axios.post(`/api/carritobd/${idCarrito}/purchase`).then((res)=>{
        console.log(res)
    }).catch((error)=>{
        console.log(error)
    })  
}