const fs = require("fs");
const path = require("path");

const downloadFile = async (fetch, url, path) => {
  const res = await fetch(url);
  const fileStream = fs.createWriteStream(path);
  await new Promise((resolve, reject) => {
    res.body.pipe(fileStream);
    res.body.on("error", reject);
    fileStream.on("finish", resolve);
  });
};

module.exports = async ({
  core,
  github,
  context,
  fetch,
  runId,
  destination,
}) => {
  const response = await github.rest.actions.listWorkflowRunArtifacts({
    owner: context.repo.owner,
    repo: context.repo.repo,
    run_id: runId,
  });

  const artefacts = [];

  core.info(
    `Found ${response.data.artifacts.length} artifact(s) in workflow run ${runId}`
  );

  await fs.promises.mkdir(destination, { recursive: true });

  for (let i = 0; i < response.data.artifacts.length; i++) {
    const item = response.data.artifacts[i];

    const url = item.archive_download_url;
    const artifactPath = path.join(destination, `${item.name}.zip`);
    await downloadFile(fetch, url, artifactPath);

    core.info(`Fetched artifact: ${artifactPath}`);
    artefacts.push(artifactPath);
  }

  return artefacts.join("\n");
};
