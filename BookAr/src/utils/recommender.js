/**
 * @namespace Recommender
 */

import {firebase} from './firebase';

/**
 * This callback type is called `bookListCallback` and defines a callback for a React
 * Native state modifier which sets a (possibly null) array of Books.
 *
 * @callback bookListCallback
 * @param {Object[]} books - The list of books to set as the new state.
 * @param {string}   books[].key - A unique identifier for the book in the list.
 * @param {string}   books[].title - The title of a book.
 * @param {string=}  books[].description - A short blurb about the book.
 * @param {string=}  books[].author - The author of a book.
 * @param {string=}  books[].publisher - The publisher of a book.
 * @param {number=}  books[].year - The year in which a book was published.
 * @param {string=}  books[].coverUrl - A link to a thumbnail for the book's cover.
 */

/**
 * This callback type is called `loadingCallback` and defines a callback for a React
 * Native state modifier which sets an (possibly null) object containing information
 * about loading status.
 *
 * @callback loadingCallback
 * @param {Object} loadingInfo - An object describing loading status and information.
 * @param {boolean} loadingInfo.isLoading - Whether or not loading is in progress.
 * @param {string} loadingInfo.msg - A message to display explaining the undergoing process.
 */

/**
 * Processes an image of books and returns a recommended subset of those books.
 *
 * This function accepts a Base64 encoding of an image of books and uses the Cloud Vision
 * API to pull a list of detected titles, the Google Books API to match the (possibly
 * erroneous) detected text with actual book titles, and our in-house Recommendation server
 * to select a possibly empty subset of the detected titles to recommend to the user.
 *
 * Because of the asynchronous nature of this process, instead of returning data, this function
 * instead uses callbacks to modify the UI state.
 *
 * @async
 * @function getRecommendedBooks
 * @param {string} base64 - The Base64 encoding of the image to be processed.
 * @param {bookListCallback} setRecBooks - A React state modifier callback to set the list of
 *                                         recommended books.
 * @param {loadingCallback} setLoading - A React state modifier callback to set loading status.
 * @memberof Recommender
 */
export async function getRecommendedBooks(base64, setRecBooks, setLoading) {
  // First, use the Cloud Vision API to detect text within the image.
  setLoading({ isLoading: true, msg: "Looking for books in image..." });
  console.log('fetching vision data');
  // By using DOCUMENT_TEXT_DETECTION, we can group text based on proximity, which helps
  // differentiate titles from each other.
  const body = JSON.stringify({
    requests: [
      {
        features: [{type: 'DOCUMENT_TEXT_DETECTION', maxResults: 10}],
        image: {
          content: base64,
        },
      },
    ],
  });
  const response = await fetch(
    'https://vision.googleapis.com/v1/images:annotate?key=' +
      'AIzaSyDisE41cqB7YAB-MhrRnzxMSOwouAb9vFg',
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: body,
    },
  );

  const data = await response.json();
  // Titles end up grouped together as "paragraphs" by the Vision API, so we use map to flatten them into
  // a single list of titles.
  const rawTitles = data['responses'][0]['fullTextAnnotation']['pages'][0]['blocks'].map(b => {
    let paras = b['paragraphs'];
    let para_words = paras.map(p => {
      let words = p['words'];
      return words.map(w => w['symbols'].map(s => s['text']).join('')).join(' ');
    });
    return para_words.flat();
  });

  console.log(rawTitles);

  setLoading({ isLoading: true, msg: "Processing titles..." });
  console.log('fetching titles');
  // Next, we send each title to the Google Books API. This acts as a search, and allows us to correct any
  // errors in the detected text and pull the full, exact titles of each detected book (instead of, say, a substring).
  let titles = [];
  for (const title of rawTitles) {
    let response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${title[0]}`, { method: 'GET' });
    let json = await response.json();
    if (!json.items) continue;
    titles.push({
      title: json.items[0].volumeInfo.title,
      author: json.items[0].volumeInfo.authors?.length > 0 ? json.items[0].volumeInfo.authors[0] : null,
      publisher: json.items[0].volumeInfo.publisher,
      year: Number.parseInt(json.items[0].volumeInfo.publishedDate)
    });
  }

  console.log(titles);

  setLoading({ isLoading: true, msg: "Choosing books to recommend..." });
  // Next, we pull the user's list of preferred books from Firestore.
  const uid = firebase.auth().currentUser.uid;
  const usersRef = firebase.firestore().collection('users');
  const doc = await usersRef.doc(uid).get();
  if (!doc.exists) {
    console.log('User does not exist, something\'s wrong');
    return;
  }
  const prefs = doc.data().prefs;
  console.log('user prefs', prefs);

  // We send a request to our Recommendation server with the list of detected books and the user's preferences.
  const recResponse = await fetch('http://129.146.110.3/recommend', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ books: titles, prefs: prefs })
  });
  let recJson = await recResponse.json();
  console.log(recJson);

  // After receiving a list of recommended books, we search the titles through the Google Books API in order
  // to get other metadata such as author, description, and cover.
  let finalBooks = []
  console.log('getting book data');
  for (let recBook of recJson) {
    let finalResponse = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${recBook.title}`, { method: 'GET' });
    let finalJson = await finalResponse.json();
    if (!finalJson.items) return;
    let finalJsonBook = finalJson.items[0].volumeInfo;
    let finalBook = {
      title: finalJsonBook.title,
      key: finalJsonBook.title,
      author: finalJsonBook.authors?.length > 0 ? finalJsonBook.authors[0] : null,
      description: finalJsonBook.description,
      publisher: finalJsonBook.publisher,
      year: finalJsonBook.publishedDate,
      isbn: finalJsonBook.industryIdentifiers.find(el => el.type && el.type.startsWith('ISBN').identifier),
      coverUrl: finalJsonBook.imageLinks?.thumbnail
    };

    console.log(finalBook);
    finalBooks.push(finalBook);
  }

  // Finally, we use the callback to tell the React UI Manager that processing is complete and to display
  // the list of recommended books.
  setLoading({ isLoading: false, msg: "" });
  setRecBooks(finalBooks);
}
