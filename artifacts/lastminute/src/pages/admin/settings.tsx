import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Settings, Key, CheckCircle, AlertCircle, Eye, EyeOff, Save, Trash2, RefreshCw, Brain, Zap, Info } from "lucide-react";
import { Link } from "wouter";

const API_BASE = import.meta.env.VITE_API_URL || "";

interface SettingStatus {
  gigachat: boolean;
  levelTravel: boolean;
}

interface SaveState {
  status: "idle" | "saving" | "saved" | "error";
  message?: string;
}

function useAdminSettings() {
  const [status, setStatus] = useState<SettingStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const loadStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/settings/status`);
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const saveSetting = async (key: string, value: string) => {
    const res = await fetch(`${API_BASE}/api/admin/settings/${key}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to save");
    }
    await loadStatus();
  };

  const deleteSetting = async (key: string) => {
    const res = await fetch(`${API_BASE}/api/admin/settings/${key}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete");
    await loadStatus();
  };

  return { status, loading, loadStatus, saveSetting, deleteSetting };
}

function SettingCard({
  title,
  description,
  hint,
  settingKey,
  isConfigured,
  onSave,
  onDelete,
}: {
  title: string;
  description: string;
  hint: string;
  settingKey: string;
  isConfigured: boolean;
  onSave: (key: string, value: string) => Promise<void>;
  onDelete: (key: string) => Promise<void>;
}) {
  const [value, setValue] = useState("");
  const [showValue, setShowValue] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>({ status: "idle" });
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSave = async () => {
    if (!value.trim()) return;
    setSaveState({ status: "saving" });
    try {
      await onSave(settingKey, value.trim());
      setValue("");
      setSaveState({ status: "saved", message: "Сохранено успешно" });
      setTimeout(() => setSaveState({ status: "idle" }), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Ошибка сохранения";
      setSaveState({ status: "error", message });
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    try {
      await onDelete(settingKey);
      setConfirmDelete(false);
    } catch {
      // ignore
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-border p-6 md:p-8">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h3 className="font-bold text-lg mb-1">{title}</h3>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shrink-0 ${
          isConfigured
            ? "bg-emerald-100 text-emerald-700"
            : "bg-slate-100 text-slate-500"
        }`}>
          {isConfigured ? (
            <><CheckCircle className="w-3.5 h-3.5" /> Настроен</>
          ) : (
            <><AlertCircle className="w-3.5 h-3.5" /> Не настроен</>
          )}
        </div>
      </div>

      <div className="bg-slate-50 rounded-2xl p-4 mb-5 flex items-start gap-2 text-sm text-slate-600">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <span>{hint}</span>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type={showValue ? "text" : "password"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={isConfigured ? "Введите новый ключ для обновления..." : "Вставьте ключ API..."}
            className="w-full pl-11 pr-12 py-3 rounded-xl border border-border bg-white focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm"
          />
          <button
            type="button"
            onClick={() => setShowValue(!showValue)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showValue ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={!value.trim() || saveState.status === "saving"}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saveState.status === "saving" ? (
              <><RefreshCw className="w-4 h-4 animate-spin" /> Сохранение...</>
            ) : saveState.status === "saved" ? (
              <><CheckCircle className="w-4 h-4" /> Сохранено!</>
            ) : (
              <><Save className="w-4 h-4" /> Сохранить</>
            )}
          </button>

          {isConfigured && (
            <button
              onClick={handleDelete}
              className={`px-4 py-3 rounded-xl font-bold text-sm transition-colors flex items-center gap-1.5 ${
                confirmDelete
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-red-50 text-red-600 hover:bg-red-100"
              }`}
            >
              <Trash2 className="w-4 h-4" />
              {confirmDelete ? "Точно удалить?" : "Удалить"}
            </button>
          )}
        </div>

        {saveState.status === "error" && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            {saveState.message}
          </div>
        )}
        {confirmDelete && (
          <div className="flex items-center justify-between bg-red-50 rounded-xl p-3 text-sm">
            <span className="text-red-700">Ключ будет удалён и сервис перестанет работать.</span>
            <button onClick={() => setConfirmDelete(false)} className="text-slate-500 hover:text-slate-700 font-medium">
              Отмена
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminSettings() {
  const { status, loading, loadStatus, saveSetting, deleteSetting } = useAdminSettings();
  const [loaded, setLoaded] = useState(false);

  if (!loaded) {
    loadStatus();
    setLoaded(true);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20">
        {/* Header */}
        <section className="bg-slate-900 py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full text-sm font-bold mb-6">
              <Settings className="w-4 h-4" />
              Панель управления
            </div>
            <h1 className="text-4xl font-display font-bold text-white mb-3">Настройки сервиса</h1>
            <p className="text-slate-400">
              Управление API-ключами для GigaChat Pro и Level.Travel
            </p>
          </div>
        </section>

        <section className="py-14 bg-slate-50">
          <div className="max-w-4xl mx-auto px-4">

            {loading ? (
              <div className="text-center py-12 text-muted-foreground">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 opacity-40" />
                Загрузка статуса...
              </div>
            ) : (
              <div className="space-y-6">
                {/* Status overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className={`rounded-2xl p-5 border flex items-center gap-4 ${
                    status?.gigachat ? "bg-emerald-50 border-emerald-200" : "bg-white border-border"
                  }`}>
                    <div className={`p-3 rounded-xl ${status?.gigachat ? "bg-emerald-100" : "bg-slate-100"}`}>
                      <Brain className={`w-6 h-6 ${status?.gigachat ? "text-emerald-600" : "text-slate-400"}`} />
                    </div>
                    <div>
                      <div className="font-bold text-sm">GigaChat Pro</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {status?.gigachat ? "Подключён — AI-описания активны" : "Не настроен — используется резервная копия"}
                      </div>
                    </div>
                  </div>
                  <div className={`rounded-2xl p-5 border flex items-center gap-4 ${
                    status?.levelTravel ? "bg-emerald-50 border-emerald-200" : "bg-white border-border"
                  }`}>
                    <div className={`p-3 rounded-xl ${status?.levelTravel ? "bg-emerald-100" : "bg-slate-100"}`}>
                      <Zap className={`w-6 h-6 ${status?.levelTravel ? "text-emerald-600" : "text-slate-400"}`} />
                    </div>
                    <div>
                      <div className="font-bold text-sm">Level.Travel API</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {status?.levelTravel ? "Подключён — реальные туры" : "Не настроен — используются тестовые данные"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* GigaChat key */}
                <SettingCard
                  title="GigaChat Pro API"
                  description="Нейросеть от Сбера для генерации описаний туров. При наличии ключа — приоритет над OpenAI."
                  hint='Получите ключ в личном кабинете developers.sber.ru → GigaChat → API Credentials. Скопируйте значение "Авторизационные данные" (Base64 строка вида client_id:client_secret).'
                  settingKey="GIGACHAT_KEY"
                  isConfigured={status?.gigachat ?? false}
                  onSave={saveSetting}
                  onDelete={deleteSetting}
                />

                {/* Level.Travel token */}
                <SettingCard
                  title="Level.Travel API Token"
                  description="Токен доступа к реальной базе горящих туров Level.Travel. Без него используются демо-данные."
                  hint="Получите партнёрский токен на сайте level.travel/partners. После подключения сервис будет показывать реальные туры от 60+ туроператоров."
                  settingKey="LEVEL_TRAVEL_TOKEN"
                  isConfigured={status?.levelTravel ?? false}
                  onSave={saveSetting}
                  onDelete={deleteSetting}
                />

                {/* Refresh */}
                <div className="text-center pt-4">
                  <button
                    onClick={loadStatus}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Обновить статус
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Docs section */}
        <section className="py-14 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">Документация</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Как получить ключ GigaChat Pro",
                  steps: [
                    "Зарегистрируйтесь на developers.sber.ru",
                    "Создайте проект → выберите GigaChat API",
                    "Перейдите в раздел API Credentials",
                    'Скопируйте значение "Авторизационные данные"',
                    "Вставьте его в поле выше и сохраните",
                  ],
                },
                {
                  title: "Как получить токен Level.Travel",
                  steps: [
                    "Подайте заявку на level.travel/partners",
                    "Дождитесь подтверждения (1–3 рабочих дня)",
                    "В личном кабинете найдите API Token",
                    "Скопируйте и вставьте токен выше",
                    "После сохранения сервис перейдёт на реальные данные",
                  ],
                },
              ].map((doc) => (
                <div key={doc.title} className="bg-slate-50 rounded-2xl p-6">
                  <h3 className="font-bold mb-4 text-sm">{doc.title}</h3>
                  <ol className="space-y-2">
                    {doc.steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <span className="w-5 h-5 bg-primary/10 text-primary rounded-full text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-10 bg-primary">
          <div className="text-center">
            <Link href="/" className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-2xl font-bold hover:bg-white/90 transition-colors text-sm">
              ← Вернуться на главную
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
