from dotenv import load_dotenv
import os
from llama_index import readers, VectorStoreIndex

if __name__ == "__main__":
    load_dotenv()
    print(f"{os.environ['OPENAI_API_KEY']}")

    #! Step 1: Data Ingestion
    url = "https://thebrownbox.dev/courses/data-structures-and-algorithms"
    documents = readers.SimpleWebPageReader(html_to_text=True).load_data([url])
    index = VectorStoreIndex.from_documents(documents)

    #! Step 2: Data Querying
    query_engine = index.as_query_engine()

    question = "Khoá học này tên là gì?"
    print(question)
    response = query_engine.query(question)
    print(f"{response}\n")


    question = "Khoá học này dành cho ai?"
    print(question)
    response = query_engine.query(question)
    print(f"{response}\n")

    question = "Khoá học này giá bao nhiêu?"
    print(question)
    response = query_engine.query(question)
    print(f"{response}\n")
    