
import pandas as pd
from sqlalchemy import create_engine
import datetime as dt

connection_string = "postgres:postgres@localhost:5432/climate_db"
engine = create_engine(f'postgresql://{connection_string}')

#Confirm tables
print(engine.table_names())

#convert csv to data frame 
# combined_df = pd.read_csv("/../../Input/final.csv")
combined_df = pd.read_csv("../../Input/final.csv")

combined_df.to_sql(name='combined', con=engine, if_exists='append', index=False)


