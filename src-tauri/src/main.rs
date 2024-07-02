#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod menu;
mod translator;

use crate::menu::create_menu;
use crate::translator::{Language, Translator};
use std::{
    fs, io,
    sync::{Arc, Mutex},
};
use tauri::{command, generate_context, generate_handler, Builder};
use tauri_plugin_theme::ThemePlugin;

const DATA_FILE_PATH: &str = "../lang.data";

fn write_data_to_file(file_path: &str, data: &str) -> Result<(), io::Error> {
    fs::write(file_path, data)
}

fn read_data_from_file(file_path: &str) -> Result<String, io::Error> {
    fs::read_to_string(file_path)
}

#[command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[command]
fn change_menu_language(lang: &str) {
    print!("change_menu_language: {}", lang);
    if let Err(e) = write_data_to_file(DATA_FILE_PATH, &lang) {
        eprintln!("Error writing file: {}", e);
    }
}

fn main() {
    let translator = Arc::new(Mutex::new(Translator::new()));
    let mut initial_lang = Language::English;
    match read_data_from_file(DATA_FILE_PATH) {
        Ok(data) => {
            if data == "zh" {
                initial_lang = Language::Chinese;
            }
        }
        Err(e) => eprintln!("Error reading file: {}", e),
    }

    let menu = create_menu(&translator.lock().unwrap(), &initial_lang);
    let mut ctx = generate_context!();

    Builder::default()
        .menu(menu)
        .manage(translator.clone())
        .plugin(tauri_plugin_sql::Builder::default().build())
        .plugin(ThemePlugin::init(ctx.config_mut()))
        .invoke_handler(generate_handler![greet, change_menu_language])
        .run(ctx)
        .expect("error while running tauri application");
}
