import pandas as pd
import numpy as np
from models import PopularityBookRec, TFIDFBookRec
from utils import data_preprocessing

books = pd.read_csv('./dataset/BX-Books.csv', sep=';', error_bad_lines=False, warn_bad_lines=False, low_memory=False, encoding="latin-1")
ratings = pd.read_csv('./dataset/BX-Book-Ratings.csv', sep=';', error_bad_lines=False, warn_bad_lines=False, low_memory=False, encoding="latin-1")

books, ratings = data_preprocessing(books, ratings)

model = TFIDFBookRec()
model.train_tfidf(books)
model.train_ratings(books, ratings)

output_path = './saved_models/'
output_model_name = 'tfidf_model'
model.save_model(output_path, output_model_name)




# Popularity-based model
model = PopularityBookRec()
model.train_ratings(books, ratings)
output_path = './saved_models/'
output_model_name = 'popularity_model'
model.save_model(output_path, output_model_name)


