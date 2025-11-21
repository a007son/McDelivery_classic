import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShoppingCart, Plus, X, ChevronRight, Menu, Settings, 
  Utensils, Heart, Coffee, IceCream,  Drumstick, Search, RotateCcw, Star, Smile, Info, Check, CupSoda, Trash2, Save, Link as LinkIcon, RefreshCw, AlertCircle, FileJson, Copy, Globe
} from 'lucide-react';

// ============================================================================
//  ▼▼▼ 請在這裡貼上您的 Google 試算表 CSV 連結 ▼▼▼
//  1. Google Sheet -> 檔案 -> 共用 -> 發布到網路 -> 選擇工作表 -> 格式選 CSV -> 發布
//  2. 複製連結貼入下方引號中，例如: "https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?output=csv"
// ============================================================================
const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSgObd-8fw7SW1nvkwXU_TLVUydm50Mie1pDiBcKUYvdRuPBOYp05y_gOUascUOoeaQy1B7KQN2UdHS/pub?gid=673442914&single=true&output=csv"; 
// ============================================================================


// --- 預設資料 (當沒有設定 Google Sheet 時使用) ---
const DEFAULT_CATEGORIES = [
  { id: 'promo', name: '期間限定', icon: <Drumstick size={18} /> },
  { id: 'value_meals', name: '超值全餐', icon: <Utensils size={18} /> },
  { id: 'signature', name: '極選系列', icon: <Star size={18} /> },
  { id: 'sharing', name: '分享盒', icon: <Heart size={18} /> },
  { id: 'happy_meal', name: 'Happy Meal', icon: <Smile size={18} /> },
  { id: 'breakfast', name: '早餐 (10:30前)', icon: <Coffee size={18} /> },
  { id: 'snacks', name: '點心', icon: <IceCream size={18} /> },
  { id: 'beverages', name: '飲料/McCafé', icon: <Coffee size={18} /> },
];

// 配餐選項
const COMBO_OPTIONS = [
  { id: 'none', name: '單點', price: 0, desc: '僅主餐', tag: '' },
  { id: 'A', name: 'A 經典配餐', price: 65, desc: '中薯', tag: '熱門' },
  { id: 'B', name: 'B 清爽配餐', price: 70, desc: '四季沙拉(大)', tag: '' },
  { id: 'C', name: 'C 勁脆配餐', price: 84, desc: '麥脆雞腿(1塊)', tag: '' },
  { id: 'D', name: 'D 炫冰配餐', price: 99, desc: '冰炫風+小薯', tag: '' },
  { id: 'E', name: 'E 豪吃配餐', price: 99, desc: '麥克雞塊(6塊)+小薯', tag: '' },
];

// 早餐配餐
const BREAKFAST_COMBOS = [
  { id: 'none', name: '單點', price: 0, desc: '僅主餐', tag: '' },
  { id: 'bf_drink', name: '配餐：薯餅飲料', price: 42, desc: '薯餅', tag: '' },
  { id: 'bf_nuggets', name: '配餐：雞塊飲料', price: 62, desc: '4塊雞塊', tag: '' },
];

// 飲料選項
const DRINK_OPTIONS = [
  { id: 'coke', name: '可口可樂', price: 0 },
  { id: 'zero', name: '零卡可樂', price: 0 },
  { id: 'sprite', name: '雪碧', price: 0 },
  { id: 'lemon_tea', name: '檸檬紅茶', price: 0 },
  { id: 'green_tea', name: '無糖綠茶', price: 0 },
  { id: 'hot_tea', name: '熱紅茶', price: 0 },
  { id: 'milk_tea_ice', name: '冰奶茶', price: 0 }, 
  { id: 'milk_tea_hot', name: '熱奶茶', price: 0 }, 
  { id: 'corn_soup', name: '玉米濃湯(小)', price: 0 },
  { id: 'americano_ice', name: '經典美式(冰)', price: 0 },
  { id: 'americano_hot', name: '經典美式(熱)', price: 0 },
  { id: 'latte_ice', name: '經典那堤(冰)', price: 0 },
  { id: 'latte_hot', name: '經典那堤(熱)', price: 0 },
  { id: 'oj', name: '柳丁汁', price: 0 },
  { id: 'milk', name: '鮮乳', price: 0 },
];

