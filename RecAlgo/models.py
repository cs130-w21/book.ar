import pandas as pd
import numpy as np
import pickle
import torch.nn as nn

class BookRecommendation():
    def __init__(self, book_scores=None):
        self.book_scores = book_scores
        
    def compute_book_score(self, book, metric='numRatings'):
        book_scores = self.book_scores
        book_score = book_scores[book_scores['bookTitle'] == book[1]]
        numRatings = book_score['numRatings'].to_numpy()
        avgRatings = book_score['avgRating'].to_numpy()
        if metric == 'numRatings':
            return numRatings.sum()
        elif metric == 'avgRatings':
            return numRatings.dot(avgRatings) / numRatings.sum()    
    
    def make_recommendation(self, books):
        book, score = self._make_recommendation(books)
        print('Recommend book "{}" with score {} among {} books'.format(book, score, len(books)))
    
    def _make_recommendation(self, books):
        scores = []
        for book in books:
            scores += [self.compute_book_score(book)]
        max_idx = np.array(scores).argmax()
        return books[max_idx][1], scores[max_idx]

    
    def save_model(self, output_path='saved_model/', output_model_name='book_rec_model'):
        with open('{}{}.pth'.format(output_path, output_model_name), "wb") as fp:   #Pickling
            pickle.dump(self, fp)
            
    def load_model(self, input_path='saved_model/', input_model_name='book_rec_model'):
        with open('{}{}.pth'.format(input_path, input_model_name), "rb") as fp:   # Unpickling
            model = pickle.load(fp)
        self.book_scores = model.book_scores
