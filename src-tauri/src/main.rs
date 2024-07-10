#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod menu;
mod translator;

use crate::menu::create_menu;
use crate::translator::{Language, Translator};
use std::process;
use std::{
    fs, io,
    path::PathBuf,
    sync::{Arc, Mutex},
};
use tauri::api::path::app_data_dir;
use tauri::{command, generate_context, generate_handler, Builder, Config};
use tauri_plugin_log::LogTarget;
use tauri_plugin_theme::ThemePlugin;
use log::LevelFilter;

fn get_data_file_path(config: &tauri::Config) -> PathBuf {
    app_data_dir(config).unwrap().join("lang.data")
}

fn write_data_to_file(config: &tauri::Config, data: &str) -> Result<(), io::Error> {
    let file_path = get_data_file_path(config);
    fs::write(file_path, data)
}

fn read_data_from_file(config: &tauri::Config) -> Result<String, io::Error> {
    let file_path = get_data_file_path(config);
    fs::read_to_string(file_path)
}

#[command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[command]
fn change_menu_language(config: tauri::State<'_, Config>, lang: &str) {
    log::info!("change_menu_language: {}", lang);
    if let Err(e) = write_data_to_file(&config, lang) {
        eprintln!("Error writing file: {}", e);
    }
}

fn main() {
    let translator = Arc::new(Mutex::new(Translator::new()));
    let mut ctx = generate_context!();
    let config = ctx.config().clone();
    let mut initial_lang: Option<Language> = None;

    // 首先尝试从文件读取语言设置
    match read_data_from_file(&config) {
        Ok(data) => {
            initial_lang = match data.as_str() {
                "zh" => Some(Language::Chinese),
                "en" => Some(Language::English),
                // 可以添加其他语言
                _ => None,
            };
        }
        Err(e) => {
            eprintln!("Error reading file: {}", e);
        }
    }

    // 如果文件中没有有效的语言设置，则尝试使用系统语言
    if initial_lang.is_none() {
        if let Some(locale) = tauri::api::os::locale() {
            initial_lang = if locale.starts_with("zh") {
                Some(Language::Chinese)
            } else if locale.starts_with("en") {
                Some(Language::English)
            } else {
                None
            };
        }
    }

    // 如果仍然没有设置语言，使用默认语言（这里设置为英语）
    let initial_lang = initial_lang.unwrap_or(Language::English);

    let menu = create_menu(&translator.lock().unwrap(), &initial_lang);
    Builder::default()
        .menu(menu)
        .on_menu_event(|event| {
            let window = event.window();
            match event.menu_item_id() {
                "about" => {
                    tauri::api::dialog::message(Some(&window), "关于", "XTools, 完全本地化工具。");
                }
                "quit" => {
                    process::exit(0);
                }
                "undo" => {
                    window.eval("document.execCommand('undo')").unwrap();
                }
                "redo" => {
                    window.eval("document.execCommand('redo')").unwrap();
                }
                "cut" => {
                    window.eval("document.execCommand('cut')").unwrap();
                }
                "copy" => {
                    window.eval("document.execCommand('copy')").unwrap();
                }
                "paste" => {
                    window.eval("document.execCommand('paste')").unwrap();
                }
                "selectAll" => {
                    window.eval("document.execCommand('selectAll')").unwrap();
                }
                "close" => {
                    window.close().unwrap();
                }
                "minimize" => {
                    window.minimize().unwrap();
                }
                "zoom" => {
                    if window.is_maximized().unwrap() {
                        window.unmaximize().unwrap();
                    } else {
                        window.maximize().unwrap();
                    }
                }
                _ => {}
            }
        })
        .manage(translator.clone())
        .manage(config)
        .plugin(tauri_plugin_sql::Builder::default().build())
        .plugin(ThemePlugin::init(ctx.config_mut()))
        .plugin(
            tauri_plugin_log::Builder::default()
            .targets([LogTarget::LogDir, LogTarget::Stdout, LogTarget::Webview])
            .level(LevelFilter::Info)
            .build()
        )
        .invoke_handler(generate_handler![greet, change_menu_language])
        .run(ctx)
        .expect("error while running tauri application");
}
