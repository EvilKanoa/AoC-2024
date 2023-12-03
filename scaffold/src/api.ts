import { sessionCookie } from "../../config.json";
import { keysInParallel } from "./util";
import TurndownService from "turndown";
import { load } from "cheerio";

export interface AdventOfCodeDay {
  input: string;
  question: string;
  // TODO: Try to extract these values to autogenerate test cases
  // example: string;
  // exampleOutput: number;
}

const service = new TurndownService();

const PAGE = `
<!DOCTYPE html>
<html lang="en-us">
<head>
<meta charset="utf-8"/>
<title>Day 3 - Advent of Code 2023</title>
<link rel="stylesheet" type="text/css" href="/static/style.css?31"/>
<link rel="stylesheet alternate" type="text/css" href="/static/highcontrast.css?1" title="High Contrast"/>
<link rel="shortcut icon" href="/favicon.png"/>
<script>window.addEventListener('click', function(e,s,r){if(e.target.nodeName==='CODE'&&e.detail===3){s=window.getSelection();s.removeAllRanges();r=document.createRange();r.selectNodeContents(e.target);s.addRange(r);}});</script>
</head><!--




Oh, hello!  Funny seeing you here.

I appreciate your enthusiasm, but you aren't going to find much down here.
There certainly aren't clues to any of the puzzles.  The best surprises don't
even appear in the source until you unlock them for real.

Please be careful with automated requests; I'm not a massive company, and I can
only take so much traffic.  Please be considerate so that everyone gets to play.

If you're curious about how Advent of Code works, it's running on some custom
Perl code. Other than a few integrations (auth, analytics, social media), I
built the whole thing myself, including the design, animations, prose, and all
of the puzzles.

The puzzles are most of the work; preparing a new calendar and a new set of
puzzles each year takes all of my free time for 4-5 months. A lot of effort
went into building this thing - I hope you're enjoying playing it as much as I
enjoyed making it for you!

If you'd like to hang out, I'm @ericwastl@hachyderm.io on Mastodon and
@ericwastl on Twitter.

- Eric Wastl


















































-->
<body>
<header><div><h1 class="title-global"><a href="/">Advent of Code</a></h1><nav><ul><li><a href="/2023/about">[About]</a></li><li><a href="/2023/events">[Events]</a></li><li><a href="https://teespring.com/stores/advent-of-code" target="_blank">[Shop]</a></li><li><a href="/2023/settings">[Settings]</a></li><li><a href="/2023/auth/logout">[Log Out]</a></li></ul></nav><div class="user">EvilKanoa <a href="/2023/support" class="supporter-badge" title="Advent of Code Supporter">(AoC++)</a> <span class="star-count">6*</span></div></div><div><h1 class="title-event">&nbsp;&nbsp;&nbsp;<span class="title-event-wrap">0xffff&amp;</span><a href="/2023">2023</a><span class="title-event-wrap"></span></h1><nav><ul><li><a href="/2023">[Calendar]</a></li><li><a href="/2023/support">[AoC++]</a></li><li><a href="/2023/sponsors">[Sponsors]</a></li><li><a href="/2023/leaderboard">[Leaderboard]</a></li><li><a href="/2023/stats">[Stats]</a></li></ul></nav></div></header>

<div id="sidebar">
<div id="sponsor"><div class="quiet">Our <a href="/2023/sponsors">sponsors</a> help make Advent of Code possible:</div><div class="sponsor"><a href="https://www.janestreet.com/" target="_blank" onclick="if(ga)ga('send','event','sponsor','sidebar',this.href);" rel="noopener">Jane Street</a> - Will our next great idea come from you? We hire smart, humble people who love to solve problems, build systems, and test theories. Our success is driven by our people and we never stop improving.</div></div>
</div><!--/sidebar-->

<main>
<article class="day-desc"><h2>--- Day 3: Gear Ratios ---</h2><p>You and the Elf eventually reach a <a href="https://en.wikipedia.org/wiki/Gondola_lift" target="_blank">gondola lift</a> station; he says the gondola lift will take you up to the <em>water source</em>, but this is as far as he can bring you. You go inside.</p>
<p>It doesn't take long to find the gondolas, but there seems to be a problem: they're not moving.</p>
<p>"Aaah!"</p>
<p>You turn around to see a slightly-greasy Elf with a wrench and a look of surprise. "Sorry, I wasn't expecting anyone! The gondola lift isn't working right now; it'll still be a while before I can fix it." You offer to help.</p>
<p>The engineer explains that an engine part seems to be missing from the engine, but nobody can figure out which one. If you can <em>add up all the part numbers</em> in the engine schematic, it should be easy to work out which part is missing.</p>
<p>The engine schematic (your puzzle input) consists of a visual representation of the engine. There are lots of numbers and symbols you don't really understand, but apparently <em>any number adjacent to a symbol</em>, even diagonally, is a "part number" and should be included in your sum. (Periods (<code>.</code>) do not count as a symbol.)</p>
<p>Here is an example engine schematic:</p>
<pre><code>467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..
</code></pre>
<p>In this schematic, two numbers are <em>not</em> part numbers because they are not adjacent to a symbol: <code>114</code> (top right) and <code>58</code> (middle right). Every other number is adjacent to a symbol and so <em>is</em> a part number; their sum is <code><em>4361</em></code>.</p>
<p>Of course, the actual engine schematic is much larger. <em>What is the sum of all of the part numbers in the engine schematic?</em></p>
</article>
<p>Your puzzle answer was <code>528819</code>.</p><article class="day-desc"><h2 id="part2">--- Part Two ---</h2><p>The engineer finds the missing part and installs it in the engine! As the engine springs to life, you jump in the closest gondola, finally ready to ascend to the water source.</p>
<p>You don't seem to be going very fast, though. Maybe something is still wrong? Fortunately, the gondola has a phone labeled "help", so you pick it up and the engineer answers.</p>
<p>Before you can explain the situation, she suggests that you look out the window. There stands the engineer, holding a phone in one hand and waving with the other. You're going so slowly that you haven't even left the station. You exit the gondola.</p>
<p>The missing part wasn't the only issue - one of the gears in the engine is wrong. A <em>gear</em> is any <code>*</code> symbol that is adjacent to <em>exactly two part numbers</em>. Its <em>gear ratio</em> is the result of <span title="They're magic gears.">multiplying</span> those two numbers together.</p>
<p>This time, you need to find the gear ratio of every gear and add them all up so that the engineer can figure out which gear needs to be replaced.</p>
<p>Consider the same engine schematic again:</p>
<pre><code>467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..
</code></pre>
<p>In this schematic, there are <em>two</em> gears. The first is in the top left; it has part numbers <code>467</code> and <code>35</code>, so its gear ratio is <code>16345</code>. The second gear is in the lower right; its gear ratio is <code>451490</code>. (The <code>*</code> adjacent to <code>617</code> is <em>not</em> a gear because it is only adjacent to one part number.) Adding up all of the gear ratios produces <code><em>467835</em></code>.</p>
<p><em>What is the sum of all of the gear ratios in your engine schematic?</em></p>
</article>
<p>Your puzzle answer was <code>80403602</code>.</p><p class="day-success">Both parts of this puzzle are complete! They provide two gold stars: **</p>
<p>At this point, you should <a href="/2023">return to your Advent calendar</a> and try another puzzle.</p>
<p>If you still want to see it, you can <a href="3/input" target="_blank">get your puzzle input</a>.</p>
<p>You can also <span class="share">[Share<span class="share-content">on
  <a href="https://twitter.com/intent/tweet?text=I%27ve+completed+%22Gear+Ratios%22+%2D+Day+3+%2D+Advent+of+Code+2023&amp;url=https%3A%2F%2Fadventofcode%2Ecom%2F2023%2Fday%2F3&amp;related=ericwastl&amp;hashtags=AdventOfCode" target="_blank">Twitter</a>
  <a href="javascript:void(0);" onclick="var ms; try{ms=localStorage.getItem('mastodon.server')}finally{} if(typeof ms!=='string')ms=''; ms=prompt('Mastodon Server?',ms); if(typeof ms==='string' && ms.length){this.href='https://'+ms+'/share?text=I%27ve+completed+%22Gear+Ratios%22+%2D+Day+3+%2D+Advent+of+Code+2023+%23AdventOfCode+https%3A%2F%2Fadventofcode%2Ecom%2F2023%2Fday%2F3';try{localStorage.setItem('mastodon.server',ms);}finally{}}else{return false;}" target="_blank">Mastodon</a
></span>]</span> this puzzle.</p>
</main>

<!-- ga -->
<script>
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-69522494-1', 'auto');
ga('set', 'anonymizeIp', true);
ga('send', 'pageview');
</script>
<!-- /ga -->
</body>
</html>
`;

export const fetchDay = async (
  year: number,
  day: number
): Promise<AdventOfCodeDay> => {
  // const input = fetch(`https://adventofcode.com/${year}/day/${day}/input`, {
  //   method: "GET",
  //   headers: { Cookie: `session=${sessionCookie}` },
  // }).then((r) => {
  //   if (!r.ok) {
  //     throw new Error("Failed to fetch input!", {
  //       cause: `${r.status} ${r.statusText}`,
  //     });
  //   }

  //   return r.text();
  // });

  const question =
    /*fetch(`https://adventofcode.com/${year}/day/${day}`, {
    method: "GET",
    headers: { Cookie: `session=${sessionCookie}` },
  })
    .then((r) => {
      if (!r.ok) {
        throw new Error("Failed to question input!", {
          cause: `${r.status} ${r.statusText}`,
        });
      }

      return r.text();
    })*/
    Promise.resolve(PAGE).then((html) => {
      const $ = load(html);
      const parts = [] as string[];
      $("body > main > article.day-desc").each((_, el) => {
        parts.push($(el).html() ?? "");
      });
      return parts.map((part) => service.turndown(part)).join("\n\n");
    });

  return await keysInParallel({
    input: Promise.resolve("no input"),
    question,
  });
};
