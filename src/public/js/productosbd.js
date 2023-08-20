function agregarProducto(id){
    const idCarrito = document.getElementById("idCarrito").value
    axios.post(`/api/carritobd/carritos/${idCarrito}/productos/${id}`).then((res)=>{
        console.log(res)
    }).catch((error)=>{
        console.log(error)
    })  
}
function continuarCompra(){
    window.location.href = '/carrito';
}

