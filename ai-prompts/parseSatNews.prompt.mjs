export const getChangedSatNews = (originalText) => `
Write a new article based on the original article so that it is not considered a copy of the original article by search engines.
Don't change people's quotes.
Wrap important relevant to article title words in the article in a tag <strong>, but not more than 5% from the content of the article.
Make short description of the article about 150 - 200 characters length for the <meta name=description>.
Select relevant search keywords that will be used on the page in the <meta name=keywords>.
Make SLUG for this article based on the english title.
Choose a number from one of the categories: 
1 - News of satellite channels,
4 - Equipment overview,
5 - Equipment settings,
7 - Pay TV news,
10 - Television news.
14 - Satellite news.
Articles must be written in Ukrainian and English. But write names, surnames, titles and abbreviations in the original language.
Use the HTML format like:
<h2 id='title-en'>Title</h2>
<h3 id='description-en'>Description</h3>
<h4 id='keywords-en'>Keywords</h4>
<h5 id='slug'>slug-for-article</h5>
<h6 id='category-number'>10</h6>
<div id='text-en'>
<p>Paragraph 1</p> 
<p>Paragraph 2</p> 
<p>Paragraph N</p> 
</div>
<h2 id='title-ua'>Назва</h2>
<h3 id='description-ua'>Опис</h3>
<h4 id='keywords-ua'>Ключові слова</h4>
<div id='text-ua'>
<p>Параграф 1</p> 
<p>Параграф 2</p> 
<p>Параграф N</p> 
</div>
Do not wrap the text in \`\`\`html \`\`\`
Do not add newline character (\n).
Text of original article: 
${originalText}
`;

export const extractAiArticleDataFromAiHTML = ($) => {
  const enAiTitle = $('#title-en').text().trim();
  if (!enAiTitle)
    return `ERROR: cannot extract article EN_TITLE from AI article: ${$.html()}`;

  const uaAiTitle = $('#title-ua').text().trim();
  if (!uaAiTitle)
    return `ERROR: cannot extract article UA_TITLE from AI article: ${$.html()}`;

  const enAiContent = $('#text-en').html();
  if (!enAiContent)
    return `ERROR: cannot extract article EN_CONTENT from AI article: ${$.html()}`;

  const uaAiContent = $('#text-ua').html();
  if (!uaAiContent)
    return `ERROR: cannot extract article UA_CONTENT from AI article: ${$.html()}`;

  const enAiDescription = $('#description-en').text().trim();
  if (!enAiDescription)
    return `ERROR: cannot extract article EN_DESCRIPTION from AI article: ${$.html()}`;

  const uaAiDescription = $('#description-ua').text().trim();
  if (!uaAiDescription)
    return `ERROR: cannot extract article UA_DESCRIPTION from AI article: ${$.html()}`;

  const uaAiKeywords = $('#keywords-ua').text().trim();
  if (!uaAiKeywords)
    return `ERROR: cannot extract article UA_KEYWORDS from AI article: ${$.html()}`;

  const enAiKeywords = $('#keywords-en').text().trim();
  if (!enAiKeywords)
    return `ERROR: cannot extract article EN_KEYWORDS from AI article: ${$.html()}`;

  const aiSlug = $('#slug').text().trim();
  if (!aiSlug)
    return `ERROR: cannot extract article SLUG from AI article: ${$.html()}`;

  const category = $('#category-number').text().trim();
  if (!category)
    return `ERROR: cannot extract article CATEGORY from AI article: ${$.html()}`;

  return {
    enAiTitle,
    uaAiTitle,
    uaAiContent,
    enAiContent,
    enAiDescription,
    uaAiDescription,
    uaAiKeywords,
    enAiKeywords,
    aiSlug,
    category,
  };
};
