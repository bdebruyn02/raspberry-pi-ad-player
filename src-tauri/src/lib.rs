use tauri::Window;
#[cfg_attr(mobile, tauri::mobile_entry_point)]
use tauri_plugin_sql::Builder as SqlBuilder;

mod db;
mod helpers;
mod videos;

#[tauri::command]
fn get_videos() -> Vec<videos::VideoFile> {
    videos::get_files_from_videos_dir()
}

#[tauri::command]
fn toggle_fullscreen(window: Window) -> Result<(), String> {
    let is_fullscreen = window.is_fullscreen().map_err(|e| e.to_string())?;
    window
        .set_fullscreen(!is_fullscreen)
        .map_err(|e| e.to_string())
}

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(
            SqlBuilder::new()
                .add_migrations("sqlite:media.db", db::get_migrations())
                .build(),
        )
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![get_videos, toggle_fullscreen])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
