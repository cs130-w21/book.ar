def test_index(client) -> None:
  rv = client.get('/')
  assert rv.data == b'Hello World'
