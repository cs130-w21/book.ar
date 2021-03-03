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

export async function getRecommendedBooks(base64: string, setResponse) {
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

  const data = await response.json(); // Holds bounding box and language information as well
  const rawTitles = data['responses'][0]['fullTextAnnotation']['pages'][0]['blocks'].map(b => {
    let paras = b['paragraphs'];
    let para_words = paras.map(p => {
      let words = p['words'];
      return words.map(w => w['symbols'].map(s => s['text']).join('')).join(' ');
    });
    return para_words;
  });

  let titles = [];
  for (const title of rawTitles) {
    let response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${title[0]}`, { method: 'GET' });
    let json = await response.json();
    if (!json.items) return;
    titles.push(json.items[0].volumeInfo.title);
  }

  setResponse(titles);

  // Get recommendations from server
  const recResponse = await fetch('http://129.146.110.3/recommend', {
    method: 'GET'
  });
}
