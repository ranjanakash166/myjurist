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
import { Loader2 } from 'lucide-react';

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProfileModal({ open, onOpenChange }: ProfileModalProps) {
  const { getAuthHeaders } = useAuth();
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
      fetchUserProfile(getAuthHeaders())
        .then(setProfile)
        .catch((err) => setError(err.message || 'Failed to load profile'))
        .finally(() => setLoading(false));
      fetchAvailableModels(getAuthHeaders())
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
      });
      setUpdateSuccess('Preferences updated!');
      setEditing(false);
      // Refetch profile to update UI
      const updated = await fetchUserProfile(getAuthHeaders());
      setProfile(updated);
    } catch (err: any) {
      setUpdateError(err.message || 'Failed to update preferences');
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
          <DialogDescription>View and edit your account details</DialogDescription>
        </DialogHeader>
        {loading ? (
          <div className="py-8 text-center text-muted-foreground animate-pulse">Loading profile...</div>
        ) : error ? (
          <div className="py-8 text-center text-red-500">{error}</div>
        ) : profile ? (
          <div className="space-y-4">
            <div>
              <span className="block text-xs text-muted-foreground">Full Name</span>
              <span className="block font-medium text-lg">{profile.full_name}</span>
            </div>
            <div>
              <span className="block text-xs text-muted-foreground">Email</span>
              <span className="block font-mono text-base">{profile.email}</span>
            </div>
            <div className="flex gap-4">
              <div>
                <span className="block text-xs text-muted-foreground">Active</span>
                <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${profile.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{profile.is_active ? 'Yes' : 'No'}</span>
              </div>
              <div>
                <span className="block text-xs text-muted-foreground">Verified</span>
                <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${profile.is_verified ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{profile.is_verified ? 'Yes' : 'No'}</span>
              </div>
            </div>
            <div>
              <span className="block text-xs text-muted-foreground">Account Created</span>
              <span className="block text-sm">{formatDate(profile.created_at)}</span>
            </div>
            {/* Editable Preferred AI Provider & Model */}
            <div>
              <span className="block text-xs text-muted-foreground">Preferred AI Provider & Model</span>
              {editing && available ? (
                <div className="flex flex-col gap-2 mt-1">
                  <div className="flex gap-2 items-center">
                    <select
                      className="border rounded px-2 py-1 text-sm"
                      value={editProvider}
                      onChange={e => setEditProvider(e.target.value)}
                    >
                      <option value="" disabled>Select provider</option>
                      {providerOptions.map((provider) => (
                        <option key={provider} value={provider}>{provider}</option>
                      ))}
                    </select>
                    <select
                      className="border rounded px-2 py-1 text-sm"
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
                  <div className="flex gap-2 justify-end">
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
                  <span className="block text-sm">{profile.preferred_ai_provider || '-'} / {profile.preferred_model || '-'}</span>
                  <Button size="sm" variant="ghost" onClick={() => setEditing(true)}>Edit</Button>
                </div>
              )}
            </div>
            {updateError && <div className="text-red-500 text-sm">{updateError}</div>}
            {updateSuccess && <div className="text-green-600 text-sm">{updateSuccess}</div>}
            <div className="pt-2 text-right">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
} 