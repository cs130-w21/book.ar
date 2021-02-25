from models import BookRecommendation

def make_recommendation(request):
  request_json = request.get_json()
  if request_json and 'books' in request_json:
    books = request_json['books']
    model = BookRecommendation()
    model.load_model('saved_models/', 'book_rec_model')
    return model.make_recommendation(books)
  else:
    return f'Invalid request body {request_json}'