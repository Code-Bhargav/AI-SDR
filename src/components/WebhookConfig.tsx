import React, { useState, useEffect } from 'react';
import './WebhookConfig.css';

interface WebhookConfigProps {
  onUrlChange: (url: string) => void;
}

export const WebhookConfig: React.FC<WebhookConfigProps> = ({ onUrlChange }) => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Load from localStorage or environment variable
    const storedUrl = localStorage.getItem('n8n_webhook_url') || import.meta.env.VITE_N8N_WEBHOOK_URL || '';
    setWebhookUrl(storedUrl);
    if (storedUrl) {
      onUrlChange(storedUrl);
    }
  }, [onUrlChange]);

  const handleSave = () => {
    if (webhookUrl.trim()) {
      localStorage.setItem('n8n_webhook_url', webhookUrl.trim());
      onUrlChange(webhookUrl.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    const storedUrl = localStorage.getItem('n8n_webhook_url') || '';
    setWebhookUrl(storedUrl);
    setIsEditing(false);
  };

  if (!isEditing && webhookUrl) {
    return (
      <div className="webhook-config-display">
        <div className="webhook-info">
          <span className="webhook-label">N8N Webhook URL:</span>
          <code className="webhook-url">{webhookUrl}</code>
        </div>
        <button className="edit-button" onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </div>
    );
  }

  return (
    <div className="webhook-config">
      <label htmlFor="webhook-url" className="webhook-label">
        N8N Webhook URL
      </label>
      <div className="webhook-input-group">
        <input
          id="webhook-url"
          type="url"
          className="webhook-input"
          placeholder="https://your-n8n-instance.com/webhook/..."
          value={webhookUrl}
          onChange={(e) => setWebhookUrl(e.target.value)}
        />
        {isEditing ? (
          <div className="webhook-actions">
            <button className="save-button" onClick={handleSave}>
              Save
            </button>
            <button className="cancel-button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        ) : (
          <button className="save-button" onClick={handleSave}>
            Set URL
          </button>
        )}
      </div>
      <p className="webhook-hint">
        Enter your N8N webhook URL to send validated CSV data to your workflow
      </p>
    </div>
  );
};

