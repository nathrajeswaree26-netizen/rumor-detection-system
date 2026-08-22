import os
import pandas as pd
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

DATASET_PATH = r'C:\Users\HP.LAPTOP-6EB9SDV1\OneDrive\Desktop\Research1\ottawashooting.xlsx'
ML_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(ML_DIR, 'rumor_model.pkl')
VECTORIZER_PATH = os.path.join(ML_DIR, 'tfidf_vectorizer.pkl')

print('Loading dataset...')
df = pd.read_excel(DATASET_PATH)
print(f'Original dataset size: {len(df)}')

required_columns = {'Text', 'Label'}
if not required_columns.issubset(df.columns):
    raise ValueError(f'Dataset must contain columns: {required_columns}')

df = df.dropna(subset=['Text', 'Label'])

before_duplicates = len(df)
df = df.drop_duplicates(subset=['Text'], keep='first')
print(f'Duplicates removed: {before_duplicates - len(df)}')
print(f'Clean dataset size: {len(df)}')

df['Label'] = df['Label'].astype(str).str.strip().str.lower()
valid_labels = {'rumor', 'non-rumor'}
invalid_labels = set(df['Label'].unique()) - valid_labels
if invalid_labels:
    raise ValueError(f'Unexpected labels found: {invalid_labels}')

print('\\nClass distribution:')
print(df['Label'].value_counts())

X = df['Text'].astype(str)
y = df['Label']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20, random_state=42, stratify=y)

print(f'\\nTraining samples: {len(X_train)}')
print(f'Testing samples: {len(X_test)}')

print('\\nCreating TF-IDF vectors...')
vectorizer = TfidfVectorizer(lowercase=True, strip_accents='unicode', stop_words='english', ngram_range=(1, 2), min_df=1, max_df=0.95, sublinear_tf=True)
X_train_tfidf = vectorizer.fit_transform(X_train)
X_test_tfidf = vectorizer.transform(X_test)

print(f'TF-IDF training shape: {X_train_tfidf.shape}')
print(f'TF-IDF testing shape: {X_test_tfidf.shape}')

print('\\nTraining Logistic Regression model...')
model = LogisticRegression(max_iter=2000, class_weight='balanced', random_state=42)
model.fit(X_train_tfidf, y_train)

y_pred = model.predict(X_test_tfidf)
accuracy = accuracy_score(y_test, y_pred)

print('\\n==============================')
print('MODEL EVALUATION')
print('==============================')
print(f'Accuracy: {accuracy:.4f}')
print('\\nClassification Report:')
print(classification_report(y_test, y_pred, digits=4))
print('Confusion Matrix:')
print(confusion_matrix(y_test, y_pred))

joblib.dump(model, MODEL_PATH)
joblib.dump(vectorizer, VECTORIZER_PATH)

print('\\n==============================')
print('MODEL SAVED SUCCESSFULLY')
print('==============================')
print(f'Model: {MODEL_PATH}')
print(f'Vectorizer: {VECTORIZER_PATH}')
