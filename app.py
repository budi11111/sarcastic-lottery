from flask import Flask, render_template, jsonify, request, abort
from lottery_logic import LotteryGenerator
from config import SARCASTIC_COMMENTS
import random
import os
import markdown

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
    posts = list_posts()
    for post in posts:
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


# Posts directory
POSTS_DIRECTORY = os.path.join(os.path.dirname(__file__), 'posts')


def load_post(slug):
    """Load a single blog post from markdown file"""
    filepath = os.path.join(POSTS_DIRECTORY, slug + '.md')
    if not os.path.exists(filepath):
        return None

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Parse front matter (metadata between --- markers)
    parts = content.split('---')
    if len(parts) >= 3:
        meta_raw = parts[1]
        body = parts[2]
    else:
        meta_raw = ''
        body = content

    # Parse metadata
    meta = {}
    for line in meta_raw.strip().splitlines():
        if ':' in line:
            key, value = line.split(':', 1)
            meta[key.strip()] = value.strip().strip('"')

    # Convert markdown to HTML
    html_content = markdown.markdown(body)

    post = {
        'slug': slug,
        'title': meta.get('title', 'Untitled'),
        'date': meta.get('date', ''),
        'read_time': meta.get('read_time', '5'),
        'excerpt': meta.get('excerpt', ''),
        'meta_description': meta.get('meta_description', ''),
        'keywords': meta.get('keywords', ''),
        'content': html_content
    }

    return post


def list_posts():
    """Get all blog posts"""
    posts = []
    if not os.path.exists(POSTS_DIRECTORY):
        return posts

    for filename in os.listdir(POSTS_DIRECTORY):
        if filename.endswith('.md'):
            slug = filename[:-3]  # Remove .md extension
            post = load_post(slug)
            if post:
                posts.append(post)

    # Sort by date (newest first)
    posts.sort(key=lambda x: x['date'], reverse=True)
    return posts


@app.route('/blog')
def blog():
    posts = list_posts()
    return render_template('blog.html', posts=posts)


@app.route('/blog/<slug>')
def blog_post(slug):
    post = load_post(slug)
    if not post:
        return "Post not found", 404
    return render_template('blog_post.html', post=post)


if __name__ == '__main__':
    app.run(debug=True)

# For Vercel deployment
app.debug = False
