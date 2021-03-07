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

export const getGenres = async () => {
  const uid = firebase.auth().currentUser.uid;
  const usersDoc = firebase.firestore().collection('users').doc(uid);
  const doc = await usersDoc.get();
  if (!doc.exists) {
    console.log('User does not exist, something\'s wrong');
    return;
  }
  const genres = doc.data().genres;
  return genres;
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

export const getReadingBooks = async () => {
  const uid = firebase.auth().currentUser.uid;
  const usersDoc = firebase.firestore().collection('users').doc(uid);
  const doc = await usersDoc.get();
  if (!doc.exists) {
    console.log('User does not exist, something\'s wrong');
    return;
  }
  const reading = doc.data().reading;
  return reading;
}

export const addToReading = async (book) => {
  const uid = firebase.auth().currentUser.uid;
  const usersDoc = firebase.firestore().collection('users').doc(uid);
  const doc = await usersDoc.get();
  if (!doc.exists) {
    console.log('User does not exist, something\'s wrong');
    return;
  }
  const reading = doc.data().reading;
  if (reading?.find(b => b && b.title == book.title) != undefined)
    return;
  console.log('user reading', reading);
  for (let key of Object.keys(book))
    book[key] == undefined && delete book[key];
  await usersDoc.update({
    reading: [
      ...(reading || []), book
    ]
  });
}

export const removeFromReading = async (book) => {
  const uid = firebase.auth().currentUser.uid;
  const usersDoc = firebase.firestore().collection('users').doc(uid);
  const doc = await usersDoc.get();
  if (!doc.exists) {
    console.log('User does not exist, something\'s wrong');
    return;
  }
  const reading = doc.data().reading;
  console.log(reading);
  const bookIdx = reading?.findIndex(b => b && b.title == book.title);
  console.log(bookIdx);
  if (bookIdx < 0)
    return;
  reading.splice(bookIdx, 1);
  
  await usersDoc.update({ reading: reading });
}

export const addToPrefs = async (book) => {
  const uid = firebase.auth().currentUser.uid;
  const usersDoc = firebase.firestore().collection('users').doc(uid);
  const doc = await usersDoc.get();
  if (!doc.exists) {
    console.log('User does not exist, something\'s wrong');
    return;
  }
  const prefs = doc.data().prefs;
  if (prefs?.find(b => b && b.title == book.title) != undefined)
    return;
  console.log('user prefs', prefs);
  for (let key of Object.keys(book))
    book[key] == undefined && delete book[key];
  await usersDoc.update({
    prefs: [
      ...(prefs || []), {
        title: book.title,
        author: book.author
      }
    ]
  });
}
