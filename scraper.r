library(rvest)
library(tidyr)

# Read the HTML content of the website
webpage <- read_html("https://electionresults.sos.mn.gov/Results/Index?ersElectionId=156&scenario=ResultsByPrecinctCrosstab&OfficeInElectionId=33119&QuestionId=0")

# Select the table using CSS selector
table_node <- html_nodes(webpage, "table")

# Extract the table content
table_content <- html_table(table_node)[[3]]

# Split the first column into "County" and "Precinct"
table_real <- separate(table_content, 1, into = c("County", "Precinct"), sep = ": ")

# Specify the path to save the CSV within your Codespace
csv_file_path <- "//workspaces/codespaces-blank/ElectionResults.csv"

# Export your data to CSV
write.csv(table_real, csv_file_path)

