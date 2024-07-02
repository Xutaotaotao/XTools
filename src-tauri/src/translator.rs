use std::fs;
use std::collections::HashMap;
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
        
        let en_us: Value = serde_json::from_str(
            &fs::read_to_string("../src/locales/en-us.json")
                .expect("Unable to read en-us.json")
        ).expect("Invalid JSON");
        
        let zh_cn: Value = serde_json::from_str(
            &fs::read_to_string("../src/locales/zh-cn.json")
                .expect("Unable to read zh-cn.json")
        ).expect("Invalid JSON");
        
        translations.insert(Language::English, en_us);
        translations.insert(Language::Chinese, zh_cn);

        Translator { translations }
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
