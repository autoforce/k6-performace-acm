//realizar registro novo usuario
//base url https://test-api.k6.io

//criterios
// carga 10vus por 10s

//limites
// req com falha inferior a 1%
//duracao da req p(95) < 500ms
//req com sucesso > 95%


//1
import http from 'k6/http';
import { check, sleep } from 'k6';


//2
export const options = {
    // vus: 10,
    // duration: '10s',
    stages: [
        { duration: '10s', target: 10 },
        { duration: '1m', target: 10 },
        { duration: '10s', target: 0 },
    ],
    thresholds: {
        checks: ['rate > 0.95'],
        http_req_duration: ['p(95) < 500'],
        http_req_failed: ['rate < 0.01']
    }
}

//3
export default function () {
    const BASE_URL = 'https://test-api.k6.io';
    const USER = `${Math.random()}@mail.com`
    const PASS = 'user123'

    console.log(`User: ${USER} | Senha:${PASS}`)

    const res = http.post(`${BASE_URL}/user/register/`, {
        "username": USER,
        "first_name": 'crocodilo',
        "last_name": 'dino',
        "email": USER,
        "password": PASS
    });


    check(res, {
        'Sucesso ao registrar': (r) => r.status === 201
    });

    sleep(1);
}