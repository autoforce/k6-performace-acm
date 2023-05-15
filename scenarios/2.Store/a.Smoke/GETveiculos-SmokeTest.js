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
    stages: [{ duration: '1m', target: 1 }],
    thresholds: {
        checks: ['rate > 0.95'],
        http_req_failed: ['rate < 0.1'],
        http_req_duration: ['p(95) < 2000']

    }
};

const getStatusSucess = new Rate('Taxa req. 200');
const getCounters = new Counter('Quantidade de Chamadas');
const getWaiting = new Trend('Taxa de Espera');

//3
export default function () {
    const BASE_URL = 'http://autodealer.new.acmapp.work';
    const path = '/veiculos';
    const URL_SLUG = BASE_URL + path;

    const res = http.get(URL_SLUG);

    console.log(`${URL_SLUG} -> ${res.status}`);

    check(res, {
        'Veiculos carregados': (r) => r.status === 200
    });

    getStatusSucess.add(res.status === 200);
    getCounters.add(1);
    getWaiting.add(res.timings.waiting);

    sleep(1);
}

//desmontagem
export function handleSummary(data) {
    return {
        "GETveiculosSmokeTest.html": htmlReport(data),
    };
}

