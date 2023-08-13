const fs = require("fs");
const path = require("path");

const downloadFileEx = async (github, url, path) => {
  console.log(`Fetching artifact from: ${url}`);
  const res = await github.request(url);
  if (res.status != 200) {
    throw new Error(`could not get artifact from ${url}: ${res.data}`);
  }
  console.log(`Found artifact with length: ${res.data.byteLength}`);
  await fs.promises.writeFile(path, Buffer.from(res.data));
};

module.exports = async ({ core, github, context, runId, destination }) => {
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
    await downloadFileEx(github, url, artifactPath);

    core.info(`Fetched artifact: ${artifactPath}`);
    artefacts.push(artifactPath);
  }

  return artefacts.join("\n");
};
