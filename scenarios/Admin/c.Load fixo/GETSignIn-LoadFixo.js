//inicialização
import http from 'k6/http';
import { check } from 'k6';
import { Rate } from 'k6/metrics';
import {Counter} from 'k6/metrics';
import {Trend} from 'k6/metrics';

//configuração
export const options = {
    insecureSkipTLSVerify: true,
    stages: [{ duration: '20m', target: 100 }],
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
    const req = http.get('https://ac-stage.com/managers/sign_in');

    check(req, {
        'status code é 200': (r) => r.status === 200
    });

    getStatusSucess.add(req.status === 200);
    getCounters.add(1);
    getWaiting.add(req.timings.waiting);
}