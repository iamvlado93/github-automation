const btnDownload = document.querySelector(".download");

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

const getReport = async function () {
  const jsonURL = "https://api.github.com/users";
  const response = await fetch(jsonURL);
  const json = await response.json();

  const data = json.map((row) => ({
    login: row.login,
    html_url: row.html_url,
  }));
  const csvData = objectToCSV(data);
  download(csvData);
};

btnDownload.addEventListener("click", getReport);
