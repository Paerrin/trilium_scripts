import os
import subprocess

def convert_html_to_markdown(html_folder, markdown_folder):
    if not os.path.exists(markdown_folder):
        os.makedirs(markdown_folder)

    for filename in os.listdir(html_folder):
        if filename.endswith('.html'):
            html_path = os.path.join(html_folder, filename)
            md_filename = f"{os.path.splitext(filename)[0]}.md"
            md_path = os.path.join(markdown_folder, md_filename)

            # Call the `html2text` command-line tool
            try:
                output = subprocess.check_output(
                    ['html2text', html_path],
                    universal_newlines=True
                )
                with open(md_path, 'w', encoding='utf-8') as file:
                    file.write(output)
            except subprocess.CalledProcessError as e:
                print(f"Failed to convert {filename}: {str(e)}")

if __name__ == "__main__":
    html_directory = "/mnt/nvme/programming_files/trilium/api"
    markdown_directory = "/mnt/nvme/programming_files/trilium/api_md"

    convert_html_to_markdown(html_directory, markdown_directory)
