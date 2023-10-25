const cheerio = require('cheerio');
const request = require('request');
const fs = require('fs');

const url = 'https://electionresults.sos.mn.gov/Results/Index?ersElectionId=156&scenario=ResultsByPrecinctCrosstab&OfficeInElectionId=33119&QuestionId=0';

const removeStLouisPrefix = (text) => {
  return text.replace('St. Louis: ', '');
};

const scrapeElectionResults = (url) => {
  request(url, (error, response, html) => {
    if (!error && response.statusCode === 200) {
      const $ = cheerio.load(html);
      const table = $('table.table-striped.w-a');
      const data = [];
      const headers = ['County: Precinct'];

      table.find('th.resultcrossname').each((i, header) => {
        headers.push('NP ' + removeStLouisPrefix($(header).text().trim()));
      });

      table.find('tr.resultcrosscandidate').each((i, row) => {
        const columns = $(row).find('td');
        const rowData = {
          'County: Precinct': removeStLouisPrefix(columns.eq(0).text()),
        };

        headers.slice(1).forEach((header, index) => {
          rowData[header] = parseInt(columns.eq(index + 1).text(), 10);
        });

        data.push(rowData);
      });

      const csvData = data.map((row) => {
        const totalVotes = Object.values(row).reduce((total, votes) => total + (votes || 0), 0);
        const percentages = { 'County: Precinct': row['County: Precinct'] };

        headers.slice(1).forEach((header) => {
          percentages[header] = ((row[header] / totalVotes) * 100).toFixed(2) + '%';
        });

        return percentages;
      });

      const formattedCsvData = csvData.map((row) => headers.map((header) => row[header]));
      const csvContent = formattedCsvData.map((row) => row.join(',')).join('\n');
      fs.writeFileSync('election_results.csv', csvContent);
      console.log('Data has been scraped and saved to election_results.csv');
    } else {
      console.error('Failed to retrieve the webpage.');
    }
  });
};

scrapeElectionResults(url);
