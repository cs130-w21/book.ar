import json
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
    if request_json and 'books' in request_json and 'prefs' in request_json:
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
    else:
      return f'Invalid request body {request_json}', 400

  return app

if __name__ == "__main__":
  app = create_app()
  app.run(debug=True, host='192.168.0.1')
