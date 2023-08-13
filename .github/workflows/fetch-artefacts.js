const fs = require("fs");

const downloadFile = async (fetch, url, path) => {
  const res = await fetch(url);
  const fileStream = fs.createWriteStream(path);
  await new Promise((resolve, reject) => {
    res.body.pipe(fileStream);
    res.body.on("error", reject);
    fileStream.on("finish", resolve);
  });
};

module.exports = async ({ core, github, context, fetch, runId }) => {
  const response = await github.rest.actions.listWorkflowRunArtifacts({
    owner: context.repo.owner,
    repo: context.repo.repo,
    run_id: runId,
  });

  const artefacts = [];

  core.info(
    `Found ${response.data.artifacts.length} artifact(s) in workflow run ${runId}`
  );

  for (let i = 0; i < response.data.artifacts.length; i++) {
    const item = response.data.artifacts[i];

    const url = item.archive_download_url;
    const path = `${item.name}.zip`;
    await downloadFile(fetch, url, path);

    core.info(`Fetched artifact: ${path}`);
    artefacts.push(path);
  }

  return artefacts.join("\n");
};
