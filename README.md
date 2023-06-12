# Stage gates demo

## Example 1 - Preprod and Prod stage gates
This is a simple example where you want to delay deploying to preprod and prod by way of approval from a configured set of individuals or teams. Checkout the pipeline at [![Stage-gates-main](https://github.com/redging-very-well/stage-gates-demo/actions/workflows/main-example1.yaml/badge.svg)](https://github.com/redging-very-well/stage-gates-demo/actions/workflows/main-example1.yaml).

## Example 2 - Releases with manual preprod and prod triggers
This example works by creating a GitHub release when a release stage has been approved (via the pipeline [![Stage-gates-eg2](https://github.com/redging-very-well/stage-gates-demo/actions/workflows/main-example2.yaml/badge.svg)](https://github.com/redging-very-well/stage-gates-demo/actions/workflows/main-example2.yaml)).

When the release is generated, it also gets a tag associated with it. This tag can be used as an input to the [![Deploy a Tag](https://github.com/redging-very-well/stage-gates-demo/actions/workflows/deploy-from-release.yaml/badge.svg)](https://github.com/redging-very-well/stage-gates-demo/actions/workflows/deploy-from-release.yaml) pipeline to deploy a specific release to preprod and prod.

## Configuration
Configuring environments is done via Settings in your repo (note that the Environments tab is not available for private repos unless you are part of an organisation).


![Environments summary](docs/environments-summary.jpg)

Configure each environment by setting required reviewers for each one that you want to restrict access to:
![Environments preprod configuraiton](docs/environments-preprod.jpg)
