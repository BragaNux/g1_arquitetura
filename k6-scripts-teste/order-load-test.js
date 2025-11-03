import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 10 },  // aquecimento
    { duration: "1m", target: 50 },   // carga moderada
    { duration: "30s", target: 0 },   // resfriamento
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"],      // < 1% falhas
    http_req_duration: ["p(95)<500"],    // 95% das requisições < 500ms
  },
};

export default function () {

  const orderId = "6715b9a8b4f2c18c73ddabe1";

  const url = `http://localhost:3002/orders/${orderId}`; // ou porta do teu serviço de orders

  const res = http.get(url);

  check(res, {
    "status é 200": (r) => r.status === 200,
    "possui campo totalPrice": (r) => r.json("totalPrice") !== undefined,
    "possui campo status": (r) => r.json("status") !== undefined,
  });

  sleep(1);
}
