import os

file_path = r"C:\Users\dj\Desktop\Project\vue-vben-admin\JZreference\金政概要设计说明书.md"
output_path = r"C:\Users\dj\Desktop\Project\vue-vben-admin\JZreference\db_section.txt"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 按\r分割
lines = content.split('\r')

# 找到数据库设计章节
db_lines = []
in_db = False
end_markers = ['第六章', '接口设计']

for i, line in enumerate(lines):
    s = line.strip()
    if not s:
        continue
    
    # 匹配 \x07 分隔符（Word表格列分隔符）
    s = s.replace('\x07', ' | ')
    
    if '数据库设计' in s and not in_db:
        in_db = True
    
    if in_db:
        db_lines.append(s)
        if any(marker in s for marker in end_markers) and len(db_lines) > 5:
            break

with open(output_path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(db_lines))

print(f"Extracted {len(db_lines)} lines to {output_path}")
