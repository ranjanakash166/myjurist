import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface DocumentEdit {
  id: string;
  type: 'insert' | 'delete' | 'format' | 'replace';
  position: number;
  content: string;
  timestamp: number;
  description: string;
}

export interface DocumentState {
  content: string;
  originalContent: string;
  edits: DocumentEdit[];
  currentEditIndex: number;
  isDirty: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface DocumentEditorStore extends DocumentState {
  // Content management
  setContent: (content: string) => void;
  updateContent: (newContent: string, description?: string) => void;
  resetContent: () => void;
  
  // Edit tracking
  addEdit: (edit: Omit<DocumentEdit, 'id' | 'timestamp'>) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  
  // State management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Chat integration
  applyAISuggestion: (suggestion: string, description: string) => void;
}

export const useDocumentEditorStore = create<DocumentEditorStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      content: '',
      originalContent: '',
      edits: [],
      currentEditIndex: -1,
      isDirty: false,
      isLoading: false,
      error: null,

      // Content management
      setContent: (content: string) => {
        set({
          content,
          originalContent: content,
          edits: [],
          currentEditIndex: -1,
          isDirty: false,
          error: null
        });
      },

      updateContent: (newContent: string, description = 'Content updated') => {
        const { content, edits, currentEditIndex } = get();
        
        // Create new edit
        const edit: DocumentEdit = {
          id: `edit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'replace',
          position: 0,
          content: newContent,
          timestamp: Date.now(),
          description
        };

        // Remove any edits after current index (when redoing and then making new edit)
        const newEdits = edits.slice(0, currentEditIndex + 1);
        newEdits.push(edit);

        set({
          content: newContent,
          edits: newEdits,
          currentEditIndex: newEdits.length - 1,
          isDirty: newContent !== get().originalContent
        });
      },

      resetContent: () => {
        const { originalContent } = get();
        set({
          content: originalContent,
          edits: [],
          currentEditIndex: -1,
          isDirty: false,
          error: null
        });
      },

      // Edit tracking
      addEdit: (editData) => {
        const { content, edits, currentEditIndex } = get();
        
        const edit: DocumentEdit = {
          ...editData,
          id: `edit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now()
        };

        // Remove any edits after current index
        const newEdits = edits.slice(0, currentEditIndex + 1);
        newEdits.push(edit);

        set({
          edits: newEdits,
          currentEditIndex: newEdits.length - 1,
          isDirty: true
        });
      },

      undo: () => {
        const { currentEditIndex, edits } = get();
        
        if (currentEditIndex >= 0) {
          const newIndex = currentEditIndex - 1;
          let newContent = get().originalContent;
          
          // Replay edits up to new index
          for (let i = 0; i <= newIndex; i++) {
            const edit = edits[i];
            // Apply edit logic here (simplified for now)
            newContent = edit.content;
          }
          
          set({
            currentEditIndex: newIndex,
            content: newContent,
            isDirty: newContent !== get().originalContent
          });
        }
      },

      redo: () => {
        const { currentEditIndex, edits } = get();
        
        if (currentEditIndex < edits.length - 1) {
          const newIndex = currentEditIndex + 1;
          const edit = edits[newIndex];
          
          set({
            currentEditIndex: newIndex,
            content: edit.content,
            isDirty: edit.content !== get().originalContent
          });
        }
      },

      canUndo: () => {
        return get().currentEditIndex >= 0;
      },

      canRedo: () => {
        return get().currentEditIndex < get().edits.length - 1;
      },

      // State management
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },

      // Chat integration
      applyAISuggestion: (suggestion: string, description: string) => {
        get().updateContent(suggestion, `AI Suggestion: ${description}`);
      }
    }),
    {
      name: 'document-editor-store'
    }
  )
);
