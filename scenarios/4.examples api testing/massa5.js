//api privada
//1oo vu por 10s
//limites req com falha < 1%
//duração da req p(95) <250
//1
import http from 'k6/http';
import { sleep, check } from 'k6';

//2
export const options = {
    stages: [
        { duration: '10s', target: 100 }
        // { duration: '10s', target: 100 },
        // { duration: '10s', target: 0 },
    ],
    thresholds: {
        http_req_failed: ['rate < 0.01'],
        http_req_duration: ['p(95) < 250']
    }

};

const BASE_URL = 'https://test-api.k6.io';

export function setup() {
    const loginRes = http.post(`${BASE_URL}/auth/token/login/`, {
        username: '0.4007728653613632@mail.com',
        password: 'user123'
    });

    const token = loginRes.json('acess');
    return token;
};

//3
export default function(token) {

    const params = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };

    const res = http.get(`${BASE_URL}/my/crocodiles`, params);

    check(res, {
        'Status Code 200': (r) => r.status === 200

    });
};