const DEFAULT_MENU_ITEMS = [
  { id: 1, category: 'value_meals', name: '大麥克', basePrice: 75, image: '🍔', calories: 540, desc: '雙層紐澳牛肉，經典不敗' },
  { id: 2, category: 'value_meals', name: '雙層牛肉吉事堡', basePrice: 75, image: '🍔', calories: 450, desc: '雙重濃郁，起司控首選' },
  { id: 3, category: 'value_meals', name: '麥香雞', basePrice: 49, image: '🍗', calories: 380, desc: '清爽生菜配上特製醬料' },
  { id: 4, category: 'value_meals', name: '麥克雞塊 (6塊)', basePrice: 69, image: '🥡', calories: 270, desc: '外酥內嫩，搭配糖醋醬' },
  { id: 5, category: 'value_meals', name: '麥克雞塊 (10塊)', basePrice: 109, image: '🥡', calories: 450, desc: '十塊才過癮' },
  { id: 6, category: 'value_meals', name: '勁辣雞腿堡', basePrice: 81, image: '🌶️', calories: 490, desc: '酥脆香辣，口感紮實' },
  { id: 7, category: 'value_meals', name: '麥香魚', basePrice: 60, image: '🐟', calories: 320, desc: '選用阿拉斯加狹鱈' },
  { id: 9, category: 'value_meals', name: '嫩煎雞腿堡', basePrice: 86, image: '🍗', calories: 360, desc: '用煎的，鎖住肉汁' },
  { id: 10, category: 'value_meals', name: '四盎司牛肉堡', basePrice: 95, image: '🥩', calories: 520, desc: '100% 紐澳牛肉' },
  { id: 11, category: 'value_meals', name: '雙層四盎司牛肉堡', basePrice: 135, image: '🥩', calories: 720, desc: '雙倍肉感' },
  { id: 12, category: 'value_meals', name: '雙層麥香雞', basePrice: 79, image: '🍗', calories: 560, desc: '加倍酥脆，加倍滿足' },
  { id: 101, category: 'promo', name: '炸蝦天婦羅安格斯牛肉堡', basePrice: 134, image: '🍤', calories: 650, desc: '厚實安格斯牛搭配酥脆炸蝦' },
  { id: 102, category: 'promo', name: '韓味雙牛魷魚堡', basePrice: 124, image: '🦑', calories: 580, desc: 'Q彈魷魚排佐韓國直送醬汁' },
  { id: 103, category: 'promo', name: '香芋派', basePrice: 35, image: '🍠', calories: 250, desc: '濃郁芋頭顆粒' },
  { id: 201, category: 'signature', name: 'BLT 安格斯牛肉堡', basePrice: 125, image: '🥓', calories: 620, desc: '極選厚實牛肉 + 培根' },
  { id: 202, category: 'signature', name: 'BLT 嫩煎雞腿堡', basePrice: 125, image: '🥓', calories: 580, desc: '極選嫩煎雞腿 + 培根' },
  { id: 203, category: 'signature', name: '蕈菇安格斯牛肉堡', basePrice: 135, image: '🍄', calories: 600, desc: '濃郁蕈菇醬' },
  { id: 204, category: 'signature', name: '凱薩辣脆雞沙拉', basePrice: 109, image: '🥗', calories: 350, desc: '清爽選擇' },
  { id: 205, category: 'signature', name: '義式烤雞沙拉', basePrice: 109, image: '🥗', calories: 320, desc: '清爽烤雞，負擔更少' },
  { id: 301, category: 'happy_meal', name: '麥克雞塊 Happy Meal', basePrice: 99, image: '😊', calories: 400, desc: '含主餐、配餐、飲料、讀本' },
  { id: 302, category: 'happy_meal', name: '陽光鱈魚堡 Happy Meal', basePrice: 99, image: '🐟', calories: 450, desc: '含主餐、配餐、飲料、讀本' },
  { id: 20, category: 'sharing', name: '麥脆雞腿分享盒 (6塊)', basePrice: 409, image: '🍗', calories: 1200, desc: '原味/辣味任選，大薯x2' },
  { id: 21, category: 'sharing', name: '雞塊雞腿分享盒', basePrice: 489, image: '🥡', calories: 1400, desc: '雞腿x6 + 雞塊x10 + 大薯x2' },
  { id: 22, category: 'sharing', name: '麥克雞塊分享盒 (20塊)', basePrice: 209, image: '🥡', calories: 900, desc: '派對首選，大薯x1' },
  { id: 23, category: 'sharing', name: '酥嫩雞翅分享盒', basePrice: 259, image: '🍗', calories: 800, desc: '酥嫩多汁' },
  { id: 24, category: 'sharing', name: '勁辣香雞翅分享盒', basePrice: 259, image: '🌶️', calories: 850, desc: '愛吃辣必點' },
  { id: 501, category: 'breakfast', name: '豬肉滿福堡加蛋', basePrice: 60, image: '🍳', calories: 380, desc: '經典早餐' },
  { id: 502, category: 'breakfast', name: '豬肉滿福堡', basePrice: 50, image: '🐷', calories: 330, desc: '純粹美味' },
  { id: 503, category: 'breakfast', name: '無敵豬肉滿福堡加蛋', basePrice: 80, image: '🍔', calories: 550, desc: '雙層豬肉' },
  { id: 504, category: 'breakfast', name: '雞塊鬆餅大早餐', basePrice: 111, image: '🥞', calories: 650, desc: '豐盛盤餐' },
  { id: 505, category: 'breakfast', name: '現烤焙果', basePrice: 57, image: '🥯', calories: 280, desc: '附乳酪抹醬' },
  { id: 506, category: 'breakfast', name: '滿福堡', basePrice: 52, image: '🍔', calories: 300, desc: '經典原味' },
  { id: 507, category: 'breakfast', name: '鬆餅 (3片)', basePrice: 55, image: '🥞', calories: 350, desc: '淋上糖漿與奶油' },
  { id: 30, category: 'snacks', name: '大薯', basePrice: 66, image: '🍟', calories: 450, desc: '經典薯條，大份滿足' },
  { id: 31, category: 'snacks', name: '中薯', basePrice: 50, image: '🍟', calories: 320, desc: '經典薯條' },
  { id: 32, category: 'snacks', name: 'OREO 冰炫風', basePrice: 60, image: '🍦', calories: 350, desc: '濃郁奶香' },
  { id: 33, category: 'snacks', name: '蘋果派', basePrice: 41, image: '🥧', calories: 230, desc: '肉桂香氣' },
  { id: 34, category: 'snacks', name: '麥克雙牛堡', basePrice: 60, image: '🍔', calories: 400, desc: '雙層牛肉 (單點)' },
  { id: 35, category: 'snacks', name: '吉事漢堡', basePrice: 48, image: '🍔', calories: 300, desc: '經典小漢堡' },
  { id: 36, category: 'snacks', name: '勁辣香雞翅 (2塊)', basePrice: 50, image: '🌶️', calories: 240, desc: '香辣過癮' },
  { id: 37, category: 'snacks', name: '酥嫩雞翅 (2塊)', basePrice: 50, image: '🍗', calories: 230, desc: '不辣的選擇' },
  { id: 38, category: 'snacks', name: '四季沙拉', basePrice: 50, image: '🥗', calories: 40, desc: '清爽蔬菜' },
  { id: 40, category: 'beverages', name: '可口可樂 (中)', basePrice: 38, image: '🥤', calories: 150, desc: '清涼暢快' },
  { id: 41, category: 'beverages', name: '玉米濃湯 (大)', basePrice: 55, image: '🌽', calories: 180, desc: '暖心暖胃' },
  { id: 42, category: 'beverages', name: '經典美式咖啡 (冰/熱)', basePrice: 65, image: '☕', calories: 10, desc: 'McCafé' },
  { id: 43, category: 'beverages', name: '經典那堤 (冰/熱)', basePrice: 75, image: '🥛', calories: 120, desc: 'McCafé' },
  { id: 44, category: 'beverages', name: '蜂蜜紅茶', basePrice: 50, image: '🍯', calories: 100, desc: '清爽微甜' },
  { id: 45, category: 'beverages', name: '檸檬紅茶 (中)', basePrice: 38, image: '🍋', calories: 140, desc: '經典口味' },
  { id: 46, category: 'beverages', name: '無糖綠茶 (中)', basePrice: 38, image: '🍵', calories: 0, desc: '解膩首選' },
  { id: 47, category: 'beverages', name: '鮮乳', basePrice: 38, image: '🥛', calories: 160, desc: '營養健康' },
  { id: 48, category: 'beverages', name: '柳丁汁', basePrice: 45, image: '🍊', calories: 140, desc: '酸甜好滋味' },
];

