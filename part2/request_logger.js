const RequestLogger = (req, res, next) => {
  const start = process.hrtime();

  res.on("finish", () => {
    const diff = process.hrtime(start);
    const ms = diff[0] * 1e3 + diff[1] / 1e6; // milliseconds with sub-ms precision
    console.log("Method", req.method);
    console.log("Path", req.path);
    console.log("Body", req.body);
    console.log("Url", req.url);
    console.log("Status code", res.statusCode);
    console.log("Response Time", ms.toFixed(3) + " ms");

    const hdr = res.getHeader && res.getHeader("X-Response-Time");
    if (hdr) {
      console.log("X-Response-Time header:", hdr);
    }
    console.log("---");
  });

  next();
};

// METHOD, PATH, BODY, URL

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

module.exports = { RequestLogger, unknownEndpoint };
