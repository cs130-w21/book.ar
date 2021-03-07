import {firebase} from './firebase';

export const labels2Genre = {
  "Action and Adventure": "action",
  "Biographies": "biographies",
  "Classics": "classics",
  "Fantasy": "fantasy", 
  "Sci-Fi": "scifi", 
  "Suspense and Thrillers": "thrillers", 
  "Cookbooks": "cookbooks", 
  "Poetry": "poetry",
};

export const genre2Labels = {
  "action": "Action and Adventure",
  "biographies": "Biographies",
  "classics": "Classics",
  "fantasy": "Fantasy", 
  "scifi": "Sci-Fi", 
  "thrillers": "Suspense and Thrillers", 
  "cookbooks": "Cookbooks", 
  "poetry": "Poetry",
};

const shuffle = (array) => {
  return array.sort(() => Math.random() - 0.5);
}

export const searchBookOnGoogle = async (bookToSearch, verbose = false) => {
  let response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${bookToSearch.title}${bookToSearch.author ? ('+inauthor:' + bookToSearch.author) : ''}`, { method: 'GET' });
  let json = await response.json();
  if (!json.items) return;
  let bookInfo = json.items[0].volumeInfo;
  let book = {
    title: bookInfo.title,
    key: bookInfo.title,
    author: bookInfo.authors?.length > 0 ? bookInfo.authors[0] : null,
    description: bookInfo.description,
    publisher: bookInfo.publisher,
    year: bookInfo.publishedDate,
    isbn: bookInfo.industryIdentifiers.find(el => el.type && el.type.startsWith('ISBN').identifier),
    coverUrl: bookInfo.imageLinks?.thumbnail
  };

  if (verbose) console.log(book);
  return book;
}

export const getBooksFromGenres = async (genres, numOfBooks = 1) => {
  const ret = await genres.reduce(async (acc, genre) => {
    return [...(await acc), ...(await getBooksFromGenre(genre, numOfBooks))];
  }, []);
  return ret;
}

export const getBooksFromGenre = async (genre, numOfBooks = 1) => {
  const booksRef = firebase.firestore().collection('books');
  const books = await booksRef.doc(genre).get();
  const random = shuffle(Object.values(books.data()));
  const selectedBooks = random.length > numOfBooks ? random.slice(0, numOfBooks) : random;
  return await Promise.all(selectedBooks.map(async book => await searchBookOnGoogle(book, true)));
}
