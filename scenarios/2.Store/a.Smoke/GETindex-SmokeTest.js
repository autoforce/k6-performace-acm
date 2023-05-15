//inicialização
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';
import { Counter } from 'k6/metrics';
import { Trend } from 'k6/metrics';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";


//configuração
export const options = {
    insecureSkipTLSVerify: true,
    stages: [
        { duration: '1m', target: 1 }
    ],
    thresholds: {
        checks: ['rate > 0.95'],
        http_req_failed: ['rate < 0.1'],
        http_req_duration: ['p(95) < 500']
    }
}

//definição métricas
const getStatusSucess = new Rate('Taxa de Req. 200');
const getCounters = new Counter('Quantidade de Chamadas');
const getWaiting = new Trend('Tempo de Espera')

//execução
export default function () {
    const BASE_URL = 'http://autodealer.new.acmapp.work/';
    const res = http.get(BASE_URL);
   

    check(res, {
        'Index Carregada com Sucesso': (r) => r.status === 200
    });
    console.log(`${BASE_URL} -> ${res.status}`)
    //validação métricas
    getStatusSucess.add(res.status === 200);
    getCounters.add(1);
    getWaiting.add(res.timings.waiting);

    sleep(1);
}


//desmontagem
export function handleSummary(data) {
    return {
        "GETindexSmokeTest.html": htmlReport(data),
    };
}