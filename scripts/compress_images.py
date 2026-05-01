import os
from PIL import Image

def compress_images(directory, quality=80):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(('.webp', '.png', '.jpg', '.jpeg')):
                filepath = os.path.join(root, file)
                try:
                    img = Image.open(filepath)
                    original_size = os.path.getsize(filepath)
                    
                    # If it's a huge image, resize it (max width 1920)
                    if img.width > 1920:
                        new_height = int((1920 / img.width) * img.height)
                        img = img.resize((1920, new_height), Image.Resampling.LANCZOS)
                    
                    # Save with optimization
                    if file.lower().endswith('.webp'):
                        img.save(filepath, 'WEBP', quality=quality, method=6)
                    elif file.lower().endswith('.png'):
                        img.save(filepath, 'PNG', optimize=True)
                    else:
                        img.save(filepath, 'JPEG', quality=quality, optimize=True)
                    
                    new_size = os.path.getsize(filepath)
                    reduction = (original_size - new_size) / original_size * 100
                    print(f"Compressed {file}: {original_size/1024:.1f}KB -> {new_size/1024:.1f}KB ({reduction:.1f}% reduction)")
                except Exception as e:
                    print(f"Error compressing {file}: {e}")

if __name__ == "__main__":
    base_dir = os.path.join(os.getcwd(), 'frontend', 'public', 'images')
    print(f"Starting image compression in {base_dir}...")
    compress_images(base_dir)
