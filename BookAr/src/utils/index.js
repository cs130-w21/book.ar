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
  return random.length > numOfBooks ? random.slice(0, numOfBooks) : random;
}