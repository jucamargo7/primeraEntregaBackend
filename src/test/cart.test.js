import chai from 'chai';
import supertest from 'supertest';

const expect = chai.expect;
const requester = supertest('http://localhost:8080')

const mockCarro = {
    productos:[]
};

describe("Testing para carritos", ()=>{
    describe("POST /api/carritobd/", ()=>{
        it("Crear carrito", async()=>{
            const{ statusCode,ok,_body} = await requester
            .post("/api/carritobd")
            .send(mockCarro);
            expect(_body.payload).to.have.property("_id")
            console.log(_body);
            console.log(ok);
            console.log(statusCode);

        })
    })
})