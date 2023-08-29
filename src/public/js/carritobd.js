function purcharse(){
    const idCarrito = document.getElementById("idCarrito").value
    axios.post(`/api/carritobd/${idCarrito}/purchase`).then((res)=>{
        alert("Se ha enviado un correo con la factura")
        location.href="/productos"
    }).catch((error)=>{
        alert("Hubo un error en la compra")
    })  
}