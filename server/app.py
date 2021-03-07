import json
from flask import Flask, request
from models import TFIDFBookRec
from utils import Book

def create_app():
  '''
  A wrapper function to create our flask app

  / = [GET]
  The root api. A simple test to ensure the server is running.

  /recommend = [GET, POST]
  The recommendation api.

  The request body must be an JSON object with a books and prefs property.

  Example:
  {
    "books": [
      {
        'isbn': '059035342X',
        'title': "Harry Potter and the Sorcerer's Stone (Harry Potter (Paperback))",
        'author': 'J. K. Rowling',
        'year': 1999,
        'publisher': 'Arthur A. Levine Books'
      }
    ],
    "prefs": [
      {
        'isbn': '0449005615',
        'title': 'Seabiscuit: An American Legend',
        'author': 'LAURA HILLENBRAND',
        'year': 2002,
        'publisher': 'Ballantine Books',
      }
    ]
    }
  '''
  app=Flask(__name__)

  @app.route('/', methods=['GET'])
  def hello_world():
    '''
    The root api. A simple test to ensure the server is running.
    '''
    return 'Hello World'

  # POST routes still require GET to be enabled for requests to work
  @app.route('/recommend', methods=['GET', 'POST'])
  def make_recommendation():
    '''
    The recommendation api.

    The request body must be an JSON object with a books and prefs property.

    Example:
    {
      "books": [
        {
          'isbn': '059035342X',
          'title': "Harry Potter and the Sorcerer's Stone (Harry Potter (Paperback))",
          'author': 'J. K. Rowling',
          'year': 1999,
          'publisher': 'Arthur A. Levine Books'
        }
      ],
      "prefs": [
        {
          'isbn': '0449005615',
          'title': 'Seabiscuit: An American Legend',
          'author': 'LAURA HILLENBRAND',
          'year': 2002,
          'publisher': 'Ballantine Books',
        }
      ]
    }
    '''
    request_json = request.get_json()
    if not request_json:
      return f'No request body, please populate with books and prefs', 400
    if 'books' not in request_json:
      return f'\"books\" property not in request body', 400
    if 'prefs' not in request_json:
      return f'\"pref\" property not in request body', 400
    books_json = request_json['books']
    prefs_json = request_json['prefs']
    books = list(map(lambda book: Book(book.get('isbn'),
                                        book.get('title'),
                                        book.get('author'),
                                        book.get('year'),
                                        book.get('publisher')),
                      books_json))
    prefs = list(map(lambda book: Book(book.get('isbn'),
                                        book.get('title'),
                                        book.get('author'),
                                        book.get('year'),
                                        book.get('publisher')),
                      prefs_json))

    model = TFIDFBookRec(threshold=0.2)
    model.load_model('saved_models/', 'tfidf_model')
    model.set_user_preference(prefs)
    recs = model.make_recommendation(books, verbose=True)
    return json.dumps(list(map(lambda book: book.__dict__, recs))), 200

  return app

if __name__ == "__main__":
  app = create_app()
  app.run(host='0.0.0.0')
