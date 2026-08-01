const { getContainerClient } = require("../blobHelper");

module.exports = async function (context, req) {
  const prefix = (req.query && req.query.prefix) || "";

  let container;
  try {
    container = await getContainerClient();
  } catch (e) {
    context.res = { status: 500, jsonBody: { error: e.message } };
    return;
  }

  const keys = [];
  for await (const blob of container.listBlobsFlat({ prefix })) {
    keys.push(blob.name);
  }
  context.res = { status: 200, jsonBody: { keys, prefix, shared: true } };
};
