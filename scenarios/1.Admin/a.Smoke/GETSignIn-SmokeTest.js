//inicialização
import http from 'k6/http';
import { check } from 'k6';
import { Rate } from 'k6/metrics';
import { Counter } from 'k6/metrics';
import { Trend } from 'k6/metrics';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

//configuração
export const options = {
    insecureSkipTLSVerify: true,
    stages: [{ duration: '1m', target: 1 }],
    thresholds: {
        http_req_failed: ['rate <0.01'],
        checks: ['rate > 0.99']
    }
};

const getStatusSucess = new Rate('Taxa req. 200');
const getCounters = new Counter('Quantidade de Chamadas');
const getWaiting = new Trend('Taxa de Espera');

//execução

export default function () {
    const BASE_URL = 'https://new.acmapp.work';
    const path = '/managers/sign_in'
    const URL_PATH = BASE_URL + path
    const res = http.get(URL_PATH);

    console.log(`${URL_PATH} -> ${res.status}`)

    check(res, {
        'status code é 200': (r) => r.status === 200
    });

    getStatusSucess.add(res.status === 200);
    getCounters.add(1);
    getWaiting.add(res.timings.waiting);
}

//desmontagem
export function handleSummary(data) {
    return {
        "summary.html": htmlReport(data),
    };
}