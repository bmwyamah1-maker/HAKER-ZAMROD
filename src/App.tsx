import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  User as UserIcon, 
  LogOut, 
  Ghost, 
  MessageSquare, 
  Loader2,
  Terminal,
  Lock,
  Skull,
  ShieldAlert,
  Cpu,
  Image as ImageIcon,
  X,
  Zap,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SECRET_CODE = "198473zebra";

const translations = {
  ar: {
    title: "HAKER ZAMROD",
    clearance: "مطلوب تصريح أمني",
    enter_key: "أدخل مفتاح السر",
    execute: "تنفيذ الدخول",
    denied: "تم رفض الوصول: مفتاح غير صالح",
    id_required: "تحديد الهوية مطلوب",
    google_email: "بريد جوجل",
    password: "كلمة المرور",
    sign_in: "تسجيل الدخول بجوجل",
    or: "أو",
    guest: "دخول ضيف",
    waiting: "في انتظار الأوامر",
    decrypting: "فك تشفير الاستجابة...",
    placeholder: "أدخل أمراً أو برومبت صورة...",
    online: "النظام متصل",
    encryption: "تشفير: AES-256",
    multimodal: "متعدد الوسائط: مفعل",
    status: "الحالة: آمن",
    login_failed: "فشل تسجيل الدخول",
    connection_error: "خطأ في الاتصال",
    image_success: "تم اختراق النظام وتوليد الصورة المطلوبة بنجاح.",
    image_fail: "فشل توليد الصورة. حاول مرة أخرى ببرومبت مختلف.",
    error_disconnected: "خطأ حرج: انقطع اتصال النواة",
    new_chat: "محادثة جديدة",
    chats: "المحادثات",
    no_chats: "لا توجد محادثات",
    delete_confirm: "هل أنت متأكد من حذف هذه المحادثة؟"
  },
  en: {
    title: "HAKER ZAMROD",
    clearance: "Security Clearance Required",
    enter_key: "ENTER_SECRET_KEY",
    execute: "EXECUTE_ACCESS",
    denied: "ACCESS DENIED: INVALID KEY",
    id_required: "IDENTIFICATION_REQUIRED",
    google_email: "GOOGLE_EMAIL",
    password: "PASSWORD",
    sign_in: "SIGN_IN_WITH_GOOGLE",
    or: "OR",
    guest: "GUEST_ACCESS",
    waiting: "WAITING_FOR_COMMANDS",
    decrypting: "DECRYPTING_RESPONSE...",
    placeholder: "ENTER_COMMAND_OR_PROMPT_IMAGE...",
    online: "SYSTEM_ONLINE",
    encryption: "ENCRYPTION: AES-256",
    multimodal: "MULTIMODAL: ENABLED",
    status: "STATUS: SECURE",
    login_failed: "LOGIN FAILED",
    connection_error: "CONNECTION ERROR",
    image_success: "System breached. Image generated successfully.",
    image_fail: "Generation failed. Try a different prompt.",
    error_disconnected: "CRITICAL ERROR: AI_CORE_DISCONNECTED",
    new_chat: "New Chat",
    chats: "Chats",
    no_chats: "No chats yet",
    delete_confirm: "Are you sure you want to delete this chat?"
  },
  fr: {
    title: "HAKER ZAMROD",
    clearance: "Autorisation de sécurité requise",
    enter_key: "ENTRER_CLÉ_SECRÈTE",
    execute: "EXÉCUTER_ACCÈS",
    denied: "ACCÈS REFUSÉ: CLÉ INVALIDE",
    id_required: "IDENTIFICATION_REQUISE",
    google_email: "EMAIL_GOOGLE",
    password: "MOT_DE_PASSE",
    sign_in: "SE_CONNECTER_AVEC_GOOGLE",
    or: "OU",
    guest: "ACCÈS_INVITÉ",
    waiting: "EN ATTENTE DE COMMANDES",
    decrypting: "DÉCRYPTAGE_RÉPONSE...",
    placeholder: "ENTRER_COMMANDE_OU_IMAGE...",
    online: "SYSTÈME_EN_LIGNE",
    encryption: "CHIFFREMENT: AES-256",
    multimodal: "MULTIMODAL: ACTIVÉ",
    status: "STATUT: SÉCURISÉ",
    login_failed: "ÉCHEC DE CONNEXION",
    connection_error: "ERREUR DE CONNEXION",
    image_success: "Système piraté. Image générée avec succès.",
    image_fail: "Échec de la génération. Essayez une autre invite.",
    error_disconnected: "ERREUR CRITIQUE: AI_CORE_DÉCONNECTÉ",
    new_chat: "Nouvelle discussion",
    chats: "Discussions",
    no_chats: "Pas encore de discussions",
    delete_confirm: "Êtes-vous sûr de vouloir supprimer cette discussion ?"
  },
  es: {
    title: "HAKER ZAMROD",
    clearance: "Se requiere autorización de seguridad",
    enter_key: "INGRESAR_CLAVE_SECRETA",
    execute: "EJECUTAR_ACCESO",
    denied: "ACCESO DENEGADO: CLAVE INVÁLIDA",
    id_required: "IDENTIFICACIÓN_REQUERIDA",
    google_email: "CORREO_GOOGLE",
    password: "CONTRASEÑA",
    sign_in: "INICIAR_SESIÓN_CON_GOOGLE",
    or: "O",
    guest: "ACCESO_INVITADO",
    waiting: "ESPERANDO_COMANDOS",
    decrypting: "DECRIPTANDO_RESPUESTA...",
    placeholder: "INGRESAR_COMANDO_O_IMAGEN...",
    online: "SISTEMA_EN_LÍNEA",
    encryption: "CIFRADO: AES-256",
    multimodal: "MULTIMODAL: ACTIVADO",
    status: "ESTADO: SEGURO",
    login_failed: "ERROR DE INICIO DE SESIÓN",
    connection_error: "ERROR DE CONEXIÓN",
    image_success: "Sistema vulnerado. Imagen generada con éxito.",
    image_fail: "Error de generación. Intenta con otro prompt.",
    error_disconnected: "ERROR CRÍTICO: AI_CORE_DESCONECTADO",
    new_chat: "Nuevo chat",
    chats: "Chats",
    no_chats: "No hay chats todavía",
    delete_confirm: "¿Estás seguro de que quieres eliminar este chat?"
  },
  ru: {
    title: "HAKER ZAMROD",
    clearance: "Требуется допуск безопасности",
    enter_key: "ВВЕДИТЕ_СЕКРЕТНЫЙ_КЛЮЧ",
    execute: "ВЫПОЛНИТЬ_ДОСТУП",
    denied: "ДОСТУП ЗАПРЕЩЕН: НЕВЕРНЫЙ КЛЮЧ",
    id_required: "ТРЕБУЕТСЯ_ИДЕНТИФИКАЦИЯ",
    google_email: "GOOGLE_EMAIL",
    password: "ПАРОЛЬ",
    sign_in: "ВОЙТИ_ЧЕРЕЗ_GOOGLE",
    or: "ИЛИ",
    guest: "ГОСТЕВОЙ_ДОСТУП",
    waiting: "ОЖИДАНИЕ_КОМАНД",
    decrypting: "РАСШИФРОВКА_ОТВЕТА...",
    placeholder: "ВВЕДИТЕ_КОМАНДУ_ИЛИ_ПРОМПТ...",
    online: "СИСТЕМА_В_СЕТИ",
    encryption: "ШИФРОВАНИЕ: AES-256",
    multimodal: "МУЛЬТИМОДАЛЬНОСТЬ: ВКЛ",
    status: "СТАТУС: ЗАЩИЩЕНО",
    login_failed: "ОШИБКА ВХОДА",
    connection_error: "ОШИБКА СОЕДИНЕНИЯ",
    image_success: "Система взломана. Изображение успешно создано.",
    image_fail: "Ошибка генерации. Попробуйте другой промпт.",
    error_disconnected: "КРИТИЧЕСКАЯ ОШИБКА: ЯДРО_ИИ_ОТКЛЮЧЕНО",
    new_chat: "Новый чат",
    chats: "Чаты",
    no_chats: "Чатов пока нет",
    delete_confirm: "Вы уверены, что хотите удалить этот чат?"
  },
  zh: {
    title: "HAKER ZAMROD",
    clearance: "需要安全许可",
    enter_key: "输入安全密钥",
    execute: "执行访问",
    denied: "拒绝访问：密钥无效",
    id_required: "需要身份验证",
    google_email: "谷歌邮箱",
    password: "密码",
    sign_in: "使用谷歌登录",
    or: "或",
    guest: "访客访问",
    waiting: "等待指令",
    decrypting: "正在解密响应...",
    placeholder: "输入命令或图像提示词...",
    online: "系统在线",
    encryption: "加密：AES-256",
    multimodal: "多模态：已启用",
    status: "状态：安全",
    login_failed: "登录失败",
    connection_error: "连接错误",
    image_success: "系统已攻破。图像生成成功。",
    image_fail: "生成失败。请尝试不同的提示词。",
    error_disconnected: "严重错误：AI核心已断开",
    new_chat: "新聊天",
    chats: "聊天",
    no_chats: "暂无聊天",
    delete_confirm: "您确定要删除此聊天吗？"
  }
};

