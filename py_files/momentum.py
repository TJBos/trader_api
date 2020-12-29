#below code is partially adopted from Nick Mccullum tutorial on algorithmic trading

import numpy as np 
import pandas as pd 
import requests
#import xlswriter
import math
from scipy import stats
from IPython.display import display

#Settings to view entire dataframe
#pd.set_option('display.max_columns', None)
#pd.set_option('display.max_rows', None) 

#saved a CSV file with all tickers from SP500 to load in
stocks = pd.read_csv('./py_files/sp_500_stocks.csv')

#make chunks of 100 so that we can make batch API calls
def chunks(series, n):
    for i in range(0, len(series), n):
        yield series[i:i + n]   
        
ticker_groups = list(chunks(stocks['Ticker'], 100))
ticker_strings = []
for i in range(0, len(ticker_groups)):
    ticker_strings.append(','.join(ticker_groups[i]))

#free sandbox testing token -- not real results!
API_TOKEN = "Tpk_a26bd448ca294eebb8499ceb5df09dbc"


#api_url = f'https://sandbox.iexapis.com/stable/stock/{symbol}/quote?token={api_token}'

columns = [
            'Ticker', 
            'Price', 
            'Number of Shares to Buy', 
            'One-Year Price Return', 
            'One-Year Return Percentile',
            'Six-Month Price Return',
            'Six-Month Return Percentile',
            'Three-Month Price Return',
            'Three-Month Return Percentile',
            'One-Month Price Return',
            'One-Month Return Percentile',
            'Momentum Score'
        ]

dataframe = pd.DataFrame(columns = columns)

#make batch API call and populate DF with API data
for tickers in ticker_strings:
    batch_api_call_url = f'https://sandbox.iexapis.com/stable/stock/market/batch/?types=stats,quote&symbols={tickers}&token={API_TOKEN}'
    data = requests.get(batch_api_call_url).json()
    for ticker in tickers.split(','):
        dataframe = dataframe.append(
                                        pd.Series([ticker, 
                                                   data[ticker]['quote']['latestPrice'],
                                                   'N/A',
                                                   data[ticker]['stats']['year1ChangePercent'],
                                                   'N/A',
                                                   data[ticker]['stats']['month6ChangePercent'],
                                                   'N/A',
                                                   data[ticker]['stats']['month3ChangePercent'],
                                                   'N/A',
                                                   data[ticker]['stats']['month1ChangePercent'],
                                                   'N/A',
                                                   'N/A'
                                                   ], 
                                                  index = columns), 
                                        ignore_index = True)
        
      

#Calculate the percentiles using stats method percentileofscore
time_periods = [
                'One-Year',
                'Six-Month',
                'Three-Month',
                'One-Month'
                ]

for row in dataframe.index:
    for time_period in time_periods:
      #  if dataframe.loc[row, f'{time_period} Price Return'] != None and dataframe[f'{time_period} Price Return'] != None:
            dataframe.loc[row, f'{time_period} Return Percentile'] = stats.percentileofscore(dataframe[f'{time_period} Price Return'], dataframe.loc[row, f'{time_period} Price Return'])/100

#for time_period in time_periods:
  #  print(dataframe[f'{time_period} Return Percentile'])

pd.set_option('display.max_columns', None)
#display(dataframe)

#calculate the final score by averaging the percentiles
from statistics import mean

for row in dataframe.index:
    momentum_percentiles = []
    for time_period in time_periods:
        momentum_percentiles.append(dataframe.loc[row, f'{time_period} Return Percentile'])
    dataframe.loc[row, 'Momentum Score'] = mean(momentum_percentiles)

#sort by best scores and slice the first 20 off
dataframe.sort_values(by = 'Momentum Score', ascending = False, inplace= True)
dataframe = dataframe[:21]
dataframe.reset_index(drop = True, inplace = True)
#change to json
json = dataframe.to_json()
print(json)











