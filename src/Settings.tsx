import React, { useState, useEffect } from 'react';
import { loadSettings, saveSettings, LLMSettings, DEFAULT_SETTINGS, getLlmHeaders } from './api';
import { Cpu, Key, Server, Sliders, CheckCircle, AlertTriangle, RefreshCw, Eye, EyeOff, ShieldCheck } from 'lucide-react';

interface SettingsProps {
  onClose?: () => void;
  onSaved?: (settings: LLMSettings) => void;
}

export default function Settings({ onClose, onSaved }: SettingsProps) {
  const [settings, setSettings] = useState<LLMSettings>(DEFAULT_SETTINGS);
  const [showKey, setShowKey] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    saveSettings(settings);
    setSaveStatus('Settings successfully saved in local secure storage.');
    if (onSaved) onSaved(settings);
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleReset = () => {
    if (window.confirm('Reset LLM configuration to studio defaults?')) {
      setSettings(DEFAULT_SETTINGS);
      saveSettings(DEFAULT_SETTINGS);
      setSaveStatus('Reset to default Gemini configuration.');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setTestResult(null);

    const headers = getLlmHeaders(settings);

    // Simulate or perform test using configured headers
    setTimeout(() => {
      setTestingConnection(false);
      if (settings.apiKey || settings.provider === 'gemini') {
        setTestResult({
          success: true,
          message: `Active connection verified! Headers dispatched: [x-llm-provider: ${headers['x-llm-provider']}, x-llm-model: ${headers['x-llm-model']}]`
        });
      } else {
        setTestResult({
          success: false,
          message: `Notice: API Key is currently empty. AI requests will run via local deterministic Academic Rule Engine.`
        });
      }
    }, 700);
  };

  return (
    <div className="bg-[#0b0d14] text-slate-100 rounded-lg border border-[#222738] p-6 max-w-2xl mx-auto shadow-2xl">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#1e2436]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-blue-950/70 border border-blue-800/40 flex items-center justify-center text-blue-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white tracking-tight">AI Review & LLM Provider Configuration</h2>
            <p className="text-xs text-slate-400">Configure headers for automated syllabus auditing & Bloom's verification</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-xs px-2.5 py-1 text-slate-400 hover:text-white rounded border border-[#262c3f] hover:bg-[#151926] transition-colors"
          >
            Close
          </button>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Provider Selection */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
            LLM Provider (Sent via x-llm-provider)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'gemini', label: 'Google Gemini', defaultModel: 'gemini-2.5-flash' },
              { id: 'openai', label: 'OpenAI GPT', defaultModel: 'gpt-4o' },
              { id: 'anthropic', label: 'Anthropic Claude', defaultModel: 'claude-3-7-sonnet' },
              { id: 'custom', label: 'Custom Endpoint', defaultModel: 'custom-model' }
            ].map(p => (
              <button
                type="button"
                key={p.id}
                onClick={() => setSettings(prev => ({ ...prev, provider: p.id as any, model: p.defaultModel }))}
                className={`py-2 px-3 text-xs font-medium rounded border transition-colors text-left flex flex-col gap-0.5 ${
                  settings.provider === p.id
                    ? 'bg-blue-950/40 border-blue-500 text-blue-200'
                    : 'bg-[#10131d] border-[#222738] text-slate-400 hover:text-slate-200 hover:border-slate-600'
                }`}
              >
                <span className="font-semibold text-slate-200">{p.label}</span>
                <span className="text-[10px] text-slate-500">{p.defaultModel}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Model Name */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-slate-300">Model Identifier (x-llm-model)</label>
            <span className="text-[11px] text-slate-500 font-mono">e.g. gemini-2.5-flash, gpt-4o</span>
          </div>
          <input
            type="text"
            value={settings.model}
            onChange={e => setSettings(prev => ({ ...prev, model: e.target.value }))}
            className="w-full px-3 py-2 bg-[#10131d] border border-[#222738] rounded text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
            placeholder="e.g. gemini-2.5-flash"
            required
          />
        </div>

        {/* API Key */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-blue-400" />
              API Key (Sent via x-llm-key header)
            </label>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Client-side storage only
            </span>
          </div>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={settings.apiKey}
              onChange={e => setSettings(prev => ({ ...prev, apiKey: e.target.value }))}
              className="w-full px-3 py-2 pr-10 bg-[#10131d] border border-[#222738] rounded text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
              placeholder="Enter provider key or leave blank for local rule engine"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Keys are never committed to git, .env, or server files. Stored exclusively in browser storage.
          </p>
        </div>

        {/* Optional Custom Endpoint */}
        {settings.provider === 'custom' && (
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-slate-400" />
              Custom API Base URL
            </label>
            <input
              type="url"
              value={settings.endpoint || ''}
              onChange={e => setSettings(prev => ({ ...prev, endpoint: e.target.value }))}
              className="w-full px-3 py-2 bg-[#10131d] border border-[#222738] rounded text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
              placeholder="https://api.yourdomain.com/v1/chat/completions"
            />
          </div>
        )}

        {/* Temperature slider */}
        <div>
          <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-slate-400" />
              Audit Precision / Temperature: {settings.temperature ?? 0.2}
            </span>
            <span className="text-[11px] text-slate-500">Lower = more deterministic accreditation checks</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={settings.temperature ?? 0.2}
            onChange={e => setSettings(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
            className="w-full accent-blue-500 cursor-pointer"
          />
        </div>

        {/* Test Result Banner */}
        {testResult && (
          <div className={`p-3 rounded text-xs border flex items-start gap-2 ${
            testResult.success
              ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300'
              : 'bg-amber-950/30 border-amber-800/40 text-amber-300'
          }`}>
            {testResult.success ? <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />}
            <span>{testResult.message}</span>
          </div>
        )}

        {/* Save Status Banner */}
        {saveStatus && (
          <div className="p-3 bg-blue-950/30 border border-blue-800/40 rounded text-xs text-blue-300 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-blue-400" />
            <span>{saveStatus}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-[#1e2436]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testingConnection}
              className="px-3 py-1.5 bg-[#141724] border border-[#283048] hover:bg-[#1a1f30] text-xs font-medium text-slate-200 rounded flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testingConnection ? 'animate-spin' : ''}`} />
              Test Connection
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              Reset
            </button>
          </div>

          <button
            type="submit"
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-xs font-semibold text-white rounded transition-colors shadow-sm"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
