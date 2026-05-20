import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LegalModalProps {
  type: 'terms' | 'privacy';
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  const { i18n, t } = useTranslation();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      try {
        // Determine language (fallback to 'en' for unsupported languages)
        const lang = ['ru', 'en'].includes(i18n.language) ? i18n.language : 'en';
        const fileName = type === 'terms' ? `terms-${lang}.md` : `privacy-${lang}.md`;
        
        const response = await fetch(`/legal/${fileName}`);
        if (response.ok) {
          const text = await response.text();
          setContent(text);
        } else {
          // Fallback to English
          const fallbackResponse = await fetch(`/legal/${type === 'terms' ? 'terms-en.md' : 'privacy-en.md'}`);
          if (fallbackResponse.ok) {
            setContent(await fallbackResponse.text());
          } else {
            setContent(t('legal.load_error'));
          }
        }
      } catch (error) {
        console.error('Error loading legal document:', error);
        setContent(t('legal.load_error'));
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [type, i18n.language, t]);

  // Simple markdown to HTML converter for basic formatting
  const renderMarkdown = (text: string) => {
    return text
      // Headers
      .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-6 mb-2">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-8 mb-3">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
      // Bold
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Horizontal rule
      .replace(/^---$/gm, '<hr class="my-4 border-t opacity-20" />')
      // List items
      .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
      // Paragraphs
      .replace(/\n\n/g, '</p><p class="mb-4">')
      // Line breaks
      .replace(/  \n/g, '<br />');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-2xl max-h-[85vh] rounded-2xl shadow-xl overflow-hidden bg-bg">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b bg-bg border-border/10">
          <h2 className="text-lg font-semibold text-text-primary">
            {type === 'terms' ? t('legal.terms_of_use') : t('legal.privacy_policy')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full transition-colors hover:bg-border/10 text-text-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-80px)] text-text-secondary">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
            </div>
          ) : (
            <div 
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: `<p class="mb-4">${renderMarkdown(content)}</p>` }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
