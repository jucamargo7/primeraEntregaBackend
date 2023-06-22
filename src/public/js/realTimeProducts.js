const socket = io()

const formulario = document.querySelector("#formulario")
const titulo = document.querySelector("#titulo")
const descripcion = document.querySelector("#descripcion")
const precio = document.querySelector("#precio")
const producto= document.querySelector("#productos")

formulario.addEventListener("submit", e=>{
    e.preventDefault()
    
    socket.emit("cliente:NuevoProducto", {
        titulo: titulo.value,
        descripcion: descripcion.value,
        precio: precio.value
    })
    socket.on("server:NuevoProducto", data =>{
        producto.innerHTML += `
        <div class="card card-body">
            <h2>${data.titulo}<h2/>
            <h2>${data.descripcion}<h2/>
            <h2>${data.precio}<h2/>
        <div/>
        `
    })
})