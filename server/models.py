import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pickle

class BookRecInterface:
    def make_recommendation(self, books):
        pass
    
    def save_model(self, output_path='saved_model/', output_model_name='book_rec_model'):
        with open('{}{}.pth'.format(output_path, output_model_name), "wb") as fp:   #Pickling
            pickle.dump(self, fp)
            
    def load_model(self, input_path='saved_model/', input_model_name='book_rec_model'):
        with open('{}{}.pth'.format(input_path, input_model_name), "rb") as fp:   # Unpickling
            model = pickle.load(fp)
        self.book_ratings = model.book_ratings



class PopularityBookRec(BookRecInterface):
    def __init__(self, book_ratings=None):
        self.book_ratings = book_ratings
    
    def train_ratings(self, books, ratings):
        ratings_avg = pd.DataFrame(ratings.groupby(['ISBN'])['bookRating'].mean()).rename(columns={'bookRating':'avgRating'})
        ratings_count = pd.DataFrame(ratings.groupby(['ISBN'])['bookRating'].count()).rename(columns={'bookRating':'numRatings'})
        merged_ratings = ratings_count.merge(ratings_avg, left_index = True, right_on = 'ISBN')
        clipped_ratings = merged_ratings.clip(0, 100)
        normalized_ratings = clipped_ratings / clipped_ratings.max()

        self.book_ratings = normalized_ratings.merge(books[['ISBN', 'title']], left_index = True, right_on = 'ISBN')
        
    def compute_book_score(self, book, metric='numRatings'):
        book_scores = self.book_ratings
        if book.ISBN:
            book_score = book_scores[book_scores['ISBN'] == book.ISBN]
        elif book.title:
            book_score = book_scores[book_scores['title'] == book.title]
        else:
            raise ValueError("Can't have ISBN and book title both be None")

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
        return books[max_idx].title, scores[max_idx]



class TFIDFBookRec(BookRecInterface):
    def __init__(self, threshold=0.01):
        self.score_weights = np.array([0.5, 0.4, 0.1, 0.0])
        self.tfidf = TfidfVectorizer(analyzer='word', ngram_range=(1, 2), min_df=1, stop_words='english')
        self.pref_tfidf = None
        self.pref_authors = None
        self.pref_publishers = None
        self.pref_years = None
        self.book_ratings = None
        self.threshold = threshold
    
    def train_ratings(self, books, ratings):
        ratings_avg = pd.DataFrame(ratings.groupby(['ISBN'])['bookRating'].mean()).rename(columns={'bookRating':'avgRating'})
        ratings_count = pd.DataFrame(ratings.groupby(['ISBN'])['bookRating'].count()).rename(columns={'bookRating':'numRatings'})
        merged_ratings = ratings_count.merge(ratings_avg, left_index = True, right_on = 'ISBN')
        clipped_ratings = merged_ratings.clip(0, 100)
        normalized_ratings = clipped_ratings / clipped_ratings.max()

        self.book_ratings = normalized_ratings.merge(books[['ISBN', 'title']], left_index = True, right_on = 'ISBN')
        
    def train_tfidf(self, train_df, return_tfidf_matrix=False):
        title_corpus = train_df['title']
        if return_tfidf_matrix:
            return self.tfidf.fit_transform(title_corpus)
        else:
            self.tfidf.fit(title_corpus)
      
    def _get_corpus(self, books):
        return [b.title for b in books]

    def fit_new_corpus(self, new_corpus):
        return self.tfidf.transform(new_corpus)
        
    def set_user_preference(self, preferred_books):
        pref_corpus = self._get_corpus(preferred_books)
        self.pref_tfidf = self.fit_new_corpus(pref_corpus)
        
        self.pref_authors = [b.author for b in preferred_books]
        self.pref_publishers = [b.publisher for b in preferred_books]
        self.pref_years = [b.year for b in preferred_books]
        
    def look_up_book(self, book):
        if book.ISBN:
            index = self.book_ratings[self.book_ratings['ISBN'] == book.ISBN].index
            if len(index) > 0:
                return index
        if book.title:
            index = self.book_ratings[self.book_ratings['title'] == book.title].index
            if len(index) > 0:
                return index
        return None
        
    def compute_book_score(self, book):
        score = self._compute_book_score(book)
        index = self.look_up_book(book)
        if index is None:
            return score.round(4)
        else:
            # Also include rating information
            numRatings = self.book_ratings.loc[index]['numRatings'].to_numpy().mean()
            avgRating = self.book_ratings.loc[index]['avgRating'].to_numpy().mean()
            total_score = score * 0.9 + numRatings * 0.05 + avgRating * 0.05
            return total_score.round(4)
            
    def _compute_book_score(self, new_book):
        '''
        compute book score based on user preference
        '''
        new_corpus = self._get_corpus([new_book])
        new_tfidf = self.fit_new_corpus(new_corpus)
        tfidf_score = cosine_similarity(new_tfidf, self.pref_tfidf).reshape(1, -1)
        author_score = np.array([new_book.author == author if author is not None else False for author in self.pref_authors]).reshape(1, -1)
        publisher_score = np.array([new_book.publisher == publisher if publisher is not None else False for publisher in self.pref_publishers]).reshape(1, -1)
        year_score = np.array([abs(new_book.year - year) < 3 if new_book.year is not None and year is not None else False for year in self.pref_years]).reshape(1, -1)
        score_matrix = np.concatenate([tfidf_score, author_score, publisher_score, year_score]).astype(float)
        return self.score_weights.dot(score_matrix).max()

    def make_recommendation(self, books, verbose=True):
        books = self._make_recommendation(books, verbose)
        return books
    
    def _make_recommendation(self, books, verbose):
        scores = []
        for book in books:
            scores += [self.compute_book_score(book)]
        rec_books = []
        for i in range(0, len(books)):
            if verbose:
                print(f"Book \"{books[i].title}\": {scores[i]}")
            if scores[i] > self.threshold:
                rec_books.append(books[i])

        return rec_books
    
    def load_model(self, input_path='saved_model/', input_model_name='book_rec_model'):
        with open('{}{}.pth'.format(input_path, input_model_name), "rb") as fp:   # Unpickling
            model = pickle.load(fp)
        self.score_weights = model.score_weights
        self.tfidf = model.tfidf
        self.pref_tfidf = model.pref_tfidf
        self.pref_authors = model.pref_authors
        self.pref_publishers = model.pref_publishers
        self.pref_years = model.pref_years
        self.book_ratings = model.book_ratings



