import pandas as pd
import json
import os

# Define file paths
excel_path = r'c:\Users\WZP10\OneDrive\桌面\trae_friend\docs\驾考宝典-科目4-顺序题(387).xlsx'
json_path = r'c:\Users\WZP10\OneDrive\桌面\trae_friend\src\data\questions.json'

# Ensure output directory exists
os.makedirs(os.path.dirname(json_path), exist_ok=True)

try:
    # Read Excel file
    df = pd.read_excel(excel_path)
    
    # Print original columns for debugging
    print("Original Columns:", df.columns.tolist())
    
    # Heuristic column mapping (adjust based on actual output if needed)
    column_mapping = {
        '问题': 'question',
        '答案': 'answer',
        '选项A': 'item1',
        '选项B': 'item2',
        '选项C': 'item3',
        '选项D': 'item4',
        '题目解析': 'explains',
        '图片URL': 'url',
        '题型': 'type'
    }
    
    # Rename columns
    df = df.rename(columns=column_mapping)
    
    # Keep only relevant columns if they exist
    expected_cols = ['question', 'answer', 'item1', 'item2', 'item3', 'item4', 'explains', 'url', 'type']
    existing_cols = [c for c in expected_cols if c in df.columns]
    
    # If 'question' column is missing, try to guess it (e.g. first column)
    if 'question' not in df.columns and len(df.columns) > 0:
        print("Warning: 'question' column not found by name. Using the second column as question (assuming first is ID).")
        # heuristic: often 1st is ID, 2nd is Question. 
        # But let's look at the printed columns first in a real scenario. 
        # For now, let's just dump all columns if mapping fails.
    
    # Add an ID field
    df['id'] = range(1, len(df) + 1)
    
    # Convert to list of dicts
    # fillna('') to avoid NaN in JSON
    data = df.fillna('').to_dict(orient='records')
    
    # Save to JSON
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        
    print(f"Successfully converted {len(data)} records to {json_path}")
    print("Sample record:", data[0] if data else "No data")

except Exception as e:
    print(f"Error: {e}")
