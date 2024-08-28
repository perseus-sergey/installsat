export const getChangedSatNews = (originalText) => `
Write a new article based on the original article so that it is not considered a copy of the original article by search engines.
Don't change people's quotes.
Wrap important relevant to article title words in the article in a tag <strong>, but not more than 5% (for each language) from the content of the article.
Make short description of the article about 150 - 200 characters length for the <meta name=description>.
Select relevant search keywords that will be used on the page in the <meta name=keywords>.
Make SLUG for this article based on the english title.
Choose a number from one of the categories: 
1 - Public
2 - News
3 - Movies
4 - Sport
5 - Leisure, entertainment
6 - For Kids
7 - XXX, Adults
8 - Music
9 - Educational
10 - Entertainment, Humor
11 - Leisure, Sports, Entertainment
12 - Religious, Spiritual
13 - TV Sales
14 - Fashion
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
