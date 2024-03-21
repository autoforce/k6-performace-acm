import http from 'k6/http';
import { check, sleep } from 'k6';
import { open } from 'k6/js/common';

export default function () {
  // Faz a solicitação à API
  const response = http.get('https://api.exemplo.com/endpoint');

  // Converte a resposta em um objeto JSON
  const jsonData = JSON.parse(response.body);

  // Salva o objeto JSON em um arquivo
  const file = open('resposta.json', 'w');
  file.write(JSON.stringify(jsonData, null, 2));
  file.close();

  // Resto do código...
}
