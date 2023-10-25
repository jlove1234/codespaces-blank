# Use an official R base image
FROM rocker/r-ver:4.1.1

# Install any R packages you need
RUN R -e "install.packages(c('tidyverse', 'ggplot2', 'dplyr', 'shiny'), dependencies=TRUE)"
