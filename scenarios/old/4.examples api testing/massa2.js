//1
import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';

//2
export const options = {
    stages: [
        { duration: '10s', target: '10' },
        { duration: '10s', target: '10' },
        { duration: '10s', target: '0' },
    ],
    thresholds: {
        checks: ['rate > 0.95'],
        http_req_duration: ['p(90) < 200']
    }

};
const data = new SharedArray('Leitura do Json', function () {
    return JSON.parse(open('./dados.json')).users;
});
//3
export default function () {
    const userID = data[Math.floor(Math.random() * data.length)].id;
    console.log(userID)
    const BASE_URL = `https://test-api.k6.io/public/crocodiles/${userID}`;
    const req = http.get(BASE_URL);

    check(req, {
        'Status code 200': (r) => r.status === 200
    });

    sleep(1);
}