# import pandas as pd
# import spacy
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from fuzzywuzzy import process

# app = Flask(__name__)
# CORS(app)

# # Load spaCy model
# nlp = spacy.load("en_core_web_sm")

# # Function to load responses from CSV
# def load_responses_from_csv(csv_file):
#     try:
#         df = pd.read_csv(csv_file)
#         print("CSV Columns:", df.columns)  # Debugging statement

#         required_columns = {"pattern", "response"}
#         if not required_columns.issubset(df.columns):
#             raise KeyError(f"Missing required columns: {required_columns - set(df.columns)}")

#         return {row["pattern"].lower(): row["response"] for _, row in df.iterrows()}
#     except Exception as e:
#         print("Error loading responses:", e)
#         return {}

# # Load chatbot responses
# responses = load_responses_from_csv("chatbot_responses.csv")

# # Function to preprocess user input with spaCy
# def preprocess_text(text):
#     doc = nlp(text.lower())
#     return " ".join([token.lemma_ for token in doc if not token.is_stop])  # Lemmatization & Stopword removal

# # Function to find the best response using FuzzyWuzzy
# def get_best_response(user_input):
#     processed_input = preprocess_text(user_input)
#     best_match, score = process.extractOne(processed_input, responses.keys()) if responses else (None, 0)
    
#     if best_match and score > 75:  # Adjust threshold as needed
#         return responses[best_match]
#     return "Sorry, could you explain more?"

# @app.route("/chat", methods=["POST"])
# def chat():
#     data = request.json
#     user_message = data.get("message", "").strip()

#     if not user_message:
#         return jsonify({"reply": "Please enter a message."})

#     bot_reply = get_best_response(user_message)
#     return jsonify({"reply": bot_reply})

# if __name__ == "__main__":
#     # app.run(debug=True)



###########################final##################################

# import pandas as pd
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from fuzzywuzzy import process
# import string

# app = Flask(__name__)

# CORS(app)

# # Function to load responses from CSV
# def load_responses_from_csv(csv_file):
#     """Load chatbot responses from CSV into a dictionary."""
#     try:
#         df = pd.read_csv(csv_file)
#         required_columns = {"pattern", "response"}

#         if not required_columns.issubset(df.columns):
#             raise KeyError(f"Missing required columns: {required_columns - set(df.columns)}")

#         return {row["pattern"].lower(): row["response"] for _, row in df.iterrows()}
#     except Exception as e:
#         print("Error loading responses:", e)
#         return {}

# # Load chatbot responses
# responses = load_responses_from_csv("chatbot_responses.csv")

# # Function to preprocess user input without spaCy
# def preprocess_text(text):
#     """Lowercase, remove punctuation, and normalize the text."""
#     text = text.lower().translate(str.maketrans('', '', string.punctuation))  # Remove punctuation
#     return " ".join(text.split())  # Normalize spaces

# # Function to find the best response using FuzzyWuzzy
# def get_best_response(user_input):
#     processed_input = preprocess_text(user_input)
#     best_match, score = process.extractOne(processed_input, responses.keys()) if responses else (None, 0)
    
#     if best_match and score > 75:  # Adjust threshold as needed
#         return responses[best_match]
#     return "Sorry, could you explain more?"

# @app.route("/chat", methods=["POST"])
# def chat():
#     """Handle chatbot requests."""
#     data = request.json
#     user_message = data.get("message", "").strip()

#     if not user_message:
#         return jsonify({"reply": "Please enter a message."})

#     bot_reply = get_best_response(user_message)
#     return jsonify({"reply": bot_reply})

# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=3001, debug=True)




import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
from fuzzywuzzy import process
import string
import time

app = Flask(__name__)

CORS(app)

# Function to load responses from CSV
def load_responses_from_csv(csv_file):
    """Load chatbot responses from CSV into a dictionary."""
    try:
        df = pd.read_csv(csv_file)
        required_columns = {"pattern", "response"}

        if not required_columns.issubset(df.columns):
            raise KeyError(f"Missing required columns: {required_columns - set(df.columns)}")

        return {row["pattern"].lower(): row["response"] for _, row in df.iterrows()}
    except Exception as e:
        print("Error loading responses:", e)
        return {}

# Load chatbot responses
responses = load_responses_from_csv("chatbot_responses.csv")

# Function to preprocess user input without spaCy
def preprocess_text(text):
    """Lowercase, remove punctuation, and normalize the text."""
    text = text.lower().translate(str.maketrans('', '', string.punctuation))  # Remove punctuation
    return " ".join(text.split())  # Normalize spaces

# Function to find the best response using FuzzyWuzzy
def get_best_response(user_input):
    processed_input = preprocess_text(user_input)
    best_match, score = process.extractOne(processed_input, responses.keys()) if responses else (None, 0)
    
    if best_match and score > 75:  # Adjust threshold as needed
        return responses[best_match]
    return "Sorry, could you explain more?"


# @app.route("/chat", methods=["POST"])
# def chat():
#     """Handle chatbot requests."""
#     data = request.json
#     user_message = data.get("message", "").strip()

#     if not user_message:
#         return jsonify({"reply": "Please enter a message."})

#     # Simulate typing delay
#     time.sleep(2)  # Adjust the delay as needed (e.g., 2 seconds)

#     bot_reply = get_best_response(user_message)
#     return jsonify({"reply": bot_reply})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3001, debug=True)




