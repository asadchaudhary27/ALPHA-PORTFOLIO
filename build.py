import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace <style>...</style> with <link rel="stylesheet" href="style.css">
# We must use re.DOTALL to match across newlines
content = re.sub(r'<style>.*?</style>', '<link rel="stylesheet" href="style.css">', content, flags=re.DOTALL)

# Replace <script>...</script> with <script src="script.js"></script>
content = re.sub(r'<script>.*?</script>', '<script src="script.js"></script>', content, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully refactored index.html")
