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

test_books = [test_book1, test_book2, test_book3]

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

user_preferred_books = [user_preferred_book1, user_preferred_book2, user_preferred_book3]

# Root test to make sure the flask server runs
def test_index(client) -> None:
  rv = client.get('/')
  assert rv.data == b'Hello World'

def test_no_input(client) -> None:
  rv = client.post('/recommend')
  assert rv.data = b'No request body, please populate with books and prefs

def test_no_data(client) -> None:
  rv = client.post(
    '/recommend'
    data=json.dumps({}),
    content_type='application/json')
  assert rv.data = b'\"books\" property not in request body'

def test_no_pref(client) -> None:
  rv = client.post(
    '/recommend'
    data=json.dumps({'books': test_books}),
    content_type='application/json')
  assert rv.data = b'\"pref\" property not in request body'

def test_backend(client) -> None:
  rv = client.post(
    '/recommend'
    data=json.dumps({'books': test_books, 'prefs': user_preferred_books}),
    content_type='application/json')
  assert rv.data = b'\"pref\" property not in request body'