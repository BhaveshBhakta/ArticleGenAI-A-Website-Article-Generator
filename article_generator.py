# Website Article Generator
# Importing Libraries
import re
import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain_community.document_loaders import WebBaseLoader

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

def clean_text(text):
    """Clean and preprocess text data"""
    if not text:
        return ""
    
    # Remove extra whitespace and normalize
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'\n+', '\n', text)
    text = text.strip()
    
    # Remove special characters that might cause issues
    text = re.sub(r'[^\w\s\.\,\!\?\-\(\)]', '', text)
    
    return text

class ArticleGenerator:
    def __init__(self):
        if not GROQ_API_KEY:
            raise ValueError("GROQ_API_KEY not found in environment variables")
        
        self.llm = ChatGroq(
            temperature=0.2,  # Adjust temperature for creativity
            groq_api_key=GROQ_API_KEY,
            model_name="llama-3.3-70b-versatile"  # Change to your desired model
        )
    
    def extract_website_info(self, page_data):
        """Extracting website information"""
        prompt = PromptTemplate.from_template("""
        ### SCRAPED TEXT FROM WEBSITE:
        {page_data}
        ### INSTRUCTION:
        Summarize the key points and content of the website. Highlight the main ideas.
        ### OUTPUT:
        """)
        chain = prompt | self.llm
        try:
            res = chain.invoke({"page_data": page_data})
            return res.content
        except Exception as e:
            print("Error extracting website info:", e)
            return None
    
    def generate_article(self, article_info):
        """Prompt Template for article generation"""
        prompt = PromptTemplate.from_template("""
        ### ARTICLE INFORMATION:
        {article_info}
        ### INSTRUCTION:
        Write a high-quality article based on the provided information. It should be engaging, informative, 
        and tailored to a general audience. Avoid fluff and keep it concise.
        ### Website Article:
        """)
        chain = prompt | self.llm
        try:
            res = chain.invoke({"article_info": article_info})
            return res.content
        except Exception as e:
            print("Error generating article:", e)
            return None

# Example Usage
if __name__ == "__main__":
    website_url = "https://www.startupindia.gov.in/content/sih/en/bloglist/blogs/how-to-use-the-startup-india-portal-from-registration-to-growth.html"
    
    try:
        print("🌐 Loading website content...")
        loader = WebBaseLoader([website_url])
        page_data = loader.load()
        
        if page_data:
            page_text = page_data[0].page_content 
            cleaned_text = clean_text(page_text)
            
            print("🤖 Initializing article generator...")
            article_gen = ArticleGenerator()
            
            print("📊 Extracting website information...")
            article_info = article_gen.extract_website_info(cleaned_text)
            
            if article_info:
                print("✍️ Generating article...")
                article = article_gen.generate_article(article_info)
                
                if article:
                    print("\n📝 Generated Article:\n")
                    print("=" * 50)
                    print(article)
                    print("=" * 50)
                else:
                    print("❌ Failed to generate article.")
            else:
                print("❌ Failed to extract article info from the webpage.")
        else:
            print("❌ No content loaded from the webpage.")
            
    except Exception as e:
        print(f"❌ Error loading or processing the webpage: {e}")