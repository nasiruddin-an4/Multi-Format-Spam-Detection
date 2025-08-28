import re
from collections import defaultdict
import unicodedata

class BanglaTextPreprocessor:
    def __init__(self):
        # Enhanced Bangla spam keywords
        self.bangla_spam_keywords = [
            'বিনামূল্যে', 'ফ্রি', 'জিতুন', 'পুরস্কার', 'লটারি', 'টাকা', 'অফার',
            'ছাড়', 'জরুরি', 'এখনই', 'ক্লিক', 'কল করুন', 'গ্যারান্টি', 'বিজয়ী',
            'লাভজনক', 'সুযোগ', 'সীমিত', 'দ্রুত', 'নিশ্চিত', 'জিতেছেন', 'পেতে',
            'রিচার্জ', 'লক্ষ', 'হাজার', 'কোটি', 'একাউন্ট', 'বন্ধ', 'সমস্যা',
            'বিশেষ', 'ডিসকাউন্ট', 'মোবাইল', 'ফোন', 'নম্বর', 'এসএমএস',
            'অর্ডার', 'কিনুন', 'বাছাই', 'শেষ', 'সীমিত', 'স্টক', 'কুপন'
        ]
        
        # Enhanced patterns for Bangla text
        self.patterns = {
            'phone_bd': re.compile(r'(?:\+?৮৮)?[-\s]?০১[৩-৯][০-৯]{8}'),
            'phone_en': re.compile(r'(\+?88)?[-\s]?01[3-9]\d{8}'),
            'bangla_numbers': re.compile(r'[০-৯]+'),
            'money_bangla': re.compile(r'৳\s*[\d০-৯]+|[\d০-৯]+\s*(টাকা|হাজার|লক্ষ|লাখ|কোটি)'),
            'urgent_bangla': re.compile(r'(জরুরি|এখনই|তাড়াতাড়ি|দ্রুত)', re.IGNORECASE),
            'url_pattern': re.compile(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+')
        }

    def normalize_bangla_numbers(self, text):
        """Convert English numbers to Bangla numbers in text"""
        number_map = {'0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
                     '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'}
        for en, bn in number_map.items():
            text = text.replace(en, bn)
        return text

    def preprocess_text(self, text):
        """Preprocess Bangla text"""
        if not text:
            return ""
            
        # Convert to string if not already
        text = str(text)
        
        # Normalize unicode characters
        text = unicodedata.normalize('NFKC', text)
        
        # Convert English numbers to Bangla numbers
        text = self.normalize_bangla_numbers(text)
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        
        return text

    def extract_features(self, text):
        """Extract features specific to Bangla spam detection"""
        features = defaultdict(int)
        
        # Preprocess text
        processed_text = self.preprocess_text(text)
        
        # Count spam keywords
        for keyword in self.bangla_spam_keywords:
            if keyword in processed_text:
                features['spam_keyword_count'] += 1
        
        # Extract pattern-based features
        for pattern_name, pattern in self.patterns.items():
            matches = pattern.findall(processed_text)
            features[pattern_name] = len(matches)
        
        # Calculate text statistics
        features.update({
            'text_length': len(processed_text),
            'word_count': len(processed_text.split()),
            'bangla_number_count': len(self.patterns['bangla_numbers'].findall(processed_text)),
            'money_mentions': len(self.patterns['money_bangla'].findall(processed_text)),
            'urgent_words': len(self.patterns['urgent_bangla'].findall(processed_text)),
            'url_count': len(self.patterns['url_pattern'].findall(processed_text))
        })
        
        return dict(features)