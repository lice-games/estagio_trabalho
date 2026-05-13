import re

def process(file_path, script_name):
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Replace style block
    content = re.sub(r'    <style>.*?</style>\n', '    <link rel="stylesheet" href="style.css">\n', content, flags=re.DOTALL)
    
    # Replace script block
    content = re.sub(r'    <script>.*?</script>\n', f'    <script src="{script_name}"></script>\n', content, flags=re.DOTALL)
        with open(file_path, 'w') as f:
        f.write(content)

process('index.html', 'index.js')
process('project.html', 'project.js')
