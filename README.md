 # Website Article Generator

> **Automatically generate high-quality, human-readable articles from any website URL using **LLaMA 3.1 via Groq API**.**

---

## Overview

The **Website Article Generator** is an AI-powered web application that leverages the capabilities of **LLaMA 3.1** through the **Groq API** to:

* Scrape and clean website content from a given URL
* Summarize and extract key information
* Generate a coherent, informative article tailored for human readers

This project showcases the synergy of **Natural Language Understanding (NLU)**, **LLMs**, and **Flask-based APIs** to automate content creation workflows.

---

## Key Features

* Input any **website URL** to extract readable content
* Uses **LLaMA 3.1 (Groq)** for advanced summarization and generation
* Cleans and preprocesses raw web data for optimal input
* Generates well-structured, high-quality **human-like articles**
* Health-check endpoint for deployment readiness
* Simple Flask backend with modular structure

---

## Tech Stack

| Layer          | Tools & Libraries                               |
| -------------- | ----------------------------------------------- |
| **Backend**    | Python, Flask, LangChain, Groq API (LLaMA 3.1)  |
| **Parsing**    | BeautifulSoup, LangChain WebBaseLoader          |
| **Text Clean** | Regular Expressions, Custom Normalization Logic |
| **Deployment** | Docker, Gunicorn (optional), REST APIs          |

---
## Demo Screenshot

![image](https://github.com/user-attachments/assets/f087afce-6d24-454b-95cf-3f02c12ab882)

---

## Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/BhaveshBhakta/ArticleGenAI-A-Website-Article-Generator.git
   cd ArticleGenAI-A-Website-Article-Generator
   ```

2. **Create virtual environment and install dependencies**

   ```bash
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Configure environment variables**

   Create a `.env` file:

   ```
   GROQ_API_KEY=your_groq_api_key_here
   ```

4. **Run the application**

   ```bash
   python app.py
   ```

---

##  Why This Project?

This project demonstrates:

* The ability to build real-world **GenAI applications**
* Understanding of **LLMs and prompt engineering**
* Integration of **external APIs, NLP pipelines**, and deployment-ready APIs

Use it as a portfolio project to showcase your **AI development skills** to recruiters and tech teams.

---

##  Folder Structure

```
├── app.py
├── article_generator.py
├── templates/
│   └── index.html
├── static/
│   └── style.css
├── .env
├── requirements.txt
├── README.md
└─ test_ArticleGenerator.ipynb
```
