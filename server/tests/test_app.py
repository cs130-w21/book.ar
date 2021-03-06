import json

test_book1 = {
  'isbn': '059035342X',
  'title': "Harry Potter and the Sorcerer's Stone (Harry Potter (Paperback))",
  'author': 'J. K. Rowling',
  'year': 1999,
  'publisher': 'Arthur A. Levine Books'
}
test_book2 = {
  'isbn': '0385504209',
  'title': 'The Da Vinci Code',
  'author': 'Dan Brown',
}
test_book3 = {
  'title': 'To Kill a Mockingbird',
  'author': 'Harper Lee'
}

test_books = [test_book1, test_book2, test_book3]

user_preferred_book1 = {
  'isbn': '0449005615',
  'title': 'Seabiscuit: An American Legend',
  'author': 'LAURA HILLENBRAND',
  'year': 2002,
  'publisher': 'Ballantine Books',
}

user_preferred_book2 = {
  'isbn': '0375726403',
  'title': 'Empire Falls',
  'author': 'Richard Russo',
  'year': 2002,
  'publisher': 'Vintage Books USA',
}

user_preferred_book3 = {
  'isbn': '0786868716',
  'title': 'The Five People You Meet in Heaven',
  'author': 'Mitch Albom',
  'year': 2003,
  'publisher': 'Hyperion',
}  

user_preferred_books = [user_preferred_book1, user_preferred_book2, user_preferred_book3]

# Root test to make sure the flask server runs
def test_index(client) -> None:
  rv = client.get('/')
  assert rv.data == b'Hello World'

def test_no_input(client) -> None:
  rv = client.post('/recommend')
  assert rv.data == b'No request body, please populate with books and prefs'

def test_no_data(client) -> None:
  rv = client.post(
    '/recommend',
    data=json.dumps({}),
    content_type='application/json')
  assert rv.data == b'\"books\" property not in request body'

def test_no_pref(client) -> None:
  rv = client.post(
    '/recommend',
    data=json.dumps({'books': test_books}),
    content_type='application/json')
  assert rv.data == b'\"pref\" property not in request body'

def test_backend(client) -> None:
  rv = client.post(
    '/recommend',
    data=json.dumps({'books': test_books, 'prefs': user_preferred_books}),
    content_type='application/json')
  assert rv.data == b'{\"isbn\": \"059035342X\", \"title\": \"Harry Potter and the Sorcerer\'s Stone (Harry Potter (Paperback))\", \"author\": \"J. K. Rowling\", \"year\": 1999 }'