//1 - inicializacao
import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { Counter } from 'k6/metrics';


//2 - configuracao
export const options = {
    insecureSkipTLSVerify: true,
    stages: [
        { duration: '1m', target: 1 }
    ],
    thresholds: {
        checks: ['rate > 0.99'],
        http_req_failed: ['rate < 0.1'],
        http_req_duration: ['p(95) < 500']
    }

};

const getCounters = new Counter('Quantidade de Chamadas');

//3 - execucao
export function getmarcas() {
    const randomYear = Math.floor(Math.random() * 13) + 2010;

    const BASE_URL = 'http://autodealer.new.acmapp.work';
    const path = `/api/v1/vehicles/makes?year=${randomYear}`;
    const url = BASE_URL + path

    const res = http.get(url);
    const resBody = res.body
    return resBody
};

const marcas = getmarcas()

export default function (marcas) {
    
    const randomYear = Math.floor(Math.random() * 13) + 2010;
    const BASE_URL = 'http://autodealer.new.acmapp.work/api/v1/vehicles/';
    const path = `models?year=${randomYear}&makeId=${1967}`//deixa dinamico de acordo com
    const url = BASE_URL + path

    const res = http.get(url)
    console.log(url)
    console.log(resBody)

    check(res, {
        'Modelos Carregadas': (r) => r.status === 200
    });

    //métricas definidas
    getCounters.add(1);

    sleep(1);
};

//4 - desmontagem
export function handleSummary(data) {
    return {
        "GETModelosSmokeTest.html": htmlReport(data),
    };
};