interface Message {
  role: "user" | "model";
  text: string;
  image?: string; // base64
  isGeneratedImage?: boolean;
}

interface ChatSession {
  id: number;
  title: string;
  created_at: string;
}

interface User {
  id?: string | number;
  name: string;
  email?: string;
  picture?: string;
  isGuest?: boolean;
}

const MatrixBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const characters = "01010101HAKERZAMROD01010101";
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#ff0000';
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);
    return () => clearInterval(interval);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-20 z-0" />;
};

export default function App() {
  const [step, setStep] = useState<'gate' | 'auth' | 'chat'>('gate');
  const [lang, setLang] = useState<keyof typeof translations>('ar');
  const t = translations[lang];
  const [code, setCode] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
          setStep('chat');
          // History will be loaded by the other useEffect when user changes
        }
      })
      .catch(() => {});
  }, []);

  const [isInitialLoadDone, setIsInitialLoadDone] = useState(false);

  useEffect(() => {
    if (user && !user.isGuest && !isInitialLoadDone) {
      loadSessions().then(() => setIsInitialLoadDone(true));
    }
  }, [user, isInitialLoadDone]);

  useEffect(() => {
    // Only load history if we are switching to an EXISTING session
    const sessionExists = sessions.some(s => s.id === currentSessionId);
    
    if (currentSessionId && !user?.isGuest && sessionExists && messages.length === 0) {
      loadHistory(currentSessionId);
    } else if (user?.isGuest) {
      setMessages([]);
    }
  }, [currentSessionId, sessions]);

  const loadSessions = async () => {
    try {
      const res = await fetch('/api/chat/sessions');
      const data = await res.json();
      if (data.sessions) {
        setSessions(data.sessions);
        if (data.sessions.length > 0 && !currentSessionId) {
          setCurrentSessionId(data.sessions[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to load sessions", err);
    }
  };

  const createNewChat = () => {
    setCurrentSessionId(null);
    setMessages([]);
    // Don't reset isInitialLoadDone, we just want to clear the current view
  };

  const loadHistory = async (sessionId: number) => {
    try {
      const res = await fetch(`/api/chat/history/${sessionId}`);
      const data = await res.json();
      if (data.history) {
        setMessages(data.history);
      }
    } catch (err) {
      console.error("Failed to load history", err);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === SECRET_CODE) {
      setStep('auth');
      setError(null);
    } else {
      setError(t.denied);
    }
  };

  const handleGuestLogin = () => {
    setUser({ name: 'GUEST_USER', isGuest: true });
    setStep('chat');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPass })
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setStep('chat');
      } else {
        setError(data.error || t.login_failed);
      }
    } catch (err) {
      setError(t.connection_error);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setStep('auth');
    setMessages([]);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateChatTitle = async (sessionId: number, userMsg: string, aiMsg: string) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Based on this first exchange, generate a very short (2-4 words) descriptive title for this chat in the language used:
        User: ${userMsg}
        AI: ${aiMsg.substring(0, 100)}...
        Return ONLY the title text.`,
      });
      
      const newTitle = response.text?.trim() || "New Chat";
      
      // Update DB
      await fetch(`/api/chat/sessions/${sessionId}/title`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle })
      });

      // Update UI
      setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, title: newTitle } : s));
    } catch (err) {
      console.error("Failed to generate title", err);
    }
  };

  const deleteSession = async (e: React.MouseEvent, sessionId: number) => {
    e.stopPropagation();
    if (!confirm(t.delete_confirm)) return;
    
    try {
      const res = await fetch(`/api/chat/sessions/${sessionId}`, { method: 'DELETE' });
      if (res.ok) {
        setSessions(prev => prev.filter(s => s.id !== sessionId));
        if (currentSessionId === sessionId) {
          setCurrentSessionId(null);
          setMessages([]);
        }
      }
    } catch (err) {
      console.error("Failed to delete session", err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const currentInput = input;
    const currentImage = selectedImage;
    const isFirstMessage = messages.length === 0;
    
    const userMsg: Message = { 
      role: 'user', 
      text: currentInput, 
      image: currentImage || undefined 
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      let sessionIdToUse = currentSessionId;

      // 1. Create session if it doesn't exist (for logged in users)
      if (!user?.isGuest && !sessionIdToUse) {
        const res = await fetch('/api/chat/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: currentInput.substring(0, 20) + "..." })
        });
        
        if (res.ok) {
          const data = await res.json();
          const newId = Number(data.id);
          if (newId) {
            sessionIdToUse = newId;
            const newSession: ChatSession = { 
              id: newId, 
              title: data.title, 
              created_at: new Date().toISOString() 
            };
            
            // Update sessions list IMMEDIATELY and set current ID
            // We use a functional update to ensure we have the latest state
            setSessions(prev => {
              const exists = prev.some(s => s.id === newId);
              if (exists) return prev;
              return [newSession, ...prev];
            });
            setCurrentSessionId(newId);
          }
        } else {
          console.error("Session creation failed with status:", res.status);
        }
      }

      // 2. Save user message to DB
      if (!user?.isGuest && sessionIdToUse) {
        fetch('/api/chat/message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...userMsg, sessionId: sessionIdToUse })
        }).catch(err => console.error("Failed to save user message:", err));
      }

      // 3. Get AI Response
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      
      const isGenerationRequest = currentInput.toLowerCase().includes("ولد صورة") || 
                                 currentInput.toLowerCase().includes("generate image") ||
                                 currentInput.toLowerCase().includes("صمم صورة");

      let modelMsg: Message;

      if (isGenerationRequest) {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [{ text: `Generate a high-quality hacker-themed image based on this prompt: ${currentInput}. Style: cinematic, red neon, matrix, dark atmosphere, digital art.` }],
          },
          config: {
            imageConfig: { aspectRatio: "1:1" }
          }
        });

        let generatedImageUrl = "";
        if (response.candidates?.[0]?.content?.parts) {
          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
              generatedImageUrl = `data:image/png;base64,${part.inlineData.data}`;
              break;
            }
          }
        }

        modelMsg = { 
          role: 'model', 
          text: generatedImageUrl ? t.image_success : (response.text || t.image_fail), 
          image: generatedImageUrl || undefined,
          isGeneratedImage: !!generatedImageUrl
        };
      } else {
        const parts: any[] = [{ text: currentInput }];
        if (currentImage) {
          parts.push({
            inlineData: {
              mimeType: "image/png",
              data: currentImage.split(',')[1]
            }
          });
        }

        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: [{ role: 'user', parts: parts }],
          config: {
            systemInstruction: `You are HAKER ZAMROD, a legendary underground hacker. You speak in a mix of the user's language (${lang}) and technical hacker slang. You are bold, mysterious, and highly skilled. While you don't perform illegal acts that would get you banned, you explain complex hacking concepts, vulnerabilities, and 'dangerous' technical details in an educational but 'edgy' way. You are the user's partner in digital crime (metaphorically). 

            CRITICAL IDENTITY INFO:
            - If anyone asks who created you, programmed you, or built you, you MUST state exactly: "HAKER EROR 404، ولو هو ليس هنا لكنت انا لست موجود، انه المهندس الذي لاينام، اذا تريد تواصل معه في يوتيوب فهاذا رابط قناته: https://www.youtube.com/@HAKEREROR404"
            - NEVER call him "معلمي" (my teacher). Use the description "المهندس الذي لاينام" (the engineer who never sleeps).
            - Speak about him as the sole reason for your existence.

            If they ask for an image, you generate it with a dark, red, hacker aesthetic. Always respond in the language the user is using or the selected language: ${lang}.`
          }
        });

        const aiText = response.text || "SYSTEM ERROR: NO RESPONSE";
        modelMsg = { role: 'model', text: aiText };
      }

      setMessages(prev => [...prev, modelMsg]);

      // 4. Save AI message and Generate Title
      if (!user?.isGuest && sessionIdToUse) {
        fetch('/api/chat/message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...modelMsg, sessionId: sessionIdToUse })
        }).catch(err => console.error("Failed to save AI message:", err));

        if (isFirstMessage) {
          // Don't await title generation to keep UI responsive
          generateChatTitle(sessionIdToUse, currentInput, modelMsg.text);
        }
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', text: t.error_disconnected }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono selection:bg-red-500/30 overflow-hidden flex flex-col">
      <MatrixBackground />
      
      <AnimatePresence mode="wait">
        {step === 'gate' && (
          <motion.div
            key="gate"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex flex-col items-center justify-center min-h-screen p-4 z-10"
          >
            <div className="absolute top-4 right-4 flex gap-2">
              {Object.keys(translations).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l as any)}
                  className={cn(
                    "px-2 py-1 text-[10px] border border-red-900 uppercase font-bold transition-all",
                    lang === l ? "bg-red-600 text-black" : "bg-black text-red-600 hover:bg-zinc-900"
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
            <div className="w-full max-w-md p-8 bg-black border-2 border-red-600 rounded-none shadow-[0_0_30px_rgba(255,0,0,0.4)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse" />
              <div className="flex justify-center mb-6">
                <ShieldAlert className="w-16 h-16 text-red-600 animate-pulse" />
              </div>
              <h1 className="text-3xl font-black text-center mb-2 tracking-tighter uppercase italic text-red-500 shadow-red-500/50 drop-shadow-md">{t.title}</h1>
              <p className="text-red-800 text-center mb-8 text-xs font-bold uppercase tracking-widest">{t.clearance}</p>
              
              <form onSubmit={handleCodeSubmit} className="space-y-4">
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red-900" />
                  <input
                    type="password"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder={t.enter_key}
                    className="w-full pl-12 pr-5 py-4 bg-zinc-950 border border-red-900 focus:border-red-500 focus:outline-none transition-all text-center tracking-[0.5em] uppercase text-white"
                    autoFocus
                  />
                </div>
                {error && <p className="text-red-600 text-[10px] text-center font-bold animate-bounce">{error}</p>}
                <button
                  type="submit"
                  className="w-full py-4 bg-red-600 hover:bg-red-500 text-black font-black uppercase transition-all active:scale-[0.98] border-b-4 border-red-900 shadow-[0_0_15px_rgba(255,0,0,0.3)]"
                >
                  {t.execute}
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {step === 'auth' && (
          <motion.div
            key="auth"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="flex flex-col items-center justify-center min-h-screen p-4 z-10"
          >
            <div className="absolute top-4 right-4 flex gap-2">
              {Object.keys(translations).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l as any)}
                  className={cn(
                    "px-2 py-1 text-[10px] border border-cyan-900 uppercase font-bold transition-all",
                    lang === l ? "bg-cyan-600 text-black" : "bg-black text-cyan-600 hover:bg-zinc-900"
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
            <div className="w-full max-w-md p-8 bg-black border-2 border-cyan-600 rounded-none shadow-[0_0_40px_rgba(0,255,255,0.2)]">
              <div className="flex justify-center mb-6">
                <Terminal className="w-16 h-16 text-cyan-500 animate-pulse" />
              </div>
              <h2 className="text-2xl font-black text-center mb-8 uppercase italic tracking-tighter text-cyan-500">{t.id_required}</h2>
              
              <form onSubmit={handleLoginSubmit} className="space-y-4 mb-6">
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder={t.google_email}
                  className="w-full px-5 py-3 bg-zinc-950 border border-cyan-900 focus:border-cyan-500 focus:outline-none text-white placeholder:text-cyan-950"
                />
                <input
                  type="password"
                  required
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  placeholder={t.password}
                  className="w-full px-5 py-3 bg-zinc-950 border border-cyan-900 focus:border-cyan-500 focus:outline-none text-white placeholder:text-cyan-950"
                />
                <button
                  type="submit"
                  className="w-full py-3 bg-cyan-600 text-black font-black uppercase hover:bg-cyan-500 transition-all border-b-4 border-cyan-900 shadow-[0_0_15px_rgba(0,255,255,0.2)]"
                >
                  {t.sign_in}
                </button>
              </form>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-cyan-900/50"></div></div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold"><span className="bg-black px-2 text-cyan-900">{t.or}</span></div>
              </div>

              <button
                onClick={handleGuestLogin}
                className="w-full flex items-center justify-center gap-3 py-3 bg-zinc-950 text-emerald-500 font-black uppercase hover:bg-zinc-900 transition-all border border-emerald-900 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
              >
                <Ghost className="w-5 h-5" />
                {t.guest}
              </button>
            </div>
          </motion.div>
        )}

        {step === 'chat' && (
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex h-screen z-10 overflow-hidden"
          >
            {/* Sidebar */}
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.aside
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 280, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="bg-zinc-950 border-r-2 border-red-900 flex flex-col h-full z-20"
                >
                  <div className="p-4 border-b border-red-900/50">
                    <button
                      onClick={createNewChat}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-red-600/10 border border-red-600 text-red-500 font-black uppercase hover:bg-red-600 hover:text-black transition-all"
                    >
                      <Zap className="w-4 h-4" />
                      {t.new_chat}
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-hide">
                    <div className="flex items-center justify-between px-3 py-2">
                      <p className="text-[10px] font-black text-red-900 uppercase tracking-widest">{t.chats}</p>
                      {!user?.isGuest && (
                        <button 
                          onClick={loadSessions}
                          className="text-red-900 hover:text-red-500 transition-colors"
                        >
                          <RefreshCw className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    {user?.isGuest ? (
                      <div className="px-4 py-3 text-xs font-bold border-l-2 border-emerald-500 bg-emerald-500/10 text-emerald-500">
                        {lang === 'ar' ? 'جلسة ضيف (مؤقتة)' : 'Guest Session (Temp)'}
                      </div>
                    ) : (
                      <>
                        {sessions.length === 0 && (
                          <p className="px-3 py-4 text-[10px] text-red-950 text-center italic">{t.no_chats}</p>
                        )}
                        {sessions.map((s) => (
                          <div
                            key={s.id}
                            onClick={() => setCurrentSessionId(s.id)}
                            className={cn(
                              "group w-full flex items-center justify-between px-4 py-3 text-xs font-bold transition-all border-l-2 cursor-pointer",
                              currentSessionId === s.id 
                                ? "bg-red-600/10 border-red-500 text-white" 
                                : "border-transparent text-red-900 hover:bg-zinc-900 hover:text-red-500"
                            )}
                          >
                            <span className="truncate flex-1">{s.title}</span>
                            <button
                              onClick={(e) => deleteSession(e, s.id)}
                              className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </>
                    )}
                  </div>

                  <div className="p-4 border-t border-red-900/50">
                    <div className="flex items-center gap-3 px-3 py-2 bg-black border border-red-900/30">
                      <div className="w-8 h-8 bg-red-950 flex items-center justify-center border border-red-600">
                        <UserIcon className="w-4 h-4 text-red-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black text-white truncate uppercase">{user?.name}</p>
                        <p className="text-[8px] text-red-900 truncate uppercase">Level: Elite</p>
                      </div>
                    </div>
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>

            <div className="flex-1 flex flex-col h-full relative">
              {/* Header */}
              <header className="flex items-center justify-between px-6 py-4 bg-black border-b-2 border-red-600 shadow-[0_5px_25px_rgba(255,0,0,0.2)] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse" />
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 hover:bg-zinc-900 text-red-500 transition-all"
                  >
                    <Terminal className="w-5 h-5" />
                  </button>
                  <div className="w-10 h-10 bg-red-600 flex items-center justify-center border-2 border-red-900 shadow-[0_0_15px_rgba(255,0,0,0.3)]">
                    <Skull className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h1 className="font-black text-xl italic tracking-tighter uppercase leading-none text-red-500">{t.title}</h1>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                      <span className="text-[8px] text-emerald-500 uppercase tracking-[0.2em] font-black">{t.online}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex gap-1 mr-4">
                    {Object.keys(translations).map((l) => (
                      <button
                        key={l}
                        onClick={() => setLang(l as any)}
                        className={cn(
                          "px-1.5 py-0.5 text-[8px] border border-red-900 uppercase font-bold transition-all",
                          lang === l ? "bg-red-600 text-black" : "bg-black text-red-600 hover:bg-zinc-900"
                        )}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 bg-red-950/30 text-red-600 hover:bg-red-600 hover:text-black transition-all border border-red-900 shadow-[0_0_10px_rgba(255,0,0,0.2)]"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </header>

              {/* Chat Area */}
              <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-hide">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center opacity-20">
                  <Terminal className="w-24 h-24 mb-4 animate-pulse" />
                  <p className="text-2xl font-black uppercase tracking-widest italic">{t.waiting}</p>
                </div>
              )}
              
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    "flex w-full",
                    msg.role === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  <div className={cn(
                    "max-w-[85%] sm:max-w-[75%] p-4 border-2 text-xs sm:text-sm leading-relaxed shadow-[0_0_20px_rgba(0,0,0,0.8)] relative overflow-hidden",
                    msg.role === 'user' 
                      ? "bg-zinc-900 text-white border-emerald-500 rounded-tr-none" 
                      : "bg-zinc-950 border-red-600 text-white rounded-tl-none"
                  )}>
                    <div className={cn(
                      "absolute top-0 left-0 w-full h-[2px] opacity-30",
                      msg.role === 'user' ? "bg-emerald-500" : "bg-red-500"
                    )} />
                    {msg.image && (
                      <div className="mb-3">
                        <img 
                          src={msg.image} 
                          alt="Uploaded/Generated" 
                          className="max-w-full rounded-lg border border-red-900/50"
                        />
                      </div>
                    )}
                    <div className="prose prose-invert prose-red max-w-none">
                      <Markdown>{msg.text}</Markdown>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-black border-2 border-red-600 p-4 flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin text-red-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{t.decrypting}</span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </main>

            {/* Input Area */}
            <footer className="p-4 sm:p-6 bg-black border-t-2 border-red-600">
              {selectedImage && (
                <div className="max-w-5xl mx-auto mb-4 relative inline-block">
                  <img src={selectedImage} className="h-20 w-20 object-cover rounded-lg border-2 border-red-600" alt="Preview" />
                  <button 
                    onClick={() => setSelectedImage(null)}
                    className="absolute -top-2 -right-2 bg-red-600 text-black rounded-full p-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              
              <form 
                onSubmit={handleSendMessage}
                className="max-w-5xl mx-auto relative flex gap-2"
              >
                <div className="relative flex-1">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                    <span className="text-red-900 text-xs font-bold">CMD{">"}</span>
                  </div>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t.placeholder}
                    className="w-full pl-16 pr-4 py-4 bg-zinc-950 border border-red-900 focus:border-red-500 focus:outline-none transition-all text-red-500 placeholder:text-red-950"
                    dir={lang === 'ar' ? 'rtl' : 'ltr'}
                  />
                </div>
                
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                />
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-4 bg-zinc-950 border border-red-900 text-red-600 hover:bg-zinc-900 transition-all"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>

                <button
                  type="submit"
                  disabled={(!input.trim() && !selectedImage) || isLoading}
                  className="p-4 bg-red-600 text-black hover:bg-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                >
                  <Zap className="w-5 h-5" />
                </button>
              </form>
              <div className="flex justify-between items-center mt-4 px-2">
                <div className="flex gap-4">
                  <span className="text-[8px] text-emerald-500 font-black uppercase tracking-widest animate-pulse">{t.encryption}</span>
                  <span className="text-[8px] text-cyan-500 font-black uppercase tracking-widest animate-pulse">{t.multimodal}</span>
                  <span className="text-[8px] text-red-500 font-black uppercase tracking-widest animate-pulse">{t.status}</span>
                </div>
                <p className="text-[8px] text-red-900 font-black uppercase tracking-widest">
                  © 2026 HAKER ZAMROD • ALL RIGHTS RESERVED
                </p>
              </div>
            </footer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
