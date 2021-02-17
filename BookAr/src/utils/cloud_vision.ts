export async function getTextFromImage(base64: string, setResponse) {
		let body = JSON.stringify({
			requests: [
				{
					features: [
						{ type: 'TEXT_DETECTION', maxResults: 5 },
					],
					image: {
                        "content": base64
					}
				}
			]
		});
		let response = await fetch(
			'https://vision.googleapis.com/v1/images:annotate?key=' +
				"AIzaSyDisE41cqB7YAB-MhrRnzxMSOwouAb9vFg",
			{
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				method: 'POST',
				body: body
			}
		);

    let data = await response.json(); // Holds bounding box and language information as well
    var rawTitles = data["responses"][0]["textAnnotations"].map(function(e) {
                          return e["description"];
                        });
    setResponse(rawTitles);
}
