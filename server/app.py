from flask import Flask, request
from models import BookRecommendation

def create_app():
  app=Flask(__name__)

  @app.route('/', methods=['GET'])
  def hello_world():
    return 'Hello World'

  # POST routes still require GET to be enabled for requests to work
  @app.route('/recommend', methods=['GET', 'POST'])
  def make_recommendation():
    request_json = request.get_json()
    if request_json and 'books' in request_json:
      books = request_json['books']
      model = BookRecommendation()
      model.load_model('saved_models/', 'book_rec_model')
      book, score = model.make_recommendation(books)
      return book, 200
    else:
      return f'Invalid request body {request_json}'
  
  return app

if __name__ == "__main__":
  app = create_app()
  app.run(host='0.0.0.0')
