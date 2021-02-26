def test_index() -> None:
  rv = client.get('/')
  assert rv.data == 'Hello World'