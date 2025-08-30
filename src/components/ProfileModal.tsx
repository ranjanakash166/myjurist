import { useEffect, useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { useAuth } from './AuthProvider';
import {
  fetchUserProfile,
  UserProfile,
  formatDate,
  fetchAvailableModels,
  AvailableModelsResponse,
  updatePreferences,
} from '@/lib/dashboardApi';
import { Loader2, User as UserIcon, Mail, CheckCircle2, XCircle, Bot, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProfileModal({ open, onOpenChange }: ProfileModalProps) {
  const { getAuthHeaders, refreshToken } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // For editing provider/model
  const [editing, setEditing] = useState(false);
  const [available, setAvailable] = useState<AvailableModelsResponse | null>(null);
  const [editProvider, setEditProvider] = useState<string>('');
  const [editModel, setEditModel] = useState<string>('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);

  // Fetch profile and available models on open
  useEffect(() => {
    if (open) {
      setLoading(true);
      setError(null);
      setUpdateSuccess(null);
      fetchUserProfile(getAuthHeaders(), getAuthHeaders, refreshToken)
        .then(setProfile)
        .catch((err) => setError(err.message || 'Failed to load profile'))
        .finally(() => setLoading(false));
      fetchAvailableModels(getAuthHeaders(), getAuthHeaders, refreshToken)
        .then(setAvailable)
        .catch(() => {});
    } else {
      setProfile(null);
      setError(null);
      setEditing(false);
      setAvailable(null);
      setUpdateError(null);
      setUpdateSuccess(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // When editing, set initial values
  useEffect(() => {
    if (editing && profile && available) {
      setEditProvider(profile.preferred_ai_provider || available.current_provider || '');
      setEditModel(profile.preferred_model || available.current_model || '');
    }
  }, [editing, profile, available]);

  // Filter models for selected provider
  const providerOptions = useMemo(() => {
    if (!available) return [];
    return Array.from(new Set(available.available_models.map((m) => m.provider)));
  }, [available]);

  const modelOptions = useMemo(() => {
    if (!available) return [];
    return available.available_models.filter((m) => m.provider === editProvider);
  }, [available, editProvider]);

  // When provider changes, reset model
  useEffect(() => {
    if (editing && modelOptions.length > 0) {
      setEditModel('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editProvider]);

  // Only show Save if both are selected and changed
  const canSave =
    editing &&
    editProvider &&
    editModel &&
    (editProvider !== (profile?.preferred_ai_provider || '') || editModel !== (profile?.preferred_model || ''));

  // Handle update
  const handleSave = async () => {
    if (!editProvider || !editModel) return;
    setUpdateLoading(true);
    setUpdateError(null);
    try {
      const res = await updatePreferences(getAuthHeaders(), {
        preferred_ai_provider: editProvider,
        preferred_model: editModel,
      }, getAuthHeaders, refreshToken);
      setUpdateSuccess('Preferences updated!');
      setEditing(false);
      // Refetch profile to update UI
      const updated = await fetchUserProfile(getAuthHeaders(), getAuthHeaders, refreshToken);
      setProfile(updated);
    } catch (err: any) {
      setUpdateError(err.message || 'Failed to update preferences');
    } finally {
      setUpdateLoading(false);
    }
  };

  // Avatar initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full animate-fade-in rounded-2xl p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-black dark:to-neutral-900 p-6 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-neutral-800 flex items-center justify-center mb-2 border-4 border-neutral-700 shadow-lg">
            <UserIcon className="w-10 h-10 text-neutral-300" />
          </div>
          <div className="text-neutral-100 text-xl font-bold mb-1">{profile?.full_name || ''}</div>
          <div className="text-neutral-400 text-sm flex items-center gap-1">
            <Mail className="w-4 h-4 inline-block mr-1 text-neutral-500" />
            {profile?.email}
          </div>
        </div>
        <div className="bg-white dark:bg-black p-6">
          {loading ? (
            <div className="py-8 text-center text-muted-foreground animate-pulse">Loading profile...</div>
          ) : error ? (
            <div className="py-8 text-center text-red-500">{error}</div>
          ) : profile ? (
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold border ${profile.is_active ? 'border-neutral-400 bg-neutral-100 text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200' : 'border-neutral-400 bg-neutral-50 text-neutral-400 dark:bg-neutral-900 dark:text-neutral-500'}`}>{profile.is_active ? 'Active' : 'Inactive'}</span>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold border ${profile.is_verified ? 'border-neutral-400 bg-neutral-100 text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200' : 'border-neutral-400 bg-neutral-50 text-neutral-400 dark:bg-neutral-900 dark:text-neutral-500'}`}>{profile.is_verified ? 'Verified' : 'Not Verified'}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Account Created: {formatDate(profile.created_at)}
                </div>
              </div>
              <div className="border-t border-dashed border-neutral-300 dark:border-neutral-700 my-4" />
              {/* Editable Preferred AI Provider & Model */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Bot className="w-4 h-4 text-neutral-500" />
                  <span className="block text-xs text-muted-foreground">Preferred AI Provider & Model</span>
                </div>
                {editing && available ? (
                  <div className="flex flex-col gap-2 mt-2 bg-neutral-50 dark:bg-neutral-900 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800">
                    <div className="flex gap-2 items-center">
                      <select
                        className="border rounded px-2 py-1 text-sm bg-white dark:bg-black text-neutral-900 dark:text-neutral-100"
                        value={editProvider}
                        onChange={e => setEditProvider(e.target.value)}
                      >
                        <option value="" disabled>Select provider</option>
                        {providerOptions.map((provider) => (
                          <option key={provider} value={provider}>{provider}</option>
                        ))}
                      </select>
                      <select
                        className="border rounded px-2 py-1 text-sm bg-white dark:bg-black text-neutral-900 dark:text-neutral-100"
                        value={editModel}
                        onChange={e => setEditModel(e.target.value)}
                        disabled={!editProvider}
                      >
                        <option value="" disabled>Select model</option>
                        {modelOptions.map((model) => (
                          <option key={model.model_name} value={model.model_name}>{model.display_name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-2 justify-end mt-2">
                      <Button size="sm" variant="outline" onClick={() => setEditing(false)} disabled={updateLoading}>Cancel</Button>
                      {canSave && (
                        <Button size="sm" onClick={handleSave} disabled={updateLoading || !editProvider || !editModel}>
                          {updateLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2 inline" /> : null}Save
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="block text-sm font-medium">
                      <span className="inline-flex items-center gap-1">
                        <Settings2 className="w-4 h-4 text-neutral-500" />
                        {profile.preferred_ai_provider || '-'}
                      </span>
                      <span className="mx-2 text-neutral-400">/</span>
                      <span className="inline-flex items-center gap-1">
                        <Bot className="w-4 h-4 text-neutral-500" />
                        {profile.preferred_model || '-'}
                      </span>
                    </span>
                    <Button size="sm" variant="ghost" onClick={() => setEditing(true)}>Edit</Button>
                  </div>
                )}
              </div>
              {updateError && <div className="text-red-500 text-sm mt-2">{updateError}</div>}
              {updateSuccess && <div className="text-green-600 text-sm mt-2 flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />{updateSuccess}</div>}
              <div className="pt-4 text-right">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Close
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
} 