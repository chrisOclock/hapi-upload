const Hapi = require("hapi");
const Inert = require("inert");
const server = Hapi.Server({ port: 2345 });
const fs = require("fs");

const handleFileUpload = (file) => {
  return new Promise((resolve, reject) => {
    const filename = Date.now() + "_" + file.hapi.filename;
    const data = file._data;
    console.log("handleFileUpload filename", filename);
    fs.writeFile("./upload/" + filename, data, (err) => {
      if (err) {
        reject(err);
      }
      resolve({ message: "Upload successfully!" });
    });
  });
};

const init = async () => {
  await server.register(Inert);

  server.route({
    path: "/upload",
    method: "POST",
    options: {
      payload: {
        output: "stream",
      },
    },
    handler: async (req, h) => {
      const { payload } = req;
      const response = handleFileUpload(payload.file);
      return response;
    },
  });
  server.route({
    method: "GET",
    path: "/upload/{file*}",
    handler: {
      directory: {
        path: "upload",
      },
    },
  });
  await server.start();
};

init();
