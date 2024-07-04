use tauri::{Menu, Submenu, CustomMenuItem};
use crate::translator::{Translator, Language};

pub fn create_menu(translator: &Translator, lang: &Language) -> Menu {
    // File Menu
    let file_menu = Submenu::new(translator.translate("file", lang), Menu::new()
        .add_item(CustomMenuItem::new("about".to_string(), translator.translate("about", lang)))
        .add_item(CustomMenuItem::new("quit".to_string(), translator.translate("quit", lang)))
    );

    // Edit Menu
    let edit_menu = Submenu::new(translator.translate("edit", lang), Menu::new()
        .add_item(CustomMenuItem::new("undo".to_string(), translator.translate("undo", lang)))
        .add_item(CustomMenuItem::new("redo".to_string(), translator.translate("redo", lang)))
        .add_item(CustomMenuItem::new("cut".to_string(), translator.translate("cut", lang)))
        .add_item(CustomMenuItem::new("copy".to_string(), translator.translate("copy", lang)))
        .add_item(CustomMenuItem::new("paste".to_string(), translator.translate("paste", lang)))
        .add_item(CustomMenuItem::new("selectAll".to_string(), translator.translate("selectAll", lang)))
    );

    // Window Menu
    let window_menu = Submenu::new(translator.translate("window", lang), Menu::new()
        .add_item(CustomMenuItem::new("minimize".to_string(), translator.translate("minimize", lang)))
        .add_item(CustomMenuItem::new("zoom".to_string(), translator.translate("zoom", lang)))
        .add_item(CustomMenuItem::new("close".to_string(), translator.translate("close", lang)))
    );

    Menu::new()
        .add_submenu(file_menu)
        .add_submenu(edit_menu)
        .add_submenu(window_menu)
}
