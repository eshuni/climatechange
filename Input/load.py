
import pandas as pd
from sqlalchemy import create_engine
import datetime as dt

connection_string = "postgres:postgres@localhost:5432/climate"
engine = create_engine(f'postgresql://{connection_string}')

#Confirm tables
print(engine.table_names())



combined = "./Ipout/final.csv"


#convert csv to data frame 
combined_df = pd.read_csv(combined)

combined_df.to_sql(name='combined', con=engine, if_exists='append', index=False)


