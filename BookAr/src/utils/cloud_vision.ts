import {firebase} from './firebase';

interface GoogleBooksResponse {
  items: {
    volumeInfo: {
      title: string
    }
  }[];
}

interface RecommendRequest {
  books: string[][];
}

interface RecommendedBook {
  ISBN: string;
  title: string;
  author: string;
  year: number;
  publisher: string;
  imageUri: string;
}

export async function getRecommendedBooks(base64: string, setRecBooks) {
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
  console.log('fetching vision data');

  const data = await response.json(); // Holds bounding box and language information as well
  const rawTitles = data['responses'][0]['fullTextAnnotation']['pages'][0]['blocks'].map(b => {
    let paras = b['paragraphs'];
    let para_words = paras.map(p => {
      let words = p['words'];
      return words.map(w => w['symbols'].map(s => s['text']).join('')).join(' ');
    });
    return para_words;
  });

  console.log(rawTitles);

  console.log('fetching titles');
  let titles = [];
  for (const title of rawTitles) {
    let response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${title[0]}`, { method: 'GET' });
    let json = await response.json();
    if (!json.items) continue;
    titles.push({ title: json.items[0].volumeInfo.title });
  }

  console.log(titles);

  // Get recommendations from server
  const uid = firebase.auth().currentUser.uid;
  const usersRef = firebase.firestore().collection('users');
  const doc = await usersRef.doc(uid).get();
  if (!doc.exists) {
    console.log('User does not exist, something\'s wrong');
    return;
  }
  const prefs = doc.data().prefs;
  console.log('user prefs', prefs);
  const recResponse = await fetch('http://192.168.0.11:8080/recommend', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ books: titles, prefs: prefs })
  });
  let recJson = await recResponse.json();
  console.log(recJson);

  let finalBooks = []
  console.log('getting book data');
  for (let recBook of recJson) {
    let finalResponse = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${recBook.title}`, { method: 'GET' });
    let finalJson = await finalResponse.json();
    if (!finalJson.items) return;
    let finalJsonBook = finalJson.items[0].volumeInfo;
    let finalBook = {
      title: finalJsonBook.title,
      author: finalJsonBook.authors[0],
      description: finalJsonBook.description,
      publisher: finalJsonBook.publisher,
      year: finalJsonBook.publishedDate,
      isbn: finalJsonBook.industryIdentifiers.find(el => el.type && el.type.startsWith('ISBN').identifier),
      coverUrl: finalJsonBook.imageLinks?.thumbnail
    };

    console.log(finalBook);
    finalBooks.push(finalBook);
  }

  setRecBooks(finalBooks);
}
