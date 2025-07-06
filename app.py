from flask import Flask, render_template, request, jsonify
import os
from article_generator import ArticleGenerator, clean_text
from langchain_community.document_loaders import WebBaseLoader

app = Flask(__name__)

# Initialize the article generator
article_gen = ArticleGenerator()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate_article():
    try:
        data = request.get_json()
        website_url = data.get('url')
        
        if not website_url:
            return jsonify({'error': 'URL is required'}), 400
        
        # Load website content
        loader = WebBaseLoader([website_url])
        page_data = loader.load()
        
        if not page_data:
            return jsonify({'error': 'Failed to load website content'}), 400
        
        page_text = page_data[0].page_content
        cleaned_text = clean_text(page_text)
        
        # Extract website information
        article_info = article_gen.extract_website_info(cleaned_text)
        
        if not article_info:
            return jsonify({'error': 'Failed to extract website information'}), 400
        
        # Generate article
        article = article_gen.generate_article(article_info)
        
        if not article:
            return jsonify({'error': 'Failed to generate article'}), 400
        
        return jsonify({
            'success': True,
            'article': article,
            'source_url': website_url
        })
        
    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500

@app.route('/health')
def health_check():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)