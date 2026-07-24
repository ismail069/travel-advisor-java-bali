import json
import re
import ast

def parse_sql_to_json(sql_file, json_file):
    with open(sql_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Match INSERT INTO destinations (...) VALUES (...)
    # We use a regex that matches the column names and the values
    pattern = re.compile(r"INSERT INTO destinations \((.*?)\) VALUES \((.*?)\) ON CONFLICT", re.DOTALL)
    
    destinations = []
    
    # We will use ast.literal_eval on the values part but need to be careful with SQL strings (single quotes)
    # Actually, we can split by comma, but it's tricky with strings containing commas.
    # A better approach: The VALUES (...) part can be evaluated as a python tuple if we replace NULL with None
    # Let's extract the tuples carefully.
    
    for match in pattern.finditer(content):
        columns_str = match.group(1)
        values_str = match.group(2)
        
        columns = [c.strip() for c in columns_str.split(',')]
        
        # Prepare the values string to be a valid Python tuple
        # Replace SQL string escaping '' with \' if any (Python uses \' for single quotes inside single quotes)
        # But SQL uses '' for escaping. Let's just do a simple replacement for now.
        val_eval_str = values_str.replace("''", "\\'")
        val_eval_str = val_eval_str.replace("NULL", "None")
        
        try:
            values = ast.literal_eval(f"({val_eval_str})")
            
            # Map columns to values
            dest_obj = {}
            for i, col in enumerate(columns):
                dest_obj[col] = values[i]
                
            destinations.append(dest_obj)
        except Exception as e:
            print(f"Error parsing row: {e}")
            print(f"Values string: {val_eval_str}")
            
    # Write to JSON
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(destinations, f, indent=2, ensure_ascii=False)
        
    print(f"Successfully extracted {len(destinations)} destinations to {json_file}")

if __name__ == '__main__':
    parse_sql_to_json('server/db/sync_latest_destinations.sql', 'client/lib/fallback-destinations.json')
