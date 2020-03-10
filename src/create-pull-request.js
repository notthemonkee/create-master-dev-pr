'use strict';

/**
 * A simple GitHub action that will create a pull request between the specified head and base branches.
 */
const core = require('@actions/core');
const github = require('@actions/github');

const _hasOpenPullRequests = (openPrs, head, base) => {
    const masterToDevPrs = openPrs.filter((pr) => pr.head.ref === head && pr.base.ref === base);
    return !!masterToDevPrs.length;
};

async function run() {
    try {
        const octokit = new github.GitHub(process.env.GITHUB_TOKEN);

        const context = github.context;

        const head = core.getInput('from', {required: true});
        const base = core.getInput('to', {required: true});
        const title = core.getInput('title', {required: true});
        const body = core.getInput('body', {required: true});

        const openPrs = await octokit.pulls.list({
            ...context.repo,
            state: 'open',
            head,
            base
        });

        if (!_hasOpenPullRequests(openPrs.data, head, base)) {
            const pullRequestResponse = await octokit.pulls.create({
                ...context.repo,
                head,
                base,
                title,
                body
            });

            const {
                data: {id: prId, url: prUrl}
            } = pullRequestResponse;
        } else {
            core.warning(`A pull request already exists from ${head} to ${base}. Pull request creation skipped.`);
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

module.exports = run;
