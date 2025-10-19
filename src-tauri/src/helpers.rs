use std::path::PathBuf;
use std::process::Command;

/// Returns the path to the standard Videos directory for the current user
pub fn get_videos_dir() -> PathBuf {
    dirs::video_dir().unwrap_or_else(|| dirs::home_dir().expect("Failed to get home directory"))
}

pub fn get_video_duration(file_path: &PathBuf) -> u64 {
    let output = Command::new("ffprobe")
        .args([
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "csv=p=0",
            file_path.to_str().unwrap(),
        ])
        .output();

    output
        .ok()
        .and_then(|out| String::from_utf8(out.stdout).ok())
        .and_then(|s| s.trim().parse::<f64>().ok())
        .unwrap_or(0.0)
        .round() as u64
}
