use crate::helpers::{get_video_duration, get_videos_dir};
use serde::Serialize;
use std::path::PathBuf;
use std::process::Command;

#[derive(Serialize)]
pub struct VideoFile {
    pub filename: String,
    pub filepath: String,
    pub duration: u64,
}
pub fn get_files_from_videos_dir() -> Vec<VideoFile> {
    let videos_dir = get_videos_dir();
    let mut video_files = Vec::new();

    if let Ok(entries) = std::fs::read_dir(&videos_dir) {
        for entry in entries.flatten() {
            let path = entry.path();
            if let Some(ext) = path.extension().and_then(|s| s.to_str()) {
                if matches!(
                    ext.to_lowercase().as_str(),
                    "mp4" | "mkv" | "mov" | "avi" | "webm"
                ) {
                    let filename = path.file_name().unwrap().to_string_lossy().to_string();
                    let duration = get_video_duration(&path);
                    video_files.push(VideoFile {
                        filename,
                        filepath: path.to_string_lossy().to_string(),
                        duration,
                    });
                }
            }
        }
    }

    video_files
}
