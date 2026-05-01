import os
import imageio_ffmpeg as ffmpeg
import subprocess

def compress_video(input_path, output_path, crf=30):
    ffmpeg_exe = ffmpeg.get_ffmpeg_exe()
    # For WebM (VP9), we use different flags
    if input_path.lower().endswith('.webm'):
        # VP9 compression
        cmd = [
            ffmpeg_exe,
            '-i', input_path,
            '-c:v', 'libvpx-vp9',
            '-crf', str(crf),
            '-b:v', '0',
            '-an', # Remove audio if not needed (saves a lot of space for background videos)
            '-y',
            output_path
        ]
    else:
        # standard H.264
        cmd = [
            ffmpeg_exe,
            '-i', input_path,
            '-vcodec', 'libx264',
            '-crf', str(crf),
            '-an',
            '-y',
            output_path
        ]
    
    try:
        subprocess.run(cmd, check=True)
        return True
    except Exception as e:
        print(f"Error compressing {input_path}: {e}")
        return False

if __name__ == "__main__":
    video_dir = os.path.join(os.getcwd(), 'frontend', 'public', 'videos')
    print(f"Starting video compression in {video_dir}...")
    
    for file in os.listdir(video_dir):
        if file.lower().endswith(('.webm', '.mp4')):
            input_file = os.path.join(video_dir, file)
            temp_file = os.path.join(video_dir, f"temp_{file}")
            
            original_size = os.path.getsize(input_file)
            print(f"Compressing {file} ({original_size/1024/1024:.2f}MB)...")
            
            if compress_video(input_file, temp_file):
                new_size = os.path.getsize(temp_file)
                if new_size < original_size:
                    os.replace(temp_file, input_file)
                    reduction = (original_size - new_size) / original_size * 100
                    print(f"Successfully compressed {file}: {new_size/1024/1024:.2f}MB ({reduction:.1f}% reduction)")
                else:
                    print(f"Compression didn't save space for {file}, keeping original.")
                    os.remove(temp_file)
