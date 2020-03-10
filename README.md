# GitHub Action - Pull Request API
This GitHub Action (written in JavaScript) wraps the [GitHub Pull Requests API](https://developer.github.com/v3/pulls/), specifically the [Create a Pull Request](https://developer.github.com/v3/pulls/#create-a-pull-request) endpoint, to allow you to leverage GitHub Actions to create pull requests.


## Usage
### Pre-requisites
Create a workflow `.yml` file in your `.github/workflows` directory. An [example workflow](#example-workflow---create-a-release) is available below. For more information, reference the GitHub Help Documentation for [Creating a workflow file](https://help.github.com/en/articles/configuring-a-workflow#creating-a-workflow-file).

### Inputs
For more information on these inputs, see the [API Documentation](https://developer.github.com/v3/pulls/#create-a-pull-request)

- `from`: The name of the source branch to merge from
- `to`: The name of the destination branch to merge to
- `title`: The pull request title
- `body`: The pull request body


### Outputs
For more information on these outputs, see the [API Documentation](https://developer.github.com/v3/repos/releases/#response-4) for an example of what these outputs look like

- `id`: The pull request ID
- `url`: The URL users can navigate to in order to view the pull request


### Example workflow - create a pull request when a release is created
On every published `release`, create a pull request from dev to master:

```yaml
name: On Release Published
on:
  release:
    types: [published]
jobs:
  build:
    name: Create Pull Request
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Project
        uses: actions/checkout@v2
      - name: Create PR
        id: create_pr
        uses: ./.github/actions/create-pull-request
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # This token is provided by Actions, you do not need to create your own token
        with:
          from: 'master'
          to: 'dev'
          title: 'Merge Master to Dev Post-release'
          body: 'This is an auto-generated pull request created by the GitHub action "create-pull-request", which is contained in the .github folder of this project.'

```

This will create a new pull request This uses the `GITHUB_TOKEN` provided by the [virtual environment](https://help.github.com/en/github/automating-your-workflow-with-github-actions/virtual-environments-for-github-actions#github_token-secret), so no new token is needed.

## Making Changes to the Code

Install the dependencies  
```bash
$ npm install
```

## Change action.yml

The action.yml contains defines the inputs and output for your action.

Update the action.yml with your name, description, inputs and outputs for your action.

See the [documentation](https://help.github.com/en/articles/metadata-syntax-for-github-actions)

## Change the Code

Most toolkit and CI/CD operations involve async operations so the action is run in an async function.

```javascript
const core = require('@actions/core');
...

async function run() {
  try { 
      ...
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
```

See the [toolkit documentation](https://github.com/actions/toolkit/blob/master/README.md#packages) for the various packages.

## Package for distribution

GitHub Actions will run the entry point from the action.yml. Packaging assembles the code into one file that can be checked in to Git, enabling fast and reliable execution and preventing the need to check in node_modules.

Actions are run from GitHub repos.  Packaging the action will create a packaged action in the dist folder.

Run package

```bash
npm run package
```

Since the packaged index.js is run from the dist folder.

```bash
git add dist
```