// --- CSV 解析工具 ---
const parseCSV = (csvText) => {
  const lines = csvText.split('\n').filter(line => line.trim() !== '');
  if (lines.length < 2) return []; // 只有標頭或空的

  const result = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    const cols = line.split(','); 
    
    if (cols.length >= 4) {
      result.push({
        id: Date.now() + i,
        category: cols[0]?.trim(),
        name: cols[1]?.trim(),
        image: cols[2]?.trim(),
        basePrice: Number(cols[3]?.trim()) || 0,
        calories: Number(cols[4]?.trim()) || 0,
        desc: cols[5]?.trim() || ''
      });
    }
  }
  return result;
};

// --- 組件 ---

export default function App() {
  // 資料狀態
  const [menuItems, setMenuItems] = useState(DEFAULT_MENU_ITEMS);
  // 優先使用寫死在代碼中的連結，如果沒有則讀取 localStorage (保留給開發者測試)
  const [csvUrl, setCsvUrl] = useState(GOOGLE_SHEET_CSV_URL || '');
  
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  
  // UI 狀態
  const [activeCategory, setActiveCategory] = useState('value_meals');
  const [cart, setCart] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // 選餐狀態
  const [comboChoice, setComboChoice] = useState('A');
  const [drinkChoice, setDrinkChoice] = useState('coke');
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Modal 狀態
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  const [editingItems, setEditingItems] = useState([]);

  // 初始化與資料抓取
  useEffect(() => {
    // 1. 優先檢查代碼中的寫死連結
    if (GOOGLE_SHEET_CSV_URL) {
      setCsvUrl(GOOGLE_SHEET_CSV_URL);
      fetchDataFromSheet(GOOGLE_SHEET_CSV_URL);
    } 
    // 2. 其次檢查 localStorage (僅供個人測試用)
    else {
      const savedCsvUrl = localStorage.getItem('menu_csv_url');
      const savedMenu = localStorage.getItem('custom_menu_v2');
      
      if (savedCsvUrl) {
        setCsvUrl(savedCsvUrl);
        fetchDataFromSheet(savedCsvUrl);
      } else if (savedMenu) {
        try {
          setMenuItems(JSON.parse(savedMenu));
        } catch (e) { console.error(e); }
      }
    }
  }, []);

  useEffect(() => {
    if (isSettingsOpen) {
      setEditingItems(JSON.parse(JSON.stringify(menuItems)));
    }
  }, [isSettingsOpen, menuItems]);

  // 從 Google Sheet 抓取資料
  const fetchDataFromSheet = async (url) => {
    if (!url) return;
    setIsLoading(true);
    setFetchError(null);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('無法讀取檔案');
      const text = await response.text();
      const parsedItems = parseCSV(text);
      
      if (parsedItems.length > 0) {
        setMenuItems(parsedItems);
        setLastUpdated(new Date().toLocaleString());
        // 不要在這裡覆蓋 localStorage，以保持代碼設定優先
      } else {
        setFetchError('CSV 格式錯誤或無資料');
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setFetchError('連線失敗，請檢查連結是否正確且已發布。');
    } finally {
      setIsLoading(false);
    }
  };

  // 過濾菜單
  const filteredItems = useMemo(() => {
    return menuItems.filter(item => item.category === activeCategory);
  }, [activeCategory, menuItems]);

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.totalPrice, 0);
  }, [cart]);

  const isMealCategory = (cat) => ['value_meals', 'promo', 'signature'].includes(cat);
  const isBreakfastCategory = (cat) => cat === 'breakfast';

  const checkoutText = useMemo(() => {
    const comboItems = cart.filter(item => item.combo && item.combo.id !== 'none');
    const singleItems = cart.filter(item => !item.combo || item.combo.id === 'none');

    let lines = [];

    comboItems.forEach(item => {
      const drinkName = item.drink ? item.drink.name : '';
      const sideName = item.combo.desc; 
      const line = `${item.main.name}(${sideName}+${drinkName}) $${item.totalPrice}`;
      lines.push(line);
    });

    if (singleItems.length > 0) {
      const names = singleItems.map(item => item.main.name).join(' + ');
      const totalSinglePrice = singleItems.reduce((sum, item) => sum + item.totalPrice, 0);
      const line = `${names} $${totalSinglePrice}`;
      lines.push(line);
    }
    
    const totalLine = `------------------\n總金額: $${cartTotal}`;
    return lines.length > 0 ? lines.join('\n') + '\n' + totalLine : '購物車是空的';
  }, [cart, cartTotal]);

  const copyToClipboard = (text, onSuccess) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      textArea.style.top = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (successful && onSuccess) onSuccess();
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
      alert('複製失敗，請手動選取複製。');
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setDrinkChoice('coke');
    if (isMealCategory(item.category)) {
      setComboChoice('A');
    } else if (isBreakfastCategory(item.category)) {
      setComboChoice('bf_drink');
    } else {
      setComboChoice('none');
    }
  };

  const addToCart = () => {
    if (!selectedItem) return;

    let currentOptions = COMBO_OPTIONS;
    if (selectedItem.category === 'breakfast') {
      currentOptions = BREAKFAST_COMBOS;
    }

    const selectedCombo = currentOptions.find(c => c.id === comboChoice) || currentOptions[0];
    const selectedDrink = DRINK_OPTIONS.find(d => d.id === drinkChoice) || DRINK_OPTIONS[0];
    
    let finalPrice = selectedItem.basePrice;
    
    if (['happy_meal'].includes(selectedItem.category)) {
       finalPrice = selectedItem.basePrice; 
    } else {
       finalPrice += selectedCombo.price;
    }

    const newItem = {
      cartId: Date.now(),
      main: selectedItem,
      combo: selectedCombo,
      drink: (selectedCombo.id !== 'none' && !['happy_meal'].includes(selectedItem.category)) ? selectedDrink : null, 
      totalPrice: finalPrice,
    };

    setCart([...cart, newItem]);
    setSelectedItem(null);
    setIsMobileMenuOpen(false);
  };

  const removeFromCart = (cartId) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

  // Settings Handlers
  const handleCsvUrlChange = (e) => {
    setCsvUrl(e.target.value);
    if (!GOOGLE_SHEET_CSV_URL) {
        localStorage.setItem('menu_csv_url', e.target.value);
    }
  };
  
  const handleSyncSheet = () => {
    if(!csvUrl) {
      alert('請輸入 CSV 連結');
      return;
    }
    fetchDataFromSheet(csvUrl);
  };

  const handleManualSave = () => {
    if (GOOGLE_SHEET_CSV_URL) {
        alert('目前使用程式碼內建連結，無法切換為手動模式。請修改程式碼中的連結。');
        return;
    }
    const processedItems = editingItems.map(item => ({
      ...item,
      basePrice: Number(item.basePrice),
      calories: Number(item.calories || 0)
    }));
    setMenuItems(processedItems);
    setCsvUrl('');
    localStorage.removeItem('menu_csv_url');
    localStorage.setItem('custom_menu_v2', JSON.stringify(processedItems));
    alert('已切換為手動編輯模式並儲存！');
    setIsSettingsOpen(false);
  };

  const handleEditChange = (index, field, value) => {
    const newItems = [...editingItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setEditingItems(newItems);
  };

  const handleRemoveRow = (index) => {
    if (window.confirm('確定要刪除此項目嗎？')) {
      setEditingItems(editingItems.filter((_, i) => i !== index));
    }
  };

  const handleAddRow = () => {
    setEditingItems([{
      id: Date.now(), category: 'value_meals', name: '新餐點', 
      basePrice: 100, image: '🍔', calories: 0, desc: ''
    }, ...editingItems]);
  };

  const handleExportJSON = () => {
    const jsonString = JSON.stringify(editingItems, null, 2);
    copyToClipboard(jsonString, () => {
      alert('菜單資料已複製到剪貼簿！');
    });
  };

  const handleResetMenu = () => {
    if (GOOGLE_SHEET_CSV_URL) {
        alert('目前使用程式碼內建連結，無法重置。');
        return;
    }
    if (window.confirm('確定要重置為系統預設菜單嗎？所有自訂修改將會遺失。')) {
      setMenuItems(DEFAULT_MENU_ITEMS);
      setEditingItems(JSON.parse(JSON.stringify(DEFAULT_MENU_ITEMS))); 
      localStorage.removeItem('custom_menu_v2');
      localStorage.removeItem('menu_csv_url');
      setCsvUrl('');
      alert('已重置為預設菜單');
    }
  }

  const handleCopyText = () => {
    copyToClipboard(checkoutText, () => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-[#F4F4F4] font-sans text-gray-800 flex flex-col">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#DB0007] text-white shadow-md h-14 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <button 
            className="md:hidden p-1 hover:bg-red-800 rounded"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
            <div className="bg-[#FFC72C] text-[#DB0007] w-8 h-8 rounded flex items-center justify-center font-black text-xl shadow-sm">M</div>
            <h1 className="text-lg font-bold tracking-wider hidden sm:block">歡樂送 <span className="font-normal text-sm opacity-90">Classic</span></h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-1 text-sm hover:bg-red-800 px-3 py-1.5 rounded transition-colors"
          >
            <Settings size={16} />
            <span className="hidden md:inline">設定</span>
          </button>

          <button 
            onClick={() => setIsCartOpen(!isCartOpen)}
            className="relative flex items-center gap-2 hover:bg-red-800 px-3 py-1.5 rounded transition-colors"
          >
            <div className="relative">
              <ShoppingCart size={20} />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#FFC72C] text-[#DB0007] text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-[#DB0007]">
                  {cart.length}
                </span>
              )}
            </div>
            <span className="font-bold text-sm hidden md:block">${cartTotal}</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 relative max-w-7xl mx-auto w-full overflow-hidden">
        
        {/* Sidebar */}
        <aside 
          className={`
            fixed md:relative z-30 top-14 md:top-0 h-[calc(100vh-3.5rem)] w-64 bg-white border-r border-gray-200
            transform transition-transform duration-300 ease-in-out overflow-y-auto scrollbar-hide
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}
        >
          <div className="p-4 flex flex-col h-full">
            <div className="text-xs font-bold text-gray-400 uppercase mb-2 px-2">全菜單分類</div>
            <nav className="space-y-1 mb-6">
              {DEFAULT_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                    activeCategory === cat.id 
                      ? 'bg-[#DB0007] text-white font-bold shadow-md' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {cat.icon}
                  <span>{cat.name}</span>
                  {activeCategory === cat.id && <ChevronRight size={16} className="ml-auto opacity-80" />}
                </button>
              ))}
            </nav>
            
            {/* 資訊與更新狀態 */}
            <div className="mt-auto p-4 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-600 leading-relaxed flex flex-col gap-2">
               {GOOGLE_SHEET_CSV_URL ? (
                 <div className="flex items-center gap-2 text-purple-700 font-bold">
                   <Globe size={14} /> 
                   <span>已連線至發布版菜單</span>
                 </div>
               ) : csvUrl ? (
                 <div className="flex items-center gap-2 text-green-700 font-bold">
                   <LinkIcon size={14} /> 已連結試算表(本地)
                 </div>
               ) : (
                 <div className="flex items-center gap-2 text-gray-500">
                   <Settings size={14} /> 使用本機/預設資料
                 </div>
               )}
               
               {lastUpdated && <div className="text-[10px] text-gray-400">最近更新: {lastUpdated}</div>}
               
               <div className="h-px bg-gray-200 my-1" />
               
               <div className="flex gap-2 items-start text-red-600">
                 <Info size={14} className="shrink-0 mt-0.5" />
                 <span>價格依區域可能不同，請以實際結帳為準。</span>
               </div>
            </div>
          </div>
          {isMobileMenuOpen && (
            <div className="fixed inset-0 bg-black/50 -z-10 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto h-[calc(100vh-3.5rem)] scroll-smooth relative">
          
          <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-2">
            <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-[#FFC72C] pl-3">
              {DEFAULT_CATEGORIES.find(c => c.id === activeCategory)?.name}
            </h2>
          </div>

          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
              {filteredItems.map(item => (
                <div 
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className="bg-white rounded border border-gray-200 shadow-sm hover:shadow-lg hover:border-[#DB0007] transition-all cursor-pointer group flex flex-col overflow-hidden h-full"
                >
                  <div className="h-40 bg-gray-50 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-500">
                    {item.image}
                  </div>
                  
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-bold text-lg text-gray-800 mb-1 group-hover:text-[#DB0007] transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-400 mb-3 line-clamp-2 flex-1">
                      {item.desc}
                    </p>
                    <div className="flex justify-between items-end mt-auto pt-3 border-t border-dashed border-gray-100">
                      <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                        {item.calories} Kcal
                      </span>
                      <span className="font-bold text-xl text-[#DB0007]">
                        ${item.basePrice}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Search size={48} className="mb-4 opacity-20" />
              <p>目前分類無餐點。</p>
            </div>
          )}
        </main>
      </div>

      {/* --- Modal: 選配餐 --- */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
            
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-[#FAFAFA]">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span className="text-2xl">{selectedItem.image}</span>
                {selectedItem.name}
              </h3>
              <button onClick={() => setSelectedItem(null)} className="hover:bg-gray-200 p-1 rounded-full">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-[#F4F4F4]">
              
              {/* 1. 配餐選擇區 (一般主餐) */}
              {isMealCategory(selectedItem.category) && (
                <div className="mb-6">
                  <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <span className="bg-[#DB0007] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                    選擇超值配餐
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {COMBO_OPTIONS.filter(opt => opt.id !== 'none').map(combo => (
                      <label 
                        key={combo.id}
                        className={`
                          relative flex p-3 rounded border-2 cursor-pointer transition-all hover:shadow-md
                          ${comboChoice === combo.id ? 'border-[#DB0007] bg-white shadow-md' : 'border-gray-200 bg-white'}
                        `}
                      >
                        <input type="radio" name="combo" className="hidden"
                          checked={comboChoice === combo.id} onChange={() => setComboChoice(combo.id)}
                        />
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className={`font-bold ${comboChoice === combo.id ? 'text-[#DB0007]' : 'text-gray-800'}`}>
                              {combo.name}
                            </span>
                            <span className="font-bold">+${combo.price}</span>
                          </div>
                          <div className="text-xs text-gray-500">{combo.desc}</div>
                        </div>
                        {comboChoice === combo.id && (
                          <div className="absolute top-0 right-0 w-0 h-0 border-t-[16px] border-r-[16px] border-t-[#DB0007] border-r-[#DB0007] rounded-bl-lg"></div>
                        )}
                      </label>
                    ))}
                  </div>
                  
                  {/* 單點選項 */}
                  <div className="mt-4 flex justify-end">
                    <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer hover:text-gray-800">
                        <input 
                          type="radio" name="combo"
                          checked={comboChoice === 'none'} onChange={() => setComboChoice('none')}
                          className="accent-[#DB0007]"
                        />
                        單點主餐 (${selectedItem.basePrice})
                    </label>
                  </div>
                </div>
              )}

              {/* 2. 配餐選擇區 (早餐) */}
              {isBreakfastCategory(selectedItem.category) && (
                 <div className="mb-6">
                    <h4 className="font-bold text-gray-700 mb-3">選擇早餐配餐</h4>
                    <div className="space-y-2">
                      {BREAKFAST_COMBOS.map(combo => (
                        <label key={combo.id} className={`flex items-center p-3 rounded border cursor-pointer ${comboChoice === combo.id ? 'border-[#DB0007] bg-red-50' : 'border-gray-200 bg-white'}`}>
                           <input type="radio" name="combo" className="mr-3 accent-[#DB0007]"
                             checked={comboChoice === combo.id} onChange={() => setComboChoice(combo.id)}
                           />
                           <div className="flex-1 flex justify-between">
                             <span>{combo.name} ({combo.desc})</span>
                             <span className="font-bold">+${combo.price}</span>
                           </div>
                        </label>
                      ))}
                    </div>
                 </div>
              )}

              {/* 3. 飲料選擇區 (只有在選擇了配餐時顯示，Happy Meal 除外) */}
              {comboChoice !== 'none' && !['happy_meal'].includes(selectedItem.category) && (
                <div className="mb-2 animate-fade-in">
                  <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                     <span className="bg-[#DB0007] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                     選擇飲料
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {DRINK_OPTIONS.map(drink => (
                      <label 
                        key={drink.id} 
                        className={`flex flex-col items-center p-3 rounded border cursor-pointer text-center transition-colors
                          ${drinkChoice === drink.id ? 'border-[#DB0007] bg-red-50 text-[#DB0007]' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}
                        `}
                      >
                         <input type="radio" name="drink" className="hidden"
                           checked={drinkChoice === drink.id} onChange={() => setDrinkChoice(drink.id)}
                         />
                         <CupSoda size={24} className="mb-2 opacity-80" />
                         <span className="text-sm font-bold">{drink.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* 其他類別 (Happy Meal) 提示 */}
              {['happy_meal'].includes(selectedItem.category) && (
                <div className="p-4 bg-blue-50 text-blue-800 rounded">
                   此組合為固定搭配，請直接加入購物車。
                </div>
              )}

            </div>

            <div className="p-4 border-t border-gray-200 bg-white flex justify-between items-center">
              <div>
                 <div className="text-sm text-gray-500">總金額</div>
                 <div className="text-3xl font-bold text-[#DB0007]">
                   ${(() => {
                      if(['happy_meal'].includes(selectedItem.category)) return selectedItem.basePrice;
                      const comboPrice = (selectedItem.category === 'breakfast' ? BREAKFAST_COMBOS : COMBO_OPTIONS).find(c => c.id === comboChoice)?.price || 0;
                      return selectedItem.basePrice + comboPrice;
                   })()}
                 </div>
              </div>
              <button 
                onClick={addToCart}
                className="bg-[#FFC72C] hover:bg-[#e6b225] text-[#DB0007] font-bold text-lg px-8 py-3 rounded shadow-sm flex items-center gap-2 transition-transform active:scale-95"
              >
                加入購物車
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- 購物車抽屜 --- */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end isolate">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-left">
            <div className="p-4 bg-[#DB0007] text-white flex justify-between items-center shadow-md">
              <h2 className="text-lg font-bold flex items-center gap-2"><ShoppingCart size={20}/> 您的訂單</h2>
              <button onClick={() => setIsCartOpen(false)}><X size={24}/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F9F9F9]">
              {cart.length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                   <ShoppingCart size={48} className="opacity-20" />
                   <p>購物車目前是空的</p>
                 </div>
              ) : (
                cart.map((item) => (
                  <div key={item.cartId} className="bg-white p-3 rounded border border-gray-200 shadow-sm flex gap-3 relative group">
                    <div className="text-3xl">{item.main.image}</div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                         <span className="font-bold text-gray-800">{item.main.name}</span>
                         <span className="font-bold text-[#DB0007]">${item.totalPrice}</span>
                      </div>
                      {item.combo && item.combo.id !== 'none' && (
                        <div className="text-xs text-gray-500 mt-1 space-y-1">
                          <div className="flex items-center gap-1">
                             <span className="border border-gray-300 rounded px-1 text-gray-600 font-bold bg-gray-50">{item.combo.desc}</span>
                          </div>
                          {item.drink && (
                            <div className="flex items-center gap-1 text-[#DB0007]">
                               <CupSoda size={12} />
                               <span>{item.drink.name}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.cartId)}
                      className="absolute -top-2 -right-2 bg-gray-200 hover:bg-red-500 hover:text-white text-gray-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 bg-white border-t border-gray-200">
               <div className="flex justify-between items-center mb-4 text-lg">
                 <span className="font-bold text-gray-700">小計金額</span>
                 <span className="font-black text-[#DB0007] text-2xl">${cartTotal}</span>
               </div>
               <button 
                 onClick={() => setIsCheckoutOpen(true)}
                 className="w-full bg-[#DB0007] text-white font-bold py-4 rounded hover:bg-red-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed" 
                 disabled={cart.length === 0}
               >
                 前往結帳
               </button>
            </div>
          </div>
        </div>
      )}

      {/* --- 結帳文字 Modal --- */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
           <div className="bg-white w-full max-w-lg rounded-lg shadow-2xl flex flex-col animate-slide-up">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Check size={20} className="text-green-600"/> 結帳訂單確認
                </h3>
                <button onClick={() => setIsCheckoutOpen(false)} className="hover:bg-gray-200 p-1 rounded-full">
                  <X size={24}/>
                </button>
              </div>
              
              <div className="p-4 flex-1">
                <div className="bg-gray-100 p-4 rounded-lg border border-gray-200 font-mono text-sm leading-relaxed whitespace-pre-wrap max-h-[50vh] overflow-y-auto">
                  {checkoutText}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  * 您可以複製上方純文字內容，傳送給點餐人員或貼到群組。
                </p>
              </div>

              <div className="p-4 border-t border-gray-200 bg-white flex gap-3">
                <button 
                  onClick={() => setIsCheckoutOpen(false)} 
                  className="flex-1 py-3 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 font-bold"
                >
                  關閉
                </button>
                <button 
                  onClick={handleCopyText}
                  className="flex-1 py-3 rounded bg-[#DB0007] text-white font-bold shadow hover:bg-red-700 flex items-center justify-center gap-2 transition-all"
                >
                  {isCopied ? (
                    <>
                      <Check size={18} /> 已複製
                    </>
                  ) : (
                    <>
                      <Copy size={18} /> 複製文字
                    </>
                  )}
                </button>
              </div>
           </div>
        </div>
      )}

      {/* --- 設定 Modal (Google Sheet & 手動編輯) --- */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
           <div className="bg-white w-full max-w-4xl h-[85vh] rounded-lg shadow-2xl flex flex-col">
              
              {/* Modal Header */}
              <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Settings size={20} /> 
                  資料來源設定
                </h3>
                <button onClick={() => setIsSettingsOpen(false)} className="hover:bg-gray-200 p-1 rounded-full">
                  <X size={24}/>
                </button>
              </div>

              <div className={`p-4 border-b border-blue-100 ${GOOGLE_SHEET_CSV_URL ? 'bg-purple-50 border-purple-100' : 'bg-blue-50'}`}>
                 <h4 className={`font-bold mb-2 flex items-center gap-2 ${GOOGLE_SHEET_CSV_URL ? 'text-purple-800' : 'text-blue-800'}`}>
                   <LinkIcon size={16}/> 
                   {GOOGLE_SHEET_CSV_URL ? '已使用寫死在程式碼中的連結' : 'Google 試算表連動 (推薦)'}
                 </h4>
                 <div className="flex gap-2">
                   <input 
                     type="text" 
                     placeholder="貼上 Google Sheet 的 CSV 發布連結..." 
                     className={`flex-1 p-2 border rounded text-sm outline-none ${GOOGLE_SHEET_CSV_URL ? 'bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed' : 'border-blue-300 focus:ring-2 focus:ring-blue-500'}`}
                     value={csvUrl}
                     onChange={handleCsvUrlChange}
                     disabled={!!GOOGLE_SHEET_CSV_URL}
                   />
                   <button 
                     onClick={handleSyncSheet}
                     disabled={isLoading || !!GOOGLE_SHEET_CSV_URL}
                     className={`px-4 py-2 text-white rounded flex items-center gap-2 whitespace-nowrap ${GOOGLE_SHEET_CSV_URL ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                   >
                     {isLoading ? <RefreshCw size={16} className="animate-spin"/> : <RefreshCw size={16}/>}
                     讀取
                   </button>
                 </div>
                 {fetchError && (
                   <div className="mt-2 text-xs text-red-600 flex items-center gap-1">
                     <AlertCircle size={12} /> {fetchError}
                   </div>
                 )}
                 <div className={`mt-2 text-xs leading-relaxed ${GOOGLE_SHEET_CSV_URL ? 'text-purple-600' : 'text-blue-600'}`}>
                   {GOOGLE_SHEET_CSV_URL ? (
                     <>
                        * 目前系統已鎖定使用程式碼中定義的 <code>GOOGLE_SHEET_CSV_URL</code>。<br/>
                        * 若要修改連結，請直接編輯程式碼第 12 行並重新發布。
                     </>
                   ) : (
                     <>
                        * 在這裡輸入連結僅供測試，<b>重新整理後可能會消失</b>。<br/>
                        * 若要永久生效，請將連結複製並貼入程式碼頂端的 <code>GOOGLE_SHEET_CSV_URL</code> 變數中。
                     </>
                   )}
                 </div>
              </div>

              {/* Table Editor Title */}
              <div className="p-2 bg-gray-100 border-b border-gray-200 flex justify-between items-center">
                 <span className="text-xs font-bold text-gray-500 uppercase px-2">
                   資料預覽 (唯讀)
                 </span>
                 <div className="flex gap-2">
                    <button 
                      onClick={handleExportJSON} 
                      className="flex items-center gap-2 text-gray-600 hover:text-blue-600 px-3 py-1 rounded hover:bg-blue-50 transition-colors text-xs border border-transparent hover:border-blue-200"
                    >
                      <FileJson size={12} /> 匯出 JSON
                    </button>
                    {!GOOGLE_SHEET_CSV_URL && !csvUrl && (
                        <>
                            <button 
                            onClick={handleResetMenu} 
                            className="flex items-center gap-2 text-gray-500 hover:text-red-600 px-3 py-1 rounded hover:bg-red-50 transition-colors text-xs"
                            >
                            <RotateCcw size={12} /> 重置
                            </button>
                            <button 
                            onClick={handleAddRow}
                            className="flex items-center gap-1 px-3 py-1 bg-white border border-gray-300 text-gray-600 rounded text-xs hover:bg-gray-50"
                            >
                            <Plus size={12} /> 新增
                            </button>
                        </>
                    )}
                 </div>
              </div>
              
              {/* Table Container */}
              <div className="flex-1 overflow-auto bg-white relative">
                <table className="w-full text-left text-sm border-collapse">
                  <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                    <tr>
                      <th className="p-2 border-b font-bold text-gray-600 w-32">分類</th>
                      <th className="p-2 border-b font-bold text-gray-600">品名</th>
                      <th className="p-2 border-b font-bold text-gray-600 w-16">Emoji</th>
                      <th className="p-2 border-b font-bold text-gray-600 w-20">價格</th>
                      <th className="p-2 border-b font-bold text-gray-600 w-20">熱量</th>
                      {!GOOGLE_SHEET_CSV_URL && !csvUrl && <th className="p-2 border-b font-bold text-gray-600 w-10"></th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {editingItems.map((item, index) => (
                      <tr key={item.id || index} className="hover:bg-gray-50 group">
                        <td className="p-2">
                          {GOOGLE_SHEET_CSV_URL || csvUrl ? (
                              <span className="text-gray-600">
                                {DEFAULT_CATEGORIES.find(c => c.id === item.category)?.name || item.category}
                              </span>
                          ) : (
                            <select 
                                value={item.category}
                                onChange={(e) => handleEditChange(index, 'category', e.target.value)}
                                className="w-full p-1 border border-gray-200 rounded bg-transparent"
                            >
                                {DEFAULT_CATEGORIES.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                          )}
                        </td>
                        <td className="p-2">
                            {GOOGLE_SHEET_CSV_URL || csvUrl ? (
                                item.name
                            ) : (
                                <input 
                                    type="text" 
                                    value={item.name}
                                    onChange={(e) => handleEditChange(index, 'name', e.target.value)}
                                    className="w-full p-1 border border-gray-200 rounded"
                                />
                            )}
                        </td>
                        <td className="p-2">
                            {GOOGLE_SHEET_CSV_URL || csvUrl ? (
                                <span className="text-center block">{item.image}</span>
                            ) : (
                                <input 
                                    type="text" 
                                    value={item.image}
                                    onChange={(e) => handleEditChange(index, 'image', e.target.value)}
                                    className="w-full p-1 border border-gray-200 rounded text-center"
                                />
                            )}
                        </td>
                        <td className="p-2">
                            {GOOGLE_SHEET_CSV_URL || csvUrl ? (
                                item.basePrice
                            ) : (
                                <input 
                                    type="number" 
                                    value={item.basePrice}
                                    onChange={(e) => handleEditChange(index, 'basePrice', e.target.value)}
                                    className="w-full p-1 border border-gray-200 rounded"
                                />
                            )}
                        </td>
                        <td className="p-2">
                            {GOOGLE_SHEET_CSV_URL || csvUrl ? (
                                item.calories
                            ) : (
                                <input 
                                    type="number" 
                                    value={item.calories}
                                    onChange={(e) => handleEditChange(index, 'calories', e.target.value)}
                                    className="w-full p-1 border border-gray-200 rounded text-gray-400"
                                />
                            )}
                        </td>
                        {!GOOGLE_SHEET_CSV_URL && !csvUrl && (
                            <td className="p-2 text-center">
                            <button 
                                onClick={() => handleRemoveRow(index)}
                                className="text-gray-300 hover:text-red-600 transition-colors"
                            >
                                <Trash2 size={14} />
                            </button>
                            </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                  <button 
                    onClick={() => setIsSettingsOpen(false)} 
                    className="px-4 py-2 rounded text-gray-600 hover:bg-gray-200 text-sm font-bold"
                  >
                    關閉
                  </button>
                  {!GOOGLE_SHEET_CSV_URL && !csvUrl && (
                    <button 
                      onClick={handleManualSave} 
                      className="px-6 py-2 rounded bg-gray-800 text-white font-bold shadow hover:bg-black flex items-center gap-2 text-sm"
                    >
                      <Save size={16} /> 儲存手動修改
                    </button>
                  )}
              </div>
           </div>
        </div>
      )}

    </div>
  );
}
