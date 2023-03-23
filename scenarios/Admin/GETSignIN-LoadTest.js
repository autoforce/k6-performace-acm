//inicialização
import http from 'k6/http';
import {check} from 'k6';


//configuração
export const options = {
    vus: 100,
    duration: '20m'
}

//execução
export default function(){
    const res = http.get('https://ac-stage.com/managers/sign_in');

    check(res, {
        'status code é 200': (r) => r.status === 200
    });
}