import axios from 'axios';

const objectToCSV = function (data) {
    const csvRows = [];

    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(","));

    for (const row of data) {
        const values = headers.map((header) => {
            const escaped = row[header].replace(/"/g, '\\"');
            return `"${escaped}"`;
        });
        csvRows.push(values.join(", "));
    }
    return csvRows.join("\n");
};

const download = function (data) {
    const blob = new Blob([data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const csv = document.createElement("a");
    csv.setAttribute("hidden", "");
    csv.setAttribute("href", url);
    csv.setAttribute("download", "download.csv");
    document.body.appendChild(csv);
    csv.click();
    document.body.removeChild(csv);
};

type API_URL = string

interface SearchPage<T> {
    total_count: number,
    incomplete_results: boolean,
    items: T[]
}

interface GitHubUser {
    login: string;
    id: number,
    node_id: string,
    avatar_url: API_URL,
    gravatar_id: '',
    url: API_URL,
    html_url: API_URL,
    followers_url: API_URL,
    following_url: API_URL,
    gists_url: API_URL,
    starred_url: API_URL,
    subscriptions_url: API_URL,
    organizations_url: API_URL,
    repos_url: API_URL,
    events_url: API_URL,
    received_events_url: API_URL,
    type: string,
    site_admin: false
}

const getReport = async function () {
    const jsonURL = "https://api.github.com/search/users?q=language%3AJava+location%3ABelarus&type=Users";
    try {
        const response = await axios.get<SearchPage<GitHubUser>>(jsonURL, {responseType: 'json'});
        const json: SearchPage<GitHubUser> = response.data;
        for (const user of json.items) {
            console.log(`Loading information for '${user.login}' by '${user.html_url}'`);
            const userDetails = await axios.get(`https://api.github.com/users/${user.login}`);
            console.log(userDetails);
            break;
        }

        return json;
    } catch (e) {
        console.log('Error: ', e);
    }

    return [];
};

getReport()
    .then(data => console.log(data))
