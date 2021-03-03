# Root test to make sure the flask server runs
def test_index(client) -> None:
  rv = client.get('/')
  assert rv.data == b'Hello World'
