import glob
import re

files = glob.glob('src/**/*.tsx', recursive=True)
tag_classes = {}
for f in files:
    content = open(f, encoding='utf-8').read()
    matches = re.findall(r'className=["\']([^"\']+)["\']', content)
    for m in matches:
        cls_list = m.split()
        for c in cls_list:
            if any(w in c for w in ['dark', 'gray', 'white', 'slate']):
                tag_classes[c] = tag_classes.get(c, 0) + 1

for k, v in sorted(tag_classes.items(), key=lambda x: -x[1])[:35]:
    print(f'{k}: {v}')
