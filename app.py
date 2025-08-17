from flask import Flask, render_template, jsonify, request, abort, Response, make_response
from lottery_logic import LotteryGenerator
from config import SARCASTIC_COMMENTS
import random
import os
import markdown
from markdown.extensions import toc
from datetime import datetime, time

app = Flask(__name__)
lottery_gen = LotteryGenerator()


@app.after_request
def after_request(response):
    # Skip header modifications for sitemap and robots.txt - let Vercel handle them
    if request.endpoint in ['sitemap', 'robots']:
        return response

    # Security headers for other routes
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    response.headers['Permissions-Policy'] = 'geolocation=(), microphone=(), camera=()'

    # Performance headers
    if request.endpoint == 'static':
        response.headers['Cache-Control'] = 'public, max-age=31536000, immutable'
        response.headers['Expires'] = 'Thu, 31 Dec 2025 23:55:55 GMT'
    elif request.endpoint in ['home', 'blog', 'blog_post']:
        response.headers['Cache-Control'] = 'public, max-age=3600, stale-while-revalidate=86400'
    else:
        response.headers['Cache-Control'] = 'no-cache, must-revalidate'

    return response


@app.route('/')
def home():
    # Get recent blog posts for homepage integration
    recent_posts = list_posts()[:5]  # Increased for better carousel
    response = make_response(render_template('index.html', recent_posts=recent_posts))
    response.headers['Cache-Control'] = 'public, max-age=1800, stale-while-revalidate=3600'
    return response


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


@app.route('/sitemap.xml')
def sitemap():
    """Generate sitemap - Vercel handles headers"""
    try:
        from urllib.parse import quote
        import xml.sax.saxutils as saxutils

        current_date = datetime.now().strftime('%Y-%m-%d')
        urls = []

        # Homepage
        urls.append({
            'loc': 'https://sarcastic-lottery.vercel.app/',
            'lastmod': current_date,
            'changefreq': 'daily',
            'priority': '1.0'
        })

        # Blog index
        urls.append({
            'loc': 'https://sarcastic-lottery.vercel.app/blog',
            'lastmod': current_date,
            'changefreq': 'weekly',
            'priority': '0.8'
        })

        # Blog posts
        try:
            posts = list_posts()
            if posts and isinstance(posts, list):
                for post in posts:
                    if (post and isinstance(post, dict) and
                            post.get('slug') and post.get('publish_date')):

                        slug = str(post['slug']).strip()
                        if not slug or len(slug) > 100:
                            continue

                        try:
                            post_date = str(post['publish_date']).strip()
                            datetime.strptime(post_date, '%Y-%m-%d')
                        except (ValueError, AttributeError):
                            post_date = current_date

                        safe_slug = quote(slug, safe='-._~')

                        urls.append({
                            'loc': f'https://sarcastic-lottery.vercel.app/blog/{safe_slug}',
                            'lastmod': post_date,
                            'changefreq': 'monthly',
                            'priority': '0.7'
                        })
        except Exception as e:
            print(f"Blog posts error in sitemap: {e}")

        # Generate XML
        xml_content = ['<?xml version="1.0" encoding="UTF-8"?>']
        xml_content.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')

        for url_data in urls:
            xml_content.extend([
                '  <url>',
                f'    <loc>{saxutils.escape(url_data["loc"])}</loc>',
                f'    <lastmod>{url_data["lastmod"]}</lastmod>',
                f'    <changefreq>{url_data["changefreq"]}</changefreq>',
                f'    <priority>{url_data["priority"]}</priority>',
                '  </url>'
            ])

        xml_content.append('</urlset>')

        # Return plain string - Vercel adds headers
        return '\n'.join(xml_content)

    except Exception as e:
        print(f"Sitemap generation error: {e}")
        return f'''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://sarcastic-lottery.vercel.app/</loc>
    <lastmod>{datetime.now().strftime('%Y-%m-%d')}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>'''


@app.route('/robots.txt')
def robots():
    """Generate robots.txt - Vercel handles headers"""
    return """User-agent: *
Allow: /
Disallow: /static/

User-agent: Googlebot
Allow: /
Disallow: /static/
Crawl-delay: 0

User-agent: Bingbot
Allow: /
Disallow: /static/
Crawl-delay: 1

User-agent: DuckDuckBot
Allow: /
Disallow: /static/
Crawl-delay: 1

User-agent: YandexBot
Allow: /
Disallow: /static/
Crawl-delay: 1

Sitemap: https://sarcastic-lottery.vercel.app/sitemap.xml"""


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


@app.route('/sitemap-debug')
def sitemap_debug():
    """Debug sitemap accessibility for Google"""
    try:
        # Test sitemap generation
        response = sitemap()

        return jsonify({
            'status': 'success',
            'sitemap_accessible': True,
            'content_type': response.headers.get('Content-Type'),
            'content_length': len(response.get_data()),
            'posts_count': len(list_posts()) if list_posts() else 0,
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }), 500


@app.route('/health')
def health_check():
    """Simple health check for monitoring"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'sitemap_url': 'https://sarcastic-lottery.vercel.app/sitemap.xml'
    })


# Add a simple health check endpoint
@app.route('/lottery-info')
def lottery_info():
    return jsonify(lottery_gen.get_all_lottery_info())


POSTS_DIRECTORY = os.path.join(os.path.dirname(__file__), 'posts')


# Posts directory
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

    # Convert markdown to HTML with full extension support
    try:
        md = markdown.Markdown(
            extensions=[
                'toc',
                'extra',
                'codehilite'
            ],
            extension_configs={
                'toc': {
                    'marker': '[TOC]',
                    'title': '',
                    'anchorlink': False,  # Don't add links to headings
                    'permalink': False,
                    'toc_depth': '2-6',  # Only include H2-H6, exclude H1
                    'slugify': lambda value, separator: value.lower().replace(' ', '-').replace(':', '').replace('?',
                                                                                                                 '').replace(
                        '&', 'and').replace('📋', '').strip()
                }
            }
        )
        html_content = md.convert(body)

    except Exception as e:
        print(f"TOC processing failed: {e}")
        html_content = markdown.markdown(body, extensions=['extra'])

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


# Add this after your existing routes, before if __name__ == '__main__':


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
