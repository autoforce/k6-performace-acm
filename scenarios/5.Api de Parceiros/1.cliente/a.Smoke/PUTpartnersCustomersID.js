//Inicialização
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';
import { Counter } from 'k6/metrics';
import { Trend } from 'k6/metrics';
import {
    randomIntBetween,
    randomString,
    randomItem,
    uuidv4,
    findBetween,
} from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

//configuração
export const options = {
    insecureSkipTLSVerify: true,
    stages: [
        { duration: '10s', target: 1 }
    ],
    thresholds: {
        http_req_failed: ['rate < 0.1'],
        checks: ['rate > 0.99']
    }

};

//métricas personalizadas
const getStatusSucess = new Rate('Taxa de Req. 200');
const getCounters = new Counter('Quantidade de Chamadas');
const getWaiting = new Trend('Tempo de Espera');

//execução
const BASE_URL = 'https://ac-stage.com';
const customer_ids = [
    '61ae754690ceb30004494be0'
];

export default function () {
    const nome = "Teste Gabs";
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
        'Authorizathion': 'Token 12345',
        'Content-Type': 'application/json'
    };

    const user = {
        name: nome,
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

    const res = http.put(`${BASE_URL}/api/v1/partners/customers/${customer_id}`, JSON.stringify(user), { headers: headers })
    const statusReq = res.status;
    const bodyResponse = JSON.parse(res.body);
    const customerId = bodyResponse.id;


    check(res, {
        'Criou o pedido com sucesso': (r) => r.status === 200
    });

    //validação métricas
    getStatusSucess.add(res.status === 200);
    getCounters.add(1);
    getWaiting.add(res.timings.waiting);

    console.log(bodyResponse);
    sleep(1);


}
