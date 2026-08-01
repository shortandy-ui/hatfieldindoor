const { getContainerClient, streamToText } = require("../blobHelper");

module.exports = async function (context, req) {
  const key = context.bindingData.key;
  if (!key) {
    context.res = { status: 400, jsonBody: { error: "Missing key" } };
    return;
  }

  let container;
  try {
    container = await getContainerClient();
  } catch (e) {
    context.res = { status: 500, jsonBody: { error: e.message } };
    return;
  }

  const blockBlob = container.getBlockBlobClient(key);

  if (req.method === "GET") {
    try {
      const download = await blockBlob.download();
      const value = await streamToText(download.readableStreamBody);
      context.res = { status: 200, jsonBody: { key, value, shared: true } };
    } catch (e) {
      context.res = { status: 404, jsonBody: { error: "not found" } };
    }
    return;
  }

  if (req.method === "PUT") {
    const body = req.body || {};
    const value = body.value;
    if (typeof value !== "string") {
      context.res = { status: 400, jsonBody: { error: "value must be a string" } };
      return;
    }
    const buffer = Buffer.from(value, "utf8");
    await blockBlob.upload(buffer, buffer.length, {
      overwrite: true,
      blobHTTPHeaders: { blobContentType: "application/json" },
    });
    context.res = { status: 200, jsonBody: { key, value, shared: true } };
    return;
  }

  if (req.method === "DELETE") {
    await blockBlob.deleteIfExists();
    context.res = { status: 200, jsonBody: { key, deleted: true, shared: true } };
    return;
  }

  context.res = { status: 405, jsonBody: { error: "method not allowed" } };
};
