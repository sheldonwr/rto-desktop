import http from "http";

export function getUrlContent(url, method) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      url,
      {
        method: method,
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          resolve(data)
        });
        res.on("error", err => {
          reject(err)
        })
      }
    );
    req.on('error', err => {
      reject(err)
    })
    req.end();
  });
}
