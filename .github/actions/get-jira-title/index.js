javascript
const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');

async function run() {
  try {
    const jiraTicket = core.getInput('jira_ticket');
    const jiraBaseUrl = core.getInput('jira_base_url');
    const jiraApiToken = core.getInput('jira_api_token');
    const jiraEmail = core.getInput('jira_email');

    const url = `${jiraBaseUrl}/rest/api/2/issue/${jiraTicket}`;
    const auth = {
      username: jiraEmail,
      password: jiraApiToken
    };

    const response = await axios.get(url, { auth });

    if (response.status !== 200) {
      throw new Error(`Failed to fetch JIRA ticket: ${response.status}, ${response.statusText}`);
    }

    const data = response.data;
    const jiraTitle = data.fields.summary;

    core.setOutput('jira_title', jiraTitle);
  } catch (error) {
    core.setFailed(`Action failed with error: ${error.message}`);
  }
}

run();