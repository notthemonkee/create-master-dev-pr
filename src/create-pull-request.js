'use strict';

/**
 * A simple GitHub action that will create a pull request between the specified head and base branches.
 */
const core = require('@actions/core');
const github = require('@actions/github');

const _hasOpenMasterToDevPrs = (openPrs) => {
    const masterToDevPrs = openPrs.filter((pr) => pr.head.ref === 'master' && pr.base.ref === 'dev');
    return !!masterToDevPrs.length;
};

async function run() {
    try {
        // Get authenticated GitHub client (Ocktokit): https://github.com/actions/toolkit/tree/master/packages/github#usage
        const octokit = new github.GitHub(process.env.GITHUB_TOKEN);

        const context = github.context;

        // Get the inputs from the workflow file: https://github.com/actions/toolkit/tree/master/packages/core#inputsoutputs
        const head = core.getInput('from', { required: true });
        const base = core.getInput('to', { required: true });
        const title = core.getInput('title', { required: true });
        const body = core.getInput('body', { required: true });

        const openPrs = await octokit.pulls.list({
            ...context.repo,
            state: 'open',
            head,
            base
        });

        // Cannot create a new master to dev pull request if one already exists.
        if (!_hasOpenMasterToDevPrs(openPrs.data)) {
            // Call the GitHub API to create the pull request.
            // API Documentation: https://developer.github.com/v3/pulls/#create-a-pull-request
            // Octokit Documentation: https://octokit.github.io/rest.js/#octokit-routes-pulls-create
            const pullRequestResponse = await octokit.pulls.create({
                ...context.repo,
                head,
                base,
                title,
                body
            });

            const {
                data: { id: prId, url: prUrl }
            } = pullRequestResponse;
        } else {
            core.warning(`A pull request already exists from ${head} to ${base}. Pull request creation skipped.`);
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

module.exports = run;
