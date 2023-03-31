//1
import http from 'k6/http';
import { check, sleep } from 'k6';

//2
export const options = {
    insecureSkipTLSVerify: true,
    stages: [
        { duration: '10s', target: 1 }
    ],
    thresholds: {
        http_req_failed: ['rate < 0.1']
    }

}

const BASE_URL = 'https://ac-stage.com';

//3
export default function () {
    const name = "Teste";
    const cpf = "433.023.770-96";
    const email = "teste@mailinator.com";
    const phone = "(11) 91234-5678";
    const zip_code = "05138-080";
    const state = "SP";
    const city = "Sao Paulo";
    const neighborhood = "Pirituba";
    const street = "Rua Jose Queiroz dos Santos";
    const number = "186";
    const complement = "Casa";

    const headers = {
        'Authorization': `Bearer 12345`,
        'Content-Type': 'application/json'
    };

    const user = {
        name: name,
        cpf: cpf,
        email: email,
        phone: phone,
        zip_code: zip_code,
        state: state,
        city: city,
        neighborhood: neighborhood,
        street: street,
        number: number,
        complement: complement
    }

    const res = http.post(`${BASE_URL}/api/v1/partners/customers`, JSON.stringify(user), { headers: headers });
    console.log(res.status)

    check(res, {
        'Criou o pedido com sucesso': (r) => r.status === 200
    });

    sleep(1);
}
