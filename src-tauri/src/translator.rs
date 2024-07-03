use std::{env, fs};
use std::collections::HashMap;
use std::path::PathBuf;
use serde_json::Value;

#[derive(Clone, serde::Serialize, serde::Deserialize, Eq, PartialEq, Hash)]
pub enum Language {
    English,
    Chinese,
}

pub struct Translator {
    translations: HashMap<Language, Value>,
}

impl Translator {
    pub fn new() -> Self {
        let mut translations = HashMap::new();
        
        let resource_path = Self::get_resource_path();
        
        let en_us: Value = serde_json::from_str(
            &fs::read_to_string(resource_path.join("locales/en-us.json"))
                .expect("Unable to read en-us.json")
        ).expect("Invalid JSON");
        
        let zh_cn: Value = serde_json::from_str(
            &fs::read_to_string(resource_path.join("locales/zh-cn.json"))
                .expect("Unable to read zh-cn.json")
        ).expect("Invalid JSON");
        
        translations.insert(Language::English, en_us);
        translations.insert(Language::Chinese, zh_cn);

        Translator { translations }
    }

    fn get_resource_path() -> PathBuf {
        if cfg!(debug_assertions) {
            // 开发环境
            PathBuf::from("../src")
        } else {
            // 打包环境
            env::current_exe()
                .expect("Failed to get current executable path")
                .parent()
                .expect("Failed to get parent directory")
                .parent()
                .expect("Failed to get parent directory")
                .join("Resources")
                .join("_up_")
                .join("src")
        }
    }

    pub fn translate(&self, key: &str, lang: &Language) -> String {
        self.translations
            .get(lang)
            .and_then(|json| json.get(key))
            .and_then(|v| v.as_str())
            .unwrap_or(key)
            .to_string()
    }
}
