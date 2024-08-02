import DangerHtml from '@/components/ui/DangerHtml/DangerHtml';
import { Title } from '@/components/ui/Titles/Title';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as React from 'react';

export default async function Page() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
  Write a new article based on the original article so that it is not considered a copy of the original article by search engines.
  From the given text, use only the text inside the tags.
  Remove links and embedded scripts from the text.
  Do not change the quotes.
  In ukrainian and english. But write names, surnames, titles and abbreviations in the original language.
  Use the HTML format like:
  <h2 id='title-en'>Title</h2>
  <div id='text-en'>
  <p>Paragraph 1</p> 
  <p>Paragraph 2</p> 
  <p>Paragraph N</p> 
  </div>
  <h2 id='title-ua'>Назва</h2>
  <div id='text-ua'>
  <p>Параграф 1</p> 
  <p>Параграф 2</p> 
  <p>Параграф N</p> 
  </div>
  Do not wrap the text in \`\`\`html \`\`\`
  Text of original article: 
  <p><a href="/tag/donald-trump">Donald Trump</a> clashed with reporters at a July 31, 2024, appearance during the <a href="/tag/national-association-of-black-journalists">National Association of Black Journalists</a> annual convention.
<p>Trump appeared before an audience at the Chicago event with <a href="/tag/abc-news">ABC News</a> Senior Congressional Correspondent <a href="/tag/rachel-scott">Rachel Scott</a>, Fox star <a href="/tag/harris-faulkner">Harris Faulkner</a> and Semafor reporter Kadia Goba asking questions. NABJ and PolitiFact published a realtime <a href="https://nabjonline.org/blog/nabj-to-host-former-president-trump-for-a-conversation-in-chicago-during-its-annual-convention/" target="_blank" rel="noopener">fact-check of the event</a>.
<div class="responsive-embed"><iframe class="lazy lazy-hidden" width="680" height="365"  data-lazy-type="iframe" data-src="//www.youtube.com/embed/jgod-nqFEEc?rel=0&showinfo=0&modestbranding=1" frameborder="0" style="margin-bottom:20px;" allowfullscreen></iframe><noscript><iframe width="680" height="365" src="//www.youtube.com/embed/jgod-nqFEEc?rel=0&showinfo=0&modestbranding=1" frameborder="0" style="margin-bottom:20px;" allowfullscreen></iframe></noscript></div>
<p>Scott asked Trump the first question, which centered on why Black voters should support him.
<p>&#8220;I want to start by addressing the elephant in the room, sir. A lot of people did not think it was appropriate for you to be here today,&#8221; said Scott. &#8220;You have pushed false claims about some of your rivals, from Nikki Haley to former President Barack Obama, saying that they were not born in the United States, which is not true.
<p>&#8220;You have told four congressmen, women of color who were American citizens, to go back to where they came from. You have used words like &#8216;animal&#8217; and &#8216;rabbit&#8217; to describe Black district attorneys. You&#8217;ve attacked Black journalists, calling them a &#8216;loser,&#8217; saying the questions that they ask are, &#8216;stupid and racist.&#8217; You&#8217;ve had dinner with a white supremacist at your Mar a Lago resort.&#8221;
<p>After that lengthy lead-up, Scott drilled down. &#8220;So, my question, sir, now that you are asking Black supporters to vote for you, why should Black voters trust you after you have used language like that?&#8221;&nbsp;
<p>Trump fired back with a jumbled response. &#8220;Well, first of all, I don&#8217;t think I&#8217;ve ever been asked a question. So, in in (sic) such a horrible manner, a first question. You don&#8217;t even say hello,&#8221; said Trump. &#8220;Who are you? Are you with ABC? Because I think they&#8217;re a fake news network. A terrible network.&#8221;
<p>Trump has repeatedly called numerous mainstream media outlets &#8220;fake news,&#8221; including ABC, and frequently refers to ABC News anchor <a href="/tag/george-stephanopoulos">George Stephanopoulos</a> as &#8220;liddle George Slopadopolus.&#8221; He also has a bumpy relationship with Fox&#8217;s conservative cable network, though he recently called on the network to host the final debate between him and his presumptive general election opponent, <a href="/tag/kamala-harris">Vice President Kamala Harris</a>.&nbsp;<div class="g g-19"><div class="g-single a-309"><div style="text-align:center;">

<div style="width:100%; text-align:center;margin-bottom:1rem;"><span style="    font-size: 9px;
    text-transform: uppercase;
    text-align: center;
    color: #8c8c8c;
    letter-spacing: 1px;">Advertisement</span></div><a class="gofollow" data-track="MzA5LDE5LDEsNjA=" href="https://alibimusic.com/?utm_source=NewscastStudio" target="_blank" rel="nofollow"><img class="lazy lazy-hidden" decoding="async" src="//www.newscaststudio.com/wp-content/plugins/a3-lazy-load/assets/images/lazy_placeholder.gif" data-lazy-type="image" data-src="https://www.newscaststudio.com/wp-content/banners/300x600_the_premier_licensable_music_collection_for_marketing_2_iteration_4.gif" style="width:auto;" /><noscript><img decoding="async" src="https://www.newscaststudio.com/wp-content/banners/300x600_the_premier_licensable_music_collection_for_marketing_2_iteration_4.gif" style="width:auto;" /></noscript></a></div></div></div>
<p>Trump claimed that he &#8220;loves&#8221; Black Americans and pointed to his work with Sen. Tim Scott (R-S.C.) on building &#8220;opportunity&#8221; zones as evidence that he has made efforts to create programs to help Black citizens.&nbsp;
<p>Scott pushed back to ask Trump to answer her original question about why Black voters should support him.
<p>&#8220;I have answered the question. I have been the best president for the Black population since Abraham Lincoln,&#8221; he said.
<p>The discussion continued with Trump complaining about NABJ starting the event later than planned and claiming he was invited with the promise that his opponent in the race for president would attend as well.
<p>As the discussion continued, Trump was asked about GOP comments that she was a &#8220;DEI hire,&#8221; referring to a broad set of diversity, equity and inclusion practices used by many organizations.
<p>He made numerous false and misleading statements throughout the event.
<p>At one point he claimed Harris &#8220;became a Black person.&#8221;&nbsp;
<p>Trump&#8217;s appearance at the event generated controversy before it began. Karen Attiah, the co-chair of the convention, turned in her resignation from the that role after NABJ announced Trump, though Attiah stated booking Trump was &#8220;influenced by a variety of factors.&#8221;
<p>The NABJ later indicated it offered to host a virtual post-conference event with Harris.
`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  console.log(text);

  return (
    <>
      <Title>Welcome to GEMINI Page</Title>
      <React.Suspense>
        <DangerHtml text={text} />
      </React.Suspense>
    </>
  );
}
