import os
import win32com.client

def extract_text_from_doc(doc_path, txt_path):
    print(f"Extracting from: {doc_path}")
    word = win32com.client.Dispatch("Word.Application")
    word.visible = False
    
    try:
        # Open the document
        doc = word.Documents.Open(os.path.abspath(doc_path))
        
        # Get all text
        text = doc.Content.Text
        
        # Write to txt file
        with open(txt_path, 'w', encoding='utf-8') as f:
            f.write(text)
            
        print(f"Successfully saved to: {txt_path}")
    except Exception as e:
        print(f"Error extracting {doc_path}: {e}")
    finally:
        # Close the document without saving changes
        try:
            doc.Close(False)
        except:
            pass
        # Quit Word application
        word.Quit()

if __name__ == "__main__":
    folder_path = r"C:\Users\dj\Desktop\Project\vue-vben-admin\JZreference"
    
    files_to_process = [
        "金政[内控管理平台]-基线版本用户操作手册.doc",
        "金政概要设计说明书.doc"
    ]
    
    for filename in files_to_process:
        doc_path = os.path.join(folder_path, filename)
        txt_path = os.path.join(folder_path, filename.replace(".doc", ".md"))
        extract_text_from_doc(doc_path, txt_path)
