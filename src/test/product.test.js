import chai from 'chai';
import supertest from 'supertest';

const expect = chai.expect;
const requester = supertest('http://localhost:8080')
const mockProduct ={
    title: "carne",
    description: "vse",
    code: "afdggfd",
    price: 12500,
    status: true,
    stock: 32,
    category: "comida"
}
describe("Testing para productos",  ()=>{
    describe("GET /api/productosbd", () => {
        it("Obtener productos", async () => {
            const response = await requester.get("/api/productosbd");
            expect(response.statusCode).to.equal(200);
            expect(response.body.status).to.equal("success");
            expect(response.body.payload).to.be.an('array');
        });
    });
     describe("POST /api/productosbd", ()=>{
        it("Crear productos", async () => {
            const response = await requester
                .post("/api/productosbd")
                .send(mockProduct);
            
            console.log(response.body);
            
            expect(response.statusCode).to.equal(200);
            expect(response.ok).to.be.true;
            expect(response.body.payload).to.have.property("_id");
        });
     })
})