//1
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';
import { Counter } from 'k6/metrics';
import { Trend } from 'k6/metrics';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";


//2
export const options = {
    insecureSkipTLSVerify: true,
    stages: [
        { duration: '2m', target: 100 },
        { duration: '5m', target: 100 },
        { duration: '2m', target: 200 },
        { duration: '5m', target: 200 },
        { duration: '2m', target: 300 },
        { duration: '5m', target: 300 },
        { duration: '5m', target: 400 },
        { duration: '5m', target: 400 },
        { duration: '10m', target: 0 },

    ],
    thresholds: {
        http_req_failed: ['rate < 0.1'],
        checks: ['rate > 0.99']
    }

}

const BASE_URL = 'https://ac-stage.com';

//criando metricas
const getStatusSucess = new Rate('Taxa req. 200');
const getCounters = new Counter('Quantidade de Chamadas');
const getWaiting = new Trend('Taxa de Espera');

//3
export default function () {
    const name = "Teste Gabs";
    const cpf = "557.148.650-30";
    let randomInicioEmail = Math.floor((Math.random() * 10000000) + 1)
    let email = `${randomInicioEmail}@mailinator.com`;//unico

    const phone = "(11) 91234-5678";
    const zip_code = "05138-080";
    const state = "SP";
    const city = "Sao Paulo";
    const neighborhood = "Pirituba";
    const street = "Rua Jose Queiroz dos Santos";
    const number = "186";
    const complement = "Casa";

    const headers = {
        'Authorization': 'Token 12345',
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
    const statusReq = res.status
    const bodyResponse = JSON.parse(res.body)
    const customerId = bodyResponse.id

    //console log para alinhar
    console.log(`EmailCustomer: ${email}, CustomerId: ${customerId}, StatusCode: ${statusReq}`)

    check(res, {
        'Criou o pedido com sucesso': (r) => r.status === 200
    });

    //validação métricas
    getStatusSucess.add(res.status === 200);
    getCounters.add(1);
    getWaiting.add(res.timings.waiting);

    sleep(1);
}

//4
export function handleSummary(data) {
    return {
        "POSTcustomersApiParceiros-Stress.html": htmlReport(data),
    };
}