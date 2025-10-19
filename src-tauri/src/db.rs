use tauri_plugin_sql::{Migration, MigrationKind};

pub struct TableCreate {
    pub videos: &'static str,
    pub schedule: &'static str,
    pub app_settings: &'static str,
}

pub const TABLE_CREATE: TableCreate = TableCreate {
    videos: r#"
        CREATE TABLE IF NOT EXISTS videos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT,
            filepath TEXT,
            duration INTEGER
        )
    "#,
    schedule: r#"
        CREATE TABLE IF NOT EXISTS schedule (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            video_id INTEGER,
            start_time DATETIME,
            end_time DATETIME,
            max_duration INTEGER,
            FOREIGN KEY(video_id) REFERENCES videos(id) ON DELETE CASCADE
        )
    "#,
    app_settings: r#"
        CREATE TABLE IF NOT EXISTS app_settings (
            id INTEGER PRIMARY KEY CHECK(id = 1),
            pos_x INTEGER DEFAULT 0,
            pos_y INTEGER DEFAULT 0,
            width INTEGER DEFAULT 288,
            height INTEGER DEFAULT 192
        )
    "#,
};

/// Return migrations using TABLE_CREATE constants
pub fn get_migrations() -> Vec<Migration> {
    vec![
        Migration {
            version: 1,
            description: "create videos table",
            sql: TABLE_CREATE.videos,
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "create schedule table",
            sql: TABLE_CREATE.schedule,
            kind: MigrationKind::Up,
        },
        Migration {
            version: 3,
            description: "create app_settings table",
            sql: TABLE_CREATE.app_settings,
            kind: MigrationKind::Up,
        },
    ]
}
