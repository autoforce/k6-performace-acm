//1
import http from 'k6/http';
import { sleep, check } from 'k6';
import { Rate } from 'k6/metrics';
import { Counter } from 'k6/metrics';
import { Trend } from 'k6/metrics';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { SharedArray } from 'k6/data';


//2
export const options = {
    insecureSkipTLSVerify: true,
    stages: [
        { duration: '1m', target: 1 },
    ],
    thresholds: {
        http_req_failed: ['rate < 0.01'],
        checks: ['rate > 0.99'],
        http_req_duration: ['p(95) < 2000']
    }
}

//lendo json com veiculos
const data = new SharedArray('Leitura do Json', function () {
    return JSON.parse(open('/json info store/veiculos.json')).veiculos;
});

//criando metricas
const getStatusSucess = new Rate('Taxa req. 200');
const getCounters = new Counter('Quantidade de Chamadas');
const getWaiting = new Trend('Taxa de Espera');

//3
export default function () {
    const BASE_URL = 'https://autodealer.ac-stage.com/veiculos/';
    const veiculo = data[Math.floor(Math.random() * data.length)].slug;
    const URL_SLUG = BASE_URL + veiculo
    console.log(URL_SLUG)
    const res = http.get(URL_SLUG);

    check(res, {
        'Status 200': (r) => r.status === 200
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
        "GETinternaSmokeTest.html": htmlReport(data),
    };
}