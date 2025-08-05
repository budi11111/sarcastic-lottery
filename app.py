from flask import Flask, render_template, jsonify, request
from lottery_logic import LotteryGenerator
from config import SARCASTIC_COMMENTS
import random

app = Flask(__name__)
lottery_gen = LotteryGenerator()


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/generate')
def generate_numbers():
    lottery_type = request.args.get('type', 'powerball')
    count = int(request.args.get('count', 1))

    # Generate multiple combinations if requested
    results = []
    for _ in range(min(count, 100)):  # Limit to 10 combinations max
        numbers = lottery_gen.generate(lottery_type)
        results.append(numbers)

    comment = random.choice(SARCASTIC_COMMENTS)

    return jsonify({
        'results': results,
        'comment': comment,
        'lottery_type': lottery_type,
        'count': count
    })


@app.route('/sitemap.xml')
def sitemap():
    sitemap_xml = '''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://sarcastic-lottery.vercel.app/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://sarcastic-lottery.vercel.app/blog</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>'''

    # Add each blog post to sitemap
    for post in BLOG_POSTS:
        sitemap_xml += f'''
  <url>
    <loc>https://sarcastic-lottery.vercel.app/blog/{post['slug']}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>'''

    sitemap_xml += '''
</urlset>'''

    return sitemap_xml, 200, {'Content-Type': 'application/xml'}


@app.route('/robots.txt')
def robots():
    return '''User-agent: *
Allow: /
Sitemap: https://sarcastic-lottery.vercel.app/sitemap.xml''', 200, {'Content-Type': 'text/plain'}


@app.route('/lottery-info')
def lottery_info():
    return jsonify(lottery_gen.get_all_lottery_info())


# Blog posts data
BLOG_POSTS = [
    {
        'slug': 'why-lucky-numbers-arent-lucky',
        'title': "Why Your 'Lucky' Numbers Aren't Actually Lucky (A Statistical Reality Check)",
        'date': 'January 15, 2024',
        'read_time': '5',
        'excerpt': 'Spoiler alert: Math doesn\'t care about your birthday or anniversary date.',
        'meta_description': 'Discover why lucky lottery numbers are statistically meaningless. Learn the mathematical truth behind lottery number selection with humor and facts.',
        'keywords': 'lottery lucky numbers, best lottery numbers, lottery number strategy, powerball lucky numbers',
        'content': '''
        <p>Let's have an honest conversation about your "lucky" numbers...</p>
        <h2>The Birthday Trap</h2>
        <p>Content will go here...</p>
        '''
    },
    {
        'slug': 'powerball-vs-mega-millions-disappointment',
        'title': "Powerball vs Mega Millions: Which Will Disappoint You More?",
        'date': 'January 20, 2024',
        'read_time': '4',
        'excerpt': 'A comprehensive comparison of two excellent ways to not become rich.',
        'meta_description': 'Compare Powerball and Mega Millions odds, jackpots, and your chances of winning. Spoiler: they\'re both terrible.',
        'keywords': 'powerball vs mega millions, lottery odds comparison, powerball mega millions difference',
        'content': '''
        <p>Today we're comparing two titans of statistical disappointment...</p>
        <h2>The Numbers Don't Lie</h2>
        <p>Content will go here...</p>
        '''
    }
]


@app.route('/blog')
def blog():
    return render_template('blog.html', posts=BLOG_POSTS)


@app.route('/blog/<slug>')
def blog_post(slug):
    post = next((post for post in BLOG_POSTS if post['slug'] == slug), None)
    if not post:
        return "Post not found", 404
    return render_template('blog_post.html', post=post)


if __name__ == '__main__':
    app.run(debug=True)

# For Vercel deployment
app.debug = False
