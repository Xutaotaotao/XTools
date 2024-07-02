use tauri::{Menu, Submenu, MenuItem, CustomMenuItem};
use crate::translator::{Translator, Language};

pub fn create_menu(translator: &Translator, lang: &Language) -> Menu {
    // File Menu
    let file_menu = Submenu::new(translator.translate("file", lang), Menu::new()
        .add_item(CustomMenuItem::new("close".to_string(), translator.translate("close", lang)))
        .add_item(CustomMenuItem::new("quit".to_string(), translator.translate("quit", lang)))
    );

    // Edit Menu
    let edit_menu = Submenu::new(translator.translate("edit", lang), Menu::new()
        .add_native_item(MenuItem::Undo)
        .add_native_item(MenuItem::Redo)
        .add_native_item(MenuItem::Separator)
        .add_native_item(MenuItem::Cut)
        .add_native_item(MenuItem::Copy)
        .add_native_item(MenuItem::Paste)
        .add_native_item(MenuItem::SelectAll)
    );

    // View Menu
    let view_menu = Submenu::new(translator.translate("view", lang), Menu::new());

    // Window Menu
    let window_menu = Submenu::new(translator.translate("window", lang), Menu::new()
        .add_native_item(MenuItem::Minimize)
        .add_native_item(MenuItem::Zoom)
        .add_native_item(MenuItem::Separator)
        .add_native_item(MenuItem::CloseWindow)
    );

    // Help Menu
    let help_menu = Submenu::new(translator.translate("help", lang), Menu::new()
        .add_item(CustomMenuItem::new("about".to_string(), translator.translate("about", lang)))
    );

    Menu::new()
        .add_submenu(file_menu)
        .add_submenu(edit_menu)
        .add_submenu(view_menu)
        .add_submenu(window_menu)
        .add_submenu(help_menu)
        .add_item(CustomMenuItem::new("switch_lang", translator.translate("switchLanguage", lang)))
}
