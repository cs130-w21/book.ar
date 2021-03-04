#!/usr/bin/env python3
# coding: utf-8

# In[1]:


from models import TFIDFBookRec
from utils import Book
import pandas as pd
import numpy as np


# In[2]:


'''
test_book: a Book instance, contains six attributes: [ISBN, title, author, year, publisher, imageUrl].
        Missing some attributes is fine, but ISBN and title can't both be None
'''
test_book1 = ['059035342X',
             "Harry Potter and the Sorcerer's Stone (Harry Potter (Paperback))",
             'J. K. Rowling',
             1999,
             'Arthur A. Levine Books',
             'http://images.amazon.com/images/P/059035342X.01.LZZZZZZZ.jpg']
test_book2 = ['0385504209',
             'The Da Vinci Code',
             'Dan Brown',
             None,
             'Doubleday']
test_book3 = [None,
             'To Kill a Mockingbird',
             'Harper Lee']

test_books = [Book(*test_book1), Book(*test_book2), Book(*test_book3)]


# In[3]:


'''
user_preferred_book: a Book instance chosen by user, will be used to set up user preference for the model
'''

user_preferred_book1 = ['0449005615',
                        'Seabiscuit: An American Legend',
                        'LAURA HILLENBRAND',
                        2002,
                        'Ballantine Books',
                        'http://images.amazon.com/images/P/0449005615.01.LZZZZZZZ.jpg']

user_preferred_book2 = ['0375726403',
                         'Empire Falls',
                         'Richard Russo',
                         2002,
                         'Vintage Books USA',
                         'http://images.amazon.com/images/P/0375726403.01.LZZZZZZZ.jpg']
user_preferred_book3 = ['0786868716',
                         'The Five People You Meet in Heaven',
                         'Mitch Albom',
                         2003,
                         'Hyperion',
                         'http://images.amazon.com/images/P/0786868716.01.LZZZZZZZ.jpg']

user_preferred_books = [Book(*user_preferred_book1), Book(*user_preferred_book2), Book(*user_preferred_book3)]


# In[4]:


# Counter-example, missing both ISBN and title
# test_book4 = [None,
#              None,
#              'Harper Lee',
#              1988,
#              'Doubleday']
# Book(*test_book4)


# In[5]:


# We have image url in the dataset as well, maybe useful
# ImageUrl example
# import IPython
# IPython.display.Image(test_books[0].imageUrl, width = 250)


# In[6]:


# 1. create a model instance and load the trained state
input_model_name='tfidf_model'
input_model_path='saved_models/'
model = TFIDFBookRec()
model.load_model(input_model_path, input_model_name)


# In[7]:


# 2. set the user preference with a list of Book instances picked by the user
model.set_user_preference(user_preferred_books)


# In[8]:


# 3. pass in a list of Book instances for recommendation
book = model.make_recommendation(test_books, verbose=True) # set verbose=False to set off the print


# In[9]:


book


# In[ ]:




