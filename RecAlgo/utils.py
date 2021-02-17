# -*- coding: utf-8 -*-
import torch
import pandas as pd

def data_preprocessing(books, ratings):
    # change column names
    books.columns = ['ISBN', 'bookTitle', 'bookAuthor', 'yearOfPublication', 'publisher', 'imageUrlS', 'imageUrlM', 'imageUrlL']

    # change incorrect data points
    books.loc[books.yearOfPublication == 'DK Publishing Inc',:]
    books.loc[books.ISBN == '0789466953','yearOfPublication'] = 2000
    books.loc[books.ISBN == '0789466953','bookAuthor'] = "James Buckley"
    books.loc[books.ISBN == '0789466953','publisher'] = "DK Publishing Inc"
    books.loc[books.ISBN == '0789466953','bookTitle'] = "DK Readers: Creating the X-Men, How Comic Books Come to Life (Level 4: Proficient Readers)"
    books.loc[books.ISBN == '078946697X','yearOfPublication'] = 2000
    books.loc[books.ISBN == '078946697X','bookAuthor'] = "Michael Teitelbaum"
    books.loc[books.ISBN == '078946697X','publisher'] = "DK Publishing Inc"
    books.loc[books.ISBN == '078946697X','bookTitle'] = "DK Readers: Creating the X-Men, How It All Began (Level 4: Proficient Readers)"
    books.loc[books.ISBN == '2070426769','yearOfPublication'] = 2003
    books.loc[books.ISBN == '2070426769','bookAuthor'] = "Jean-Marie Gustave Le ClÃ?Â©zio"
    books.loc[books.ISBN == '2070426769','publisher'] = "Gallimard"
    books.loc[books.ISBN == '2070426769','bookTitle'] = "Peuple du ciel, suivi de 'Les Bergers"
    
    # change column data type
    books.yearOfPublication=pd.to_numeric(books.yearOfPublication, errors='coerce')
    
    ratings.columns = ['userID', 'ISBN', 'bookRating']
    valid_ratings = ratings[ratings.bookRating != 0]
    
    return books, valid_ratings


