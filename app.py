from flask import Flask, render_template, jsonify, request, abort
from lottery_logic import LotteryGenerator
from config import SARCASTIC_COMMENTS
import random
import os
import markdown
from datetime import datetime, time

app = Flask(__name__)
lottery_gen = LotteryGenerator()


@app.route('/')
def home():
    # Get recent blog posts for homepage integration
    recent_posts = list_posts()[:3]  # Get 3 most recent posts
    return render_template('index.html', recent_posts=recent_posts)


@app.route('/generate')
def generate_numbers():
    lottery_type = request.args.get('type', 'powerball')
    count = int(request.args.get('count', 1))

    # Generate multiple combinations if requested
    results = []
    for _ in range(min(count, 100)):
        numbers = lottery_gen.generate(lottery_type)
        results.append(numbers)

    comment = random.choice(SARCASTIC_COMMENTS)

    return jsonify({
        'results': results,
        'comment': comment,
        'lottery_type': lottery_type,
        'count': count
    })


@app.route('/generate-custom')
def generate_custom_numbers():
    try:
        main_count = int(request.args.get('main_count', 5))
        main_max = int(request.args.get('main_max', 50))
        extra_count = int(request.args.get('extra_count', 0))
        extra_max = int(request.args.get('extra_max', 0))
        count = int(request.args.get('count', 1))

        results = []
        for _ in range(min(count, 100)):
            numbers = lottery_gen.generate_custom(main_count, main_max, extra_count, extra_max)
            results.append(numbers)

        comment = random.choice(SARCASTIC_COMMENTS)

        return jsonify({
            'results': results,
            'comment': comment,
            'lottery_type': 'custom',
            'count': count
        })

    except ValueError as e:
        return jsonify({
            'error': str(e)
        }), 400


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

    # Add each PUBLISHED blog post to sitemap (list_posts already filters by publish_date)
    posts = list_posts()
    for post in posts:
        # Double-check post exists (list_posts already filters, but safety first)
        if post:
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

    # Parse front matter
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

    # Smart date handling - avoid file modification time completely
    publish_date_str = meta.get('publish_date', '')
    display_date = meta.get('date', '')

    if not display_date:
        if publish_date_str:
            # Use publish_date for display if no manual date specified
            try:
                pub_date_obj = datetime.strptime(publish_date_str, '%Y-%m-%d')
                display_date = pub_date_obj.strftime('%B %d, %Y')
            except ValueError:
                # If publish_date is invalid, use current date
                display_date = datetime.now().strftime('%B %d, %Y')
        else:
            # No publish_date either, use current date
            display_date = datetime.now().strftime('%B %d, %Y')

    # CHECK IF ARTICLE SHOULD BE PUBLISHED YET
    if publish_date_str:
        try:
            from datetime import date
            publish_date = datetime.strptime(publish_date_str, '%Y-%m-%d').date()
            if publish_date > date.today():
                return None  # Article not ready to publish yet
        except ValueError:
            pass  # Invalid date format, show article anyway

    # Convert markdown to HTML
    html_content = markdown.markdown(body)

    post = {
        'slug': slug,
        'title': meta.get('title', 'Untitled'),
        'date': display_date,
        'read_time': meta.get('read_time', '5'),
        'excerpt': meta.get('excerpt', ''),
        'meta_description': meta.get('meta_description', ''),
        'keywords': meta.get('keywords', ''),
        'content': html_content,
        'publish_date': publish_date_str
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

# Add this after your existing routes, before if __name__ == '__main__':

@app.route('/browserconfig.xml')
def browserconfig():
    return '''<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
    <msapplication>
        <tile>
            <square150x150logo src="/static/android-chrome-192x192.png"/>
            <TileColor>#007AFF</TileColor>
        </tile>
    </msapplication>
</browserconfig>''', 200, {'Content-Type': 'application/xml'}

@app.errorhandler(404)
def page_not_found(error):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_server_error(error):
    return render_template('404.html'), 500



if __name__ == '__main__':
    app.run(debug=True)

# For Vercel deployment
app.debug = False
