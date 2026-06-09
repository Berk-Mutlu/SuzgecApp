import PyPDF2
import os
import glob

pdf_dir = os.path.dirname(os.path.abspath(__file__))
output_file = os.path.join(pdf_dir, "all_pdfs_content.txt")

pdf_files = sorted(glob.glob(os.path.join(pdf_dir, "*.pdf")))

with open(output_file, "w", encoding="utf-8") as out:
    for pdf_path in pdf_files:
        filename = os.path.basename(pdf_path)
        out.write(f"\n{'='*80}\n")
        out.write(f"FILE: {filename}\n")
        out.write(f"{'='*80}\n\n")
        
        try:
            with open(pdf_path, "rb") as f:
                reader = PyPDF2.PdfReader(f)
                total_pages = len(reader.pages)
                out.write(f"Total pages: {total_pages}\n\n")
                
                for i, page in enumerate(reader.pages):
                    out.write(f"\n--- Page {i+1}/{total_pages} ---\n")
                    text = page.extract_text()
                    if text:
                        out.write(text)
                    else:
                        out.write("[No text extracted from this page]")
                    out.write("\n")
        except Exception as e:
            out.write(f"ERROR reading {filename}: {e}\n")

print(f"Done! Output written to {output_file}")
print(f"Processed {len(pdf_files)} PDF files")
