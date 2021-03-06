from flask import Flask, request
from models import TFIDFBookRec
from utils import Book


def create_app():
  app=Flask(__name__)

  @app.route('/', methods=['GET'])
  def hello_world():
    return 'Hello World'

  # POST routes still require GET to be enabled for requests to work
  @app.route('/recommend', methods=['GET', 'POST'])
  def make_recommendation():
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

    model = TFIDFBookRec()
    model.load_model('saved_models/', 'tfidf_model')
    model.set_user_preference(prefs)
    return model.make_recommendation(books, verbose=True).__dict__, 200

  return app

if __name__ == "__main__":
  app = create_app()
  app.run(host='0.0.0.0')
