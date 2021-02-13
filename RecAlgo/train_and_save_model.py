import pandas as pd
import numpy as np
from models import BookRecommendation
from utils import *

books = pd.read_csv('./dataset/BX-Books.csv', sep=';', error_bad_lines=False, warn_bad_lines=False, low_memory=False, encoding="latin-1")
ratings = pd.read_csv('./dataset/BX-Book-Ratings.csv', sep=';', error_bad_lines=False, warn_bad_lines=False, low_memory=False, encoding="latin-1")

books, ratings = data_preprocessing(books, ratings)

ratings_avg = pd.DataFrame(ratings.groupby(['ISBN'])['bookRating'].mean()).rename(columns={'bookRating':'avgRating'})
ratings_count = pd.DataFrame(ratings.groupby(['ISBN'])['bookRating'].count()).rename(columns={'bookRating':'numRatings'})
book_scores = ratings_count.merge(ratings_avg, left_index = True, right_on = 'ISBN')
book_scores = book_scores.merge(books, left_index = True, right_on = 'ISBN')

model = BookRecommendation(book_scores)

output_path = './saved_models/'
output_model_name = 'book_rec_model'
model.save_model(output_path, output_model_name)

