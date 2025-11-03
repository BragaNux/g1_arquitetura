import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 10 },   // aquecimento
    { duration: "1m", target: 100 },   // carga moderada
    { duration: "1m", target: 300 },   // pico intermediário
    { duration: "1m", target: 500 },   // pico alto
    { duration: "30s", target: 0 },    // resfriamento
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"],       // menos de 1% de falhas
    http_req_duration: ["p(95)<500"],     // 95% das requisições < 500ms
  },
};

// ===============================
// Função de teste
// ===============================

export default function () {

  const url = "http://localhost:3003/payments/1/process";

  const res = http.post(url, null, { headers: { "Content-Type": "application/json" } });

  // Verificações básicas
  check(res, {
    "resposta OK": (r) => r.status === 200,
    "resposta contém mensagem": (r) => r.json("message") !== undefined,
  });

  // Pequeno delay entre requisições de cada VU (usuário virtual)
  sleep(1);
}
