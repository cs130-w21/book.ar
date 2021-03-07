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
  return random.length > numOfBooks ? random.slice(0, numOfBooks) : random;
}