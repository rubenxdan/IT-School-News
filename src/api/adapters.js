export function getNewsList(apiRespons) {
  if (!apiRespons || !apiRespons.response) {
    return [];
  }
  const rawNewsList = apiRespons.response.results;
  const adaptedNewsList = rawNewsList.map((news) => {
    return {
      id: news.id,
      imgSrc: news.fields.thumbnail,
      title: news.webTitle,
      description: news.fields.v,
    };
  });
  return adaptedNewsList;
}

export function getNewsDetails(apiRespons) {
  if (!apiRespons || !apiRespons.response) {
    return {};
  }
  const rawNewsDetails = apiRespons.response.content;
  const adaptedNewsDetais = {
    title: rawNewsDetails.fields.headline,
    description: rawNewsDetails.fields.trailText,
    image: rawNewsDetails.fields.main,
    content: rawNewsDetails.fields.body,
    author: rawNewsDetails.fields.byline,
    date: rawNewsDetails.webPublicationDate,
  };
  return adaptedNewsDetais;
}
