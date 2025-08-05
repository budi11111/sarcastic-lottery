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

@app.route('/robots.txt')
def robots():
    return '''User-agent: *
Allow: /
Sitemap: https://sarcastic-lottery.vercel.app/sitemap.xml''', 200, {'Content-Type': 'text/plain'}


@app.route('/lottery-info')
def lottery_info():
    return jsonify(lottery_gen.get_all_lottery_info())


if __name__ == '__main__':
    app.run(debug=True)

# For Vercel deployment
app.debug = False

