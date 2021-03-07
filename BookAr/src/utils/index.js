/**
 * @namespace Utilities
 */
import {firebase} from './firebase';

/**
* Label and its corresponding genre.
* @typedef Label - The label shown to the user
* @type {Object.<string, string>} 
* @property {string} genre - The genre associated with this label
*/

/**
* Genre and its associated label
* @typedef Genre - The genre of the book
* @type {Object.<string, string>} 
* @property {string} label - The label associated with this genre
*/

/**
 * Dictionary of labels and their associated genres
 * @constant
 * @type {Label}
 * @memberof Utilities
 * @default
 */
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


/**
 * Dictionary of genres and their associated labels
 * @constant
 * @type {Genre}
 * @memberof Utilities
 * @default
 */
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

/**
 * This function shuffles an array
 *
 * @function shuffle
 * @param {Array} array - The array to be shuffled
 * @memberof Utilities
 */
const shuffle = (array) => {
  return array.sort(() => Math.random() - 0.5);
}

/**
 * This function searches for a given book using the Google Books API and returns a book object.
 *
 * @function searchBookOnGoogle
 * @param {Object} bookToSearch - The book to search for
 * @param {string} bookToSearch.title - The target book title
 * @param {string} bookToSearch.author - The target book author
 * @param {boolean} verbose - Whether to log the found book
 * @returns {Object} The first result from the Google Books API
 * @memberof Utilities
*/
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

/**
 * This function gets the user's preferred genres from Firestore.
 *
 * @function getGenres
 * @returns {string[]} A list of genres.
 * @memberof Utilities
 */
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

/**
 * This function gets books for given genres
 *
 * @function getBooksFromGenres
 * @param {Array} genres - The genres for which books are to be got
 * @param {number} [numOfBooks=1] - The number of books to return 
 * @memberof Utilities
 */
export const getBooksFromGenres = async (genres, numOfBooks = 1) => {
  const ret = await genres.reduce(async (acc, genre) => {
    return [...(await acc), ...(await getBooksFromGenre(genre, numOfBooks))];
  }, []);
  return ret;
}

/**
 * This function gets books for a given genre
 *
 * @function getBooksFromGenres
 * @param {string} genre - The genre for which books are to be got
 * @param {number} [numOfBooks=1] - The number of books to return 
 * @memberof Utilities
 */
export const getBooksFromGenre = async (genre, numOfBooks = 1) => {
  const booksRef = firebase.firestore().collection('books');
  const books = await booksRef.doc(genre).get();
  const random = shuffle(Object.values(books.data()));
  const selectedBooks = random.length > numOfBooks ? random.slice(0, numOfBooks) : random;
  return await Promise.all(selectedBooks.map(async book => await searchBookOnGoogle(book, true)));
}

/**
 * This function retrieves a user's reading list from Firestore.
 *
 * @function getReadingBooks
 * @returns {Object[]} The user's reading list.
 * @memberof Utilities
 */
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

/**
 * This function adds a book to a user's reading list on Firestore.
 *
 * @function addToReading
 * @param {Object} book - The book to add.
 * @memberof Utilities
 */
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

/**
 * This function removes a book from a user's reading list on Firestore.
 *
 * @function removeFromReading
 * @param {Object} book - The book to remove.
 * @memberof Utilities
 */
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

/**
 * This function adds a book to a user's preferred books on Firestore.
 *
 * @function addToPrefs
 * @param {Object} book - The book to add.
 * @memberof Utilities
 */
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
