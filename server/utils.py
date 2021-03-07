# -*- coding: utf-8 -*-
import pandas as pd

def data_preprocessing(books, ratings):
    # change column names
    books = books.drop(['Image-URL-S', 'Image-URL-M'], axis=1)
    books.columns = ['ISBN', 'title', 'author', 'year', 'publisher', 'imageUrl']
    
    # change incorrect data points
    books.loc[books.year == 'DK Publishing Inc',:]
    books.loc[books.ISBN == '0789466953','year'] = 2000
    books.loc[books.ISBN == '0789466953','author'] = "James Buckley"
    books.loc[books.ISBN == '0789466953','publisher'] = "DK Publishing Inc"
    books.loc[books.ISBN == '0789466953','title'] = "DK Readers: Creating the X-Men, How Comic Books Come to Life (Level 4: Proficient Readers)"
    books.loc[books.ISBN == '078946697X','year'] = 2000
    books.loc[books.ISBN == '078946697X','author'] = "Michael Teitelbaum"
    books.loc[books.ISBN == '078946697X','publisher'] = "DK Publishing Inc"
    books.loc[books.ISBN == '078946697X','title'] = "DK Readers: Creating the X-Men, How It All Began (Level 4: Proficient Readers)"
    books.loc[books.ISBN == '2070426769','year'] = 2003
    books.loc[books.ISBN == '2070426769','author'] = "Jean-Marie Gustave Le ClÃ?Â©zio"
    books.loc[books.ISBN == '2070426769','publisher'] = "Gallimard"
    books.loc[books.ISBN == '2070426769','title'] = "Peuple du ciel, suivi de 'Les Bergers"
    
    # change column data type
    books.year=pd.to_numeric(books.year, errors='coerce')
    
    ratings.columns = ['userID', 'ISBN', 'bookRating']
    valid_ratings = ratings[ratings.bookRating != 0]
    
    return books, valid_ratings


class Book:
    def __init__(self, ISBN=None, title=None, author=None, year=None, publisher=None, imageUrl=None):
        '''
        The book class assumes five piece of information. Missing some of them is OK, but can't have
        ISBN and book title both missing.
        '''
        if not ISBN and not title:
            raise ValueError("Can't have ISBN and book title both be None")
            
        self.ISBN = ISBN
        self.title = title
        self.author = author
        self.year = year
        self.publisher = publisher
        self.imageUrl = imageUrl
    
    def __repr__(self):
        return 'Book(\nISBN: {0}\nTitle: {1}\nAuthor: {2}\nYear: {3}\nPublisher: {4}\nImageUrl: {5}\n)'.format(self.ISBN, self.title, self.author, self.year, self.publisher, self.imageUrl)


